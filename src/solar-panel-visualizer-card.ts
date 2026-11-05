import { LitElement, PropertyValues, css, html, nothing, svg } from "lit";
import { buildStubConfig, normalizeConfig, validateConfig } from "./config";
import { formatCustomKpiStateValue } from "./custom-kpi";
import { getForecastEntityId, resolveForecastEntityId } from "./forecast";
import { translate, type TranslationKey } from "./i18n";
import { MotionEngine, type MotionSnapshot } from "./motion-engine";
import { buildMotionOverlayModel, renderMotionOverlay, type MotionOverlayModel } from "./motion-overlay";
import { motionStyles } from "./motion-styles";
import { naturalCompare } from "./natural-sort";
import { deriveArrayState } from "./panel-state";
import {
  choosePanelPerformanceLabel,
  type PanelPerformanceLabelCandidate,
} from "./panel-performance-label";
import {
  aggregateStepwiseSamples,
  bridgeZeroToProductionGaps,
  downsampleSamples,
  filterSamplesByRangeHours,
  type PopupGraphRangeHours,
} from "./popup-graph";
import { buildCompareGraphModel } from "./compare-graph";
import type {
  DerivedArrayState,
  PanelAdvancedMetrics,
  DerivedPanelState,
  HomeAssistant,
  PanelConfig,
  PowerSample,
  SolarPanelVisualizerConfig,
} from "./types";

const formatSummaryValue = (
  value: number | null,
  decimals: number,
  unit: string,
  unavailableText: string,
  locale = "en",
): string => {
  if (value === null) {
    return unavailableText;
  }

  const safeValue = Object.is(value, -0) ? 0 : value;

  return `${new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(safeValue)} ${unit}`;
};

const normalizeNegativeZero = (value: number): number =>
  Object.is(value, -0) ? 0 : value;

const normalizeInlineStatusText = (value: string | undefined): string | undefined => {
  if (!value) {
    return undefined;
  }
  const normalized = value
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return normalized.length > 0 ? normalized : undefined;
};

type HistoryState = "idle" | "loading" | "ready" | "fallback" | "unavailable";
const HISTORY_CACHE_VERSION = 1;
const HISTORY_CACHE_PREFIX = "spv:history:";
const CARD_CONFIG_SYNC_EVENT = "spv-card-config-updated";
const HISTORY_QUERY_RELOAD_THROTTLE_MS = 60_000;
const POPUP_GRAPH_RANGES: PopupGraphRangeHours[] = [1, 6, 24];
const POPUP_GRAPH_MAX_POINTS = 150;
const POPUP_GRAPH_CACHE_TTL_MS = 45_000;
const PANEL_COMPARE_CACHE_TTL_MS = 45_000;
const PANEL_SLOT_LABEL_SAFE_WIDTH_PX = 64;
type PanelCompareMetricKind = "power" | "energy";
const INVALID_ENTITY_STATES = new Set(["unknown", "unavailable", "none", "null", ""]);
const PANEL_COMPARE_COLORS = [
  "#8ed072",
  "#6fc9ff",
  "#ffbf66",
  "#b391ff",
  "#4de3c1",
  "#ff8fb3",
  "#ffd56a",
  "#84a8ff",
  "#7be56e",
  "#f58cff",
];

interface PopupGraphCacheEntry {
  loading: boolean;
  samples: PowerSample[];
  error?: string;
  loadedAt?: number;
}

interface PanelCompareCacheEntry {
  loading: boolean;
  samplesByPanelId: Record<string, PowerSample[]>;
  error?: string;
  loadedAt?: number;
}

interface PanelCompareTarget {
  panelId: string;
  label: string;
  entityId: string;
  scale: number;
}

interface PanelTelemetryMetric {
  label: string;
  entityId?: string;
}

interface PopupGraphRenderOptions {
  overlayEntityId?: string | null;
  overlayStateMessage?: string | null;
  showEnableForecastButton?: boolean;
  fillStartWithFirstSample?: boolean;
  invertPrimaryValues?: boolean;
  primaryValueScale?: number;
}

interface GraphStats {
  min: number | null;
  max: number | null;
  median: number | null;
}

interface GraphHourTick {
  x: number;
  label: string;
}

interface GraphAxisTick {
  leftPercent: number;
  label: string;
}

const toErrorMessage = (error: unknown, fallback = "Unknown recorder error"): string => {
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message.trim();
  }
  if (typeof error === "string" && error.trim().length > 0) {
    return error.trim();
  }
  if (typeof error === "object" && error !== null) {
    const candidate = error as {
      message?: unknown;
      error?: unknown;
      body?: { message?: unknown };
    };
    if (typeof candidate.message === "string" && candidate.message.trim().length > 0) {
      return candidate.message.trim();
    }
    if (typeof candidate.error === "string" && candidate.error.trim().length > 0) {
      return candidate.error.trim();
    }
    if (
      typeof candidate.body?.message === "string" &&
      candidate.body.message.trim().length > 0
    ) {
      return candidate.body.message.trim();
    }
  }
  return fallback;
};

const compactError = (value: string, maxLength = 120): string =>
  value.length <= maxLength ? value : `${value.slice(0, maxLength - 1)}…`;

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

export class SolarPanelVisualizerBaseCard extends LitElement {
  private static _textMeasureContext: CanvasRenderingContext2D | null | undefined;

  static properties = {
    hass: { attribute: false },
    _config: { state: true },
    _derived: { state: true },
    _cardWidth: { state: true },
    _selectedPanelId: { state: true },
    _showLivePowerPopup: { state: true },
    _showEnergyPopup: { state: true },
    _showCustomKpiPopup: { state: true },
    _showSystemHealthPopup: { state: true },
    _popupGraphRangeHours: { state: true },
    _popupGraphCache: { state: true },
    _telemetryGraphPanelId: { state: true },
    _telemetryGraphEntityId: { state: true },
    _telemetryGraphRangeHours: { state: true },
    _kpiCompareExpanded: { state: true },
    _kpiCompareRangeHours: { state: true },
    _kpiCompareCache: { state: true },
  };

  static styles = [css`
    :host {
      display: block;
      width: 100%;
    }

    ha-card {
      --spv-card-bg:
        radial-gradient(circle at top left, rgba(255, 214, 92, 0.18), transparent 38%),
        radial-gradient(circle at top right, rgba(111, 201, 255, 0.16), transparent 35%),
        linear-gradient(150deg, rgba(15, 33, 53, 0.98), rgba(11, 19, 34, 0.96));
      --spv-card-border: rgba(255, 255, 255, 0.1);
      --spv-card-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.05),
        0 12px 30px rgba(0, 0, 0, 0.28);
      --spv-chrome-bg:
        linear-gradient(120deg, rgba(255, 255, 255, 0.02), transparent 30%),
        repeating-linear-gradient(
          125deg,
          rgba(255, 255, 255, 0.02) 0,
          rgba(255, 255, 255, 0.02) 2px,
          transparent 2px,
          transparent 16px
        );
      --spv-text-primary: var(--primary-text-color, rgba(247, 250, 255, 0.96));
      --spv-text-secondary: rgba(255, 255, 255, 0.72);
      --spv-text-muted: rgba(255, 255, 255, 0.56);
      --spv-text-soft: rgba(255, 255, 255, 0.78);
      --spv-surface-bg: rgba(255, 255, 255, 0.055);
      --spv-surface-bg-hover: rgba(255, 255, 255, 0.08);
      --spv-surface-border: rgba(255, 255, 255, 0.08);
      --spv-surface-border-hover: rgba(255, 255, 255, 0.18);
      --spv-panel-bg:
        linear-gradient(160deg, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0.02)),
        linear-gradient(180deg, rgba(10, 17, 29, 0.86), rgba(7, 12, 21, 0.92));
      --spv-panel-highlight:
        linear-gradient(180deg, rgba(255, 255, 255, 0.1), transparent 30%),
        linear-gradient(135deg, rgba(255, 255, 255, 0.05), transparent 48%);
      --spv-panel-hidden-bg:
        linear-gradient(160deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01)),
        linear-gradient(180deg, rgba(10, 17, 29, 0.6), rgba(7, 12, 21, 0.68));
      --spv-panel-hidden-border: rgba(255, 255, 255, 0.18);
      --spv-panel-accent-mix-base: rgba(255, 255, 255, 0.14);
      --spv-panel-hover-mix-base: rgba(255, 255, 255, 0.24);
      --spv-popup-backdrop: rgba(4, 8, 16, 0.72);
      --spv-popup-bg:
        radial-gradient(circle at top right, rgba(255, 212, 84, 0.18), transparent 34%),
        linear-gradient(180deg, rgba(16, 26, 42, 0.98), rgba(10, 18, 30, 0.98));
      --spv-popup-border: rgba(255, 255, 255, 0.09);
      --spv-popup-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.06),
        0 20px 34px rgba(0, 0, 0, 0.36);
      --spv-graph-bg: rgba(8, 14, 25, 0.5);
      --spv-graph-grid: rgba(255, 255, 255, 0.18);
      --spv-forecast-line: rgba(240, 245, 255, 0.84);
      --spv-overlay-bg: rgba(8, 16, 28, 0.62);
      position: relative;
      container-type: inline-size;
      overflow-x: hidden;
      overflow-y: auto;
      padding: 20px;
      width: min(100%, var(--spv-max-width, 980px));
      max-height: var(--spv-max-height, none);
      margin-inline: auto;
      border: 1px solid var(--spv-card-border);
      background: var(--spv-card-bg);
      color: var(--spv-text-primary);
      box-shadow: var(--spv-card-shadow);
      backdrop-filter: blur(18px);
    }

    ha-card[data-spv-theme="light"] {
      --spv-card-bg:
        radial-gradient(circle at top left, rgba(255, 210, 92, 0.22), transparent 38%),
        radial-gradient(circle at top right, rgba(52, 161, 218, 0.16), transparent 36%),
        linear-gradient(150deg, rgba(250, 253, 255, 0.98), rgba(229, 238, 246, 0.96));
      --spv-card-border: rgba(54, 76, 98, 0.18);
      --spv-card-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.84),
        0 12px 28px rgba(31, 48, 68, 0.16);
      --spv-chrome-bg:
        linear-gradient(120deg, rgba(255, 255, 255, 0.34), transparent 32%),
        radial-gradient(circle at bottom right, rgba(52, 161, 218, 0.08), transparent 42%);
      --spv-text-primary: rgba(22, 31, 43, 0.96);
      --spv-text-secondary: rgba(22, 31, 43, 0.74);
      --spv-text-muted: rgba(22, 31, 43, 0.56);
      --spv-text-soft: rgba(22, 31, 43, 0.78);
      --spv-surface-bg: rgba(255, 255, 255, 0.56);
      --spv-surface-bg-hover: rgba(255, 255, 255, 0.72);
      --spv-surface-border: rgba(50, 72, 94, 0.14);
      --spv-surface-border-hover: rgba(50, 72, 94, 0.28);
      --spv-panel-bg:
        linear-gradient(160deg, rgba(255, 255, 255, 0.82), rgba(238, 245, 251, 0.92)),
        linear-gradient(180deg, rgba(248, 252, 255, 0.96), rgba(224, 235, 245, 0.92));
      --spv-panel-highlight:
        linear-gradient(180deg, rgba(255, 255, 255, 0.48), transparent 34%),
        linear-gradient(135deg, rgba(37, 58, 82, 0.04), transparent 48%);
      --spv-panel-hidden-bg:
        linear-gradient(180deg, rgba(240, 247, 252, 0.62), rgba(224, 235, 245, 0.72));
      --spv-panel-hidden-border: rgba(55, 76, 98, 0.28);
      --spv-panel-accent-mix-base: rgba(40, 62, 84, 0.18);
      --spv-panel-hover-mix-base: rgba(40, 62, 84, 0.34);
      --spv-popup-backdrop: rgba(32, 45, 60, 0.28);
      --spv-popup-bg:
        radial-gradient(circle at top right, rgba(255, 212, 84, 0.22), transparent 34%),
        linear-gradient(180deg, rgba(250, 253, 255, 0.98), rgba(234, 242, 249, 0.98));
      --spv-popup-border: rgba(50, 72, 94, 0.16);
      --spv-popup-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.82),
        0 18px 34px rgba(31, 48, 68, 0.22);
      --spv-graph-bg: rgba(237, 244, 250, 0.72);
      --spv-graph-grid: rgba(36, 55, 74, 0.18);
      --spv-forecast-line: rgba(48, 68, 92, 0.78);
      --spv-overlay-bg: rgba(246, 251, 255, 0.78);
    }

    .chrome {
      position: absolute;
      inset: 0;
      pointer-events: none;
      background: var(--spv-chrome-bg);
      opacity: 0.45;
    }

    .spv-overlay-anchor {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      pointer-events: none;
    }

    .header {
      position: relative;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 18px;
    }

    .header-copy {
      display: grid;
      gap: 6px;
      min-width: 0;
      flex: 1 1 auto;
    }

    .topline {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
      padding-right: 0;
    }

    .eyebrow {
      flex: 1;
      font-size: 0.72rem;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--spv-text-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .system-health {
      appearance: none;
      font: inherit;
      position: absolute;
      top: 0;
      right: 0;
      z-index: 3;
      display: inline-flex;
      align-items: center;
      padding: 3px 10px;
      border-radius: 999px;
      border: 1px solid var(--health-color, rgba(142, 208, 114, 0.5));
      background: color-mix(in srgb, var(--health-color, #8ed072) 18%, transparent);
      color: var(--health-color, #8ed072);
      font-size: 0.68rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      white-space: nowrap;
      line-height: 1.35;
      cursor: pointer;
      transition: filter 160ms ease, transform 160ms ease;
    }

    .system-health:hover {
      filter: brightness(1.08);
      transform: translateY(-1px);
    }

    .title {
      margin: 0;
      font-size: 1.45rem;
      line-height: 1.1;
      letter-spacing: 0.01em;
      font-weight: 700;
    }

    .subtitle {
      margin: 0;
      color: var(--spv-text-secondary);
      font-size: 0.92rem;
    }

    .subtitle-hint {
      color: var(--spv-text-muted);
      font-size: 0.84rem;
    }

    .summary {
      display: grid;
      gap: 10px;
      margin-top: 30px;
      min-width: min(100%, 360px);
    }

    .summary.with-custom {
      grid-template-columns:
        minmax(84px, 1fr)
        minmax(84px, 1fr)
        minmax(70px, 0.72fr)
        minmax(84px, 1fr);
    }

    .summary.without-custom {
      grid-template-columns:
        minmax(84px, 1fr)
        minmax(84px, 1fr)
        minmax(70px, 0.72fr);
    }

    .summary-chip {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      gap: 3px;
      text-align: left;
      border-radius: 16px;
      padding: 10px 10px 10px 12px;
      background: var(--spv-surface-bg);
      border: 1px solid var(--spv-surface-border);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
    }

    .summary-chip.summary-button {
      appearance: none;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      font: inherit;
      color: inherit;
      text-align: left;
      margin: 0;
      width: 100%;
      padding: 10px 10px 10px 12px;
      cursor: pointer;
      transition: border-color 160ms ease, background 160ms ease;
    }

    .summary-chip.summary-button:hover {
      border-color: var(--spv-surface-border-hover);
      background: var(--spv-surface-bg-hover);
    }

    .summary-chip.alerts-chip {
      padding: 10px 12px 10px 12px;
    }

    .summary-chip.alerts-chip .summary-label {
      margin-bottom: 6px;
    }

    .summary-chip.alerts-chip .summary-value {
      font-size: 0.96rem;
      margin-top: 4px;
    }

    .summary-label {
      display: block;
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      line-height: 1.2;
      color: var(--spv-text-muted);
      margin-bottom: 4px;
    }

    .summary-value {
      display: block;
      font-size: 1rem;
      font-weight: 700;
      line-height: 1.24;
      max-width: 100%;
    }

    .summary-value.custom-kpi-value {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .grid {
      position: relative;
      display: grid;
      gap: 10px;
      margin-top: 14px;
      align-items: stretch;
    }

    .panel {
      --spv-slot-safe-width: 64px;
      --spv-slot-dock-height: clamp(24px, calc(26px * var(--spv-panel-scale, 1)), 32px);
      --spv-slot-dock-clearance: calc(var(--spv-slot-dock-height) + 8px);
      position: relative;
      container-type: inline-size;
      display: grid;
      grid-template-rows: auto minmax(0, 1fr);
      align-content: stretch;
      overflow: hidden;
      width: min(100%, var(--spv-panel-max-width, 100%));
      justify-self: center;
      height: var(--spv-panel-height, clamp(96px, 14vw, 136px));
      border: 1px solid var(--panel-border-accent, var(--spv-panel-hidden-border));
      border-radius: 18px;
      padding: 10px;
      text-align: left;
      color: inherit;
      background: var(--spv-panel-bg);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.08),
        0 10px 24px rgba(0, 0, 0, 0.18),
        0 0 calc(1px + var(--panel-intensity, 0.4) * 3px) var(--panel-glow-accent, transparent);
      cursor: pointer;
      transition:
        transform 180ms ease,
        border-color 180ms ease,
        box-shadow 180ms ease;
    }

    .panel:hover {
      transform: translateY(-2px);
      border-color: color-mix(
        in srgb,
        var(--panel-border-accent, rgba(255, 255, 255, 0.16)) 86%,
        var(--spv-panel-hover-mix-base)
      );
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.09),
        0 14px 28px rgba(0, 0, 0, 0.24),
        0 0 calc(2px + var(--panel-intensity, 0.4) * 4px) var(--panel-glow-accent, transparent);
    }

    .panel::before {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: var(--spv-panel-highlight);
      pointer-events: none;
    }

    .panel::after {
      content: "";
      position: absolute;
      inset: auto -22% -56% auto;
      width: 188px;
      height: 188px;
      border-radius: 50%;
      background: radial-gradient(circle, var(--panel-fill-accent, transparent) 0%, transparent 72%);
      opacity: 1;
      filter: blur(14px);
      pointer-events: none;
    }

    .panel.error,
    .panel.inverter,
    .panel.deviation,
    .panel.offline,
    .panel.unconfigured,
    .panel.disabled {
      cursor: pointer;
    }

    .panel.hidden-slot {
      background: var(--spv-panel-hidden-bg);
      border-style: dashed;
      border-color: var(--spv-panel-hidden-border);
      cursor: default;
    }

    .panel.hidden-slot:hover {
      transform: none;
    }

    .panel.hidden-slot .panel-name,
    .panel.hidden-slot .power,
    .panel.hidden-slot .panel-detail-scroll,
    .panel.hidden-slot .performance,
    .panel.hidden-slot .energy,
    .panel.hidden-slot .inverter-status {
      visibility: hidden;
    }

    .slot {
      position: absolute;
      right: 7px;
      bottom: 7px;
      z-index: 3;
      display: inline-flex;
      align-items: center;
      justify-content: flex-end;
      gap: 5px;
      box-sizing: border-box;
      padding: 2px 3px 2px 10px;
      font-size: clamp(0.66rem, calc(0.68rem * var(--spv-panel-scale, 1)), 0.84rem);
      text-transform: uppercase;
      letter-spacing: 0.12em;
      text-align: right;
      color: var(--spv-text-muted);
      text-shadow: 0 1px 8px color-mix(in srgb, var(--spv-surface-bg) 90%, transparent);
      white-space: nowrap;
      isolation: isolate;
    }

    .slot.has-string-label {
      max-width: calc(100% - 14px);
      overflow: hidden;
      text-overflow: ellipsis;
      text-transform: none;
      letter-spacing: 0.04em;
    }

    .status {
      position: absolute;
      top: 8px;
      left: 8px;
      display: inline-flex;
      align-items: center;
      z-index: 2;
      padding: 4px 8px;
      width: max-content;
      max-width: calc(100% - 16px);
      border-radius: 999px;
      font-size: clamp(0.64rem, calc(0.66rem * var(--spv-panel-scale, 1)), 0.82rem);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      background: var(--spv-surface-bg);
      border: 1px solid var(--spv-surface-border);
    }

    .panel-primary {
      position: relative;
      z-index: 1;
      align-self: stretch;
      min-width: 0;
    }

    .panel-name {
      position: relative;
      z-index: 1;
      margin: 26px 0 5px;
      font-size: clamp(0.8rem, calc(0.94rem * var(--spv-panel-scale, 1)), 1.26rem);
      line-height: 1.15;
      font-weight: 600;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .power {
      position: relative;
      z-index: 1;
      font-size: clamp(0.96rem, calc(1.18rem * var(--spv-panel-scale, 1)), 1.76rem);
      line-height: 1.05;
      font-weight: 750;
      margin: 0;
      text-wrap: pretty;
    }

    .panel.has-performance .power {
      font-size: clamp(0.92rem, calc(1.08rem * var(--spv-panel-scale, 1)), 1.64rem);
    }

    .panel-detail-scroll {
      position: relative;
      z-index: 1;
      align-self: stretch;
      box-sizing: border-box;
      min-height: 0;
      width: 100%;
      max-width: 100%;
      margin: 1px 0 0;
      padding-right: 8px;
      padding-bottom: 0;
      overflow-x: hidden;
      overflow-y: hidden;
      overscroll-behavior: contain;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    .panel-detail-scroll::-webkit-scrollbar {
      display: none;
      width: 0;
      height: 0;
    }

    .panel-detail-scroll::-webkit-scrollbar-track {
      background: transparent;
    }

    .panel-detail-scroll::-webkit-scrollbar-thumb {
      border-radius: 999px;
      background: color-mix(in srgb, var(--spv-text-muted) 36%, transparent);
    }

    .panel.has-detail-overflow .panel-detail-scroll {
      padding-bottom: var(--spv-slot-dock-clearance);
      overflow-y: auto;
      scrollbar-width: none;
      -ms-overflow-style: none;
      -webkit-mask-image: linear-gradient(to bottom, #000 0, #000 calc(100% - 24px), transparent 100%);
      mask-image: linear-gradient(to bottom, #000 0, #000 calc(100% - 24px), transparent 100%);
      -webkit-mask-repeat: no-repeat;
      mask-repeat: no-repeat;
    }

    .panel.has-detail-overflow .panel-detail-scroll::-webkit-scrollbar {
      display: none;
      width: 0;
      height: 0;
    }

    .panel-detail-scroll:empty {
      display: none;
    }

    .energy {
      position: relative;
      z-index: 1;
      margin: 3px 0 0;
      color: var(--spv-text-secondary);
      font-size: clamp(0.66rem, calc(0.78rem * var(--spv-panel-scale, 1)), 1rem);
      line-height: 1.2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .performance {
      position: relative;
      z-index: 1;
      margin: 3px 0 0;
      max-width: 100%;
      color: var(--spv-text-soft);
      font-size: clamp(0.62rem, calc(0.72rem * var(--spv-panel-scale, 1)), 0.96rem);
      line-height: 1.2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .inverter-status {
      position: relative;
      z-index: 1;
      margin: 4px 0 0;
      color: var(--spv-text-soft);
      font-size: clamp(0.62rem, calc(0.72rem * var(--spv-panel-scale, 1)), 0.92rem);
      line-height: 1.2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .reason {
      font-size: 0.78rem;
      color: var(--spv-text-secondary);
    }

    .spv-popup-backdrop {
      position: fixed;
      inset: 0;
      display: grid;
      place-items: center;
      padding: clamp(8px, 2vw, 16px);
      overflow: hidden;
      background: var(--spv-popup-backdrop);
      backdrop-filter: blur(10px);
      z-index: 20;
    }

    .spv-popup {
      box-sizing: border-box;
      inline-size: min(560px, calc(100% - 8px));
      max-block-size: min(760px, calc(100% - 8px));
      overflow: auto;
      overscroll-behavior: contain;
      border-radius: 24px;
      border: 1px solid var(--spv-popup-border);
      background: var(--spv-popup-bg);
      box-shadow: var(--spv-popup-shadow);
      padding: 16px;
    }

    .spv-popup-close-anchor {
      position: sticky;
      top: 8px;
      z-index: 30;
      width: 36px;
      height: 36px;
      margin: 0 0 -36px auto;
      display: flex;
      justify-content: flex-end;
      pointer-events: auto;
    }

    .spv-popup-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 14px;
      margin-bottom: 14px;
      padding-right: 48px;
    }

    .spv-popup-title {
      margin: 0;
      font-size: 1.2rem;
    }

    .spv-popup-close {
      flex: 0 0 auto;
      border: 0;
      border-radius: 999px;
      background: var(--spv-surface-bg);
      color: inherit;
      display: grid;
      place-items: center;
      width: 36px;
      height: 36px;
      margin-left: auto;
      cursor: pointer;
      touch-action: manipulation;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
      margin-top: 2px;
      margin-bottom: 12px;
    }

    .detail-card {
      padding: 12px;
      border-radius: 16px;
      background: var(--spv-surface-bg);
      border: 1px solid var(--spv-surface-border);
    }

    .detail-card-source {
      grid-column: 1 / -1;
    }

    .detail-label {
      display: block;
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--spv-text-muted);
      margin-bottom: 4px;
    }

    .detail-value {
      display: block;
      font-size: 1rem;
      font-weight: 700;
    }

    .detail-information {
      margin-top: 12px;
    }

    .telemetry-section {
      margin-top: 12px;
      display: grid;
      gap: 10px;
    }

    .telemetry-group {
      display: grid;
      gap: 8px;
    }

    .telemetry-title {
      margin: 0;
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--spv-text-muted);
    }

    .telemetry-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }

    .telemetry-card {
      overflow: hidden;
    }

    .telemetry-card.is-open {
      grid-column: 1 / -1;
    }

    .telemetry-card.is-expandable {
      padding: 0;
    }

    .telemetry-card-toggle {
      appearance: none;
      border: 0;
      background: transparent;
      color: inherit;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      width: 100%;
      min-width: 0;
      padding: 12px;
      text-align: left;
      font: inherit;
      cursor: pointer;
    }

    .telemetry-card-main {
      min-width: 0;
    }

    .telemetry-card-affordance {
      display: inline-grid;
      place-items: center;
      flex: 0 0 auto;
      width: 28px;
      height: 28px;
      border-radius: 999px;
      border: 1px solid var(--spv-surface-border);
      color: var(--spv-text-muted);
      background: color-mix(in srgb, var(--spv-surface-bg) 62%, transparent);
      line-height: 1;
    }

    .telemetry-card.is-open .telemetry-card-affordance {
      color: var(--spv-text-primary);
      border-color: var(--spv-surface-border-hover);
      background: var(--spv-surface-bg-hover);
    }

    .telemetry-card-graph {
      border-top: 1px solid var(--spv-surface-border);
      padding: 10px 12px 12px;
      display: grid;
      gap: 8px;
    }

    .telemetry-empty {
      margin: 0;
      font-size: 0.82rem;
      line-height: 1.35;
      color: var(--spv-text-secondary);
    }

    .info-lines {
      display: grid;
      gap: 6px;
    }

    .info-line {
      margin: 0;
      font-size: 0.82rem;
      line-height: 1.35;
      color: var(--spv-text-soft);
      white-space: normal;
      overflow-wrap: anywhere;
    }

    .system-health-item {
      margin: 0;
      font-size: 0.86rem;
      line-height: 1.4;
      color: var(--spv-text-soft);
      white-space: normal;
      overflow-wrap: anywhere;
    }

    .graph-section {
      margin: 0 0 14px;
      border-radius: 16px;
      border: 1px solid var(--spv-surface-border);
      background: color-mix(in srgb, var(--spv-surface-bg) 54%, transparent);
      padding: 10px;
      display: grid;
      gap: 8px;
    }

    .graph-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }

    .graph-title {
      font-size: 0.76rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--spv-text-muted);
    }

    .range-chips {
      display: inline-flex;
      gap: 6px;
      flex-wrap: wrap;
    }

    .range-chip {
      border: 1px solid var(--spv-surface-border);
      background: var(--spv-surface-bg);
      color: var(--spv-text-soft);
      border-radius: 999px;
      padding: 4px 8px;
      font-size: 0.72rem;
      line-height: 1;
      cursor: pointer;
    }

    .range-chip.active {
      border-color: var(--spv-surface-border-hover);
      background: var(--spv-surface-bg-hover);
      color: var(--spv-text-primary);
    }

    .graph-box {
      position: relative;
      border-radius: 12px;
      overflow: hidden;
      background: var(--spv-graph-bg);
      border: 1px solid var(--spv-surface-border);
    }

    .graph-hour-line {
      stroke: var(--spv-graph-grid);
      stroke-width: 1;
      stroke-dasharray: 3 3;
      opacity: 0.35;
    }

    .graph-svg {
      width: 100%;
      height: clamp(96px, 18vh, 132px);
      display: block;
    }

    .graph-meta {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      font-size: 0.74rem;
      color: var(--spv-text-secondary);
    }

    .graph-stat-line {
      stroke-width: 1.3;
      stroke-dasharray: 5 4;
      opacity: 0.64;
    }

    .graph-stat-max {
      stroke: rgba(255, 150, 103, 0.95);
    }

    .graph-stat-median {
      stroke: rgba(120, 205, 255, 0.95);
    }

    .graph-stat-min {
      stroke: rgba(207, 220, 238, 0.75);
    }

    .graph-overlay {
      position: absolute;
      left: 10px;
      display: inline-flex;
      align-items: center;
      min-height: 16px;
      padding: 0 6px;
      border-radius: 999px;
      font-size: 0.66rem;
      letter-spacing: 0.02em;
      color: var(--spv-text-primary);
      background: var(--spv-overlay-bg);
      border: 1px solid var(--spv-surface-border);
      backdrop-filter: blur(2px);
      pointer-events: none;
      z-index: 3;
    }

    .graph-overlay-max {
      top: 8px;
    }

    .graph-overlay-median {
      top: 50%;
      transform: translateY(-50%);
      background: color-mix(in srgb, var(--spv-overlay-bg) 88%, transparent);
    }

    .graph-overlay-min {
      bottom: 8px;
    }

    .graph-axis {
      position: relative;
      height: 14px;
      margin-top: 2px;
    }

    .graph-axis-label {
      position: absolute;
      transform: translateX(-50%);
      font-size: 0.66rem;
      letter-spacing: 0.03em;
      color: var(--spv-text-muted);
      white-space: nowrap;
      line-height: 1;
      user-select: none;
    }

    .graph-state {
      box-sizing: border-box;
      display: grid;
      place-items: center;
      min-height: clamp(96px, 18vh, 132px);
      margin: 0;
      border-radius: 12px;
      border: 1px solid var(--spv-surface-border);
      background: var(--spv-graph-bg);
      font-size: 0.82rem;
      color: var(--spv-text-secondary);
      padding: 12px;
      text-align: center;
    }

    .graph-forecast-state {
      margin: 0;
      font-size: 0.76rem;
      color: var(--spv-text-muted);
      padding: 0 2px 2px;
    }

    .forecast-enable-row {
      display: flex;
      justify-content: flex-start;
      margin-top: 2px;
    }

    .inline-button {
      appearance: none;
      border: 1px solid var(--spv-surface-border);
      border-radius: 999px;
      background: var(--spv-surface-bg);
      color: inherit;
      padding: 6px 10px;
      font: inherit;
      font-size: 0.74rem;
      line-height: 1;
      cursor: pointer;
      transition: background 160ms ease, border-color 160ms ease;
    }

    .inline-button:hover {
      background: var(--spv-surface-bg-hover);
      border-color: var(--spv-surface-border-hover);
    }

    .compare-toggle-row {
      display: flex;
      justify-content: flex-start;
      margin-top: 12px;
      margin-bottom: 10px;
    }

    .compare-legend {
      display: grid;
      gap: 6px;
      margin-top: 2px;
    }

    .compare-legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.78rem;
      color: var(--spv-text-soft);
      min-width: 0;
    }

    .compare-legend-chip {
      flex: 0 0 auto;
      width: 10px;
      height: 10px;
      border-radius: 999px;
      border: 1px solid var(--spv-surface-border-hover);
    }

    .compare-legend-label {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .compare-diagnostics {
      margin-top: 8px;
      padding: 8px;
      border-radius: 10px;
      border: 1px solid rgba(255, 147, 118, 0.24);
      background: rgba(255, 147, 118, 0.08);
      display: grid;
      gap: 4px;
      font-size: 0.72rem;
      color: rgba(255, 232, 224, 0.9);
    }

    .compare-diagnostics-title {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: rgba(255, 188, 168, 0.92);
    }

    .compare-diagnostics-row {
      line-height: 1.35;
      color: rgba(255, 231, 221, 0.9);
      word-break: break-word;
    }

    .inline-config {
      display: grid;
      gap: 10px;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid var(--spv-surface-border);
    }

    @container (max-width: 260px) {
      .detail-grid {
        grid-template-columns: 1fr;
      }

      .telemetry-grid {
        grid-template-columns: 1fr;
      }
    }

    @container (max-width: 860px) {
      .grid {
        gap: 8px;
      }

      .panel {
        height: max(104px, min(var(--spv-panel-height, 124px), 172px));
      }
    }

    @container (max-width: 560px) {
      .header {
        display: grid;
        grid-template-columns: 1fr;
        gap: 10px;
      }

      .summary {
        margin-top: 0;
        min-width: 0;
      }

      .summary.with-custom {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }

      .summary.without-custom {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }

      .summary-chip {
        padding: 8px 8px 8px 10px;
      }

      .summary-chip.summary-button {
        padding: 8px 8px 8px 10px;
      }

      .summary-chip.alerts-chip {
        padding: 8px 8px 8px 10px;
      }

      .summary-value.custom-kpi-value {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        white-space: normal;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 1.2;
      }

      .header-copy > .subtitle,
      .subtitle-hint {
        display: none;
      }

      .eyebrow {
        font-size: 0.66rem;
        letter-spacing: 0.09em;
      }

      .topline {
        padding-right: 118px;
      }

      .grid {
        gap: 10px;
        margin-top: 12px;
      }

      .panel {
        height: max(100px, min(var(--spv-panel-height, 120px), 156px));
        border-radius: 16px;
        padding: 9px;
      }
    }

  `, motionStyles];

