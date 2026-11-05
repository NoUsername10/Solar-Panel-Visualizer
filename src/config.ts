import type {
  PanelColors,
  PanelConfig,
  SolarPanelVisualizerConfig,
  StringGroupConfig,
} from "./types";

export const CARD_ELEMENT_NAME = "solar-panel-visualizer";
export const CARD_TYPE = `custom:${CARD_ELEMENT_NAME}`;

export const DEFAULT_COLORS: PanelColors = {
  production_start: "#8dcf72",
  production_mid: "#bfe36a",
  production_end: "#ffd35a",
  deviation: "#ff9667",
  error: "#ff627f",
  unavailable: "#586779",
};

const DEFAULT_ROWS = 2;
const DEFAULT_COLUMNS = 3;
const DEFAULT_DEVIATION_THRESHOLD = 15;
const DEFAULT_DEVIATION_ABSOLUTE_W_THRESHOLD = 50;
const DEFAULT_DEVIATION_MIN_ACTIVE_PANELS = 3;
const DEFAULT_DEVIATION_MIN_SAMPLES = 3;
const DEFAULT_DEVIATION_MIN_RUNTIME_MINUTES = 20;
const DEFAULT_DEVIATION_SMOOTHING_MINUTES = 0;
const DEFAULT_DEVIATION_DYNAMIC_FLOOR_W = 30;
const DEFAULT_DEVIATION_HISTORY_HOURS = 12;
const DEFAULT_POWER_DECIMALS = 0;
const DEFAULT_ENERGY_DECIMALS = 2;
const DEFAULT_CUSTOM_KPI_DECIMALS = 0;
const DEFAULT_LIMIT_PANEL_WIDTH = false;
const DEFAULT_PANEL_MAX_WIDTH_PX = 220;
const DEFAULT_MAX_CARD_WIDTH = 980;
const DEFAULT_PRODUCTION_COLOR_INTENSITY = 1;
const DEFAULT_ENABLE_FORECAST_OVERLAY = false;
const DEFAULT_MOTION_ENABLED = true;
const DEFAULT_MOTION_POWER_FLOW = true;
const DEFAULT_MOTION_UPDATE_SHIMMER = true;
const DEFAULT_MOTION_ALERT_RIPPLE = true;
const DEFAULT_THEME_MODE: SolarPanelVisualizerConfig["theme_mode"] = "auto";
export const MAX_PANEL_RATED_POWER_W = 10000;
export const MAX_LAYOUT_DIMENSION = 30;
const DEFAULT_INVERTER_FAULT_TERMS = ["fault", "alarm", "error", "failed", "failure", "trip"];
const DEFAULT_INVERTER_WORKING_TERMS = [
  "normal",
  "ok",
  "running",
  "waiting",
  "waiting for operation",
  "producing",
];

const clampInteger = (
  value: unknown,
  fallback: number,
  min = 1,
  max = MAX_LAYOUT_DIMENSION,
): number => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return fallback;
  }
  return Math.min(Math.max(Math.round(numeric), min), max);
};

const clampFloat = (
  value: unknown,
  fallback: number,
  min = 0,
  max = 100,
): number => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return fallback;
  }
  return Math.min(Math.max(numeric, min), max);
};

const normalizeString = (value: unknown): string | undefined => {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const normalizeTrimmedString = (value: unknown): string | undefined => {
  if (typeof value !== "string") {
    return undefined;
  }
  return value.trim();
};

const normalizeBoolean = (value: unknown, fallback: boolean): boolean =>
  typeof value === "boolean" ? value : fallback;

const normalizeStringList = (
  value: unknown,
  fallback: string[],
): string[] => {
  const rawValues = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(",")
      : [];

  const normalized = rawValues
    .map((item) => (typeof item === "string" ? item.trim().toLowerCase() : ""))
    .filter((item) => item.length > 0);

  if (normalized.length === 0) {
    return [...fallback];
  }

  return [...new Set(normalized)];
};

const normalizeOptionalNumber = (
  value: unknown,
  min: number,
  max: number,
): number | undefined => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return undefined;
  }

  return Math.min(Math.max(numeric, min), max);
};

const normalizeOptionalPositiveNumber = (
  value: unknown,
  min: number,
  max: number,
): number | undefined => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric < min) {
    return undefined;
  }

  return Math.min(numeric, max);
};

