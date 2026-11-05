import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const getDetailGridBlocks = (): string[] => {
  const source = readFileSync("src/solar-panel-visualizer-card.ts", "utf8");
  const blocks = [...source.matchAll(/<div class="detail-grid">([\s\S]*?)<\/div>\n\n\s*\$\{this\._renderKpiCompareControls/g)];
  return blocks.map((match) => match[1]);
};

describe("KPI detail layout", () => {
  it("puts current and forecast before source in Power and Energy popups", () => {
    const [powerBlock, energyBlock] = getDetailGridBlocks();

    for (const block of [powerBlock, energyBlock]) {
      expect(block.indexOf("card.popup.detail.current")).toBeGreaterThanOrEqual(0);
      expect(block.indexOf("card.popup.detail.source")).toBeGreaterThan(0);
    }

    expect(powerBlock.indexOf("card.popup.detail.estimated_power_now")).toBeGreaterThan(
      powerBlock.indexOf("card.popup.detail.current"),
    );
    expect(powerBlock.indexOf("card.popup.detail.source")).toBeGreaterThan(
      powerBlock.indexOf("card.popup.detail.estimated_power_now"),
    );

    expect(energyBlock.indexOf("card.popup.detail.estimated_energy_now")).toBeGreaterThan(
      energyBlock.indexOf("card.popup.detail.current"),
    );
    expect(energyBlock.indexOf("card.popup.detail.source")).toBeGreaterThan(
      energyBlock.indexOf("card.popup.detail.estimated_energy_now"),
    );
  });

  it("makes the KPI source card span the full detail row", () => {
    const source = readFileSync("src/solar-panel-visualizer-card.ts", "utf8");
    const [powerBlock, energyBlock] = getDetailGridBlocks();

    expect(source).toContain(".detail-card-source");
    expect(source).toContain("grid-column: 1 / -1");
    expect(powerBlock).toContain('class="detail-card detail-card-source"');
    expect(energyBlock).toContain('class="detail-card detail-card-source"');
  });
});
