import { html, nothing, svg } from "lit";
import type {
  DerivedArrayState,
  SolarPanelVisualizerConfig,
} from "./types";

export interface MotionPath {
  id: string;
  d: string;
  opacity: number;
  delayMs: number;
  durationMs: number;
  color: string;
  travelPx: number;
  offsetPx?: number;
  panelId?: string;
}

export interface MotionNode {
  id: string;
  cx: number;
  cy: number;
  r: number;
  color: string;
  opacity: number;
}

export interface Point {
  x: number;
  y: number;
}

interface RoundedPath {
  d: string;
  length: number;
}

interface PanelPoint {
  panel: DerivedArrayState["panels"][number];
  row: number;
  center: Point;
  statusCenterX: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
}

interface RowStats {
  row: number;
  busY: number;
  minTop: number;
  maxBottom: number;
}

interface KpiConnector {
  entry: Point;
}

export type PowerRailRouteMode = "left-collector" | "direct-first-row";

export interface LeftCollectorGridPanelInput {
  id: string;
  row: number;
  anchorX: number;
  anchorY: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
  accentColor: string;
  intensity: number;
  producing: boolean;
}

export interface LeftCollectorGridRoutes {
  flowPaths: MotionPath[];
  topologyPaths: MotionPath[];
  topologyNodes: MotionNode[];
  collectorX: number;
  rowBuses: Array<{
    row: number;
    y: number;
    startX: number;
    endX: number;
  }>;
}

export interface RenderedRowInput {
  top: number;
  bottom: number;
  left: number;
}

export interface MotionOverlayModel {
  width: number;
  height: number;
  flowPaths: MotionPath[];
  topologyPaths: MotionPath[];
  topologyNodes: MotionNode[];
}

const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

const approxEqual = (a: number, b: number): boolean => Math.abs(a - b) < 0.01;

const distance = (a: Point, b: Point): number =>
  Math.hypot(b.x - a.x, b.y - a.y);

const centerOf = (rect: DOMRect, hostRect: DOMRect): Point => ({
  x: rect.left - hostRect.left + rect.width / 2,
  y: rect.top - hostRect.top + rect.height / 2,
});

const BUSBAR_COLOR = "rgba(224, 232, 242, 1)";
const FLOW_MS_PER_PX = 8;
const FLOW_PULSE_LENGTH_PX = 28;
const GRID_CARD_PADDING = 14;

const normalizePoints = (points: Point[]): Point[] => {
  const normalized: Point[] = [];
  for (const point of points) {
    const previous = normalized[normalized.length - 1];
    if (previous && approxEqual(previous.x, point.x) && approxEqual(previous.y, point.y)) {
      continue;
    }
    normalized.push(point);
  }
  return normalized;
};

const buildOrthogonalPath = (points: Point[]): RoundedPath => {
  const normalized = normalizePoints(points);
  if (normalized.length < 2) {
    return { d: "", length: 0 };
  }

  let d = `M ${normalized[0].x.toFixed(2)} ${normalized[0].y.toFixed(2)}`;
  let length = 0;

  for (let index = 1; index < normalized.length; index += 1) {
    const previous = normalized[index - 1];
    const current = normalized[index];
    d += ` L ${current.x.toFixed(2)} ${current.y.toFixed(2)}`;
    length += distance(previous, current);
  }

  return { d, length };
};

export const shouldUseBottomPowerEntry = (
  cardWidth: number,
  gridLeft: number,
  gridRight: number,
  powerCenterX: number,
): boolean => {
  const gridWidth = gridRight - gridLeft;
  if (
    !Number.isFinite(cardWidth) ||
    !Number.isFinite(gridLeft) ||
    !Number.isFinite(gridRight) ||
    !Number.isFinite(powerCenterX) ||
    cardWidth <= 0 ||
    gridWidth <= 0
  ) {
    return false;
  }

  const middleGridStart = gridLeft + gridWidth * 0.28;
  const middleCardStart = cardWidth * 0.36;
  return powerCenterX >= Math.max(middleGridStart, middleCardStart) && powerCenterX <= gridRight;
};

const resolveConnector = (
  hostRect: DOMRect,
  targetRect: DOMRect,
  useBottomEntry = false,
  scrollOffset: Point = { x: 0, y: 0 },
): KpiConnector => {
  const center = centerOf(targetRect, hostRect);
  const left = targetRect.left - hostRect.left;
  const bottom = targetRect.bottom - hostRect.top;
  return {
    entry: {
      x: (useBottomEntry ? center.x : left - 0.5) + scrollOffset.x,
      y: (useBottomEntry ? bottom + 0.5 : center.y) + scrollOffset.y,
    },
  };
};

