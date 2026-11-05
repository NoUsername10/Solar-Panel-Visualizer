import { choosePanelPerformanceLabel } from "../src/panel-performance-label";

const candidates = [
  { variant: "full" as const, text: "45% of 505W Panel" },
  { variant: "medium" as const, text: "45% of 505W" },
  { variant: "compact" as const, text: "45%" },
];

const measureTextWidthPx = (text: string, fontPx: number): number =>
  text.length * fontPx * 0.5;

describe("choosePanelPerformanceLabel", () => {
  it("uses the full panel text when width allows it", () => {
    const result = choosePanelPerformanceLabel({
      candidates,
      panelWidthPx: 220,
      panelHeightPx: 128,
      fontPx: 16,
      measureTextWidthPx,
    });

    expect(result.variant).toBe("full");
    expect(result.text).toBe("45% of 505W Panel");
  });

  it("uses the medium text before falling back to compact", () => {
    const result = choosePanelPerformanceLabel({
      candidates,
      panelWidthPx: 166,
      panelHeightPx: 128,
      fontPx: 16,
      measureTextWidthPx,
    });

    expect(result.variant).toBe("medium");
    expect(result.text).toBe("45% of 505W");
  });

  it("uses compact text for genuinely tiny panels", () => {
    const result = choosePanelPerformanceLabel({
      candidates,
      panelWidthPx: 108,
      panelHeightPx: 128,
      fontPx: 16,
      measureTextWidthPx,
    });

    expect(result.variant).toBe("compact");
    expect(result.text).toBe("45%");
  });

  it("reserves the slot label area before choosing long text", () => {
    const result = choosePanelPerformanceLabel({
      candidates,
      panelWidthPx: 220,
      panelHeightPx: 128,
      fontPx: 16,
      reservedRightPx: 64,
      measureTextWidthPx,
    });

    expect(result.variant).toBe("medium");
    expect(result.text).toBe("45% of 505W");
  });
});
