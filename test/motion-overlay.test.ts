import {
  assignRenderedRowIndexes,
  buildLeftCollectorGridRoutes,
  shouldUseBottomPowerEntry,
  type LeftCollectorGridPanelInput,
  type Point,
} from "../src/motion-overlay";
import { readFileSync } from "node:fs";

const makePanel = (
  id: string,
  row: number,
  left: number,
  top: number,
  producing = true,
): LeftCollectorGridPanelInput => ({
  id,
  row,
  anchorX: left + 28,
  anchorY: top + 2,
  left,
  right: left + 120,
  top,
  bottom: top + 110,
  accentColor: "#7ed957",
  intensity: 0.5,
  producing,
});

const powerEntry: Point = { x: 72, y: 96 };

describe("left collector motion grid routing", () => {
  it("groups motion rails by rendered visual rows instead of configured slot rows", () => {
    const rows = assignRenderedRowIndexes([
      { top: 220, bottom: 330, left: 120 },
      { top: 220, bottom: 330, left: 280 },
      { top: 220, bottom: 330, left: 440 },
      { top: 380, bottom: 490, left: 120 },
      { top: 380, bottom: 490, left: 280 },
      { top: 380, bottom: 490, left: 440 },
      { top: 540, bottom: 650, left: 120 },
    ]);

    expect(rows).toEqual([0, 0, 0, 1, 1, 1, 2]);
  });

  it("keeps left-center Power entry for compact or left-aligned KPI layouts", () => {
    expect(shouldUseBottomPowerEntry(420, 40, 390, 126)).toBe(false);
    expect(shouldUseBottomPowerEntry(980, 60, 940, 280)).toBe(false);
  });

  it("uses bottom Power entry when the KPI is centered over the grid", () => {
    expect(shouldUseBottomPowerEntry(1200, 80, 1120, 660)).toBe(true);
  });

  it("routes one row left first and terminates at the Power KPI left edge", () => {
    const routes = buildLeftCollectorGridRoutes(
      [
        makePanel("p1", 0, 120, 220),
        makePanel("p2", 0, 280, 220),
        makePanel("p3", 0, 440, 220),
      ],
      powerEntry,
      24,
      760,
    );

    expect(routes.collectorX).toBeLessThan(120);
    expect(routes.collectorX).toBeCloseTo(60);
    expect(routes.rowBuses).toHaveLength(1);
    expect(routes.rowBuses[0]).toMatchObject({
      row: 0,
      startX: routes.collectorX,
      endX: 468,
    });
    expect(routes.topologyPaths.find((path) => path.id === "collector-rail")?.d).toContain(
      `${routes.collectorX.toFixed(2)}`,
    );
    expect(routes.topologyPaths.find((path) => path.id === "row-rail-0")?.d).toBe(
      `M ${routes.collectorX.toFixed(2)} 208.00 L 468.00 208.00`,
    );
    expect(routes.flowPaths).toHaveLength(3);
    for (const path of routes.flowPaths) {
      expect(path.d).not.toContain(" Q ");
      expect(path.d).not.toContain(" C ");
      expect(path.d.match(/ L /g)?.length ?? 0).toBeGreaterThanOrEqual(3);
      expect(path.d.trim().endsWith(`${powerEntry.x.toFixed(2)} ${powerEntry.y.toFixed(2)}`)).toBe(
        true,
      );
      expect(path.offsetPx).toBeLessThanOrEqual(-path.travelPx);
      expect(path.durationMs).toBeGreaterThan(path.travelPx * 8);
    }
  });

  it("routes wide first-row panels directly to the Power drop instead of the left collector", () => {
    const bottomEntry: Point = { x: 360, y: 148 };
    const routes = buildLeftCollectorGridRoutes(
      [makePanel("p1", 0, 120, 220), makePanel("p2", 0, 280, 220)],
      bottomEntry,
      24,
      760,
      120,
      "direct-first-row",
    );

    expect(routes.topologyPaths.some((path) => path.id === "power-entry-rail")).toBe(false);
    expect(routes.topologyPaths.find((path) => path.id === "power-drop-rail")?.d).toBe(
      `M ${bottomEntry.x.toFixed(2)} ${bottomEntry.y.toFixed(2)} L ${bottomEntry.x.toFixed(2)} 208.00`,
    );
    expect(routes.topologyPaths.find((path) => path.id === "collector-rail")).toBeUndefined();
    expect(routes.topologyPaths.find((path) => path.id === "row-rail-0")?.d).toBe(
      "M 148.00 208.00 L 360.00 208.00",
    );
    for (const path of routes.flowPaths) {
      expect(path.d.trim().endsWith(`${bottomEntry.x.toFixed(2)} ${bottomEntry.y.toFixed(2)}`)).toBe(
        true,
      );
      expect(path.d).not.toContain(`L ${routes.collectorX.toFixed(2)} 208.00`);
      expect(path.offsetPx).toBeLessThanOrEqual(-path.travelPx);
    }
  });

  it("routes wide lower rows through the collector and then the first-row Power drop", () => {
    const bottomEntry: Point = { x: 360, y: 148 };
    const routes = buildLeftCollectorGridRoutes(
      [makePanel("p1", 0, 280, 220), makePanel("p2", 1, 280, 380)],
      bottomEntry,
      24,
      760,
      120,
      "direct-first-row",
    );

    expect(routes.topologyPaths.find((path) => path.id === "collector-rail")?.d).toBe(
      `M ${routes.collectorX.toFixed(2)} 208.00 L ${routes.collectorX.toFixed(2)} 368.00`,
    );
    expect(routes.topologyPaths.find((path) => path.id === "row-rail-0")?.d).toBe(
      `M ${routes.collectorX.toFixed(2)} 208.00 L 360.00 208.00`,
    );
    const lowerPath = routes.flowPaths.find((path) => path.panelId === "p2")?.d ?? "";
    expect(lowerPath).toContain(`L ${routes.collectorX.toFixed(2)} 368.00`);
    expect(lowerPath).toContain(`L ${routes.collectorX.toFixed(2)} 208.00`);
    expect(lowerPath).toContain("L 360.00 208.00");
    expect(lowerPath.trim().endsWith("360.00 148.00")).toBe(true);
  });

  it("uses one shared collector for multiple rows", () => {
    const routes = buildLeftCollectorGridRoutes(
      [
        makePanel("p1", 0, 120, 220),
        makePanel("p2", 0, 280, 220),
        makePanel("p3", 1, 120, 380),
        makePanel("p4", 1, 280, 380),
      ],
      powerEntry,
      24,
      760,
    );

    expect(routes.rowBuses).toHaveLength(2);
    expect(routes.rowBuses[1].y).toBeGreaterThan(routes.rowBuses[0].y);
    expect(routes.rowBuses.every((row) => row.startX === routes.collectorX)).toBe(true);
    expect(routes.topologyPaths.filter((path) => path.id.startsWith("row-rail-"))).toHaveLength(2);
    for (const row of routes.rowBuses) {
      expect(routes.topologyPaths.find((path) => path.id === `row-rail-${row.row}`)?.d).toBe(
        `M ${routes.collectorX.toFixed(2)} ${row.y.toFixed(2)} L ${row.endX.toFixed(2)} ${row.y.toFixed(2)}`,
      );
    }
  });

  it("positions the collector from the full grid left edge, not the first powered panel", () => {
    const routes = buildLeftCollectorGridRoutes(
      [makePanel("p2", 0, 280, 220), makePanel("p5", 1, 280, 380)],
      powerEntry,
      24,
      760,
      120,
    );

    expect(routes.collectorX).toBeCloseTo(60);
    expect(routes.rowBuses.every((row) => row.startX === routes.collectorX)).toBe(true);
    expect(routes.rowBuses[0].startX).toBeLessThan(120);
  });

  it("keeps non-consecutive row rails close to their own row instead of floating between configured rows", () => {
    const routes = buildLeftCollectorGridRoutes(
      [
        makePanel("p1", 0, 120, 220),
        makePanel("p10", 3, 280, 740),
      ],
      powerEntry,
      24,
      760,
    );

    expect(routes.rowBuses).toHaveLength(2);
    expect(routes.rowBuses[1]).toMatchObject({
      row: 3,
      y: 728,
    });
    expect(routes.flowPaths.find((path) => path.panelId === "p10")?.d).toContain(
      `L ${routes.collectorX.toFixed(2)} 728.00`,
    );
  });

  it("keeps the collector inside the card bounds on narrow layouts", () => {
    const routes = buildLeftCollectorGridRoutes(
      [makePanel("p1", 0, 24, 180)],
      { x: 18, y: 84 },
      24,
      220,
    );

    expect(routes.collectorX).toBeGreaterThanOrEqual(6);
    expect(routes.collectorX).toBeLessThanOrEqual(206);
  });

  it("does not create pulse routes for non-producing panels", () => {
    const routes = buildLeftCollectorGridRoutes(
      [makePanel("p1", 0, 120, 220, true), makePanel("p2", 0, 280, 220, false)],
      powerEntry,
      24,
      760,
    );

    expect(routes.flowPaths.map((path) => path.panelId)).toEqual(["p1"]);
    expect(routes.topologyPaths.some((path) => path.id === "tap-rail-p2")).toBe(true);
  });

  it("keeps all explicit rail paths orthogonal", () => {
    const routes = buildLeftCollectorGridRoutes(
      [makePanel("p1", 0, 120, 220), makePanel("p2", 1, 280, 380)],
      powerEntry,
      24,
      760,
    );

    for (const path of routes.topologyPaths) {
      expect(path.d).not.toContain(" Q ");
      expect(path.d).not.toContain(" C ");
    }
  });

  it("does not size the overlay from the card border box or scroll position", () => {
    const source = readFileSync("src/motion-overlay.ts", "utf8");

    expect(source).not.toContain("scrollOffset.y + cardRect.height");
    expect(source).not.toMatch(/height:\s*Math\.max\([\s\S]*cardRect\.height/);
  });
});