  declare hass?: HomeAssistant;
  private _config?: SolarPanelVisualizerConfig;
  private _derived?: DerivedArrayState;
  private _cardWidth = 0;
  private _selectedPanelId: string | null = null;
  private _showLivePowerPopup = false;
  private _showEnergyPopup = false;
  private _showCustomKpiPopup = false;
  private _showSystemHealthPopup = false;
  private _dragSourceSlotIndex: number | null = null;
  private _resizeObserver?: ResizeObserver;
  private _historyByEntityId: Record<string, PowerSample[]> = {};
  private _historyState: HistoryState = "idle";
  private _historyStateReason?: string;
  private _historySignature = "";
  private _historyQuerySignature = "";
  private _historyLastLoadMs = 0;
  private _historyLoadToken = 0;
  private _popupGraphRangeHours: PopupGraphRangeHours = 6;
  private _popupGraphCache: Record<string, PopupGraphCacheEntry> = {};
  private _popupGraphRequestToken = 0;
  private _popupGraphLatestTokenByKey: Record<string, number> = {};
  private _telemetryGraphPanelId: string | null = null;
  private _telemetryGraphEntityId: string | null = null;
  private _telemetryGraphRangeHours: PopupGraphRangeHours = 6;
  private _kpiCompareExpanded: Record<PanelCompareMetricKind, boolean> = {
    power: false,
    energy: false,
  };
  private _kpiCompareRangeHours: Record<PanelCompareMetricKind, PopupGraphRangeHours> = {
    power: 6,
    energy: 6,
  };
  private _kpiCompareCache: Record<string, PanelCompareCacheEntry> = {};
  private _kpiCompareRequestToken = 0;
  private _kpiCompareLatestTokenByKey: Record<string, number> = {};
  private _persistConfigToken = 0;
  private _sourceConfigRef: unknown;
  private _popupScrollRestoreToken = 0;
  private _popupScrollRestore:
    | {
        token: number;
        popup: HTMLElement;
        top: number;
        left: number;
        expiresAt: number;
        frameId: number | null;
        framesRemaining: number;
      }
    | null = null;
  private readonly _motionEngine = new MotionEngine(() => this.requestUpdate());
  private _motionOverlayModel: MotionOverlayModel | null = null;
  private _motionOverlaySignature = "";
  private _overlayMeasureFrame: number | null = null;
  private _panelDetailOverflowFrame: number | null = null;
  private _activePulseColor = "rgba(111, 201, 255, 0.72)";
  private _overlayResizeObserver?: ResizeObserver;
  private readonly _onMotionAnimationEnd = (event: Event): void => {
    const animationEvent = event as AnimationEvent;
    if (animationEvent.animationName !== "spv-flow-pulse") {
      return;
    }
    const target = animationEvent.target;
    if (!(target instanceof SVGPathElement)) {
      return;
    }
    if (!target.classList.contains("spv-motion-flow")) {
      return;
    }
    if (this._hasPopupOpen()) {
      return;
    }
    this._motionEngine.completeFlowPulse();
  };

  public static async getConfigElement(): Promise<HTMLElement> {
    await import("./solar-panel-visualizer-editor");
    return document.createElement("solar-panel-visualizer-card-editor");
  }

  public static getStubConfig(): SolarPanelVisualizerConfig {
    return buildStubConfig();
  }

  protected _normalizeCardConfig(
    config: Partial<SolarPanelVisualizerConfig>,
  ): SolarPanelVisualizerConfig {
    return normalizeConfig(config);
  }

  protected _renderCardOverlay(_derived: DerivedArrayState) {
    const config = this._getCurrentConfig();
    const motionState = this._motionEngine.getState();
    return renderMotionOverlay(this._motionOverlayModel, {
      showTopology:
        Boolean(config?.motion_enabled ?? true) &&
        Boolean(config?.motion_power_flow ?? true),
      showFlow: motionState.powerFlowActive,
      activeFlowPanelId: motionState.flowPulsePanelId,
      powerImpactActive: motionState.kpiShimmers.has("power"),
    });
  }

  protected _afterBaseUpdated(_changedProperties: PropertyValues<this>): void {
    const config = this._getCurrentConfig();
    const derived = this._getCurrentDerived();
    if (!config || !derived) {
      return;
    }

    const busbarsEnabled =
      (config.motion_enabled ?? true) &&
      (config.motion_power_flow ?? true);
    this.toggleAttribute("data-spv-busbars", busbarsEnabled);
    this._motionEngine.update(this._buildMotionFlags(config), this._buildMotionSnapshot(derived));
    this._syncActivePulseColor(derived);
    this._scheduleOverlayMeasure();
  }

  protected _getPanelExtraClass(panel: DerivedPanelState): string {
    const classes: string[] = [];
    if (this._motionEngine.getState().alertRipples.has(panel.id)) {
      classes.push("spv-motion-alert-ripple");
    }
    return classes.join(" ");
  }

  protected _getSummaryExtraClass(
    kind: "power" | "energy" | "alerts" | "custom",
  ): string {
    if (kind === "alerts" || kind === "custom") {
      return "";
    }
    if (!this._motionEngine.getState().kpiShimmers.has(kind)) {
      return "";
    }
    return kind === "power"
      ? "spv-motion-power-impact"
      : "spv-motion-neutral-impact";
  }

  protected _getSummaryExtraStyle(
    kind: "power" | "energy" | "alerts" | "custom",
  ): string {
    if (kind !== "power") {
      return "";
    }
    return `--spv-shimmer-color:${this._activePulseColor};`;
  }

  protected _getCurrentConfig(): SolarPanelVisualizerConfig | undefined {
    return this._config;
  }

  protected _getCurrentDerived(): DerivedArrayState | undefined {
    return this._derived;
  }

  protected _hasPopupOpen(): boolean {
    return Boolean(
      this._selectedPanelId ||
        this._showLivePowerPopup ||
        this._showEnergyPopup ||
        this._showCustomKpiPopup ||
        this._showSystemHealthPopup,
    );
  }

  protected _t(
    key: TranslationKey,
    params?: Record<string, string | number>,
  ): string {
    return translate(this.hass, key, params);
  }

  private _buildMotionFlags(config: SolarPanelVisualizerConfig) {
    return {
      enabled: config.motion_enabled ?? true,
      powerFlow: config.motion_power_flow ?? true,
      updateShimmer: config.motion_update_shimmer ?? true,
      alertRipple: config.motion_alert_ripple ?? true,
    };
  }

  private _buildMotionSnapshot(derived: DerivedArrayState): MotionSnapshot {
    const panelPowers: MotionSnapshot["panelPowers"] = {};
    const panelStatuses: MotionSnapshot["panelStatuses"] = {};

    for (const panel of derived.panels) {
      panelPowers[panel.id] = panel.power;
      panelStatuses[panel.id] = panel.status;
    }

    return {
      totalPower: derived.totalPower,
      popupOpen: this._hasPopupOpen(),
      powerKpiValue:
        this._resolveSummaryPower(derived).value?.toString() ?? this._t("common.unavailable"),
      energyKpiValue:
        this._resolveSummaryEnergy(derived).value?.toString() ?? this._t("common.unavailable"),
      panelPowers,
      panelStatuses,
    };
  }

  private _scheduleOverlayMeasure(): void {
    if (this._overlayMeasureFrame !== null || typeof window === "undefined") {
      return;
    }
    this._overlayMeasureFrame = window.requestAnimationFrame(() => {
      this._overlayMeasureFrame = null;
      this._measureOverlay();
    });
  }

  private _syncActivePulseColor(derived: DerivedArrayState): void {
    const pulsePanelId = this._motionEngine.getState().flowPulsePanelId;
    const panel = derived.panels.find((entry) => entry.id === pulsePanelId);
    if (panel?.accentColor) {
      this._activePulseColor = panel.accentColor;
    }
  }

  private _measureOverlay(): void {
    const config = this._getCurrentConfig();
    const derived = this._getCurrentDerived();
    const shadowRoot = this.shadowRoot;
    if (!config || !derived || !shadowRoot) {
      return;
    }

    const nextModel = buildMotionOverlayModel(this, shadowRoot, config, derived);
    const nextSignature = JSON.stringify(nextModel);
    if (nextSignature === this._motionOverlaySignature) {
      return;
    }
    this._motionOverlayModel = nextModel;
    this._motionOverlaySignature = nextSignature;
    this.requestUpdate();
  }

  private _startOverlayResizeObserver(): void {
    if (typeof ResizeObserver === "undefined") {
      return;
    }
    this._overlayResizeObserver?.disconnect();
    this._overlayResizeObserver = new ResizeObserver(() => this._scheduleOverlayMeasure());
    this._overlayResizeObserver.observe(this);
  }

  private _resolveDefaultTitle(configTitle: string | undefined): string {
    if (!configTitle || configTitle.trim().length === 0) {
      return this._t("card.default_title");
    }
    return configTitle === "Solar Array" ? this._t("card.default_title") : configTitle;
  }

  private _resolveCustomKpiTitle(
    value: string,
  ): string {
    return value === "Custom KPI" ? this._t("card.summary.custom_default_title") : value;
  }

  private _panelStatusLabel(status: DerivedPanelState["status"]): string {
    return this._t(`card.panel.status.${status}` as TranslationKey);
  }

  public connectedCallback(): void {
    super.connectedCallback();
    this._startResizeObserver();
    this._startOverlayResizeObserver();
  }

  public disconnectedCallback(): void {
    if (this._overlayMeasureFrame !== null && typeof window !== "undefined") {
      window.cancelAnimationFrame(this._overlayMeasureFrame);
      this._overlayMeasureFrame = null;
    }
    if (this._panelDetailOverflowFrame !== null && typeof window !== "undefined") {
      window.cancelAnimationFrame(this._panelDetailOverflowFrame);
      this._panelDetailOverflowFrame = null;
    }
    this._overlayResizeObserver?.disconnect();
    this._overlayResizeObserver = undefined;
    this.renderRoot.removeEventListener("animationend", this._onMotionAnimationEnd, true);
    this._clearPopupScrollRestore();
    this._motionEngine.destroy();
    this._resizeObserver?.disconnect();
    this._resizeObserver = undefined;
    super.disconnectedCallback();
  }

  protected firstUpdated(changedProperties: PropertyValues<this>): void {
    super.firstUpdated(changedProperties);
    this.renderRoot.addEventListener("animationend", this._onMotionAnimationEnd, true);
  }

  public setConfig(config: Partial<SolarPanelVisualizerConfig>): void {
    const errors = validateConfig(config);
    if (errors.length > 0) {
      throw new Error(errors.join(" "));
    }

    const normalizedConfig = this._normalizeCardConfig(config);
    const sameConfigEcho =
      this._config !== undefined && this._configsEqual(this._config, normalizedConfig);

    this._sourceConfigRef = config;
    this._config = normalizedConfig;
    if (!sameConfigEcho) {
      this._historySignature = "";
      this._historyQuerySignature = "";
      this._historyLastLoadMs = 0;
      this._historyLoadToken = 0;
      this._popupGraphRangeHours = 6;
      this._popupGraphCache = {};
      this._popupGraphLatestTokenByKey = {};
      this._kpiCompareExpanded = { power: false, energy: false };
      this._kpiCompareRangeHours = { power: 6, energy: 6 };
      this._kpiCompareCache = {};
      this._kpiCompareLatestTokenByKey = {};
      this._showLivePowerPopup = false;
      this._showEnergyPopup = false;
      this._showCustomKpiPopup = false;
      this._showSystemHealthPopup = false;
      this._selectedPanelId = null;
    }
    this._refreshDerived();
    this._ensureHistoryLoaded();
  }

  private _configsEqual(
    currentConfig: SolarPanelVisualizerConfig,
    nextConfig: SolarPanelVisualizerConfig,
  ): boolean {
    return JSON.stringify(currentConfig) === JSON.stringify(nextConfig);
  }

  public getCardSize(): number {
    const panelsCount = this._config?.panels.length ?? 6;
    const configColumns = this._config?.columns ?? 3;
    const renderedColumns = this._computeRenderedColumns(
      configColumns,
      this._config?.max_card_width_px,
    );
    const renderedRows = this._computeRenderedRows(panelsCount, renderedColumns);
    const panelHeightPx = this._computePanelHeightPx(
      renderedRows,
      this._config?.max_card_height_px,
      renderedColumns,
      this._config?.max_card_width_px,
    );
    const estimatedHeight = 220 + renderedRows * panelHeightPx + Math.max(0, renderedRows - 1) * 10;
    const cappedHeight = this._config?.max_card_height_px
      ? Math.min(estimatedHeight, this._config.max_card_height_px)
      : estimatedHeight;
    return Math.max(5, Math.ceil(cappedHeight / 50));
  }

