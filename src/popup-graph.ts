import type { PowerSample } from "./types";

export type PopupGraphRangeHours = 1 | 6 | 24;

export interface PopupGraphModel {
  pointCount: number;
  linePath: string;
  areaPath: string;
  minValue: number | null;
  maxValue: number | null;
  startTs: number | null;
  endTs: number | null;
}

const isFiniteSample = (sample: PowerSample): boolean =>
  Number.isFinite(sample.ts) && Number.isFinite(sample.value);

const DEFAULT_ZERO_TOLERANCE = 0.0001;

const getDefaultBridgeStepMs = (rangeHours?: number): number => {
  if (rangeHours === 1) {
    return 60_000;
  }
  if (rangeHours === 6) {
    return 3 * 60_000;
  }
  if (rangeHours === 24) {
    return 10 * 60_000;
  }
  return 5 * 60_000;
};

export const filterSamplesByRangeHours = (
  samples: PowerSample[],
  nowMs: number,
  hours: number,
): PowerSample[] => {
  const threshold = nowMs - hours * 60 * 60 * 1000;
  return samples
    .filter(isFiniteSample)
    .filter((sample) => sample.ts >= threshold && sample.ts <= nowMs)
    .sort((a, b) => a.ts - b.ts);
};

export const bridgeZeroToProductionGaps = (
  samples: PowerSample[],
  options?: {
    zeroTolerance?: number;
    rangeHours?: number;
    stepMs?: number;
  },
): PowerSample[] => {
  if (samples.length < 2) {
    return [...samples].sort((a, b) => a.ts - b.ts);
  }

  const zeroTolerance = options?.zeroTolerance ?? DEFAULT_ZERO_TOLERANCE;

  const sorted = [...samples]
    .filter(isFiniteSample)
    .sort((a, b) => a.ts - b.ts);
  if (sorted.length < 2) {
    return sorted;
  }

  const diffs = sorted
    .slice(1)
    .map((sample, index) => sample.ts - sorted[index].ts)
    .filter((diff) => Number.isFinite(diff) && diff > 0)
    .sort((a, b) => a - b);
  const medianDiff =
    diffs.length > 0 ? diffs[Math.floor(diffs.length / 2)] : Number.NaN;
  const defaultStepMs = getDefaultBridgeStepMs(options?.rangeHours);
  const stepMs = Math.min(
    Math.max(
      Number.isFinite(options?.stepMs)
        ? (options?.stepMs as number)
        : Number.isFinite(medianDiff)
          ? medianDiff
          : defaultStepMs,
      30_000,
    ),
    defaultStepMs * 2,
  );
  const gapThresholdMs = stepMs * 2;

  const bridged: PowerSample[] = [sorted[0]];
  for (let index = 1; index < sorted.length; index += 1) {
    const previous = sorted[index - 1];
    const current = sorted[index];
    const gapMs = current.ts - previous.ts;
    const previousIsZero = Math.abs(previous.value) <= zeroTolerance;
    const currentIsProducing = current.value > zeroTolerance;

    if (previousIsZero && currentIsProducing && gapMs >= gapThresholdMs) {
      const bridgeTs = Math.max(previous.ts + 1, current.ts - stepMs);
      if (bridgeTs > previous.ts && bridgeTs < current.ts) {
        bridged.push({ ts: bridgeTs, value: 0 });
      }
    }

    bridged.push(current);
  }

  return bridged.filter((sample, index, array) =>
    index === 0 ? true : sample.ts !== array[index - 1].ts || sample.value !== array[index - 1].value,
  );
};

