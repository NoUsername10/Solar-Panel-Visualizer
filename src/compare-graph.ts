import {
  bridgeZeroToProductionGaps,
  downsampleSamples,
  filterSamplesByRangeHours,
  type PopupGraphRangeHours,
} from "./popup-graph";
import type { PowerSample } from "./types";

interface Point2D {
  x: number;
  y: number;
}

export interface CompareSeriesInput {
  id: string;
  samples: PowerSample[];
}

export interface CompareSeriesModel {
  id: string;
  samples: PowerSample[];
  points: Point2D[];
  linePath: string;
  firstPoint: Point2D | null;
  lastPoint: Point2D | null;
  sampleCount: number;
  pointsCount: number;
  firstTs: number | null;
  lastTs: number | null;
  minValue: number | null;
  maxValue: number | null;
}

export interface CompareGraphModel {
  startTs: number;
  endTs: number;
  hasData: boolean;
  drawableCount: number;
  series: CompareSeriesModel[];
}

const isFiniteSample = (sample: PowerSample): boolean =>
  Number.isFinite(sample.ts) && Number.isFinite(sample.value);

const buildPathFromPoints = (points: Point2D[]): string =>
  points
    .map((point, index) =>
      `${index === 0 ? "M" : "L"}${point.x.toFixed(2)},${point.y.toFixed(2)}`,
    )
    .join(" ");

export const buildCompareGraphModel = (
  inputSeries: CompareSeriesInput[],
  nowMs: number,
  range: PopupGraphRangeHours,
  maxPoints: number,
  width = 320,
  height = 132,
  padding = 10,
): CompareGraphModel => {
  const rangeMs = range * 60 * 60 * 1000;
  const startTs = nowMs - rangeMs;
  const endTs = nowMs;
  const xSpan = Math.max(endTs - startTs, 1);
  const plotWidth = Math.max(width - padding * 2, 1);
  const plotHeight = Math.max(height - padding * 2, 1);

  const normalizedSeries = inputSeries.map((entry) => {
    const filtered = filterSamplesByRangeHours(entry.samples, nowMs, range).filter(isFiniteSample);
    const expanded =
      filtered.length === 1
        ? [
            { ts: startTs, value: filtered[0].value },
            { ts: endTs, value: filtered[0].value },
          ]
        : filtered;
    const bridged = bridgeZeroToProductionGaps(expanded, { rangeHours: range });
    const downsampled = downsampleSamples(bridged, maxPoints).filter(isFiniteSample);

    const values = downsampled.map((sample) => sample.value);
    return {
      id: entry.id,
      samples: downsampled,
      sampleCount: downsampled.length,
      firstTs: downsampled.length > 0 ? downsampled[0].ts : null,
      lastTs: downsampled.length > 0 ? downsampled[downsampled.length - 1].ts : null,
      minValue: values.length > 0 ? Math.min(...values) : null,
      maxValue: values.length > 0 ? Math.max(...values) : null,
    };
  });

  const allValues = normalizedSeries.flatMap((entry) => entry.samples.map((sample) => sample.value));
  const hasData = allValues.length > 0;
  let yMin = 0;
  let yMax = 1;
  if (hasData) {
    yMin = Math.min(...allValues);
    yMax = Math.max(...allValues);
    if (yMin === yMax) {
      yMin -= 1;
      yMax += 1;
    }
  }
  const ySpan = Math.max(yMax - yMin, 1);

  const series: CompareSeriesModel[] = normalizedSeries.map((entry) => {
    const points = entry.samples
      .map((sample) => {
        const xRatio = (sample.ts - startTs) / xSpan;
        const x = padding + Math.min(Math.max(xRatio, 0), 1) * plotWidth;
        const y = height - padding - ((sample.value - yMin) / ySpan) * plotHeight;
        if (!Number.isFinite(x) || !Number.isFinite(y)) {
          return null;
        }
        return { x, y };
      })
      .filter((point): point is Point2D => point !== null);

    const linePath = points.length >= 2 ? buildPathFromPoints(points) : "";
    return {
      id: entry.id,
      samples: entry.samples,
      points,
      linePath,
      firstPoint: points.length > 0 ? points[0] : null,
      lastPoint: points.length > 0 ? points[points.length - 1] : null,
      sampleCount: entry.sampleCount,
      pointsCount: points.length,
      firstTs: entry.firstTs,
      lastTs: entry.lastTs,
      minValue: entry.minValue,
      maxValue: entry.maxValue,
    };
  });

  const drawableCount = series.filter((entry) => entry.pointsCount > 0).length;

  return {
    startTs,
    endTs,
    hasData,
    drawableCount,
    series,
  };
};
