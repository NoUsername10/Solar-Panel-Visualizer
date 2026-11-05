export type PanelTapAction = "details" | "none";
export type CardThemeMode = "auto" | "dark" | "light";

export interface PanelColors {
  production_start: string;
  production_mid: string;
  production_end: string;
  deviation: string;
  error: string;
  unavailable: string;
}

export interface PanelAdvancedMetrics {
  inverter_ac_power_entity?: string;
  inverter_ac_voltage_entity?: string;
  inverter_ac_current_entity?: string;
  inverter_temp_entity?: string;
  panel_current_entity?: string;
  panel_voltage_entity?: string;
  panel_power_entity?: string;
}

export interface PanelConfig {
  id: string;
  name?: string;
  power_entity?: string;
  energy_entity?: string;
  show_energy?: boolean;
  inverter_status_entity?: string;
  error_entity?: string;
  advanced_metrics?: PanelAdvancedMetrics;
  enabled?: boolean;
  rated_power_w?: number;
  deviation_derate_percent?: number;
}

export interface StringGroupConfig {
  id: string;
  name?: string;
  panel_count: number;
  power_entity?: string;
  energy_entity?: string;
}

export interface SolarPanelVisualizerConfig {
  type: string;
  title?: string;
  theme_mode?: CardThemeMode;
  rows: number;
  columns: number;
  panels: PanelConfig[];
  enable_inverter_status?: boolean;
  enable_string_sensor_sharing?: boolean;
  string_groups?: StringGroupConfig[];
  inverter_fault_terms?: string[];
  inverter_working_terms?: string[];
  show_inverter_status_on_tiles?: boolean;
  enable_array_checks?: boolean;
  deviation_threshold_percent?: number;
  deviation_absolute_w_threshold?: number;
  deviation_min_active_panels?: number;
  deviation_min_samples?: number;
  deviation_min_runtime_minutes?: number;
  deviation_smoothing_minutes?: number;
  deviation_dynamic_floor_w?: number;
  deviation_restart_entity?: string;
  deviation_history_hours?: number;
  colors?: Partial<PanelColors>;
  production_color_intensity?: number;
  show_energy?: boolean;
  use_system_power_entity?: boolean;
  system_power_entity?: string;
  invert_system_power?: boolean;
  use_system_energy_entity?: boolean;
  system_energy_entity?: string;
  enable_forecast_overlay?: boolean;
  show_custom_kpi?: boolean;
  custom_kpi_title?: string;
  custom_kpi_entity?: string;
  custom_kpi_decimals?: number;
  invert_custom_kpi?: boolean;
  panel_tap_action?: PanelTapAction;
  power_decimals?: number;
  energy_decimals?: number;
  default_panel_rated_power_w?: number;
  limit_panel_width?: boolean;
  panel_max_width_px?: number;
  max_card_width_px?: number;
  max_card_height_px?: number;
  grid_options?: {
    columns?: "full" | number;
    rows?: "auto" | number;
  };
  motion_enabled?: boolean;
  motion_power_flow?: boolean;
  motion_update_shimmer?: boolean;
  motion_alert_ripple?: boolean;
}

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  callApi?: (method: string, path: string, parameters?: Record<string, unknown>) => Promise<unknown>;
  callWS?: (message: Record<string, unknown>) => Promise<unknown>;
  locale?: {
    language?: string;
  };
  themes?: {
    darkMode?: boolean;
  };
}

export interface PowerSample {
  ts: number;
  value: number;
}

export type PanelStatus =
  | "normal"
  | "deviation"
  | "inverter"
  | "error"
  | "offline"
  | "unconfigured"
  | "disabled";

export interface DerivedPanelState {
  id: string;
  slotIndex: number;
  label: string;
  status: PanelStatus;
  power: number | null;
  powerDisplay: string;
  energy: number | null;
  energyDisplay?: string;
  powerEntityName?: string;
  inverterStatusEntityName?: string;
  inverterStatusDisplay?: string;
  inverterFaultMatched: boolean;
  inverterWorkingMatched: boolean;
  deviationPercent: number | null;
  reason: string;
  accentColor: string;
  intensity: number;
  enabled: boolean;
  hiddenSlot: boolean;
  ratedPowerW: number | null;
  performancePercent: number | null;
  powerShareFactor?: number;
  energyShareFactor?: number;
  stringGroupLabel?: string;
  stringPowerSourceName?: string;
  stringPowerSharePercent?: number;
}

export interface DerivedArrayState {
  panels: DerivedPanelState[];
  totalPower: number;
  totalEnergy: number | null;
  maxPower: number;
  deviationCount: number;
  inverterCount: number;
  errorCount: number;
  offlineCount: number;
  normalCount: number;
  unconfiguredCount: number;
  disabledCount: number;
  deviationReady: boolean;
  deviationSuppressedReason?: string;
}

declare global {
  interface Window {
    customCards?: Array<{
      type: string;
      name: string;
      description: string;
      icon?: string;
      preview?: boolean;
    }>;
  }
}