const slotId = (index: number): string => `panel-${index + 1}`;

const normalizeTapAction = (value: unknown): "details" | "none" =>
  value === "none" ? "none" : "details";

const normalizeThemeMode = (value: unknown): SolarPanelVisualizerConfig["theme_mode"] =>
  value === "dark" || value === "light" ? value : DEFAULT_THEME_MODE;

const normalizeGridOptions = (
  value: unknown,
): SolarPanelVisualizerConfig["grid_options"] | undefined => {
  if (typeof value !== "object" || value === null) {
    return undefined;
  }

  const candidate = value as { columns?: unknown; rows?: unknown };
  const normalizedColumns =
    candidate.columns === "full" || typeof candidate.columns === "number"
      ? candidate.columns
      : undefined;
  const normalizedRows =
    candidate.rows === "auto" || typeof candidate.rows === "number"
      ? candidate.rows
      : undefined;

  if (normalizedColumns === undefined && normalizedRows === undefined) {
    return undefined;
  }

  return {
    columns: normalizedColumns,
    rows: normalizedRows,
  };
};

const ADVANCED_METRIC_KEYS = [
  "inverter_ac_power_entity",
  "inverter_ac_voltage_entity",
  "inverter_ac_current_entity",
  "inverter_temp_entity",
  "panel_current_entity",
  "panel_voltage_entity",
  "panel_power_entity",
] as const;

const normalizeAdvancedMetrics = (
  value: unknown,
  enabled: boolean,
): PanelConfig["advanced_metrics"] | undefined => {
  if (!enabled || typeof value !== "object" || value === null) {
    return undefined;
  }

  const candidate = value as Record<string, unknown>;
  const normalized: PanelConfig["advanced_metrics"] = {};
  let hasAny = false;

  for (const key of ADVANCED_METRIC_KEYS) {
    const normalizedValue = normalizeString(candidate[key]);
    normalized[key] = normalizedValue;
    if (normalizedValue) {
      hasAny = true;
    }
  }

  if (!hasAny) {
    return undefined;
  }

  return normalized;
};

const normalizePanel = (panel: Partial<PanelConfig> | undefined, index: number): PanelConfig => {
  const enabled = normalizeBoolean(panel?.enabled, true);
  return {
    id: normalizeString(panel?.id) ?? slotId(index),
    name: normalizeString(panel?.name),
    power_entity: enabled ? normalizeString(panel?.power_entity) : undefined,
    energy_entity: enabled ? normalizeString(panel?.energy_entity) : undefined,
    show_energy: normalizeBoolean(panel?.show_energy, false),
    inverter_status_entity: enabled
      ? normalizeString(panel?.inverter_status_entity) ??
        normalizeString(panel?.error_entity)
      : undefined,
    error_entity: enabled ? normalizeString(panel?.error_entity) : undefined,
    advanced_metrics: normalizeAdvancedMetrics(panel?.advanced_metrics, enabled),
    enabled,
    rated_power_w: normalizeOptionalPositiveNumber(panel?.rated_power_w, 1, MAX_PANEL_RATED_POWER_W),
    deviation_derate_percent: clampFloat(panel?.deviation_derate_percent, 100, 1, 100),
  };
};

const stringGroupId = (index: number): string => `string-${index + 1}`;

const normalizeStringGroup = (
  group: Partial<StringGroupConfig> | undefined,
  index: number,
): StringGroupConfig => ({
  id: normalizeString(group?.id) ?? stringGroupId(index),
  name: normalizeString(group?.name),
  panel_count: clampInteger(
    group?.panel_count,
    DEFAULT_COLUMNS,
    1,
    MAX_LAYOUT_DIMENSION,
  ),
  power_entity: normalizeString(group?.power_entity),
  energy_entity: normalizeString(group?.energy_entity),
});

const normalizeStringGroups = (value: unknown): StringGroupConfig[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .slice(0, MAX_LAYOUT_DIMENSION)
    .map((group, index) =>
      normalizeStringGroup(
        typeof group === "object" && group !== null
          ? (group as Partial<StringGroupConfig>)
          : undefined,
        index,
      ),
    );
};