const resolveAnchorX = (panelPoint: PanelPoint): number => {
  const fallbackX = panelPoint.left + (panelPoint.right - panelPoint.left) * 0.22;
  return clamp(panelPoint.statusCenterX || fallbackX, panelPoint.left + 10, panelPoint.right - 10);
};

export const assignRenderedRowIndexes = (items: RenderedRowInput[]): number[] => {
  if (items.length === 0) {
    return [];
  }

  const averageHeight =
    items.reduce((sum, item) => sum + Math.max(1, item.bottom - item.top), 0) / items.length;
  const rowTolerance = clamp(averageHeight * 0.32, 6, 28);
  const rowCenters: number[] = [];
  const rowCounts: number[] = [];
  const rowIndexes = new Array<number>(items.length).fill(0);

  const sorted = items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => a.item.top - b.item.top || a.item.left - b.item.left);

  for (const { item, index } of sorted) {
    const centerY = item.top + (item.bottom - item.top) / 2;
    let rowIndex = rowCenters.findIndex((center) => Math.abs(center - centerY) <= rowTolerance);
    if (rowIndex < 0) {
      rowIndex = rowCenters.length;
      rowCenters.push(centerY);
      rowCounts.push(1);
    } else {
      rowCounts[rowIndex] += 1;
      rowCenters[rowIndex] =
        rowCenters[rowIndex] + (centerY - rowCenters[rowIndex]) / rowCounts[rowIndex];
    }
    rowIndexes[index] = rowIndex;
  }

  return rowIndexes;
};

