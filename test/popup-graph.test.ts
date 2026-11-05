import { describe, expect, it } from "vitest";
import {
  aggregateStepwiseSamples,
  bridgeZeroToProductionGaps,
  buildPopupGraphModel,
  downsampleSamples,
  filterSamplesByRangeHours,
} from "../src/popup-graph";
import type { PowerSample } from "../src/types";

const sampleSeries = (count: number, nowMs: number): PowerSample[] =>
  Array.from({ length: count }, (_, index) => ({
    ts: nowMs - (count - 1 - index) * 60_000,
    value: index,
  }));

describe("filterSamplesByRangeHours", () => {
  it("filters samples inside the selected range", () => {
    const nowMs = Date.now();
    const samples: PowerSample[] = [
      { ts: nowMs - 8 * 60 * 60 * 1000, value: 100 },
      { ts: nowMs - 2 * 60 * 60 * 1000, value: 200 },
      { ts: nowMs - 30 * 60 * 1000, value: 250 },
    ];

    expect(filterSamplesByRangeHours(samples, nowMs, 1)).toHaveLength(1);
    expect(filterSamplesByRangeHours(samples, nowMs, 6)).toHaveLength(2);
    expect(filterSamplesByRangeHours(samples, nowMs, 24)).toHaveLength(3);
  });
});

describe("downsampleSamples", () => {
  it("preserves first and last samples", () => {
    const nowMs = Date.now();
    const samples = sampleSeries(300, nowMs);
    const downsampled = downsampleSamples(samples, 150);

    expect(downsampled.length).toBeLessThanOrEqual(150);
    expect(downsampled[0]).toEqual(samples[0]);
    expect(downsampled[downsampled.length - 1]).toEqual(samples[samples.length - 1]);
  });
});

describe("aggregateStepwiseSamples", () => {
  it("sums panel series by carrying each latest value forward", () => {
    const result = aggregateStepwiseSamples([
      [
        { ts: 1, value: 100 },
        { ts: 3, value: 140 },
      ],
      [
        { ts: 2, value: 50 },
        { ts: 4, value: 80 },
      ],
    ]);

    expect(result).toEqual([
      { ts: 1, value: 100 },
      { ts: 2, value: 150 },
      { ts: 3, value: 190 },
      { ts: 4, value: 220 },
    ]);
  });

  it("ignores empty panel series", () => {
    expect(
      aggregateStepwiseSamples([
        [],
        [
          { ts: 1, value: 25 },
          { ts: 2, value: 30 },
        ],
      ]),
    ).toEqual([
      { ts: 1, value: 25 },
      { ts: 2, value: 30 },
    ]);
  });

  it("sums cumulative energy-style series with the same latest-value carry", () => {
    const result = aggregateStepwiseSamples([
      [
        { ts: 1, value: 1.2 },
        { ts: 3, value: 1.8 },
      ],
      [
        { ts: 1, value: 0.5 },
        { ts: 2, value: 0.9 },
        { ts: 4, value: 1.1 },
      ],
    ]);

    expect(result.map((sample) => sample.ts)).toEqual([1, 2, 3, 4]);
    expect(result[0].value).toBeCloseTo(1.7);
    expect(result[1].value).toBeCloseTo(2.1);
    expect(result[2].value).toBeCloseTo(2.7);
    expect(result[3].value).toBeCloseTo(2.9);
  });
});

describe("bridgeZeroToProductionGaps", () => {
  it("inserts a pre-rise zero anchor for 0-to-production transitions with large gaps", () => {
    const nowMs = Date.now();
    const samples: PowerSample[] = [
      { ts: nowMs - 14 * 60 * 60 * 1000, value: 0 },
      { ts: nowMs - 4 * 60 * 60 * 1000, value: 12 },
      { ts: nowMs - 3 * 60 * 60 * 1000, value: 20 },
    ];

    const bridged = bridgeZeroToProductionGaps(samples, { rangeHours: 24 });

    expect(bridged.length).toBeGreaterThan(samples.length);
    const inserted = bridged.find(
      (sample) =>
        sample.ts > samples[0].ts && sample.ts < samples[1].ts && sample.value === 0,
    );
    expect(inserted).toBeDefined();
  });

  it("does not modify short normal intervals", () => {
    const nowMs = Date.now();
    const samples: PowerSample[] = [
      { ts: nowMs - 30 * 60 * 1000, value: 0 },
      { ts: nowMs - 25 * 60 * 1000, value: 5 },
      { ts: nowMs - 20 * 60 * 1000, value: 7 },
    ];

    const bridged = bridgeZeroToProductionGaps(samples, { rangeHours: 6 });

    expect(bridged).toEqual(samples);
  });

  it("does not insert anchors when previous value is not zero", () => {
    const nowMs = Date.now();
    const samples: PowerSample[] = [
      { ts: nowMs - 6 * 60 * 60 * 1000, value: 150 },
      { ts: nowMs - 2 * 60 * 60 * 1000, value: 220 },
    ];

    const bridged = bridgeZeroToProductionGaps(samples, { rangeHours: 24 });

    expect(bridged).toEqual(samples);
  });
});

describe("buildPopupGraphModel", () => {
  it("builds paths for a normal dataset", () => {
    const nowMs = Date.now();
    const samples = sampleSeries(10, nowMs);
    const model = buildPopupGraphModel(samples, 320, 132);

    expect(model.pointCount).toBe(10);
    expect(model.linePath.startsWith("M")).toBe(true);
    expect(model.areaPath.endsWith("Z")).toBe(true);
    expect(model.minValue).toBe(0);
    expect(model.maxValue).toBe(9);
  });

  it("handles flat datasets", () => {
    const nowMs = Date.now();
    const samples: PowerSample[] = [
      { ts: nowMs - 120_000, value: 500 },
      { ts: nowMs - 60_000, value: 500 },
      { ts: nowMs, value: 500 },
    ];
    const model = buildPopupGraphModel(samples, 320, 132);

    expect(model.pointCount).toBe(3);
    expect(model.linePath.length).toBeGreaterThan(0);
    expect(model.minValue).toBe(499);
    expect(model.maxValue).toBe(501);
  });

  it("handles single-point datasets", () => {
    const nowMs = Date.now();
    const samples: PowerSample[] = [{ ts: nowMs, value: 250 }];
    const model = buildPopupGraphModel(samples, 320, 132);

    expect(model.pointCount).toBe(1);
    expect(model.linePath.length).toBeGreaterThan(0);
    expect(model.areaPath.length).toBeGreaterThan(0);
  });

  it("handles empty datasets", () => {
    const model = buildPopupGraphModel([], 320, 132);

    expect(model.pointCount).toBe(0);
    expect(model.linePath).toBe("");
    expect(model.minValue).toBeNull();
    expect(model.maxValue).toBeNull();
  });
});