const generatedStringPanelNameRegex = /^string\s+\d+\s+panel\s+\d+$/i;
const generatedDefaultPanelNameRegex = /^panel\s+\d+$/i;

const isGeneratedStringPanelName = (value: string | undefined): boolean =>
  typeof value === "string" &&
  (generatedStringPanelNameRegex.test(value.trim()) ||
    generatedDefaultPanelNameRegex.test(value.trim()));

export const syncPanelSlots = (
  rows: number,
  columns: number,
  panels: Partial<PanelConfig>[] = [],
): PanelConfig[] => {
  const count = rows * columns;
  return Array.from({ length: count }, (_, index) =>
    normalizePanel(panels[index], index),
  );
};

const syncStringGroupPanelSlots = (
  stringGroups: StringGroupConfig[],
  columns: number,
  panels: Partial<PanelConfig>[] = [],
  previousColumns = columns,
): PanelConfig[] => {
  const rows = stringGroups.length;
  const count = rows * columns;
  const normalizedPreviousColumns = clampInteger(
    previousColumns,
    columns,
    1,
    MAX_LAYOUT_DIMENSION,
  );
  return Array.from({ length: count }, (_, index) => {
    const rowIndex = Math.floor(index / columns);
    const columnIndex = index % columns;
    const previousIndex = rowIndex * normalizedPreviousColumns + columnIndex;
    const group = stringGroups[rowIndex];
    const base =
      columnIndex < normalizedPreviousColumns
        ? panels[previousIndex] ?? {}
        : {};
    const generatedName = `${group?.name ?? `String ${rowIndex + 1}`} Panel ${columnIndex + 1}`;
    const baseName = normalizeString(base.name);

    if (!group || columnIndex >= group.panel_count) {
      return normalizePanel(
        {
          ...base,
          name:
            baseName && !isGeneratedStringPanelName(baseName)
              ? baseName
              : undefined,
          enabled: false,
          power_entity: undefined,
          energy_entity: undefined,
          show_energy: false,
        },
        index,
      );
    }

    return normalizePanel(
      {
        ...base,
        name:
          baseName && !isGeneratedStringPanelName(baseName)
            ? baseName
            : generatedName,
        enabled: true,
        power_entity: group.power_entity,
        energy_entity: group.energy_entity,
        show_energy: group.energy_entity
          ? true
          : normalizeBoolean(base.show_energy, false),
      },
      index,
    );
  });
};

export const buildStubConfig = (
  rows = DEFAULT_ROWS,
  columns = DEFAULT_COLUMNS,
): SolarPanelVisualizerConfig => ({
  type: CARD_TYPE,
  title: "Solar Array",
  theme_mode: DEFAULT_THEME_MODE,
  rows,
  columns,
  panels: syncPanelSlots(rows, columns),
  enable_inverter_status: false,
  enable_string_sensor_sharing: false,
  string_groups: [],
  inverter_fault_terms: [...DEFAULT_INVERTER_FAULT_TERMS],
  inverter_working_terms: [...DEFAULT_INVERTER_WORKING_TERMS],
  show_inverter_status_on_tiles: false,
  enable_array_checks: false,
  deviation_threshold_percent: DEFAULT_DEVIATION_THRESHOLD,
  deviation_absolute_w_threshold: DEFAULT_DEVIATION_ABSOLUTE_W_THRESHOLD,
  deviation_min_active_panels: DEFAULT_DEVIATION_MIN_ACTIVE_PANELS,
  deviation_min_samples: DEFAULT_DEVIATION_MIN_SAMPLES,
  deviation_min_runtime_minutes: DEFAULT_DEVIATION_MIN_RUNTIME_MINUTES,
  deviation_smoothing_minutes: DEFAULT_DEVIATION_SMOOTHING_MINUTES,
  deviation_dynamic_floor_w: DEFAULT_DEVIATION_DYNAMIC_FLOOR_W,
  deviation_history_hours: DEFAULT_DEVIATION_HISTORY_HOURS,
  colors: DEFAULT_COLORS,
  production_color_intensity: DEFAULT_PRODUCTION_COLOR_INTENSITY,
  show_energy: true,
  use_system_power_entity: false,
  system_power_entity: undefined,
  invert_system_power: false,
  use_system_energy_entity: false,
  system_energy_entity: undefined,
  enable_forecast_overlay: DEFAULT_ENABLE_FORECAST_OVERLAY,
  motion_enabled: DEFAULT_MOTION_ENABLED,
  motion_power_flow: DEFAULT_MOTION_POWER_FLOW,
  motion_update_shimmer: DEFAULT_MOTION_UPDATE_SHIMMER,
  motion_alert_ripple: DEFAULT_MOTION_ALERT_RIPPLE,
  show_custom_kpi: true,
  custom_kpi_title: "Custom KPI",
  custom_kpi_entity: undefined,
  custom_kpi_decimals: DEFAULT_CUSTOM_KPI_DECIMALS,
  invert_custom_kpi: false,
  panel_tap_action: "details",
  power_decimals: DEFAULT_POWER_DECIMALS,
  energy_decimals: DEFAULT_ENERGY_DECIMALS,
  limit_panel_width: DEFAULT_LIMIT_PANEL_WIDTH,
  panel_max_width_px: DEFAULT_PANEL_MAX_WIDTH_PX,
  max_card_width_px: DEFAULT_MAX_CARD_WIDTH,
});