export const buildLeftCollectorGridRoutes = (
  panels: LeftCollectorGridPanelInput[],
  powerEntry: Point,
  cornerRadius: number,
  cardWidth: number,
  gridLeft = Math.min(...panels.map((item) => item.left)),
  routeMode: PowerRailRouteMode = "left-collector",
): LeftCollectorGridRoutes => {
  const flowPaths: MotionPath[] = [];
  const topologyPaths: MotionPath[] = [];
  const topologyNodes: MotionNode[] = [];
  const rowBuses: LeftCollectorGridRoutes["rowBuses"] = [];
  const pushTopologyPath = (id: string, points: Point[], opacity: number): void => {
    const path = buildOrthogonalPath(points);
    if (!path.d) {
      return;
    }
    topologyPaths.push({
      id,
      d: path.d,
      color: BUSBAR_COLOR,
      opacity,
      delayMs: 0,
      durationMs: 1200,
      travelPx: Math.max(24, path.length),
    });
  };
  const pushTopologyNode = (node: MotionNode): void => {
    const duplicate = topologyNodes.some((existing) => {
      const dx = existing.cx - node.cx;
      const dy = existing.cy - node.cy;
      return Math.hypot(dx, dy) < Math.max(existing.r, node.r) * 0.9;
    });
    if (!duplicate) {
      topologyNodes.push(node);
    }
  };

  const rowGroups = new Map<number, LeftCollectorGridPanelInput[]>();
  for (const panel of panels) {
    const rowGroup = rowGroups.get(panel.row) ?? [];
    rowGroup.push(panel);
    rowGroups.set(panel.row, rowGroup);
  }

  const rows = [...rowGroups.entries()]
    .sort((a, b) => a[0] - b[0])
    .map<RowStats>(([row, group]) => {
      return {
        row,
        busY: 0,
        minTop: Math.min(...group.map((item) => item.top)),
        maxBottom: Math.max(...group.map((item) => item.bottom)),
      };
    });
  if (rows.length === 0) {
    return { flowPaths, topologyPaths, topologyNodes, collectorX: GRID_CARD_PADDING, rowBuses };
  }

  const contentLeft = Math.max(0, Math.min(gridLeft, ...panels.map((item) => item.left)));
  const minCollectorX = Math.max(6, GRID_CARD_PADDING * 0.5);
  const maxCollectorX = Math.max(minCollectorX, contentLeft - 8);
  const collectorX = clamp(
    contentLeft / 2,
    minCollectorX,
    Math.min(maxCollectorX, Math.max(GRID_CARD_PADDING, cardWidth - GRID_CARD_PADDING)),
  );
  const minBusY = powerEntry.y + 8;

  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index];
    const previous = rows[index - 1];
    const preferred = row.minTop - 12;
    const minAllowed =
      index === 0
        ? minBusY
        : Math.max(previous.maxBottom + 8, previous.busY + 8);
    const maxAllowed = row.minTop - 6;

    row.busY =
      maxAllowed > minAllowed
        ? clamp(preferred, minAllowed, maxAllowed)
        : Math.max(minBusY, row.minTop - 6);
  }

  const railOpacity = clamp(0.24 / Math.sqrt(Math.max(rows.length, 1)), 0.15, 0.22);
  const tapOpacity = clamp(0.24 / Math.sqrt(Math.max(panels.length, 1)), 0.09, 0.16);
  pushTopologyNode({
    id: "power-socket-node",
    cx: powerEntry.x,
    cy: powerEntry.y,
    r: clamp(cornerRadius * 0.18, 2.8, 4.8),
    color: BUSBAR_COLOR,
    opacity: 0.36,
  });

  const firstRow = rows[0];
  const maxBusY = Math.max(...rows.map((row) => row.busY));
  const directFirstRowMode = routeMode === "direct-first-row";
  const hasLowerRows = rows.length > 1;
  if (directFirstRowMode) {
    pushTopologyPath(
      "power-drop-rail",
      [
        powerEntry,
        { x: powerEntry.x, y: firstRow.busY },
      ],
      railOpacity,
    );
    pushTopologyNode({
      id: "power-drop-node",
      cx: powerEntry.x,
      cy: firstRow.busY,
      r: clamp(cornerRadius * 0.18, 2.8, 4.8),
      color: BUSBAR_COLOR,
      opacity: 0.36,
    });
    if (hasLowerRows) {
      pushTopologyPath(
        "collector-rail",
        [
          { x: collectorX, y: firstRow.busY },
          { x: collectorX, y: maxBusY },
        ],
        railOpacity,
      );
    }
  } else {
    pushTopologyPath(
      "collector-rail",
      [
        { x: collectorX, y: powerEntry.y },
        { x: collectorX, y: maxBusY },
      ],
      railOpacity,
    );
    pushTopologyPath(
      "power-entry-rail",
      [
        { x: collectorX, y: powerEntry.y },
        powerEntry,
      ],
      railOpacity,
    );
  }

  for (const row of rows) {
    const rowPanels = rowGroups.get(row.row) ?? [];
    if (rowPanels.length === 0) {
      continue;
    }

    const rowAnchors = rowPanels.map((panel) => panel.anchorX);
    const isFirstRow = row.row === firstRow.row;
    const rowBusXs =
      directFirstRowMode && isFirstRow
        ? [powerEntry.x, ...rowAnchors, ...(hasLowerRows ? [collectorX] : [])]
        : [collectorX, ...rowAnchors];
    const rowStartX = Math.min(...rowBusXs);
    const rowEndX = Math.max(...rowBusXs);
    rowBuses.push({
      row: row.row,
      y: row.busY,
      startX: rowStartX,
      endX: rowEndX,
    });
    pushTopologyPath(
      `row-rail-${row.row}`,
      [
        { x: rowStartX, y: row.busY },
        { x: rowEndX, y: row.busY },
      ],
      railOpacity,
    );
    if (!directFirstRowMode || !isFirstRow || hasLowerRows) {
      pushTopologyNode({
        id: `row-node-${row.row}`,
        cx: collectorX,
        cy: row.busY,
        r: clamp(cornerRadius * 0.2, 2.8, 4.8),
        color: BUSBAR_COLOR,
        opacity: 0.32,
      });
    }

    for (const panel of rowPanels) {
      const routePoints =
        directFirstRowMode && isFirstRow
          ? [
              { x: panel.anchorX, y: panel.anchorY },
              { x: panel.anchorX, y: row.busY },
              { x: powerEntry.x, y: row.busY },
              powerEntry,
            ]
          : directFirstRowMode
            ? [
                { x: panel.anchorX, y: panel.anchorY },
                { x: panel.anchorX, y: row.busY },
                { x: collectorX, y: row.busY },
                { x: collectorX, y: firstRow.busY },
                { x: powerEntry.x, y: firstRow.busY },
                powerEntry,
              ]
            : [
                { x: panel.anchorX, y: panel.anchorY },
                { x: panel.anchorX, y: row.busY },
                { x: collectorX, y: row.busY },
                { x: collectorX, y: powerEntry.y },
                powerEntry,
              ];
      const routePath = buildOrthogonalPath(
        routePoints,
      );
      pushTopologyPath(
        `tap-rail-${panel.id}`,
        [
          { x: panel.anchorX, y: panel.anchorY },
          { x: panel.anchorX, y: row.busY },
        ],
        tapOpacity,
      );
      pushTopologyNode({
        id: `tap-node-${panel.id}`,
        cx: panel.anchorX,
        cy: row.busY,
        r: clamp(cornerRadius * 0.18, 2.6, 4.4),
        color: BUSBAR_COLOR,
        opacity: 0.3,
      });

      if (!panel.producing) {
        continue;
      }

      if (!routePath.d) {
        continue;
      }

      const travel = Math.max(FLOW_PULSE_LENGTH_PX, routePath.length);
      const travelWithEndpointClearance = travel + FLOW_PULSE_LENGTH_PX;
      flowPaths.push({
        id: `flow-${panel.id}`,
        panelId: panel.id,
        d: routePath.d,
        color: panel.accentColor,
        opacity: 0.62 + Math.min(panel.intensity, 1) * 0.2,
        delayMs: 0,
        durationMs: Math.round(travelWithEndpointClearance * FLOW_MS_PER_PX),
        travelPx: travel,
        offsetPx: -travelWithEndpointClearance,
      });
    }
  }

  return { flowPaths, topologyPaths, topologyNodes, collectorX, rowBuses };
};