  protected updated(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has("hass")) {
      this._syncLiveSamplesFromHass();
      this._ensureHistoryLoaded();
      this._refreshDerived();
    }
    if (this._derived) {
      if (this._showLivePowerPopup && this._kpiCompareExpanded.power) {
        void this._ensurePanelCompareLoaded(
          this._derived,
          "power",
          this._kpiCompareRangeHours.power,
        );
      }
      if (this._showEnergyPopup && this._kpiCompareExpanded.energy) {
        void this._ensurePanelCompareLoaded(
          this._derived,
          "energy",
          this._kpiCompareRangeHours.energy,
        );
      }
    }
    this._afterBaseUpdated(changedProperties);
    this._schedulePanelDetailOverflowSync();
  }

  private _schedulePanelDetailOverflowSync(): void {
    if (this._panelDetailOverflowFrame !== null || typeof window === "undefined") {
      return;
    }

    this._panelDetailOverflowFrame = window.requestAnimationFrame(() => {
      this._panelDetailOverflowFrame = null;
      this._syncPanelDetailOverflow();
    });
  }

  private _syncPanelDetailOverflow(): void {
    const detailAreas = this.renderRoot.querySelectorAll<HTMLElement>(".panel-detail-scroll");
    detailAreas.forEach((detailArea) => {
      const panel = detailArea.closest<HTMLElement>(".panel");
      if (!panel) {
        return;
      }

      if (panel.classList.contains("hidden-slot") || detailArea.childElementCount === 0) {
        panel.classList.remove("has-detail-overflow");
        detailArea.scrollTop = 0;
        return;
      }

      const previousScrollTop = detailArea.scrollTop;
      panel.classList.remove("has-detail-overflow");
      this._syncPerformanceLabelFit(detailArea);
      const overflowsVertically = detailArea.scrollHeight > detailArea.clientHeight + 1;
      panel.classList.toggle("has-detail-overflow", overflowsVertically);
      if (overflowsVertically) {
        this._syncPerformanceLabelFit(detailArea);
        const maxScrollTop = this._getPanelDetailMaxScrollTop(detailArea);
        detailArea.scrollTop = Math.min(previousScrollTop, maxScrollTop);
      } else {
        detailArea.scrollTop = 0;
      }
    });
  }

  private _getPanelDetailMaxScrollTop(detailArea: HTMLElement): number {
    const naturalMaxScrollTop = Math.max(0, detailArea.scrollHeight - detailArea.clientHeight);
    const visibleChildren = Array.from(detailArea.children).filter(
      (child): child is HTMLElement =>
        child instanceof HTMLElement &&
        child.offsetParent !== null &&
        child.offsetHeight > 0,
    );
    const lastChild = visibleChildren[visibleChildren.length - 1];
    if (!lastChild) {
      return naturalMaxScrollTop;
    }
    return Math.min(naturalMaxScrollTop, Math.max(0, lastChild.offsetTop));
  }

  private _handlePanelDetailScroll = (event: Event): void => {
    const detailArea = event.currentTarget as HTMLElement | null;
    if (!detailArea) {
      return;
    }
    const maxScrollTop = this._getPanelDetailMaxScrollTop(detailArea);
    if (detailArea.scrollTop > maxScrollTop) {
      detailArea.scrollTop = maxScrollTop;
    }
  };

  private _syncPerformanceLabelFit(detailArea: HTMLElement): void {
    const performance = detailArea.querySelector<HTMLElement>(".performance");
    if (!performance) {
      return;
    }

    const full = performance.dataset.performanceFull;
    const medium = performance.dataset.performanceMedium;
    const compact = performance.dataset.performanceCompact;
    const candidates = [full, medium, compact].filter(
      (candidate): candidate is string => Boolean(candidate),
    );
    if (candidates.length === 0) {
      return;
    }

    const currentText = performance.textContent?.trim();
    const currentIndex = Math.max(
      0,
      candidates.findIndex((candidate) => candidate === currentText),
    );
    for (const candidate of candidates.slice(currentIndex)) {
      performance.textContent = candidate;
      if (performance.scrollWidth <= performance.clientWidth + 1) {
        return;
      }
    }
    performance.textContent = candidates[candidates.length - 1];
  }

  protected render() {
    if (!this._config) {
      return nothing;
    }

    const derived = this._derived ?? deriveArrayState(this._config, this.hass);
    const locale = this.hass?.locale?.language ?? "en";
    const unavailableText = this._t("common.unavailable");
    const notConfiguredText = this._t("common.not_configured");
    const title = this._resolveDefaultTitle(this._config.title);
    const resolvedTheme = this._resolveThemeMode();
    const summaryPower = this._resolveSummaryPower(derived);
    const summaryEnergy = this._resolveSummaryEnergy(derived);
    const customKpi = this._resolveCustomKpi();
    const energyConfigured = this._isSummaryEnergyConfigured();
    const showCustomKpi = this._config.show_custom_kpi ?? true;
    const renderedColumns = this._computeRenderedColumns(
      this._config.columns,
      this._config.max_card_width_px,
    );
    const renderedRows = this._computeRenderedRows(
      this._config.panels.length,
      renderedColumns,
    );
    const panelHeightPx = this._computePanelHeightPx(
      renderedRows,
      this._config.max_card_height_px,
      renderedColumns,
      this._config.max_card_width_px,
    );
    const panelWidthPx = this._computePanelWidthPx(
      renderedColumns,
      this._config.max_card_width_px,
    );
    const panelScale = this._computePanelScale(panelHeightPx);
    const panelWidthCapPx = this._getPanelWidthCapPx();
    const gridStyle =
      panelWidthCapPx !== null
        ? `grid-template-columns: repeat(${renderedColumns}, minmax(0, ${panelWidthCapPx}px)); justify-content: center;`
        : `grid-template-columns: repeat(${renderedColumns}, minmax(0, 1fr));`;
    const sharedHistoryHours = this._config.deviation_history_hours ?? 12;
    const cardStyle = `--spv-max-width:${this._config.max_card_width_px ?? 980}px; ${
      this._config.max_card_height_px
        ? `--spv-max-height:${this._config.max_card_height_px}px;`
        : "--spv-max-height:none;"
    } --spv-panel-height:${panelHeightPx}px; --spv-panel-scale:${panelScale}; --spv-panel-max-width:${
      panelWidthCapPx ? `${panelWidthCapPx}px` : "100%"
    };`;
    const systemHealth = this._buildSystemHealthState(derived);
    const alertCount =
      derived.inverterCount + derived.errorCount + derived.offlineCount + derived.deviationCount;
    const overlayAnchorStyle = this._motionOverlayModel
      ? `width:${this._motionOverlayModel.width}px; height:${this._motionOverlayModel.height}px;`
      : "";
    const subtitle =
      (this._config.enable_array_checks ?? false) && this._historyState === "loading"
        ? this._t("card.subtitle.loading_history", { hours: sharedHistoryHours })
        : !derived.deviationReady
          ? this._historyStateReason ??
            derived.deviationSuppressedReason ??
            this._t("card.subtitle.warmup")
          : derived.deviationCount > 0
            ? this._t("card.subtitle.deviation_detected", {
                count: derived.deviationCount,
                suffix: derived.deviationCount === 1 ? "" : "s",
              })
            : this._t("card.subtitle.tap_diagnostics");
    const selectedPanel = derived.panels.find(
      (panel) => panel.id === this._selectedPanelId,
    );

    return html`
      <ha-card style=${cardStyle} data-spv-theme=${resolvedTheme}>
        <div class="chrome"></div>
        <div class="spv-overlay-anchor" style=${overlayAnchorStyle}>
          ${this._renderCardOverlay(derived)}
        </div>
        <div class="header">
          <div class="header-copy">
            <div class="topline">
              <span class="eyebrow">${this._t("card.eyebrow")}</span>
              <button
                class="system-health"
                type="button"
                style=${`--health-color:${systemHealth.color};`}
                @click=${this._openSystemHealthPopup}
              >
                ${systemHealth.label}
              </button>
            </div>
            <h1 class="title">${title}</h1>
            <p class="subtitle">${subtitle}</p>
            <p class="subtitle subtitle-hint">${this._t("card.subtitle.drag_hint")}</p>
          </div>
          <div class="summary ${showCustomKpi ? "with-custom" : "without-custom"}">
            <button
              class="summary-chip summary-button ${this._getSummaryExtraClass("power")}"
              style=${this._getSummaryExtraStyle("power")}
              type="button"
              data-kpi="power"
              @click=${this._openLivePowerPopup}
            >
              <span class="summary-label">${this._t("card.summary.power")}</span>
              <span class="summary-value">
                ${formatSummaryValue(
                  summaryPower.value,
                  this._config.power_decimals ?? 0,
                  summaryPower.unit,
                  unavailableText,
                  locale,
                )}
              </span>
            </button>
            <button
              class="summary-chip summary-button ${this._getSummaryExtraClass("energy")}"
              style=${this._getSummaryExtraStyle("energy")}
              type="button"
              data-kpi="energy"
              @click=${this._openEnergyPopup}
            >
              <span class="summary-label">${this._t("card.summary.energy")}</span>
              <span class="summary-value">
                ${energyConfigured
                  ? formatSummaryValue(
                      summaryEnergy.value,
                      this._config.energy_decimals ?? 2,
                      summaryEnergy.unit,
                      unavailableText,
                      locale,
                    )
                  : notConfiguredText}
              </span>
            </button>
            <div
              class="summary-chip alerts-chip ${this._getSummaryExtraClass("alerts")}"
              style=${this._getSummaryExtraStyle("alerts")}
              data-kpi="alerts"
            >
              <span class="summary-label">${this._t("card.summary.alerts")}</span>
              <span class="summary-value">
                ${alertCount}
              </span>
            </div>
            ${showCustomKpi
              ? html`
                  <button
                    class="summary-chip summary-button ${this._getSummaryExtraClass("custom")}"
                    style=${this._getSummaryExtraStyle("custom")}
                    type="button"
                    data-kpi="custom"
                    @click=${this._openCustomKpiPopup}
                  >
                    <span class="summary-label">${this._resolveCustomKpiTitle(customKpi.title)}</span>
                    <span class="summary-value custom-kpi-value">${customKpi.value}</span>
                  </button>
                `
              : nothing}
          </div>
        </div>

        <div
          class="grid"
          style=${gridStyle}
        >
          ${derived.panels.map((panel) => this._renderPanel(panel, panelHeightPx, panelWidthPx))}
        </div>

        ${this._showLivePowerPopup ? this._renderLivePowerDialog(derived) : nothing}
        ${this._showEnergyPopup ? this._renderEnergyDialog(derived) : nothing}
        ${this._showCustomKpiPopup ? this._renderCustomKpiDialog() : nothing}
        ${this._showSystemHealthPopup ? this._renderSystemHealthDialog(derived) : nothing}
        ${selectedPanel ? this._renderPanelDialog(selectedPanel) : nothing}
      </ha-card>
    `;
  }

  private _refreshDerived(): void {
    if (!this._config) {
      this._derived = undefined;
      return;
    }

    this._derived = deriveArrayState(this._config, this.hass, {
      deviationEnabled: this._config.enable_array_checks ?? false,
      historyByEntityId: this._historyByEntityId,
      nowMs: Date.now(),
    });
  }

  private _formatSlotLabel(slotIndex: number): string {
    const columns = this._config?.columns ?? 1;
    const row = Math.floor(slotIndex / columns) + 1;
    const column = (slotIndex % columns) + 1;
    return this._t("card.panel.slot_label", { row, column });
  }

  private _formatPanelSlotLabel(panel: DerivedPanelState): string {
    const slotLabel = this._formatSlotLabel(panel.slotIndex);
    return panel.stringGroupLabel
      ? `${panel.stringGroupLabel} · ${slotLabel}`
      : slotLabel;
  }

  private _renderPanel(
    panel: DerivedPanelState,
    panelHeightPx: number,
    panelWidthPx: number,
  ) {
    const showPerformance = this._shouldShowPerformance(panel, panelHeightPx, panelWidthPx);
    const extraClass = this._getPanelExtraClass(panel);
    const inverterStatusInline = normalizeInlineStatusText(panel.inverterStatusDisplay);
    const inverterTileSummary = this._formatInverterTileSummary(panel, inverterStatusInline);
    const panelIntensity = Math.max(0, Math.min(panel.intensity, 1));
    const borderMix = Math.round(24 + panelIntensity * 62);
    const fillMix = Math.round(6 + panelIntensity * 24);
    const glowMix = Math.round(4 + panelIntensity * 18);
    const panelStyle = [
      `--panel-accent:${panel.accentColor}`,
      `--panel-intensity:${panelIntensity.toFixed(3)}`,
      `--panel-border-accent:color-mix(in srgb, ${panel.accentColor} ${borderMix}%, var(--spv-panel-accent-mix-base))`,
      `--panel-fill-accent:color-mix(in srgb, ${panel.accentColor} ${fillMix}%, transparent)`,
      `--panel-glow-accent:color-mix(in srgb, ${panel.accentColor} ${glowMix}%, transparent)`,
    ].join("; ");
    const performanceCandidates = showPerformance
      ? this._buildPanelPerformanceLabelCandidates(panel)
      : null;
    if (panel.hiddenSlot) {
      return html`
        <button
          class="panel hidden-slot ${extraClass}"
          type="button"
          data-panel-id=${panel.id}
          data-slot-index=${String(panel.slotIndex)}
          draggable="true"
          @dragstart=${(event: DragEvent) => this._handleDragStart(event, panel.slotIndex)}
          @dragover=${this._handleDragOver}
          @drop=${(event: DragEvent) => this._handleDrop(event, panel.slotIndex)}
          @dragend=${this._handleDragEnd}
        >
          <span class="status">${this._t("card.panel.hidden")}</span>
          <div class="panel-primary">
            <p class="panel-name" title=${this._t("card.panel.hidden_name")}>
              ${this._t("card.panel.hidden_name")}
            </p>
            <p class="power">0 W</p>
          </div>
          <div class="panel-detail-scroll" @scroll=${this._handlePanelDetailScroll}>
            <p class="performance">${this._t("card.panel.hidden_performance")}</p>
            <p class="energy">${this._t("card.panel.hidden_performance")}</p>
          </div>
          <span class="slot">${this._formatSlotLabel(panel.slotIndex)}</span>
        </button>
      `;
    }

    return html`
      <button
        class="panel ${panel.status} ${showPerformance ? "has-performance" : ""} ${extraClass}"
        type="button"
        style=${panelStyle}
        data-panel-id=${panel.id}
        data-slot-index=${String(panel.slotIndex)}
        draggable="true"
        @dragstart=${(event: DragEvent) => this._handleDragStart(event, panel.slotIndex)}
        @dragover=${this._handleDragOver}
        @drop=${(event: DragEvent) => this._handleDrop(event, panel.slotIndex)}
        @dragend=${this._handleDragEnd}
        @click=${() => this._handlePanelClick(panel)}
      >
        <span class="status">${this._panelStatusLabel(panel.status)}</span>
        <div class="panel-primary">
          <p class="panel-name" title=${panel.label}>${panel.label}</p>
          <p class="power">${panel.powerDisplay}</p>
        </div>
        <div class="panel-detail-scroll" @scroll=${this._handlePanelDetailScroll}>
          ${showPerformance
            ? html`<p
                class="performance"
                data-performance-full=${performanceCandidates?.[0]?.text ?? ""}
                data-performance-medium=${performanceCandidates?.[1]?.text ?? ""}
                data-performance-compact=${performanceCandidates?.[2]?.text ?? ""}
              >
                ${this._formatPanelPerformanceText(
                  panel,
                  panelWidthPx,
                  panelHeightPx,
                  performanceCandidates,
                )}
              </p>`
            : nothing}
          ${panel.energyDisplay ? html`<p class="energy">${panel.energyDisplay}</p>` : nothing}
          ${(this._config?.show_inverter_status_on_tiles ?? false) && inverterTileSummary
            ? html`<p class="inverter-status">${inverterTileSummary}</p>`
            : nothing}
        </div>
        <span class="slot ${panel.stringGroupLabel ? "has-string-label" : ""}">
          ${this._formatPanelSlotLabel(panel)}
        </span>
      </button>
    `;
  }

  private _renderPopupCloseButton(onClick: () => void, ariaLabel: string) {
    return html`
      <div class="spv-popup-close-anchor">
        <button
          class="spv-popup-close"
          type="button"
          @click=${(event: Event) => this._handlePopupCloseClick(event, onClick)}
          aria-label=${ariaLabel}
        >
          ×
        </button>
      </div>
    `;
  }

  private _formatInverterTileSummary(
    panel: DerivedPanelState,
    normalizedInlineStatus?: string,
  ): string | undefined {
    if (!normalizedInlineStatus) {
      return undefined;
    }
    if (panel.status === "deviation") {
      return this._t("card.panel.inverter_short.deviation");
    }
    if (panel.status === "error" || panel.status === "inverter" || panel.status === "offline") {
      return this._t("card.panel.inverter_short.error");
    }
    if (panel.inverterWorkingMatched) {
      return this._t("card.panel.inverter_short.ok");
    }
    return this._t("card.panel.inverter_prefix", {
      status: normalizedInlineStatus,
    });
  }

  private _renderPanelDialog(panel: DerivedPanelState) {
    const panelConfig = this._getPanelConfig(panel.id);
    const energyValue = panelConfig?.energy_entity
      ? panel.energyDisplay ?? this._t("common.unavailable")
      : this._t("common.not_configured");

    if (panel.status === "unconfigured") {
      return html`
        <div class="spv-popup-backdrop" @click=${this._closeDialog}>
          <div
            class="spv-popup"
            @pointerdown=${this._handlePopupUserInteraction}
            @wheel=${this._handlePopupUserInteraction}
            @click=${this._stopPopupEventPropagation}
          >
            ${this._renderPopupCloseButton(this._closeDialog, this._t("card.popup.close_detail"))}
            <div class="spv-popup-header">
              <div>
                <div class="eyebrow">${this._t("card.popup.panel_eyebrow", {
                  slot: this._formatSlotLabel(panel.slotIndex),
                })}</div>
                <h2 class="spv-popup-title">${panel.label}</h2>
              </div>
            </div>
            ${this._renderInlinePanelConfig(panel)}
            ${this._renderPanelTelemetrySection(panel)}
          </div>
        </div>
      `;
    }

    return html`
      <div class="spv-popup-backdrop" @click=${this._closeDialog}>
        <div
          class="spv-popup"
          @pointerdown=${this._handlePopupUserInteraction}
          @wheel=${this._handlePopupUserInteraction}
          @click=${this._stopPopupEventPropagation}
        >
          ${this._renderPopupCloseButton(this._closeDialog, this._t("card.popup.close_detail"))}
          <div class="spv-popup-header">
            <div>
              <div class="eyebrow">${this._t("card.popup.panel_eyebrow", {
                slot: this._formatSlotLabel(panel.slotIndex),
              })}</div>
              <h2 class="spv-popup-title">${panel.label}</h2>
            </div>
          </div>

          ${this._renderPopupGraph(panel)}

          <div class="detail-grid">
            <div class="detail-card">
              <span class="detail-label">${this._t("card.popup.detail.status")}</span>
              <span class="detail-value">${this._panelStatusLabel(panel.status)}</span>
            </div>
            <div class="detail-card">
              <span class="detail-label">${this._t("card.popup.detail.power")}</span>
              <span class="detail-value">${panel.powerDisplay}</span>
            </div>
            <div class="detail-card">
              <span class="detail-label">${this._t("card.popup.detail.energy")}</span>
              <span class="detail-value">
                ${energyValue}
              </span>
            </div>
            <div class="detail-card">
              <span class="detail-label">${this._t("card.popup.detail.deviation")}</span>
              <span class="detail-value">
                ${panel.status === "inverter"
                  ? this._t("card.popup.deviation.inverter_mismatch")
                  : panel.deviationPercent !== null
                  ? this._t("card.popup.deviation.below_peers", {
                      percent: panel.deviationPercent.toFixed(0),
                    })
                  : this._t("card.popup.deviation.within_range")}
              </span>
            </div>
            <div class="detail-card">
              <span class="detail-label">${this._t("card.popup.detail.rated_performance")}</span>
              <span class="detail-value">
                ${panel.ratedPowerW !== null
                  ? this._t("card.popup.rated_performance.format", {
                      rated: panel.ratedPowerW.toFixed(0),
                      percent:
                        panel.performancePercent !== null
                          ? `${panel.performancePercent.toFixed(0)}%`
                          : this._t("card.popup.rated_performance.na"),
                    })
                  : this._t("common.not_configured")}
              </span>
            </div>
          </div>

          <div class="detail-card detail-information">
            <span class="detail-label">${this._t("card.popup.detail.information")}</span>
            <div class="info-lines">
              <p class="info-line">${panel.reason}</p>
              ${panel.powerEntityName
                ? html`<p class="info-line">${this._t("card.popup.info.power_source", {
                    value: panel.powerEntityName,
                  })}</p>`
                : nothing}
              ${panel.stringGroupLabel &&
              panel.stringPowerSourceName &&
              panel.stringPowerSharePercent !== undefined
                ? html`<p class="info-line">${this._t("card.popup.info.string_share", {
                    label: panel.stringGroupLabel,
                    percent: panel.stringPowerSharePercent.toFixed(0),
                    source: panel.stringPowerSourceName,
                  })}</p>`
                : nothing}
              <p class="info-line">
                ${this._t("card.popup.info.current_inverter_status", {
                  value: panel.inverterStatusDisplay ?? this._t("common.not_configured"),
                })}
              </p>
              <p class="info-line">
                ${this._t("card.popup.info.inverter_evaluation", {
                  value: this._renderInverterEvaluation(panel),
                })}
              </p>
              <p class="info-line">
                ${this._t("card.popup.info.inverter_source", {
                  value: panel.inverterStatusEntityName ?? this._t("common.not_configured"),
                })}
              </p>
            </div>
          </div>
          ${this._renderPanelTelemetrySection(panel)}

        </div>
      </div>
    `;
  }

  private _renderPanelTelemetrySection(panel: DerivedPanelState) {
    const panelConfig = this._getPanelConfig(panel.id);
    if (!panelConfig) {
      return nothing;
    }

    const metrics = this._getPanelTelemetryMetrics(panelConfig);
    const configuredMetrics = metrics.filter((metric) => Boolean(metric.entityId));
    const unconfiguredMetrics = metrics.filter((metric) => !metric.entityId);
    const hasConfiguredMetrics = configuredMetrics.length > 0;
    const activeTelemetryEntityId =
      this._telemetryGraphPanelId === panel.id ? this._telemetryGraphEntityId : null;

    return html`
      <section class="telemetry-section">
        <h3 class="telemetry-title">${this._t("card.popup.telemetry.title")}</h3>

        ${hasConfiguredMetrics
          ? html`
              <div class="telemetry-group">
                <h4 class="telemetry-title">${this._t("card.popup.telemetry.configured_title")}</h4>
                <div class="telemetry-grid">
                  ${configuredMetrics.map(
                    (metric) => this._renderTelemetryMetricCard(
                      panel.id,
                      metric,
                      metric.entityId === activeTelemetryEntityId,
                    ),
                  )}
                </div>
              </div>
            `
          : nothing}

        ${unconfiguredMetrics.length > 0
          ? html`
              <div class="telemetry-group">
                <h4 class="telemetry-title">${this._t("card.popup.telemetry.unconfigured_title")}</h4>
                <p class="telemetry-empty">${this._t("card.popup.telemetry.setup_hint")}</p>
                <div class="telemetry-grid">
                  ${unconfiguredMetrics.map(
                    (metric) => html`
                      <div class="detail-card telemetry-card">
                        <span class="detail-label">${metric.label}</span>
                        <span class="detail-value">${this._t("common.not_configured")}</span>
                      </div>
                    `,
                  )}
                </div>
              </div>
            `
          : !hasConfiguredMetrics
            ? html`<p class="telemetry-empty">${this._t("card.popup.telemetry.setup_hint")}</p>`
            : nothing}
      </section>
    `;
  }

  private _renderTelemetryMetricCard(
    panelId: string,
    metric: PanelTelemetryMetric,
    isOpen: boolean,
  ) {
    const entityId = metric.entityId;
    if (!entityId) {
      return nothing;
    }

    return html`
      <div class="detail-card telemetry-card is-expandable ${isOpen ? "is-open" : ""}">
        <button
          class="telemetry-card-toggle"
          type="button"
          aria-expanded=${isOpen ? "true" : "false"}
          @click=${(event: Event) => this._toggleTelemetryGraph(event, panelId, entityId)}
        >
          <span class="telemetry-card-main">
            <span class="detail-label">${metric.label}</span>
            <span class="detail-value">
              ${this._formatTelemetryMetricValue(entityId)}
            </span>
          </span>
          <span class="telemetry-card-affordance" aria-hidden="true">
            ${isOpen ? "-" : "+"}
          </span>
        </button>
        ${isOpen ? this._renderTelemetryMetricGraph(metric) : nothing}
      </div>
    `;
  }

  private _renderTelemetryMetricGraph(metric: PanelTelemetryMetric) {
    const entityId = metric.entityId;
    if (!entityId) {
      return nothing;
    }
    const range = this._telemetryGraphRangeHours;
    const cacheKey = this._getPopupGraphCacheKey(entityId, range);
    const cache = this._popupGraphCache[cacheKey];
    const rawSamples = cache?.samples ?? [];
    const samples = this._adjustGraphSamplesForEntity(entityId, rawSamples);
    const unit = this._getUnitForEntity(entityId, "");

    return html`
      <div class="telemetry-card-graph">
        <div class="graph-header">
          <span class="graph-title">${metric.label}</span>
          <div class="range-chips">
            ${POPUP_GRAPH_RANGES.map(
              (range) => html`
                <button
                  class="range-chip ${this._telemetryGraphRangeHours === range ? "active" : ""}"
                  type="button"
                  @pointerdown=${this._preventRangeChipFocusScroll}
                  @mousedown=${this._preventRangeChipFocusScroll}
                  @click=${(event: Event) =>
                    this._handleTelemetryGraphRangeChange(event, entityId, range)}
                >
                  ${range}h
                </button>
              `,
            )}
          </div>
        </div>
        ${this._renderPopupGraphBodyFromSamples(
          cacheKey,
          unit,
          samples,
          range,
          cache?.loading ?? false,
          cache?.error,
          { fillStartWithFirstSample: true },
        )}
      </div>
    `;
  }

  private _getPanelTelemetryMetrics(panel: PanelConfig): PanelTelemetryMetric[] {
    const advanced: PanelAdvancedMetrics = panel.advanced_metrics ?? {};
    return [
      {
        label: this._t("card.popup.telemetry.label.inverter_status"),
        entityId: panel.inverter_status_entity ?? panel.error_entity,
      },
      {
        label: this._t("card.popup.telemetry.label.inverter_ac_power"),
        entityId: advanced.inverter_ac_power_entity,
      },
      {
        label: this._t("card.popup.telemetry.label.inverter_ac_voltage"),
        entityId: advanced.inverter_ac_voltage_entity,
      },
      {
        label: this._t("card.popup.telemetry.label.inverter_ac_current"),
        entityId: advanced.inverter_ac_current_entity,
      },
      {
        label: this._t("card.popup.telemetry.label.inverter_temp"),
        entityId: advanced.inverter_temp_entity,
      },
      {
        label: this._t("card.popup.telemetry.label.panel_current"),
        entityId: advanced.panel_current_entity,
      },
      {
        label: this._t("card.popup.telemetry.label.panel_voltage"),
        entityId: advanced.panel_voltage_entity,
      },
      {
        label: this._t("card.popup.telemetry.label.panel_power"),
        entityId: advanced.panel_power_entity,
      },
    ];
  }

  private _formatTelemetryMetricValue(entityId: string): string {
    const entity = this.hass?.states?.[entityId];
    if (!entity) {
      return this._t("common.unavailable");
    }

    const rawState = entity.state?.toString().trim() ?? "";
    const normalized = rawState.toLowerCase();
    if (normalized.length === 0 || INVALID_ENTITY_STATES.has(normalized)) {
      return this._t("common.unavailable");
    }

    const numeric = Number(entity.state);
    const unit =
      typeof entity.attributes?.unit_of_measurement === "string"
        ? entity.attributes.unit_of_measurement.trim()
        : "";
    if (Number.isFinite(numeric)) {
      const locale = this.hass?.locale?.language ?? "en";
      const safeValue = Object.is(numeric, -0) ? 0 : numeric;
      const decimals = Number.isInteger(safeValue) ? 0 : 2;
      const formatted = new Intl.NumberFormat(locale, {
        minimumFractionDigits: 0,
        maximumFractionDigits: decimals,
      }).format(safeValue);
      return unit ? `${formatted} ${unit}` : formatted;
    }

    return unit ? `${rawState} ${unit}` : rawState;
  }

  private _renderKpiCompareControls(
    derived: DerivedArrayState,
    kind: PanelCompareMetricKind,
  ) {
    const expanded = this._kpiCompareExpanded[kind];
    const toggleLabel =
      kind === "power"
        ? this._t("card.popup.panel_compare.toggle_power")
        : this._t("card.popup.panel_compare.toggle_energy");
    return html`
      <div class="compare-toggle-row">
        <button
          class="inline-button"
          type="button"
          @click=${(event: Event) => this._togglePanelCompareGraph(event, kind, derived)}
        >
          ${toggleLabel}
        </button>
      </div>
      ${expanded ? this._renderPanelCompareGraph(derived, kind) : nothing}
    `;
  }

  private _togglePanelCompareGraph(
    event: Event,
    kind: PanelCompareMetricKind,
    derived: DerivedArrayState,
  ): void {
    const scrollToken = this._captureScrollPositionsForPopupGraph(event);
    const nextExpanded = !this._kpiCompareExpanded[kind];
    this._kpiCompareExpanded = {
      ...this._kpiCompareExpanded,
      [kind]: nextExpanded,
    };
    this._scheduleCapturedScrollRestore(scrollToken);
    if (nextExpanded) {
      void this._ensurePanelCompareLoaded(
        derived,
        kind,
        this._kpiCompareRangeHours[kind],
        scrollToken,
      );
    }
  }

  private _renderPanelCompareGraph(
    derived: DerivedArrayState,
    kind: PanelCompareMetricKind,
  ) {
    const targets = this._buildPanelCompareTargets(derived, kind);
    const range = this._kpiCompareRangeHours[kind];
    if (targets.length === 0) {
      return html`
        <p class="graph-state">
          ${kind === "energy"
            ? this._t("card.popup.panel_compare.no_panels_energy")
            : this._t("card.popup.panel_compare.no_panels_power")}
        </p>
      `;
    }

    const signature = this._getPanelCompareSignature(kind, targets);
    const cacheKey = this._getPanelCompareCacheKey(kind, signature, range);
    const cache = this._kpiCompareCache[cacheKey];
    const loading = cache?.loading ?? false;
    const error = cache?.error;

    const series = targets.map((target, index) => ({
      ...target,
      color: PANEL_COMPARE_COLORS[index % PANEL_COMPARE_COLORS.length],
      samples: this._scaleGraphSamples(
        this._adjustGraphSamplesForEntity(
          target.entityId,
          cache?.samplesByPanelId[target.panelId] ?? [],
        ),
        target.scale,
      ),
    }));

    const graphModel = buildCompareGraphModel(
      series.map((item) => ({
        id: item.panelId,
        samples: item.samples,
      })),
      Date.now(),
      range,
      POPUP_GRAPH_MAX_POINTS,
      320,
      132,
      10,
    );
    const seriesById = new Map(graphModel.series.map((item) => [item.id, item]));
    const hasSuspectSeries = graphModel.series.some(
      (item) =>
        item.sampleCount > 0 &&
        (item.pointsCount === 0 || (item.sampleCount > 1 && item.pointsCount < 2)),
    );
    const hasRenderFailure = graphModel.hasData && graphModel.drawableCount === 0;
    const showDiagnostics = hasRenderFailure || hasSuspectSeries;
    const compareUnit = kind === "energy" ? "kWh" : "W";
    const compareValues = graphModel.series.flatMap((item) =>
      item.samples
        .map((sample) => sample.value)
        .filter((value) => Number.isFinite(value)),
    );
    const compareStats =
      compareValues.length > 0
        ? this._computeGraphStats(
            compareValues.map((value, index) => ({
              ts: index,
              value,
            })),
          )
        : { min: null, max: null, median: null };
    const compareMinRaw = compareValues.length > 0 ? Math.min(...compareValues) : null;
    const compareMaxRaw = compareValues.length > 0 ? Math.max(...compareValues) : null;
    const compareScaleMin =
      compareMinRaw === null || compareMaxRaw === null
        ? null
        : compareMinRaw === compareMaxRaw
          ? compareMinRaw - 1
          : compareMinRaw;
    const compareScaleMax =
      compareMinRaw === null || compareMaxRaw === null
        ? null
        : compareMinRaw === compareMaxRaw
          ? compareMaxRaw + 1
          : compareMaxRaw;
    const compareMaxY =
      compareStats.max !== null && compareScaleMin !== null && compareScaleMax !== null
        ? this._toGraphY(compareStats.max, compareScaleMin, compareScaleMax, 132, 10)
        : null;
    const compareMedianY =
      compareStats.median !== null && compareScaleMin !== null && compareScaleMax !== null
        ? this._toGraphY(compareStats.median, compareScaleMin, compareScaleMax, 132, 10)
        : null;
    const compareMinY =
      compareStats.min !== null && compareScaleMin !== null && compareScaleMax !== null
        ? this._toGraphY(compareStats.min, compareScaleMin, compareScaleMax, 132, 10)
        : null;
    const compareMaxLabel =
      compareStats.max !== null
        ? this._t("card.popup.history.max", {
            value: this._formatGraphPower(compareStats.max, compareUnit),
          })
        : null;
    const compareMedianLabel =
      compareStats.median !== null
        ? this._t("card.popup.history.median", {
            value: this._formatGraphPower(compareStats.median, compareUnit),
          })
        : null;
    const compareMinLabel =
      compareStats.min !== null
        ? this._t("card.popup.history.min", {
            value: this._formatGraphPower(compareStats.min, compareUnit),
          })
        : null;

    const hourTicks = this._buildGraphHourTicks(
      {
        startTs: graphModel.startTs,
        endTs: graphModel.endTs,
      },
      range,
    );
    const axisTicks = this._buildGraphAxisTicks(hourTicks);
    const compareTitle =
      kind === "energy"
        ? this._t("card.popup.history.panel_compare_energy")
        : this._t("card.popup.history.panel_compare_power");

    return html`
      <div class="graph-section">
        <div class="graph-header">
          <span class="graph-title">${compareTitle}</span>
          <div class="range-chips">
            ${POPUP_GRAPH_RANGES.map(
              (range) => html`
                <button
                  class="range-chip ${this._kpiCompareRangeHours[kind] === range ? "active" : ""}"
                  type="button"
                  @pointerdown=${this._preventRangeChipFocusScroll}
                  @mousedown=${this._preventRangeChipFocusScroll}
                  @click=${(event: Event) =>
                    this._handlePanelCompareRangeChange(event, derived, kind, range)}
                >
                  ${range}h
                </button>
              `,
            )}
          </div>
        </div>

        ${loading
          ? html`<p class="graph-state">${this._t("card.popup.panel_compare.loading")}</p>`
          : error
            ? html`<p class="graph-state">${error}</p>`
            : !graphModel.hasData
              ? html`<p class="graph-state">${this._t("card.popup.panel_compare.no_data")}</p>`
              : hasRenderFailure
                ? html`<p class="graph-state">${this._t("card.popup.panel_compare.render_failure")}</p>`
              : html`
                  <div class="graph-box">
                    ${compareMaxLabel
                      ? html`<span class="graph-overlay graph-overlay-max">${compareMaxLabel}</span>`
                      : nothing}
                    ${compareMedianLabel
                      ? html`
                          <span class="graph-overlay graph-overlay-median">
                            ${compareMedianLabel}
                          </span>
                        `
                      : nothing}
                    ${compareMinLabel
                      ? html`<span class="graph-overlay graph-overlay-min">${compareMinLabel}</span>`
                      : nothing}
                    <svg class="graph-svg" viewBox="0 0 320 132" preserveAspectRatio="none">
                      ${hourTicks.map(
                        (tick) => svg`
                          <line
                            class="graph-hour-line"
                            x1=${tick.x.toFixed(2)}
                            x2=${tick.x.toFixed(2)}
                            y1="10"
                            y2="122"
                          ></line>
                        `,
                      )}
                      ${series.map((item) => {
                        const graphSeries = seriesById.get(item.panelId);
                        if (!graphSeries || graphSeries.pointsCount === 0) {
                          return nothing;
                        }
                        if (graphSeries.pointsCount >= 2) {
                          return svg`
                            <path
                              d=${graphSeries.linePath}
                              fill="none"
                              stroke=${item.color}
                              stroke-width="1.08"
                              stroke-linejoin="round"
                              stroke-linecap="round"
                              opacity="0.88"
                            ></path>
                            ${graphSeries.firstPoint && graphSeries.lastPoint
                              ? svg`
                                  <circle
                                    cx=${graphSeries.firstPoint.x.toFixed(2)}
                                    cy=${graphSeries.firstPoint.y.toFixed(2)}
                                    r="1.7"
                                    fill=${item.color}
                                    opacity="0.95"
                                  ></circle>
                                  <circle
                                    cx=${graphSeries.lastPoint.x.toFixed(2)}
                                    cy=${graphSeries.lastPoint.y.toFixed(2)}
                                    r="1.7"
                                    fill=${item.color}
                                    opacity="0.95"
                                  ></circle>
                                `
                              : nothing}
                          `;
                        }
                        if (!graphSeries.firstPoint) {
                          return nothing;
                        }
                        return svg`
                          <circle
                            cx=${graphSeries.firstPoint.x.toFixed(2)}
                            cy=${graphSeries.firstPoint.y.toFixed(2)}
                            r="2.4"
                            fill=${item.color}
                            opacity="0.95"
                          ></circle>
                        `;
                      })}
                      ${compareMaxY !== null
                        ? svg`
                            <line
                              class="graph-stat-line graph-stat-max"
                              x1="10"
                              x2="310"
                              y1=${compareMaxY.toFixed(2)}
                              y2=${compareMaxY.toFixed(2)}
                            ></line>
                          `
                        : nothing}
                      ${compareMedianY !== null
                        ? svg`
                            <line
                              class="graph-stat-line graph-stat-median"
                              x1="10"
                              x2="310"
                              y1=${compareMedianY.toFixed(2)}
                              y2=${compareMedianY.toFixed(2)}
                            ></line>
                          `
                        : nothing}
                      ${compareMinY !== null
                        ? svg`
                            <line
                              class="graph-stat-line graph-stat-min"
                              x1="10"
                              x2="310"
                              y1=${compareMinY.toFixed(2)}
                              y2=${compareMinY.toFixed(2)}
                            ></line>
                          `
                        : nothing}
                    </svg>
                  </div>
                  <div class="graph-axis">
                    ${axisTicks.map(
                      (tick) => html`
                        <span class="graph-axis-label" style=${`left:${tick.leftPercent.toFixed(2)}%;`}>
                          ${tick.label}
                        </span>
                      `,
                    )}
                  </div>
                  <div class="graph-meta">
                    <span>
                      ${this._t("card.popup.history.time_range", {
                        start: this._formatGraphTime(graphModel.startTs),
                        end: this._formatGraphTime(graphModel.endTs),
                      })}
                    </span>
                  </div>
                `}

        ${showDiagnostics
          ? html`
              <div class="compare-diagnostics">
                <span class="compare-diagnostics-title">
                  ${this._t("card.popup.panel_compare.diagnostics_title")}
                </span>
                <span class="compare-diagnostics-row">
                  ${this._t("card.popup.panel_compare.diagnostics_summary", {
                    hasData: graphModel.hasData ? "true" : "false",
                    drawable: graphModel.drawableCount,
                    series: graphModel.series.length,
                    range,
                  })}
                </span>
                <span class="compare-diagnostics-row">
                  ${hasRenderFailure
                    ? this._t("card.popup.panel_compare.diagnostics_reason_render_failure")
                    : this._t("card.popup.panel_compare.diagnostics_reason_suspect")}
                </span>
                ${series.map((item) => {
                  const graphSeries = seriesById.get(item.panelId);
                  const entityUnit = this._getUnitForEntity(item.entityId, compareUnit);
                  return html`
                    <span class="compare-diagnostics-row">
                      ${this._t("card.popup.panel_compare.diagnostics_row", {
                        label: item.label,
                        samples: graphSeries?.sampleCount ?? 0,
                        points: graphSeries?.pointsCount ?? 0,
                        pathLen: graphSeries?.linePath.length ?? 0,
                        first: this._formatGraphDiagnosticTime(graphSeries?.firstTs ?? null),
                        last: this._formatGraphDiagnosticTime(graphSeries?.lastTs ?? null),
                        min:
                          graphSeries?.minValue === null || graphSeries?.minValue === undefined
                            ? "--"
                            : this._formatGraphPower(graphSeries.minValue, entityUnit),
                        max:
                          graphSeries?.maxValue === null || graphSeries?.maxValue === undefined
                            ? "--"
                            : this._formatGraphPower(graphSeries.maxValue, entityUnit),
                      })}
                    </span>
                  `;
                })}
              </div>
            `
          : nothing}

        <div class="compare-legend">
          ${series.map(
            (item) => html`
              <div class="compare-legend-item">
                <span
                  class="compare-legend-chip"
                  style=${`background:${item.color};`}
                ></span>
                <span class="compare-legend-label">${item.label}</span>
              </div>
            `,
          )}
        </div>
      </div>
    `;
  }

  private _renderAggregatedPanelGraph(
    derived: DerivedArrayState,
    kind: PanelCompareMetricKind,
    options: PopupGraphRenderOptions = {},
  ) {
    const targets = this._buildPanelCompareTargets(derived, kind);
    const range = this._kpiCompareRangeHours[kind];
    if (targets.length === 0) {
      return html`
        <p class="graph-state">
          ${kind === "energy"
            ? this._t("card.popup.panel_compare.no_panels_energy")
            : this._t("card.popup.panel_compare.no_panels_power")}
        </p>
      `;
    }

    const signature = this._getPanelCompareSignature(kind, targets);
    const cacheKey = this._getPanelCompareCacheKey(kind, signature, range);
    const cache = this._kpiCompareCache[cacheKey];
    const loading = cache?.loading ?? false;
    const error = cache?.error;
    const aggregateSamples = aggregateStepwiseSamples(
      targets.map((target) =>
        this._scaleGraphSamples(
          this._adjustGraphSamplesForEntity(
            target.entityId,
            cache?.samplesByPanelId[target.panelId] ?? [],
          ),
          target.scale,
        ),
      ),
    );
    const unit =
      kind === "energy"
        ? this._resolveUnit("energy_entity", "kWh")
        : this._resolveUnit("power_entity", "W");
    const title =
      kind === "energy"
        ? this._t("card.popup.history.total_panel_energy")
        : this._t("card.popup.history.total_panel_power");

    return html`
      <div class="graph-section">
        <div class="graph-header">
          <span class="graph-title">${title}</span>
          <div class="range-chips">
            ${POPUP_GRAPH_RANGES.map(
              (range) => html`
                <button
                  class="range-chip ${this._kpiCompareRangeHours[kind] === range ? "active" : ""}"
                  type="button"
                  @pointerdown=${this._preventRangeChipFocusScroll}
                  @mousedown=${this._preventRangeChipFocusScroll}
                  @click=${(event: Event) =>
                    this._handleAggregatedPanelRangeChange(
                      event,
                      derived,
                      kind,
                      range,
                      options.overlayEntityId ?? undefined,
                    )}
                >
                  ${range}h
                </button>
              `,
            )}
          </div>
        </div>
        ${this._renderPopupGraphBodyFromSamples(
          `panel-total-${kind}|${signature}|${range}`,
          unit,
          aggregateSamples,
          range,
          loading,
          error,
          options,
        )}
        ${options.overlayStateMessage
          ? html`<p class="graph-forecast-state">${options.overlayStateMessage}</p>`
          : nothing}
        ${options.showEnableForecastButton
          ? html`
              <div class="forecast-enable-row">
                <button
                  class="inline-button"
                  type="button"
                  @click=${this._enableForecastOverlayFromPopup}
                >
                  ${this._t("card.popup.forecast.enable_button")}
                </button>
              </div>
            `
          : nothing}
      </div>
    `;
  }

  private _handleAggregatedPanelRangeChange(
    event: Event,
    derived: DerivedArrayState,
    kind: PanelCompareMetricKind,
    range: PopupGraphRangeHours,
    overlayEntityId?: string,
  ): void {
    event.preventDefault();
    event.stopPropagation();
    const scrollToken = this._captureScrollPositionsForPopupGraph(event);
    this._kpiCompareRangeHours = {
      ...this._kpiCompareRangeHours,
      [kind]: range,
    };
    this._scheduleCapturedScrollRestore(scrollToken);
    void this._ensurePanelCompareLoaded(derived, kind, range, scrollToken);
    if (overlayEntityId) {
      void this._ensurePopupGraphLoadedByEntity(overlayEntityId, range, scrollToken);
    }
  }

  private _handlePanelCompareRangeChange(
    event: Event,
    derived: DerivedArrayState,
    kind: PanelCompareMetricKind,
    range: PopupGraphRangeHours,
  ): void {
    event.preventDefault();
    event.stopPropagation();
    const scrollToken = this._captureScrollPositionsForPopupGraph(event);
    this._kpiCompareRangeHours = {
      ...this._kpiCompareRangeHours,
      [kind]: range,
    };
    this._scheduleCapturedScrollRestore(scrollToken);
    if (this._kpiCompareExpanded[kind]) {
      void this._ensurePanelCompareLoaded(derived, kind, range, scrollToken);
    }
    if (!this._getSystemEntityIdForKind(kind) && this._isForecastOverlayEnabled()) {
      const forecastEntityId = this._getForecastEntityId(kind);
      if (forecastEntityId) {
        void this._ensurePopupGraphLoadedByEntity(forecastEntityId, range, scrollToken);
      }
    }
  }

  private _buildPanelCompareTargets(
    derived: DerivedArrayState,
    kind: PanelCompareMetricKind,
  ): PanelCompareTarget[] {
    const configByPanelId = new Map(
      (this._config?.panels ?? []).map((panel) => [panel.id, panel]),
    );

    return derived.panels
      .filter((panel) => !panel.hiddenSlot && panel.enabled)
      .map((panel) => {
        const configPanel = configByPanelId.get(panel.id);
        const entityId =
          kind === "energy"
            ? configPanel?.energy_entity?.trim()
            : configPanel?.power_entity?.trim();
        if (!entityId) {
          return null;
        }
        return {
          panelId: panel.id,
          label: panel.label,
          entityId,
          scale: kind === "energy"
            ? panel.energyShareFactor ?? 1
            : panel.powerShareFactor ?? 1,
        };
      })
      .filter((value): value is PanelCompareTarget => Boolean(value));
  }

  private _getPanelCompareSignature(
    kind: PanelCompareMetricKind,
    targets: PanelCompareTarget[],
  ): string {
    return `${kind}|${targets
      .map((target) => `${target.panelId}:${target.entityId}:${target.scale}`)
      .join("|")}`;
  }

  private _getPanelCompareCacheKey(
    kind: PanelCompareMetricKind,
    signature: string,
    range: PopupGraphRangeHours,
  ): string {
    return `${kind}|${signature}|${range}`;
  }

  private async _ensurePanelCompareLoaded(
    derived: DerivedArrayState,
    kind: PanelCompareMetricKind,
    range: PopupGraphRangeHours,
    scrollToken?: number | null,
  ): Promise<void> {
    if (!this._config || !this.hass) {
      return;
    }

    const targets = this._buildPanelCompareTargets(derived, kind);
    if (targets.length === 0) {
      return;
    }

    const signature = this._getPanelCompareSignature(kind, targets);
    const cacheKey = this._getPanelCompareCacheKey(kind, signature, range);
    const existing = this._kpiCompareCache[cacheKey];
    const nowMs = Date.now();
    if (existing?.loading) {
      return;
    }
    if (
      existing &&
      !existing.error &&
      existing.loadedAt &&
      nowMs - existing.loadedAt < PANEL_COMPARE_CACHE_TTL_MS
    ) {
      return;
    }

    const token = ++this._kpiCompareRequestToken;
    this._kpiCompareLatestTokenByKey[cacheKey] = token;
    this._kpiCompareCache = {
      ...this._kpiCompareCache,
      [cacheKey]: {
        loading: true,
        samplesByPanelId: existing?.samplesByPanelId ?? {},
        loadedAt: existing?.loadedAt,
      },
    };
    this._scheduleCapturedScrollRestore(scrollToken);

    if (!this.hass.callApi && !this.hass.callWS) {
      if (this._kpiCompareLatestTokenByKey[cacheKey] !== token) {
        return;
      }
      this._kpiCompareCache = {
        ...this._kpiCompareCache,
        [cacheKey]: {
          loading: false,
          samplesByPanelId: {},
          error: this._t("card.popup.panel_compare.unable_load", {
            error: this._t("common.unknown_recorder_error"),
          }),
          loadedAt: Date.now(),
        },
      };
      this._scheduleCapturedScrollRestore(scrollToken);
      return;
    }

    try {
      const uniqueEntityIds = [...new Set(targets.map((target) => target.entityId))];
      const samplesByEntityId: Record<string, PowerSample[]> = {};
      let firstLoadError: string | null = null;

      const settled = await Promise.allSettled(
        uniqueEntityIds.map(async (entityId) => ({
          entityId,
          samples: await this._loadPopupGraphRecorderSamples(entityId, range),
        })),
      );

      for (const result of settled) {
        if (result.status === "fulfilled") {
          samplesByEntityId[result.value.entityId] = result.value.samples;
          continue;
        }
        if (!firstLoadError) {
          firstLoadError = compactError(
            toErrorMessage(result.reason, this._t("common.unknown_recorder_error")),
          );
        }
      }

      if (this._kpiCompareLatestTokenByKey[cacheKey] !== token) {
        return;
      }

      const hasAnyLoadedSamples = Object.values(samplesByEntityId).some(
        (samples) => samples.length > 0,
      );
      const loadedEntityCount = Object.keys(samplesByEntityId).length;
      if (loadedEntityCount === 0 && firstLoadError) {
        this._kpiCompareCache = {
          ...this._kpiCompareCache,
        [cacheKey]: {
          loading: false,
          samplesByPanelId: {},
          error: this._t("card.popup.panel_compare.unable_load", {
            error: firstLoadError,
          }),
          loadedAt: Date.now(),
        },
      };
      this._scheduleCapturedScrollRestore(scrollToken);
      return;
    }

      const samplesByPanelId: Record<string, PowerSample[]> = {};
      for (const target of targets) {
        samplesByPanelId[target.panelId] = samplesByEntityId[target.entityId] ?? [];
      }

      this._kpiCompareCache = {
        ...this._kpiCompareCache,
        [cacheKey]: {
          loading: false,
          samplesByPanelId,
          error:
            !hasAnyLoadedSamples && firstLoadError
              ? this._t("card.popup.panel_compare.unable_load", {
                  error: firstLoadError,
                })
              : undefined,
          loadedAt: Date.now(),
        },
      };
      this._scheduleCapturedScrollRestore(scrollToken);
    } catch (error) {
      if (this._kpiCompareLatestTokenByKey[cacheKey] !== token) {
        return;
      }
      this._kpiCompareCache = {
        ...this._kpiCompareCache,
        [cacheKey]: {
          loading: false,
          samplesByPanelId: {},
          error: this._t("card.popup.panel_compare.unable_load", {
            error: compactError(toErrorMessage(error, this._t("common.unknown_recorder_error"))),
          }),
          loadedAt: Date.now(),
        },
      };
      this._scheduleCapturedScrollRestore(scrollToken);
    }
  }

  private _renderInverterEvaluation(panel: DerivedPanelState): string {
    if (!panel.inverterStatusDisplay || panel.inverterStatusDisplay === this._t("common.unavailable")) {
      return this._t("card.popup.inverter_eval.no_status");
    }
    if (panel.inverterFaultMatched) {
      return this._t("card.popup.inverter_eval.fault_match");
    }
    if (panel.inverterWorkingMatched) {
      return this._t("card.popup.inverter_eval.working_match");
    }
    return this._t("card.popup.inverter_eval.no_match");
  }

  private _renderLivePowerDialog(derived: DerivedArrayState) {
    const systemPowerEntityId = this._getSystemPowerEntityId();
    const summaryPower = this._resolveSummaryPower(derived);
    const forecastPower = this._resolveForecastMetricDisplay(
      "power",
      this._config?.power_decimals ?? 0,
      "W",
    );
    const forecastOverlayEnabled =
      this._isForecastOverlayEnabled() && Boolean(forecastPower.entityId);
    const forecastOverlayMessage = !forecastPower.entityId
      ? this._t("card.popup.forecast.default_sensor_not_found", {
          entity: forecastPower.expectedEntityId,
        })
      : !this._isForecastOverlayEnabled()
        ? this._t("card.popup.forecast.disabled_hint")
        : null;
    const canEnableForecastFromPowerPopup =
      !this._isForecastOverlayEnabled() &&
      Boolean(forecastPower.entityId);
    const locale = this.hass?.locale?.language ?? "en";

    return html`
      <div class="spv-popup-backdrop" @click=${this._closeLivePowerPopup}>
        <div
          class="spv-popup"
          @pointerdown=${this._handlePopupUserInteraction}
          @wheel=${this._handlePopupUserInteraction}
          @click=${this._stopPopupEventPropagation}
        >
          ${this._renderPopupCloseButton(
            this._closeLivePowerPopup,
            this._t("card.popup.close_live_power"),
          )}
          <div class="spv-popup-header">
            <div>
              <div class="eyebrow">${this._t("card.popup.power_eyebrow")}</div>
              <h2 class="spv-popup-title">${this._t("card.popup.power_title")}</h2>
            </div>
          </div>

          ${systemPowerEntityId
            ? this._renderPopupGraphForEntity(
                systemPowerEntityId,
                this._t("card.popup.history.system_power"),
                {
                  overlayEntityId: forecastOverlayEnabled ? forecastPower.entityId : null,
                  overlayStateMessage: forecastOverlayMessage,
                  showEnableForecastButton: canEnableForecastFromPowerPopup,
                },
              )
            : this._renderAggregatedPanelGraph(derived, "power", {
                overlayEntityId: forecastOverlayEnabled ? forecastPower.entityId : null,
                overlayStateMessage: forecastOverlayMessage,
                showEnableForecastButton: canEnableForecastFromPowerPopup,
              })}

          <div class="detail-grid">
            <div class="detail-card">
              <span class="detail-label">${this._t("card.popup.detail.current")}</span>
              <span class="detail-value">
                ${formatSummaryValue(
                  summaryPower.value,
                  this._config?.power_decimals ?? 0,
                  summaryPower.unit,
                  this._t("common.unavailable"),
                  locale,
                )}
              </span>
            </div>
            <div class="detail-card">
              <span class="detail-label">${this._t("card.popup.detail.estimated_power_now")}</span>
              <span class="detail-value">${forecastPower.display}</span>
            </div>
            <div class="detail-card detail-card-source">
              <span class="detail-label">${this._t("card.popup.detail.source")}</span>
              <span class="detail-value">
                ${systemPowerEntityId
                  ? this._t("card.summary.system_sensor")
                  : this._t("card.summary.sum_panel_sensors")}
              </span>
            </div>
          </div>

          ${this._renderKpiCompareControls(derived, "power")}
        </div>
      </div>
    `;
  }

  private _renderEnergyDialog(derived: DerivedArrayState) {
    const systemEnergyEntityId = this._getSystemEnergyEntityId();
    const summaryEnergy = this._resolveSummaryEnergy(derived);
    const forecastEnergy = this._resolveForecastMetricDisplay(
      "energy",
      this._config?.energy_decimals ?? 2,
      "kWh",
    );
    const forecastOverlayEnabled =
      this._isForecastOverlayEnabled() && Boolean(forecastEnergy.entityId);
    const forecastOverlayMessage = !forecastEnergy.entityId
      ? this._t("card.popup.forecast.default_sensor_not_found", {
          entity: forecastEnergy.expectedEntityId,
        })
      : !this._isForecastOverlayEnabled()
        ? this._t("card.popup.forecast.disabled_hint")
        : null;
    const canEnableForecastFromEnergyPopup =
      !this._isForecastOverlayEnabled() &&
      Boolean(forecastEnergy.entityId);
    const locale = this.hass?.locale?.language ?? "en";

    return html`
      <div class="spv-popup-backdrop" @click=${this._closeEnergyPopup}>
        <div
          class="spv-popup"
          @pointerdown=${this._handlePopupUserInteraction}
          @wheel=${this._handlePopupUserInteraction}
          @click=${this._stopPopupEventPropagation}
        >
          ${this._renderPopupCloseButton(this._closeEnergyPopup, this._t("card.popup.close_energy"))}
          <div class="spv-popup-header">
            <div>
              <div class="eyebrow">${this._t("card.popup.energy_eyebrow")}</div>
              <h2 class="spv-popup-title">${this._t("card.popup.energy_title")}</h2>
            </div>
          </div>

          ${systemEnergyEntityId
            ? this._renderPopupGraphForEntity(
                systemEnergyEntityId,
                this._t("card.popup.history.system_energy"),
                {
                  overlayEntityId: forecastOverlayEnabled ? forecastEnergy.entityId : null,
                  overlayStateMessage: forecastOverlayMessage,
                  showEnableForecastButton: canEnableForecastFromEnergyPopup,
                },
              )
            : this._renderAggregatedPanelGraph(derived, "energy", {
                overlayEntityId: forecastOverlayEnabled ? forecastEnergy.entityId : null,
                overlayStateMessage: forecastOverlayMessage,
                showEnableForecastButton: canEnableForecastFromEnergyPopup,
              })}

          <div class="detail-grid">
            <div class="detail-card">
              <span class="detail-label">${this._t("card.popup.detail.current")}</span>
              <span class="detail-value">
                ${formatSummaryValue(
                  summaryEnergy.value,
                  this._config?.energy_decimals ?? 2,
                  summaryEnergy.unit,
                  this._t("common.unavailable"),
                  locale,
                )}
              </span>
            </div>
            <div class="detail-card">
              <span class="detail-label">${this._t("card.popup.detail.estimated_energy_now")}</span>
              <span class="detail-value">${forecastEnergy.display}</span>
            </div>
            <div class="detail-card detail-card-source">
              <span class="detail-label">${this._t("card.popup.detail.source")}</span>
              <span class="detail-value">
                ${systemEnergyEntityId
                  ? this._t("card.summary.system_sensor")
                  : this._t("card.summary.sum_panel_sensors")}
              </span>
            </div>
          </div>

          ${this._renderKpiCompareControls(derived, "energy")}
        </div>
      </div>
    `;
  }

  private _renderCustomKpiDialog() {
    const customKpi = this._resolveCustomKpi();
    const popupTitle =
      customKpi.title.length > 0
        ? this._resolveCustomKpiTitle(customKpi.title)
        : this._t("card.summary.custom_default_title");
    const customKpiEntityId = this._getCustomKpiEntityId();

    return html`
      <div class="spv-popup-backdrop" @click=${this._closeCustomKpiPopup}>
        <div
          class="spv-popup"
          @pointerdown=${this._handlePopupUserInteraction}
          @wheel=${this._handlePopupUserInteraction}
          @click=${this._stopPopupEventPropagation}
        >
          ${this._renderPopupCloseButton(
            this._closeCustomKpiPopup,
            this._t("card.popup.close_custom_kpi"),
          )}
          <div class="spv-popup-header">
            <div>
              <div class="eyebrow">${this._t("card.popup.custom_eyebrow")}</div>
              <h2 class="spv-popup-title">${popupTitle}</h2>
            </div>
          </div>

          <div class="detail-grid">
            <div class="detail-card">
              <span class="detail-label">${this._t("card.popup.detail.current")}</span>
              <span class="detail-value">${customKpi.value}</span>
            </div>
            <div class="detail-card">
              <span class="detail-label">${this._t("card.popup.detail.source")}</span>
              <span class="detail-value">
                ${customKpiEntityId
                  ? this._t("card.summary.custom_sensor")
                  : this._t("common.not_configured")}
              </span>
            </div>
          </div>

          ${customKpiEntityId
            ? this._renderPopupGraphForEntity(
                customKpiEntityId,
                `${popupTitle} ${this._t("card.popup.history.power")}`,
                {
                  fillStartWithFirstSample: true,
                  invertPrimaryValues: this._config?.invert_custom_kpi ?? false,
                },
              )
            : html`<p class="graph-state">${this._t("card.popup.history.custom_not_configured")}</p>`}
        </div>
      </div>
    `;
  }

  private _renderSystemHealthDialog(derived: DerivedArrayState) {
    const sections = this._buildSystemHealthSections(derived);
    const hasIssues = sections.length > 0;

    return html`
      <div class="spv-popup-backdrop" @click=${this._closeSystemHealthPopup}>
        <div
          class="spv-popup"
          @pointerdown=${this._handlePopupUserInteraction}
          @wheel=${this._handlePopupUserInteraction}
          @click=${this._stopPopupEventPropagation}
        >
          ${this._renderPopupCloseButton(
            this._closeSystemHealthPopup,
            this._t("card.popup.close_system_health"),
          )}
          <div class="spv-popup-header">
            <div>
              <div class="eyebrow">${this._t("card.popup.system_health_eyebrow")}</div>
              <h2 class="spv-popup-title">${this._t("card.popup.system_health_title")}</h2>
            </div>
          </div>

          ${!hasIssues
            ? html`<p class="system-health-item">${this._t("card.popup.system_health.everything_ok")}</p>`
            : sections.map(
                (section) => html`
                  <div class="graph-section">
                    <div class="graph-header">
                      <span class="graph-title">${section.title}</span>
                    </div>
                    ${section.items.map(
                      (item) => html`<p class="system-health-item">${item}</p>`,
                    )}
                  </div>
                `,
              )}
        </div>
      </div>
    `;
  }

  private _renderMetricList(
    title: string,
    entries: Array<{ label: string; value: string }>,
  ) {
    return html`
      <div class="graph-section">
        <div class="graph-header">
          <span class="graph-title">${title}</span>
        </div>
        ${entries.map(
          (entry) => html`
            <p class="subtitle">
              ${entry.label}: ${entry.value}
            </p>
          `,
        )}
      </div>
    `;
  }

  private _renderPopupGraph(panel: DerivedPanelState) {
    const panelConfig = this._getPanelConfig(panel.id);
    return this._renderPopupGraphForEntity(
      panelConfig?.power_entity,
      this._t("card.popup.history.power"),
      {
        primaryValueScale: panel.powerShareFactor ?? 1,
      },
    );
  }

  private _renderPopupGraphForEntity(
    entityId: string | undefined,
    title: string,
    options: PopupGraphRenderOptions = {},
  ) {
    return html`
      <div class="graph-section">
        <div class="graph-header">
          <span class="graph-title">${title}</span>
          <div class="range-chips">
            ${POPUP_GRAPH_RANGES.map(
              (range) => html`
                <button
                  class="range-chip ${this._popupGraphRangeHours === range ? "active" : ""}"
                  type="button"
                  @pointerdown=${this._preventRangeChipFocusScroll}
                  @mousedown=${this._preventRangeChipFocusScroll}
                  @click=${(event: Event) =>
                    this._handlePopupGraphRangeChangeForEntity(
                      event,
                      entityId,
                      range,
                      options.overlayEntityId ?? undefined,
                    )}
                >
                  ${range}h
                </button>
              `,
            )}
          </div>
        </div>
        ${!entityId
          ? html`<p class="graph-state">${this._t("card.popup.history.graph_not_configured")}</p>`
          : this._renderPopupGraphBody(entityId, options)}
        ${options.overlayStateMessage
          ? html`<p class="graph-forecast-state">${options.overlayStateMessage}</p>`
          : nothing}
        ${options.showEnableForecastButton
          ? html`
              <div class="forecast-enable-row">
                <button
                  class="inline-button"
                  type="button"
                  @click=${this._enableForecastOverlayFromPopup}
                >
                  ${this._t("card.popup.forecast.enable_button")}
                </button>
              </div>
            `
          : nothing}
      </div>
    `;
  }

  private _renderPopupGraphBody(
    powerEntity: string,
    options: PopupGraphRenderOptions = {},
  ) {
    const cacheKey = this._getPopupGraphCacheKey(powerEntity, this._popupGraphRangeHours);
    const cache = this._popupGraphCache[cacheKey];
    const loading = cache?.loading ?? false;
    const error = cache?.error;
    const rawSamples = cache?.samples ?? [];
    const adjustedSamples = this._adjustGraphSamplesForEntity(powerEntity, rawSamples);
    const primarySamplesBeforeScale = options.invertPrimaryValues
      ? adjustedSamples.map((sample) => ({
          ts: sample.ts,
          value: normalizeNegativeZero(sample.value * -1),
        }))
      : adjustedSamples;
    const primarySamples = this._scaleGraphSamples(
      primarySamplesBeforeScale,
      options.primaryValueScale ?? 1,
    );
    const unit = this._getUnitForEntity(powerEntity, "W");

    return this._renderPopupGraphBodyFromSamples(
      cacheKey,
      unit,
      primarySamples,
      this._popupGraphRangeHours,
      loading,
      error,
      options,
    );
  }

  private _renderPopupGraphBodyFromSamples(
    graphKey: string,
    unit: string,
    primarySamples: PowerSample[],
    range: PopupGraphRangeHours,
    loading: boolean,
    error: string | undefined,
    options: PopupGraphRenderOptions = {},
  ) {
    const startFilledSamples = this._fillRangeStartWithFirstSample(
      primarySamples,
      range,
      options.fillStartWithFirstSample ?? false,
    );
    const bridgedPrimarySamples = bridgeZeroToProductionGaps(startFilledSamples, {
      rangeHours: range,
    });
    const samples = this._expandSinglePointRangeSamples(
      bridgedPrimarySamples,
      range,
    );
    const overlayEntityId = options.overlayEntityId ?? null;
    const overlayCache = overlayEntityId
      ? this._popupGraphCache[this._getPopupGraphCacheKey(overlayEntityId, range)]
      : undefined;
    const overlayRawSamples = overlayCache?.samples ?? [];
    const overlaySamples = overlayEntityId
      ? this._expandSinglePointRangeSamples(
          this._adjustGraphSamplesForEntity(overlayEntityId, overlayRawSamples),
          range,
        )
      : [];
    const overlayLoading = overlayEntityId ? (overlayCache?.loading ?? false) : false;
    const overlayError = overlayEntityId ? overlayCache?.error : undefined;

    if (loading) {
      return html`<p class="graph-state">${this._t("card.popup.history.loading")}</p>`;
    }

    if (error) {
      return html`<p class="graph-state">${error}</p>`;
    }

    if (samples.length === 0) {
      return html`<p class="graph-state">${this._t("card.popup.history.no_data")}</p>`;
    }

    const downsampled = downsampleSamples(samples, POPUP_GRAPH_MAX_POINTS);
    const stats = this._computeGraphStats(samples);
    const nowMs = Date.now();
    const frameStartTs = nowMs - range * 60 * 60 * 1000;
    const frameEndTs = nowMs;
    const overlayDownsampled =
      overlayEntityId && !overlayLoading && !overlayError && overlaySamples.length > 0
        ? downsampleSamples(overlaySamples, POPUP_GRAPH_MAX_POINTS)
        : [];
    const actualValues = samples
      .map((sample) => sample.value)
      .filter((value) => Number.isFinite(value));
    const overlayValues = overlayDownsampled
      .map((sample) => sample.value)
      .filter((value) => Number.isFinite(value));
    const allValues = [...actualValues, ...overlayValues];
    const graphMinRaw = allValues.length > 0 ? Math.min(...allValues) : null;
    const graphMaxRaw = allValues.length > 0 ? Math.max(...allValues) : null;
    const graphMin =
      graphMinRaw === null || graphMaxRaw === null
        ? null
        : graphMinRaw === graphMaxRaw
          ? graphMinRaw - 1
          : graphMinRaw;
    const graphMax =
      graphMinRaw === null || graphMaxRaw === null
        ? null
        : graphMinRaw === graphMaxRaw
          ? graphMaxRaw + 1
          : graphMaxRaw;
    const graphFrame =
      graphMin !== null && graphMax !== null
        ? {
            startTs: frameStartTs,
            endTs: frameEndTs,
            minValue: graphMin,
            maxValue: graphMax,
          }
        : null;
    const actualLinePath =
      graphFrame !== null
        ? this._buildAlignedGraphLinePath(downsampled, graphFrame, 320, 132, 10)
        : "";
    const actualAreaPath =
      graphFrame !== null
        ? this._buildAlignedGraphAreaPath(downsampled, graphFrame, 320, 132, 10)
        : "";
    const overlayLinePath =
      graphFrame !== null && overlayDownsampled.length > 0
        ? this._buildAlignedGraphLinePath(overlayDownsampled, graphFrame, 320, 132, 10)
        : "";
    const hourTicks = this._buildGraphHourTicks(
      {
        startTs: frameStartTs,
        endTs: frameEndTs,
      },
      range,
    );
    const axisTicks = this._buildGraphAxisTicks(hourTicks);
    const maxY =
      stats.max !== null && graphMin !== null && graphMax !== null
        ? this._toGraphY(stats.max, graphMin, graphMax, 132, 10)
        : null;
    const medianY =
      stats.median !== null && graphMin !== null && graphMax !== null
        ? this._toGraphY(stats.median, graphMin, graphMax, 132, 10)
        : null;
    const minY =
      stats.min !== null && graphMin !== null && graphMax !== null
        ? this._toGraphY(stats.min, graphMin, graphMax, 132, 10)
        : null;
    const gradientId = `spv-graph-${graphKey.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
    const maxLabel =
      stats.max !== null
        ? this._t("card.popup.history.max", {
            value: this._formatGraphPower(stats.max, unit),
          })
        : null;
    const medianLabel =
      stats.median !== null
        ? this._t("card.popup.history.median", {
            value: this._formatGraphPower(stats.median, unit),
          })
        : null;
    const minLabel =
      stats.min !== null
        ? this._t("card.popup.history.min", {
            value: this._formatGraphPower(stats.min, unit),
          })
        : null;

    return html`
      <div class="graph-box">
        ${maxLabel ? html`<span class="graph-overlay graph-overlay-max">${maxLabel}</span>` : nothing}
        ${medianLabel
          ? html`
              <span class="graph-overlay graph-overlay-median">
                ${medianLabel}
              </span>
            `
          : nothing}
        ${minLabel
          ? html`<span class="graph-overlay graph-overlay-min">${minLabel}</span>`
          : nothing}
        <svg class="graph-svg" viewBox="0 0 320 132" preserveAspectRatio="none">
          <defs>
            <linearGradient id=${gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="rgba(142, 208, 114, 0.48)"></stop>
              <stop offset="100%" stop-color="rgba(142, 208, 114, 0.04)"></stop>
            </linearGradient>
          </defs>
          <path
            d=${actualAreaPath}
            fill=${`url(#${gradientId})`}
          ></path>
          ${hourTicks.map(
            (tick) => svg`
              <line
                class="graph-hour-line"
                x1=${tick.x.toFixed(2)}
                x2=${tick.x.toFixed(2)}
                y1="10"
                y2="122"
              ></line>
            `,
          )}
          ${svg`
            <path
            d=${actualLinePath}
            fill="none"
            stroke="rgba(186, 226, 106, 0.95)"
            stroke-width="2.2"
            stroke-linejoin="round"
            stroke-linecap="round"
            ></path>
          `}
          ${overlayLinePath.length > 0
            ? svg`
                <path
                  d=${overlayLinePath}
                  fill="none"
                  stroke="var(--spv-forecast-line)"
                  stroke-width="1.5"
                  stroke-dasharray="6 5"
                  stroke-linejoin="round"
                  stroke-linecap="round"
                  opacity="0.82"
                ></path>
              `
            : nothing}
          ${maxY !== null
            ? svg`
                <line
                  class="graph-stat-line graph-stat-max"
                  x1="10"
                  x2="310"
                  y1=${maxY.toFixed(2)}
                  y2=${maxY.toFixed(2)}
                ></line>
              `
            : nothing}
          ${medianY !== null
            ? svg`
                <line
                  class="graph-stat-line graph-stat-median"
                  x1="10"
                  x2="310"
                  y1=${medianY.toFixed(2)}
                  y2=${medianY.toFixed(2)}
                ></line>
              `
            : nothing}
          ${minY !== null
            ? svg`
                <line
                  class="graph-stat-line graph-stat-min"
                  x1="10"
                  x2="310"
                  y1=${minY.toFixed(2)}
                  y2=${minY.toFixed(2)}
                ></line>
              `
            : nothing}
        </svg>
      </div>
      <div class="graph-axis">
        ${axisTicks.map(
          (tick) => html`
            <span class="graph-axis-label" style=${`left:${tick.leftPercent.toFixed(2)}%;`}>
              ${tick.label}
            </span>
          `,
        )}
      </div>
      <div class="graph-meta">
        <span>
          ${this._t("card.popup.history.time_range", {
            start: this._formatGraphTime(frameStartTs),
            end: this._formatGraphTime(frameEndTs),
          })}
        </span>
      </div>
      ${overlayEntityId && overlayLoading
        ? html`<p class="graph-forecast-state">${this._t("card.popup.history.loading")}</p>`
        : nothing}
      ${overlayEntityId && !overlayLoading && overlayError
        ? html`<p class="graph-forecast-state">${overlayError}</p>`
        : nothing}
      ${overlayEntityId &&
      !overlayLoading &&
      !overlayError &&
      overlaySamples.length === 0
        ? html`<p class="graph-forecast-state">${this._t("card.popup.history.no_data")}</p>`
        : nothing}
    `;
  }

  private _handlePopupGraphRangeChangeForEntity(
    event: Event,
    powerEntity: string | undefined,
    range: PopupGraphRangeHours,
    overlayEntityId?: string,
  ): void {
    event.preventDefault();
    event.stopPropagation();
    const scrollToken = this._captureScrollPositionsForPopupGraph(event);
    this._popupGraphRangeHours = range;
    this._scheduleCapturedScrollRestore(scrollToken);
    if (powerEntity) {
      void this._ensurePopupGraphLoadedByEntity(powerEntity, range, scrollToken);
    }
    if (overlayEntityId) {
      void this._ensurePopupGraphLoadedByEntity(overlayEntityId, range, scrollToken);
    }
  }

  private _toggleTelemetryGraph(
    event: Event,
    panelId: string,
    entityId: string,
  ): void {
    event.preventDefault();
    event.stopPropagation();
    const scrollToken = this._captureScrollPositionsForPopupGraph(event);
    const isCurrent =
      this._telemetryGraphPanelId === panelId &&
      this._telemetryGraphEntityId === entityId;

    if (isCurrent) {
      this._clearTelemetryGraph();
      this._scheduleCapturedScrollRestore(scrollToken);
      return;
    }

    this._telemetryGraphPanelId = panelId;
    this._telemetryGraphEntityId = entityId;
    this._telemetryGraphRangeHours = 6;
    this._scheduleCapturedScrollRestore(scrollToken);
    void this._ensurePopupGraphLoadedByEntity(entityId, this._telemetryGraphRangeHours, scrollToken);
  }

  private _handleTelemetryGraphRangeChange(
    event: Event,
    entityId: string,
    range: PopupGraphRangeHours,
  ): void {
    event.preventDefault();
    event.stopPropagation();
    const scrollToken = this._captureScrollPositionsForPopupGraph(event);
    this._telemetryGraphRangeHours = range;
    this._scheduleCapturedScrollRestore(scrollToken);
    void this._ensurePopupGraphLoadedByEntity(entityId, range, scrollToken);
  }

  private _clearTelemetryGraph(): void {
    this._telemetryGraphPanelId = null;
    this._telemetryGraphEntityId = null;
    this._telemetryGraphRangeHours = 6;
  }

  private _getPopupGraphCacheKey(
    entityId: string,
    range: PopupGraphRangeHours,
  ): string {
    return `${entityId}|${range}`;
  }

  private _getPanelConfig(panelId: string): PanelConfig | undefined {
    return this._config?.panels.find((panel) => panel.id === panelId);
  }

  private async _ensurePopupGraphLoaded(
    panelId: string,
    range: PopupGraphRangeHours,
    scrollToken?: number | null,
  ): Promise<void> {
    if (!this._config || !this.hass) {
      return;
    }

    const panelConfig = this._getPanelConfig(panelId);
    const powerEntity = panelConfig?.power_entity;
    if (!powerEntity) {
      return;
    }

    await this._ensurePopupGraphLoadedByEntity(powerEntity, range, scrollToken);
  }

  private async _ensurePopupGraphLoadedByEntity(
    powerEntity: string,
    range: PopupGraphRangeHours,
    scrollToken?: number | null,
  ): Promise<void> {
    if (!this._config || !this.hass) {
      return;
    }

    const cacheKey = this._getPopupGraphCacheKey(powerEntity, range);
    const existing = this._popupGraphCache[cacheKey];
    const nowMs = Date.now();
    if (existing?.loading) {
      return;
    }
    if (
      existing &&
      !existing.error &&
      existing.loadedAt &&
      nowMs - existing.loadedAt < POPUP_GRAPH_CACHE_TTL_MS
    ) {
      return;
    }

    const token = ++this._popupGraphRequestToken;
    this._popupGraphLatestTokenByKey[cacheKey] = token;
    this._popupGraphCache = {
      ...this._popupGraphCache,
      [cacheKey]: {
        loading: true,
        samples: existing?.samples ?? [],
        loadedAt: existing?.loadedAt,
      },
    };
    this._scheduleCapturedScrollRestore(scrollToken);

    if (!this.hass.callApi && !this.hass.callWS) {
      if (this._popupGraphLatestTokenByKey[cacheKey] !== token) {
        return;
      }
      this._popupGraphCache = {
        ...this._popupGraphCache,
        [cacheKey]: {
          loading: false,
          samples: [],
          error: "Unable to load panel history",
          loadedAt: Date.now(),
        },
      };
      this._scheduleCapturedScrollRestore(scrollToken);
      return;
    }

    try {
      if (this._popupGraphLatestTokenByKey[cacheKey] !== token) {
        return;
      }

      const samples = await this._loadPopupGraphRecorderSamples(powerEntity, range);
      if (this._popupGraphLatestTokenByKey[cacheKey] !== token) {
        return;
      }
      this._popupGraphCache = {
        ...this._popupGraphCache,
        [cacheKey]: {
          loading: false,
          samples,
          loadedAt: Date.now(),
        },
      };
      this._scheduleCapturedScrollRestore(scrollToken);
    } catch (error) {
      if (this._popupGraphLatestTokenByKey[cacheKey] !== token) {
        return;
      }
      this._popupGraphCache = {
        ...this._popupGraphCache,
        [cacheKey]: {
          loading: false,
          samples: [],
          error: `Unable to load panel history (${compactError(toErrorMessage(error))})`,
          loadedAt: Date.now(),
        },
      };
      this._scheduleCapturedScrollRestore(scrollToken);
    }
  }

  private async _loadPopupGraphRecorderSamples(
    entityId: string,
    range: PopupGraphRangeHours,
  ): Promise<PowerSample[]> {
    if (!this.hass || (!this.hass.callApi && !this.hass.callWS)) {
      throw new Error("Recorder API unavailable");
    }

    const now = Date.now();
    const fetchHours = Math.min(168, range + 6);
    const startIso = new Date(now - fetchHours * 60 * 60 * 1000).toISOString();
    const endIso = new Date(now).toISOString();
    const sharedHistorySamples = this._getSharedHistorySamplesForRange(entityId, range);
    if (sharedHistorySamples) {
      const sharedRangeSamples = filterSamplesByRangeHours(sharedHistorySamples, now, range);
      const stabilizedShared = this._stabilizePopupRangeSamples(
        entityId,
        sharedHistorySamples,
        sharedRangeSamples,
        now,
        range,
      );
      if (this._hasPopupRangeCoverage(stabilizedShared, now, range)) {
        return stabilizedShared;
      }

      try {
        const response = await this._fetchRecorderHistoryRaw(startIso, endIso, [entityId]);
        const parsed =
          this._parseRecorderResponse(response, fetchHours, [entityId])[entityId] ?? [];
        const mergedAll = this._mergeGraphSampleSets(sharedHistorySamples, parsed);
        const mergedRange = filterSamplesByRangeHours(mergedAll, now, range);
        return this._stabilizePopupRangeSamples(entityId, mergedAll, mergedRange, now, range);
      } catch (_error) {
        return stabilizedShared;
      }
    }

    const response = await this._fetchRecorderHistoryRaw(startIso, endIso, [entityId]);

    const parsed = this._parseRecorderResponse(response, fetchHours, [entityId])[entityId] ?? [];
    const rangeSamples = filterSamplesByRangeHours(parsed, now, range);
    return this._stabilizePopupRangeSamples(entityId, parsed, rangeSamples, now, range);
  }

  private _getSharedHistorySamplesForRange(
    entityId: string,
    range: PopupGraphRangeHours,
  ): PowerSample[] | null {
    if (!(this._config?.enable_array_checks ?? false)) {
      return null;
    }
    if (this._getHistoryHours() < range) {
      return null;
    }
    const samples = this._historyByEntityId[entityId];
    if (!samples || samples.length === 0) {
      return null;
    }
    return samples;
  }

  private _stabilizePopupRangeSamples(
    entityId: string,
    allSamples: PowerSample[],
    rangeSamples: PowerSample[],
    nowMs: number,
    rangeHours: PopupGraphRangeHours,
  ): PowerSample[] {
    const threshold = nowMs - rangeHours * 60 * 60 * 1000;
    const sortedAll = [...allSamples].sort((a, b) => a.ts - b.ts);
    const sortedRange = [...rangeSamples].sort((a, b) => a.ts - b.ts);
    const previousSample = sortedAll.filter((sample) => sample.ts < threshold).pop() ?? null;
    const isForecastEntity = this._isForecastDefaultEntity(entityId);
    const liveValue = Number(this.hass?.states?.[entityId]?.state);

    if (sortedRange.length === 0) {
      if (isForecastEntity && Number.isFinite(liveValue)) {
        sortedRange.push({ ts: threshold, value: liveValue });
      } else if (previousSample) {
        sortedRange.push({ ts: threshold, value: previousSample.value });
      } else if (Number.isFinite(liveValue)) {
        sortedRange.push({ ts: threshold, value: liveValue });
      }
    } else if (sortedRange[0].ts > threshold && (previousSample || isForecastEntity)) {
      const startValue =
        isForecastEntity ? sortedRange[0].value : previousSample?.value ?? sortedRange[0].value;
      sortedRange.unshift({ ts: threshold, value: startValue });
    }

    const latest = sortedRange[sortedRange.length - 1];
    if (!latest && Number.isFinite(liveValue)) {
      sortedRange.push({ ts: nowMs, value: liveValue });
    } else if (latest && latest.ts < nowMs) {
      const endValue = Number.isFinite(liveValue) ? liveValue : latest.value;
      sortedRange.push({ ts: nowMs, value: endValue });
    }

    return sortedRange
      .filter((sample) => Number.isFinite(sample.ts) && Number.isFinite(sample.value))
      .sort((a, b) => a.ts - b.ts);
  }

  private _hasPopupRangeCoverage(
    samples: PowerSample[],
    nowMs: number,
    rangeHours: PopupGraphRangeHours,
  ): boolean {
    if (samples.length === 0) {
      return false;
    }
    const threshold = nowMs - rangeHours * 60 * 60 * 1000;
    const firstTs = samples[0].ts;
    const lastTs = samples[samples.length - 1].ts;
    const toleranceMs = 15 * 60 * 1000;
    return firstTs <= threshold + toleranceMs && lastTs >= nowMs - toleranceMs;
  }

  private _mergeGraphSampleSets(...sets: PowerSample[][]): PowerSample[] {
    const byTimestamp = new Map<number, PowerSample>();
    for (const set of sets) {
      for (const sample of set) {
        if (!Number.isFinite(sample.ts) || !Number.isFinite(sample.value)) {
          continue;
        }
        byTimestamp.set(sample.ts, sample);
      }
    }
    return [...byTimestamp.values()].sort((a, b) => a.ts - b.ts);
  }

  private _getUnitForEntity(entityId: string, fallback: string): string {
    const unit = this.hass?.states?.[entityId]?.attributes?.unit_of_measurement;
    if (typeof unit === "string" && unit.trim().length > 0) {
      return unit;
    }
    return fallback;
  }

  private _formatGraphPower(value: number | null, unit: string): string {
    const trimmedUnit = unit.trim();
    if (value === null) {
      return trimmedUnit ? `0 ${unit}` : "0";
    }
    const locale = this.hass?.locale?.language ?? "en";
    const safeValue = normalizeNegativeZero(value);
    const normalizedUnit = trimmedUnit.toLowerCase();
    const decimals =
      normalizedUnit.includes("wh") || normalizedUnit.includes("kwh")
        ? this._config?.energy_decimals ?? 2
        : this._config?.power_decimals ?? 0;
    const formatted = new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(safeValue);
    return trimmedUnit ? `${formatted} ${unit}` : formatted;
  }

  private _computeGraphStats(samples: PowerSample[]): GraphStats {
    const values = samples
      .map((sample) => sample.value)
      .filter((value) => Number.isFinite(value))
      .sort((a, b) => a - b);
    if (values.length === 0) {
      return { min: null, max: null, median: null };
    }
    const min = values[0] ?? null;
    const max = values[values.length - 1] ?? null;
    const middle = Math.floor(values.length / 2);
    const median =
      values.length % 2 === 0
        ? (values[middle - 1] + values[middle]) / 2
        : values[middle];
    return { min, max, median };
  }

  private _buildGraphHourTicks(
    graphFrame: { startTs: number | null; endTs: number | null },
    range: PopupGraphRangeHours,
  ): GraphHourTick[] {
    if (graphFrame.startTs === null || graphFrame.endTs === null) {
      return [];
    }

    const startTs = graphFrame.startTs;
    const endTs = graphFrame.endTs;
    const xSpan = Math.max(endTs - startTs, 1);
    const width = 320;
    const padding = 10;
    const plotWidth = width - padding * 2;
    const intervalMs =
      range === 1
        ? 15 * 60 * 1000
        : range === 6
          ? 60 * 60 * 1000
          : 4 * 60 * 60 * 1000;
    const ticks: GraphHourTick[] = [];
    const formatLabel = (timestampMs: number): string => {
      const date = new Date(timestampMs);
      const hour = `${date.getHours()}`.padStart(2, "0");
      const minute = `${date.getMinutes()}`.padStart(2, "0");
      return range === 1 ? `${hour}:${minute}` : `${hour}h`;
    };

    let tickTs = Math.ceil(startTs / intervalMs) * intervalMs;
    while (tickTs < endTs) {
      const x = padding + ((tickTs - startTs) / xSpan) * plotWidth;
      ticks.push({
        x,
        label: formatLabel(tickTs),
      });
      tickTs += intervalMs;
    }

    if (range === 6 && ticks.length < 3) {
      const fallbackRatios = [0.25, 0.5, 0.75];
      for (const ratio of fallbackRatios) {
        const ts = startTs + xSpan * ratio;
        const x = padding + ((ts - startTs) / xSpan) * plotWidth;
        ticks.push({
          x,
          label: formatLabel(ts),
        });
      }
    }

    ticks.sort((a, b) => a.x - b.x);
    return ticks;
  }

  private _buildGraphAxisTicks(hourTicks: GraphHourTick[]): GraphAxisTick[] {
    if (hourTicks.length === 0) {
      return [];
    }
    const leftBound = 10;
    const width = 320;
    const plotWidth = width - leftBound * 2;
    return hourTicks.map((tick) => ({
      label: tick.label,
      leftPercent: ((tick.x - leftBound) / plotWidth) * 100,
    }));
  }

  private _toGraphY(
    value: number,
    minValue: number,
    maxValue: number,
    height: number,
    padding: number,
  ): number {
    const ySpan = Math.max(maxValue - minValue, 1);
    const plotHeight = Math.max(height - padding * 2, 1);
    return height - padding - ((value - minValue) / ySpan) * plotHeight;
  }

  private _buildAlignedGraphLinePath(
    samples: PowerSample[],
    frame: { startTs: number; endTs: number; minValue: number; maxValue: number },
    width: number,
    height: number,
    padding: number,
  ): string {
    const finite = samples
      .filter((sample) => Number.isFinite(sample.ts) && Number.isFinite(sample.value))
      .sort((a, b) => a.ts - b.ts);
    if (finite.length === 0) {
      return "";
    }

    const xSpan = Math.max(frame.endTs - frame.startTs, 1);
    const ySpan = Math.max(frame.maxValue - frame.minValue, 1);
    const plotWidth = Math.max(width - padding * 2, 1);
    const plotHeight = Math.max(height - padding * 2, 1);
    const points: Array<{ x: number; y: number }> = [];

    for (const sample of finite) {
      const ts = Math.min(Math.max(sample.ts, frame.startTs), frame.endTs);
      const x = padding + ((ts - frame.startTs) / xSpan) * plotWidth;
      const normalizedY = (sample.value - frame.minValue) / ySpan;
      const y =
        height - padding - Math.min(Math.max(normalizedY, 0), 1) * plotHeight;
      const previousPoint = points[points.length - 1];
      if (previousPoint && Math.abs(previousPoint.x - x) < 0.01 && Math.abs(previousPoint.y - y) < 0.01) {
        continue;
      }
      points.push({ x, y });
    }

    if (points.length === 0) {
      return "";
    }

    if (points.length === 1) {
      points.push({ ...points[0] });
    }

    return points
      .map((point, index) =>
        `${index === 0 ? "M" : "L"}${point.x.toFixed(2)},${point.y.toFixed(2)}`,
      )
      .join(" ");
  }

  private _buildAlignedGraphAreaPath(
    samples: PowerSample[],
    frame: { startTs: number; endTs: number; minValue: number; maxValue: number },
    width: number,
    height: number,
    padding: number,
  ): string {
    const linePath = this._buildAlignedGraphLinePath(samples, frame, width, height, padding);
    if (!linePath) {
      return "";
    }

    const finite = samples
      .filter((sample) => Number.isFinite(sample.ts) && Number.isFinite(sample.value))
      .sort((a, b) => a.ts - b.ts);
    if (finite.length === 0) {
      return "";
    }

    const xSpan = Math.max(frame.endTs - frame.startTs, 1);
    const plotWidth = Math.max(width - padding * 2, 1);
    const firstTs = Math.min(Math.max(finite[0].ts, frame.startTs), frame.endTs);
    const lastTs = Math.min(
      Math.max(finite[finite.length - 1].ts, frame.startTs),
      frame.endTs,
    );
    const firstX = padding + ((firstTs - frame.startTs) / xSpan) * plotWidth;
    const lastX = padding + ((lastTs - frame.startTs) / xSpan) * plotWidth;
    const baselineY = height - padding;

    return `${linePath} L${lastX.toFixed(2)},${baselineY.toFixed(2)} L${firstX.toFixed(2)},${baselineY.toFixed(2)} Z`;
  }

  private _formatGraphTime(timestamp: number | null): string {
    if (timestamp === null) {
      return "--:--";
    }
    const locale = this.hass?.locale?.language ?? "en";
    return new Intl.DateTimeFormat(locale, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      hourCycle: "h23",
    }).format(timestamp);
  }

  private _formatGraphDiagnosticTime(timestamp: number | null): string {
    if (timestamp === null) {
      return "--";
    }
    const locale = this.hass?.locale?.language ?? "en";
    return new Intl.DateTimeFormat(locale, {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      hourCycle: "h23",
    }).format(timestamp);
  }

  private _resolveThemeMode(): "dark" | "light" {
    const configuredMode = this._config?.theme_mode ?? "auto";
    if (configuredMode === "dark" || configuredMode === "light") {
      return configuredMode;
    }

    const haDarkMode = this.hass?.themes?.darkMode;
    if (typeof haDarkMode === "boolean") {
      return haDarkMode ? "dark" : "light";
    }

    if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }

    return "dark";
  }

  protected _buildSystemHealthState(derived: DerivedArrayState): { label: string; color: string } {
    const colors = {
      error: this._config?.colors?.error ?? "#ff627f",
      offline: this._config?.colors?.unavailable ?? "#586779",
      deviation: this._config?.colors?.deviation ?? "#ff9667",
      setup: "#41c9d8",
      ok: "#8ed072",
    };

    const criticalCount = derived.inverterCount + derived.errorCount;
    if (criticalCount > 0) {
      return {
        label: `${criticalCount} Fault${criticalCount === 1 ? "" : "s"}`,
        color: colors.error,
      };
    }
    if (derived.offlineCount > 0) {
      return {
        label: `${derived.offlineCount} Unavailable`,
        color: colors.offline,
      };
    }
    if (derived.deviationCount > 0) {
      return {
        label: `${derived.deviationCount} Deviation`,
        color: colors.deviation,
      };
    }
    if (derived.unconfiguredCount > 0) {
      return {
        label: `${derived.unconfiguredCount} Needs Setup`,
        color: colors.setup,
      };
    }

    return { label: "System OK", color: colors.ok };
  }

  private _buildSystemHealthSections(
    derived: DerivedArrayState,
  ): Array<{ title: string; items: string[] }> {
    const visiblePanels = derived.panels.filter((panel) => !panel.hiddenSlot);
    const buildItems = (status: DerivedPanelState["status"]): string[] =>
      visiblePanels
        .filter((panel) => panel.status === status)
        .map((panel) => {
          const slot = this._formatSlotLabel(panel.slotIndex);
          return `Panel on ${slot} (${panel.label}): ${panel.reason}`;
        });

    const sections: Array<{ title: string; items: string[] }> = [];
    const inverterItems = buildItems("inverter");
    if (inverterItems.length > 0) {
      sections.push({ title: "Inverter", items: inverterItems });
    }
    const errorItems = buildItems("error");
    if (errorItems.length > 0) {
      sections.push({ title: "Error", items: errorItems });
    }
    const deviationItems = buildItems("deviation");
    if (deviationItems.length > 0) {
      sections.push({ title: "Deviation", items: deviationItems });
    }
    const offlineItems = buildItems("offline");
    if (offlineItems.length > 0) {
      sections.push({ title: "Unavailable", items: offlineItems });
    }
    const setupItems = buildItems("unconfigured");
    if (setupItems.length > 0) {
      sections.push({ title: "Needs setup", items: setupItems });
    }

    return sections;
  }

  private _computeRenderedColumns(configColumns: number, maxCardWidthPx?: number): number {
    const safeConfigColumns = Math.max(1, Math.floor(configColumns));
    const hostWidth = this._cardWidth > 0 ? this._cardWidth : maxCardWidthPx ?? 980;
    const effectiveCardWidth = maxCardWidthPx
      ? Math.min(hostWidth, maxCardWidthPx)
      : hostWidth;

    if (!Number.isFinite(effectiveCardWidth) || effectiveCardWidth <= 0) {
      return safeConfigColumns;
    }

    const innerWidth = Math.max(120, effectiveCardWidth - 40);
    const gap = effectiveCardWidth <= 560 ? 8 : 10;
    const mobileLayout = effectiveCardWidth <= 760;
    const configuredColumns = mobileLayout
      ? Math.min(safeConfigColumns, 3)
      : safeConfigColumns;
    const panelWidthCapPx = this._getPanelWidthCapPx();
    const minPanelWidth =
      panelWidthCapPx !== null
        ? panelWidthCapPx
        : mobileLayout
          ? 100
          : Math.max(130, Math.min(220, innerWidth * 0.32));
    const fitColumns = Math.floor((innerWidth + gap) / (minPanelWidth + gap));
    return Math.max(1, Math.min(configuredColumns, fitColumns || 1));
  }

  private _computeRenderedRows(panelCount: number, renderedColumns: number): number {
    const safePanels = Math.max(1, panelCount);
    const safeColumns = Math.max(1, renderedColumns);
    return Math.max(1, Math.ceil(safePanels / safeColumns));
  }

  private _computeWidthBasedPanelHeight(
    renderedColumns: number,
    maxCardWidthPx?: number,
  ): number {
    const tileWidth = this._computeTileWidthPx(renderedColumns, maxCardWidthPx);
    const heightByWidth = tileWidth * 0.62;
    return Math.round(Math.min(220, Math.max(92, heightByWidth)));
  }

  private _computePanelWidthPx(
    renderedColumns: number,
    maxCardWidthPx?: number,
  ): number {
    const tileWidth = this._computeTileWidthPx(renderedColumns, maxCardWidthPx);
    return Math.max(96, Math.round(tileWidth));
  }

  private _computeTileWidthPx(
    renderedColumns: number,
    maxCardWidthPx?: number,
  ): number {
    const hostWidth = this._cardWidth > 0 ? this._cardWidth : maxCardWidthPx ?? 980;
    const effectiveCardWidth = maxCardWidthPx
      ? Math.min(hostWidth, maxCardWidthPx)
      : hostWidth;
    const gap = effectiveCardWidth <= 560 ? 8 : 10;
    const innerWidth = Math.max(120, effectiveCardWidth - 40);
    const safeColumns = Math.max(1, renderedColumns);
    const tileWidth =
      (innerWidth - Math.max(0, safeColumns - 1) * gap) / safeColumns;
    return this._applyPanelWidthCapPx(tileWidth);
  }

  private _getPanelWidthCapPx(): number | null {
    if (!(this._config?.limit_panel_width ?? false)) {
      return null;
    }
    const raw = this._config?.panel_max_width_px ?? 220;
    return Math.min(Math.max(raw, 120), 320);
  }

  private _applyPanelWidthCapPx(tileWidth: number): number {
    const cap = this._getPanelWidthCapPx();
    return cap ? Math.min(tileWidth, cap) : tileWidth;
  }

  private _computePanelHeightPx(
    renderedRows: number,
    maxCardHeightPx?: number,
    renderedColumns = this._config?.columns ?? 3,
    maxCardWidthPx?: number,
  ): number {
    const widthBased = this._computeWidthBasedPanelHeight(renderedColumns, maxCardWidthPx);
    if (!maxCardHeightPx || !Number.isFinite(maxCardHeightPx)) {
      return widthBased;
    }

    const safeRows = Math.max(1, renderedRows);
    const estimatedHeaderHeight = 250;
    const verticalPadding = 36;
    const gridGapTotal = Math.max(safeRows - 1, 0) * 10;
    const availableForPanels =
      maxCardHeightPx - estimatedHeaderHeight - verticalPadding - gridGapTotal;
    const perRow = availableForPanels / safeRows;
    if (!Number.isFinite(perRow)) {
      return widthBased;
    }

    const heightFromMax = Math.min(240, Math.max(96, perRow));
    const blended = Math.min(heightFromMax, widthBased * 1.6);
    return Math.round(Math.min(220, Math.max(92, blended)));
  }

  private _computePanelScale(panelHeightPx: number): number {
    const baseline = 128;
    const normalized = panelHeightPx / baseline;
    const clamped = Math.min(1.28, Math.max(0.76, normalized));
    return Number(clamped.toFixed(3));
  }

  private _startResizeObserver(): void {
    if (typeof ResizeObserver === "undefined" || this._resizeObserver) {
      return;
    }

    const updateWidth = (): void => {
      const width = Math.round(this.getBoundingClientRect().width);
      if (!Number.isFinite(width) || width <= 0) {
        return;
      }
      if (width !== this._cardWidth) {
        this._cardWidth = width;
      }
    };

    this._resizeObserver = new ResizeObserver(() => {
      updateWidth();
    });
    this._resizeObserver.observe(this);
    updateWidth();
  }

  private _shouldShowPerformance(
    panel: DerivedPanelState,
    panelHeightPx: number,
    panelWidthPx: number,
  ): boolean {
    if (panel.performancePercent === null || panel.ratedPowerW === null) {
      return false;
    }

    return panelHeightPx >= 94 && panelWidthPx >= 110;
  }

  private _formatPanelPerformanceText(
    panel: DerivedPanelState,
    panelWidthPx: number,
    panelHeightPx: number,
    candidates = this._buildPanelPerformanceLabelCandidates(panel),
  ): string {
    if (!candidates) {
      return "";
    }

    const scale = this._computePanelScale(panelHeightPx);
    const rem = Math.min(0.96, Math.max(0.62, 0.72 * scale));
    const fontPx = rem * 16;

    return choosePanelPerformanceLabel({
      candidates,
      panelWidthPx,
      panelHeightPx,
      fontPx,
      reservedRightPx: PANEL_SLOT_LABEL_SAFE_WIDTH_PX,
      measureTextWidthPx: (text, size) => this._measureTextWidthPx(text, size),
    }).text;
  }

  private _buildPanelPerformanceLabelCandidates(
    panel: DerivedPanelState,
  ): PanelPerformanceLabelCandidate[] | null {
    if (panel.performancePercent === null || panel.ratedPowerW === null) {
      return null;
    }

    const percent = panel.performancePercent.toFixed(0);
    const rated = panel.ratedPowerW.toFixed(0);

    return [
      {
        variant: "full",
        text: this._t("card.panel.performance_full", { percent, rated }),
      },
      {
        variant: "medium",
        text: this._t("card.panel.performance_medium", { percent, rated }),
      },
      {
        variant: "compact",
        text: this._t("card.panel.performance_compact", { percent }),
      },
    ];
  }

  private _measureTextWidthPx(text: string, fontPx: number): number {
    if (typeof document === "undefined") {
      return text.length * fontPx * 0.52;
    }
    if (SolarPanelVisualizerBaseCard._textMeasureContext === undefined) {
      const canvas = document.createElement("canvas");
      SolarPanelVisualizerBaseCard._textMeasureContext = canvas.getContext("2d");
    }
    const ctx = SolarPanelVisualizerBaseCard._textMeasureContext;
    if (!ctx) {
      return text.length * fontPx * 0.52;
    }
    ctx.font = `500 ${fontPx}px system-ui, -apple-system, "Segoe UI", sans-serif`;
    return ctx.measureText(text).width;
  }

  private _handlePanelClick(panel: DerivedPanelState): void {
    if (panel.hiddenSlot) {
      return;
    }

    if ((this._config?.panel_tap_action ?? "details") === "details") {
      this._showLivePowerPopup = false;
      this._showEnergyPopup = false;
      this._showCustomKpiPopup = false;
      this._showSystemHealthPopup = false;
      this._selectedPanelId = panel.id;
      this._popupGraphRangeHours = 6;
      this._clearTelemetryGraph();
      this._kpiCompareExpanded = { power: false, energy: false };
      this._kpiCompareRangeHours = { power: 6, energy: 6 };
      void this._ensurePopupGraphLoaded(panel.id, 6);
    }
  }

  private _resolveUnit(
    key: "power_entity" | "energy_entity",
    fallback: string,
  ): string {
    if (!this._config) {
      return fallback;
    }

    for (const panel of this._config.panels) {
      const entityId = panel[key];
      if (!entityId) {
        continue;
      }
      const unit = this.hass?.states?.[entityId]?.attributes?.unit_of_measurement;
      if (typeof unit === "string" && unit.trim().length > 0) {
        return unit;
      }
    }

    return fallback;
  }

  private _getSystemPowerEntityId(): string | null {
    if (!this._config) {
      return null;
    }
    if (!(this._config.use_system_power_entity ?? false)) {
      return null;
    }
    const entityId = this._config.system_power_entity?.trim();
    return entityId && entityId.length > 0 ? entityId : null;
  }

  private _getSystemEnergyEntityId(): string | null {
    if (!this._config) {
      return null;
    }
    if (!(this._config.use_system_energy_entity ?? false)) {
      return null;
    }
    const entityId = this._config.system_energy_entity?.trim();
    return entityId && entityId.length > 0 ? entityId : null;
  }

  private _getSystemEntityIdForKind(kind: PanelCompareMetricKind): string | null {
    return kind === "energy"
      ? this._getSystemEnergyEntityId()
      : this._getSystemPowerEntityId();
  }

  private _getForecastEntityId(kind: "power" | "energy"): string | null {
    return resolveForecastEntityId(this.hass, kind);
  }

  private _isForecastDefaultEntity(entityId: string): boolean {
    return (
      entityId === getForecastEntityId("power") || entityId === getForecastEntityId("energy")
    );
  }

  private _isForecastOverlayEnabled(): boolean {
    return this._config?.enable_forecast_overlay ?? false;
  }

  private _resolveForecastMetricDisplay(
    kind: "power" | "energy",
    decimals: number,
    fallbackUnit: string,
  ): {
    expectedEntityId: string;
    entityId: string | null;
    value: number | null;
    unit: string;
    display: string;
  } {
    const expectedEntityId = getForecastEntityId(kind);
    const entityId = this._getForecastEntityId(kind);
    if (!entityId) {
      return {
        expectedEntityId,
        entityId: null,
        value: null,
        unit: fallbackUnit,
        display: this._t("common.not_configured"),
      };
    }

    const unit = this._getUnitForEntity(entityId, fallbackUnit);
    const raw = Number(this.hass?.states?.[entityId]?.state);
    const value = Number.isFinite(raw) ? normalizeNegativeZero(raw) : null;
    const locale = this.hass?.locale?.language ?? "en";

    return {
      expectedEntityId,
      entityId,
      value,
      unit,
      display: formatSummaryValue(value, decimals, unit, this._t("common.unavailable"), locale),
    };
  }

  protected _resolveSummaryPower(derived: DerivedArrayState): {
    value: number | null;
    unit: string;
  } {
    const systemPowerEntityId = this._getSystemPowerEntityId();
    if (systemPowerEntityId) {
      const entity = this.hass?.states?.[systemPowerEntityId];
      const numeric = Number(entity?.state);
      const value = Number.isFinite(numeric) ? numeric : null;
      const adjustedValue =
        value === null
          ? null
          : this._config?.invert_system_power
            ? normalizeNegativeZero(value * -1)
            : normalizeNegativeZero(value);
      return {
        value: adjustedValue,
        unit: this._getUnitForEntity(systemPowerEntityId, "W"),
      };
    }

    return {
      value: derived.totalPower,
      unit: this._resolveUnit("power_entity", "W"),
    };
  }

  protected _resolveSummaryEnergy(derived: DerivedArrayState): {
    value: number | null;
    unit: string;
  } {
    const systemEnergyEntityId = this._getSystemEnergyEntityId();
    if (!this._config) {
      return { value: null, unit: "kWh" };
    }

    if (systemEnergyEntityId) {
      const entity = this.hass?.states?.[systemEnergyEntityId];
      const numeric = Number(entity?.state);
      return {
        value: Number.isFinite(numeric) ? numeric : null,
        unit: this._getUnitForEntity(systemEnergyEntityId, "kWh"),
      };
    }

    return {
      value: derived.totalEnergy,
      unit: this._resolveUnit("energy_entity", "kWh"),
    };
  }

  private _isSummaryEnergyConfigured(): boolean {
    if (!this._config) {
      return false;
    }

    if (this._config.use_system_energy_entity ?? false) {
      return Boolean(this._config.system_energy_entity?.trim());
    }

    return this._config.panels.some((panel) => Boolean(panel.energy_entity));
  }

  protected _resolveCustomKpi(): { title: string; value: string } {
    const rawTitle = this._config?.custom_kpi_title;
    const title = rawTitle !== undefined ? rawTitle : "Custom KPI";
    const entityId = this._getCustomKpiEntityId();
    if (!entityId) {
      return { title, value: "Not configured" };
    }

    const entity = this.hass?.states?.[entityId];
    if (!entity) {
      return { title, value: "Unavailable" };
    }

    const rawState = entity.state?.toString().trim().toLowerCase();
    if (!rawState || rawState === "unknown" || rawState === "unavailable") {
      return { title, value: "Unavailable" };
    }

    const numeric = Number(entity.state);
    if (Number.isFinite(numeric)) {
      const locale = this.hass?.locale?.language ?? "en";
      const unit = this._getUnitForEntity(entityId, "");
      const adjustedNumeric = this._config?.invert_custom_kpi
        ? normalizeNegativeZero(numeric * -1)
        : normalizeNegativeZero(numeric);
      const formatted = formatCustomKpiStateValue(
        String(adjustedNumeric),
        locale,
        this._config?.custom_kpi_decimals ?? 0,
        unit,
      );
      return {
        title,
        value: formatted ?? entity.state,
      };
    }

    return { title, value: entity.state };
  }

  private _getCustomKpiEntityId(): string | null {
    const entityId = this._config?.custom_kpi_entity?.trim();
    return entityId && entityId.length > 0 ? entityId : null;
  }

  private _enableForecastOverlayFromPopup = (): void => {
    if (!this._config || this._isForecastOverlayEnabled()) {
      return;
    }
    const forecastPowerEntityId = this._getForecastEntityId("power");
    const forecastEnergyEntityId = this._getForecastEntityId("energy");
    this._commitConfigFromCard(
      normalizeConfig({
        ...this._config,
        enable_forecast_overlay: true,
      }),
    );
    if (this._showLivePowerPopup && forecastPowerEntityId) {
      const systemPowerEntityId = this._getSystemPowerEntityId();
      const range = systemPowerEntityId
        ? this._popupGraphRangeHours
        : this._kpiCompareRangeHours.power;
      if (systemPowerEntityId) {
        void this._ensurePopupGraphLoadedByEntity(systemPowerEntityId, range);
      } else {
        const derived =
          this._derived ??
          (this._config && this.hass ? deriveArrayState(this._config, this.hass) : null);
        if (derived) {
          void this._ensurePanelCompareLoaded(derived, "power", range);
        }
      }
      void this._ensurePopupGraphLoadedByEntity(forecastPowerEntityId, range);
    }
    if (this._showEnergyPopup && forecastEnergyEntityId) {
      const systemEnergyEntityId = this._getSystemEnergyEntityId();
      const range = systemEnergyEntityId
        ? this._popupGraphRangeHours
        : this._kpiCompareRangeHours.energy;
      if (systemEnergyEntityId) {
        void this._ensurePopupGraphLoadedByEntity(systemEnergyEntityId, range);
      } else {
        const derived =
          this._derived ??
          (this._config && this.hass ? deriveArrayState(this._config, this.hass) : null);
        if (derived) {
          void this._ensurePanelCompareLoaded(derived, "energy", range);
        }
      }
      void this._ensurePopupGraphLoadedByEntity(forecastEnergyEntityId, range);
    }
  };

  private _handlePopupUserInteraction = (event: Event): void => {
    event.stopPropagation();
    this._clearPopupScrollRestore();
  };

  private _stopPopupEventPropagation = (event: Event): void => {
    event.stopPropagation();
  };

  private _handlePopupCloseClick(event: Event, onClick: () => void): void {
    event.preventDefault();
    event.stopPropagation();
    onClick();
  }

  private _closeAllPopups(): void {
    this._selectedPanelId = null;
    this._showLivePowerPopup = false;
    this._showEnergyPopup = false;
    this._showCustomKpiPopup = false;
    this._showSystemHealthPopup = false;
    this._clearTelemetryGraph();
    this._clearPopupScrollRestore();
  }

  private _closeDialog = (): void => {
    this._closeAllPopups();
    this._kpiCompareExpanded = { power: false, energy: false };
    this._kpiCompareRangeHours = { power: 6, energy: 6 };
  };

  private _openLivePowerPopup = (): void => {
    this._selectedPanelId = null;
    this._clearTelemetryGraph();
    const systemPowerEntityId = this._getSystemPowerEntityId();
    this._kpiCompareExpanded = { power: false, energy: false };
    this._kpiCompareRangeHours = { power: 6, energy: 6 };
    this._showLivePowerPopup = true;
    this._showEnergyPopup = false;
    this._showCustomKpiPopup = false;
    this._showSystemHealthPopup = false;
    this._popupGraphRangeHours = 6;
    if (systemPowerEntityId) {
      void this._ensurePopupGraphLoadedByEntity(systemPowerEntityId, 6);
      if (this._isForecastOverlayEnabled()) {
        const forecastPowerEntityId = this._getForecastEntityId("power");
        if (forecastPowerEntityId) {
          void this._ensurePopupGraphLoadedByEntity(forecastPowerEntityId, 6);
        }
      }
    } else {
      const derived = this._derived ?? (this._config && this.hass ? deriveArrayState(this._config, this.hass) : null);
      if (derived) {
        this._kpiCompareExpanded = {
          ...this._kpiCompareExpanded,
          power: this._buildPanelCompareTargets(derived, "power").length > 0,
        };
        void this._ensurePanelCompareLoaded(derived, "power", this._kpiCompareRangeHours.power);
      }
      if (this._isForecastOverlayEnabled()) {
        const forecastPowerEntityId = this._getForecastEntityId("power");
        if (forecastPowerEntityId) {
          void this._ensurePopupGraphLoadedByEntity(
            forecastPowerEntityId,
            this._kpiCompareRangeHours.power,
          );
        }
      }
    }
  };

  private _closeLivePowerPopup = (): void => {
    this._closeAllPopups();
  };

  private _openEnergyPopup = (): void => {
    this._selectedPanelId = null;
    this._clearTelemetryGraph();
    const systemEnergyEntityId = this._getSystemEnergyEntityId();
    this._kpiCompareExpanded = { power: false, energy: false };
    this._kpiCompareRangeHours = { power: 6, energy: 6 };
    this._showEnergyPopup = true;
    this._showLivePowerPopup = false;
    this._showCustomKpiPopup = false;
    this._showSystemHealthPopup = false;
    this._popupGraphRangeHours = 6;
    if (systemEnergyEntityId) {
      void this._ensurePopupGraphLoadedByEntity(systemEnergyEntityId, 6);
      if (this._isForecastOverlayEnabled()) {
        const forecastEnergyEntityId = this._getForecastEntityId("energy");
        if (forecastEnergyEntityId) {
          void this._ensurePopupGraphLoadedByEntity(forecastEnergyEntityId, 6);
        }
      }
    } else {
      const derived = this._derived ?? (this._config && this.hass ? deriveArrayState(this._config, this.hass) : null);
      if (derived) {
        this._kpiCompareExpanded = {
          ...this._kpiCompareExpanded,
          energy: this._buildPanelCompareTargets(derived, "energy").length > 0,
        };
        void this._ensurePanelCompareLoaded(derived, "energy", this._kpiCompareRangeHours.energy);
      }
      if (this._isForecastOverlayEnabled()) {
        const forecastEnergyEntityId = this._getForecastEntityId("energy");
        if (forecastEnergyEntityId) {
          void this._ensurePopupGraphLoadedByEntity(
            forecastEnergyEntityId,
            this._kpiCompareRangeHours.energy,
          );
        }
      }
    }
  };

  private _closeEnergyPopup = (): void => {
    this._closeAllPopups();
  };

  private _openCustomKpiPopup = (): void => {
    this._selectedPanelId = null;
    this._clearTelemetryGraph();
    this._kpiCompareExpanded = { power: false, energy: false };
    this._kpiCompareRangeHours = { power: 6, energy: 6 };
    this._showCustomKpiPopup = true;
    this._showLivePowerPopup = false;
    this._showEnergyPopup = false;
    this._showSystemHealthPopup = false;
    this._popupGraphRangeHours = 6;
    const customKpiEntityId = this._getCustomKpiEntityId();
    if (customKpiEntityId) {
      void this._ensurePopupGraphLoadedByEntity(customKpiEntityId, 6);
    }
  };

  private _closeCustomKpiPopup = (): void => {
    this._closeAllPopups();
  };

  private _openSystemHealthPopup = (): void => {
    this._showSystemHealthPopup = true;
    this._showLivePowerPopup = false;
    this._showEnergyPopup = false;
    this._showCustomKpiPopup = false;
    this._selectedPanelId = null;
    this._clearTelemetryGraph();
    this._kpiCompareExpanded = { power: false, energy: false };
    this._kpiCompareRangeHours = { power: 6, energy: 6 };
  };

  private _closeSystemHealthPopup = (): void => {
    this._closeAllPopups();
  };

  private _preventRangeChipFocusScroll = (event: Event): void => {
    event.preventDefault();
  };

  private _clearPopupScrollRestore(): void {
    const restore = this._popupScrollRestore;
    if (restore && restore.frameId !== null && typeof window !== "undefined") {
      window.cancelAnimationFrame(restore.frameId);
    }
    this._popupScrollRestore = null;
    this._popupScrollRestoreToken++;
  }

  private _captureScrollPositionsForPopupGraph(event?: Event): number | null {
    const eventTarget =
      event?.currentTarget instanceof HTMLElement
        ? event.currentTarget
        : event?.target instanceof HTMLElement
          ? event.target
          : null;
    const popupFromEvent = eventTarget?.closest<HTMLElement>(".spv-popup") ?? null;
    const popup = popupFromEvent ?? this.renderRoot.querySelector<HTMLElement>(".spv-popup");
    if (!popup) {
      this._popupScrollRestore = null;
      return null;
    }

    const token = ++this._popupScrollRestoreToken;
    this._popupScrollRestore = {
      token,
      popup,
      top: popup.scrollTop,
      left: popup.scrollLeft,
      expiresAt: Date.now() + 2500,
      frameId: null,
      framesRemaining: 0,
    };
    this._scheduleCapturedScrollRestore(token);
    return token;
  }

  private _scheduleCapturedScrollRestore(
    token: number | null | undefined,
    frames = 2,
  ): void {
    if (!token || typeof window === "undefined") {
      return;
    }
    if (!this._hasPopupOpen()) {
      this._popupScrollRestore = null;
      return;
    }
    const restore = this._popupScrollRestore;
    if (!restore || restore.token !== token) {
      return;
    }
    if (restore.expiresAt < Date.now()) {
      this._popupScrollRestore = null;
      return;
    }

    restore.framesRemaining = Math.max(restore.framesRemaining, frames);
    if (restore.frameId !== null) {
      return;
    }

    restore.frameId = window.requestAnimationFrame(() => {
      const current = this._popupScrollRestore;
      if (!current || current.token !== token) {
        return;
      }

      current.frameId = null;
      if (!this._hasPopupOpen()) {
        this._popupScrollRestore = null;
        return;
      }
      if (current.expiresAt < Date.now()) {
        this._popupScrollRestore = null;
        return;
      }

      if (current.popup.isConnected) {
        current.popup.scrollTop = current.top;
        current.popup.scrollLeft = current.left;
      }

      current.framesRemaining = Math.max(0, current.framesRemaining - 1);
      if (current.framesRemaining > 0) {
        this._scheduleCapturedScrollRestore(token, current.framesRemaining);
        return;
      }

      this._popupScrollRestore = null;
    });
  }

  private _renderInlinePanelConfig(panel: DerivedPanelState) {
    const panelConfig = this._config?.panels.find((item) => item.id === panel.id);
    if (!panelConfig) {
      return nothing;
    }
    const availablePowerEntities = this._getAvailableQuickSetupPowerEntities(panel.id);
    const disableChecked = !(panelConfig.enabled ?? true);

    return html`
      <div class="inline-config">
        <p class="subtitle">Quick Setup:</p>
        <ha-selector
          .hass=${this.hass}
          .value=${panelConfig.power_entity ?? ""}
          .required=${false}
          .selector=${{
            entity: {
              domain: "sensor",
              include_entities: availablePowerEntities,
            },
          }}
          .label=${"Select panel power sensor"}
          @value-changed=${(event: CustomEvent) =>
            this._updatePanelConfigFromCard(panel.id, "power_entity", event.detail.value)}
        ></ha-selector>
        ${availablePowerEntities.length === 0
          ? html`<p class="subtitle">No available W sensors found.</p>`
          : nothing}
        <div class="toggle">
          <ha-switch
            .checked=${disableChecked}
            @change=${(event: Event) =>
              this._updatePanelConfigFromCard(
                panel.id,
                "enabled",
                !(event.currentTarget as HTMLInputElement).checked,
              )}
          >Disable Panel (hide but keep slot when off)</ha-switch>
        </div>
      </div>
    `;
  }

  private _getAvailableQuickSetupPowerEntities(panelId: string): string[] {
    if (!this._config || !this.hass) {
      return [];
    }

    const currentPanel = this._config.panels.find((panel) => panel.id === panelId);
    const currentEntityId = currentPanel?.power_entity;
    const usedByOthers = this._config.enable_string_sensor_sharing
      ? new Set<string>()
      : new Set(
          this._config.panels
            .filter((panel) => panel.id !== panelId)
            .map((panel) => panel.power_entity)
            .filter((entityId): entityId is string => Boolean(entityId)),
        );

    const options: string[] = [];
    for (const entity of Object.values(this.hass.states)) {
      if (!entity.entity_id.startsWith("sensor.")) {
        continue;
      }
      const unitRaw = entity.attributes?.unit_of_measurement;
      if (typeof unitRaw !== "string" || unitRaw.trim().toLowerCase() !== "w") {
        continue;
      }
      if (usedByOthers.has(entity.entity_id) && entity.entity_id !== currentEntityId) {
        continue;
      }
      options.push(entity.entity_id);
    }

    if (
      typeof currentEntityId === "string" &&
      currentEntityId.length > 0 &&
      !options.includes(currentEntityId)
    ) {
      options.push(currentEntityId);
    }

    return options.sort(naturalCompare);
  }

  private _updatePanelConfigFromCard(
    panelId: string,
    key: keyof PanelConfig,
    value: unknown,
  ): void {
    if (!this._config) {
      return;
    }

    const panelIndex = this._config.panels.findIndex((panel) => panel.id === panelId);
    if (panelIndex < 0) {
      return;
    }

    const panels = this._config.panels.map((panel, index) => {
      if (index !== panelIndex) {
        return panel;
      }

      const nextPanel: PanelConfig = { ...panel, [key]: value };
      if (key === "power_entity") {
        const previousEntityId = panel.power_entity;
        const nextEntityId = typeof value === "string" ? value.trim() : "";
        const nextFriendlyName = this._getEntityFriendlyName(nextEntityId);
        if (
          nextFriendlyName &&
          this._shouldAutoRenamePanelName(panel.name, panel.id, previousEntityId)
        ) {
          nextPanel.name = nextFriendlyName;
        }
      }
      return nextPanel;
    });
    const updatedConfig = normalizeConfig({
      ...this._config,
      panels,
    });

    this._commitConfigFromCard(updatedConfig);
    if (key === "power_entity") {
      const nextEntityId = typeof value === "string" ? value.trim() : "";
      if (nextEntityId.length > 0) {
        this._selectedPanelId = panelId;
        void this._ensurePopupGraphLoaded(panelId, this._popupGraphRangeHours);
      }
    }
  }

  private _getEntityFriendlyName(entityId: string | undefined): string | undefined {
    const normalizedEntityId = entityId?.trim();
    if (!normalizedEntityId) {
      return undefined;
    }
    const state = this.hass?.states?.[normalizedEntityId];
    const friendlyName = state?.attributes?.friendly_name;
    if (typeof friendlyName !== "string") {
      return undefined;
    }
    const normalized = friendlyName.trim();
    return normalized.length > 0 ? normalized : undefined;
  }

  private _shouldAutoRenamePanelName(
    currentName: string | undefined,
    panelId: string,
    previousPowerEntity: string | undefined,
  ): boolean {
    const normalizedName = currentName?.trim() ?? "";
    if (!normalizedName) {
      return true;
    }
    if (normalizedName === panelId) {
      return true;
    }
    if (/^panel\s+\d+$/i.test(normalizedName)) {
      return true;
    }

    const previousFriendlyName = this._getEntityFriendlyName(previousPowerEntity);
    return Boolean(previousFriendlyName && normalizedName === previousFriendlyName);
  }

  private _handleDragStart(event: DragEvent, slotIndex: number): void {
    this._dragSourceSlotIndex = slotIndex;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", String(slotIndex));
    }
  }

  private _handleDragOver = (event: DragEvent): void => {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "move";
    }
  };

  private _handleDrop(event: DragEvent, targetSlotIndex: number): void {
    event.preventDefault();
    if (!this._config) {
      return;
    }

    const sourceSlotIndex =
      this._dragSourceSlotIndex ??
      Number(event.dataTransfer?.getData("text/plain") ?? Number.NaN);
    if (!Number.isFinite(sourceSlotIndex) || sourceSlotIndex === targetSlotIndex) {
      return;
    }

    const panels = [...this._config.panels];
    const sourcePanel = panels[sourceSlotIndex];
    const targetPanel = panels[targetSlotIndex];
    if (!sourcePanel || !targetPanel) {
      return;
    }

    panels[sourceSlotIndex] = targetPanel;
    panels[targetSlotIndex] = sourcePanel;

    this._commitConfigFromCard(
      normalizeConfig({
        ...this._config,
        panels,
      }),
    );
  }

  private _handleDragEnd = (): void => {
    this._dragSourceSlotIndex = null;
  };

  private _commitConfigFromCard(config: SolarPanelVisualizerConfig): void {
    this._config = config;
    this._historySignature = "";
    this._historyQuerySignature = "";
    this._historyLastLoadMs = 0;
    this._historyLoadToken = 0;
    this._popupGraphCache = {};
    this._popupGraphLatestTokenByKey = {};
    this._kpiCompareCache = {};
    this._kpiCompareLatestTokenByKey = {};
    this._kpiCompareExpanded = { power: false, energy: false };
    this._kpiCompareRangeHours = { power: 6, energy: 6 };
    this._ensureHistoryLoaded();
    this._refreshDerived();
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config },
        bubbles: true,
        composed: true,
      }),
    );
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent(CARD_CONFIG_SYNC_EVENT, {
          detail: { config },
        }),
      );
    }
    void this._persistConfigToLovelace(config);
  }

  private async _persistConfigToLovelace(
    cardConfig: SolarPanelVisualizerConfig,
  ): Promise<void> {
    if (!this.hass?.callWS) {
      return;
    }

    const token = ++this._persistConfigToken;
    const lovelaceContext = this._findLovelaceContext();
    const urlPath = this._resolveDashboardUrlPath(lovelaceContext);

    try {
      const dashboardConfig =
        lovelaceContext && typeof lovelaceContext.config === "object"
          ? (lovelaceContext.config as Record<string, unknown>)
          : ((await this.hass.callWS({
              type: "lovelace/config",
              ...(urlPath ? { url_path: urlPath } : {}),
            })) as Record<string, unknown>);

      if (token !== this._persistConfigToken) {
        return;
      }

      const { config, replaced } = this._replaceCardConfigInDashboardConfig(
        dashboardConfig,
        cardConfig,
      );
      if (!replaced) {
        // eslint-disable-next-line no-console
        console.warn("Solar Panel Visualizer: Could not locate card config to persist changes.");
        return;
      }

      await this.hass.callWS({
        type: "lovelace/config/save",
        ...(urlPath ? { url_path: urlPath } : {}),
        config,
      });

      if (token !== this._persistConfigToken) {
        return;
      }

      if (lovelaceContext) {
        lovelaceContext.config = config;
      }
      this._sourceConfigRef = undefined;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn("Solar Panel Visualizer: Failed to persist dashboard config.", error);
    }
  }

  private _findLovelaceContext():
    | {
        config?: Record<string, unknown>;
        urlPath?: string;
      }
    | null {
    const visited = new Set<unknown>();
    let node: unknown = this;

    while (node && !visited.has(node)) {
      visited.add(node);

      if (
        typeof node === "object" &&
        node !== null &&
        "lovelace" in node &&
        (node as { lovelace?: unknown }).lovelace &&
        typeof (node as { lovelace?: unknown }).lovelace === "object"
      ) {
        return (node as { lovelace: { config?: Record<string, unknown>; urlPath?: string } })
          .lovelace;
      }

      const asNode = node as Node & { parentElement?: Element | null };
      const rootNode =
        typeof asNode.getRootNode === "function"
          ? (asNode.getRootNode() as ShadowRoot | Document)
          : null;
      const host = rootNode && "host" in rootNode ? (rootNode as ShadowRoot).host : null;
      if (host && host !== node) {
        node = host;
        continue;
      }

      node = asNode.parentElement ?? null;
    }

    return null;
  }

  private _resolveDashboardUrlPath(
    lovelaceContext: { urlPath?: string } | null,
  ): string | undefined {
    const fromContext = lovelaceContext?.urlPath?.trim();
    if (fromContext) {
      return fromContext;
    }

    if (typeof window === "undefined") {
      return undefined;
    }
    const firstSegment = window.location.pathname
      .replace(/^\/+/, "")
      .split("/")[0]
      ?.trim();
    return firstSegment && firstSegment.length > 0 ? firstSegment : undefined;
  }

  private _replaceCardConfigInDashboardConfig(
    dashboardConfig: Record<string, unknown>,
    nextCardConfig: SolarPanelVisualizerConfig,
  ): { config: Record<string, unknown>; replaced: boolean } {
    const byReference = this._replaceFirstMatch(dashboardConfig, (candidate) =>
      Boolean(this._sourceConfigRef) && candidate === this._sourceConfigRef,
      nextCardConfig,
    );
    if (byReference.replaced) {
      return {
        config: byReference.value as Record<string, unknown>,
        replaced: true,
      };
    }

    const bySignature = this._replaceFirstMatch(
      dashboardConfig,
      (candidate) => this._matchesCurrentCardSignature(candidate),
      nextCardConfig,
    );
    return {
      config: bySignature.value as Record<string, unknown>,
      replaced: bySignature.replaced,
    };
  }

  private _replaceFirstMatch(
    root: unknown,
    matcher: (candidate: unknown) => boolean,
    replacement: SolarPanelVisualizerConfig,
  ): { value: unknown; replaced: boolean } {
    let replaced = false;

    const visit = (value: unknown): unknown => {
      if (replaced) {
        return value;
      }

      if (matcher(value)) {
        replaced = true;
        return replacement;
      }

      if (Array.isArray(value)) {
        let changed = false;
        const next = value.map((item) => {
          const updated = visit(item);
          if (updated !== item) {
            changed = true;
          }
          return updated;
        });
        return changed ? next : value;
      }

      if (typeof value !== "object" || value === null) {
        return value;
      }

      let changed = false;
      const nextObject: Record<string, unknown> = {};
      for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
        const updated = visit(child);
        nextObject[key] = updated;
        if (updated !== child) {
          changed = true;
        }
      }
      return changed ? nextObject : value;
    };

    return { value: visit(root), replaced };
  }

  private _matchesCurrentCardSignature(candidate: unknown): boolean {
    if (!this._config || typeof candidate !== "object" || candidate === null) {
      return false;
    }
    const configCandidate = candidate as Partial<SolarPanelVisualizerConfig>;
    if (configCandidate.type !== this._config.type) {
      return false;
    }

    const rows = Number(configCandidate.rows);
    const columns = Number(configCandidate.columns);
    if (rows !== this._config.rows || columns !== this._config.columns) {
      return false;
    }

    const candidatePanels = Array.isArray(configCandidate.panels)
      ? configCandidate.panels
      : [];
    const candidatePanelIds = candidatePanels
      .map((panel) =>
        typeof panel === "object" &&
        panel !== null &&
        typeof (panel as { id?: unknown }).id === "string"
          ? (panel as { id: string }).id
          : "",
      )
      .sort()
      .join("|");
    const currentPanelIds = this._config.panels
      .map((panel) => panel.id)
      .sort()
      .join("|");

    return candidatePanelIds.length > 0 && candidatePanelIds === currentPanelIds;
  }

  private _adjustGraphSamplesForEntity(
    entityId: string,
    samples: PowerSample[],
  ): PowerSample[] {
    const systemPowerEntityId = this._getSystemPowerEntityId();
    const shouldInvert =
      (this._config?.invert_system_power ?? false) &&
      !!systemPowerEntityId &&
      entityId === systemPowerEntityId;

    return samples.map((sample) => ({
      ts: sample.ts,
      value: shouldInvert
        ? normalizeNegativeZero(sample.value * -1)
        : normalizeNegativeZero(sample.value),
    }));
  }

  private _scaleGraphSamples(
    samples: PowerSample[],
    scale = 1,
  ): PowerSample[] {
    if (scale === 1) {
      return samples;
    }
    return samples.map((sample) => ({
      ts: sample.ts,
      value: normalizeNegativeZero(sample.value * scale),
    }));
  }

  private _expandSinglePointRangeSamples(
    samples: PowerSample[],
    rangeHours: PopupGraphRangeHours,
  ): PowerSample[] {
    if (samples.length !== 1) {
      return samples;
    }
    const value = samples[0].value;
    const nowMs = Date.now();
    const startTs = nowMs - rangeHours * 60 * 60 * 1000;
    return [
      { ts: startTs, value },
      { ts: nowMs, value },
    ];
  }

  private _fillRangeStartWithFirstSample(
    samples: PowerSample[],
    rangeHours: PopupGraphRangeHours,
    enabled: boolean,
  ): PowerSample[] {
    if (!enabled || samples.length === 0) {
      return samples;
    }

    const nowMs = Date.now();
    const threshold = nowMs - rangeHours * 60 * 60 * 1000;
    const sorted = [...samples].sort((a, b) => a.ts - b.ts);
    const first = sorted[0];
    if (!first || first.ts <= threshold) {
      return sorted;
    }

    return [{ ts: threshold, value: first.value }, ...sorted];
  }

  private _getPowerEntities(): string[] {
    if (!this._config) {
      return [];
    }
    const entities = this._config.panels
      .map((panel) => panel.power_entity)
      .filter((entityId): entityId is string => Boolean(entityId));
    return [...new Set(entities)];
  }

  private _getHistoryHours(): number {
    return this._config?.deviation_history_hours ?? 12;
  }

  private _getHistoryQuerySignature(): string {
    if (!this._config || !this.hass) {
      return "";
    }
    const entities = this._getPowerEntities().sort().join("|");
    return `${this._getHistoryHours()}:${entities}`;
  }

  private _getHistorySignature(): string {
    if (!this._config || !this.hass) {
      return "";
    }
    const entities = this._getHistoryQuerySignature();
    const restartToken = this._getRestartToken();
    return `${entities}:${restartToken ?? ""}`;
  }

  private _getRestartToken(): string | undefined {
    const restartEntity = this._config?.deviation_restart_entity;
    if (!restartEntity) {
      return undefined;
    }
    const entity = this.hass?.states?.[restartEntity];
    const state = entity?.state?.toString().trim();
    if (!state) {
      return undefined;
    }
    const directTimestamp = Date.parse(state);
    if (Number.isFinite(directTimestamp)) {
      return String(directTimestamp);
    }
    const restartAttributeCandidates = [
      entity?.attributes?.last_restart,
      entity?.attributes?.last_reset,
      entity?.attributes?.boot_time,
      entity?.attributes?.started,
      entity?.attributes?.start_time,
    ];
    for (const candidate of restartAttributeCandidates) {
      if (typeof candidate !== "string" || candidate.trim().length === 0) {
        continue;
      }
      const parsed = Date.parse(candidate);
      if (Number.isFinite(parsed)) {
        return String(parsed);
      }
    }
    if (/^[-+]?\d+(\.\d+)?$/.test(state)) {
      return undefined;
    }
    return state;
  }

  private _historyCacheKey(): string {
    return `${HISTORY_CACHE_PREFIX}${this._getHistorySignature()}`;
  }

  private _pruneSamples(samples: PowerSample[], keepHours = this._getHistoryHours()): PowerSample[] {
    const now = Date.now();
    const threshold = now - keepHours * 60 * 60 * 1000;
    return samples
      .filter((sample) => sample.ts >= threshold && Number.isFinite(sample.value))
      .sort((a, b) => a.ts - b.ts);
  }

  private _syncLiveSamplesFromHass(): void {
    if (!this.hass || !this._config) {
      return;
    }

    let touched = false;
    const now = Date.now();
    for (const panel of this._config.panels) {
      const entityId = panel.power_entity;
      if (!entityId) {
        continue;
      }
      const entity = this.hass.states[entityId];
      const numeric = Number(entity?.state);
      if (!Number.isFinite(numeric)) {
        continue;
      }

      const existing = this._historyByEntityId[entityId] ?? [];
      const next = [...existing];
      const last = next[next.length - 1];
      if (!last || Math.abs(now - last.ts) > 60_000 || Math.abs(last.value - numeric) > 0.01) {
        next.push({ ts: now, value: numeric });
        this._historyByEntityId[entityId] = this._pruneSamples(next);
        touched = true;
      }
    }

    if (touched) {
      this._saveHistoryCache();
    }
  }

  private _saveHistoryCache(): void {
    if (typeof window === "undefined" || !this._config) {
      return;
    }
    const payload = {
      v: HISTORY_CACHE_VERSION,
      savedAt: Date.now(),
      samples: this._historyByEntityId,
      reason: this._historyStateReason,
    };
    try {
      window.localStorage.setItem(this._historyCacheKey(), JSON.stringify(payload));
    } catch (_error) {
      // Ignore storage quota/runtime issues.
    }
  }

  private _loadHistoryCache(): void {
    if (typeof window === "undefined") {
      return;
    }
    try {
      const raw = window.localStorage.getItem(this._historyCacheKey());
      if (!raw) {
        return;
      }
      const parsed = JSON.parse(raw) as {
        v?: number;
        samples?: Record<string, PowerSample[]>;
      };
      if (parsed.v !== HISTORY_CACHE_VERSION || !parsed.samples) {
        return;
      }
      const normalized: Record<string, PowerSample[]> = {};
      for (const [entityId, samples] of Object.entries(parsed.samples)) {
        normalized[entityId] = this._pruneSamples(samples);
      }
      this._historyByEntityId = normalized;
    } catch (_error) {
      // Ignore cache parsing/runtime issues.
    }
  }

  private _ensureHistoryLoaded(): void {
    if (!this.hass || !this._config) {
      return;
    }
    if (!(this._config.enable_array_checks ?? false)) {
      this._historyState = "idle";
      this._historyStateReason = undefined;
      this._historySignature = "";
      this._historyQuerySignature = "";
      this._historyLastLoadMs = 0;
      this._historyByEntityId = {};
      return;
    }
    const signature = this._getHistorySignature();
    if (!signature) {
      return;
    }
    if (signature === this._historySignature && this._historyState !== "idle") {
      return;
    }
    const querySignature = this._getHistoryQuerySignature();
    const nowMs = Date.now();
    if (
      this._historyState === "loading" &&
      querySignature === this._historyQuerySignature
    ) {
      this._historySignature = signature;
      return;
    }
    if (
      querySignature === this._historyQuerySignature &&
      this._historyState !== "idle" &&
      nowMs - this._historyLastLoadMs < HISTORY_QUERY_RELOAD_THROTTLE_MS
    ) {
      this._historySignature = signature;
      return;
    }

    this._historySignature = signature;
    this._historyQuerySignature = querySignature;
    this._historyLastLoadMs = nowMs;
    this._historyByEntityId = {};
    this._loadHistoryCache();
    const token = ++this._historyLoadToken;
    void this._loadHistoryFromRecorder(token);
  }

  private async _loadHistoryFromRecorder(token: number): Promise<void> {
    if (!this.hass || !this._config) {
      return;
    }

    const entityIds = this._getPowerEntities();
    if (entityIds.length === 0) {
      this._historyState = "ready";
      this._historyStateReason = "No panel sensors configured.";
      this._refreshDerived();
      this.requestUpdate();
      return;
    }

    if (!this.hass.callApi && !this.hass.callWS) {
      this._historyState = "unavailable";
      this._historyStateReason = "Solar panel history API unavailable in this Home Assistant build.";
      this._refreshDerived();
      this.requestUpdate();
      return;
    }

    const now = Date.now();
    const startIso = new Date(now - this._getHistoryHours() * 60 * 60 * 1000).toISOString();
    const endIso = new Date(now).toISOString();
    this._historyState = "loading";
    this._historyStateReason = undefined;
    this.requestUpdate();

    try {
      const response = await this._fetchRecorderHistoryRaw(startIso, endIso, entityIds);
      if (token !== this._historyLoadToken) {
        return;
      }

      const samples = this._parseRecorderResponse(response, this._getHistoryHours(), entityIds);
      if (Object.keys(samples).length === 0) {
        this._historyState = "fallback";
        this._historyStateReason =
          "Solar panel history returned no samples, using live warm-up only.";
      } else {
        this._historyByEntityId = {
          ...this._historyByEntityId,
          ...samples,
        };
        this._historyState = "ready";
        this._historyStateReason = undefined;
      }
    } catch (_error) {
      if (token !== this._historyLoadToken) {
        return;
      }
      this._historyState = "fallback";
      this._historyStateReason =
        "Failed to read solar panel history, using live warm-up only.";
    }

    this._syncLiveSamplesFromHass();
    this._saveHistoryCache();
    this._refreshDerived();
    this.requestUpdate();
  }

  private async _fetchRecorderHistoryRaw(
    startIso: string,
    endIso: string,
    entityIds: string[],
  ): Promise<unknown> {
    if (!this.hass) {
      throw new Error("Home Assistant context unavailable");
    }

    const errors: unknown[] = [];
    const filterEntityId = entityIds.join(",");
    const rawPath = `history/period/${startIso}`;
    const encodedPath = `history/period/${encodeURIComponent(startIso)}`;
    const apiAttempts: Array<{ path: string; params: Record<string, unknown> }> = [];
    const minimalParams = {
      end_time: endIso,
      filter_entity_id: filterEntityId,
      no_attributes: true,
      significant_changes_only: false,
      minimal_response: true,
    };
    const basicParams = {
      end_time: endIso,
      filter_entity_id: filterEntityId,
    };
    apiAttempts.push({ path: rawPath, params: basicParams });
    apiAttempts.push({ path: rawPath, params: minimalParams });
    if (encodedPath !== rawPath) {
      apiAttempts.push({ path: encodedPath, params: basicParams });
      apiAttempts.push({ path: encodedPath, params: minimalParams });
    }

    if (this.hass.callApi) {
      for (const attempt of apiAttempts) {
        try {
          return await this.hass.callApi("GET", attempt.path, attempt.params);
        } catch (error) {
          errors.push(error);
        }
      }
    }

    if (this.hass.callWS) {
      const wsAttempts: Record<string, unknown>[] = [
        {
          type: "history/history_during_period",
          start_time: startIso,
          end_time: endIso,
          entity_ids: entityIds,
          no_attributes: true,
          significant_changes_only: false,
          minimal_response: true,
        },
        {
          type: "history/history_during_period",
          start_time: startIso,
          end_time: endIso,
          entity_ids: entityIds,
        },
      ];

      for (const attempt of wsAttempts) {
        try {
          return await this.hass.callWS(attempt);
        } catch (error) {
          errors.push(error);
        }
      }
    }

    if (errors.length > 0) {
      throw errors[errors.length - 1];
    }
    throw new Error("Recorder API unavailable");
  }

  private _parseRecorderResponse(
    response: unknown,
    keepHours = this._getHistoryHours(),
    entityIdsOrder: string[] = [],
  ): Record<string, PowerSample[]> {
    const byEntity: Record<string, PowerSample[]> = {};
    const parseTimestamp = (value: unknown): number => {
      if (typeof value === "number" && Number.isFinite(value)) {
        return value > 1e11 ? value : value * 1000;
      }

      if (typeof value === "string" && value.trim().length > 0) {
        const trimmed = value.trim();
        const numeric = Number(trimmed);
        if (Number.isFinite(numeric) && /^\d+(\.\d+)?$/.test(trimmed)) {
          return numeric > 1e11 ? numeric : numeric * 1000;
        }
        const parsedDate = Date.parse(trimmed);
        if (Number.isFinite(parsedDate)) {
          return parsedDate;
        }
      }

      return Number.NaN;
    };

    const ingestGroup = (group: unknown, defaultEntityId?: string): void => {
      if (!Array.isArray(group) || group.length === 0) {
        return;
      }

      let currentEntityId: string | undefined = defaultEntityId;
      for (const stateRow of group) {
        if (Array.isArray(stateRow)) {
          if (!currentEntityId || stateRow.length < 2) {
            continue;
          }
          const candidateATs = parseTimestamp(stateRow[0]);
          const candidateAValue = Number(stateRow[1]);
          const candidateBTs = parseTimestamp(stateRow[1]);
          const candidateBValue = Number(stateRow[0]);

          let ts = candidateATs;
          let value = candidateAValue;
          if (!Number.isFinite(ts) || !Number.isFinite(value)) {
            ts = candidateBTs;
            value = candidateBValue;
          }

          if (!Number.isFinite(ts) || !Number.isFinite(value)) {
            continue;
          }

          if (!byEntity[currentEntityId]) {
            byEntity[currentEntityId] = [];
          }
          byEntity[currentEntityId].push({ ts, value });
          continue;
        }

        if (typeof stateRow !== "object" || stateRow === null) {
          continue;
        }
        const row = stateRow as {
          entity_id?: unknown;
          e?: unknown;
          state?: unknown;
          s?: unknown;
          last_changed?: unknown;
          last_updated?: unknown;
          lc?: unknown;
          lu?: unknown;
          last_changed_ts?: unknown;
          last_updated_ts?: unknown;
          ts?: unknown;
        };
        const entityId =
          typeof row.entity_id === "string" && row.entity_id.length > 0
            ? row.entity_id
            : typeof row.e === "string" && row.e.length > 0
              ? row.e
            : currentEntityId;
        if (!entityId) {
          continue;
        }
        currentEntityId = entityId;

        const value = Number(row.state ?? row.s);
        if (!Number.isFinite(value)) {
          continue;
        }
        const timestampSource =
          typeof row.last_changed === "string"
            ? row.last_changed
            : typeof row.last_updated === "string"
              ? row.last_updated
              : row.lc ?? row.lu ?? row.last_changed_ts ?? row.last_updated_ts ?? row.ts;
        const ts = parseTimestamp(timestampSource);
        if (!Number.isFinite(ts)) {
          continue;
        }
        if (!byEntity[entityId]) {
          byEntity[entityId] = [];
        }
        byEntity[entityId].push({ ts, value });
      }
    };

    const normalizedResponse =
      typeof response === "object" &&
      response !== null &&
      "result" in (response as Record<string, unknown>)
        ? (response as { result: unknown }).result
        : response;

    if (Array.isArray(normalizedResponse)) {
      for (const [index, group] of normalizedResponse.entries()) {
        ingestGroup(group, entityIdsOrder[index]);
      }
    } else if (typeof normalizedResponse === "object" && normalizedResponse !== null) {
      for (const [entityId, group] of Object.entries(
        normalizedResponse as Record<string, unknown>,
      )) {
        ingestGroup(group, entityId);
      }
    } else {
      return byEntity;
    }

    for (const [entityId, samples] of Object.entries(byEntity)) {
      byEntity[entityId] = this._pruneSamples(samples, keepHours);
    }
    return byEntity;
  }
}

export class SolarPanelVisualizerCard extends SolarPanelVisualizerBaseCard {}

if (!customElements.get("solar-panel-visualizer")) {
  customElements.define("solar-panel-visualizer", SolarPanelVisualizerCard);
}

if (!customElements.get("solar-panel-visualizer-card")) {
  class SolarPanelVisualizerCardLegacy extends SolarPanelVisualizerCard {}
  customElements.define("solar-panel-visualizer-card", SolarPanelVisualizerCardLegacy);
}

declare global {
  interface HTMLElementTagNameMap {
    "solar-panel-visualizer-base": SolarPanelVisualizerBaseCard;
    "solar-panel-visualizer": SolarPanelVisualizerCard;
    "solar-panel-visualizer-card": SolarPanelVisualizerCard;
  }
}
