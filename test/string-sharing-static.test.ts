import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("string sensor sharing visuals", () => {
  it("renders shared string labels on panel tiles without replacing row/column labels", () => {
    const source = readFileSync("src/solar-panel-visualizer-card.ts", "utf8");

    expect(source).not.toContain(".string-slot");
    expect(source).toContain("panel.stringGroupLabel");
    expect(source).toContain("_formatPanelSlotLabel(panel)");
    expect(source).toContain("has-string-label");
    expect(source).not.toContain(".slot::before");
  });

  it("scales popup and comparison graph samples for shared panel sensors", () => {
    const source = readFileSync("src/solar-panel-visualizer-card.ts", "utf8");

    expect(source).toContain("primaryValueScale: panel.powerShareFactor ?? 1");
    expect(source).toContain("target.scale");
    expect(source).toContain("panel.energyShareFactor ?? 1");
    expect(source).toContain("panel.powerShareFactor ?? 1");
  });

  it("keeps tile detail scrolling visually scrollbar-free", () => {
    const source = readFileSync("src/solar-panel-visualizer-card.ts", "utf8");

    expect(source).toMatch(/\.panel-detail-scroll\s*\{[\s\S]*scrollbar-width:\s*none/);
    expect(source).toMatch(/\.panel-detail-scroll\s*\{[\s\S]*-ms-overflow-style:\s*none/);
    expect(source).toMatch(/\.panel-detail-scroll::-webkit-scrollbar\s*\{[\s\S]*display:\s*none/);
    expect(source).toMatch(/\.panel\.has-detail-overflow \.panel-detail-scroll::-webkit-scrollbar\s*\{[\s\S]*display:\s*none/);
  });
});