const buildGridPaths = (
  panelPoints: PanelPoint[],
  producingPanelIds: Set<string>,
  connector: KpiConnector,
  cornerRadius: number,
  cardWidth: number,
  gridLeft: number,
  routeMode: PowerRailRouteMode,
): Pick<MotionOverlayModel, "flowPaths" | "topologyPaths" | "topologyNodes"> => {
  const routePanels = panelPoints.map((panelPoint): LeftCollectorGridPanelInput => ({
    id: panelPoint.panel.id,
    row: panelPoint.row,
    anchorX: resolveAnchorX(panelPoint),
    anchorY: panelPoint.top + 1.5,
    left: panelPoint.left,
    right: panelPoint.right,
    top: panelPoint.top,
    bottom: panelPoint.bottom,
    accentColor: panelPoint.panel.accentColor,
    intensity: panelPoint.panel.intensity,
    producing: producingPanelIds.has(panelPoint.panel.id),
  }));
  const routes = buildLeftCollectorGridRoutes(
    routePanels,
    connector.entry,
    cornerRadius,
    cardWidth,
    gridLeft,
    routeMode,
  );
  return {
    flowPaths: routes.flowPaths,
    topologyPaths: routes.topologyPaths,
    topologyNodes: routes.topologyNodes,
  };
};