type SolarPanelVisualizerConfigInput = Omit<
  Partial<SolarPanelVisualizerConfig>,
  "inverter_fault_terms" | "inverter_working_terms"
> & {
  inverter_fault_terms?: string[] | string;
  inverter_working_terms?: string[] | string;
};

export const normalizeConfig = (
  config: SolarPanelVisualizerConfigInput = {},
): SolarPanelVisualizerConfig => {
  const enableStringSensorSharing = normalizeBoolean(
    config.enable_string_sensor_sharing,
    false,
  );
  const stringGroups = normalizeStringGroups(config.string_groups);
  const useStringGroups = enableStringSensorSharing && stringGroups.length > 0;
  const rows = useStringGroups
    ? stringGroups.length
    : clampInteger(config.rows, DEFAULT_ROWS);
  const columns = useStringGroups
    ? Math.max(...stringGroups.map((group) => group.panel_count), 1)
    : clampInteger(config.columns, DEFAULT_COLUMNS);
  const colors = {
    ...DEFAULT_COLORS,
    ...(config.colors ?? {}),
  };

  return {
    type: normalizeString(config.type) ?? CARD_TYPE,
    title: normalizeString(config.title),
    theme_mode: normalizeThemeMode(config.theme_mode),
    rows,
    columns,
    panels: useStringGroups
      ? syncStringGroupPanelSlots(
          stringGroups,
          columns,
          config.panels ?? [],
          clampInteger(config.columns, DEFAULT_COLUMNS),
        )
      : syncPanelSlots(rows, columns, config.panels ?? []),
    enable_inverter_status: normalizeBoolean(config.enable_inverter_status, false),
    enable_string_sensor_sharing: enableStringSensorSharing,
    string_groups: stringGroups,
    inverter_fault_terms: normalizeStringList(
      config.inverter_fault_terms,
      DEFAULT_INVERTER_FAULT_TERMS,
    ),
    inverter_working_terms: normalizeStringList(
      config.inverter_working_terms,
      DEFAULT_INVERTER_WORKING_TERMS,
    ),
    show_inverter_status_on_tiles: normalizeBoolean(
      config.show_inverter_status_on_tiles,
      false,
    ),
    enable_array_checks: normalizeBoolean(config.enable_array_checks, false),
    deviation_threshold_percent: clampFloat(
      config.deviation_threshold_percent,
      DEFAULT_DEVIATION_THRESHOLD,
      1,
      100,
    ),
    deviation_absolute_w_threshold: clampFloat(
      config.deviation_absolute_w_threshold,
      DEFAULT_DEVIATION_ABSOLUTE_W_THRESHOLD,
      0,
      5000,
    ),
    deviation_min_active_panels: clampInteger(
      config.deviation_min_active_panels,
      DEFAULT_DEVIATION_MIN_ACTIVE_PANELS,
      2,
      30,
    ),
    deviation_min_samples: clampInteger(
      config.deviation_min_samples,
      DEFAULT_DEVIATION_MIN_SAMPLES,
      1,
      120,
    ),
    deviation_min_runtime_minutes: clampInteger(
      config.deviation_min_runtime_minutes,
      DEFAULT_DEVIATION_MIN_RUNTIME_MINUTES,
      0,
      1440,
    ),
    deviation_smoothing_minutes: clampInteger(
      config.deviation_smoothing_minutes,
      DEFAULT_DEVIATION_SMOOTHING_MINUTES,
      0,
      1440,
    ),
    deviation_dynamic_floor_w: clampFloat(
      config.deviation_dynamic_floor_w,
      DEFAULT_DEVIATION_DYNAMIC_FLOOR_W,
      0,
      5000,
    ),
    deviation_restart_entity: normalizeString(config.deviation_restart_entity),
    deviation_history_hours: clampInteger(
      config.deviation_history_hours,
      DEFAULT_DEVIATION_HISTORY_HOURS,
      1,
      168,
    ),
    colors,
    production_color_intensity: clampFloat(
      config.production_color_intensity,
      DEFAULT_PRODUCTION_COLOR_INTENSITY,
      0.2,
      1.6,
    ),
    show_energy: true,
    use_system_power_entity: normalizeBoolean(config.use_system_power_entity, false),
    system_power_entity: normalizeString(config.system_power_entity),
    invert_system_power: normalizeBoolean(config.invert_system_power, false),
    use_system_energy_entity: normalizeBoolean(config.use_system_energy_entity, false),
    system_energy_entity: normalizeString(config.system_energy_entity),
    enable_forecast_overlay: normalizeBoolean(
      config.enable_forecast_overlay,
      DEFAULT_ENABLE_FORECAST_OVERLAY,
    ),
    motion_enabled: normalizeBoolean(config.motion_enabled, DEFAULT_MOTION_ENABLED),
    motion_power_flow: normalizeBoolean(
      config.motion_power_flow,
      DEFAULT_MOTION_POWER_FLOW,
    ),
    motion_update_shimmer: normalizeBoolean(
      config.motion_update_shimmer,
      DEFAULT_MOTION_UPDATE_SHIMMER,
    ),
    motion_alert_ripple: normalizeBoolean(
      config.motion_alert_ripple,
      DEFAULT_MOTION_ALERT_RIPPLE,
    ),
    show_custom_kpi: normalizeBoolean(config.show_custom_kpi, true),
    custom_kpi_title: normalizeTrimmedString(config.custom_kpi_title) ?? "Custom KPI",
    custom_kpi_entity: normalizeString(config.custom_kpi_entity),
    custom_kpi_decimals: clampInteger(
      config.custom_kpi_decimals,
      DEFAULT_CUSTOM_KPI_DECIMALS,
      0,
      4,
    ),
    invert_custom_kpi: normalizeBoolean(config.invert_custom_kpi, false),
    panel_tap_action: normalizeTapAction(config.panel_tap_action),
    power_decimals: clampInteger(
      config.power_decimals,
      DEFAULT_POWER_DECIMALS,
      0,
      4,
    ),
    energy_decimals: clampInteger(
      config.energy_decimals,
      DEFAULT_ENERGY_DECIMALS,
      0,
      4,
    ),
    limit_panel_width: normalizeBoolean(
      config.limit_panel_width,
      DEFAULT_LIMIT_PANEL_WIDTH,
    ),
    panel_max_width_px: clampInteger(
      config.panel_max_width_px,
      DEFAULT_PANEL_MAX_WIDTH_PX,
      120,
      320,
    ),
    default_panel_rated_power_w: normalizeOptionalPositiveNumber(
      config.default_panel_rated_power_w,
      1,
      MAX_PANEL_RATED_POWER_W,
    ),
    max_card_width_px:
      normalizeOptionalNumber(config.max_card_width_px, 300, 2400) ??
      DEFAULT_MAX_CARD_WIDTH,
    max_card_height_px: normalizeOptionalNumber(config.max_card_height_px, 300, 2600),
    grid_options: normalizeGridOptions(config.grid_options),
  };
};

