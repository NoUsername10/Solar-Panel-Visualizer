import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("virtual total KPI popup wiring", () => {
  const source = readFileSync("src/solar-panel-visualizer-card.ts", "utf8");

  it("uses the virtual total graph as the no-system Energy primary graph", () => {
    expect(source).toContain('this._renderAggregatedPanelGraph(derived, "energy"');
    expect(source).not.toContain("energy_compare_requires_system");
  });

  it("expands panel comparison when virtual totals already loaded panel history", () => {
    expect(source).toContain('power: this._buildPanelCompareTargets(derived, "power").length > 0');
    expect(source).toContain('energy: this._buildPanelCompareTargets(derived, "energy").length > 0');
    expect(source).toContain('void this._ensurePanelCompareLoaded(derived, "energy", this._kpiCompareRangeHours.energy)');
    expect(source).toContain('void this._ensurePanelCompareLoaded(derived, "power", this._kpiCompareRangeHours.power)');
  });

  it("uses the generic virtual total graph for Power and Energy", () => {
    expect(source).toContain("private _renderAggregatedPanelGraph(");
    expect(source).toContain('this._renderAggregatedPanelGraph(derived, "power"');
    expect(source).toContain('`panel-total-${kind}|${signature}|${range}`');
  });
});