export const buildMotionOverlayModel = (
  host: HTMLElement,
  root: ShadowRoot,
  config: SolarPanelVisualizerConfig,
  derived: DerivedArrayState,
): MotionOverlayModel | null => {
  const cardElement = root.querySelector<HTMLElement>("ha-card");
  if (!cardElement) {
    return null;
  }
  const cardRect = cardElement.getBoundingClientRect();
  if (cardRect.width <= 0 || cardRect.height <= 0) {
    return null;
  }
  const scrollOffset = {
    x: cardElement.scrollLeft,
    y: cardElement.scrollTop,
  };

  const powerTarget = root.querySelector<HTMLElement>('[data-kpi="power"]');
  if (!powerTarget) {
    return null;
  }

  const allPanelBounds = derived.panels
    .map((panel) => root.querySelector<HTMLElement>(`[data-panel-id="${panel.id}"]`))
    .filter((element): element is HTMLElement => Boolean(element))
    .map((element) => {
      const rect = element.getBoundingClientRect();
      return {
        left: rect.left - cardRect.left + scrollOffset.x,
        right: rect.right - cardRect.left + scrollOffset.x,
        top: rect.top - cardRect.top + scrollOffset.y,
        bottom: rect.bottom - cardRect.top + scrollOffset.y,
      };
    })
    .filter((bounds) => Number.isFinite(bounds.left) && Number.isFinite(bounds.right));
  const gridLeft = allPanelBounds.length > 0 ? Math.min(...allPanelBounds.map((item) => item.left)) : 0;
  const gridRight =
    allPanelBounds.length > 0 ? Math.max(...allPanelBounds.map((item) => item.right)) : cardRect.width;

  const connectedPanels = derived.panels.filter(
    (panel) => !panel.hiddenSlot && panel.enabled && Boolean(panel.powerEntityName),
  );
  if (connectedPanels.length === 0) {
    return null;
  }

  const producingPanelIds = new Set(
    connectedPanels
      .filter((panel) => typeof panel.power === "number" && panel.power > 0)
      .map((panel) => panel.id),
  );

  const measuredPanelPoints = connectedPanels
    .map((panel) => ({
      panel,
      element: root.querySelector<HTMLElement>(`[data-panel-id="${panel.id}"]`),
    }))
    .filter(
      (
        panelEntry,
      ): panelEntry is {
        panel: (typeof connectedPanels)[number];
        element: HTMLElement;
      } => Boolean(panelEntry.element),
    )
    .map((panelEntry) => {
      const rect = panelEntry.element.getBoundingClientRect();
      const center = {
        x: rect.left - cardRect.left + scrollOffset.x + rect.width / 2,
        y: rect.top - cardRect.top + scrollOffset.y + rect.height / 2,
      };
      const statusElement = panelEntry.element.querySelector<HTMLElement>(".status");
      const statusRect = statusElement?.getBoundingClientRect();
      const statusCenterX =
        statusRect && statusRect.width > 0
          ? statusRect.left - cardRect.left + scrollOffset.x + statusRect.width * 0.33
          : center.x;
      return {
        panel: panelEntry.panel,
        row: 0,
        center,
        statusCenterX,
        left: rect.left - cardRect.left + scrollOffset.x,
        right: rect.right - cardRect.left + scrollOffset.x,
        top: rect.top - cardRect.top + scrollOffset.y,
        bottom: rect.bottom - cardRect.top + scrollOffset.y,
      };
    });

  const renderedRows = assignRenderedRowIndexes(measuredPanelPoints);
  const panelPoints = measuredPanelPoints.map((panelPoint, index) => ({
    ...panelPoint,
    row: renderedRows[index] ?? 0,
  }));
  if (panelPoints.length === 0) {
    return null;
  }

  const averagePanelSize =
    panelPoints.reduce((sum, panelPoint) => {
      const width = panelPoint.right - panelPoint.left;
      const height = panelPoint.bottom - panelPoint.top;
      return sum + Math.min(width, height);
    }, 0) / panelPoints.length;
  const cornerRadius = clamp(Math.round(averagePanelSize * 0.2), 18, 34);
  const powerRect = powerTarget.getBoundingClientRect();
  const powerCenterX = powerRect.left - cardRect.left + scrollOffset.x + powerRect.width / 2;
  const useDirectFirstRowRoute = shouldUseBottomPowerEntry(
    cardRect.width,
    gridLeft,
    gridRight,
    powerCenterX,
  );
  const connector = resolveConnector(
    cardRect,
    powerRect,
    useDirectFirstRowRoute,
    scrollOffset,
  );
  const { flowPaths, topologyPaths, topologyNodes } = buildGridPaths(
    panelPoints,
    producingPanelIds,
    connector,
    cornerRadius,
    cardRect.width,
    gridLeft,
    useDirectFirstRowRoute ? "direct-first-row" : "left-collector",
  );

  return {
    width: Math.max(
      cardElement.clientWidth,
      cardRect.width,
      gridRight,
      connector.entry.x,
    ),
    height: Math.max(
      cardElement.clientHeight,
      ...panelPoints.map((panelPoint) => panelPoint.bottom),
      connector.entry.y,
    ),
    flowPaths,
    topologyPaths,
    topologyNodes,
  };
};

export const renderMotionOverlay = (
  model: MotionOverlayModel | null,
  options: {
    showTopology: boolean;
    showFlow: boolean;
    activeFlowPanelId: string | null;
    powerImpactActive: boolean;
  },
) => {
  if (!model || (model.flowPaths.length === 0 && model.topologyPaths.length === 0)) {
    return nothing;
  }

  const visibleFlowPaths = model.flowPaths.filter(
    (path) =>
      options.showFlow &&
      options.activeFlowPanelId !== null &&
      path.panelId === options.activeFlowPanelId,
  );

  return html`
    <svg
      class="spv-motion-overlay-svg"
      viewBox=${`0 0 ${model.width} ${model.height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      ${options.showTopology
        ? model.topologyPaths.map((path) =>
            svg`<path
              class="spv-motion-backbone"
              d=${path.d}
              style=${`--spv-motion-color:${path.color}; --spv-motion-opacity:${path.opacity};`}
            ></path>`,
          )
        : nothing}

      ${options.showTopology
        ? model.topologyNodes.map((node) =>
            svg`<circle
              class="spv-motion-node"
              cx=${node.cx}
              cy=${node.cy}
              r=${node.r}
              style=${`--spv-motion-color:${node.color}; --spv-motion-opacity:${node.opacity};`}
            ></circle>`,
          )
        : nothing}

      ${visibleFlowPaths.map((path) =>
        svg`<path
          class="spv-motion-flow"
          d=${path.d}
          style=${`--spv-motion-color:${path.color}; --spv-motion-opacity:${path.opacity}; --spv-flow-duration:${path.durationMs}ms; --spv-flow-delay:${path.delayMs}ms; --spv-flow-travel:${path.travelPx}px; --spv-flow-offset:${path.offsetPx ?? -path.travelPx}px;`}
        ></path>`,
      )}
    </svg>
  `;
};
