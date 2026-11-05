import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("popup interaction stability", () => {
  const source = readFileSync("src/solar-panel-visualizer-card.ts", "utf8");

  it("anchors the popup backdrop to the viewport instead of the scrollable card body", () => {
    expect(source).toMatch(/\.spv-popup-backdrop\s*\{[\s\S]*position:\s*fixed/);
  });

  it("keeps the sticky close hit area scoped to the visible close button", () => {
    const closeAnchorBlock = source.match(/\.spv-popup-close-anchor\s*\{([\s\S]*?)\n\s*\}/)?.[1] ?? "";

    expect(closeAnchorBlock).toContain("width: 36px");
    expect(closeAnchorBlock).toContain("margin: 0 0 -36px auto");
    expect(closeAnchorBlock).not.toContain("pointer-events: none");
    expect(source).not.toContain(".spv-popup-close-anchor .spv-popup-close");
  });

  it("clears stale graph scroll restoration when the user interacts inside a popup", () => {
    const popupCount = [...source.matchAll(/class="spv-popup"/g)].length;

    expect(popupCount).toBeGreaterThan(0);
    expect([...source.matchAll(/@pointerdown=\$\{this\._handlePopupUserInteraction\}/g)]).toHaveLength(popupCount);
    expect([...source.matchAll(/@wheel=\$\{this\._handlePopupUserInteraction\}/g)]).toHaveLength(popupCount);
    expect(source).toContain("private _handlePopupUserInteraction");
    expect(source).toMatch(
      /private _handlePopupUserInteraction[\s\S]*this\._clearPopupScrollRestore\(\)/,
    );
  });
});
