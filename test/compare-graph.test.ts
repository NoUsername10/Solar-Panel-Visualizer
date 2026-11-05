import { describe, expect, it } from "vitest";
import { buildCompareGraphModel } from "../src/compare-graph";
import type { PowerSample } from "../src/types";

const HOUR_MS = 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;
const NOW = Date.UTC(2026, 2, 14, 12, 0, 0);

const makeSeries = (values: number[], startTs: number, stepMs: number): PowerSample[] =>
  values.map((value, index) => ({
    ts: startTs + index * stepMs,
    value,
  }));

describe("buildCompareGraphModel", () => {
  it("renders normal multi-panel series for the selected range", () => {
    const panelA = makeSeries([120, 160, 210, 180, 140], NOW - 5 * HOUR_MS, HOUR_MS);
    const panelB = makeSeries([80, 100, 115, 130, 110, 90], NOW - 6 * HOUR_MS, HOUR_MS);

    const model = buildCompareGraphModel(
      [
        { id: "panel-a", samples: panelA },
        { id: "panel-b", samples: panelB },
      ],
      NOW,
      6,
      150,
    );

    expect(model.hasData).toBe(true);
    expect(model.drawableCount).toBe(2);
    expect(model.series).toHaveLength(2);
    expect(model.series.every((series) => series.linePath.startsWith("M"))).toBe(true);
    expect(model.series.every((series) => (series.firstTs ?? 0) >= NOW - 6 * HOUR_MS)).toBe(true);
    expect(model.series.every((series) => (series.lastTs ?? 0) <= NOW)).toBe(true);
  });

  it("draws all-zero flat series", () => {
    const panelA = makeSeries([0, 0, 0, 0], NOW - 3 * HOUR_MS, HOUR_MS);
    const panelB = makeSeries([0, 0, 0, 0], NOW - 3 * HOUR_MS, HOUR_MS);

    const model = buildCompareGraphModel(
      [
        { id: "panel-a", samples: panelA },
        { id: "panel-b", samples: panelB },
      ],
      NOW,
      6,
      150,
    );

    expect(model.hasData).toBe(true);
    expect(model.drawableCount).toBe(2);
    expect(model.series.every((series) => series.pointsCount >= 2)).toBe(true);
    expect(model.series.every((series) => series.linePath.length > 0)).toBe(true);
  });

  it("expands single-point input into a drawable flat line", () => {
    const model = buildCompareGraphModel(
      [
        {
          id: "panel-a",
          samples: [{ ts: NOW - 10 * MINUTE_MS, value: 255 }],
        },
        {
          id: "panel-b",
          samples: [{ ts: NOW - 5 * MINUTE_MS, value: 175 }],
        },
      ],
      NOW,
      1,
      150,
    );

    expect(model.hasData).toBe(true);
    expect(model.drawableCount).toBe(2);
    expect(model.series.every((series) => series.sampleCount >= 2)).toBe(true);
    expect(model.series.every((series) => series.pointsCount >= 2)).toBe(true);
    expect(model.series.every((series) => series.linePath.length > 0)).toBe(true);
  });

  it("handles mixed sparse and dense series with deterministic bounds", () => {
    const dense = makeSeries(
      Array.from({ length: 320 }, (_, index) => 200 + Math.sin(index / 10) * 30),
      NOW - 24 * HOUR_MS,
      (24 * HOUR_MS) / 319,
    );
    const sparse = makeSeries([95, 110, 88], NOW - 9 * HOUR_MS, 3 * HOUR_MS);

    const model = buildCompareGraphModel(
      [
        { id: "dense", samples: dense },
        { id: "sparse", samples: sparse },
      ],
      NOW,
      24,
      120,
    );

    const denseSeries = model.series.find((series) => series.id === "dense");
    const sparseSeries = model.series.find((series) => series.id === "sparse");
    expect(denseSeries).toBeDefined();
    expect(sparseSeries).toBeDefined();
    expect(denseSeries?.sampleCount).toBeLessThanOrEqual(120);
    expect(denseSeries?.pointsCount).toBeGreaterThan(0);
    expect(sparseSeries?.sampleCount).toBe(3);
    expect(sparseSeries?.linePath.length).toBeGreaterThan(0);
  });

  it("returns non-drawable state for invalid point inputs instead of throwing", () => {
    const invalidSeries: PowerSample[] = [
      { ts: Number.NaN, value: 12 },
      { ts: NOW - HOUR_MS, value: Number.NaN },
      { ts: Number.POSITIVE_INFINITY, value: 8 },
    ];

    const model = buildCompareGraphModel(
      [{ id: "panel-invalid", samples: invalidSeries }],
      NOW,
      6,
      150,
    );

    expect(model.hasData).toBe(false);
    expect(model.drawableCount).toBe(0);
    expect(model.series[0].sampleCount).toBe(0);
    expect(model.series[0].pointsCount).toBe(0);
    expect(model.series[0].linePath).toBe("");
  });
});
