const Ye = "custom:solar-panel-visualizer", nt = {
  production_start: "#8dcf72",
  production_mid: "#bfe36a",
  production_end: "#ffd35a",
  deviation: "#ff9667",
  error: "#ff627f",
  unavailable: "#586779"
}, Yt = 2, qt = 3, Xt = 15, Qt = 50, Zt = 3, Jt = 3, es = 20, ts = 0, ss = 30, rs = 12, is = 0, os = 2, as = 0, ns = !1, ls = 220, ps = 980, cs = 1, ds = !1, hs = !0, us = !0, _s = !0, ms = !0, fs = "auto", gs = ["fault", "alarm", "error", "failed", "failure", "trip"], ys = [
  "normal",
  "ok",
  "running",
  "waiting for operation",
  "producing"
], Y = (i, e, t = 1, s = 12) => {
  const r = Number(i);
  return Number.isFinite(r) ? Math.min(Math.max(Math.round(r), t), s) : e;
}, ke = (i, e, t = 0, s = 100) => {
  const r = Number(i);
  return Number.isFinite(r) ? Math.min(Math.max(r, t), s) : e;
}, U = (i) => {
  if (typeof i != "string")
    return;
  const e = i.trim();
  return e.length > 0 ? e : void 0;
}, Hs = (i) => {
  if (typeof i == "string")
    return i.trim();
}, B = (i, e) => typeof i == "boolean" ? i : e, ut = (i, e) => {
  const s = (Array.isArray(i) ? i : typeof i == "string" ? i.split(",") : []).map((r) => typeof r == "string" ? r.trim().toLowerCase() : "").filter((r) => r.length > 0);
  return s.length === 0 ? [...e] : [...new Set(s)];
}, _t = (i, e, t) => {
  if (i == null || i === "")
    return;
  const s = Number(i);
  if (Number.isFinite(s))
    return Math.min(Math.max(s, e), t);
}, vs = (i, e, t) => {
  if (i == null || i === "")
    return;
  const s = Number(i);
  if (!(!Number.isFinite(s) || s < e))
    return Math.min(s, t);
}, zs = (i) => `panel-${i + 1}`, Gs = (i) => i === "none" ? "none" : "details", Bs = (i) => i === "dark" || i === "light" ? i : fs, Ws = (i) => {
  if (typeof i != "object" || i === null)
    return;
  const e = i, t = e.columns === "full" || typeof e.columns == "number" ? e.columns : void 0, s = e.rows === "auto" || typeof e.rows == "number" ? e.rows : void 0;
  if (!(t === void 0 && s === void 0))
    return {
      columns: t,
      rows: s
    };
}, Us = [
  "inverter_ac_power_entity",
  "inverter_ac_voltage_entity",
  "inverter_ac_current_entity",
  "inverter_temp_entity",
  "panel_current_entity",
  "panel_voltage_entity",
  "panel_power_entity"
], Ks = (i, e) => {
  if (!e || typeof i != "object" || i === null)
    return;
  const t = i, s = {};
  let r = !1;
  for (const o of Us) {
    const a = U(t[o]);
    s[o] = a, a && (r = !0);
  }
  if (r)
    return s;
}, Vs = (i, e) => {
  const t = B(i?.enabled, !0);
  return {
    id: U(i?.id) ?? zs(e),
    name: U(i?.name),
    power_entity: t ? U(i?.power_entity) : void 0,
    energy_entity: t ? U(i?.energy_entity) : void 0,
    show_energy: B(i?.show_energy, !1),
    inverter_status_entity: t ? U(i?.inverter_status_entity) ?? U(i?.error_entity) : void 0,
    error_entity: t ? U(i?.error_entity) : void 0,
    advanced_metrics: Ks(i?.advanced_metrics, t),
    enabled: t,
    rated_power_w: vs(i?.rated_power_w, 1, 2e3),
    deviation_derate_percent: ke(i?.deviation_derate_percent, 100, 1, 100)
  };
}, bs = (i, e, t = []) => {
  const s = i * e;
  return Array.from(
    { length: s },
    (r, o) => Vs(t[o], o)
  );
}, js = (i = Yt, e = qt) => ({
  type: Ye,
  title: "Solar Array",
  theme_mode: fs,
  rows: i,
  columns: e,
  panels: bs(i, e),
  enable_inverter_status: !1,
  inverter_fault_terms: [...gs],
  inverter_working_terms: [...ys],
  show_inverter_status_on_tiles: !1,
  enable_array_checks: !1,
  deviation_threshold_percent: Xt,
  deviation_absolute_w_threshold: Qt,
  deviation_min_active_panels: Zt,
  deviation_min_samples: Jt,
  deviation_min_runtime_minutes: es,
  deviation_smoothing_minutes: ts,
  deviation_dynamic_floor_w: ss,
  deviation_history_hours: rs,
  colors: nt,
  production_color_intensity: cs,
  show_energy: !0,
  use_system_power_entity: !1,
  system_power_entity: void 0,
  invert_system_power: !1,
  use_system_energy_entity: !1,
  system_energy_entity: void 0,
  enable_forecast_overlay: ds,
  motion_enabled: hs,
  motion_power_flow: us,
  motion_update_shimmer: _s,
  motion_alert_ripple: ms,
  show_custom_kpi: !0,
  custom_kpi_title: "Custom KPI",
  custom_kpi_entity: void 0,
  custom_kpi_decimals: as,
  invert_custom_kpi: !1,
  panel_tap_action: "details",
  power_decimals: is,
  energy_decimals: os,
  limit_panel_width: ns,
  panel_max_width_px: ls,
  max_card_width_px: ps
}), Fe = (i = {}) => {
  const e = Y(i.rows, Yt), t = Y(i.columns, qt), s = {
    ...nt,
    ...i.colors ?? {}
  };
  return {
    type: U(i.type) ?? Ye,
    title: U(i.title),
    theme_mode: Bs(i.theme_mode),
    rows: e,
    columns: t,
    panels: bs(e, t, i.panels ?? []),
    enable_inverter_status: B(i.enable_inverter_status, !1),
    inverter_fault_terms: ut(
      i.inverter_fault_terms,
      gs
    ),
    inverter_working_terms: ut(
      i.inverter_working_terms,
      ys
    ),
    show_inverter_status_on_tiles: B(
      i.show_inverter_status_on_tiles,
      !1
    ),
    enable_array_checks: B(i.enable_array_checks, !1),
    deviation_threshold_percent: ke(
      i.deviation_threshold_percent,
      Xt,
      1,
      100
    ),
    deviation_absolute_w_threshold: ke(
      i.deviation_absolute_w_threshold,
      Qt,
      0,
      5e3
    ),
    deviation_min_active_panels: Y(
      i.deviation_min_active_panels,
      Zt,
      2,
      30
    ),
    deviation_min_samples: Y(
      i.deviation_min_samples,
      Jt,
      1,
      120
    ),
    deviation_min_runtime_minutes: Y(
      i.deviation_min_runtime_minutes,
      es,
      0,
      1440
    ),
    deviation_smoothing_minutes: Y(
      i.deviation_smoothing_minutes,
      ts,
      0,
      1440
    ),
    deviation_dynamic_floor_w: ke(
      i.deviation_dynamic_floor_w,
      ss,
      0,
      5e3
    ),
    deviation_restart_entity: U(i.deviation_restart_entity),
    deviation_history_hours: Y(
      i.deviation_history_hours,
      rs,
      1,
      168
    ),
    colors: s,
    production_color_intensity: ke(
      i.production_color_intensity,
      cs,
      0.2,
      1.6
    ),
    show_energy: !0,
    use_system_power_entity: B(i.use_system_power_entity, !1),
    system_power_entity: U(i.system_power_entity),
    invert_system_power: B(i.invert_system_power, !1),
    use_system_energy_entity: B(i.use_system_energy_entity, !1),
    system_energy_entity: U(i.system_energy_entity),
    enable_forecast_overlay: B(
      i.enable_forecast_overlay,
      ds
    ),
    motion_enabled: B(i.motion_enabled, hs),
    motion_power_flow: B(
      i.motion_power_flow,
      us
    ),
    motion_update_shimmer: B(
      i.motion_update_shimmer,
      _s
    ),
    motion_alert_ripple: B(
      i.motion_alert_ripple,
      ms
    ),
    show_custom_kpi: B(i.show_custom_kpi, !0),
    custom_kpi_title: Hs(i.custom_kpi_title) ?? "Custom KPI",
    custom_kpi_entity: U(i.custom_kpi_entity),
    custom_kpi_decimals: Y(
      i.custom_kpi_decimals,
      as,
      0,
      4
    ),
    invert_custom_kpi: B(i.invert_custom_kpi, !1),
    panel_tap_action: Gs(i.panel_tap_action),
    power_decimals: Y(
      i.power_decimals,
      is,
      0,
      4
    ),
    energy_decimals: Y(
      i.energy_decimals,
      os,
      0,
      4
    ),
    limit_panel_width: B(
      i.limit_panel_width,
      ns
    ),
    panel_max_width_px: Y(
      i.panel_max_width_px,
      ls,
      120,
      320
    ),
    default_panel_rated_power_w: vs(
      i.default_panel_rated_power_w,
      1,
      2e3
    ),
    max_card_width_px: _t(i.max_card_width_px, 300, 2400) ?? ps,
    max_card_height_px: _t(i.max_card_height_px, 300, 2600),
    grid_options: Ws(i.grid_options)
  };
}, Ys = (i) => {
  const e = [];
  return typeof i != "object" || i === null ? ["Configuration must be an object."] : (i.rows !== void 0 && (!Number.isFinite(Number(i.rows)) || Number(i.rows) < 1) && e.push("`rows` must be a positive number."), i.columns !== void 0 && (!Number.isFinite(Number(i.columns)) || Number(i.columns) < 1) && e.push("`columns` must be a positive number."), i.max_card_width_px !== void 0 && !Number.isFinite(Number(i.max_card_width_px)) && e.push("`max_card_width_px` must be a number if set."), i.panel_max_width_px !== void 0 && (!Number.isFinite(Number(i.panel_max_width_px)) || Number(i.panel_max_width_px) < 120 || Number(i.panel_max_width_px) > 320) && e.push("`panel_max_width_px` must be between 120 and 320."), i.max_card_height_px !== void 0 && !Number.isFinite(Number(i.max_card_height_px)) && e.push("`max_card_height_px` must be a number if set."), i.custom_kpi_decimals !== void 0 && (!Number.isFinite(Number(i.custom_kpi_decimals)) || Number(i.custom_kpi_decimals) < 0 || Number(i.custom_kpi_decimals) > 4) && e.push("`custom_kpi_decimals` must be between 0 and 4."), i.production_color_intensity !== void 0 && (!Number.isFinite(Number(i.production_color_intensity)) || Number(i.production_color_intensity) < 0.2 || Number(i.production_color_intensity) > 1.6) && e.push("`production_color_intensity` must be between 0.2 and 1.6."), i.deviation_absolute_w_threshold !== void 0 && (!Number.isFinite(Number(i.deviation_absolute_w_threshold)) || Number(i.deviation_absolute_w_threshold) < 0) && e.push("`deviation_absolute_w_threshold` must be 0 or higher."), i.deviation_min_active_panels !== void 0 && (!Number.isFinite(Number(i.deviation_min_active_panels)) || Number(i.deviation_min_active_panels) < 2) && e.push("`deviation_min_active_panels` must be 2 or higher."), i.deviation_min_samples !== void 0 && (!Number.isFinite(Number(i.deviation_min_samples)) || Number(i.deviation_min_samples) < 1) && e.push("`deviation_min_samples` must be 1 or higher."), i.deviation_min_runtime_minutes !== void 0 && (!Number.isFinite(Number(i.deviation_min_runtime_minutes)) || Number(i.deviation_min_runtime_minutes) < 0) && e.push("`deviation_min_runtime_minutes` must be 0 or higher."), i.deviation_smoothing_minutes !== void 0 && (!Number.isFinite(Number(i.deviation_smoothing_minutes)) || Number(i.deviation_smoothing_minutes) < 0) && e.push("`deviation_smoothing_minutes` must be 0 or higher."), i.deviation_dynamic_floor_w !== void 0 && (!Number.isFinite(Number(i.deviation_dynamic_floor_w)) || Number(i.deviation_dynamic_floor_w) < 0) && e.push("`deviation_dynamic_floor_w` must be 0 or higher."), i.deviation_history_hours !== void 0 && (!Number.isFinite(Number(i.deviation_history_hours)) || Number(i.deviation_history_hours) < 1) && e.push("`deviation_history_hours` must be 1 or higher."), Array.isArray(i.panels) && i.panels.forEach((t, s) => {
    const r = t?.deviation_derate_percent;
    r !== void 0 && (!Number.isFinite(Number(r)) || Number(r) < 1 || Number(r) > 100) && e.push(
      `\`panels[${s}].deviation_derate_percent\` must be between 1 and 100.`
    );
  }), e);
}, qs = { card_name: "Solar Panel Visualizer", card_description: "GUI-first solar array card with panel health, animated power rails, forecasts, history graphs, and light/dark themes." }, Xs = { unavailable: "Unavailable", not_configured: "Not configured", disabled: "Disabled", unknown_recorder_error: "Unknown recorder error" }, Qs = { default_title: "Solar Array", eyebrow: "Solar Panel Visualizer", subtitle: { loading_history: "Loading shared {hours}h solar panel history...", warmup: "Deviation checks are warming up.", deviation_detected: "{count} panel{suffix} below expected output", tap_diagnostics: "Tap a panel for detailed diagnostics", drag_hint: "Drag and drop panel tiles to swap positions." }, summary: { power: "Power", energy: "Energy", alerts: "Alerts", system_sensor: "System sensor", sum_panel_sensors: "Sum of panel sensors", custom_sensor: "Custom KPI sensor", custom_default_title: "Custom KPI" }, panel: { hidden: "hidden", hidden_name: "Hidden Panel", hidden_performance: "Hidden", info_label: "Info", info_title: "Open panel details", inverter_prefix: "Inverter: {status}", inverter_short: { ok: "Inverter: OK", deviation: "Inverter: Deviation", error: "Inverter: Error" }, performance_compact: "{percent}%", performance_medium: "{percent}% of {rated}W", performance_full: "{percent}% of {rated}W Panel", slot_label: "R{row}C{column}", status: { normal: "normal", deviation: "deviation", inverter: "inverter", error: "error", offline: "offline", unconfigured: "unconfigured", disabled: "hidden" } }, popup: { close_detail: "Close detail", close_live_power: "Close live power detail", close_energy: "Close energy detail", close_custom_kpi: "Close custom KPI detail", close_system_health: "Close system health", panel_eyebrow: "Panel Detail {slot}", power_eyebrow: "Power Detail", power_title: "Live Power", energy_eyebrow: "Energy Detail", energy_title: "Energy", custom_eyebrow: "Custom KPI Detail", system_health_eyebrow: "System Health", system_health_title: "Overview", detail: { status: "Status", power: "Power", energy: "Energy", estimated_power_now: "Forecast production", estimated_energy_now: "Forecast production", deviation: "Deviation", rated_performance: "Rated / Performance", information: "Information", current: "Current", source: "Source" }, deviation: { inverter_mismatch: "Inverter status mismatch", below_peers: "{percent}% below peers", within_range: "Within range" }, rated_performance: { format: "{rated} W / {percent}", na: "n/a" }, info: { power_source: "Power source: {value}", current_inverter_status: 'Current inverter status: "{value}"', inverter_evaluation: "Inverter evaluation: {value}", inverter_source: "Inverter source: {value}" }, inverter_eval: { no_status: "No status available", fault_match: "Fault term matched", working_match: "Working term matched", no_match: "No configured term matched" }, telemetry: { title: "Panel / Inverter Info", configured_title: "Configured", unconfigured_title: "Unconfigured", none_configured: "No advanced telemetry configured for this panel.", setup_hint: "Configure in Panels > Advanced telemetry.", label: { inverter_status: "Inverter status", inverter_ac_power: "Inverter AC power", inverter_ac_voltage: "Inverter AC voltage", inverter_ac_current: "Inverter AC current", inverter_temp: "Inverter temperature", panel_current: "Panel current", panel_voltage: "Panel voltage", panel_power: "Panel power" } }, history: { power: "Power History", system_power: "System Power History", system_energy: "System Energy History", panel_power_values: "Panel Power Values", panel_energy_values: "Panel Energy Values", panel_compare: "Panel Performance Comparison", panel_compare_power: "Panel Power Comparison", panel_compare_energy: "Panel Energy Comparison", overlay_forecast: "Forecast", graph_not_configured: "No sensor configured for graph.", custom_not_configured: "No sensor configured for Custom KPI.", loading: "Loading sensor history...", no_data: "No history data for selected range.", unable_load: "Unable to load panel history ({error})", unable_load_plain: "Unable to load panel history", max: "Max {value}", median: "Median {value}", min: "Min {value}", time_range: "{start} - {end}" }, forecast: { enable_button: "Enable forecasts", disabled_hint: "Forecast overlay is disabled.", not_configured: "Forecast.Solar not configured.", default_sensor_not_found: "Default forecast sensor not found ({entity}).", power_compare_requires_system: "System power sensor is required for power forecast comparison.", energy_compare_requires_system: "System energy sensor is required for energy forecast comparison." }, panel_compare: { toggle: "Compare Panel Performance", toggle_power: "Compare Panel Power", toggle_energy: "Compare Panel Energy", loading: "Loading panel comparison history...", no_panels: "No configured panel sensors available for comparison.", no_panels_power: "No configured panel power sensors available for comparison.", no_panels_energy: "No configured panel energy sensors available for comparison.", no_data: "No comparison data for selected range.", unable_load: "Unable to load panel comparison history ({error}).", render_failure: "Comparison data loaded, but traces could not be drawn.", diagnostics_title: "Compare graph diagnostics (temporary)", diagnostics_summary: "model hasData={hasData}, drawable={drawable}, series={series}, range={range}h", diagnostics_reason_render_failure: "Series exist but no drawable traces were produced.", diagnostics_reason_suspect: "One or more series produced an invalid drawable shape.", diagnostics_row: "{label}: samples={samples}, points={points}, first={first}, last={last}, min={min}, max={max}" }, system_health: { everything_ok: "Everything is working well.", section: { inverter: "Inverter", error: "Error", deviation: "Deviation", offline: "Unavailable", setup: "Needs setup" }, item: "Panel on {slot} ({label}): {reason}" } }, quick_setup: { title: "Quick Setup:", select_power_sensor: "Select panel power sensor:", selector_label: "Select panel power sensor", no_sensors: "No available W sensors found.", disable_panel: "Disable Panel (hide but keep slot when off)" }, system_health_chip: { faults: "{count} Fault{suffix}", unavailable: "{count} Unavailable", deviation: "{count} Deviation", needs_setup: "{count} Needs Setup", ok: "System OK" } }, Zs = { reason: { slot_hidden: "Panel slot is hidden in the card configuration.", select_power_sensor: "Select a power sensor to activate this panel slot.", power_entity_missing: "Power entity {entity} was not found.", power_entity_unavailable: "{entity} is unavailable.", inverter_fault_match: 'Current inverter status: "{status}" matches configured fault terms.', inverter_working_mismatch: 'Current inverter status: "{status}" does not match configured working terms.', producing_expected: "Producing within the expected array range.", producing_adjusted: "Producing within array-adjusted target range.", rated_not_configured: "Rated power not configured; excluded from deviation checks.", output_below_target: "Output is {percent}% and {shortfall} W below array target.", array_check_disabled: "Array Health Check is disabled.", need_non_derated_panels: "Need at least {count} non-derated active rated panels for deviation checks.", collecting_samples: "Collecting samples ({current}/{required}).", warmup_progress: "Warm-up in progress ({current}/{required} min).", low_light_pause: "Low-light pause: waiting above {floor} W target floor." }, status_display: { disabled: "Disabled", not_configured: "Not configured" }, energy: { default_unit: "kWh" }, power: { default_unit: "W" } }, Js = { section: { layout_title: "Layout", layout_copy: "Set the array size first. Panel slots expand automatically from the row and column values.", display_title: "Display", display_copy: "Tune precision and panel detail behavior.", appearance_title: "Appearance", appearance_copy: "Auto follows the active Home Assistant theme. Force Light or Dark if a dashboard theme needs a specific card style.", forecast_title: "Forecast.Solar", forecast_copy: "Auto-detects Home Assistant default forecast sensors and overlays estimated production in Power/Energy KPI popups.", array_health_title: "Array Health Check", array_health_copy: "Automatically checks panel health by comparing active panels against each other using rated power, shared solar panel history, and configurable guardrails.", array_health_smoothing_help: "Smoothing window averages recent samples before checks; 0 means no smoothing.", inverter_title: "Inverter Status", inverter_copy: "Track textual status from each panel’s inverter status sensor. A panel turns red only when status text contains one of the configured fault terms. The current inverter status is shown in the panel popup.", status_colors_title: "Status Colors", status_colors_copy: "Production colors blend based on panel output. Alert colors override the production scale.", motion_title: "Motion", motion_copy: "Animate live production with left-collector power rails, Power/Energy KPI impact effects, and repeated alert ripples. Motion automatically respects reduced-motion preferences.", panels_title: "Panels", panels_copy: "Each generated slot can be configured with its own power, energy, and optional inverter status sensor. Disable a slot to hide that panel while keeping grid spacing.", panels_drag_hint: "In the card view, drag and drop panel tiles to swap their positions.", panel_defaults_title: "Panel default rated power", panel_defaults_copy: "Set a common default panel power and apply it to all panel slots.", autofill_title: "Auto-populate sensors", autofill_copy: "Fill panel sensors in slot order. Use sensor. for exact entity ID prefixes, or type friendly-name text to search sensor names.", advanced_title: "Advanced telemetry", advanced_copy: "Optional manual telemetry mappings shown in the panel popup when pressing INFO." }, field: { title: "Title", rows: "Rows", columns: "Columns", max_card_width: "Max card width (px)", max_card_height: "Max card height (px)", theme_mode: "Theme mode", power_decimals: "Power decimals", energy_decimals: "Energy decimals", custom_kpi_decimals: "Custom KPI decimals", panel_tap_action: "Panel tap action", system_power_sensor: "System power sensor (W)", system_energy_sensor: "System daily energy sensor", custom_kpi_sensor: "Custom KPI sensor", custom_kpi_heading: "Custom KPI heading", max_panel_tile_width: "Max panel tile width (px)", deviation_threshold: "Deviation threshold (%)", deviation_absolute_shortfall: "Absolute shortfall threshold (W)", deviation_check_time: "Deviation check time (minutes)", deviation_min_active_panels: "Minimum active panels", deviation_min_samples: "Minimum samples per panel", deviation_smoothing: "Smoothing window (minutes)", deviation_dynamic_floor: "Dynamic floor start (W)", deviation_history_window: "Shared history window (hours)", fault_terms: "Fault terms (comma-separated)", working_terms: "Working terms (comma-separated)", production_base: "Production base", production_mid: "Production mid", production_peak: "Production peak", deviation_color: "Deviation", error_color: "Error", unavailable_color: "Unavailable", production_intensity: "Production color intensity ({value})", default_panel_rated_power: "Default panel rated power (W)", power_prefix: "Power search", energy_prefix: "Energy search (optional)", display_name: "Display name", power_sensor: "Power sensor P(W)", energy_sensor: "Energy sensor (kWh/Wh)", panel_rated_power: "Panel rated power (W)", deviation_derate: "Deviation derate (%)", inverter_status_sensor: "Inverter status sensor (optional)", advanced_inverter_ac_power: "Inverter AC power (W)", advanced_inverter_ac_voltage: "Inverter AC voltage (V)", advanced_inverter_ac_current: "Inverter AC current (A)", advanced_inverter_temp: "Inverter temperature (°C/°F)", advanced_panel_current: "Panel current (A)", advanced_panel_voltage: "Panel voltage (V)", advanced_panel_power: "Panel power (W)", panel_energy_toggle: "Show panel energy", panel_enabled_toggle: "Show panel tile (hide but keep slot when off)" }, toggle: { use_system_power: "Use one system power sensor for top KPI", invert_system_power: "Invert system power value", use_system_energy: "Use one system daily energy sensor for top KPI", invert_custom_kpi: "Invert Custom KPI value", enable_forecast_overlay: "Enable forecast overlays in popups", motion_enabled: "Enable motion", motion_power_flow: "Power-rail flow to Power KPI", motion_update_shimmer: "Power/Energy KPI update effect", motion_alert_ripple: "Alert ripple for deviation/inverter/error", show_custom_kpi: "Show Custom KPI box", limit_panel_width: "Limit panel tile max width", enable_array_health: "Enable Array Health Check", enable_inverter_status: "Enable inverter status checks", show_inverter_status_tiles: "Show inverter status on panel tiles" }, select: { theme_auto: "Auto", theme_dark: "Dark", theme_light: "Light", panel_tap_details: "Open detail popover", panel_tap_none: "No action" }, button: { apply_default_rated_power: "Apply default rated W to all panels", autofill_sensors: "Auto-fill panel sensors", remove_all_sensors: "Remove all sensors" }, helper: { fault_example: "Example: fault, alarm, error, failed, failure, trip", working_example: "Working example: normal, ok, running, waiting for operation, producing", derate_help: "Used only by Array Health Check for naturally shaded panels.", autofill_search_help: "Tip: enter sensor.panel_ to match entity IDs exactly by prefix. Enter text such as Roof Panel or Daily Energy to search sensor friendly names instead. The same rule applies to Power and Energy search." }, forecast: { default_sensors: "Uses: sensor.power_production_now and sensor.energy_production_today.", line_help: "The forecast reference is a thin dashed line shown only for the selected history range up to the current time, with no future projection.", detected: "Forecast.Solar default sensors detected.", missing: "Forecast.Solar default sensors not fully detected. Expected: sensor.power_production_now and sensor.energy_production_today." }, panel_slot_title: "Row {row}, Column {column}", autofill: { enter_prefix: "Enter at least one prefix to run auto-fill.", power_summary: "Power matched {matched}, filled {filled}, skipped {skipped}.", energy_summary: "Energy matched {matched}, filled {filled}, skipped {skipped}.", cleared: "Cleared power, energy, inverter, and advanced telemetry sensors on all panels." } }, ws = {
  meta: qs,
  common: Xs,
  card: Qs,
  state: Zs,
  editor: Js
}, er = { DEV: !1 }, tr = {
  en: ws
}, mt = /* @__PURE__ */ new Set(), sr = () => typeof import.meta < "u" ? er.DEV : typeof process < "u" ? process.env.NODE_ENV !== "production" : !1, rr = (i, e) => {
  if (!sr())
    return;
  const t = `${e ?? "unknown"}:${i}`;
  mt.has(t) || (mt.add(t), console.warn(
    `[Solar Panel Visualizer i18n] Missing translation key "${i}" for locale "${e ?? "unknown"}".`
  ));
}, ft = (i, e) => {
  if (i)
    return e.split(".").reduce(
      (t, s) => typeof t == "object" && t !== null ? t[s] : void 0,
      i
    );
}, gt = (i, e) => e ? i.replace(/\{([a-zA-Z0-9_]+)\}/g, (t, s) => {
  const r = e[s];
  return r === void 0 ? `{${s}}` : String(r);
}) : i, ir = (i) => {
  if (!i)
    return ["en"];
  const e = i.trim().toLowerCase();
  if (e.length === 0)
    return ["en"];
  const t = e.split("-")[0], s = [e, t, "en"];
  return [...new Set(s)];
}, or = (i, e, t, s) => {
  for (const o of ir(e)) {
    const a = ft(i[o], t);
    if (typeof a == "string")
      return gt(a, s);
  }
  const r = ft(i.en ?? ws, t);
  return typeof r == "string" ? gt(r, s) : (rr(t, e), "");
}, Ue = (i, e, t) => or(
  tr,
  i,
  e,
  t
), xs = (i, e, t) => Ue(i?.locale?.language, e, t);
const Ge = globalThis, lt = Ge.ShadowRoot && (Ge.ShadyCSS === void 0 || Ge.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, pt = /* @__PURE__ */ Symbol(), yt = /* @__PURE__ */ new WeakMap();
let $s = class {
  constructor(e, t, s) {
    if (this._$cssResult$ = !0, s !== pt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (lt && e === void 0) {
      const s = t !== void 0 && t.length === 1;
      s && (e = yt.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), s && yt.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const ar = (i) => new $s(typeof i == "string" ? i : i + "", void 0, pt), ct = (i, ...e) => {
  const t = i.length === 1 ? i[0] : e.reduce((s, r, o) => s + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + i[o + 1], i[0]);
  return new $s(t, i, pt);
}, nr = (i, e) => {
  if (lt) i.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const s = document.createElement("style"), r = Ge.litNonce;
    r !== void 0 && s.setAttribute("nonce", r), s.textContent = t.cssText, i.appendChild(s);
  }
}, vt = lt ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const s of e.cssRules) t += s.cssText;
  return ar(t);
})(i) : i;
const { is: lr, defineProperty: pr, getOwnPropertyDescriptor: cr, getOwnPropertyNames: dr, getOwnPropertySymbols: hr, getPrototypeOf: ur } = Object, oe = globalThis, bt = oe.trustedTypes, _r = bt ? bt.emptyScript : "", mr = oe.reactiveElementPolyfillSupport, Me = (i, e) => i, it = { toAttribute(i, e) {
  switch (e) {
    case Boolean:
      i = i ? _r : null;
      break;
    case Object:
    case Array:
      i = i == null ? i : JSON.stringify(i);
  }
  return i;
}, fromAttribute(i, e) {
  let t = i;
  switch (e) {
    case Boolean:
      t = i !== null;
      break;
    case Number:
      t = i === null ? null : Number(i);
      break;
    case Object:
    case Array:
      try {
        t = JSON.parse(i);
      } catch {
        t = null;
      }
  }
  return t;
} }, Ps = (i, e) => !lr(i, e), wt = { attribute: !0, type: String, converter: it, reflect: !1, useDefault: !1, hasChanged: Ps };
Symbol.metadata ?? (Symbol.metadata = /* @__PURE__ */ Symbol("metadata")), oe.litPropertyMetadata ?? (oe.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let fe = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = wt) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const s = /* @__PURE__ */ Symbol(), r = this.getPropertyDescriptor(e, s, t);
      r !== void 0 && pr(this.prototype, e, r);
    }
  }
  static getPropertyDescriptor(e, t, s) {
    const { get: r, set: o } = cr(this.prototype, e) ?? { get() {
      return this[t];
    }, set(a) {
      this[t] = a;
    } };
    return { get: r, set(a) {
      const n = r?.call(this);
      o?.call(this, a), this.requestUpdate(e, n, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? wt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Me("elementProperties"))) return;
    const e = ur(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Me("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Me("properties"))) {
      const t = this.properties, s = [...dr(t), ...hr(t)];
      for (const r of s) this.createProperty(r, t[r]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [s, r] of t) this.elementProperties.set(s, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, s] of this.elementProperties) {
      const r = this._$Eu(t, s);
      r !== void 0 && this._$Eh.set(r, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const s = new Set(e.flat(1 / 0).reverse());
      for (const r of s) t.unshift(vt(r));
    } else e !== void 0 && t.push(vt(e));
    return t;
  }
  static _$Eu(e, t) {
    const s = t.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
  }
  addController(e) {
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
  }
  removeController(e) {
    this._$EO?.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
    for (const s of t.keys()) this.hasOwnProperty(s) && (e.set(s, this[s]), delete this[s]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return nr(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((e) => e.hostDisconnected?.());
  }
  attributeChangedCallback(e, t, s) {
    this._$AK(e, s);
  }
  _$ET(e, t) {
    const s = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, s);
    if (r !== void 0 && s.reflect === !0) {
      const o = (s.converter?.toAttribute !== void 0 ? s.converter : it).toAttribute(t, s.type);
      this._$Em = e, o == null ? this.removeAttribute(r) : this.setAttribute(r, o), this._$Em = null;
    }
  }
  _$AK(e, t) {
    const s = this.constructor, r = s._$Eh.get(e);
    if (r !== void 0 && this._$Em !== r) {
      const o = s.getPropertyOptions(r), a = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : it;
      this._$Em = r;
      const n = a.fromAttribute(t, o.type);
      this[r] = n ?? this._$Ej?.get(r) ?? n, this._$Em = null;
    }
  }
  requestUpdate(e, t, s, r = !1, o) {
    if (e !== void 0) {
      const a = this.constructor;
      if (r === !1 && (o = this[e]), s ?? (s = a.getPropertyOptions(e)), !((s.hasChanged ?? Ps)(o, t) || s.useDefault && s.reflect && o === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, s)))) return;
      this.C(e, t, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: s, reflect: r, wrapped: o }, a) {
    s && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, a ?? t ?? this[e]), o !== !0 || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || s || (t = void 0), this._$AL.set(e, t)), r === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (t) {
      Promise.reject(t);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [r, o] of this._$Ep) this[r] = o;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [r, o] of s) {
        const { wrapped: a } = o, n = this[r];
        a !== !0 || this._$AL.has(r) || n === void 0 || this.C(r, void 0, o, n);
      }
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((s) => s.hostUpdate?.()), this.update(t)) : this._$EM();
    } catch (s) {
      throw e = !1, this._$EM(), s;
    }
    e && this._$AE(t);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    this._$EO?.forEach((t) => t.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((t) => this._$ET(t, this[t]))), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