export const validateConfig = (
  config: Partial<SolarPanelVisualizerConfig>,
): string[] => {
  const errors: string[] = [];

  if (typeof config !== "object" || config === null) {
    return ["Configuration must be an object."];
  }

  if (
    config.rows !== undefined &&
    (!Number.isFinite(Number(config.rows)) || Number(config.rows) < 1)
  ) {
    errors.push("`rows` must be a positive number.");
  }

  if (
    config.columns !== undefined &&
    (!Number.isFinite(Number(config.columns)) || Number(config.columns) < 1)
  ) {
    errors.push("`columns` must be a positive number.");
  }

  if (
    config.max_card_width_px !== undefined &&
    !Number.isFinite(Number(config.max_card_width_px))
  ) {
    errors.push("`max_card_width_px` must be a number if set.");
  }

  if (
    config.panel_max_width_px !== undefined &&
    (!Number.isFinite(Number(config.panel_max_width_px)) ||
      Number(config.panel_max_width_px) < 120 ||
      Number(config.panel_max_width_px) > 320)
  ) {
    errors.push("`panel_max_width_px` must be between 120 and 320.");
  }

  if (
    config.max_card_height_px !== undefined &&
    !Number.isFinite(Number(config.max_card_height_px))
  ) {
    errors.push("`max_card_height_px` must be a number if set.");
  }

  if (
    config.custom_kpi_decimals !== undefined &&
    (!Number.isFinite(Number(config.custom_kpi_decimals)) ||
      Number(config.custom_kpi_decimals) < 0 ||
      Number(config.custom_kpi_decimals) > 4)
  ) {
    errors.push("`custom_kpi_decimals` must be between 0 and 4.");
  }

  if (
    config.production_color_intensity !== undefined &&
    (!Number.isFinite(Number(config.production_color_intensity)) ||
      Number(config.production_color_intensity) < 0.2 ||
      Number(config.production_color_intensity) > 1.6)
  ) {
    errors.push("`production_color_intensity` must be between 0.2 and 1.6.");
  }

  if (
    config.deviation_absolute_w_threshold !== undefined &&
    (!Number.isFinite(Number(config.deviation_absolute_w_threshold)) ||
      Number(config.deviation_absolute_w_threshold) < 0)
  ) {
    errors.push("`deviation_absolute_w_threshold` must be 0 or higher.");
  }

  if (
    config.deviation_min_active_panels !== undefined &&
    (!Number.isFinite(Number(config.deviation_min_active_panels)) ||
      Number(config.deviation_min_active_panels) < 2)
  ) {
    errors.push("`deviation_min_active_panels` must be 2 or higher.");
  }

  if (
    config.deviation_min_samples !== undefined &&
    (!Number.isFinite(Number(config.deviation_min_samples)) ||
      Number(config.deviation_min_samples) < 1)
  ) {
    errors.push("`deviation_min_samples` must be 1 or higher.");
  }

  if (
    config.deviation_min_runtime_minutes !== undefined &&
    (!Number.isFinite(Number(config.deviation_min_runtime_minutes)) ||
      Number(config.deviation_min_runtime_minutes) < 0)
  ) {
    errors.push("`deviation_min_runtime_minutes` must be 0 or higher.");
  }

  if (
    config.deviation_smoothing_minutes !== undefined &&
    (!Number.isFinite(Number(config.deviation_smoothing_minutes)) ||
      Number(config.deviation_smoothing_minutes) < 0)
  ) {
    errors.push("`deviation_smoothing_minutes` must be 0 or higher.");
  }

  if (
    config.deviation_dynamic_floor_w !== undefined &&
    (!Number.isFinite(Number(config.deviation_dynamic_floor_w)) ||
      Number(config.deviation_dynamic_floor_w) < 0)
  ) {
    errors.push("`deviation_dynamic_floor_w` must be 0 or higher.");
  }

  if (
    config.deviation_history_hours !== undefined &&
    (!Number.isFinite(Number(config.deviation_history_hours)) ||
      Number(config.deviation_history_hours) < 1)
  ) {
    errors.push("`deviation_history_hours` must be 1 or higher.");
  }

  if (Array.isArray(config.panels)) {
    config.panels.forEach((panel, index) => {
      const derate = panel?.deviation_derate_percent;
      if (
        derate !== undefined &&
        (!Number.isFinite(Number(derate)) ||
          Number(derate) < 1 ||
          Number(derate) > 100)
      ) {
        errors.push(
          `\`panels[${index}].deviation_derate_percent\` must be between 1 and 100.`,
        );
      }
    });
  }

  return errors;
};
