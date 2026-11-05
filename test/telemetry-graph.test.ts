import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("panel telemetry graphs", () => {
  const source = readFileSync("src/solar-panel-visualizer-card.ts", "utf8");

  it("keeps telemetry as a two-column grid and spans only the open pill", () => {
    expect(source).toMatch(/\.telemetry-grid\s*\{[\s\S]*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/);
    expect(source).not.toContain("has-open-telemetry-graph");
    expect(source).not.toContain("hasOpenTelemetryGraph");
    expect(source).toMatch(/\.telemetry-card\.is-open\s*\{[\s\S]*grid-column:\s*1 \/ -1/);
  });

  it("renders configured telemetry as expandable controls and unconfigured telemetry as static pills", () => {
    expect(source).toContain('class="telemetry-card-toggle"');
    expect(source).toContain("aria-expanded=");
    expect(source).toContain("_toggleTelemetryGraph(event, panelId, entityId)");
    expect(source).toContain('class="detail-card telemetry-card"');
    expect(source).toContain("common.not_configured");
  });

  it("uses an independent telemetry graph range with the existing graph body", () => {
    expect(source).toContain("_telemetryGraphRangeHours");
    expect(source).toContain("_handleTelemetryGraphRangeChange");
    expect(source).toContain("_renderPopupGraphBodyFromSamples(");
    expect(source).toContain("{ fillStartWithFirstSample: true }");
  });
});