export const downsampleSamples = (
  samples: PowerSample[],
  maxPoints: number,
): PowerSample[] => {
  if (samples.length <= maxPoints || maxPoints <= 2) {
    return [...samples];
  }

  const first = samples[0];
  const last = samples[samples.length - 1];
  const interior = samples.slice(1, samples.length - 1);
  const interiorTarget = maxPoints - 2;
  const step = interior.length / interiorTarget;

  const picked: PowerSample[] = [first];
  let previousIndex = -1;
  for (let index = 0; index < interiorTarget; index += 1) {
    const interiorIndex = Math.min(
      interior.length - 1,
      Math.floor(index * step),
    );
    if (interiorIndex === previousIndex) {
      continue;
    }
    previousIndex = interiorIndex;
    picked.push(interior[interiorIndex]);
  }
  picked.push(last);

  return picked
    .sort((a, b) => a.ts - b.ts)
    .filter((sample, index, array) =>
      index === 0 ? true : sample.ts !== array[index - 1].ts || sample.value !== array[index - 1].value,
    )
    .slice(0, maxPoints);
};

export const aggregateStepwiseSamples = (
  sampleSets: PowerSample[][],
): PowerSample[] => {
  const normalizedSets = sampleSets
    .map((samples) =>
      [...samples]
        .filter(isFiniteSample)
        .sort((a, b) => a.ts - b.ts)
        .filter((sample, index, array) =>
          index === array.length - 1 ? true : sample.ts !== array[index + 1].ts,
        ),
    )
    .filter((samples) => samples.length > 0);

  if (normalizedSets.length === 0) {
    return [];
  }

  const timestamps = [
    ...new Set(normalizedSets.flatMap((samples) => samples.map((sample) => sample.ts))),
  ].sort((a, b) => a - b);
  const indexes = normalizedSets.map(() => 0);
  const latestValues = normalizedSets.map<number | null>(() => null);

  const aggregated: PowerSample[] = [];
  for (const ts of timestamps) {
    let knownCount = 0;
    for (let setIndex = 0; setIndex < normalizedSets.length; setIndex += 1) {
      const samples = normalizedSets[setIndex];
      while (
        indexes[setIndex] < samples.length &&
        samples[indexes[setIndex]].ts <= ts
      ) {
        latestValues[setIndex] = samples[indexes[setIndex]].value;
        indexes[setIndex] += 1;
      }
      if (latestValues[setIndex] !== null) {
        knownCount += 1;
      }
    }

    if (knownCount === 0) {
      continue;
    }

    const value = latestValues.reduce<number>(
      (sum, latest) => sum + (latest ?? 0),
      0,
    );
    aggregated.push({
      ts,
      value: Object.is(value, -0) ? 0 : value,
    });
  }

  return aggregated;
};

export const buildPopupGraphModel = (
  samples: PowerSample[],
  width: number,
  height: number,
  padding = 10,
): PopupGraphModel => {
  if (samples.length === 0) {
    return {
      pointCount: 0,
      linePath: "",
      areaPath: "",
      minValue: null,
      maxValue: null,
      startTs: null,
      endTs: null,
    };
  }

  const sorted = [...samples].sort((a, b) => a.ts - b.ts);
  const values = sorted.map((sample) => sample.value);
  let minValue = Math.min(...values);
  let maxValue = Math.max(...values);
  if (minValue === maxValue) {
    minValue -= 1;
    maxValue += 1;
  }

  const startTs = sorted[0].ts;
  const endTs = sorted[sorted.length - 1].ts;
  const xSpan = Math.max(endTs - startTs, 1);
  const ySpan = Math.max(maxValue - minValue, 1);
  const plotWidth = Math.max(width - padding * 2, 1);
  const plotHeight = Math.max(height - padding * 2, 1);

  const points = sorted.map((sample) => {
    const x = padding + ((sample.ts - startTs) / xSpan) * plotWidth;
    const y =
      height - padding - ((sample.value - minValue) / ySpan) * plotHeight;
    return { x, y };
  });

  const linePath = points
    .map((point, index) =>
      `${index === 0 ? "M" : "L"}${point.x.toFixed(2)},${point.y.toFixed(2)}`,
    )
    .join(" ");

  const first = points[0];
  const last = points[points.length - 1];
  const baselineY = height - padding;
  const areaPath = `${linePath} L${last.x.toFixed(2)},${baselineY.toFixed(2)} L${first.x.toFixed(
    2,
  )},${baselineY.toFixed(2)} Z`;

  return {
    pointCount: points.length,
    linePath,
    areaPath,
    minValue,
    maxValue,
    startTs,
    endTs,
  };
};