fe.elementStyles = [], fe.shadowRootOptions = { mode: "open" }, fe[Me("elementProperties")] = /* @__PURE__ */ new Map(), fe[Me("finalized")] = /* @__PURE__ */ new Map(), mr?.({ ReactiveElement: fe }), (oe.reactiveElementVersions ?? (oe.reactiveElementVersions = [])).push("2.1.2");
const Te = globalThis, xt = (i) => i, Ke = Te.trustedTypes, $t = Ke ? Ke.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, Ss = "$lit$", re = `lit$${Math.random().toFixed(9).slice(2)}$`, Cs = "?" + re, fr = `<${Cs}>`, he = document, Ie = () => he.createComment(""), Re = (i) => i === null || typeof i != "object" && typeof i != "function", dt = Array.isArray, gr = (i) => dt(i) || typeof i?.[Symbol.iterator] == "function", Je = `[ 	
\f\r]`, Pe = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Pt = /-->/g, St = />/g, ne = RegExp(`>|${Je}(?:([^\\s"'>=/]+)(${Je}*=${Je}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Ct = /'/g, Et = /"/g, Es = /^(?:script|style|textarea|title)$/i, ks = (i) => (e, ...t) => ({ _$litType$: i, strings: e, values: t }), g = ks(1), W = ks(2), ye = /* @__PURE__ */ Symbol.for("lit-noChange"), v = /* @__PURE__ */ Symbol.for("lit-nothing"), kt = /* @__PURE__ */ new WeakMap(), de = he.createTreeWalker(he, 129);
function Fs(i, e) {
  if (!dt(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return $t !== void 0 ? $t.createHTML(e) : e;
}
const yr = (i, e) => {
  const t = i.length - 1, s = [];
  let r, o = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", a = Pe;
  for (let n = 0; n < t; n++) {
    const l = i[n];
    let d, c, p = -1, h = 0;
    for (; h < l.length && (a.lastIndex = h, c = a.exec(l), c !== null); ) h = a.lastIndex, a === Pe ? c[1] === "!--" ? a = Pt : c[1] !== void 0 ? a = St : c[2] !== void 0 ? (Es.test(c[2]) && (r = RegExp("</" + c[2], "g")), a = ne) : c[3] !== void 0 && (a = ne) : a === ne ? c[0] === ">" ? (a = r ?? Pe, p = -1) : c[1] === void 0 ? p = -2 : (p = a.lastIndex - c[2].length, d = c[1], a = c[3] === void 0 ? ne : c[3] === '"' ? Et : Ct) : a === Et || a === Ct ? a = ne : a === Pt || a === St ? a = Pe : (a = ne, r = void 0);
    const u = a === ne && i[n + 1].startsWith("/>") ? " " : "";
    o += a === Pe ? l + fr : p >= 0 ? (s.push(d), l.slice(0, p) + Ss + l.slice(p) + re + u) : l + re + (p === -2 ? n : u);
  }
  return [Fs(i, o + (i[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), s];
};
class Ne {
  constructor({ strings: e, _$litType$: t }, s) {
    let r;
    this.parts = [];
    let o = 0, a = 0;
    const n = e.length - 1, l = this.parts, [d, c] = yr(e, t);
    if (this.el = Ne.createElement(d, s), de.currentNode = this.el.content, t === 2 || t === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (r = de.nextNode()) !== null && l.length < n; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const p of r.getAttributeNames()) if (p.endsWith(Ss)) {
          const h = c[a++], u = r.getAttribute(p).split(re), y = /([.?@])?(.*)/.exec(h);
          l.push({ type: 1, index: o, name: y[2], strings: u, ctor: y[1] === "." ? br : y[1] === "?" ? wr : y[1] === "@" ? xr : qe }), r.removeAttribute(p);
        } else p.startsWith(re) && (l.push({ type: 6, index: o }), r.removeAttribute(p));
        if (Es.test(r.tagName)) {
          const p = r.textContent.split(re), h = p.length - 1;
          if (h > 0) {
            r.textContent = Ke ? Ke.emptyScript : "";
            for (let u = 0; u < h; u++) r.append(p[u], Ie()), de.nextNode(), l.push({ type: 2, index: ++o });
            r.append(p[h], Ie());
          }
        }
      } else if (r.nodeType === 8) if (r.data === Cs) l.push({ type: 2, index: o });
      else {
        let p = -1;
        for (; (p = r.data.indexOf(re, p + 1)) !== -1; ) l.push({ type: 7, index: o }), p += re.length - 1;
      }
      o++;
    }
  }
  static createElement(e, t) {
    const s = he.createElement("template");
    return s.innerHTML = e, s;
  }
}
function ve(i, e, t = i, s) {
  if (e === ye) return e;
  let r = s !== void 0 ? t._$Co?.[s] : t._$Cl;
  const o = Re(e) ? void 0 : e._$litDirective$;
  return r?.constructor !== o && (r?._$AO?.(!1), o === void 0 ? r = void 0 : (r = new o(i), r._$AT(i, t, s)), s !== void 0 ? (t._$Co ?? (t._$Co = []))[s] = r : t._$Cl = r), r !== void 0 && (e = ve(i, r._$AS(i, e.values), r, s)), e;
}
class vr {
  constructor(e, t) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: t }, parts: s } = this._$AD, r = (e?.creationScope ?? he).importNode(t, !0);
    de.currentNode = r;
    let o = de.nextNode(), a = 0, n = 0, l = s[0];
    for (; l !== void 0; ) {
      if (a === l.index) {
        let d;
        l.type === 2 ? d = new Le(o, o.nextSibling, this, e) : l.type === 1 ? d = new l.ctor(o, l.name, l.strings, this, e) : l.type === 6 && (d = new $r(o, this, e)), this._$AV.push(d), l = s[++n];
      }
      a !== l?.index && (o = de.nextNode(), a++);
    }
    return de.currentNode = he, r;
  }
  p(e) {
    let t = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(e, s, t), t += s.strings.length - 2) : s._$AI(e[t])), t++;
  }
}
class Le {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, t, s, r) {
    this.type = 2, this._$AH = v, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = s, this.options = r, this._$Cv = r?.isConnected ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const t = this._$AM;
    return t !== void 0 && e?.nodeType === 11 && (e = t.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, t = this) {
    e = ve(this, e, t), Re(e) ? e === v || e == null || e === "" ? (this._$AH !== v && this._$AR(), this._$AH = v) : e !== this._$AH && e !== ye && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : gr(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== v && Re(this._$AH) ? this._$AA.nextSibling.data = e : this.T(he.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: t, _$litType$: s } = e, r = typeof s == "number" ? this._$AC(e) : (s.el === void 0 && (s.el = Ne.createElement(Fs(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === r) this._$AH.p(t);
    else {
      const o = new vr(r, this), a = o.u(this.options);
      o.p(t), this.T(a), this._$AH = o;
    }
  }
  _$AC(e) {
    let t = kt.get(e.strings);
    return t === void 0 && kt.set(e.strings, t = new Ne(e)), t;
  }
  k(e) {
    dt(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let s, r = 0;
    for (const o of e) r === t.length ? t.push(s = new Le(this.O(Ie()), this.O(Ie()), this, this.options)) : s = t[r], s._$AI(o), r++;
    r < t.length && (this._$AR(s && s._$AB.nextSibling, r), t.length = r);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    for (this._$AP?.(!1, !0, t); e !== this._$AB; ) {
      const s = xt(e).nextSibling;
      xt(e).remove(), e = s;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class qe {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, s, r, o) {
    this.type = 1, this._$AH = v, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = o, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = v;
  }
  _$AI(e, t = this, s, r) {
    const o = this.strings;
    let a = !1;
    if (o === void 0) e = ve(this, e, t, 0), a = !Re(e) || e !== this._$AH && e !== ye, a && (this._$AH = e);
    else {
      const n = e;
      let l, d;
      for (e = o[0], l = 0; l < o.length - 1; l++) d = ve(this, n[s + l], t, l), d === ye && (d = this._$AH[l]), a || (a = !Re(d) || d !== this._$AH[l]), d === v ? e = v : e !== v && (e += (d ?? "") + o[l + 1]), this._$AH[l] = d;
    }
    a && !r && this.j(e);
  }
  j(e) {
    e === v ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class br extends qe {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === v ? void 0 : e;
  }
}
class wr extends qe {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== v);
  }
}
class xr extends qe {
  constructor(e, t, s, r, o) {
    super(e, t, s, r, o), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = ve(this, e, t, 0) ?? v) === ye) return;
    const s = this._$AH, r = e === v && s !== v || e.capture !== s.capture || e.once !== s.once || e.passive !== s.passive, o = e !== v && (s === v || r);
    r && this.element.removeEventListener(this.name, this, s), o && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class $r {
  constructor(e, t, s) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    ve(this, e);
  }
}
const Pr = Te.litHtmlPolyfillSupport;
Pr?.(Ne, Le), (Te.litHtmlVersions ?? (Te.litHtmlVersions = [])).push("3.3.2");
const Sr = (i, e, t) => {
  const s = t?.renderBefore ?? e;
  let r = s._$litPart$;
  if (r === void 0) {
    const o = t?.renderBefore ?? null;
    s._$litPart$ = r = new Le(e.insertBefore(Ie(), o), o, void 0, t ?? {});
  }
  return r._$AI(i), r;
};
const Ae = globalThis;
class ge extends fe {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var t;
    const e = super.createRenderRoot();
    return (t = this.renderOptions).renderBefore ?? (t.renderBefore = e.firstChild), e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Sr(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return ye;
  }
}
ge._$litElement$ = !0, ge.finalized = !0, Ae.litElementHydrateSupport?.({ LitElement: ge });
const Cr = Ae.litElementPolyfillSupport;
Cr?.({ LitElement: ge });
(Ae.litElementVersions ?? (Ae.litElementVersions = [])).push("4.2.2");
const Er = (i) => Object.is(i, -0) ? 0 : i, kr = (i) => Math.min(Math.max(Math.round(i), 0), 4), Fr = (i, e, t, s) => {
  const r = Number(i);
  if (!Number.isFinite(r))
    return null;
  const o = kr(t), a = new Intl.NumberFormat(e, {
    minimumFractionDigits: o,
    maximumFractionDigits: o
  }).format(Er(r)), n = s?.trim();
  return n ? `${a} ${n}` : a;
}, Mr = "sensor.power_production_now", Tr = "sensor.energy_production_today", Ar = {
  power: Mr,
  energy: Tr
}, Be = (i) => Ar[i], Ir = (i, e) => {
  const t = Be(e);
  return i?.states?.[t] ? t : null;
}, Rr = 1100, Nr = 900, Ft = 900, Lr = 6e3, Dr = 5e3, Or = 16e3, et = /* @__PURE__ */ new Set(["deviation", "inverter", "error"]);
class Hr {
  constructor(e) {
    this._flags = {
      enabled: !1,
      powerFlow: !1,
      updateShimmer: !1,
      alertRipple: !1
    }, this._panelShimmers = /* @__PURE__ */ new Set(), this._kpiShimmers = /* @__PURE__ */ new Set(), this._alertRipples = /* @__PURE__ */ new Set(), this._timers = /* @__PURE__ */ new Map(), this._flowPulsePanelId = null, this._flowPulseIndex = 0, this._flowPulsePanelOrder = [], this._reducedMotion = !1, this._visibilityHandler = () => {
      this._snapshot && this._refreshFlowPulseLoop(this._snapshot);
    }, this._mediaQueryHandler = (t) => {
      this._reducedMotion = t.matches, this._clearAllMotion(), this._notify();
    }, this._notify = e, typeof window < "u" && (window.document.addEventListener("visibilitychange", this._visibilityHandler), typeof window.matchMedia == "function" && (this._mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)"), this._reducedMotion = this._mediaQuery.matches, this._mediaQuery.addEventListener("change", this._mediaQueryHandler)));
  }
  destroy() {
    typeof window < "u" && window.document.removeEventListener("visibilitychange", this._visibilityHandler), this._mediaQuery?.removeEventListener("change", this._mediaQueryHandler), this._clearAllMotion(), this._clearTimeoutByKey("flow-pulse-step"), this._clearTimeoutByKey("flow-pulse-timeout");
  }
  update(e, t) {
    const s = this._snapshot;
    if (this._flags = e, this._snapshot = t, !e.enabled || this._reducedMotion) {
      this._clearAllMotion(), this._refreshFlowPulseLoop(t);
      return;
    }
    e.updateShimmer && s && this._triggerKpiShimmers(s, t), e.alertRipple && s && this._triggerAlertRipples(s, t), this._syncAlertRippleLoops(t), this._refreshFlowPulseLoop(t);
  }
  getState() {
    const e = this._snapshot;
    return {
      panelShimmers: new Set(this._panelShimmers),
      kpiShimmers: new Set(this._kpiShimmers),
      alertRipples: new Set(this._alertRipples),
      powerFlowActive: !!(this._flags.enabled && this._flags.powerFlow && !this._reducedMotion && e && e.totalPower > 0 && !e.popupOpen),
      flowPulsePanelId: this._flowPulsePanelId,
      reducedMotion: this._reducedMotion
    };
  }
  triggerPowerImpactFromPulse() {
    const e = this._snapshot;
    e && (!this._flags.enabled || !this._flags.powerFlow || this._reducedMotion || e.popupOpen || e.totalPower <= 0 || this._armTransient("power", this._kpiShimmers, Nr, "kpi-shimmer"));
  }
  completeFlowPulse() {
    const e = this._flowPulsePanelId;
    e && this._finalizeActiveFlowPulse(e);
  }
  _refreshFlowPulseLoop(e) {
    const t = Object.entries(e.panelPowers).filter(([, a]) => typeof a == "number" && a > 0).map(([a]) => a);
    if (!this._canRunFlowPulse(e, t.length)) {
      this._clearFlowPulseLoop();
      return;
    }
    const r = t.join("|"), o = this._flowPulsePanelOrder.join("|");
    r !== o && (this._flowPulsePanelOrder = t, this._flowPulseIndex = 0, this._clearTimeoutByKey("flow-pulse-step"), this._clearTimeoutByKey("flow-pulse-timeout"), this._flowPulsePanelId !== null && (this._flowPulsePanelId = null, this._notify())), !(this._timers.has("flow-pulse-step") || this._timers.has("flow-pulse-timeout") || this._flowPulsePanelId !== null) && this._triggerNextFlowPulse();
  }
  _canRunFlowPulse(e, t) {
    const s = typeof document < "u" ? document.hidden : !1;
    return !!(this._flags.enabled && this._flags.powerFlow && !this._reducedMotion && !s && e && e.totalPower > 0 && !e.popupOpen && t > 0);
  }
  _triggerNextFlowPulse() {
    if (!this._canRunFlowPulse(this._snapshot, this._flowPulsePanelOrder.length)) {
      this._clearFlowPulseLoop();
      return;
    }
    const e = this._flowPulsePanelOrder[this._flowPulseIndex % this._flowPulsePanelOrder.length];
    this._flowPulseIndex = (this._flowPulseIndex + 1) % Math.max(this._flowPulsePanelOrder.length, 1), this._flowPulsePanelId = e, this._notify(), this._clearTimeoutByKey("flow-pulse-timeout");
    const t = window.setTimeout(() => {
      this._timers.delete("flow-pulse-timeout"), this._finalizeActiveFlowPulse(e);
    }, Or);
    this._timers.set("flow-pulse-timeout", t);
  }
  _scheduleNextFlowPulse() {
    this._clearTimeoutByKey("flow-pulse-step");
    const e = window.setTimeout(() => {
      this._timers.delete("flow-pulse-step"), this._triggerNextFlowPulse();
    }, Dr);
    this._timers.set("flow-pulse-step", e);
  }
  _finalizeActiveFlowPulse(e) {
    this._flowPulsePanelId === e && (this._clearTimeoutByKey("flow-pulse-timeout"), this._flowPulsePanelId = null, this._notify(), this.triggerPowerImpactFromPulse(), this._scheduleNextFlowPulse());
  }
  _clearFlowPulseLoop() {
    this._clearTimeoutByKey("flow-pulse-step"), this._clearTimeoutByKey("flow-pulse-timeout"), this._flowPulsePanelOrder = [], this._flowPulseIndex = 0, this._flowPulsePanelId !== null && (this._flowPulsePanelId = null, this._notify());
  }
  _triggerKpiShimmers(e, t) {
    e.energyKpiValue !== t.energyKpiValue && this._armTransient("energy", this._kpiShimmers, Rr, "kpi-shimmer");
  }
  _triggerAlertRipples(e, t) {
    for (const [s, r] of Object.entries(t.panelStatuses)) {
      const o = e.panelStatuses[s];
      r !== o && et.has(r) && this._armTransient(s, this._alertRipples, Ft, "alert-ripple");
    }
  }
  _syncAlertRippleLoops(e) {
    if (!this._flags.alertRipple) {
      for (const s of [...this._timers.keys()])
        s.startsWith("alert-ripple-loop:") && this._clearTimeoutByKey(s);
      return;
    }
    const t = new Set(
      Object.entries(e.panelStatuses).filter(([, s]) => et.has(s)).map(([s]) => s)
    );
    for (const s of t) {
      const r = this._alertRippleLoopKey(s);
      this._timers.has(r) || this._armAlertRippleLoop(s);
    }
    for (const s of [...this._timers.keys()]) {
      if (!s.startsWith("alert-ripple-loop:"))
        continue;
      const r = s.slice(18);
      t.has(r) || this._clearTimeoutByKey(s);
    }
  }
  _armAlertRippleLoop(e) {
    const t = this._alertRippleLoopKey(e);
    this._clearTimeoutByKey(t);
    const s = window.setTimeout(() => {
      if (!this._canRepeatAlertRipple(e)) {
        this._clearTimeoutByKey(t);
        return;
      }
      this._armTransient(e, this._alertRipples, Ft, "alert-ripple"), this._armAlertRippleLoop(e);
    }, Lr);
    this._timers.set(t, s);
  }
  _canRepeatAlertRipple(e) {
    const t = this._snapshot;
    if (!t || !this._flags.enabled || !this._flags.alertRipple || this._reducedMotion)
      return !1;
    const s = t.panelStatuses[e];
    return et.has(s);
  }
  _alertRippleLoopKey(e) {
    return `alert-ripple-loop:${e}`;
  }
  _armTransient(e, t, s, r) {
    t.add(e), this._notify();
    const o = `${r}:${e}`;
    this._clearTimeoutByKey(o);
    const a = window.setTimeout(() => {
      t.delete(e), this._timers.delete(o), this._notify();
    }, s);
    this._timers.set(o, a);
  }
  _clearAllMotion() {
    this._panelShimmers.clear(), this._kpiShimmers.clear(), this._alertRipples.clear(), this._flowPulsePanelOrder = [], this._flowPulseIndex = 0, this._flowPulsePanelId = null;
    for (const e of [...this._timers.keys()])
      (e.startsWith("panel-shimmer:") || e.startsWith("kpi-shimmer:") || e.startsWith("alert-ripple:") || e.startsWith("alert-ripple-loop:") || e.startsWith("flow-pulse-")) && this._clearTimeoutByKey(e);
  }
  _clearTimeoutByKey(e) {
    const t = this._timers.get(e);
    t !== void 0 && (window.clearTimeout(t), this._timers.delete(e));
  }
}
const q = (i, e, t) => Math.max(e, Math.min(t, i)), Mt = (i, e) => Math.abs(i - e) < 0.01, zr = (i, e) => Math.hypot(e.x - i.x, e.y - i.y), Gr = (i, e) => ({
  x: i.left - e.left + i.width / 2,
  y: i.top - e.top + i.height / 2
}), Se = "rgba(224, 232, 242, 1)", Br = 8, Tt = 28, ie = 14, Wr = (i) => {
  const e = [];
  for (const t of i) {
    const s = e[e.length - 1];
    s && Mt(s.x, t.x) && Mt(s.y, t.y) || e.push(t);
  }
  return e;
}, At = (i) => {
  const e = Wr(i);
  if (e.length < 2)
    return { d: "", length: 0 };
  let t = `M ${e[0].x.toFixed(2)} ${e[0].y.toFixed(2)}`, s = 0;
  for (let r = 1; r < e.length; r += 1) {
    const o = e[r - 1], a = e[r];
    t += ` L ${a.x.toFixed(2)} ${a.y.toFixed(2)}`, s += zr(o, a);
  }
  return { d: t, length: s };
}, Ur = (i, e, t, s) => {
  const r = t - e;
  if (!Number.isFinite(i) || !Number.isFinite(e) || !Number.isFinite(t) || !Number.isFinite(s) || i <= 0 || r <= 0)
    return !1;
  const o = e + r * 0.28, a = i * 0.36;
  return s >= Math.max(o, a) && s <= t;
}, Kr = (i, e, t = !1, s = { x: 0, y: 0 }) => {
  const r = Gr(e, i), o = e.left - i.left, a = e.bottom - i.top;
  return {
    entry: {
      x: (t ? r.x : o - 0.5) + s.x,
      y: (t ? a + 0.5 : r.y) + s.y
    }
  };
}, Vr = (i) => {
  const e = i.left + (i.right - i.left) * 0.22;
  return q(i.statusCenterX || e, i.left + 10, i.right - 10);
}, jr = (i) => {
  if (i.length === 0)
    return [];
  const e = i.reduce((n, l) => n + Math.max(1, l.bottom - l.top), 0) / i.length, t = q(e * 0.32, 6, 28), s = [], r = [], o = new Array(i.length).fill(0), a = i.map((n, l) => ({ item: n, index: l })).sort((n, l) => n.item.top - l.item.top || n.item.left - l.item.left);
  for (const { item: n, index: l } of a) {
    const d = n.top + (n.bottom - n.top) / 2;
    let c = s.findIndex((p) => Math.abs(p - d) <= t);
    c < 0 ? (c = s.length, s.push(d), r.push(1)) : (r[c] += 1, s[c] = s[c] + (d - s[c]) / r[c]), o[l] = c;
  }
  return o;
}, Yr = (i, e, t, s, r = Math.min(...i.map((a) => a.left)), o = "left-collector") => {
  const a = [], n = [], l = [], d = [], c = (m, b, k) => {
    const I = At(b);
    I.d && n.push({
      id: m,
      d: I.d,
      color: Se,
      opacity: k,
      delayMs: 0,
      durationMs: 1200,
      travelPx: Math.max(24, I.length)
    });
  }, p = (m) => {
    l.some((k) => {
      const I = k.cx - m.cx, R = k.cy - m.cy;
      return Math.hypot(I, R) < Math.max(k.r, m.r) * 0.9;
    }) || l.push(m);
  }, h = /* @__PURE__ */ new Map();
  for (const m of i) {
    const b = h.get(m.row) ?? [];
    b.push(m), h.set(m.row, b);
  }
  const u = [...h.entries()].sort((m, b) => m[0] - b[0]).map(([m, b]) => ({
    row: m,
    busY: 0,
    minTop: Math.min(...b.map((k) => k.top)),
    maxBottom: Math.max(...b.map((k) => k.bottom))
  }));
  if (u.length === 0)
    return { flowPaths: a, topologyPaths: n, topologyNodes: l, collectorX: ie, rowBuses: d };
  const y = Math.max(0, Math.min(r, ...i.map((m) => m.left))), S = Math.max(6, ie * 0.5), C = Math.max(S, y - 8), $ = q(
    y / 2,
    S,
    Math.min(C, Math.max(ie, s - ie))
  ), P = e.y + 8;
  for (let m = 0; m < u.length; m += 1) {
    const b = u[m], k = u[m - 1], I = b.minTop - 12, R = m === 0 ? P : Math.max(k.maxBottom + 8, k.busY + 8), H = b.minTop - 6;
    b.busY = H > R ? q(I, R, H) : Math.max(P, b.minTop - 6);
  }
  const F = q(0.24 / Math.sqrt(Math.max(u.length, 1)), 0.15, 0.22), O = q(0.24 / Math.sqrt(Math.max(i.length, 1)), 0.09, 0.16);
  p({
    id: "power-socket-node",
    cx: e.x,
    cy: e.y,
    r: q(t * 0.18, 2.8, 4.8),
    color: Se,
    opacity: 0.36
  });
  const w = u[0], E = Math.max(...u.map((m) => m.busY)), N = o === "direct-first-row", T = u.length > 1;
  N ? (c(
    "power-drop-rail",
    [
      e,
      { x: e.x, y: w.busY }
    ],
    F
  ), p({
    id: "power-drop-node",
    cx: e.x,
    cy: w.busY,
    r: q(t * 0.18, 2.8, 4.8),
    color: Se,
    opacity: 0.36
  }), T && c(
    "collector-rail",
    [
      { x: $, y: w.busY },
      { x: $, y: E }
    ],
    F
  )) : (c(
    "collector-rail",
    [
      { x: $, y: e.y },
      { x: $, y: E }
    ],
    F
  ), c(
    "power-entry-rail",
    [
      { x: $, y: e.y },
      e
    ],
    F
  ));
  for (const m of u) {
    const b = h.get(m.row) ?? [];
    if (b.length === 0)
      continue;
    const k = b.map((f) => f.anchorX), I = m.row === w.row, R = N && I ? [e.x, ...k, ...T ? [$] : []] : [$, ...k], H = Math.min(...R), G = Math.max(...R);
    d.push({
      row: m.row,
      y: m.busY,
      startX: H,
      endX: G
    }), c(
      `row-rail-${m.row}`,
      [
        { x: H, y: m.busY },
        { x: G, y: m.busY }
      ],
      F
    ), (!N || !I || T) && p({
      id: `row-node-${m.row}`,
      cx: $,
      cy: m.busY,
      r: q(t * 0.2, 2.8, 4.8),
      color: Se,
      opacity: 0.32
    });
    for (const f of b) {
      const x = N && I ? [
        { x: f.anchorX, y: f.anchorY },
        { x: f.anchorX, y: m.busY },
        { x: e.x, y: m.busY },
        e
      ] : N ? [
        { x: f.anchorX, y: f.anchorY },
        { x: f.anchorX, y: m.busY },
        { x: $, y: m.busY },
        { x: $, y: w.busY },
        { x: e.x, y: w.busY },
        e
      ] : [
        { x: f.anchorX, y: f.anchorY },
        { x: f.anchorX, y: m.busY },
        { x: $, y: m.busY },
        { x: $, y: e.y },
        e
      ], j = At(
        x
      );
      if (c(
        `tap-rail-${f.id}`,
        [
          { x: f.anchorX, y: f.anchorY },
          { x: f.anchorX, y: m.busY }
        ],
        O
      ), p({
        id: `tap-node-${f.id}`,
        cx: f.anchorX,
        cy: m.busY,
        r: q(t * 0.18, 2.6, 4.4),
        color: Se,
        opacity: 0.3
      }), !f.producing || !j.d)
        continue;
      const K = Math.max(Tt, j.length), se = K + Tt;
      a.push({
        id: `flow-${f.id}`,
        panelId: f.id,
        d: j.d,
        color: f.accentColor,
        opacity: 0.62 + Math.min(f.intensity, 1) * 0.2,
        delayMs: 0,
        durationMs: Math.round(se * Br),
        travelPx: K,
        offsetPx: -se
      });
    }
  }
  return { flowPaths: a, topologyPaths: n, topologyNodes: l, collectorX: $, rowBuses: d };
}, qr = (i, e, t, s, r, o, a) => {
  const n = i.map((d) => ({
    id: d.panel.id,
    row: d.row,
    anchorX: Vr(d),
    anchorY: d.top + 1.5,
    left: d.left,
    right: d.right,
    top: d.top,
    bottom: d.bottom,
    accentColor: d.panel.accentColor,
    intensity: d.panel.intensity,
    producing: e.has(d.panel.id)
  })), l = Yr(
    n,
    t.entry,
    s,
    r,
    o,
    a
  );
  return {
    flowPaths: l.flowPaths,
    topologyPaths: l.topologyPaths,
    topologyNodes: l.topologyNodes
  };
}, Xr = (i, e, t, s) => {
  const r = e.querySelector("ha-card");
  if (!r)
    return null;
  const o = r.getBoundingClientRect();
  if (o.width <= 0 || o.height <= 0)
    return null;
  const a = {
    x: r.scrollLeft,
    y: r.scrollTop
  }, n = e.querySelector('[data-kpi="power"]');
  if (!n)
    return null;
  const l = s.panels.map((m) => e.querySelector(`[data-panel-id="${m.id}"]`)).filter((m) => !!m).map((m) => {
    const b = m.getBoundingClientRect();
    return {
      left: b.left - o.left + a.x,
      right: b.right - o.left + a.x,
      top: b.top - o.top + a.y,
      bottom: b.bottom - o.top + a.y
    };
  }).filter((m) => Number.isFinite(m.left) && Number.isFinite(m.right)), d = l.length > 0 ? Math.min(...l.map((m) => m.left)) : 0, c = l.length > 0 ? Math.max(...l.map((m) => m.right)) : o.width, p = s.panels.filter(
    (m) => !m.hiddenSlot && m.enabled && !!m.powerEntityName
  );
  if (p.length === 0)
    return null;
  const h = new Set(
    p.filter((m) => typeof m.power == "number" && m.power > 0).map((m) => m.id)
  ), u = p.map((m) => ({
    panel: m,
    element: e.querySelector(`[data-panel-id="${m.id}"]`)
  })).filter(
    (m) => !!m.element
  ).map((m) => {
    const b = m.element.getBoundingClientRect(), k = {
      x: b.left - o.left + a.x + b.width / 2,
      y: b.top - o.top + a.y + b.height / 2
    }, R = m.element.querySelector(".status")?.getBoundingClientRect(), H = R && R.width > 0 ? R.left - o.left + a.x + R.width * 0.33 : k.x;
    return {
      panel: m.panel,
      row: 0,
      center: k,
      statusCenterX: H,
      left: b.left - o.left + a.x,
      right: b.right - o.left + a.x,
      top: b.top - o.top + a.y,
      bottom: b.bottom - o.top + a.y
    };
  }), y = jr(u), S = u.map((m, b) => ({
    ...m,
    row: y[b] ?? 0
  }));
  if (S.length === 0)
    return null;
  const C = S.reduce((m, b) => {
    const k = b.right - b.left, I = b.bottom - b.top;
    return m + Math.min(k, I);
  }, 0) / S.length, $ = q(Math.round(C * 0.2), 18, 34), P = n.getBoundingClientRect(), F = P.left - o.left + a.x + P.width / 2, O = Ur(
    o.width,
    d,
    c,
    F
  ), w = Kr(
    o,
    P,
    O,
    a
  ), { flowPaths: E, topologyPaths: N, topologyNodes: T } = qr(
    S,
    h,
    w,
    $,
    o.width,
    d,
    O ? "direct-first-row" : "left-collector"
  );
  return {
    width: Math.max(
      r.clientWidth,
      o.width,
      c + ie,
      w.entry.x + ie
    ),
    height: Math.max(
      r.clientHeight,
      o.height,
      a.y + o.height,
      ...S.map((m) => m.bottom + ie),
      w.entry.y + ie
    ),
    flowPaths: E,
    topologyPaths: N,
    topologyNodes: T
  };
}, Qr = (i, e) => {
  if (!i || i.flowPaths.length === 0 && i.topologyPaths.length === 0)
    return v;
  const t = i.flowPaths.filter(
    (s) => e.showFlow && e.activeFlowPanelId !== null && s.panelId === e.activeFlowPanelId
  );
  return g`
    <svg
      class="spv-motion-overlay-svg"
      viewBox=${`0 0 ${i.width} ${i.height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      ${e.showTopology ? i.topologyPaths.map(
    (s) => W`<path
              class="spv-motion-backbone"
              d=${s.d}
              style=${`--spv-motion-color:${s.color}; --spv-motion-opacity:${s.opacity};`}
            ></path>`
  ) : v}

      ${e.showTopology ? i.topologyNodes.map(
    (s) => W`<circle
              class="spv-motion-node"
              cx=${s.cx}
              cy=${s.cy}
              r=${s.r}
              style=${`--spv-motion-color:${s.color}; --spv-motion-opacity:${s.opacity};`}
            ></circle>`
  ) : v}

      ${t.map(
    (s) => W`<path
          class="spv-motion-flow"
          d=${s.d}
          style=${`--spv-motion-color:${s.color}; --spv-motion-opacity:${s.opacity}; --spv-flow-duration:${s.durationMs}ms; --spv-flow-delay:${s.delayMs}ms; --spv-flow-travel:${s.travelPx}px; --spv-flow-offset:${s.offsetPx ?? -s.travelPx}px;`}
        ></path>`
  )}
    </svg>
  `;
}, Zr = ct`
  .chrome {
    display: none;
  }

  .panel {
    background: linear-gradient(180deg, rgba(8, 17, 32, 0.94), rgba(8, 17, 32, 0.98));
    border-color: var(--panel-border-accent, rgba(255, 255, 255, 0.2));
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.07),
      0 0 calc(1px + var(--panel-intensity, 0.4) * 2.5px) var(--panel-glow-accent, transparent);
    transition: border-color 180ms ease, box-shadow 180ms ease;
  }

  .panel::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    background:
      radial-gradient(circle at 70% 78%, var(--panel-fill-accent, transparent) 0%, transparent 62%),
      radial-gradient(
        circle at 36% 62%,
        color-mix(in srgb, var(--panel-fill-accent, transparent) 65%, transparent) 0%,
        transparent 58%
      );
    opacity: 1;
    filter: blur(1.5px);
  }

  .panel::before {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.08), transparent 36%);
    opacity: 0.42;
  }

  .panel:hover {
    transform: none;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.09),
      0 0 calc(2px + var(--panel-intensity, 0.4) * 3.5px) var(--panel-glow-accent, transparent);
  }

  .panel.hidden-slot {
    background: linear-gradient(180deg, rgba(10, 17, 29, 0.78), rgba(7, 12, 21, 0.82));
    border-color: rgba(255, 255, 255, 0.18) !important;
    box-shadow: none;
  }

  ha-card[data-spv-theme="light"] .panel {
    background: linear-gradient(180deg, rgba(251, 254, 255, 0.96), rgba(230, 240, 249, 0.98));
    border-color: var(--panel-border-accent, rgba(45, 67, 90, 0.24));
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.9),
      0 0 calc(1px + var(--panel-intensity, 0.4) * 2px) var(--panel-glow-accent, transparent);
  }

  ha-card[data-spv-theme="light"] .panel::before {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.42), transparent 38%);
    opacity: 0.36;
  }

  ha-card[data-spv-theme="light"] .panel::after {
    background:
      radial-gradient(circle at 70% 78%, var(--panel-fill-accent, transparent) 0%, transparent 64%),
      radial-gradient(
        circle at 36% 62%,
        color-mix(in srgb, var(--panel-fill-accent, transparent) 48%, transparent) 0%,
        transparent 58%
      );
    filter: blur(1px);
    opacity: 0.72;
  }

  ha-card[data-spv-theme="light"] .panel:hover {
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.94),
      0 0 calc(2px + var(--panel-intensity, 0.4) * 3px) var(--panel-glow-accent, transparent);
  }

  ha-card[data-spv-theme="light"] .panel.hidden-slot {
    background: linear-gradient(180deg, rgba(238, 246, 252, 0.72), rgba(222, 234, 244, 0.82));
    border-color: rgba(58, 80, 104, 0.32) !important;
  }

  ha-card[data-spv-theme="light"] .spv-motion-backbone {
    stroke: rgba(74, 171, 204, 0.78);
    stroke-width: 3.1;
    opacity: calc(var(--spv-motion-opacity, 0.18) * 2.25 + 0.34);
    mix-blend-mode: normal;
    filter:
      drop-shadow(0 1px 0 rgba(255, 255, 255, 0.72))
      drop-shadow(0 0 2px rgba(74, 171, 204, 0.24));
  }

  ha-card[data-spv-theme="light"] .spv-motion-node {
    fill: rgba(74, 171, 204, 0.78);
    opacity: 0.92;
    mix-blend-mode: normal;
    filter:
      drop-shadow(0 1px 0 rgba(255, 255, 255, 0.75))
      drop-shadow(0 0 2px rgba(74, 171, 204, 0.24));
  }

  :host([data-spv-busbars]) .grid {
    column-gap: 16px;
    row-gap: 22px;
    margin-top: 20px;
  }

  .spv-motion-overlay-svg {
    width: 100%;
    height: 100%;
    display: block;
    overflow: visible;
  }

  .spv-motion-flow,
  .spv-motion-backbone {
    fill: none;
    stroke-linejoin: miter;
    pointer-events: none;
  }

  .spv-motion-backbone {
    stroke: color-mix(in srgb, var(--secondary-text-color, #cdd7e4) 82%, white 18%);
    stroke-linecap: butt;
    stroke-width: 2.8;
    opacity: var(--spv-motion-opacity, 0.22);
    mix-blend-mode: screen;
    filter: drop-shadow(
      0 0 2px color-mix(in srgb, var(--secondary-text-color, #cdd7e4) 24%, transparent)
    );
  }

  .spv-motion-node {
    fill: color-mix(in srgb, var(--secondary-text-color, #d7e0eb) 88%, white 12%);
    opacity: var(--spv-motion-opacity, 0.75);
    filter: drop-shadow(
      0 0 2px color-mix(in srgb, var(--secondary-text-color, #d7e0eb) 32%, transparent)
    );
  }

  .spv-motion-node.is-socket-impact {
    animation: spv-socket-impact 900ms ease-out;
  }

  .spv-motion-flow {
    stroke-linecap: round;
    stroke: color-mix(
      in srgb,
      color-mix(in srgb, var(--spv-motion-color, rgba(111, 201, 255, 0.9)) 62%, #ff9d35) 82%,
      #ffd08a
    );
    stroke-width: 8.4;
    stroke-dasharray: 28 2500;
    opacity: var(--spv-motion-opacity, 0.68);
    mix-blend-mode: screen;
    filter:
      drop-shadow(0 0 10px color-mix(in srgb, var(--spv-motion-color) 48%, #ff9d35 52%))
      drop-shadow(0 0 20px color-mix(in srgb, var(--spv-motion-color) 36%, #ffb04e 64%));
    animation: spv-flow-pulse var(--spv-flow-duration, 1800ms) linear;
    animation-delay: var(--spv-flow-delay, 0ms);
    animation-fill-mode: both;
  }

  ha-card[data-spv-theme="light"] .spv-motion-flow {
    stroke: color-mix(
      in srgb,
      color-mix(in srgb, var(--spv-motion-color, #11a36a) 66%, #f59f22) 82%,
      #4f3406
    );
    stroke-width: 9.4;
    opacity: 0.96;
    mix-blend-mode: normal;
    filter:
      drop-shadow(0 0 4px color-mix(in srgb, var(--spv-motion-color, #11a36a) 64%, #f59f22 36%))
      drop-shadow(0 0 10px rgba(138, 91, 12, 0.38))
      drop-shadow(0 1px 0 rgba(255, 255, 255, 0.52));
  }

  .summary-chip.spv-motion-shimmer {
    background-size: 220% 100%, auto, auto;
    animation: spv-shimmer 1100ms cubic-bezier(0.2, 0.85, 0.2, 1);
    background-image:
      linear-gradient(
        112deg,
        transparent 18%,
        rgba(255, 255, 255, 0.14) 46%,
        rgba(255, 255, 255, 0.03) 58%,
        transparent 76%
      ),
      linear-gradient(180deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.05));
  }

  .summary-chip.spv-motion-power-impact {
    --spv-impact-color: color-mix(
      in srgb,
      var(--spv-shimmer-color, rgba(111, 201, 255, 0.6)) 70%,
      transparent
    );
    animation: spv-alert-ripple 900ms ease-out;
  }

  .summary-chip.spv-motion-neutral-impact {
    --spv-impact-color: rgba(214, 223, 235, 0.36);
    animation: spv-alert-ripple 900ms ease-out;
  }

  .panel.spv-motion-alert-ripple {
    --spv-impact-color: rgba(255, 98, 127, 0.42);
    animation: spv-alert-ripple 900ms ease-out;
  }

  .panel.spv-motion-alert-ripple .status {
    animation: spv-alert-badge 900ms ease-out;
  }

  .panel .inverter-status {
    position: relative;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--spv-text-soft);
  }

  @keyframes spv-flow-pulse {
    0% {
      opacity: var(--spv-motion-opacity, 0.82);
      stroke-dashoffset: 0;
    }
    100% {
      opacity: var(--spv-motion-opacity, 0.82);
      stroke-dashoffset: var(--spv-flow-offset, calc(-1 * var(--spv-flow-travel, 220px)));
    }
  }

  @keyframes spv-shimmer {
    0% {
      background-position: 140% 0, 0 0, 0 0;
    }
    100% {
      background-position: -120% 0, 0 0, 0 0;
    }
  }

  @keyframes spv-socket-impact {
    0% {
      opacity: 0.95;
      transform: scale(1);
      transform-origin: center;
      filter: drop-shadow(0 0 4px color-mix(in srgb, var(--spv-motion-color) 48%, transparent));
    }
    60% {
      opacity: 0.25;
      transform: scale(1.85);
      transform-origin: center;
      filter: drop-shadow(0 0 14px color-mix(in srgb, var(--spv-motion-color) 62%, transparent));
    }
    100% {
      opacity: 0.95;
      transform: scale(1);
      transform-origin: center;
      filter: drop-shadow(0 0 4px color-mix(in srgb, var(--spv-motion-color) 48%, transparent));
    }
  }

  @keyframes spv-alert-ripple {
    0% {
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.08),
        0 0 0 0 var(--spv-impact-color, rgba(255, 98, 127, 0.42)),
        0 10px 24px rgba(0, 0, 0, 0.18);
    }
    55% {
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.08),
        0 0 0 7px color-mix(in srgb, var(--spv-impact-color, rgba(255, 98, 127, 0.42)) 0%, transparent),
        0 10px 24px rgba(0, 0, 0, 0.18);
    }
    100% {
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.08),
        0 10px 24px rgba(0, 0, 0, 0.18);
    }
  }

  @keyframes spv-alert-badge {
    0% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(255, 98, 127, 0.32);
    }
    50% {
      transform: scale(1.045);
      box-shadow: 0 0 0 5px rgba(255, 98, 127, 0);
    }
    100% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(255, 98, 127, 0);
    }
  }
`, Ms = 1.2, Jr = /* @__PURE__ */ new Set(["unknown", "unavailable", "none", "null", ""]), te = (i, e = 0, t = 1) => Math.min(Math.max(i, e), t), me = (i) => {
  if (!i)
    return null;
  const e = i.state?.toString().trim().toLowerCase();
  if (Jr.has(e))
    return null;
  const t = Number(i.state);
  return Number.isFinite(t) ? t : null;
}, ei = (i) => {
  if (i == null)
    return;
  const e = i.toString().replace(/[\u200B-\u200D\uFEFF]/g, "").replace(/\s+/g, " ").trim();
  return e.length > 0 ? e : void 0;
}, It = (i) => i.toLowerCase().match(/[a-z0-9]+/g) ?? [], Rt = (i, e) => {
  const t = It(i);
  return t.length === 0 ? !1 : e.some((s) => {
    const r = It(s);
    if (r.length === 0 || r.length > t.length)
      return !1;
    for (let o = 0; o <= t.length - r.length; o += 1) {
      let a = !0;
      for (let n = 0; n < r.length; n += 1)
        if (t[o + n] !== r[n]) {
          a = !1;
          break;
        }
      if (a)
        return !0;
    }
    return !1;
  });
}, Ce = (i, e) => {
  const t = i?.attributes?.friendly_name;
  return typeof t == "string" && t.trim().length > 0 ? t : e;
}, Nt = (i, e, t, s, r = "en") => {
  if (i === null)
    return s;
  const o = Object.is(i, -0) ? 0 : i, a = new Intl.NumberFormat(r, {
    minimumFractionDigits: t,
    maximumFractionDigits: t
  }).format(o);
  return e ? `${a} ${e}` : a;
}, Lt = (i) => {
  const e = i.replace("#", ""), t = e.length === 3 ? e.split("").map((s) => `${s}${s}`).join("") : e;
  return [
    parseInt(t.slice(0, 2), 16),
    parseInt(t.slice(2, 4), 16),
    parseInt(t.slice(4, 6), 16)
  ];
}, Dt = (i, e, t) => {
  const s = te(t), [r, o, a] = Lt(i), [n, l, d] = Lt(e), c = (p, h) => Math.round(p + (h - p) * s);
  return `rgb(${c(r, n)}, ${c(o, l)}, ${c(a, d)})`;
}, ti = (i, e, t, s) => {
  const r = te(s);
  return r <= 0.5 ? Dt(i, e, r * 2) : Dt(e, t, (r - 0.5) * 2);
}, si = (i) => {
  if (i.length === 0)
    return 0;
  const e = [...i].sort((o, a) => o - a), t = Math.floor(e.length * 0.4), s = e.slice(t), r = s.reduce((o, a) => o + a, 0) / Math.max(s.length, 1);
  return te(r, 0, Ms);
}, ri = (i, e, t) => {
  if (t <= 0)
    return i;
  const s = e - t * 60 * 1e3;
  return i.filter((r) => r.ts >= s);
}, ii = (i) => {
  if (i.length < 2)
    return 1;
  const e = [];
  for (let s = 1; s < i.length; s += 1) {
    const r = (i[s].ts - i[s - 1].ts) / 6e4;
    Number.isFinite(r) && r > 0 && e.push(r);
  }
  if (e.length === 0)
    return 1;
  e.sort((s, r) => s - r);
  const t = Math.floor(e.length / 2);
  return e.length % 2 === 0 ? (e[t - 1] + e[t]) / 2 : e[t];
}, oi = (i, e, t, s) => {
  if (!e || e.length === 0)
    return {
      value: i,
      sampleCount: 1,
      firstSampleTs: t
    };
  const r = e.filter((c) => Number.isFinite(c.value)).sort((c, p) => c.ts - p.ts);
  if (r.length === 0)
    return {
      value: i,
      sampleCount: 1,
      firstSampleTs: t
    };
  const o = ri(r, t, s), a = ii(r), n = s > 0 ? Math.max(2, Math.ceil(s / Math.max(a, 0.1)) + 1) : 1;
  let l = o.length > 0 ? o : r;
  return s > 0 && l.length < n && r.length > l.length && (l = r.slice(-n)), {
    value: l.reduce((c, p) => c + p.value, 0) / Math.max(l.length, 1),
    sampleCount: l.length,
    firstSampleTs: r[0].ts ?? null
  };
}, ze = (i, e, t) => {
  const s = e?.locale?.language ?? "en", r = (_, A) => Ue(s, _, A), o = r("common.unavailable"), a = t?.nowMs ?? Date.now(), n = { ...nt, ...i.colors ?? {} }, l = i.enable_inverter_status ?? !1, d = (i.inverter_fault_terms ?? []).map((_) => _.trim().toLowerCase()).filter((_) => _.length > 0), c = (i.inverter_working_terms ?? []).map((_) => _.trim().toLowerCase()).filter((_) => _.length > 0), p = i.production_color_intensity ?? 1, h = t?.deviationEnabled ?? !0, u = i.deviation_min_active_panels ?? 3, y = i.deviation_min_samples ?? 3, S = i.deviation_min_runtime_minutes ?? 15, C = i.deviation_smoothing_minutes ?? 0, $ = i.deviation_dynamic_floor_w ?? 20, P = i.deviation_threshold_percent ?? 15, F = i.deviation_absolute_w_threshold ?? 50, O = t?.historyByEntityId ?? {}, w = i.panels.map((_, A) => {
    const L = _.enabled ?? !0, V = _.name ?? `Panel ${A + 1}`, X = _.inverter_status_entity ?? _.error_entity, M = X ? e?.states?.[X] : void 0, D = X ? ei(M?.state) ?? o : void 0, z = Ce(
      M,
      X
    ), Q = D !== void 0 && D !== o && Rt(D, d), Z = D !== void 0 && D !== o && Rt(D, c);
    if (!L)
      return {
        config: _,
        slotIndex: A,
        label: V,
        power: null,
        energy: null,
        inverterStatusEntityName: z,
        inverterStatusDisplay: D,
        inverterFaultMatched: Q,
        inverterWorkingMatched: Z,
        reason: r("state.reason.slot_hidden"),
        status: "disabled",
        enabled: !1,
        hiddenSlot: !0
      };
    if (!_.power_entity)
      return {
        config: _,
        slotIndex: A,
        label: V,
        power: null,
        energy: null,
        inverterStatusEntityName: z,
        inverterStatusDisplay: D,
        inverterFaultMatched: Q,
        inverterWorkingMatched: Z,
        reason: r("state.reason.select_power_sensor"),
        status: "unconfigured",
        enabled: !0,
        hiddenSlot: !1
      };
    const J = e?.states?.[_.power_entity], _e = _.energy_entity ? e?.states?.[_.energy_entity] : void 0;
    if (!J)
      return {
        config: _,
        slotIndex: A,
        label: V,
        power: null,
        energy: null,
        inverterStatusEntityName: z,
        inverterStatusDisplay: D,
        inverterFaultMatched: Q,
        inverterWorkingMatched: Z,
        reason: r("state.reason.power_entity_missing", {
          entity: _.power_entity
        }),
        status: "offline",
        enabled: !0,
        hiddenSlot: !1
      };
    if (l && D && D !== o && Q)
      return {
        config: _,
        slotIndex: A,
        label: V,
        power: me(J),
        energy: me(_e),
        powerEntityName: Ce(J, _.power_entity),
        inverterStatusEntityName: z,
        inverterStatusDisplay: D,
        inverterFaultMatched: Q,
        inverterWorkingMatched: Z,
        reason: r("state.reason.inverter_fault_match", {
          status: D
        }),
        status: "error",
        enabled: !0,
        hiddenSlot: !1
      };
    if (l && D && D !== o && c.length > 0 && !Z)
      return {
        config: _,
        slotIndex: A,
        label: V,
        power: me(J),
        energy: me(_e),
        powerEntityName: Ce(J, _.power_entity),
        inverterStatusEntityName: z,
        inverterStatusDisplay: D,
        inverterFaultMatched: Q,
        inverterWorkingMatched: Z,
        reason: r("state.reason.inverter_working_mismatch", {
          status: D
        }),
        status: "inverter",
        enabled: !0,
        hiddenSlot: !1
      };
    const Oe = me(J), He = me(_e);
    return Oe === null ? {
      config: _,
      slotIndex: A,
      label: V,
      power: null,
      energy: He,
      powerEntityName: Ce(J, _.power_entity),
      inverterStatusEntityName: z,
      inverterStatusDisplay: D,
      inverterFaultMatched: Q,
      inverterWorkingMatched: Z,
      reason: r("state.reason.power_entity_unavailable", {
        entity: _.power_entity
      }),
      status: "offline",
      enabled: !0,
      hiddenSlot: !1
    } : {
      config: _,
      slotIndex: A,
      label: V,
      power: Oe,
      energy: He,
      powerEntityName: Ce(J, _.power_entity),
      inverterStatusEntityName: z,
      inverterStatusDisplay: D,
      inverterFaultMatched: Q,
      inverterWorkingMatched: Z,
      reason: r("state.reason.producing_expected"),
      status: "normal",
      enabled: !0,
      hiddenSlot: !1
    };
  }), N = w.filter(
    (_) => _.status === "normal" && _.power !== null
  ).map((_) => _.power ?? 0), T = N.length > 0 ? Math.max(...N) : 0;
  let m = 0, b = 0, k = 0, I = 0, R = 0, H = 0, G = 0, f, x = !1;
  const j = w.filter((_) => _.status === "normal" && _.power !== null).flatMap((_) => {
    const A = _.config.rated_power_w ?? i.default_panel_rated_power_w ?? null;
    if (A === null || A <= 0 || !_.config.power_entity)
      return [];
    const L = Math.min(
      Math.max(_.config.deviation_derate_percent ?? 100, 1),
      100
    ), V = A * (L / 100);
    if (V <= 0)
      return [];
    const X = oi(
      _.power,
      O[_.config.power_entity],
      a,
      C
    );
    return [
      {
        id: _.config.id,
        effectivePower: X.value,
        livePower: _.power,
        ratedPowerW: A,
        ratedForDeviationW: V,
        isDerated: L < 100,
        sampleCount: X.sampleCount,
        firstSampleTs: X.firstSampleTs
      }
    ];
  }), K = j.filter((_) => !_.isDerated), se = K.length > 0 ? Math.min(...K.map((_) => _.sampleCount)) : 0, be = K.length > 0 ? Math.min(
    ...K.map(
      (_) => _.firstSampleTs === null ? 0 : (a - _.firstSampleTs) / 6e4
    )
  ) : 0;
  h ? K.length < u ? f = r("state.reason.need_non_derated_panels", {
    count: u
  }) : se < y ? f = r("state.reason.collecting_samples", {
    current: se,
    required: y
  }) : be < S ? f = r("state.reason.warmup_progress", {
    current: Math.floor(be),
    required: S
  }) : x = !0 : f = r("state.reason.array_check_disabled");
  const Xe = K.map(
    (_) => te(_.effectivePower / _.ratedForDeviationW, 0, Ms)
  ), ue = si(Xe);
  x && Math.max(
    ...K.map(
      (A) => A.ratedForDeviationW * ue
    ),
    0
  ) < $ && (x = !1, f = r("state.reason.low_light_pause", {
    floor: $.toFixed(0)
  }));
  const ae = w.map((_) => {
    const A = (_.config.power_entity ? e?.states?.[_.config.power_entity]?.attributes?.unit_of_measurement : void 0) ?? r("state.power.default_unit"), L = _.config.energy_entity ? e?.states?.[_.config.energy_entity]?.attributes?.unit_of_measurement : void 0, V = !!_.config.energy_entity, X = _.config.show_energy ?? !1;
    let M = _.status, D = null;
    const z = _.config.rated_power_w ?? i.default_panel_rated_power_w ?? null, Q = z !== null && _.power !== null && z > 0 ? te(_.power / z * 100, 0, 999) : null;
    if (M === "normal" && z === null && (_.reason = r("state.reason.rated_not_configured")), x && M === "normal" && z !== null && _.power !== null) {
      const Qe = j.find(
        ($e) => $e.id === _.config.id
      );
      if (Qe) {
        const $e = Qe.ratedForDeviationW * ue, Ze = Math.max($e - Qe.effectivePower, 0), ht = $e > 0 ? Ze / $e * 100 : 0;
        ht >= P && Ze >= F ? (M = "deviation", D = te(ht, 0, 100), _.reason = r("state.reason.output_below_target", {
          percent: D.toFixed(0),
          shortfall: Ze.toFixed(0)
        })) : _.reason = r("state.reason.producing_adjusted");
      }
    } else M === "normal" && f && (_.reason = f);
    M === "error" && (k += 1), M === "inverter" && (b += 1), M === "deviation" && (m += 1), M === "offline" && (I += 1), M === "normal" && (R += 1), M === "unconfigured" && (H += 1), M === "disabled" && (G += 1);
    const Z = z !== null && z > 0 && _.power !== null ? _.power / z : null, J = _.power !== null && T > 0 ? _.power / T : 0, _e = te(Z ?? J, 0, 1), Oe = te((p - 0.2) / 1.4, 0, 1), He = te(
      (0.1 + Oe * 0.9) * (0.15 + _e * 0.85),
      0.06,
      1
    ), Ls = M === "deviation" || M === "error" || M === "inverter" ? 1 : He, Ds = M === "normal" && _.power !== null && _.power <= 0, Os = M === "error" || M === "inverter" ? n.error : Ds || M === "offline" || M === "unconfigured" || M === "disabled" ? n.unavailable : M === "deviation" ? n.deviation : ti(
      n.production_start,
      n.production_mid,
      n.production_end,
      _e
    );
    return {
      id: _.config.id,
      slotIndex: _.slotIndex,
      label: _.label,
      status: M,
      power: _.power,
      powerDisplay: M === "disabled" ? r("state.status_display.disabled") : M === "unconfigured" ? r("state.status_display.not_configured") : Nt(
        _.power,
        A,
        i.power_decimals ?? 0,
        o,
        s
      ),
      energy: _.energy,
      energyDisplay: _.hiddenSlot || !V || !X ? void 0 : _.energy !== null ? Nt(
        _.energy,
        L ?? r("state.energy.default_unit"),
        i.energy_decimals ?? 2,
        o,
        s
      ) : o,
      powerEntityName: _.powerEntityName,
      inverterStatusEntityName: _.inverterStatusEntityName,
      inverterStatusDisplay: _.inverterStatusDisplay,
      inverterFaultMatched: _.inverterFaultMatched,
      inverterWorkingMatched: _.inverterWorkingMatched,
      deviationPercent: D,
      reason: _.reason,
      accentColor: Os,
      intensity: Ls,
      enabled: _.enabled,
      hiddenSlot: _.hiddenSlot,
      ratedPowerW: z,
      performancePercent: Q
    };
  }), we = ae.reduce((_, A) => _ + (A.power ?? 0), 0), xe = ae.map((_) => _.energy).filter((_) => _ !== null), De = xe.length > 0 ? xe.reduce((_, A) => _ + A, 0) : null;
  return {
    panels: ae,
    totalPower: we,
    totalEnergy: De,
    maxPower: T,
    deviationCount: m,
    inverterCount: b,
    errorCount: k,
    offlineCount: I,
    normalCount: R,
    unconfiguredCount: H,
    disabledCount: G,
    deviationReady: x,
    deviationSuppressedReason: f
  };
}, Ot = (i, e = 0) => Math.max(36, i - 36 - Math.max(0, e)), ai = ({
  candidates: i,
  panelWidthPx: e,
  panelHeightPx: t,
  fontPx: s,
  reservedRightPx: r = 0,
  measureTextWidthPx: o
}) => {
  const a = i.find((p) => p.variant === "compact");
  if (!a)
    throw new Error("Panel performance label requires a compact candidate.");
  if (t < 96 || e < 112)
    return a;
  const n = i.find((p) => p.variant === "full"), l = Ot(e, r);
  if (n && o(n.text, s) <= l)
    return n;
  const d = Ot(e), c = i.find((p) => p.variant === "medium");
  return c && o(c.text, s) <= d ? c : a;
}, Ts = (i) => Number.isFinite(i.ts) && Number.isFinite(i.value), ni = 1e-4, li = (i) => i === 1 ? 6e4 : i === 6 ? 3 * 6e4 : i === 24 ? 10 * 6e4 : 5 * 6e4, We = (i, e, t) => {
  const s = e - t * 60 * 60 * 1e3;
  return i.filter(Ts).filter((r) => r.ts >= s && r.ts <= e).sort((r, o) => r.ts - o.ts);
}, As = (i, e) => {
  if (i.length < 2)
    return [...i].sort((c, p) => c.ts - p.ts);
  const t = e?.zeroTolerance ?? ni, s = [...i].filter(Ts).sort((c, p) => c.ts - p.ts);
  if (s.length < 2)
    return s;
  const r = s.slice(1).map((c, p) => c.ts - s[p].ts).filter((c) => Number.isFinite(c) && c > 0).sort((c, p) => c - p), o = r.length > 0 ? r[Math.floor(r.length / 2)] : Number.NaN, a = li(e?.rangeHours), n = Math.min(
    Math.max(
      Number.isFinite(e?.stepMs) ? e?.stepMs : Number.isFinite(o) ? o : a,
      3e4
    ),
    a * 2
  ), l = n * 2, d = [s[0]];
  for (let c = 1; c < s.length; c += 1) {
    const p = s[c - 1], h = s[c], u = h.ts - p.ts, y = Math.abs(p.value) <= t, S = h.value > t;
    if (y && S && u >= l) {
      const C = Math.max(p.ts + 1, h.ts - n);
      C > p.ts && C < h.ts && d.push({ ts: C, value: 0 });
    }
    d.push(h);
  }
  return d.filter(
    (c, p, h) => p === 0 ? !0 : c.ts !== h[p - 1].ts || c.value !== h[p - 1].value
  );
}, ot = (i, e) => {
  if (i.length <= e || e <= 2)
    return [...i];
  const t = i[0], s = i[i.length - 1], r = i.slice(1, i.length - 1), o = e - 2, a = r.length / o, n = [t];
  let l = -1;
  for (let d = 0; d < o; d += 1) {
    const c = Math.min(
      r.length - 1,
      Math.floor(d * a)
    );
    c !== l && (l = c, n.push(r[c]));
  }
  return n.push(s), n.sort((d, c) => d.ts - c.ts).filter(
    (d, c, p) => c === 0 ? !0 : d.ts !== p[c - 1].ts || d.value !== p[c - 1].value
  ).slice(0, e);
}, Ht = (i) => Number.isFinite(i.ts) && Number.isFinite(i.value), pi = (i) => i.map(
  (e, t) => `${t === 0 ? "M" : "L"}${e.x.toFixed(2)},${e.y.toFixed(2)}`
).join(" "), ci = (i, e, t, s, r = 320, o = 132, a = 10) => {
  const n = t * 60 * 60 * 1e3, l = e - n, d = e, c = Math.max(d - l, 1), p = Math.max(r - a * 2, 1), h = Math.max(o - a * 2, 1), u = i.map((w) => {
    const E = We(w.samples, e, t).filter(Ht), N = E.length === 1 ? [
      { ts: l, value: E[0].value },
      { ts: d, value: E[0].value }
    ] : E, T = As(N, { rangeHours: t }), m = ot(T, s).filter(Ht), b = m.map((k) => k.value);
    return {
      id: w.id,
      samples: m,
      sampleCount: m.length,
      firstTs: m.length > 0 ? m[0].ts : null,
      lastTs: m.length > 0 ? m[m.length - 1].ts : null,
      minValue: b.length > 0 ? Math.min(...b) : null,
      maxValue: b.length > 0 ? Math.max(...b) : null
    };
  }), y = u.flatMap((w) => w.samples.map((E) => E.value)), S = y.length > 0;
  let C = 0, $ = 1;
  S && (C = Math.min(...y), $ = Math.max(...y), C === $ && (C -= 1, $ += 1));
  const P = Math.max($ - C, 1), F = u.map((w) => {
    const E = w.samples.map((T) => {
      const m = (T.ts - l) / c, b = a + Math.min(Math.max(m, 0), 1) * p, k = o - a - (T.value - C) / P * h;
      return !Number.isFinite(b) || !Number.isFinite(k) ? null : { x: b, y: k };
    }).filter((T) => T !== null), N = E.length >= 2 ? pi(E) : "";
    return {
      id: w.id,
      samples: w.samples,
      points: E,
      linePath: N,
      firstPoint: E.length > 0 ? E[0] : null,
      lastPoint: E.length > 0 ? E[E.length - 1] : null,
      sampleCount: w.sampleCount,
      pointsCount: E.length,
      firstTs: w.firstTs,
      lastTs: w.lastTs,
      minValue: w.minValue,
      maxValue: w.maxValue
    };
  }), O = F.filter((w) => w.pointsCount > 0).length;
  return {
    startTs: l,
    endTs: d,
    hasData: S,
    drawableCount: O,
    series: F
  };
}, Ee = (i, e, t, s, r = "en") => {
  if (i === null)
    return s;
  const o = Object.is(i, -0) ? 0 : i;
  return `${new Intl.NumberFormat(r, {
    minimumFractionDigits: e,
    maximumFractionDigits: e
  }).format(o)} ${t}`;
}, ee = (i) => Object.is(i, -0) ? 0 : i, di = (i) => {
  if (!i)
    return;
  const e = i.replace(/[\u200B-\u200D\uFEFF]/g, "").replace(/\s+/g, " ").trim();
  return e.length > 0 ? e : void 0;
}, zt = 1, hi = "spv:history:", ui = "spv-card-config-updated", _i = 6e4, Gt = [1, 6, 24], tt = 150, mi = 45e3, fi = 45e3, gi = 64, yi = /* @__PURE__ */ new Set(["unknown", "unavailable", "none", "null", ""]), Bt = [
  "#8ed072",
  "#6fc9ff",
  "#ffbf66",
  "#b391ff",
  "#4de3c1",
  "#ff8fb3",
  "#ffd56a",
  "#84a8ff",
  "#7be56e",
  "#f58cff"
], st = (i, e = "Unknown recorder error") => {
  if (i instanceof Error && i.message.trim().length > 0)
    return i.message.trim();
  if (typeof i == "string" && i.trim().length > 0)
    return i.trim();
  if (typeof i == "object" && i !== null) {
    const t = i;
    if (typeof t.message == "string" && t.message.trim().length > 0)
      return t.message.trim();
    if (typeof t.error == "string" && t.error.trim().length > 0)
      return t.error.trim();
    if (typeof t.body?.message == "string" && t.body.message.trim().length > 0)
      return t.body.message.trim();
  }
  return e;
}, rt = (i, e = 120) => i.length <= e ? i : `${i.slice(0, e - 1)}…`, ce = class ce extends ge {
  constructor() {
    super(...arguments), this._cardWidth = 0, this._selectedPanelId = null, this._showLivePowerPopup = !1, this._showEnergyPopup = !1, this._showCustomKpiPopup = !1, this._showSystemHealthPopup = !1, this._dragSourceSlotIndex = null, this._historyByEntityId = {}, this._historyState = "idle", this._historySignature = "", this._historyQuerySignature = "", this._historyLastLoadMs = 0, this._historyLoadToken = 0, this._popupGraphRangeHours = 6, this._popupGraphCache = {}, this._popupGraphRequestToken = 0, this._popupGraphLatestTokenByKey = {}, this._kpiCompareExpanded = {
      power: !1,
      energy: !1
    }, this._kpiCompareRangeHours = {
      power: 6,
      energy: 6
    }, this._kpiCompareCache = {}, this._kpiCompareRequestToken = 0, this._kpiCompareLatestTokenByKey = {}, this._persistConfigToken = 0, this._popupScrollRestoreToken = 0, this._popupScrollRestore = null, this._motionEngine = new Hr(() => this.requestUpdate()), this._motionOverlayModel = null, this._motionOverlaySignature = "", this._overlayMeasureFrame = null, this._panelDetailOverflowFrame = null, this._activePulseColor = "rgba(111, 201, 255, 0.72)", this._onMotionAnimationEnd = (e) => {
      const t = e;
      if (t.animationName !== "spv-flow-pulse")
        return;
      const s = t.target;
      s instanceof SVGPathElement && s.classList.contains("spv-motion-flow") && (this._hasPopupOpen() || this._motionEngine.completeFlowPulse());
    }, this._handlePanelDetailScroll = (e) => {
      const t = e.currentTarget;
      if (!t)
        return;
      const s = this._getPanelDetailMaxScrollTop(t);
      t.scrollTop > s && (t.scrollTop = s);
    }, this._enableForecastOverlayFromPopup = () => {
      if (!this._config || this._isForecastOverlayEnabled())
        return;
      const e = this._getForecastEntityId("power"), t = this._getForecastEntityId("energy");
      if (this._commitConfigFromCard(
        Fe({
          ...this._config,
          enable_forecast_overlay: !0
        })
      ), this._showLivePowerPopup && e) {
        const s = this._getSystemPowerEntityId();
        s && (this._ensurePopupGraphLoadedByEntity(s, this._popupGraphRangeHours), this._ensurePopupGraphLoadedByEntity(
          e,
          this._popupGraphRangeHours
        ));
      }
      if (this._showEnergyPopup && t) {
        const s = this._getSystemEnergyEntityId();
        s && (this._ensurePopupGraphLoadedByEntity(
          s,
          this._popupGraphRangeHours
        ), this._ensurePopupGraphLoadedByEntity(
          t,
          this._popupGraphRangeHours
        ));
      }
    }, this._closeDialog = () => {
      this._closeAllPopups(), this._kpiCompareExpanded = { power: !1, energy: !1 }, this._kpiCompareRangeHours = { power: 6, energy: 6 };
    }, this._openLivePowerPopup = () => {
      this._selectedPanelId = null;
      const e = this._getSystemPowerEntityId(), t = !e;
      if (this._kpiCompareExpanded = { power: t, energy: !1 }, this._kpiCompareRangeHours = { power: 6, energy: 6 }, this._showLivePowerPopup = !0, this._showEnergyPopup = !1, this._showCustomKpiPopup = !1, this._showSystemHealthPopup = !1, this._popupGraphRangeHours = 6, e) {
        if (this._ensurePopupGraphLoadedByEntity(e, 6), this._isForecastOverlayEnabled()) {
          const s = this._getForecastEntityId("power");
          s && this._ensurePopupGraphLoadedByEntity(s, 6);
        }
      } else {
        const s = this._derived ?? (this._config && this.hass ? ze(this._config, this.hass) : null);
        s && this._ensurePanelCompareLoaded(s, "power", this._kpiCompareRangeHours.power);
      }
    }, this._closeLivePowerPopup = () => {
      this._closeAllPopups();
    }, this._openEnergyPopup = () => {
      this._selectedPanelId = null;
      const e = this._getSystemEnergyEntityId(), t = !e;
      if (this._kpiCompareExpanded = { power: !1, energy: t }, this._kpiCompareRangeHours = { power: 6, energy: 6 }, this._showEnergyPopup = !0, this._showLivePowerPopup = !1, this._showCustomKpiPopup = !1, this._showSystemHealthPopup = !1, this._popupGraphRangeHours = 6, e) {
        if (this._ensurePopupGraphLoadedByEntity(e, 6), this._isForecastOverlayEnabled()) {
          const s = this._getForecastEntityId("energy");
          s && this._ensurePopupGraphLoadedByEntity(s, 6);
        }
      } else {
        const s = this._derived ?? (this._config && this.hass ? ze(this._config, this.hass) : null);
        s && this._ensurePanelCompareLoaded(s, "energy", this._kpiCompareRangeHours.energy);
      }
    }, this._closeEnergyPopup = () => {
      this._closeAllPopups();
    }, this._openCustomKpiPopup = () => {
      this._selectedPanelId = null, this._kpiCompareExpanded = { power: !1, energy: !1 }, this._kpiCompareRangeHours = { power: 6, energy: 6 }, this._showCustomKpiPopup = !0, this._showLivePowerPopup = !1, this._showEnergyPopup = !1, this._showSystemHealthPopup = !1, this._popupGraphRangeHours = 6;
      const e = this._getCustomKpiEntityId();
      e && this._ensurePopupGraphLoadedByEntity(e, 6);
    }, this._closeCustomKpiPopup = () => {
      this._closeAllPopups();
    }, this._openSystemHealthPopup = () => {
      this._showSystemHealthPopup = !0, this._showLivePowerPopup = !1, this._showEnergyPopup = !1, this._showCustomKpiPopup = !1, this._selectedPanelId = null, this._kpiCompareExpanded = { power: !1, energy: !1 }, this._kpiCompareRangeHours = { power: 6, energy: 6 };
    }, this._closeSystemHealthPopup = () => {
      this._closeAllPopups();
    }, this._preventRangeChipFocusScroll = (e) => {
      e.preventDefault();
    }, this._handleDragOver = (e) => {
      e.preventDefault(), e.dataTransfer && (e.dataTransfer.dropEffect = "move");
    }, this._handleDragEnd = () => {
      this._dragSourceSlotIndex = null;
    };
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => Ci), document.createElement("solar-panel-visualizer-card-editor");
  }
  static getStubConfig() {
    return js();
  }
  _normalizeCardConfig(e) {
    return Fe(e);
  }
  _renderCardOverlay(e) {
    const t = this._getCurrentConfig(), s = this._motionEngine.getState();
    return Qr(this._motionOverlayModel, {
      showTopology: !!(t?.motion_enabled ?? !0) && !!(t?.motion_power_flow ?? !0),
      showFlow: s.powerFlowActive,
      activeFlowPanelId: s.flowPulsePanelId,
      powerImpactActive: s.kpiShimmers.has("power")
    });
  }
  _afterBaseUpdated(e) {
    const t = this._getCurrentConfig(), s = this._getCurrentDerived();
    if (!t || !s)
      return;
    const r = (t.motion_enabled ?? !0) && (t.motion_power_flow ?? !0);
    this.toggleAttribute("data-spv-busbars", r), this._motionEngine.update(this._buildMotionFlags(t), this._buildMotionSnapshot(s)), this._syncActivePulseColor(s), this._scheduleOverlayMeasure();
  }
  _getPanelExtraClass(e) {
    const t = [];
    return this._motionEngine.getState().alertRipples.has(e.id) && t.push("spv-motion-alert-ripple"), t.join(" ");
  }
  _getSummaryExtraClass(e) {
    return e === "alerts" || e === "custom" || !this._motionEngine.getState().kpiShimmers.has(e) ? "" : e === "power" ? "spv-motion-power-impact" : "spv-motion-neutral-impact";
  }
  _getSummaryExtraStyle(e) {
    return e !== "power" ? "" : `--spv-shimmer-color:${this._activePulseColor};`;
  }
  _getCurrentConfig() {
    return this._config;
  }
  _getCurrentDerived() {
    return this._derived;
  }
  _hasPopupOpen() {
    return !!(this._selectedPanelId || this._showLivePowerPopup || this._showEnergyPopup || this._showCustomKpiPopup || this._showSystemHealthPopup);
  }
  _t(e, t) {
    return xs(this.hass, e, t);
  }
  _buildMotionFlags(e) {
    return {
      enabled: e.motion_enabled ?? !0,
      powerFlow: e.motion_power_flow ?? !0,
      updateShimmer: e.motion_update_shimmer ?? !0,
      alertRipple: e.motion_alert_ripple ?? !0
    };
  }
  _buildMotionSnapshot(e) {
    const t = {}, s = {};
    for (const r of e.panels)
      t[r.id] = r.power, s[r.id] = r.status;
    return {
      totalPower: e.totalPower,
      popupOpen: this._hasPopupOpen(),
      powerKpiValue: this._resolveSummaryPower(e).value?.toString() ?? this._t("state.unavailable"),
      energyKpiValue: this._resolveSummaryEnergy(e).value?.toString() ?? this._t("state.unavailable"),
      panelPowers: t,
      panelStatuses: s
    };
  }
  _scheduleOverlayMeasure() {
    this._overlayMeasureFrame !== null || typeof window > "u" || (this._overlayMeasureFrame = window.requestAnimationFrame(() => {
      this._overlayMeasureFrame = null, this._measureOverlay();
    }));
  }
  _syncActivePulseColor(e) {
    const t = this._motionEngine.getState().flowPulsePanelId, s = e.panels.find((r) => r.id === t);
    s?.accentColor && (this._activePulseColor = s.accentColor);
  }
  _measureOverlay() {
    const e = this._getCurrentConfig(), t = this._getCurrentDerived(), s = this.shadowRoot;
    if (!e || !t || !s)
      return;
    const r = Xr(this, s, e, t), o = JSON.stringify(r);
    o !== this._motionOverlaySignature && (this._motionOverlayModel = r, this._motionOverlaySignature = o, this.requestUpdate());
  }
  _startOverlayResizeObserver() {
    typeof ResizeObserver > "u" || (this._overlayResizeObserver?.disconnect(), this._overlayResizeObserver = new ResizeObserver(() => this._scheduleOverlayMeasure()), this._overlayResizeObserver.observe(this));
  }
  _resolveDefaultTitle(e) {
    return !e || e.trim().length === 0 ? this._t("card.default_title") : e === "Solar Array" ? this._t("card.default_title") : e;
  }
  _resolveCustomKpiTitle(e) {
    return e === "Custom KPI" ? this._t("card.summary.custom_default_title") : e;
  }
  _panelStatusLabel(e) {
    return this._t(`card.panel.status.${e}`);
  }
  connectedCallback() {
    super.connectedCallback(), this._startResizeObserver(), this._startOverlayResizeObserver();
  }
  disconnectedCallback() {
    this._overlayMeasureFrame !== null && typeof window < "u" && (window.cancelAnimationFrame(this._overlayMeasureFrame), this._overlayMeasureFrame = null), this._panelDetailOverflowFrame !== null && typeof window < "u" && (window.cancelAnimationFrame(this._panelDetailOverflowFrame), this._panelDetailOverflowFrame = null), this._overlayResizeObserver?.disconnect(), this._overlayResizeObserver = void 0, this.renderRoot.removeEventListener("animationend", this._onMotionAnimationEnd, !0), this._clearPopupScrollRestore(), this._motionEngine.destroy(), this._resizeObserver?.disconnect(), this._resizeObserver = void 0, super.disconnectedCallback();
  }
  firstUpdated(e) {
    super.firstUpdated(e), this.renderRoot.addEventListener("animationend", this._onMotionAnimationEnd, !0);
  }
  setConfig(e) {
    const t = Ys(e);
    if (t.length > 0)
      throw new Error(t.join(" "));
    const s = this._normalizeCardConfig(e), r = this._config !== void 0 && this._configsEqual(this._config, s);
    this._sourceConfigRef = e, this._config = s, r || (this._historySignature = "", this._historyQuerySignature = "", this._historyLastLoadMs = 0, this._historyLoadToken = 0, this._popupGraphRangeHours = 6, this._popupGraphCache = {}, this._popupGraphLatestTokenByKey = {}, this._kpiCompareExpanded = { power: !1, energy: !1 }, this._kpiCompareRangeHours = { power: 6, energy: 6 }, this._kpiCompareCache = {}, this._kpiCompareLatestTokenByKey = {}, this._showLivePowerPopup = !1, this._showEnergyPopup = !1, this._showCustomKpiPopup = !1, this._showSystemHealthPopup = !1, this._selectedPanelId = null), this._refreshDerived(), this._ensureHistoryLoaded();
  }
  _configsEqual(e, t) {
    return JSON.stringify(e) === JSON.stringify(t);
  }
  getCardSize() {
    const e = this._config?.panels.length ?? 6, t = this._config?.columns ?? 3, s = this._computeRenderedColumns(
      t,
      this._config?.max_card_width_px
    ), r = this._computeRenderedRows(e, s), o = this._computePanelHeightPx(
      r,
      this._config?.max_card_height_px,
      s,
      this._config?.max_card_width_px
    ), a = 220 + r * o + Math.max(0, r - 1) * 10, n = this._config?.max_card_height_px ? Math.min(a, this._config.max_card_height_px) : a;
    return Math.max(5, Math.ceil(n / 50));
  }
  updated(e) {
    e.has("hass") && (this._syncLiveSamplesFromHass(), this._ensureHistoryLoaded(), this._refreshDerived()), this._derived && (this._showLivePowerPopup && this._kpiCompareExpanded.power && this._ensurePanelCompareLoaded(
      this._derived,
      "power",
      this._kpiCompareRangeHours.power
    ), this._showEnergyPopup && this._kpiCompareExpanded.energy && this._ensurePanelCompareLoaded(
      this._derived,
      "energy",
      this._kpiCompareRangeHours.energy
    )), this._afterBaseUpdated(e), this._schedulePanelDetailOverflowSync();
  }
  _schedulePanelDetailOverflowSync() {
    this._panelDetailOverflowFrame !== null || typeof window > "u" || (this._panelDetailOverflowFrame = window.requestAnimationFrame(() => {
      this._panelDetailOverflowFrame = null, this._syncPanelDetailOverflow();
    }));
  }
  _syncPanelDetailOverflow() {
    this.renderRoot.querySelectorAll(".panel-detail-scroll").forEach((t) => {
      const s = t.closest(".panel");
      if (!s)
        return;
      if (s.classList.contains("hidden-slot") || t.childElementCount === 0) {
        s.classList.remove("has-detail-overflow"), t.scrollTop = 0;
        return;
      }
      const r = t.scrollTop;
      s.classList.remove("has-detail-overflow"), this._syncPerformanceLabelFit(t);
      const o = t.scrollHeight > t.clientHeight + 1;
      if (s.classList.toggle("has-detail-overflow", o), o) {
        this._syncPerformanceLabelFit(t);
        const a = this._getPanelDetailMaxScrollTop(t);
        t.scrollTop = Math.min(r, a);
      } else
        t.scrollTop = 0;
    });
  }
  _getPanelDetailMaxScrollTop(e) {
    const t = Math.max(0, e.scrollHeight - e.clientHeight), s = Array.from(e.children).filter(
      (o) => o instanceof HTMLElement && o.offsetParent !== null && o.offsetHeight > 0
    ), r = s[s.length - 1];
    return r ? Math.min(t, Math.max(0, r.offsetTop)) : t;
  }
  _syncPerformanceLabelFit(e) {
    const t = e.querySelector(".performance");
    if (!t)
      return;
    const s = t.dataset.performanceFull, r = t.dataset.performanceMedium, o = t.dataset.performanceCompact, a = [s, r, o].filter(
      (d) => !!d
    );
    if (a.length === 0)
      return;
    const n = t.textContent?.trim(), l = Math.max(
      0,
      a.findIndex((d) => d === n)
    );
    for (const d of a.slice(l))
      if (t.textContent = d, t.scrollWidth <= t.clientWidth + 1)
        return;
    t.textContent = a[a.length - 1];
  }
  render() {
    if (!this._config)
      return v;
    const e = this._derived ?? ze(this._config, this.hass), t = this.hass?.locale?.language ?? "en", s = this._t("common.unavailable"), r = this._t("common.not_configured"), o = this._resolveDefaultTitle(this._config.title), a = this._resolveThemeMode(), n = this._resolveSummaryPower(e), l = this._resolveSummaryEnergy(e), d = this._resolveCustomKpi(), c = this._isSummaryEnergyConfigured(), p = this._config.show_custom_kpi ?? !0, h = this._computeRenderedColumns(
      this._config.columns,
      this._config.max_card_width_px
    ), u = this._computeRenderedRows(
      this._config.panels.length,
      h
    ), y = this._computePanelHeightPx(
      u,
      this._config.max_card_height_px,
      h,
      this._config.max_card_width_px
    ), S = this._computePanelWidthPx(
      h,
      this._config.max_card_width_px
    ), C = this._computePanelScale(y), $ = this._getPanelWidthCapPx(), P = $ !== null ? `grid-template-columns: repeat(${h}, minmax(0, ${$}px)); justify-content: center;` : `grid-template-columns: repeat(${h}, minmax(0, 1fr));`, F = this._config.deviation_history_hours ?? 12, O = `--spv-max-width:${this._config.max_card_width_px ?? 980}px; ${this._config.max_card_height_px ? `--spv-max-height:${this._config.max_card_height_px}px;` : "--spv-max-height:none;"} --spv-panel-height:${y}px; --spv-panel-scale:${C}; --spv-panel-max-width:${$ ? `${$}px` : "100%"};`, w = this._buildSystemHealthState(e), E = e.inverterCount + e.errorCount + e.offlineCount + e.deviationCount, N = this._motionOverlayModel ? `width:${this._motionOverlayModel.width}px; height:${this._motionOverlayModel.height}px;` : "", T = (this._config.enable_array_checks ?? !1) && this._historyState === "loading" ? this._t("card.subtitle.loading_history", { hours: F }) : e.deviationReady ? e.deviationCount > 0 ? this._t("card.subtitle.deviation_detected", {
      count: e.deviationCount,
      suffix: e.deviationCount === 1 ? "" : "s"
    }) : this._t("card.subtitle.tap_diagnostics") : this._historyStateReason ?? e.deviationSuppressedReason ?? this._t("card.subtitle.warmup"), m = e.panels.find(
      (b) => b.id === this._selectedPanelId
    );
    return g`
      <ha-card style=${O} data-spv-theme=${a}>
        <div class="chrome"></div>
        <div class="spv-overlay-anchor" style=${N}>
          ${this._renderCardOverlay(e)}
        </div>
        <div class="header">
          <div class="header-copy">
            <div class="topline">
              <span class="eyebrow">${this._t("card.eyebrow")}</span>
              <button
                class="system-health"
                type="button"
                style=${`--health-color:${w.color};`}
                @click=${this._openSystemHealthPopup}
              >
                ${w.label}
              </button>
            </div>
            <h1 class="title">${o}</h1>
            <p class="subtitle">${T}</p>
            <p class="subtitle subtitle-hint">${this._t("card.subtitle.drag_hint")}</p>
          </div>
          <div class="summary ${p ? "with-custom" : "without-custom"}">
            <button
              class="summary-chip summary-button ${this._getSummaryExtraClass("power")}"
              style=${this._getSummaryExtraStyle("power")}
              type="button"
              data-kpi="power"
              @click=${this._openLivePowerPopup}
            >
              <span class="summary-label">${this._t("card.summary.power")}</span>
              <span class="summary-value">
                ${Ee(
      n.value,
      this._config.power_decimals ?? 0,
      n.unit,
      s,
      t
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
                ${c ? Ee(
      l.value,
      this._config.energy_decimals ?? 2,
      l.unit,
      s,
      t
    ) : r}
              </span>
            </button>
            <div
              class="summary-chip alerts-chip ${this._getSummaryExtraClass("alerts")}"
              style=${this._getSummaryExtraStyle("alerts")}
              data-kpi="alerts"
            >
              <span class="summary-label">${this._t("card.summary.alerts")}</span>
              <span class="summary-value">
                ${E}
              </span>
            </div>
            ${p ? g`
                  <button
                    class="summary-chip summary-button ${this._getSummaryExtraClass("custom")}"
                    style=${this._getSummaryExtraStyle("custom")}
                    type="button"
                    data-kpi="custom"
                    @click=${this._openCustomKpiPopup}
                  >
                    <span class="summary-label">${this._resolveCustomKpiTitle(d.title)}</span>
                    <span class="summary-value custom-kpi-value">${d.value}</span>
                  </button>
                ` : v}
          </div>
        </div>

        <div
          class="grid"
          style=${P}
        >
          ${e.panels.map((b) => this._renderPanel(b, y, S))}
        </div>

        ${this._showLivePowerPopup ? this._renderLivePowerDialog(e) : v}
        ${this._showEnergyPopup ? this._renderEnergyDialog(e) : v}
        ${this._showCustomKpiPopup ? this._renderCustomKpiDialog() : v}
        ${this._showSystemHealthPopup ? this._renderSystemHealthDialog(e) : v}
        ${m ? this._renderPanelDialog(m) : v}
      </ha-card>
    `;
  }
  _refreshDerived() {
    if (!this._config) {
      this._derived = void 0;
      return;
    }
    this._derived = ze(this._config, this.hass, {
      deviationEnabled: this._config.enable_array_checks ?? !1,
      historyByEntityId: this._historyByEntityId,
      nowMs: Date.now()
    });
  }
  _formatSlotLabel(e) {
    const t = this._config?.columns ?? 1, s = Math.floor(e / t) + 1, r = e % t + 1;
    return this._t("card.panel.slot_label", { row: s, column: r });
  }
  _renderPanel(e, t, s) {
    const r = this._shouldShowPerformance(e, t, s), o = this._getPanelExtraClass(e), a = di(e.inverterStatusDisplay), n = this._formatInverterTileSummary(e, a), l = Math.max(0, Math.min(e.intensity, 1)), d = Math.round(24 + l * 62), c = Math.round(6 + l * 24), p = Math.round(4 + l * 18), h = [
      `--panel-accent:${e.accentColor}`,
      `--panel-intensity:${l.toFixed(3)}`,
      `--panel-border-accent:color-mix(in srgb, ${e.accentColor} ${d}%, var(--spv-panel-accent-mix-base))`,
      `--panel-fill-accent:color-mix(in srgb, ${e.accentColor} ${c}%, transparent)`,
      `--panel-glow-accent:color-mix(in srgb, ${e.accentColor} ${p}%, transparent)`
    ].join("; "), u = r ? this._buildPanelPerformanceLabelCandidates(e) : null;
    return e.hiddenSlot ? g`
        <button
          class="panel hidden-slot ${o}"
          type="button"
          data-panel-id=${e.id}
          data-slot-index=${String(e.slotIndex)}
          draggable="true"
          @dragstart=${(y) => this._handleDragStart(y, e.slotIndex)}
          @dragover=${this._handleDragOver}
          @drop=${(y) => this._handleDrop(y, e.slotIndex)}
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
          <span class="slot">${this._formatSlotLabel(e.slotIndex)}</span>
        </button>
      ` : g`
      <button
        class="panel ${e.status} ${r ? "has-performance" : ""} ${o}"
        type="button"
        style=${h}
        data-panel-id=${e.id}
        data-slot-index=${String(e.slotIndex)}
        draggable="true"
        @dragstart=${(y) => this._handleDragStart(y, e.slotIndex)}
        @dragover=${this._handleDragOver}
        @drop=${(y) => this._handleDrop(y, e.slotIndex)}
        @dragend=${this._handleDragEnd}
        @click=${() => this._handlePanelClick(e)}
      >
        <span class="status">${this._panelStatusLabel(e.status)}</span>
        <div class="panel-primary">
          <p class="panel-name" title=${e.label}>${e.label}</p>
          <p class="power">${e.powerDisplay}</p>
        </div>
        <div class="panel-detail-scroll" @scroll=${this._handlePanelDetailScroll}>
          ${r ? g`<p
                class="performance"
                data-performance-full=${u?.[0]?.text ?? ""}
                data-performance-medium=${u?.[1]?.text ?? ""}
                data-performance-compact=${u?.[2]?.text ?? ""}
              >
                ${this._formatPanelPerformanceText(
      e,
      s,
      t,
      u
    )}
              </p>` : v}
          ${e.energyDisplay ? g`<p class="energy">${e.energyDisplay}</p>` : v}
          ${(this._config?.show_inverter_status_on_tiles ?? !1) && n ? g`<p class="inverter-status">${n}</p>` : v}
        </div>
        <span class="slot">${this._formatSlotLabel(e.slotIndex)}</span>
      </button>
    `;
  }
  _renderPopupCloseButton(e, t) {
    return g`
      <div class="spv-popup-close-anchor">
        <button
          class="spv-popup-close"
          type="button"
          @click=${(s) => this._handlePopupCloseClick(s, e)}
          aria-label=${t}
        >
          ×
        </button>
      </div>
    `;
  }
  _formatInverterTileSummary(e, t) {
    if (t)
      return e.status === "deviation" ? this._t("card.panel.inverter_short.deviation") : e.status === "error" || e.status === "inverter" || e.status === "offline" ? this._t("card.panel.inverter_short.error") : e.inverterWorkingMatched ? this._t("card.panel.inverter_short.ok") : this._t("card.panel.inverter_prefix", {
        status: t
      });
  }
  _renderPanelDialog(e) {
    const s = this._getPanelConfig(e.id)?.energy_entity ? e.energyDisplay ?? this._t("common.unavailable") : this._t("common.not_configured");
    return e.status === "unconfigured" ? g`
        <div class="spv-popup-backdrop" @click=${this._closeDialog}>
          <div class="spv-popup" @click=${(r) => r.stopPropagation()}>
            ${this._renderPopupCloseButton(this._closeDialog, this._t("card.popup.close_detail"))}
            <div class="spv-popup-header">
              <div>
                <div class="eyebrow">${this._t("card.popup.panel_eyebrow", {
      slot: this._formatSlotLabel(e.slotIndex)
    })}</div>
                <h2 class="spv-popup-title">${e.label}</h2>
              </div>
            </div>
            ${this._renderInlinePanelConfig(e)}
            ${this._renderPanelTelemetrySection(e)}
          </div>
        </div>
      ` : g`
      <div class="spv-popup-backdrop" @click=${this._closeDialog}>
        <div class="spv-popup" @click=${(r) => r.stopPropagation()}>
          ${this._renderPopupCloseButton(this._closeDialog, this._t("card.popup.close_detail"))}
          <div class="spv-popup-header">
            <div>
              <div class="eyebrow">${this._t("card.popup.panel_eyebrow", {
      slot: this._formatSlotLabel(e.slotIndex)
    })}</div>
              <h2 class="spv-popup-title">${e.label}</h2>
            </div>
          </div>

          ${this._renderPopupGraph(e)}

          <div class="detail-grid">
            <div class="detail-card">
              <span class="detail-label">${this._t("card.popup.detail.status")}</span>
              <span class="detail-value">${this._panelStatusLabel(e.status)}</span>
            </div>
            <div class="detail-card">
              <span class="detail-label">${this._t("card.popup.detail.power")}</span>
              <span class="detail-value">${e.powerDisplay}</span>
            </div>
            <div class="detail-card">
              <span class="detail-label">${this._t("card.popup.detail.energy")}</span>
              <span class="detail-value">
                ${s}
              </span>
            </div>
            <div class="detail-card">
              <span class="detail-label">${this._t("card.popup.detail.deviation")}</span>
              <span class="detail-value">
                ${e.status === "inverter" ? this._t("card.popup.deviation.inverter_mismatch") : e.deviationPercent !== null ? this._t("card.popup.deviation.below_peers", {
      percent: e.deviationPercent.toFixed(0)
    }) : this._t("card.popup.deviation.within_range")}
              </span>
            </div>
            <div class="detail-card">
              <span class="detail-label">${this._t("card.popup.detail.rated_performance")}</span>
              <span class="detail-value">
                ${e.ratedPowerW !== null ? this._t("card.popup.rated_performance.format", {
      rated: e.ratedPowerW.toFixed(0),
      percent: e.performancePercent !== null ? `${e.performancePercent.toFixed(0)}%` : this._t("card.popup.rated_performance.na")
    }) : this._t("common.not_configured")}
              </span>
            </div>
          </div>

          <div class="detail-card detail-information">
            <span class="detail-label">${this._t("card.popup.detail.information")}</span>
            <div class="info-lines">
              <p class="info-line">${e.reason}</p>
              ${e.powerEntityName ? g`<p class="info-line">${this._t("card.popup.info.power_source", {
      value: e.powerEntityName
    })}</p>` : v}
              <p class="info-line">
                ${this._t("card.popup.info.current_inverter_status", {
      value: e.inverterStatusDisplay ?? this._t("common.not_configured")
    })}
              </p>
              <p class="info-line">
                ${this._t("card.popup.info.inverter_evaluation", {
      value: this._renderInverterEvaluation(e)
    })}
              </p>
              <p class="info-line">
                ${this._t("card.popup.info.inverter_source", {
      value: e.inverterStatusEntityName ?? this._t("common.not_configured")
    })}
              </p>
            </div>
          </div>
          ${this._renderPanelTelemetrySection(e)}

        </div>
      </div>
    `;
  }
  _renderPanelTelemetrySection(e) {
    const t = this._getPanelConfig(e.id);
    if (!t)
      return v;
    const s = this._getPanelTelemetryMetrics(t), r = s.filter((n) => !!n.entityId), o = s.filter((n) => !n.entityId), a = r.length > 0;
    return g`
      <section class="telemetry-section">
        <h3 class="telemetry-title">${this._t("card.popup.telemetry.title")}</h3>

        ${a ? g`
              <div class="telemetry-group">
                <h4 class="telemetry-title">${this._t("card.popup.telemetry.configured_title")}</h4>
                <div class="telemetry-grid">
                  ${r.map(
      (n) => g`
                      <div class="detail-card">
                        <span class="detail-label">${n.label}</span>
                        <span class="detail-value">
                          ${this._formatTelemetryMetricValue(n.entityId ?? "")}
                        </span>
                      </div>
                    `
    )}
                </div>
              </div>
            ` : v}

        ${o.length > 0 ? g`
              <div class="telemetry-group">
                <h4 class="telemetry-title">${this._t("card.popup.telemetry.unconfigured_title")}</h4>
                <p class="telemetry-empty">${this._t("card.popup.telemetry.setup_hint")}</p>
                <div class="telemetry-grid">
                  ${o.map(
      (n) => g`
                      <div class="detail-card">
                        <span class="detail-label">${n.label}</span>
                        <span class="detail-value">${this._t("common.not_configured")}</span>
                      </div>
                    `
    )}
                </div>
              </div>
            ` : a ? v : g`<p class="telemetry-empty">${this._t("card.popup.telemetry.setup_hint")}</p>`}
      </section>
    `;
  }
  _getPanelTelemetryMetrics(e) {
    const t = e.advanced_metrics ?? {};
    return [
      {
        label: this._t("card.popup.telemetry.label.inverter_status"),
        entityId: e.inverter_status_entity ?? e.error_entity
      },
      {
        label: this._t("card.popup.telemetry.label.inverter_ac_power"),
        entityId: t.inverter_ac_power_entity
      },
      {
        label: this._t("card.popup.telemetry.label.inverter_ac_voltage"),
        entityId: t.inverter_ac_voltage_entity
      },
      {
        label: this._t("card.popup.telemetry.label.inverter_ac_current"),
        entityId: t.inverter_ac_current_entity
      },
      {
        label: this._t("card.popup.telemetry.label.inverter_temp"),
        entityId: t.inverter_temp_entity
      },
      {
        label: this._t("card.popup.telemetry.label.panel_current"),
        entityId: t.panel_current_entity
      },
      {
        label: this._t("card.popup.telemetry.label.panel_voltage"),
        entityId: t.panel_voltage_entity
      },
      {
        label: this._t("card.popup.telemetry.label.panel_power"),
        entityId: t.panel_power_entity
      }
    ];
  }
  _formatTelemetryMetricValue(e) {
    const t = this.hass?.states?.[e];
    if (!t)
      return this._t("common.unavailable");
    const s = t.state?.toString().trim() ?? "", r = s.toLowerCase();
    if (r.length === 0 || yi.has(r))
      return this._t("common.unavailable");
    const o = Number(t.state), a = typeof t.attributes?.unit_of_measurement == "string" ? t.attributes.unit_of_measurement.trim() : "";
    if (Number.isFinite(o)) {
      const n = this.hass?.locale?.language ?? "en", l = Object.is(o, -0) ? 0 : o, d = Number.isInteger(l) ? 0 : 2, c = new Intl.NumberFormat(n, {
        minimumFractionDigits: 0,
        maximumFractionDigits: d
      }).format(l);
      return a ? `${c} ${a}` : c;
    }
    return a ? `${s} ${a}` : s;
  }
  _renderKpiCompareControls(e, t) {
    const s = this._kpiCompareExpanded[t], r = t === "power" ? this._t("card.popup.panel_compare.toggle_power") : this._t("card.popup.panel_compare.toggle_energy");
    return g`
      <div class="compare-toggle-row">
        <button
          class="inline-button"
          type="button"
          @click=${(o) => this._togglePanelCompareGraph(o, t, e)}
        >
          ${r}
        </button>
      </div>
      ${s ? this._renderPanelCompareGraph(e, t) : v}
    `;
  }
  _togglePanelCompareGraph(e, t, s) {
    const r = this._captureScrollPositionsForPopupGraph(e), o = !this._kpiCompareExpanded[t];
    this._kpiCompareExpanded = {
      ...this._kpiCompareExpanded,
      [t]: o
    }, this._scheduleCapturedScrollRestore(r), o && this._ensurePanelCompareLoaded(
      s,
      t,
      this._kpiCompareRangeHours[t],
      r
    );
  }
  _renderPanelCompareGraph(e, t) {
    const s = this._buildPanelCompareTargets(e, t), r = this._kpiCompareRangeHours[t];
    if (s.length === 0)
      return g`
        <p class="graph-state">
          ${t === "energy" ? this._t("card.popup.panel_compare.no_panels_energy") : this._t("card.popup.panel_compare.no_panels_power")}
        </p>
      `;
    const o = this._getPanelCompareSignature(t, s), a = this._getPanelCompareCacheKey(t, o, r), n = this._kpiCompareCache[a], l = n?.loading ?? !1, d = n?.error, c = s.map((f, x) => ({
      ...f,
      color: Bt[x % Bt.length],
      samples: this._adjustGraphSamplesForEntity(
        f.entityId,
        n?.samplesByPanelId[f.panelId] ?? []
      )
    })), p = ci(
      c.map((f) => ({
        id: f.panelId,
        samples: f.samples
      })),
      Date.now(),
      r,
      tt,
      320,
      132,
      10
    ), h = new Map(p.series.map((f) => [f.id, f])), u = p.series.some(
      (f) => f.sampleCount > 0 && (f.pointsCount === 0 || f.sampleCount > 1 && f.pointsCount < 2)
    ), y = p.hasData && p.drawableCount === 0, S = y || u, C = t === "energy" ? "kWh" : "W", $ = p.series.flatMap(
      (f) => f.samples.map((x) => x.value).filter((x) => Number.isFinite(x))
    ), P = $.length > 0 ? this._computeGraphStats(
      $.map((f, x) => ({
        ts: x,
        value: f
      }))
    ) : { min: null, max: null, median: null }, F = $.length > 0 ? Math.min(...$) : null, O = $.length > 0 ? Math.max(...$) : null, w = F === null || O === null ? null : F === O ? F - 1 : F, E = F === null || O === null ? null : F === O ? O + 1 : O, N = P.max !== null && w !== null && E !== null ? this._toGraphY(P.max, w, E, 132, 10) : null, T = P.median !== null && w !== null && E !== null ? this._toGraphY(P.median, w, E, 132, 10) : null, m = P.min !== null && w !== null && E !== null ? this._toGraphY(P.min, w, E, 132, 10) : null, b = P.max !== null ? this._t("card.popup.history.max", {
      value: this._formatGraphPower(P.max, C)
    }) : null, k = P.median !== null ? this._t("card.popup.history.median", {
      value: this._formatGraphPower(P.median, C)
    }) : null, I = P.min !== null ? this._t("card.popup.history.min", {
      value: this._formatGraphPower(P.min, C)
    }) : null, R = this._buildGraphHourTicks(
      {
        startTs: p.startTs,
        endTs: p.endTs
      },
      r
    ), H = this._buildGraphAxisTicks(R), G = t === "energy" ? this._t("card.popup.history.panel_compare_energy") : this._t("card.popup.history.panel_compare_power");
    return g`
      <div class="graph-section">
        <div class="graph-header">
          <span class="graph-title">${G}</span>
          <div class="range-chips">
            ${Gt.map(
      (f) => g`
                <button
                  class="range-chip ${this._kpiCompareRangeHours[t] === f ? "active" : ""}"
                  type="button"
                  @pointerdown=${this._preventRangeChipFocusScroll}
                  @mousedown=${this._preventRangeChipFocusScroll}
                  @click=${(x) => this._handlePanelCompareRangeChange(x, e, t, f)}
                >
                  ${f}h
                </button>
              `
    )}
          </div>
        </div>

        ${l ? g`<p class="graph-state">${this._t("card.popup.panel_compare.loading")}</p>` : d ? g`<p class="graph-state">${d}</p>` : p.hasData ? y ? g`<p class="graph-state">${this._t("card.popup.panel_compare.render_failure")}</p>` : g`
                  <div class="graph-box">
                    ${b ? g`<span class="graph-overlay graph-overlay-max">${b}</span>` : v}
                    ${k ? g`
                          <span class="graph-overlay graph-overlay-median">
                            ${k}
                          </span>
                        ` : v}
                    ${I ? g`<span class="graph-overlay graph-overlay-min">${I}</span>` : v}
                    <svg class="graph-svg" viewBox="0 0 320 132" preserveAspectRatio="none">
                      ${R.map(
      (f) => W`
                          <line
                            class="graph-hour-line"
                            x1=${f.x.toFixed(2)}
                            x2=${f.x.toFixed(2)}
                            y1="10"
                            y2="122"
                          ></line>
                        `
    )}
                      ${c.map((f) => {
      const x = h.get(f.panelId);
      return !x || x.pointsCount === 0 ? v : x.pointsCount >= 2 ? W`
                            <path
                              d=${x.linePath}
                              fill="none"
                              stroke=${f.color}
                              stroke-width="1.08"
                              stroke-linejoin="round"
                              stroke-linecap="round"
                              opacity="0.88"
                            ></path>
                            ${x.firstPoint && x.lastPoint ? W`
                                  <circle
                                    cx=${x.firstPoint.x.toFixed(2)}
                                    cy=${x.firstPoint.y.toFixed(2)}
                                    r="1.7"
                                    fill=${f.color}
                                    opacity="0.95"
                                  ></circle>
                                  <circle
                                    cx=${x.lastPoint.x.toFixed(2)}
                                    cy=${x.lastPoint.y.toFixed(2)}
                                    r="1.7"
                                    fill=${f.color}
                                    opacity="0.95"
                                  ></circle>
                                ` : v}
                          ` : x.firstPoint ? W`
                          <circle
                            cx=${x.firstPoint.x.toFixed(2)}
                            cy=${x.firstPoint.y.toFixed(2)}
                            r="2.4"
                            fill=${f.color}
                            opacity="0.95"
                          ></circle>
                        ` : v;
    })}
                      ${N !== null ? W`
                            <line
                              class="graph-stat-line graph-stat-max"
                              x1="10"
                              x2="310"
                              y1=${N.toFixed(2)}
                              y2=${N.toFixed(2)}
                            ></line>
                          ` : v}
                      ${T !== null ? W`
                            <line
                              class="graph-stat-line graph-stat-median"
                              x1="10"
                              x2="310"
                              y1=${T.toFixed(2)}
                              y2=${T.toFixed(2)}
                            ></line>
                          ` : v}
                      ${m !== null ? W`
                            <line
                              class="graph-stat-line graph-stat-min"
                              x1="10"
                              x2="310"
                              y1=${m.toFixed(2)}
                              y2=${m.toFixed(2)}
                            ></line>
                          ` : v}
                    </svg>
                  </div>
                  <div class="graph-axis">
                    ${H.map(
      (f) => g`
                        <span class="graph-axis-label" style=${`left:${f.leftPercent.toFixed(2)}%;`}>
                          ${f.label}
                        </span>
                      `
    )}
                  </div>
                  <div class="graph-meta">
                    <span>
                      ${this._t("card.popup.history.time_range", {
      start: this._formatGraphTime(p.startTs),
      end: this._formatGraphTime(p.endTs)
    })}
                    </span>
                  </div>
                ` : g`<p class="graph-state">${this._t("card.popup.panel_compare.no_data")}</p>`}

        ${S ? g`
              <div class="compare-diagnostics">
                <span class="compare-diagnostics-title">
                  ${this._t("card.popup.panel_compare.diagnostics_title")}
                </span>
                <span class="compare-diagnostics-row">
                  ${this._t("card.popup.panel_compare.diagnostics_summary", {
      hasData: p.hasData ? "true" : "false",
      drawable: p.drawableCount,
      series: p.series.length,
      range: r
    })}
                </span>
                <span class="compare-diagnostics-row">
                  ${y ? this._t("card.popup.panel_compare.diagnostics_reason_render_failure") : this._t("card.popup.panel_compare.diagnostics_reason_suspect")}
                </span>
                ${c.map((f) => {
      const x = h.get(f.panelId), j = this._getUnitForEntity(f.entityId, C);
      return g`
                    <span class="compare-diagnostics-row">
                      ${this._t("card.popup.panel_compare.diagnostics_row", {
        label: f.label,
        samples: x?.sampleCount ?? 0,
        points: x?.pointsCount ?? 0,
        pathLen: x?.linePath.length ?? 0,
        first: this._formatGraphDiagnosticTime(x?.firstTs ?? null),
        last: this._formatGraphDiagnosticTime(x?.lastTs ?? null),
        min: x?.minValue === null || x?.minValue === void 0 ? "--" : this._formatGraphPower(x.minValue, j),
        max: x?.maxValue === null || x?.maxValue === void 0 ? "--" : this._formatGraphPower(x.maxValue, j)
      })}
                    </span>
                  `;
    })}
              </div>
            ` : v}

        <div class="compare-legend">
          ${c.map(
      (f) => g`
              <div class="compare-legend-item">
                <span
                  class="compare-legend-chip"
                  style=${`background:${f.color};`}
                ></span>
                <span class="compare-legend-label">${f.label}</span>
              </div>
            `
    )}
        </div>
      </div>
    `;
  }
  _handlePanelCompareRangeChange(e, t, s, r) {
    e.preventDefault(), e.stopPropagation();
    const o = this._captureScrollPositionsForPopupGraph(e);
    this._kpiCompareRangeHours = {
      ...this._kpiCompareRangeHours,
      [s]: r
    }, this._scheduleCapturedScrollRestore(o), this._kpiCompareExpanded[s] && this._ensurePanelCompareLoaded(t, s, r, o);
  }
  _buildPanelCompareTargets(e, t) {
    const s = new Map(
      (this._config?.panels ?? []).map((r) => [r.id, r])
    );
    return e.panels.filter((r) => !r.hiddenSlot && r.enabled).map((r) => {
      const o = s.get(r.id), a = t === "energy" ? o?.energy_entity?.trim() : o?.power_entity?.trim();
      return a ? {
        panelId: r.id,
        label: r.label,
        entityId: a
      } : null;
    }).filter((r) => !!r);
  }
  _getPanelCompareSignature(e, t) {
    return `${e}|${t.map((s) => `${s.panelId}:${s.entityId}`).join("|")}`;
  }
  _getPanelCompareCacheKey(e, t, s) {
    return `${e}|${t}|${s}`;
  }
  async _ensurePanelCompareLoaded(e, t, s, r) {
    if (!this._config || !this.hass)
      return;
    const o = this._buildPanelCompareTargets(e, t);
    if (o.length === 0)
      return;
    const a = this._getPanelCompareSignature(t, o), n = this._getPanelCompareCacheKey(t, a, s), l = this._kpiCompareCache[n], d = Date.now();
    if (l?.loading || l && !l.error && l.loadedAt && d - l.loadedAt < fi)
      return;
    const c = ++this._kpiCompareRequestToken;
    if (this._kpiCompareLatestTokenByKey[n] = c, this._kpiCompareCache = {
      ...this._kpiCompareCache,
      [n]: {
        loading: !0,
        samplesByPanelId: l?.samplesByPanelId ?? {},
        loadedAt: l?.loadedAt
      }
    }, this._scheduleCapturedScrollRestore(r), !this.hass.callApi && !this.hass.callWS) {
      if (this._kpiCompareLatestTokenByKey[n] !== c)
        return;
      this._kpiCompareCache = {
        ...this._kpiCompareCache,
        [n]: {
          loading: !1,
          samplesByPanelId: {},
          error: this._t("card.popup.panel_compare.unable_load", {
            error: this._t("common.unknown_recorder_error")
          }),
          loadedAt: Date.now()
        }
      }, this._scheduleCapturedScrollRestore(r);
      return;
    }
    try {
      const p = [...new Set(o.map((P) => P.entityId))], h = {};
      let u = null;
      const y = await Promise.allSettled(
        p.map(async (P) => ({
          entityId: P,
          samples: await this._loadPopupGraphRecorderSamples(P, s)
        }))
      );
      for (const P of y) {
        if (P.status === "fulfilled") {
          h[P.value.entityId] = P.value.samples;
          continue;
        }
        u || (u = rt(
          st(P.reason, this._t("common.unknown_recorder_error"))
        ));
      }
      if (this._kpiCompareLatestTokenByKey[n] !== c)
        return;
      const S = Object.values(h).some(
        (P) => P.length > 0
      );
      if (Object.keys(h).length === 0 && u) {
        this._kpiCompareCache = {
          ...this._kpiCompareCache,
          [n]: {
            loading: !1,
            samplesByPanelId: {},
            error: this._t("card.popup.panel_compare.unable_load", {
              error: u
            }),
            loadedAt: Date.now()
          }
        }, this._scheduleCapturedScrollRestore(r);
        return;
      }
      const $ = {};
      for (const P of o)
        $[P.panelId] = h[P.entityId] ?? [];
      this._kpiCompareCache = {
        ...this._kpiCompareCache,
        [n]: {
          loading: !1,
          samplesByPanelId: $,
          error: !S && u ? this._t("card.popup.panel_compare.unable_load", {
            error: u
          }) : void 0,
          loadedAt: Date.now()
        }
      }, this._scheduleCapturedScrollRestore(r);
    } catch (p) {
      if (this._kpiCompareLatestTokenByKey[n] !== c)
        return;
      this._kpiCompareCache = {
        ...this._kpiCompareCache,
        [n]: {
          loading: !1,
          samplesByPanelId: {},
          error: this._t("card.popup.panel_compare.unable_load", {
            error: rt(st(p, this._t("common.unknown_recorder_error")))
          }),
          loadedAt: Date.now()
        }
      }, this._scheduleCapturedScrollRestore(r);
    }
  }
  _renderInverterEvaluation(e) {
    return !e.inverterStatusDisplay || e.inverterStatusDisplay === this._t("common.unavailable") ? this._t("card.popup.inverter_eval.no_status") : e.inverterFaultMatched ? this._t("card.popup.inverter_eval.fault_match") : e.inverterWorkingMatched ? this._t("card.popup.inverter_eval.working_match") : this._t("card.popup.inverter_eval.no_match");
  }
  _renderLivePowerDialog(e) {
    const t = this._getSystemPowerEntityId(), s = !t, r = this._resolveSummaryPower(e), o = this._resolveForecastMetricDisplay(
      "power",
      this._config?.power_decimals ?? 0,
      "W"
    ), a = this._isForecastOverlayEnabled() && !!o.entityId, n = o.entityId ? this._isForecastOverlayEnabled() ? null : this._t("card.popup.forecast.disabled_hint") : this._t("card.popup.forecast.default_sensor_not_found", {
      entity: o.expectedEntityId
    }), l = !this._isForecastOverlayEnabled() && !!o.entityId && !!t, d = !t && this._isForecastOverlayEnabled() ? this._t("card.popup.forecast.power_compare_requires_system") : null, c = this.hass?.locale?.language ?? "en";
    return g`
      <div class="spv-popup-backdrop" @click=${this._closeLivePowerPopup}>
        <div class="spv-popup" @click=${(p) => p.stopPropagation()}>
          ${this._renderPopupCloseButton(
      this._closeLivePowerPopup,
      this._t("card.popup.close_live_power")
    )}
          <div class="spv-popup-header">
            <div>
              <div class="eyebrow">${this._t("card.popup.power_eyebrow")}</div>
              <h2 class="spv-popup-title">${this._t("card.popup.power_title")}</h2>
            </div>
          </div>

          ${t ? this._renderPopupGraphForEntity(
      t,
      this._t("card.popup.history.system_power"),
      {
        overlayEntityId: a ? o.entityId : null,
        overlayStateMessage: n,
        showEnableForecastButton: l
      }
    ) : this._renderPanelCompareGraph(e, "power")}

          <div class="detail-grid">
            <div class="detail-card">
              <span class="detail-label">${this._t("card.popup.detail.current")}</span>
              <span class="detail-value">
                ${Ee(
      r.value,
      this._config?.power_decimals ?? 0,
      r.unit,
      this._t("common.unavailable"),
      c
    )}
              </span>
            </div>
            <div class="detail-card">
              <span class="detail-label">${this._t("card.popup.detail.source")}</span>
              <span class="detail-value">
                ${t ? this._t("card.summary.system_sensor") : this._t("card.summary.sum_panel_sensors")}
              </span>
            </div>
            <div class="detail-card">
              <span class="detail-label">${this._t("card.popup.detail.estimated_power_now")}</span>
              <span class="detail-value">${o.display}</span>
            </div>
          </div>

          ${d ? g`<p class="graph-forecast-state">${d}</p>` : v}
          ${s ? v : this._renderKpiCompareControls(e, "power")}
        </div>
      </div>
    `;
  }
  _renderEnergyDialog(e) {
    const t = this._getSystemEnergyEntityId(), s = !t, r = this._resolveSummaryEnergy(e), o = this._resolveForecastMetricDisplay(
      "energy",
      this._config?.energy_decimals ?? 2,
      "kWh"
    ), a = this._isForecastOverlayEnabled() && !!o.entityId, n = o.entityId ? t ? this._isForecastOverlayEnabled() ? null : this._t("card.popup.forecast.disabled_hint") : this._t("card.popup.forecast.energy_compare_requires_system") : this._t("card.popup.forecast.default_sensor_not_found", {
      entity: o.expectedEntityId
    }), l = !this._isForecastOverlayEnabled() && !!o.entityId && !!t, d = this.hass?.locale?.language ?? "en";
    return g`
      <div class="spv-popup-backdrop" @click=${this._closeEnergyPopup}>
        <div class="spv-popup" @click=${(c) => c.stopPropagation()}>
          ${this._renderPopupCloseButton(this._closeEnergyPopup, this._t("card.popup.close_energy"))}
          <div class="spv-popup-header">
            <div>
              <div class="eyebrow">${this._t("card.popup.energy_eyebrow")}</div>
              <h2 class="spv-popup-title">${this._t("card.popup.energy_title")}</h2>
            </div>
          </div>

          ${t ? this._renderPopupGraphForEntity(
      t,
      this._t("card.popup.history.system_energy"),
      {
        overlayEntityId: a ? o.entityId : null,
        overlayStateMessage: n,
        showEnableForecastButton: l
      }
    ) : this._renderPanelCompareGraph(e, "energy")}

          <div class="detail-grid">
            <div class="detail-card">
              <span class="detail-label">${this._t("card.popup.detail.current")}</span>
              <span class="detail-value">
                ${Ee(
      r.value,
      this._config?.energy_decimals ?? 2,
      r.unit,
      this._t("common.unavailable"),
      d
    )}
              </span>
            </div>
            <div class="detail-card">
              <span class="detail-label">${this._t("card.popup.detail.source")}</span>
              <span class="detail-value">
                ${t ? this._t("card.summary.system_sensor") : this._t("card.summary.sum_panel_sensors")}
              </span>
            </div>
            <div class="detail-card">
              <span class="detail-label">${this._t("card.popup.detail.estimated_energy_now")}</span>
              <span class="detail-value">${o.display}</span>
            </div>
          </div>

          ${!t && n ? g`<p class="graph-forecast-state">${n}</p>` : v}
          ${s ? v : this._renderKpiCompareControls(e, "energy")}
        </div>
      </div>
    `;
  }
  _renderCustomKpiDialog() {
    const e = this._resolveCustomKpi(), t = e.title.length > 0 ? this._resolveCustomKpiTitle(e.title) : this._t("card.summary.custom_default_title"), s = this._getCustomKpiEntityId();
    return g`
      <div class="spv-popup-backdrop" @click=${this._closeCustomKpiPopup}>
        <div class="spv-popup" @click=${(r) => r.stopPropagation()}>
          ${this._renderPopupCloseButton(
      this._closeCustomKpiPopup,
      this._t("card.popup.close_custom_kpi")
    )}
          <div class="spv-popup-header">
            <div>
              <div class="eyebrow">${this._t("card.popup.custom_eyebrow")}</div>
              <h2 class="spv-popup-title">${t}</h2>
            </div>
          </div>

          <div class="detail-grid">
            <div class="detail-card">
              <span class="detail-label">${this._t("card.popup.detail.current")}</span>
              <span class="detail-value">${e.value}</span>
            </div>
            <div class="detail-card">
              <span class="detail-label">${this._t("card.popup.detail.source")}</span>
              <span class="detail-value">
                ${s ? this._t("card.summary.custom_sensor") : this._t("common.not_configured")}
              </span>
            </div>
          </div>

          ${s ? this._renderPopupGraphForEntity(
      s,
      `${t} ${this._t("card.popup.history.power")}`,
      {
        fillStartWithFirstSample: !0,
        invertPrimaryValues: this._config?.invert_custom_kpi ?? !1
      }
    ) : g`<p class="graph-state">${this._t("card.popup.history.custom_not_configured")}</p>`}
        </div>
      </div>
    `;
  }
  _renderSystemHealthDialog(e) {
    const t = this._buildSystemHealthSections(e), s = t.length > 0;
    return g`
      <div class="spv-popup-backdrop" @click=${this._closeSystemHealthPopup}>
        <div class="spv-popup" @click=${(r) => r.stopPropagation()}>
          ${this._renderPopupCloseButton(
      this._closeSystemHealthPopup,
      this._t("card.popup.close_system_health")
    )}
          <div class="spv-popup-header">
            <div>
              <div class="eyebrow">${this._t("card.popup.system_health_eyebrow")}</div>
              <h2 class="spv-popup-title">${this._t("card.popup.system_health_title")}</h2>
            </div>
          </div>

          ${s ? t.map(
      (r) => g`
                  <div class="graph-section">
                    <div class="graph-header">
                      <span class="graph-title">${r.title}</span>
                    </div>
                    ${r.items.map(
        (o) => g`<p class="system-health-item">${o}</p>`
      )}
                  </div>
                `
    ) : g`<p class="system-health-item">${this._t("card.popup.system_health.everything_ok")}</p>`}
        </div>
      </div>
    `;
  }
  _renderMetricList(e, t) {
    return g`
      <div class="graph-section">
        <div class="graph-header">
          <span class="graph-title">${e}</span>
        </div>
        ${t.map(
      (s) => g`
            <p class="subtitle">
              ${s.label}: ${s.value}
            </p>
          `
    )}
      </div>
    `;
  }
  _renderPopupGraph(e) {
    const t = this._getPanelConfig(e.id);
    return this._renderPopupGraphForEntity(
      t?.power_entity,
      this._t("card.popup.history.power")
    );
  }
  _renderPopupGraphForEntity(e, t, s = {}) {
    return g`
      <div class="graph-section">
        <div class="graph-header">
          <span class="graph-title">${t}</span>
          <div class="range-chips">
            ${Gt.map(
      (r) => g`
                <button
                  class="range-chip ${this._popupGraphRangeHours === r ? "active" : ""}"
                  type="button"
                  @pointerdown=${this._preventRangeChipFocusScroll}
                  @mousedown=${this._preventRangeChipFocusScroll}
                  @click=${(o) => this._handlePopupGraphRangeChangeForEntity(
        o,
        e,
        r,
        s.overlayEntityId ?? void 0
      )}
                >
                  ${r}h
                </button>
              `
    )}
          </div>
        </div>
        ${e ? this._renderPopupGraphBody(e, s) : g`<p class="graph-state">${this._t("card.popup.history.graph_not_configured")}</p>`}
        ${s.overlayStateMessage ? g`<p class="graph-forecast-state">${s.overlayStateMessage}</p>` : v}
        ${s.showEnableForecastButton ? g`
              <div class="forecast-enable-row">
                <button
                  class="inline-button"
                  type="button"
                  @click=${this._enableForecastOverlayFromPopup}
                >
                  ${this._t("card.popup.forecast.enable_button")}
                </button>
              </div>
            ` : v}
      </div>
    `;
  }
  _renderPopupGraphBody(e, t = {}) {
    const s = this._getPopupGraphCacheKey(e, this._popupGraphRangeHours), r = this._popupGraphCache[s], o = r?.loading ?? !1, a = r?.error, n = r?.samples ?? [], l = this._adjustGraphSamplesForEntity(e, n), d = t.invertPrimaryValues ? l.map((L) => ({
      ts: L.ts,
      value: ee(L.value * -1)
    })) : l, c = this._fillRangeStartWithFirstSample(
      d,
      this._popupGraphRangeHours,
      t.fillStartWithFirstSample ?? !1
    ), p = As(c, {
      rangeHours: this._popupGraphRangeHours
    }), h = this._expandSinglePointRangeSamples(
      p,
      this._popupGraphRangeHours
    ), u = t.overlayEntityId ?? null, y = u ? this._popupGraphCache[this._getPopupGraphCacheKey(u, this._popupGraphRangeHours)] : void 0, S = y?.samples ?? [], C = u ? this._expandSinglePointRangeSamples(
      this._adjustGraphSamplesForEntity(u, S),
      this._popupGraphRangeHours
    ) : [], $ = u ? y?.loading ?? !1 : !1, P = u ? y?.error : void 0;
    if (o)
      return g`<p class="graph-state">${this._t("card.popup.history.loading")}</p>`;
    if (a)
      return g`<p class="graph-state">${a}</p>`;
    if (h.length === 0)
      return g`<p class="graph-state">${this._t("card.popup.history.no_data")}</p>`;
    const F = this._getUnitForEntity(e, "W"), O = ot(h, tt), w = this._computeGraphStats(h), E = Date.now(), N = E - this._popupGraphRangeHours * 60 * 60 * 1e3, T = E, m = u && !$ && !P && C.length > 0 ? ot(C, tt) : [], b = h.map((L) => L.value).filter((L) => Number.isFinite(L)), k = m.map((L) => L.value).filter((L) => Number.isFinite(L)), I = [...b, ...k], R = I.length > 0 ? Math.min(...I) : null, H = I.length > 0 ? Math.max(...I) : null, G = R === null || H === null ? null : R === H ? R - 1 : R, f = R === null || H === null ? null : R === H ? H + 1 : H, x = G !== null && f !== null ? {
      startTs: N,
      endTs: T,
      minValue: G,
      maxValue: f
    } : null, j = x !== null ? this._buildAlignedGraphLinePath(O, x, 320, 132, 10) : "", K = x !== null ? this._buildAlignedGraphAreaPath(O, x, 320, 132, 10) : "", se = x !== null && m.length > 0 ? this._buildAlignedGraphLinePath(m, x, 320, 132, 10) : "", be = this._buildGraphHourTicks(
      {
        startTs: N,
        endTs: T
      },
      this._popupGraphRangeHours
    ), Xe = this._buildGraphAxisTicks(be), ue = w.max !== null && G !== null && f !== null ? this._toGraphY(w.max, G, f, 132, 10) : null, ae = w.median !== null && G !== null && f !== null ? this._toGraphY(w.median, G, f, 132, 10) : null, we = w.min !== null && G !== null && f !== null ? this._toGraphY(w.min, G, f, 132, 10) : null, xe = `spv-graph-${s.replace(/[^a-zA-Z0-9_-]/g, "-")}`, De = w.max !== null ? this._t("card.popup.history.max", {
      value: this._formatGraphPower(w.max, F)
    }) : null, _ = w.median !== null ? this._t("card.popup.history.median", {
      value: this._formatGraphPower(w.median, F)
    }) : null, A = w.min !== null ? this._t("card.popup.history.min", {
      value: this._formatGraphPower(w.min, F)
    }) : null;
    return g`
      <div class="graph-box">
        ${De ? g`<span class="graph-overlay graph-overlay-max">${De}</span>` : v}
        ${_ ? g`
              <span class="graph-overlay graph-overlay-median">
                ${_}
              </span>
            ` : v}
        ${A ? g`<span class="graph-overlay graph-overlay-min">${A}</span>` : v}
        <svg class="graph-svg" viewBox="0 0 320 132" preserveAspectRatio="none">
          <defs>
            <linearGradient id=${xe} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="rgba(142, 208, 114, 0.48)"></stop>
              <stop offset="100%" stop-color="rgba(142, 208, 114, 0.04)"></stop>
            </linearGradient>
          </defs>
          <path
            d=${K}
            fill=${`url(#${xe})`}
          ></path>
          ${be.map(
      (L) => W`
              <line
                class="graph-hour-line"
                x1=${L.x.toFixed(2)}
                x2=${L.x.toFixed(2)}
                y1="10"
                y2="122"
              ></line>
            `
    )}
          ${W`
            <path
            d=${j}
            fill="none"
            stroke="rgba(186, 226, 106, 0.95)"
            stroke-width="2.2"
            stroke-linejoin="round"
            stroke-linecap="round"
            ></path>
          `}
          ${se.length > 0 ? W`
                <path
                  d=${se}
                  fill="none"
                  stroke="var(--spv-forecast-line)"
                  stroke-width="1.5"
                  stroke-dasharray="6 5"
                  stroke-linejoin="round"
                  stroke-linecap="round"
                  opacity="0.82"
                ></path>
              ` : v}
          ${ue !== null ? W`
                <line
                  class="graph-stat-line graph-stat-max"
                  x1="10"
                  x2="310"
                  y1=${ue.toFixed(2)}
                  y2=${ue.toFixed(2)}
                ></line>
              ` : v}
          ${ae !== null ? W`
                <line
                  class="graph-stat-line graph-stat-median"
                  x1="10"
                  x2="310"
                  y1=${ae.toFixed(2)}
                  y2=${ae.toFixed(2)}
                ></line>
              ` : v}
          ${we !== null ? W`
                <line
                  class="graph-stat-line graph-stat-min"
                  x1="10"
                  x2="310"
                  y1=${we.toFixed(2)}
                  y2=${we.toFixed(2)}
                ></line>
              ` : v}
        </svg>
      </div>
      <div class="graph-axis">
        ${Xe.map(
      (L) => g`
            <span class="graph-axis-label" style=${`left:${L.leftPercent.toFixed(2)}%;`}>
              ${L.label}
            </span>
          `
    )}
      </div>
      <div class="graph-meta">
        <span>
          ${this._t("card.popup.history.time_range", {
      start: this._formatGraphTime(N),
      end: this._formatGraphTime(T)
    })}
        </span>
      </div>
      ${u && $ ? g`<p class="graph-forecast-state">${this._t("card.popup.history.loading")}</p>` : v}
      ${u && !$ && P ? g`<p class="graph-forecast-state">${P}</p>` : v}
      ${u && !$ && !P && C.length === 0 ? g`<p class="graph-forecast-state">${this._t("card.popup.history.no_data")}</p>` : v}
    `;
  }
  _handlePopupGraphRangeChangeForEntity(e, t, s, r) {
    e.preventDefault(), e.stopPropagation();
    const o = this._captureScrollPositionsForPopupGraph(e);
    this._popupGraphRangeHours = s, this._scheduleCapturedScrollRestore(o), t && this._ensurePopupGraphLoadedByEntity(t, s, o), r && this._ensurePopupGraphLoadedByEntity(r, s, o);
  }
  _getPopupGraphCacheKey(e, t) {
    return `${e}|${t}`;
  }
  _getPanelConfig(e) {
    return this._config?.panels.find((t) => t.id === e);
  }
  async _ensurePopupGraphLoaded(e, t, s) {
    if (!this._config || !this.hass)
      return;
    const o = this._getPanelConfig(e)?.power_entity;
    o && await this._ensurePopupGraphLoadedByEntity(o, t, s);
  }
  async _ensurePopupGraphLoadedByEntity(e, t, s) {
    if (!this._config || !this.hass)
      return;
    const r = this._getPopupGraphCacheKey(e, t), o = this._popupGraphCache[r], a = Date.now();
    if (o?.loading || o && !o.error && o.loadedAt && a - o.loadedAt < mi)
      return;
    const n = ++this._popupGraphRequestToken;
    if (this._popupGraphLatestTokenByKey[r] = n, this._popupGraphCache = {
      ...this._popupGraphCache,
      [r]: {
        loading: !0,
        samples: o?.samples ?? [],
        loadedAt: o?.loadedAt
      }
    }, this._scheduleCapturedScrollRestore(s), !this.hass.callApi && !this.hass.callWS) {
      if (this._popupGraphLatestTokenByKey[r] !== n)
        return;
      this._popupGraphCache = {
        ...this._popupGraphCache,
        [r]: {
          loading: !1,
          samples: [],
          error: "Unable to load panel history",
          loadedAt: Date.now()
        }
      }, this._scheduleCapturedScrollRestore(s);
      return;
    }
    try {
      if (this._popupGraphLatestTokenByKey[r] !== n)
        return;
      const l = await this._loadPopupGraphRecorderSamples(e, t);
      if (this._popupGraphLatestTokenByKey[r] !== n)
        return;
      this._popupGraphCache = {
        ...this._popupGraphCache,
        [r]: {
          loading: !1,
          samples: l,
          loadedAt: Date.now()
        }
      }, this._scheduleCapturedScrollRestore(s);
    } catch (l) {
      if (this._popupGraphLatestTokenByKey[r] !== n)
        return;
      this._popupGraphCache = {
        ...this._popupGraphCache,
        [r]: {
          loading: !1,
          samples: [],
          error: `Unable to load panel history (${rt(st(l))})`,
          loadedAt: Date.now()
        }
      }, this._scheduleCapturedScrollRestore(s);
    }
  }
  async _loadPopupGraphRecorderSamples(e, t) {
    if (!this.hass || !this.hass.callApi && !this.hass.callWS)
      throw new Error("Recorder API unavailable");
    const s = Date.now(), r = Math.min(168, t + 6), o = new Date(s - r * 60 * 60 * 1e3).toISOString(), a = new Date(s).toISOString(), n = this._getSharedHistorySamplesForRange(e, t);
    if (n) {
      const p = We(n, s, t), h = this._stabilizePopupRangeSamples(
        e,
        n,
        p,
        s,
        t
      );
      if (this._hasPopupRangeCoverage(h, s, t))
        return h;
      try {
        const u = await this._fetchRecorderHistoryRaw(o, a, [e]), y = this._parseRecorderResponse(u, r, [e])[e] ?? [], S = this._mergeGraphSampleSets(n, y), C = We(S, s, t);
        return this._stabilizePopupRangeSamples(e, S, C, s, t);
      } catch {
        return h;
      }
    }
    const l = await this._fetchRecorderHistoryRaw(o, a, [e]), d = this._parseRecorderResponse(l, r, [e])[e] ?? [], c = We(d, s, t);
    return this._stabilizePopupRangeSamples(e, d, c, s, t);
  }
  _getSharedHistorySamplesForRange(e, t) {
    if (!(this._config?.enable_array_checks ?? !1) || this._getHistoryHours() < t)
      return null;
    const s = this._historyByEntityId[e];
    return !s || s.length === 0 ? null : s;
  }
  _stabilizePopupRangeSamples(e, t, s, r, o) {
    const a = r - o * 60 * 60 * 1e3, n = [...t].sort((u, y) => u.ts - y.ts), l = [...s].sort((u, y) => u.ts - y.ts), d = n.filter((u) => u.ts < a).at(-1) ?? null, c = this._isForecastDefaultEntity(e), p = Number(this.hass?.states?.[e]?.state);
    if (l.length === 0)
      c && Number.isFinite(p) ? l.push({ ts: a, value: p }) : d ? l.push({ ts: a, value: d.value }) : Number.isFinite(p) && l.push({ ts: a, value: p });
    else if (l[0].ts > a && (d || c)) {
      const u = c ? l[0].value : d?.value ?? l[0].value;
      l.unshift({ ts: a, value: u });
    }
    const h = l[l.length - 1];
    if (!h && Number.isFinite(p))
      l.push({ ts: r, value: p });
    else if (h && h.ts < r) {
      const u = Number.isFinite(p) ? p : h.value;
      l.push({ ts: r, value: u });
    }
    return l.filter((u) => Number.isFinite(u.ts) && Number.isFinite(u.value)).sort((u, y) => u.ts - y.ts);
  }
  _hasPopupRangeCoverage(e, t, s) {
    if (e.length === 0)
      return !1;
    const r = t - s * 60 * 60 * 1e3, o = e[0].ts, a = e[e.length - 1].ts, n = 900 * 1e3;
    return o <= r + n && a >= t - n;
  }
  _mergeGraphSampleSets(...e) {
    const t = /* @__PURE__ */ new Map();
    for (const s of e)
      for (const r of s)
        !Number.isFinite(r.ts) || !Number.isFinite(r.value) || t.set(r.ts, r);
    return [...t.values()].sort((s, r) => s.ts - r.ts);
  }
  _getUnitForEntity(e, t) {
    const s = this.hass?.states?.[e]?.attributes?.unit_of_measurement;
    return typeof s == "string" && s.trim().length > 0 ? s : t;
  }
  _formatGraphPower(e, t) {
    if (e === null)
      return `0 ${t}`;
    const s = this.hass?.locale?.language ?? "en", r = ee(e), o = t.trim().toLowerCase(), a = o.includes("wh") || o.includes("kwh") ? this._config?.energy_decimals ?? 2 : this._config?.power_decimals ?? 0;
    return `${new Intl.NumberFormat(s, {
      minimumFractionDigits: a,
      maximumFractionDigits: a
    }).format(r)} ${t}`;
  }
  _computeGraphStats(e) {
    const t = e.map((n) => n.value).filter((n) => Number.isFinite(n)).sort((n, l) => n - l);
    if (t.length === 0)
      return { min: null, max: null, median: null };
    const s = t[0] ?? null, r = t[t.length - 1] ?? null, o = Math.floor(t.length / 2), a = t.length % 2 === 0 ? (t[o - 1] + t[o]) / 2 : t[o];
    return { min: s, max: r, median: a };
  }
  _buildGraphHourTicks(e, t) {
    if (e.startTs === null || e.endTs === null)
      return [];
    const s = e.startTs, r = e.endTs, o = Math.max(r - s, 1), a = 320, n = 10, l = a - n * 2, d = t === 1 ? 900 * 1e3 : t === 6 ? 3600 * 1e3 : 14400 * 1e3, c = [], p = (u) => {
      const y = new Date(u), S = `${y.getHours()}`.padStart(2, "0"), C = `${y.getMinutes()}`.padStart(2, "0");
      return t === 1 ? `${S}:${C}` : `${S}h`;
    };
    let h = Math.ceil(s / d) * d;
    for (; h < r; ) {
      const u = n + (h - s) / o * l;
      c.push({
        x: u,
        label: p(h)
      }), h += d;
    }
    if (t === 6 && c.length < 3) {
      const u = [0.25, 0.5, 0.75];
      for (const y of u) {
        const S = s + o * y, C = n + (S - s) / o * l;
        c.push({
          x: C,
          label: p(S)
        });
      }
    }
    return c.sort((u, y) => u.x - y.x), c;
  }
  _buildGraphAxisTicks(e) {
    if (e.length === 0)
      return [];
    const t = 10, r = 320 - t * 2;
    return e.map((o) => ({
      label: o.label,
      leftPercent: (o.x - t) / r * 100
    }));
  }
  _toGraphY(e, t, s, r, o) {
    const a = Math.max(s - t, 1), n = Math.max(r - o * 2, 1);
    return r - o - (e - t) / a * n;
  }
  _buildAlignedGraphLinePath(e, t, s, r, o) {
    const a = e.filter((h) => Number.isFinite(h.ts) && Number.isFinite(h.value)).sort((h, u) => h.ts - u.ts);
    if (a.length === 0)
      return "";
    const n = Math.max(t.endTs - t.startTs, 1), l = Math.max(t.maxValue - t.minValue, 1), d = Math.max(s - o * 2, 1), c = Math.max(r - o * 2, 1), p = [];
    for (const h of a) {
      const u = Math.min(Math.max(h.ts, t.startTs), t.endTs), y = o + (u - t.startTs) / n * d, S = (h.value - t.minValue) / l, C = r - o - Math.min(Math.max(S, 0), 1) * c, $ = p[p.length - 1];
      $ && Math.abs($.x - y) < 0.01 && Math.abs($.y - C) < 0.01 || p.push({ x: y, y: C });
    }
    return p.length === 0 ? "" : (p.length === 1 && p.push({ ...p[0] }), p.map(
      (h, u) => `${u === 0 ? "M" : "L"}${h.x.toFixed(2)},${h.y.toFixed(2)}`
    ).join(" "));
  }
  _buildAlignedGraphAreaPath(e, t, s, r, o) {
    const a = this._buildAlignedGraphLinePath(e, t, s, r, o);
    if (!a)
      return "";
    const n = e.filter((S) => Number.isFinite(S.ts) && Number.isFinite(S.value)).sort((S, C) => S.ts - C.ts);
    if (n.length === 0)
      return "";
    const l = Math.max(t.endTs - t.startTs, 1), d = Math.max(s - o * 2, 1), c = Math.min(Math.max(n[0].ts, t.startTs), t.endTs), p = Math.min(
      Math.max(n[n.length - 1].ts, t.startTs),
      t.endTs
    ), h = o + (c - t.startTs) / l * d, u = o + (p - t.startTs) / l * d, y = r - o;
    return `${a} L${u.toFixed(2)},${y.toFixed(2)} L${h.toFixed(2)},${y.toFixed(2)} Z`;
  }
  _formatGraphTime(e) {
    if (e === null)
      return "--:--";
    const t = this.hass?.locale?.language ?? "en";
    return new Intl.DateTimeFormat(t, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: !1,
      hourCycle: "h23"
    }).format(e);
  }
  _formatGraphDiagnosticTime(e) {
    if (e === null)
      return "--";
    const t = this.hass?.locale?.language ?? "en";
    return new Intl.DateTimeFormat(t, {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: !1,
      hourCycle: "h23"
    }).format(e);
  }
  _resolveThemeMode() {
    const e = this._config?.theme_mode ?? "auto";
    if (e === "dark" || e === "light")
      return e;
    const t = this.hass?.themes?.darkMode;
    return typeof t == "boolean" ? t ? "dark" : "light" : typeof window < "u" && typeof window.matchMedia == "function" ? window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light" : "dark";
  }
  _buildSystemHealthState(e) {
    const t = {
      error: this._config?.colors?.error ?? "#ff627f",
      offline: this._config?.colors?.unavailable ?? "#586779",
      deviation: this._config?.colors?.deviation ?? "#ff9667",
      setup: "#41c9d8",
      ok: "#8ed072"
    }, s = e.inverterCount + e.errorCount;
    return s > 0 ? {
      label: `${s} Fault${s === 1 ? "" : "s"}`,
      color: t.error
    } : e.offlineCount > 0 ? {
      label: `${e.offlineCount} Unavailable`,
      color: t.offline
    } : e.deviationCount > 0 ? {
      label: `${e.deviationCount} Deviation`,
      color: t.deviation
    } : e.unconfiguredCount > 0 ? {
      label: `${e.unconfiguredCount} Needs Setup`,
      color: t.setup
    } : { label: "System OK", color: t.ok };
  }
  _buildSystemHealthSections(e) {
    const t = e.panels.filter((c) => !c.hiddenSlot), s = (c) => t.filter((p) => p.status === c).map((p) => `Panel on ${this._formatSlotLabel(p.slotIndex)} (${p.label}): ${p.reason}`), r = [], o = s("inverter");
    o.length > 0 && r.push({ title: "Inverter", items: o });
    const a = s("error");
    a.length > 0 && r.push({ title: "Error", items: a });
    const n = s("deviation");
    n.length > 0 && r.push({ title: "Deviation", items: n });
    const l = s("offline");
    l.length > 0 && r.push({ title: "Unavailable", items: l });
    const d = s("unconfigured");
    return d.length > 0 && r.push({ title: "Needs setup", items: d }), r;
  }
  _computeRenderedColumns(e, t) {
    const s = Math.max(1, Math.floor(e)), r = this._cardWidth > 0 ? this._cardWidth : t ?? 980, o = t ? Math.min(r, t) : r;
    if (!Number.isFinite(o) || o <= 0)
      return s;
    const a = Math.max(120, o - 40), n = o <= 560 ? 8 : 10, l = o <= 760, d = l ? Math.min(s, 3) : s, c = this._getPanelWidthCapPx(), p = c !== null ? c : l ? 100 : Math.max(130, Math.min(220, a * 0.32)), h = Math.floor((a + n) / (p + n));
    return Math.max(1, Math.min(d, h || 1));
  }
  _computeRenderedRows(e, t) {
    const s = Math.max(1, e), r = Math.max(1, t);
    return Math.max(1, Math.ceil(s / r));
  }
  _computeWidthBasedPanelHeight(e, t) {
    const r = this._computeTileWidthPx(e, t) * 0.62;
    return Math.round(Math.min(220, Math.max(92, r)));
  }
  _computePanelWidthPx(e, t) {
    const s = this._computeTileWidthPx(e, t);
    return Math.max(96, Math.round(s));
  }
  _computeTileWidthPx(e, t) {
    const s = this._cardWidth > 0 ? this._cardWidth : t ?? 980, r = t ? Math.min(s, t) : s, o = r <= 560 ? 8 : 10, a = Math.max(120, r - 40), n = Math.max(1, e), l = (a - Math.max(0, n - 1) * o) / n;
    return this._applyPanelWidthCapPx(l);
  }
  _getPanelWidthCapPx() {
    if (!(this._config?.limit_panel_width ?? !1))
      return null;
    const e = this._config?.panel_max_width_px ?? 220;
    return Math.min(Math.max(e, 120), 320);
  }
  _applyPanelWidthCapPx(e) {
    const t = this._getPanelWidthCapPx();
    return t ? Math.min(e, t) : e;
  }
  _computePanelHeightPx(e, t, s = this._config?.columns ?? 3, r) {
    const o = this._computeWidthBasedPanelHeight(s, r);
    if (!t || !Number.isFinite(t))
      return o;
    const a = Math.max(1, e), n = 250, l = 36, d = Math.max(a - 1, 0) * 10, p = (t - n - l - d) / a;
    if (!Number.isFinite(p))
      return o;
    const h = Math.min(240, Math.max(96, p)), u = Math.min(h, o * 1.6);
    return Math.round(Math.min(220, Math.max(92, u)));
  }
  _computePanelScale(e) {
    const s = e / 128, r = Math.min(1.28, Math.max(0.76, s));
    return Number(r.toFixed(3));
  }
  _startResizeObserver() {
    if (typeof ResizeObserver > "u" || this._resizeObserver)
      return;
    const e = () => {
      const t = Math.round(this.getBoundingClientRect().width);
      !Number.isFinite(t) || t <= 0 || t !== this._cardWidth && (this._cardWidth = t);
    };
    this._resizeObserver = new ResizeObserver(() => {
      e();
    }), this._resizeObserver.observe(this), e();
  }
  _shouldShowPerformance(e, t, s) {
    return e.performancePercent === null || e.ratedPowerW === null ? !1 : t >= 94 && s >= 110;
  }
  _formatPanelPerformanceText(e, t, s, r = this._buildPanelPerformanceLabelCandidates(e)) {
    if (!r)
      return "";
    const o = this._computePanelScale(s), n = Math.min(0.96, Math.max(0.62, 0.72 * o)) * 16;
    return ai({
      candidates: r,
      panelWidthPx: t,
      panelHeightPx: s,
      fontPx: n,
      reservedRightPx: gi,
      measureTextWidthPx: (l, d) => this._measureTextWidthPx(l, d)
    }).text;
  }
  _buildPanelPerformanceLabelCandidates(e) {
    if (e.performancePercent === null || e.ratedPowerW === null)
      return null;
    const t = e.performancePercent.toFixed(0), s = e.ratedPowerW.toFixed(0);
    return [
      {
        variant: "full",
        text: this._t("card.panel.performance_full", { percent: t, rated: s })
      },
      {
        variant: "medium",
        text: this._t("card.panel.performance_medium", { percent: t, rated: s })
      },
      {
        variant: "compact",
        text: this._t("card.panel.performance_compact", { percent: t })
      }
    ];
  }
  _measureTextWidthPx(e, t) {
    if (typeof document > "u")
      return e.length * t * 0.52;
    if (ce._textMeasureContext === void 0) {
      const r = document.createElement("canvas");
      ce._textMeasureContext = r.getContext("2d");
    }
    const s = ce._textMeasureContext;
    return s ? (s.font = `500 ${t}px system-ui, -apple-system, "Segoe UI", sans-serif`, s.measureText(e).width) : e.length * t * 0.52;
  }
  _handlePanelClick(e) {
    e.hiddenSlot || (this._config?.panel_tap_action ?? "details") === "details" && (this._showLivePowerPopup = !1, this._showEnergyPopup = !1, this._showCustomKpiPopup = !1, this._showSystemHealthPopup = !1, this._selectedPanelId = e.id, this._popupGraphRangeHours = 6, this._kpiCompareExpanded = { power: !1, energy: !1 }, this._kpiCompareRangeHours = { power: 6, energy: 6 }, this._ensurePopupGraphLoaded(e.id, 6));
  }
  _resolveUnit(e, t) {
    if (!this._config)
      return t;
    for (const s of this._config.panels) {
      const r = s[e];
      if (!r)
        continue;
      const o = this.hass?.states?.[r]?.attributes?.unit_of_measurement;
      if (typeof o == "string" && o.trim().length > 0)
        return o;
    }
    return t;
  }
  _getSystemPowerEntityId() {
    if (!this._config || !(this._config.use_system_power_entity ?? !1))
      return null;
    const e = this._config.system_power_entity?.trim();
    return e && e.length > 0 ? e : null;
  }
  _getSystemEnergyEntityId() {
    if (!this._config || !(this._config.use_system_energy_entity ?? !1))
      return null;
    const e = this._config.system_energy_entity?.trim();
    return e && e.length > 0 ? e : null;
  }
  _getForecastEntityId(e) {
    return Ir(this.hass, e);
  }
  _isForecastDefaultEntity(e) {
    return e === Be("power") || e === Be("energy");
  }
  _isForecastOverlayEnabled() {
    return this._config?.enable_forecast_overlay ?? !1;
  }
  _resolveForecastMetricDisplay(e, t, s) {
    const r = Be(e), o = this._getForecastEntityId(e);
    if (!o)
      return {
        expectedEntityId: r,
        entityId: null,
        value: null,
        unit: s,
        display: this._t("common.not_configured")
      };
    const a = this._getUnitForEntity(o, s), n = Number(this.hass?.states?.[o]?.state), l = Number.isFinite(n) ? ee(n) : null, d = this.hass?.locale?.language ?? "en";
    return {
      expectedEntityId: r,
      entityId: o,
      value: l,
      unit: a,
      display: Ee(l, t, a, this._t("common.unavailable"), d)
    };
  }
  _resolveSummaryPower(e) {
    const t = this._getSystemPowerEntityId();
    if (t) {
      const s = this.hass?.states?.[t], r = Number(s?.state), o = Number.isFinite(r) ? r : null;
      return {
        value: o === null ? null : this._config?.invert_system_power ? ee(o * -1) : ee(o),
        unit: this._getUnitForEntity(t, "W")
      };
    }
    return {
      value: e.totalPower,
      unit: this._resolveUnit("power_entity", "W")
    };
  }
  _resolveSummaryEnergy(e) {
    const t = this._getSystemEnergyEntityId();
    if (!this._config)
      return { value: null, unit: "kWh" };
    if (t) {
      const s = this.hass?.states?.[t], r = Number(s?.state);
      return {
        value: Number.isFinite(r) ? r : null,
        unit: this._getUnitForEntity(t, "kWh")
      };
    }
    return {
      value: e.totalEnergy,
      unit: this._resolveUnit("energy_entity", "kWh")
    };
  }
  _isSummaryEnergyConfigured() {
    return this._config ? this._config.use_system_energy_entity ?? !1 ? !!this._config.system_energy_entity?.trim() : this._config.panels.some((e) => !!e.energy_entity) : !1;
  }
  _resolveCustomKpi() {
    const e = this._config?.custom_kpi_title, t = e !== void 0 ? e : "Custom KPI", s = this._getCustomKpiEntityId();
    if (!s)
      return { title: t, value: "Not configured" };
    const r = this.hass?.states?.[s];
    if (!r)
      return { title: t, value: "Unavailable" };
    const o = r.state?.toString().trim().toLowerCase();
    if (!o || o === "unknown" || o === "unavailable")
      return { title: t, value: "Unavailable" };
    const a = Number(r.state);
    if (Number.isFinite(a)) {
      const n = this.hass?.locale?.language ?? "en", l = this._getUnitForEntity(s, ""), d = this._config?.invert_custom_kpi ? ee(a * -1) : ee(a), c = Fr(
        String(d),
        n,
        this._config?.custom_kpi_decimals ?? 0,
        l
      );
      return {
        title: t,
        value: c ?? r.state
      };
    }
    return { title: t, value: r.state };
  }
  _getCustomKpiEntityId() {
    const e = this._config?.custom_kpi_entity?.trim();
    return e && e.length > 0 ? e : null;
  }
  _handlePopupCloseClick(e, t) {
    e.preventDefault(), e.stopPropagation(), t();
  }
  _closeAllPopups() {
    this._selectedPanelId = null, this._showLivePowerPopup = !1, this._showEnergyPopup = !1, this._showCustomKpiPopup = !1, this._showSystemHealthPopup = !1, this._clearPopupScrollRestore();
  }
  _clearPopupScrollRestore() {
    const e = this._popupScrollRestore;
    e?.frameId !== null && typeof window < "u" && window.cancelAnimationFrame(e.frameId), this._popupScrollRestore = null, this._popupScrollRestoreToken++;
  }
  _captureScrollPositionsForPopupGraph(e) {
    const r = (e?.currentTarget instanceof HTMLElement ? e.currentTarget : e?.target instanceof HTMLElement ? e.target : null)?.closest(".spv-popup") ?? null ?? this.renderRoot.querySelector(".spv-popup");
    if (!r)
      return this._popupScrollRestore = null, null;
    const o = ++this._popupScrollRestoreToken;
    return this._popupScrollRestore = {
      token: o,
      popup: r,
      top: r.scrollTop,
      left: r.scrollLeft,
      expiresAt: Date.now() + 2500,
      frameId: null,
      framesRemaining: 0
    }, this._scheduleCapturedScrollRestore(o), o;
  }
  _scheduleCapturedScrollRestore(e, t = 2) {
    if (!e || typeof window > "u")
      return;
    if (!this._hasPopupOpen()) {
      this._popupScrollRestore = null;
      return;
    }
    const s = this._popupScrollRestore;
    if (!(!s || s.token !== e)) {
      if (s.expiresAt < Date.now()) {
        this._popupScrollRestore = null;
        return;
      }
      s.framesRemaining = Math.max(s.framesRemaining, t), s.frameId === null && (s.frameId = window.requestAnimationFrame(() => {
        const r = this._popupScrollRestore;
        if (!(!r || r.token !== e)) {
          if (r.frameId = null, !this._hasPopupOpen()) {
            this._popupScrollRestore = null;
            return;
          }
          if (r.expiresAt < Date.now()) {
            this._popupScrollRestore = null;
            return;
          }
          if (r.popup.isConnected && (r.popup.scrollTop = r.top, r.popup.scrollLeft = r.left), r.framesRemaining = Math.max(0, r.framesRemaining - 1), r.framesRemaining > 0) {
            this._scheduleCapturedScrollRestore(e, r.framesRemaining);
            return;
          }
          this._popupScrollRestore = null;
        }
      }));
    }
  }
  _renderInlinePanelConfig(e) {
    const t = this._config?.panels.find((o) => o.id === e.id);
    if (!t)
      return v;
    const s = this._getAvailableQuickSetupPowerEntities(e.id), r = !(t.enabled ?? !0);
    return g`
      <div class="inline-config">
        <p class="subtitle">Quick Setup:</p>
        <ha-selector
          .hass=${this.hass}
          .value=${t.power_entity ?? ""}
          .required=${!1}
          .selector=${{
      entity: {
        domain: "sensor",
        include_entities: s
      }
    }}
          .label=${"Select panel power sensor"}
          @value-changed=${(o) => this._updatePanelConfigFromCard(e.id, "power_entity", o.detail.value)}
        ></ha-selector>
        ${s.length === 0 ? g`<p class="subtitle">No available W sensors found.</p>` : v}
        <div class="toggle">
          <ha-formfield label="Disable Panel (hide but keep slot when off)">
            <ha-switch
              .checked=${r}
              @change=${(o) => this._updatePanelConfigFromCard(
      e.id,
      "enabled",
      !o.currentTarget.checked
    )}
            ></ha-switch>
          </ha-formfield>
        </div>
      </div>
    `;
  }
  _getAvailableQuickSetupPowerEntities(e) {
    if (!this._config || !this.hass)
      return [];
    const s = this._config.panels.find((a) => a.id === e)?.power_entity, r = new Set(
      this._config.panels.filter((a) => a.id !== e).map((a) => a.power_entity).filter((a) => !!a)
    ), o = [];
    for (const a of Object.values(this.hass.states)) {
      if (!a.entity_id.startsWith("sensor."))
        continue;
      const n = a.attributes?.unit_of_measurement;
      typeof n != "string" || n.trim().toLowerCase() !== "w" || r.has(a.entity_id) && a.entity_id !== s || o.push(a.entity_id);
    }
    return typeof s == "string" && s.length > 0 && !o.includes(s) && o.push(s), o.sort((a, n) => a.localeCompare(n));
  }
  _updatePanelConfigFromCard(e, t, s) {
    if (!this._config)
      return;
    const r = this._config.panels.findIndex((n) => n.id === e);
    if (r < 0)
      return;
    const o = this._config.panels.map((n, l) => {
      if (l !== r)
        return n;
      const d = { ...n, [t]: s };
      if (t === "power_entity") {
        const c = n.power_entity, p = typeof s == "string" ? s.trim() : "", h = this._getEntityFriendlyName(p);
        h && this._shouldAutoRenamePanelName(n.name, n.id, c) && (d.name = h);
      }
      return d;
    }), a = Fe({
      ...this._config,
      panels: o
    });
    this._commitConfigFromCard(a), t === "power_entity" && (typeof s == "string" ? s.trim() : "").length > 0 && (this._selectedPanelId = e, this._ensurePopupGraphLoaded(e, this._popupGraphRangeHours));
  }
  _getEntityFriendlyName(e) {
    const t = e?.trim();
    if (!t)
      return;
    const r = this.hass?.states?.[t]?.attributes?.friendly_name;
    if (typeof r != "string")
      return;
    const o = r.trim();
    return o.length > 0 ? o : void 0;
  }
  _shouldAutoRenamePanelName(e, t, s) {
    const r = e?.trim() ?? "";
    if (!r || r === t || /^panel\s+\d+$/i.test(r))
      return !0;
    const o = this._getEntityFriendlyName(s);
    return !!(o && r === o);
  }
  _handleDragStart(e, t) {
    this._dragSourceSlotIndex = t, e.dataTransfer && (e.dataTransfer.effectAllowed = "move", e.dataTransfer.setData("text/plain", String(t)));
  }
  _handleDrop(e, t) {
    if (e.preventDefault(), !this._config)
      return;
    const s = this._dragSourceSlotIndex ?? Number(e.dataTransfer?.getData("text/plain") ?? Number.NaN);
    if (!Number.isFinite(s) || s === t)
      return;
    const r = [...this._config.panels], o = r[s], a = r[t];
    !o || !a || (r[s] = a, r[t] = o, this._commitConfigFromCard(
      Fe({
        ...this._config,
        panels: r
      })
    ));
  }
  _commitConfigFromCard(e) {
    this._config = e, this._historySignature = "", this._historyQuerySignature = "", this._historyLastLoadMs = 0, this._historyLoadToken = 0, this._popupGraphCache = {}, this._popupGraphLatestTokenByKey = {}, this._kpiCompareCache = {}, this._kpiCompareLatestTokenByKey = {}, this._kpiCompareExpanded = { power: !1, energy: !1 }, this._kpiCompareRangeHours = { power: 6, energy: 6 }, this._ensureHistoryLoaded(), this._refreshDerived(), this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: e },
        bubbles: !0,
        composed: !0
      })
    ), typeof window < "u" && window.dispatchEvent(
      new CustomEvent(ui, {
        detail: { config: e }
      })
    ), this._persistConfigToLovelace(e);
  }
  async _persistConfigToLovelace(e) {
    if (!this.hass?.callWS)
      return;
    const t = ++this._persistConfigToken, s = this._findLovelaceContext(), r = this._resolveDashboardUrlPath(s);
    try {
      const o = s && typeof s.config == "object" ? s.config : await this.hass.callWS({
        type: "lovelace/config",
        ...r ? { url_path: r } : {}
      });
      if (t !== this._persistConfigToken)
        return;
      const { config: a, replaced: n } = this._replaceCardConfigInDashboardConfig(
        o,
        e
      );
      if (!n) {
        console.warn("Solar Panel Visualizer: Could not locate card config to persist changes.");
        return;
      }
      if (await this.hass.callWS({
        type: "lovelace/config/save",
        ...r ? { url_path: r } : {},
        config: a
      }), t !== this._persistConfigToken)
        return;
      s && (s.config = a), this._sourceConfigRef = void 0;
    } catch (o) {
      console.warn("Solar Panel Visualizer: Failed to persist dashboard config.", o);
    }
  }
  _findLovelaceContext() {
    const e = /* @__PURE__ */ new Set();
    let t = this;
    for (; t && !e.has(t); ) {
      if (e.add(t), typeof t == "object" && t !== null && "lovelace" in t && t.lovelace && typeof t.lovelace == "object")
        return t.lovelace;
      const s = t, r = typeof s.getRootNode == "function" ? s.getRootNode() : null, o = r && "host" in r ? r.host : null;
      if (o && o !== t) {
        t = o;
        continue;
      }
      t = s.parentElement ?? null;
    }
    return null;
  }
  _resolveDashboardUrlPath(e) {
    const t = e?.urlPath?.trim();
    if (t)
      return t;
    if (typeof window > "u")
      return;
    const s = window.location.pathname.replace(/^\/+/, "").split("/")[0]?.trim();
    return s && s.length > 0 ? s : void 0;
  }
  _replaceCardConfigInDashboardConfig(e, t) {
    const s = this._replaceFirstMatch(
      e,
      (o) => !!this._sourceConfigRef && o === this._sourceConfigRef,
      t
    );
    if (s.replaced)
      return {
        config: s.value,
        replaced: !0
      };
    const r = this._replaceFirstMatch(
      e,
      (o) => this._matchesCurrentCardSignature(o),
      t
    );
    return {
      config: r.value,
      replaced: r.replaced
    };
  }
  _replaceFirstMatch(e, t, s) {
    let r = !1;
    const o = (a) => {
      if (r)
        return a;
      if (t(a))
        return r = !0, s;
      if (Array.isArray(a)) {
        let d = !1;
        const c = a.map((p) => {
          const h = o(p);
          return h !== p && (d = !0), h;
        });
        return d ? c : a;
      }
      if (typeof a != "object" || a === null)
        return a;
      let n = !1;
      const l = {};
      for (const [d, c] of Object.entries(a)) {
        const p = o(c);
        l[d] = p, p !== c && (n = !0);
      }
      return n ? l : a;
    };
    return { value: o(e), replaced: r };
  }
  _matchesCurrentCardSignature(e) {
    if (!this._config || typeof e != "object" || e === null)
      return !1;
    const t = e;
    if (t.type !== this._config.type)
      return !1;
    const s = Number(t.rows), r = Number(t.columns);
    if (s !== this._config.rows || r !== this._config.columns)
      return !1;
    const a = (Array.isArray(t.panels) ? t.panels : []).map(
      (l) => typeof l == "object" && l !== null && typeof l.id == "string" ? l.id : ""
    ).sort().join("|"), n = this._config.panels.map((l) => l.id).sort().join("|");
    return a.length > 0 && a === n;
  }
  _adjustGraphSamplesForEntity(e, t) {
    const s = this._getSystemPowerEntityId(), r = (this._config?.invert_system_power ?? !1) && !!s && e === s;
    return t.map((o) => ({
      ts: o.ts,
      value: ee(r ? o.value * -1 : o.value)
    }));
  }
  _expandSinglePointRangeSamples(e, t) {
    if (e.length !== 1)
      return e;
    const s = e[0].value, r = Date.now();
    return [
      { ts: r - t * 60 * 60 * 1e3, value: s },
      { ts: r, value: s }
    ];
  }
  _fillRangeStartWithFirstSample(e, t, s) {
    if (!s || e.length === 0)
      return e;
    const o = Date.now() - t * 60 * 60 * 1e3, a = [...e].sort((l, d) => l.ts - d.ts), n = a[0];
    return !n || n.ts <= o ? a : [{ ts: o, value: n.value }, ...a];
  }
  _getPowerEntities() {
    if (!this._config)
      return [];
    const e = this._config.panels.map((t) => t.power_entity).filter((t) => !!t);
    return [...new Set(e)];
  }
  _getHistoryHours() {
    return this._config?.deviation_history_hours ?? 12;
  }
  _getHistoryQuerySignature() {
    if (!this._config || !this.hass)
      return "";
    const e = this._getPowerEntities().sort().join("|");
    return `${this._getHistoryHours()}:${e}`;
  }
  _getHistorySignature() {
    if (!this._config || !this.hass)
      return "";
    const e = this._getHistoryQuerySignature(), t = this._getRestartToken();
    return `${e}:${t ?? ""}`;
  }
  _getRestartToken() {
    const e = this._config?.deviation_restart_entity;
    if (!e)
      return;
    const t = this.hass?.states?.[e], s = t?.state?.toString().trim();
    if (!s)
      return;
    const r = Date.parse(s);
    if (Number.isFinite(r))
      return String(r);
    const o = [
      t?.attributes?.last_restart,
      t?.attributes?.last_reset,
      t?.attributes?.boot_time,
      t?.attributes?.started,
      t?.attributes?.start_time
    ];
    for (const a of o) {
      if (typeof a != "string" || a.trim().length === 0)
        continue;
      const n = Date.parse(a);
      if (Number.isFinite(n))
        return String(n);
    }
    if (!/^[-+]?\d+(\.\d+)?$/.test(s))
      return s;
  }
  _historyCacheKey() {
    return `${hi}${this._getHistorySignature()}`;
  }
  _pruneSamples(e, t = this._getHistoryHours()) {
    const r = Date.now() - t * 60 * 60 * 1e3;
    return e.filter((o) => o.ts >= r && Number.isFinite(o.value)).sort((o, a) => o.ts - a.ts);
  }
  _syncLiveSamplesFromHass() {
    if (!this.hass || !this._config)
      return;
    let e = !1;
    const t = Date.now();
    for (const s of this._config.panels) {
      const r = s.power_entity;
      if (!r)
        continue;
      const o = this.hass.states[r], a = Number(o?.state);
      if (!Number.isFinite(a))
        continue;
      const l = [...this._historyByEntityId[r] ?? []], d = l[l.length - 1];
      (!d || Math.abs(t - d.ts) > 6e4 || Math.abs(d.value - a) > 0.01) && (l.push({ ts: t, value: a }), this._historyByEntityId[r] = this._pruneSamples(l), e = !0);
    }
    e && this._saveHistoryCache();
  }
  _saveHistoryCache() {
    if (typeof window > "u" || !this._config)
      return;
    const e = {
      v: zt,
      savedAt: Date.now(),
      samples: this._historyByEntityId,
      reason: this._historyStateReason
    };
    try {
      window.localStorage.setItem(this._historyCacheKey(), JSON.stringify(e));
    } catch {
    }
  }
  _loadHistoryCache() {
    if (!(typeof window > "u"))
      try {
        const e = window.localStorage.getItem(this._historyCacheKey());
        if (!e)
          return;
        const t = JSON.parse(e);
        if (t.v !== zt || !t.samples)
          return;
        const s = {};
        for (const [r, o] of Object.entries(t.samples))
          s[r] = this._pruneSamples(o);
        this._historyByEntityId = s;
      } catch {
      }
  }
  _ensureHistoryLoaded() {
    if (!this.hass || !this._config)
      return;
    if (!(this._config.enable_array_checks ?? !1)) {
      this._historyState = "idle", this._historyStateReason = void 0, this._historySignature = "", this._historyQuerySignature = "", this._historyLastLoadMs = 0, this._historyByEntityId = {};
      return;
    }
    const e = this._getHistorySignature();
    if (!e || e === this._historySignature && this._historyState !== "idle")
      return;
    const t = this._getHistoryQuerySignature(), s = Date.now();
    if (this._historyState === "loading" && t === this._historyQuerySignature) {
      this._historySignature = e;
      return;
    }
    if (t === this._historyQuerySignature && this._historyState !== "idle" && s - this._historyLastLoadMs < _i) {
      this._historySignature = e;
      return;
    }
    this._historySignature = e, this._historyQuerySignature = t, this._historyLastLoadMs = s, this._historyByEntityId = {}, this._loadHistoryCache();
    const r = ++this._historyLoadToken;
    this._loadHistoryFromRecorder(r);
  }
  async _loadHistoryFromRecorder(e) {
    if (!this.hass || !this._config)
      return;
    const t = this._getPowerEntities();
    if (t.length === 0) {
      this._historyState = "ready", this._historyStateReason = "No panel sensors configured.", this._refreshDerived(), this.requestUpdate();
      return;
    }
    if (!this.hass.callApi && !this.hass.callWS) {
      this._historyState = "unavailable", this._historyStateReason = "Solar panel history API unavailable in this Home Assistant build.", this._refreshDerived(), this.requestUpdate();
      return;
    }
    const s = Date.now(), r = new Date(s - this._getHistoryHours() * 60 * 60 * 1e3).toISOString(), o = new Date(s).toISOString();
    this._historyState = "loading", this._historyStateReason = void 0, this.requestUpdate();
    try {
      const a = await this._fetchRecorderHistoryRaw(r, o, t);
      if (e !== this._historyLoadToken)
        return;
      const n = this._parseRecorderResponse(a, this._getHistoryHours(), t);
      Object.keys(n).length === 0 ? (this._historyState = "fallback", this._historyStateReason = "Solar panel history returned no samples, using live warm-up only.") : (this._historyByEntityId = {
        ...this._historyByEntityId,
        ...n
      }, this._historyState = "ready", this._historyStateReason = void 0);
    } catch {
      if (e !== this._historyLoadToken)
        return;
      this._historyState = "fallback", this._historyStateReason = "Failed to read solar panel history, using live warm-up only.";
    }
    this._syncLiveSamplesFromHass(), this._saveHistoryCache(), this._refreshDerived(), this.requestUpdate();
  }
  async _fetchRecorderHistoryRaw(e, t, s) {
    if (!this.hass)
      throw new Error("Home Assistant context unavailable");
    const r = [], o = s.join(","), a = `history/period/${e}`, n = `history/period/${encodeURIComponent(e)}`, l = [], d = {
      end_time: t,
      filter_entity_id: o,
      no_attributes: !0,
      significant_changes_only: !1,
      minimal_response: !0
    }, c = {
      end_time: t,
      filter_entity_id: o
    };
    if (l.push({ path: a, params: c }), l.push({ path: a, params: d }), n !== a && (l.push({ path: n, params: c }), l.push({ path: n, params: d })), this.hass.callApi)
      for (const p of l)
        try {
          return await this.hass.callApi("GET", p.path, p.params);
        } catch (h) {
          r.push(h);
        }
    if (this.hass.callWS) {
      const p = [
        {
          type: "history/history_during_period",
          start_time: e,
          end_time: t,
          entity_ids: s,
          no_attributes: !0,
          significant_changes_only: !1,
          minimal_response: !0
        },
        {
          type: "history/history_during_period",
          start_time: e,
          end_time: t,
          entity_ids: s
        }
      ];
      for (const h of p)
        try {
          return await this.hass.callWS(h);
        } catch (u) {
          r.push(u);
        }
    }
    throw r.length > 0 ? r[r.length - 1] : new Error("Recorder API unavailable");
  }
  _parseRecorderResponse(e, t = this._getHistoryHours(), s = []) {
    const r = {}, o = (l) => {
      if (typeof l == "number" && Number.isFinite(l))
        return l > 1e11 ? l : l * 1e3;
      if (typeof l == "string" && l.trim().length > 0) {
        const d = l.trim(), c = Number(d);
        if (Number.isFinite(c) && /^\d+(\.\d+)?$/.test(d))
          return c > 1e11 ? c : c * 1e3;
        const p = Date.parse(d);
        if (Number.isFinite(p))
          return p;
      }
      return Number.NaN;
    }, a = (l, d) => {
      if (!Array.isArray(l) || l.length === 0)
        return;
      let c = d;
      for (const p of l) {
        if (Array.isArray(p)) {
          if (!c || p.length < 2)
            continue;
          const $ = o(p[0]), P = Number(p[1]), F = o(p[1]), O = Number(p[0]);
          let w = $, E = P;
          if ((!Number.isFinite(w) || !Number.isFinite(E)) && (w = F, E = O), !Number.isFinite(w) || !Number.isFinite(E))
            continue;
          r[c] || (r[c] = []), r[c].push({ ts: w, value: E });
          continue;
        }
        if (typeof p != "object" || p === null)
          continue;
        const h = p, u = typeof h.entity_id == "string" && h.entity_id.length > 0 ? h.entity_id : typeof h.e == "string" && h.e.length > 0 ? h.e : c;
        if (!u)
          continue;
        c = u;
        const y = Number(h.state ?? h.s);
        if (!Number.isFinite(y))
          continue;
        const S = typeof h.last_changed == "string" ? h.last_changed : typeof h.last_updated == "string" ? h.last_updated : h.lc ?? h.lu ?? h.last_changed_ts ?? h.last_updated_ts ?? h.ts, C = o(S);
        Number.isFinite(C) && (r[u] || (r[u] = []), r[u].push({ ts: C, value: y }));
      }
    }, n = typeof e == "object" && e !== null && "result" in e ? e.result : e;
    if (Array.isArray(n))
      for (const [l, d] of n.entries())
        a(d, s[l]);
    else if (typeof n == "object" && n !== null)
      for (const [l, d] of Object.entries(
        n
      ))
        a(d, l);
    else
      return r;
    for (const [l, d] of Object.entries(r))
      r[l] = this._pruneSamples(d, t);
    return r;
  }
};
ce.properties = {
  hass: { attribute: !1 },
  _config: { state: !0 },
  _derived: { state: !0 },
  _cardWidth: { state: !0 },
  _selectedPanelId: { state: !0 },
  _showLivePowerPopup: { state: !0 },
  _showEnergyPopup: { state: !0 },
  _showCustomKpiPopup: { state: !0 },
  _showSystemHealthPopup: { state: !0 },
  _popupGraphRangeHours: { state: !0 },
  _popupGraphCache: { state: !0 },
  _kpiCompareExpanded: { state: !0 },
  _kpiCompareRangeHours: { state: !0 },
  _kpiCompareCache: { state: !0 }
}, ce.styles = [ct`
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
      overflow: auto;
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
      letter-spacing: 0.12em;
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

    .slot::before {
      content: "";
      position: absolute;
      inset: -16px -7px -7px -34px;
      z-index: -1;
      border-bottom-right-radius: 12px;
      background: radial-gradient(
        ellipse at bottom right,
        color-mix(in srgb, var(--spv-surface-bg) 88%, transparent) 0%,
        color-mix(in srgb, var(--spv-surface-bg) 62%, transparent) 42%,
        transparent 76%
      );
      pointer-events: none;
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
      scrollbar-color: color-mix(in srgb, var(--spv-text-muted) 38%, transparent) transparent;
    }

    .panel-detail-scroll::-webkit-scrollbar {
      width: 0;
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
      -webkit-mask-image: linear-gradient(to bottom, #000 0, #000 calc(100% - 24px), transparent 100%);
      mask-image: linear-gradient(to bottom, #000 0, #000 calc(100% - 24px), transparent 100%);
      -webkit-mask-repeat: no-repeat;
      mask-repeat: no-repeat;
    }

    .panel.has-detail-overflow .panel-detail-scroll::-webkit-scrollbar {
      width: 0;
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
      position: absolute;
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
      height: 36px;
      margin-bottom: -36px;
      display: flex;
      justify-content: flex-end;
      pointer-events: none;
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

    .spv-popup-close-anchor .spv-popup-close {
      pointer-events: auto;
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

  `, Zr];
let at = ce;
class Is extends at {
}
customElements.get("solar-panel-visualizer") || customElements.define("solar-panel-visualizer", Is);
if (!customElements.get("solar-panel-visualizer-card")) {
  class i extends Is {
  }
  customElements.define("solar-panel-visualizer-card", i);
}
const vi = /(\d+)/, Wt = (i) => {
  const e = vi.exec(i);
  if (!e)
    return null;
  const t = Number(e[1]);
  return Number.isFinite(t) ? t : null;
}, bi = (i) => {
  const e = Wt(i.entityId);
  return e !== null ? e : i.friendlyName ? Wt(i.friendlyName) : null;
}, wi = (i) => {
  const e = i.map((s) => ({
    ...s,
    sortNumber: bi(s)
  }));
  return e.some((s) => s.sortNumber !== null) ? [...e].sort((s, r) => s.sortNumber === null && r.sortNumber === null ? s.entityId.localeCompare(r.entityId) : s.sortNumber === null ? 1 : r.sortNumber === null ? -1 : s.sortNumber !== r.sortNumber ? s.sortNumber - r.sortNumber : s.entityId.localeCompare(r.entityId)).map(({ entityId: s, friendlyName: r }) => ({ entityId: s, friendlyName: r })) : [...e].sort((s, r) => s.entityId.localeCompare(r.entityId)).map(({ entityId: s, friendlyName: r }) => ({ entityId: s, friendlyName: r }));
}, xi = (i, e, t) => {
  const s = e.trim().replace(/\*+$/, "");
  if (s.length === 0)
    return [];
  const r = s.startsWith("sensor."), o = s.toLowerCase(), a = [];
  for (const [n, l] of Object.entries(i)) {
    if (!n.startsWith("sensor."))
      continue;
    const d = l.attributes?.unit_of_measurement;
    if (typeof d != "string")
      continue;
    const c = d.trim().toLowerCase();
    if (!t(c))
      continue;
    const p = typeof l.attributes?.friendly_name == "string" ? l.attributes.friendly_name : void 0, h = p?.trim().toLowerCase();
    (r ? n.startsWith(s) : h?.includes(o)) && a.push({
      entityId: n,
      friendlyName: p
    });
  }
  return wi(a);
}, Ut = (i, e, t, s, r) => {
  const o = s.trim().replace(/\*+$/, "");
  if (o.length === 0)
    return {
      panels: [...i],
      matched: 0,
      filled: 0,
      skipped: i.length
    };
  const a = xi(e, o, r), n = new Set(
    i.map((u) => u[t]).filter((u) => typeof u == "string" && u.length > 0)
  ), l = a.map((u) => u.entityId).filter((u) => !n.has(u));
  let d = 0, c = 0, p = 0;
  return {
    panels: i.map((u) => {
      const y = { ...u };
      if (y.enabled === !1)
        return p += 1, y;
      const S = y[t];
      if (typeof S == "string" && S.trim().length > 0)
        return p += 1, y;
      const C = l[d];
      return C ? (y[t] = C, d += 1, c += 1, y) : (p += 1, y);
    }),
    matched: a.length,
    filled: c,
    skipped: p
  };
}, $i = (i, e, t, s) => {
  const r = i?.trim() ?? "";
  if (!r || r === e || /^panel\s+\d+$/i.test(r))
    return !0;
  const o = s(t);
  return !!(o && r === o);
}, Pi = (i, e) => i.map((t) => {
  const s = t.power_entity?.trim();
  if (!s)
    return t;
  const r = e(s);
  return r ? {
    ...t,
    name: r
  } : t;
}), Kt = "spv-card-config-updated", Si = (i, e) => {
  i.dispatchEvent(
    new CustomEvent("config-changed", {
      detail: { config: e },
      bubbles: !0,
      composed: !0
    })
  );
}, Rs = (i) => typeof i == "string" ? i.trim().toLowerCase() : "", le = (i, e) => {
  const t = Rs(i.attributes?.unit_of_measurement);
  return t.length > 0 && e.includes(t);
}, pe = (i, e) => {
  const t = Rs(i.attributes?.device_class);
  return t.length > 0 && e.includes(t);
}, Vt = [
  {
    key: "inverter_ac_power_entity",
    labelKey: "editor.field.advanced_inverter_ac_power",
    matcher: (i) => le(i, ["w", "kw"]) || pe(i, ["power"])
  },
  {
    key: "inverter_ac_voltage_entity",
    labelKey: "editor.field.advanced_inverter_ac_voltage",
    matcher: (i) => le(i, ["v", "kv", "mv"]) || pe(i, ["voltage"])
  },
  {
    key: "inverter_ac_current_entity",
    labelKey: "editor.field.advanced_inverter_ac_current",
    matcher: (i) => le(i, ["a", "ma"]) || pe(i, ["current"])
  },
  {
    key: "inverter_temp_entity",
    labelKey: "editor.field.advanced_inverter_temp",
    matcher: (i) => pe(i, ["temperature"]) || le(i, ["°c", "°f", "℃", "℉", "c", "f"])
  },
  {
    key: "panel_current_entity",
    labelKey: "editor.field.advanced_panel_current",
    matcher: (i) => le(i, ["a", "ma"]) || pe(i, ["current"])
  },
  {
    key: "panel_voltage_entity",
    labelKey: "editor.field.advanced_panel_voltage",
    matcher: (i) => le(i, ["v", "kv", "mv"]) || pe(i, ["voltage"])
  },
  {
    key: "panel_power_entity",
    labelKey: "editor.field.advanced_panel_power",
    matcher: (i) => le(i, ["w", "kw"]) || pe(i, ["power"])
  }
], je = class je extends ge {
  constructor() {
    super(...arguments), this._config = this._normalizeEditorConfig({
      type: this._getCardType()
    }), this._autoFillPowerPrefix = "", this._autoFillEnergyPrefix = "", this._autoFillResultMessage = "", this._applyDefaultRatedPowerToAllPanels = () => {
      const e = this._config.default_panel_rated_power_w;
      if (!e)
        return;
      const t = this._config.panels.map((s) => ({
        ...s,
        rated_power_w: e
      }));
      this._commit(
        this._normalizeEditorConfig({
          ...this._config,
          panels: t
        })
      );
    }, this._handleAutoPopulateSensors = () => {
      if (!this.hass)
        return;
      const e = this._autoFillPowerPrefix.trim(), t = this._autoFillEnergyPrefix.trim();
      if (!e && !t) {
        this._autoFillResultMessage = this._t("editor.autofill.enter_prefix");
        return;
      }
      let s = [...this._config.panels];
      const r = [];
      if (e) {
        s = s.map((a) => ({ ...a, power_entity: void 0 }));
        const o = Ut(
          s,
          this.hass.states,
          "power_entity",
          e,
          (a) => a === "w"
        );
        s = o.panels, r.push(
          this._t("editor.autofill.power_summary", {
            matched: o.matched,
            filled: o.filled,
            skipped: o.skipped
          })
        );
      }
      if (t) {
        s = s.map((a) => ({ ...a, energy_entity: void 0 }));
        const o = Ut(
          s,
          this.hass.states,
          "energy_entity",
          t,
          (a) => a === "kwh" || a === "wh"
        );
        s = o.panels, r.push(
          this._t("editor.autofill.energy_summary", {
            matched: o.matched,
            filled: o.filled,
            skipped: o.skipped
          })
        );
      }
      s = Pi(
        s,
        (o) => this._getEntityFriendlyName(o)
      ), this._autoFillResultMessage = r.join(" "), this._commit(
        this._normalizeEditorConfig({
          ...this._config,
          panels: s
        })
      );
    }, this._handleRemoveAllPanelSensors = () => {
      const e = this._config.panels.map((t) => ({
        ...t,
        power_entity: void 0,
        energy_entity: void 0,
        show_energy: !1,
        inverter_status_entity: void 0,
        error_entity: void 0,
        advanced_metrics: void 0
      }));
      this._autoFillResultMessage = this._t("editor.autofill.cleared"), this._commit(
        this._normalizeEditorConfig({
          ...this._config,
          panels: e
        })
      );
    }, this._handleCardConfigSync = (e) => {
      const s = e.detail?.config;
      if (!s || typeof s != "object")
        return;
      const r = this._normalizeEditorConfig(
        s
      );
      this._isReorderOnlySync(r) && this._commit(r);
    };
  }
  connectedCallback() {
    super.connectedCallback(), window.addEventListener(Kt, this._handleCardConfigSync);
  }
  disconnectedCallback() {
    window.removeEventListener(Kt, this._handleCardConfigSync), super.disconnectedCallback();
  }
  setConfig(e) {
    this._config = this._normalizeEditorConfig(e ?? {});
  }
  _getCardType() {
    return Ye;
  }
  _normalizeEditorConfig(e) {
    return Fe(e);
  }
  _renderExtraSections() {
    return v;
  }
  _t(e, t) {
    return xs(this.hass, e, t);
  }
  render() {
    if (!this.hass)
      return v;
    const e = !!this.hass.states["sensor.power_production_now"], t = !!this.hass.states["sensor.energy_production_today"], s = e && t ? this._t("editor.forecast.detected") : this._t("editor.forecast.missing");
    return g`
      <div class="editor">
        <section class="section">
          <div class="section-header">
            <h3 class="section-title">${this._t("editor.section.layout_title")}</h3>
            <p class="section-copy">
              ${this._t("editor.section.layout_copy")}
            </p>
          </div>

          <div class="grid">
            ${this._renderTextField("title", this._t("editor.field.title"), this._config.title ?? "")}
            ${this._renderNumberField("rows", this._t("editor.field.rows"), this._config.rows, 1, 12)}
            ${this._renderNumberField(
      "columns",
      this._t("editor.field.columns"),
      this._config.columns,
      1,
      12
    )}
            ${this._renderNumberField(
      "max_card_width_px",
      this._t("editor.field.max_card_width"),
      this._config.max_card_width_px ?? 980,
      300,
      2400
    )}
            ${this._renderOptionalNumberField(
      "max_card_height_px",
      this._t("editor.field.max_card_height"),
      this._config.max_card_height_px,
      300,
      2600
    )}
          </div>
        </section>

        <section class="section">
          <div class="section-header">
            <h3 class="section-title">${this._t("editor.section.appearance_title")}</h3>
            <p class="section-copy">
              ${this._t("editor.section.appearance_copy")}
            </p>
          </div>
          <div class="grid">
            ${this._renderSelectField(
      "theme_mode",
      this._t("editor.field.theme_mode"),
      this._config.theme_mode ?? "auto",
      [
        { value: "auto", label: this._t("editor.select.theme_auto") },
        { value: "dark", label: this._t("editor.select.theme_dark") },
        { value: "light", label: this._t("editor.select.theme_light") }
      ]
    )}
          </div>
        </section>

        <section class="section">
          <div class="section-header">
            <h3 class="section-title">${this._t("editor.section.display_title")}</h3>
            <p class="section-copy">
              ${this._t("editor.section.display_copy")}
            </p>
          </div>
          <div class="grid">
            ${this._renderNumberField(
      "power_decimals",
      this._t("editor.field.power_decimals"),
      this._config.power_decimals ?? 0,
      0,
      4
    )}
            ${this._renderNumberField(
      "energy_decimals",
      this._t("editor.field.energy_decimals"),
      this._config.energy_decimals ?? 2,
      0,
      4
    )}
            ${this._renderNumberField(
      "custom_kpi_decimals",
      this._t("editor.field.custom_kpi_decimals"),
      this._config.custom_kpi_decimals ?? 0,
      0,
      4
    )}
            ${this._renderSelectField(
      "panel_tap_action",
      this._t("editor.field.panel_tap_action"),
      this._config.panel_tap_action ?? "details",
      [
        { value: "details", label: this._t("editor.select.panel_tap_details") },
        { value: "none", label: this._t("editor.select.panel_tap_none") }
      ]
    )}
          </div>
          <div class="toggle">
            <ha-formfield label=${this._t("editor.toggle.use_system_power")}>
              <ha-switch
                .checked=${this._config.use_system_power_entity ?? !1}
                @change=${(r) => this._updateRootValue(
      "use_system_power_entity",
      r.currentTarget.checked
    )}
              ></ha-switch>
            </ha-formfield>
          </div>
          ${this._renderSelectorWithClear(
      this._t("editor.field.system_power_sensor"),
      this._config.system_power_entity,
      {
        entity: {
          domain: "sensor"
        }
      },
      (r) => this._updateRootValue("system_power_entity", r)
    )}
          <div class="toggle">
            <ha-formfield label=${this._t("editor.toggle.invert_system_power")}>
              <ha-switch
                .checked=${this._config.invert_system_power ?? !1}
                @change=${(r) => this._updateRootValue(
      "invert_system_power",
      r.currentTarget.checked
    )}
              ></ha-switch>
            </ha-formfield>
          </div>
          <div class="toggle">
            <ha-formfield label=${this._t("editor.toggle.use_system_energy")}>
              <ha-switch
                .checked=${this._config.use_system_energy_entity ?? !1}
                @change=${(r) => this._updateRootValue(
      "use_system_energy_entity",
      r.currentTarget.checked
    )}
              ></ha-switch>
            </ha-formfield>
          </div>
          ${this._renderSelectorWithClear(
      this._t("editor.field.system_energy_sensor"),
      this._config.system_energy_entity,
      {
        entity: {
          domain: "sensor"
        }
      },
      (r) => this._updateRootValue("system_energy_entity", r)
    )}
          ${this._renderSelectorWithClear(
      this._t("editor.field.custom_kpi_sensor"),
      this._config.custom_kpi_entity,
      {
        entity: {
          domain: "sensor"
        }
      },
      (r) => this._updateRootValue("custom_kpi_entity", r)
    )}
          <div class="toggle">
            <ha-formfield label=${this._t("editor.toggle.invert_custom_kpi")}>
              <ha-switch
                .checked=${this._config.invert_custom_kpi ?? !1}
                @change=${(r) => this._updateRootValue(
      "invert_custom_kpi",
      r.currentTarget.checked
    )}
              ></ha-switch>
            </ha-formfield>
          </div>
          ${this._renderTextField(
      "custom_kpi_title",
      this._t("editor.field.custom_kpi_heading"),
      this._config.custom_kpi_title ?? ""
    )}
          <div class="toggle">
            <ha-formfield label=${this._t("editor.toggle.show_custom_kpi")}>
              <ha-switch
                .checked=${this._config.show_custom_kpi ?? !0}
                @change=${(r) => this._updateRootValue(
      "show_custom_kpi",
      r.currentTarget.checked
    )}
              ></ha-switch>
            </ha-formfield>
          </div>
          <div class="toggle">
            <ha-formfield label=${this._t("editor.toggle.limit_panel_width")}>
              <ha-switch
                .checked=${this._config.limit_panel_width ?? !1}
                @change=${(r) => this._updateRootValue(
      "limit_panel_width",
      r.currentTarget.checked
    )}
              ></ha-switch>
            </ha-formfield>
          </div>
          <ha-textfield
            .label=${this._t("editor.field.max_panel_tile_width")}
            .value=${String(this._config.panel_max_width_px ?? 220)}
            type="number"
            .min=${"120"}
            .max=${"320"}
            .disabled=${!(this._config.limit_panel_width ?? !1)}
            @change=${(r) => this._updateRootValue(
      "panel_max_width_px",
      this._parseNumberWithClamp(
        r.currentTarget.value,
        this._config.panel_max_width_px ?? 220,
        120,
        320
      )
    )}
          ></ha-textfield>
        </section>

        <section class="section">
          <div class="section-header">
            <h3 class="section-title">${this._t("editor.section.forecast_title")}</h3>
            <p class="section-copy">
              ${this._t("editor.section.forecast_copy")}
            </p>
            <p class="section-copy">
              ${this._t("editor.forecast.default_sensors")}
            </p>
            <p class="section-copy">
              ${this._t("editor.forecast.line_help")}
            </p>
          </div>
          <div class="toggle">
            <ha-formfield label=${this._t("editor.toggle.enable_forecast_overlay")}>
              <ha-switch
                .checked=${this._config.enable_forecast_overlay ?? !1}
                @change=${(r) => this._updateRootValue(
      "enable_forecast_overlay",
      r.currentTarget.checked
    )}
              ></ha-switch>
            </ha-formfield>
          </div>
          <p class="section-copy">${s}</p>
        </section>

        <section class="section">
          <div class="section-header">
            <h3 class="section-title">${this._t("editor.section.array_health_title")}</h3>
            <p class="section-copy">
              ${this._t("editor.section.array_health_copy")}
            </p>
          </div>
          <div class="toggle">
            <ha-formfield label=${this._t("editor.toggle.enable_array_health")}>
              <ha-switch
                .checked=${this._config.enable_array_checks ?? !1}
                @change=${(r) => this._updateRootValue(
      "enable_array_checks",
      r.currentTarget.checked
    )}
              ></ha-switch>
            </ha-formfield>
          </div>
          <p class="section-copy">
            ${this._t("editor.section.array_health_smoothing_help")}
          </p>
          <div class="grid">
            ${this._renderNumberField(
      "deviation_threshold_percent",
      this._t("editor.field.deviation_threshold"),
      this._config.deviation_threshold_percent ?? 15,
      1,
      100
    )}
            ${this._renderNumberField(
      "deviation_absolute_w_threshold",
      this._t("editor.field.deviation_absolute_shortfall"),
      this._config.deviation_absolute_w_threshold ?? 50,
      0,
      5e3
    )}
            ${this._renderNumberField(
      "deviation_min_runtime_minutes",
      this._t("editor.field.deviation_check_time"),
      this._config.deviation_min_runtime_minutes ?? 15,
      0,
      1440
    )}
            ${this._renderNumberField(
      "deviation_min_active_panels",
      this._t("editor.field.deviation_min_active_panels"),
      this._config.deviation_min_active_panels ?? 3,
      2,
      30
    )}
            ${this._renderNumberField(
      "deviation_min_samples",
      this._t("editor.field.deviation_min_samples"),
      this._config.deviation_min_samples ?? 3,
      1,
      120
    )}
            ${this._renderNumberField(
      "deviation_smoothing_minutes",
      this._t("editor.field.deviation_smoothing"),
      this._config.deviation_smoothing_minutes ?? 0,
      0,
      1440
    )}
            ${this._renderNumberField(
      "deviation_dynamic_floor_w",
      this._t("editor.field.deviation_dynamic_floor"),
      this._config.deviation_dynamic_floor_w ?? 20,
      0,
      5e3
    )}
            ${this._renderNumberField(
      "deviation_history_hours",
      this._t("editor.field.deviation_history_window"),
      this._config.deviation_history_hours ?? 12,
      1,
      168
    )}
          </div>
        </section>

        <section class="section">
          <div class="section-header">
            <h3 class="section-title">${this._t("editor.section.inverter_title")}</h3>
            <p class="section-copy">
              ${this._t("editor.section.inverter_copy")}
            </p>
          </div>
          <div class="toggle">
            <ha-formfield label=${this._t("editor.toggle.enable_inverter_status")}>
              <ha-switch
                .checked=${this._config.enable_inverter_status ?? !1}
                @change=${(r) => this._updateRootValue(
      "enable_inverter_status",
      r.currentTarget.checked
    )}
              ></ha-switch>
            </ha-formfield>
            <ha-formfield label=${this._t("editor.toggle.show_inverter_status_tiles")}>
              <ha-switch
                .checked=${this._config.show_inverter_status_on_tiles ?? !1}
                @change=${(r) => this._updateRootValue(
      "show_inverter_status_on_tiles",
      r.currentTarget.checked
    )}
              ></ha-switch>
            </ha-formfield>
          </div>
          <ha-textfield
            .label=${this._t("editor.field.fault_terms")}
            .value=${(this._config.inverter_fault_terms ?? []).join(", ")}
            @input=${(r) => this._updateRootValue(
      "inverter_fault_terms",
      r.currentTarget.value
    )}
          ></ha-textfield>
          <ha-textfield
            .label=${this._t("editor.field.working_terms")}
            .value=${(this._config.inverter_working_terms ?? []).join(", ")}
            @input=${(r) => this._updateRootValue(
      "inverter_working_terms",
      r.currentTarget.value
    )}
          ></ha-textfield>
          <p class="section-copy">
            ${this._t("editor.helper.fault_example")}
          </p>
          <p class="section-copy">
            ${this._t("editor.helper.working_example")}
          </p>
        </section>

        <section class="section">
          <div class="section-header">
            <h3 class="section-title">${this._t("editor.section.status_colors_title")}</h3>
            <p class="section-copy">
              ${this._t("editor.section.status_colors_copy")}
            </p>
          </div>
          <div class="color-grid">
            ${this._renderColorField("production_start", this._t("editor.field.production_base"))}
            ${this._renderColorField("production_mid", this._t("editor.field.production_mid"))}
            ${this._renderColorField("production_end", this._t("editor.field.production_peak"))}
            ${this._renderColorField("deviation", this._t("editor.field.deviation_color"))}
            ${this._renderColorField("error", this._t("editor.field.error_color"))}
            ${this._renderColorField("unavailable", this._t("editor.field.unavailable_color"))}
          </div>
          <label class="color-field">
            <span>
              ${this._t("editor.field.production_intensity", {
      value: (this._config.production_color_intensity ?? 1).toFixed(2)
    })}
            </span>
            <input
              type="range"
              min="0.2"
              max="1.6"
              step="0.05"
              .value=${String(this._config.production_color_intensity ?? 1)}
              @input=${(r) => this._updateRootValue(
      "production_color_intensity",
      Number(r.currentTarget.value)
    )}
            />
          </label>
        </section>

        <section class="section">
          <div class="section-header">
            <h3 class="section-title">${this._t("editor.section.motion_title")}</h3>
            <p class="section-copy">
              ${this._t("editor.section.motion_copy")}
            </p>
          </div>
          <div class="toggle">
            <ha-formfield label=${this._t("editor.toggle.motion_enabled")}>
              <ha-switch
                .checked=${this._config.motion_enabled ?? !0}
                @change=${(r) => this._updateRootValue(
      "motion_enabled",
      r.currentTarget.checked
    )}
              ></ha-switch>
            </ha-formfield>
          </div>
          <div class="toggle">
            <ha-formfield label=${this._t("editor.toggle.motion_power_flow")}>
              <ha-switch
                .checked=${this._config.motion_power_flow ?? !0}
                @change=${(r) => this._updateRootValue(
      "motion_power_flow",
      r.currentTarget.checked
    )}
              ></ha-switch>
            </ha-formfield>
          </div>
          <div class="toggle">
            <ha-formfield label=${this._t("editor.toggle.motion_update_shimmer")}>
              <ha-switch
                .checked=${this._config.motion_update_shimmer ?? !0}
                @change=${(r) => this._updateRootValue(
      "motion_update_shimmer",
      r.currentTarget.checked
    )}
              ></ha-switch>
            </ha-formfield>
          </div>
          <div class="toggle">
            <ha-formfield label=${this._t("editor.toggle.motion_alert_ripple")}>
              <ha-switch
                .checked=${this._config.motion_alert_ripple ?? !0}
                @change=${(r) => this._updateRootValue(
      "motion_alert_ripple",
      r.currentTarget.checked
    )}
              ></ha-switch>
            </ha-formfield>
          </div>
        </section>

        <section class="section">
          <div class="section-header">
            <h3 class="section-title">${this._t("editor.section.panels_title")}</h3>
            <p class="section-copy">
              ${this._t("editor.section.panels_copy")}
            </p>
            <p class="section-copy">
              ${this._t("editor.section.panels_drag_hint")}
            </p>
          </div>

          <div class="section">
            <div class="section-header">
              <h4 class="section-title">${this._t("editor.section.panel_defaults_title")}</h4>
              <p class="section-copy">
                ${this._t("editor.section.panel_defaults_copy")}
              </p>
            </div>
            <div class="grid">
              ${this._renderOptionalNumberField(
      "default_panel_rated_power_w",
      this._t("editor.field.default_panel_rated_power"),
      this._config.default_panel_rated_power_w,
      1,
      2e3
    )}
            </div>
            <div class="button-row">
              <button class="secondary-button" type="button" @click=${this._applyDefaultRatedPowerToAllPanels}>
                ${this._t("editor.button.apply_default_rated_power")}
              </button>
            </div>
          </div>

          <div class="section">
            <div class="section-header">
              <h4 class="section-title">${this._t("editor.section.autofill_title")}</h4>
              <p class="section-copy">
                ${this._t("editor.section.autofill_copy")}
              </p>
            </div>
            <div class="grid">
              <ha-textfield
                .label=${this._t("editor.field.power_prefix")}
                .value=${this._autoFillPowerPrefix}
                @input=${(r) => {
      this._autoFillPowerPrefix = r.currentTarget.value;
    }}
              ></ha-textfield>
              <ha-textfield
                .label=${this._t("editor.field.energy_prefix")}
                .value=${this._autoFillEnergyPrefix}
                @input=${(r) => {
      this._autoFillEnergyPrefix = r.currentTarget.value;
    }}
              ></ha-textfield>
            </div>
            <p class="section-copy">
              ${this._t("editor.helper.autofill_search_help")}
            </p>
            <div class="button-row">
              <button class="secondary-button" type="button" @click=${this._handleAutoPopulateSensors}>
                ${this._t("editor.button.autofill_sensors")}
              </button>
              <button class="secondary-button" type="button" @click=${this._handleRemoveAllPanelSensors}>
                ${this._t("editor.button.remove_all_sensors")}
              </button>
            </div>
            ${this._autoFillResultMessage ? g`<p class="section-copy">${this._autoFillResultMessage}</p>` : v}
          </div>

          <div class="panel-list">
            ${this._config.panels.map(
      (r, o) => this._renderPanelEditor(r, o)
    )}
          </div>
        </section>

        ${this._renderExtraSections()}
      </div>
    `;
  }
  _renderPanelEditor(e, t) {
    const s = this._getAvailableSensorEntityIdsByUnit(
      t,
      "power_entity",
      (o) => o === "w"
    ), r = this._getAvailableSensorEntityIdsByUnit(
      t,
      "energy_entity",
      (o) => o === "kwh" || o === "wh"
    );
    return g`
      <details ?open=${t === 0}>
        <summary>
          <span>${this._formatPanelSlotTitle(t)}</span>
          <span class="chip">${e.name ?? e.id}</span>
        </summary>
        <div class="panel-form">
          ${this._renderPanelTextField(t, "name", this._t("editor.field.display_name"), e.name ?? "")}
          ${this._renderPanelSensorSelector(
      t,
      "power_entity",
      this._t("editor.field.power_sensor"),
      e.power_entity,
      s
    )}
          ${this._renderPanelSensorSelector(
      t,
      "energy_entity",
      this._t("editor.field.energy_sensor"),
      e.energy_entity,
      r
    )}
          <div class="toggle">
            <ha-formfield label=${this._t("editor.field.panel_energy_toggle")}>
              <ha-switch
                .checked=${e.show_energy ?? !1}
                @change=${(o) => this._updatePanelValue(
      t,
      "show_energy",
      o.currentTarget.checked
    )}
              ></ha-switch>
            </ha-formfield>
          </div>
          ${this._renderPanelOptionalNumberField(
      t,
      "rated_power_w",
      this._t("editor.field.panel_rated_power"),
      e.rated_power_w,
      1,
      2e3
    )}
          ${this._renderPanelNumberField(
      t,
      "deviation_derate_percent",
      this._t("editor.field.deviation_derate"),
      e.deviation_derate_percent ?? 100,
      1,
      100
    )}
          <p class="section-copy">
            ${this._t("editor.helper.derate_help")}
          </p>
          ${this._renderPanelEntityPicker(
      t,
      "inverter_status_entity",
      this._t("editor.field.inverter_status_sensor"),
      e.inverter_status_entity,
      ["sensor", "binary_sensor"]
    )}
          ${this._renderPanelAdvancedSection(t, e)}
          <div class="toggle">
            <ha-formfield label=${this._t("editor.field.panel_enabled_toggle")}>
              <ha-switch
                .checked=${e.enabled ?? !0}
                @change=${(o) => this._updatePanelValue(
      t,
      "enabled",
      o.currentTarget.checked
    )}
              ></ha-switch>
            </ha-formfield>
          </div>
        </div>
      </details>
    `;
  }
  _renderPanelAdvancedSection(e, t) {
    return g`
      <details class="panel-advanced">
        <summary>${this._t("editor.section.advanced_title")}</summary>
        <div class="panel-advanced-grid">
          <p class="section-copy">
            ${this._t("editor.section.advanced_copy")}
          </p>
          ${Vt.map(
      (s) => this._renderPanelAdvancedSensorSelector(
        e,
        s.key,
        this._t(s.labelKey),
        t.advanced_metrics?.[s.key],
        this._getAdvancedSensorEntityIds(e, s.key, s.matcher)
      )
    )}
        </div>
      </details>
    `;
  }
  _renderPanelAdvancedSensorSelector(e, t, s, r, o) {
    return this._renderSelectorWithClear(
      s,
      r,
      {
        entity: {
          domain: "sensor",
          include_entities: o
        }
      },
      (a) => this._updatePanelAdvancedMetricValue(e, t, a)
    );
  }
  _formatPanelSlotTitle(e) {
    const t = Math.floor(e / this._config.columns) + 1, s = e % this._config.columns + 1;
    return this._t("editor.panel_slot_title", { row: t, column: s });
  }
  _renderPanelEntityPicker(e, t, s, r, o) {
    return this._renderSelectorWithClear(
      s,
      r,
      {
        entity: {
          domain: o
        }
      },
      (a) => this._updatePanelValue(e, t, a)
    );
  }
  _renderTextField(e, t, s) {
    return g`
      <ha-textfield
        .label=${t}
        .value=${s}
        @input=${(r) => this._updateRootValue(e, r.currentTarget.value)}
      ></ha-textfield>
    `;
  }
  _renderPanelSensorSelector(e, t, s, r, o) {
    return this._renderSelectorWithClear(
      s,
      r,
      {
        entity: {
          domain: "sensor",
          include_entities: o
        }
      },
      (a) => this._updatePanelValue(e, t, a)
    );
  }
  _renderSelectorWithClear(e, t, s, r) {
    return g`
      <ha-selector
        .hass=${this.hass}
        .value=${t}
        .selector=${s}
        .label=${e}
        .required=${!1}
        @value-changed=${(o) => r(
      typeof o.detail?.value == "string" ? o.detail.value : ""
    )}
      ></ha-selector>
    `;
  }
  _renderNumberField(e, t, s, r, o) {
    return g`
      <ha-textfield
        .label=${t}
        .value=${String(s)}
        type="number"
        .min=${String(r)}
        .max=${String(o)}
        @change=${(a) => this._updateRootValue(
      e,
      this._parseNumberWithClamp(
        a.currentTarget.value,
        s,
        r,
        o
      )
    )}
      ></ha-textfield>
    `;
  }
  _renderOptionalNumberField(e, t, s, r, o) {
    return g`
      <ha-textfield
        .label=${t}
        .value=${s !== void 0 ? String(s) : ""}
        type="number"
        .min=${String(r)}
        .max=${String(o)}
        @change=${(a) => this._updateRootValue(
      e,
      this._parseOptionalNumber(
        a.currentTarget.value,
        r,
        o
      )
    )}
      ></ha-textfield>
    `;
  }
  _renderPanelTextField(e, t, s, r) {
    return g`
      <ha-textfield
        .label=${s}
        .value=${r}
        @input=${(o) => this._updatePanelValue(e, t, o.currentTarget.value)}
      ></ha-textfield>
    `;
  }
  _renderPanelOptionalNumberField(e, t, s, r, o, a) {
    return g`
      <ha-textfield
        .label=${s}
        .value=${r !== void 0 ? String(r) : ""}
        type="number"
        .min=${String(o)}
        .max=${String(a)}
        @change=${(n) => this._updatePanelValue(
      e,
      t,
      this._parseOptionalNumber(
        n.currentTarget.value,
        o,
        a
      )
    )}
      ></ha-textfield>
    `;
  }
  _renderPanelNumberField(e, t, s, r, o, a) {
    return g`
      <ha-textfield
        .label=${s}
        .value=${String(r)}
        type="number"
        .min=${String(o)}
        .max=${String(a)}
        @change=${(n) => this._updatePanelValue(
      e,
      t,
      this._parseNumberWithClamp(
        n.currentTarget.value,
        r,
        o,
        a
      )
    )}
      ></ha-textfield>
    `;
  }
  _renderSelectField(e, t, s, r) {
    return g`
      <label class="color-field">
        <span>${t}</span>
        <select
          .value=${s}
          @change=${(o) => this._updateRootValue(e, o.currentTarget.value)}
        >
          ${r.map(
      (o) => g`<option value=${o.value}>${o.label}</option>`
    )}
        </select>
      </label>
    `;
  }
  _renderColorField(e, t) {
    const s = this._config.colors?.[e] ?? "";
    return g`
      <label class="color-field">
        <span>${t}</span>
        <input
          type="color"
          .value=${s}
          @input=${(r) => this._updateColor(e, r.currentTarget.value)}
        />
      </label>
    `;
  }
  _updateRootValue(e, t) {
    const s = this._normalizeEditorConfig({
      ...this._config,
      [e]: t
    });
    this._commit(s);
  }
  _updateColor(e, t) {
    const s = this._normalizeEditorConfig({
      ...this._config,
      colors: {
        ...this._config.colors ?? {},
        [e]: t
      }
    });
    this._commit(s);
  }
  _updatePanelValue(e, t, s) {
    const r = this._config.panels.map((a, n) => {
      if (n !== e)
        return a;
      const l = { ...a, [t]: s };
      if (t === "power_entity") {
        const d = a.power_entity, c = typeof s == "string" ? s.trim() : "";
        if (c.length > 0) {
          const p = this._getEntityFriendlyName(c);
          p && this._shouldAutoRenamePanel(a.name, a.id, d) && (l.name = p);
        }
      }
      return t === "enabled" && s === !1 && (l.power_entity = void 0, l.energy_entity = void 0, l.show_energy = !1, l.inverter_status_entity = void 0, l.error_entity = void 0, l.advanced_metrics = void 0), l;
    }), o = this._normalizeEditorConfig({
      ...this._config,
      panels: r
    });
    this._commit(o);
  }
  _updatePanelAdvancedMetricValue(e, t, s) {
    const r = typeof s == "string" && s.trim().length > 0 ? s.trim() : void 0, o = this._config.panels.map((n, l) => {
      if (l !== e)
        return n;
      const d = {
        ...n.advanced_metrics ?? {}
      };
      return d[t] = r, Vt.every(
        (c) => !d[c.key] || d[c.key]?.trim().length === 0
      ) ? {
        ...n,
        advanced_metrics: void 0
      } : {
        ...n,
        advanced_metrics: d
      };
    }), a = this._normalizeEditorConfig({
      ...this._config,
      panels: o
    });
    this._commit(a);
  }
  _parseOptionalNumber(e, t, s) {
    if (e.trim() === "")
      return;
    const r = Number(e);
    if (Number.isFinite(r))
      return Math.min(Math.max(r, t), s);
  }
  _parseNumberWithClamp(e, t, s, r) {
    const o = Number(e);
    return Number.isFinite(o) ? Math.min(Math.max(o, s), r) : t;
  }
  _getAvailableSensorEntityIdsByUnit(e, t, s) {
    if (!this.hass)
      return [];
    const r = new Set(
      this._config.panels.map((n, l) => l === e ? void 0 : n[t]).filter((n) => typeof n == "string" && n.length > 0)
    ), o = this._config.panels[e]?.[t], a = [];
    for (const n of Object.values(this.hass.states)) {
      if (!n.entity_id.startsWith("sensor."))
        continue;
      const l = n.attributes?.unit_of_measurement;
      if (typeof l != "string")
        continue;
      const d = l.trim().toLowerCase();
      s(d) && (r.has(n.entity_id) && n.entity_id !== o || a.push(n.entity_id));
    }
    return typeof o == "string" && o.length > 0 && !a.includes(o) && a.push(o), a.sort((n, l) => n.localeCompare(l));
  }
  _getAdvancedSensorEntityIds(e, t, s) {
    if (!this.hass)
      return [];
    const r = this._config.panels[e]?.advanced_metrics?.[t], o = [];
    for (const a of Object.values(this.hass.states))
      a.entity_id.startsWith("sensor.") && s(a) && o.push(a.entity_id);
    return typeof r == "string" && r.length > 0 && !o.includes(r) && o.push(r), o.sort((a, n) => a.localeCompare(n));
  }
  _getEntityFriendlyName(e) {
    const t = e?.trim();
    if (!this.hass || !t)
      return;
    const r = this.hass.states[t]?.attributes?.friendly_name;
    if (typeof r != "string")
      return;
    const o = r.trim();
    return o.length > 0 ? o : void 0;
  }
  _shouldAutoRenamePanel(e, t, s) {
    return $i(
      e,
      t,
      s,
      (r) => this._getEntityFriendlyName(r)
    );
  }
  _commit(e) {
    this._config = e, Si(this, e);
  }
  _isReorderOnlySync(e) {
    if (e.type !== this._getCardType() || e.rows !== this._config.rows || e.columns !== this._config.columns || e.panels.length !== this._config.panels.length)
      return !1;
    const t = this._toPanelSignatureMap(this._config.panels), s = this._toPanelSignatureMap(e.panels);
    if (t.size !== s.size)
      return !1;
    for (const [a, n] of t.entries())
      if (s.get(a) !== n)
        return !1;
    const r = this._config.panels.map((a) => a.id).join("|"), o = e.panels.map((a) => a.id).join("|");
    return r !== o;
  }
  _toPanelSignatureMap(e) {
    const t = /* @__PURE__ */ new Map();
    for (const s of e)
      t.set(
        s.id,
        JSON.stringify({
          name: s.name ?? "",
          power_entity: s.power_entity ?? "",
          energy_entity: s.energy_entity ?? "",
          inverter_status_entity: s.inverter_status_entity ?? "",
          error_entity: s.error_entity ?? "",
          show_energy: s.show_energy ?? !1,
          enabled: s.enabled ?? !0,
          rated_power_w: s.rated_power_w ?? null,
          deviation_derate_percent: s.deviation_derate_percent ?? 100,
          advanced_metrics: s.advanced_metrics ?? {}
        })
      );
    return t;
  }
};
je.properties = {
  hass: { attribute: !1 },
  _config: { state: !0 },
  _autoFillPowerPrefix: { state: !0 },
  _autoFillEnergyPrefix: { state: !0 },
  _autoFillResultMessage: { state: !0 }
}, je.styles = ct`
    :host {
      display: block;
    }

    .editor {
      display: grid;
      gap: 20px;
    }

    .section {
      display: grid;
      gap: 12px;
      padding: 16px;
      border-radius: 18px;
      border: 1px solid var(--divider-color);
      background: rgba(127, 146, 171, 0.06);
    }

    .section-header {
      display: grid;
      gap: 4px;
    }

    .section-title {
      margin: 0;
      font-size: 1rem;
      font-weight: 700;
    }

    .section-copy {
      margin: 0;
      color: var(--secondary-text-color);
      font-size: 0.92rem;
    }

    .grid {
      display: grid;
      gap: 12px;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    }

    .panel-list {
      display: grid;
      gap: 12px;
    }

    details {
      border-radius: 16px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      overflow: hidden;
    }

    summary {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 14px 16px;
      cursor: pointer;
      font-weight: 600;
      list-style: none;
    }

    summary::-webkit-details-marker {
      display: none;
    }

    .panel-form {
      display: grid;
      gap: 12px;
      padding: 0 16px 16px;
    }

    .panel-advanced {
      border-radius: 12px;
      border: 1px solid var(--divider-color);
      background: rgba(127, 146, 171, 0.08);
      overflow: hidden;
    }

    .panel-advanced summary {
      padding: 10px 12px;
      font-size: 0.86rem;
      font-weight: 600;
    }

    .panel-advanced-grid {
      display: grid;
      gap: 10px;
      padding: 0 12px 12px;
    }

    .toggle {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .button-row {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .secondary-button {
      border: 1px solid var(--divider-color);
      background: rgba(127, 146, 171, 0.08);
      color: var(--primary-text-color);
      border-radius: 12px;
      min-height: 38px;
      padding: 0 12px;
      cursor: pointer;
      font: inherit;
    }

    .color-grid {
      display: grid;
      gap: 12px;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    }

    label.color-field {
      display: grid;
      gap: 8px;
      font-size: 0.88rem;
      color: var(--secondary-text-color);
    }

    input[type="color"] {
      width: 100%;
      height: 42px;
      border-radius: 12px;
      border: 1px solid var(--divider-color);
      background: transparent;
      padding: 4px;
      cursor: pointer;
    }

    input[type="range"] {
      width: 100%;
    }

    select {
      width: 100%;
      min-height: 42px;
      border-radius: 12px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: var(--primary-text-color);
      padding: 0 12px;
      font: inherit;
    }

    .chip {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 10px;
      border-radius: 999px;
      font-size: 0.78rem;
      background: rgba(127, 146, 171, 0.12);
      color: var(--secondary-text-color);
    }
  `;
let Ve = je;
class Ns extends Ve {
}
customElements.get("solar-panel-visualizer-card-editor") || customElements.define(
  "solar-panel-visualizer-card-editor",
  Ns
);
const Ci = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SolarPanelVisualizerBaseCardEditor: Ve,
  SolarPanelVisualizerCardEditor: Ns
}, Symbol.toStringTag, { value: "Module" })), jt = typeof navigator < "u" ? navigator.language : "en";
window.customCards = window.customCards || [];
window.customCards.push({
  type: Ye,
  name: Ue(jt, "meta.card_name"),
  description: Ue(jt, "meta.card_description"),
  preview: !0
});
