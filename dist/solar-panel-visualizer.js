const qt = "solar-panel-visualizer", at = `custom:${qt}`, lt = {
  production_start: "#8dcf72",
  production_mid: "#bfe36a",
  production_end: "#ffd35a",
  deviation: "#ff9667",
  error: "#ff627f",
  unavailable: "#586779"
}, Xt = 2, Qt = 3, Zt = 15, Jt = 50, es = 3, ts = 3, ss = 20, rs = 0, is = 30, os = 12, ns = 0, as = 2, ls = 0, ps = !1, cs = 220, ds = 980, hs = 1, us = !1, _s = !0, ms = !0, gs = !0, fs = !0, ys = "auto", vs = ["fault", "alarm", "error", "failed", "failure", "trip"], bs = [
  "normal",
  "ok",
  "running",
  "waiting for operation",
  "producing"
], j = (i, e, t = 1, s = 12) => {
  const r = Number(i);
  return Number.isFinite(r) ? Math.min(Math.max(Math.round(r), t), s) : e;
}, Fe = (i, e, t = 0, s = 100) => {
  const r = Number(i);
  return Number.isFinite(r) ? Math.min(Math.max(r, t), s) : e;
}, W = (i) => {
  if (typeof i != "string")
    return;
  const e = i.trim();
  return e.length > 0 ? e : void 0;
}, zs = (i) => {
  if (typeof i == "string")
    return i.trim();
}, z = (i, e) => typeof i == "boolean" ? i : e, mt = (i, e) => {
  const s = (Array.isArray(i) ? i : typeof i == "string" ? i.split(",") : []).map((r) => typeof r == "string" ? r.trim().toLowerCase() : "").filter((r) => r.length > 0);
  return s.length === 0 ? [...e] : [...new Set(s)];
}, gt = (i, e, t) => {
  if (i == null || i === "")
    return;
  const s = Number(i);
  if (Number.isFinite(s))
    return Math.min(Math.max(s, e), t);
}, ws = (i, e, t) => {
  if (i == null || i === "")
    return;
  const s = Number(i);
  if (!(!Number.isFinite(s) || s < e))
    return Math.min(s, t);
}, Bs = (i) => `panel-${i + 1}`, Gs = (i) => i === "none" ? "none" : "details", Ws = (i) => i === "dark" || i === "light" ? i : ys, Us = (i) => {
  if (typeof i != "object" || i === null)
    return;
  const e = i, t = e.columns === "full" || typeof e.columns == "number" ? e.columns : void 0, s = e.rows === "auto" || typeof e.rows == "number" ? e.rows : void 0;
  if (!(t === void 0 && s === void 0))
    return {
      columns: t,
      rows: s
    };
}, Ks = [
  "inverter_ac_power_entity",
  "inverter_ac_voltage_entity",
  "inverter_ac_current_entity",
  "inverter_temp_entity",
  "panel_current_entity",
  "panel_voltage_entity",
  "panel_power_entity"
], Vs = (i, e) => {
  if (!e || typeof i != "object" || i === null)
    return;
  const t = i, s = {};
  let r = !1;
  for (const o of Ks) {
    const n = W(t[o]);
    s[o] = n, n && (r = !0);
  }
  if (r)
    return s;
}, js = (i, e) => {
  const t = z(i?.enabled, !0);
  return {
    id: W(i?.id) ?? Bs(e),
    name: W(i?.name),
    power_entity: t ? W(i?.power_entity) : void 0,
    energy_entity: t ? W(i?.energy_entity) : void 0,
    show_energy: z(i?.show_energy, !1),
    inverter_status_entity: t ? W(i?.inverter_status_entity) ?? W(i?.error_entity) : void 0,
    error_entity: t ? W(i?.error_entity) : void 0,
    advanced_metrics: Vs(i?.advanced_metrics, t),
    enabled: t,
    rated_power_w: ws(i?.rated_power_w, 1, 2e3),
    deviation_derate_percent: Fe(i?.deviation_derate_percent, 100, 1, 100)
  };
}, xs = (i, e, t = []) => {
  const s = i * e;
  return Array.from(
    { length: s },
    (r, o) => js(t[o], o)
  );
}, Ys = (i = Xt, e = Qt) => ({
  type: at,
  title: "Solar Array",
  theme_mode: ys,
  rows: i,
  columns: e,
  panels: xs(i, e),
  enable_inverter_status: !1,
  inverter_fault_terms: [...vs],
  inverter_working_terms: [...bs],
  show_inverter_status_on_tiles: !1,
  enable_array_checks: !1,
  deviation_threshold_percent: Zt,
  deviation_absolute_w_threshold: Jt,
  deviation_min_active_panels: es,
  deviation_min_samples: ts,
  deviation_min_runtime_minutes: ss,
  deviation_smoothing_minutes: rs,
  deviation_dynamic_floor_w: is,
  deviation_history_hours: os,
  colors: lt,
  production_color_intensity: hs,
  show_energy: !0,
  use_system_power_entity: !1,
  system_power_entity: void 0,
  invert_system_power: !1,
  use_system_energy_entity: !1,
  system_energy_entity: void 0,
  enable_forecast_overlay: us,
  motion_enabled: _s,
  motion_power_flow: ms,
  motion_update_shimmer: gs,
  motion_alert_ripple: fs,
  show_custom_kpi: !0,
  custom_kpi_title: "Custom KPI",
  custom_kpi_entity: void 0,
  custom_kpi_decimals: ls,
  invert_custom_kpi: !1,
  panel_tap_action: "details",
  power_decimals: ns,
  energy_decimals: as,
  limit_panel_width: ps,
  panel_max_width_px: cs,
  max_card_width_px: ds
}), Me = (i = {}) => {
  const e = j(i.rows, Xt), t = j(i.columns, Qt), s = {
    ...lt,
    ...i.colors ?? {}
  };
  return {
    type: W(i.type) ?? at,
    title: W(i.title),
    theme_mode: Ws(i.theme_mode),
    rows: e,
    columns: t,
    panels: xs(e, t, i.panels ?? []),
    enable_inverter_status: z(i.enable_inverter_status, !1),
    inverter_fault_terms: mt(
      i.inverter_fault_terms,
      vs
    ),
    inverter_working_terms: mt(
      i.inverter_working_terms,
      bs
    ),
    show_inverter_status_on_tiles: z(
      i.show_inverter_status_on_tiles,
      !1
    ),
    enable_array_checks: z(i.enable_array_checks, !1),
    deviation_threshold_percent: Fe(
      i.deviation_threshold_percent,
      Zt,
      1,
      100
    ),
    deviation_absolute_w_threshold: Fe(
      i.deviation_absolute_w_threshold,
      Jt,
      0,
      5e3
    ),
    deviation_min_active_panels: j(
      i.deviation_min_active_panels,
      es,
      2,
      30
    ),
    deviation_min_samples: j(
      i.deviation_min_samples,
      ts,
      1,
      120
    ),
    deviation_min_runtime_minutes: j(
      i.deviation_min_runtime_minutes,
      ss,
      0,
      1440
    ),
    deviation_smoothing_minutes: j(
      i.deviation_smoothing_minutes,
      rs,
      0,
      1440
    ),
    deviation_dynamic_floor_w: Fe(
      i.deviation_dynamic_floor_w,
      is,
      0,
      5e3
    ),
    deviation_restart_entity: W(i.deviation_restart_entity),
    deviation_history_hours: j(
      i.deviation_history_hours,
      os,
      1,
      168
    ),
    colors: s,
    production_color_intensity: Fe(
      i.production_color_intensity,
      hs,
      0.2,
      1.6
    ),
    show_energy: !0,
    use_system_power_entity: z(i.use_system_power_entity, !1),
    system_power_entity: W(i.system_power_entity),
    invert_system_power: z(i.invert_system_power, !1),
    use_system_energy_entity: z(i.use_system_energy_entity, !1),
    system_energy_entity: W(i.system_energy_entity),
    enable_forecast_overlay: z(
      i.enable_forecast_overlay,
      us
    ),
    motion_enabled: z(i.motion_enabled, _s),
    motion_power_flow: z(
      i.motion_power_flow,
      ms
    ),
    motion_update_shimmer: z(
      i.motion_update_shimmer,
      gs
    ),
    motion_alert_ripple: z(
      i.motion_alert_ripple,
      fs
    ),
    show_custom_kpi: z(i.show_custom_kpi, !0),
    custom_kpi_title: zs(i.custom_kpi_title) ?? "Custom KPI",
    custom_kpi_entity: W(i.custom_kpi_entity),
    custom_kpi_decimals: j(
      i.custom_kpi_decimals,
      ls,
      0,
      4
    ),
    invert_custom_kpi: z(i.invert_custom_kpi, !1),
    panel_tap_action: Gs(i.panel_tap_action),
    power_decimals: j(
      i.power_decimals,
      ns,
      0,
      4
    ),
    energy_decimals: j(
      i.energy_decimals,
      as,
      0,
      4
    ),
    limit_panel_width: z(
      i.limit_panel_width,
      ps
    ),
    panel_max_width_px: j(
      i.panel_max_width_px,
      cs,
      120,
      320
    ),
    default_panel_rated_power_w: ws(
      i.default_panel_rated_power_w,
      1,
      2e3
    ),
    max_card_width_px: gt(i.max_card_width_px, 300, 2400) ?? ds,
    max_card_height_px: gt(i.max_card_height_px, 300, 2600),
    grid_options: Us(i.grid_options)
  };
}, qs = (i) => {
  const e = [];
  return typeof i != "object" || i === null ? ["Configuration must be an object."] : (i.rows !== void 0 && (!Number.isFinite(Number(i.rows)) || Number(i.rows) < 1) && e.push("`rows` must be a positive number."), i.columns !== void 0 && (!Number.isFinite(Number(i.columns)) || Number(i.columns) < 1) && e.push("`columns` must be a positive number."), i.max_card_width_px !== void 0 && !Number.isFinite(Number(i.max_card_width_px)) && e.push("`max_card_width_px` must be a number if set."), i.panel_max_width_px !== void 0 && (!Number.isFinite(Number(i.panel_max_width_px)) || Number(i.panel_max_width_px) < 120 || Number(i.panel_max_width_px) > 320) && e.push("`panel_max_width_px` must be between 120 and 320."), i.max_card_height_px !== void 0 && !Number.isFinite(Number(i.max_card_height_px)) && e.push("`max_card_height_px` must be a number if set."), i.custom_kpi_decimals !== void 0 && (!Number.isFinite(Number(i.custom_kpi_decimals)) || Number(i.custom_kpi_decimals) < 0 || Number(i.custom_kpi_decimals) > 4) && e.push("`custom_kpi_decimals` must be between 0 and 4."), i.production_color_intensity !== void 0 && (!Number.isFinite(Number(i.production_color_intensity)) || Number(i.production_color_intensity) < 0.2 || Number(i.production_color_intensity) > 1.6) && e.push("`production_color_intensity` must be between 0.2 and 1.6."), i.deviation_absolute_w_threshold !== void 0 && (!Number.isFinite(Number(i.deviation_absolute_w_threshold)) || Number(i.deviation_absolute_w_threshold) < 0) && e.push("`deviation_absolute_w_threshold` must be 0 or higher."), i.deviation_min_active_panels !== void 0 && (!Number.isFinite(Number(i.deviation_min_active_panels)) || Number(i.deviation_min_active_panels) < 2) && e.push("`deviation_min_active_panels` must be 2 or higher."), i.deviation_min_samples !== void 0 && (!Number.isFinite(Number(i.deviation_min_samples)) || Number(i.deviation_min_samples) < 1) && e.push("`deviation_min_samples` must be 1 or higher."), i.deviation_min_runtime_minutes !== void 0 && (!Number.isFinite(Number(i.deviation_min_runtime_minutes)) || Number(i.deviation_min_runtime_minutes) < 0) && e.push("`deviation_min_runtime_minutes` must be 0 or higher."), i.deviation_smoothing_minutes !== void 0 && (!Number.isFinite(Number(i.deviation_smoothing_minutes)) || Number(i.deviation_smoothing_minutes) < 0) && e.push("`deviation_smoothing_minutes` must be 0 or higher."), i.deviation_dynamic_floor_w !== void 0 && (!Number.isFinite(Number(i.deviation_dynamic_floor_w)) || Number(i.deviation_dynamic_floor_w) < 0) && e.push("`deviation_dynamic_floor_w` must be 0 or higher."), i.deviation_history_hours !== void 0 && (!Number.isFinite(Number(i.deviation_history_hours)) || Number(i.deviation_history_hours) < 1) && e.push("`deviation_history_hours` must be 1 or higher."), Array.isArray(i.panels) && i.panels.forEach((t, s) => {
    const r = t?.deviation_derate_percent;
    r !== void 0 && (!Number.isFinite(Number(r)) || Number(r) < 1 || Number(r) > 100) && e.push(
      `\`panels[${s}].deviation_derate_percent\` must be between 1 and 100.`
    );
  }), e);
}, Xs = { card_name: "Solar Panel Visualizer", card_description: "GUI-first solar array card with panel health, animated power rails, forecasts, history graphs, and light/dark themes." }, Qs = { unavailable: "Unavailable", not_configured: "Not configured", disabled: "Disabled", unknown_recorder_error: "Unknown recorder error" }, Zs = { default_title: "Solar Array", eyebrow: "Solar Panel Visualizer", subtitle: { loading_history: "Loading shared {hours}h solar panel history...", warmup: "Deviation checks are warming up.", deviation_detected: "{count} panel{suffix} below expected output", tap_diagnostics: "Tap a panel for detailed diagnostics", drag_hint: "Drag and drop panel tiles to swap positions." }, summary: { power: "Power", energy: "Energy", alerts: "Alerts", system_sensor: "System sensor", sum_panel_sensors: "Sum of panel sensors", custom_sensor: "Custom KPI sensor", custom_default_title: "Custom KPI" }, panel: { hidden: "hidden", hidden_name: "Hidden Panel", hidden_performance: "Hidden", info_label: "Info", info_title: "Open panel details", inverter_prefix: "Inverter: {status}", inverter_short: { ok: "Inverter: OK", deviation: "Inverter: Deviation", error: "Inverter: Error" }, performance_compact: "{percent}%", performance_medium: "{percent}% of {rated}W", performance_full: "{percent}% of {rated}W Panel", slot_label: "R{row}C{column}", status: { normal: "normal", deviation: "deviation", inverter: "inverter", error: "error", offline: "offline", unconfigured: "unconfigured", disabled: "hidden" } }, popup: { close_detail: "Close detail", close_live_power: "Close live power detail", close_energy: "Close energy detail", close_custom_kpi: "Close custom KPI detail", close_system_health: "Close system health", panel_eyebrow: "Panel Detail {slot}", power_eyebrow: "Power Detail", power_title: "Live Power", energy_eyebrow: "Energy Detail", energy_title: "Energy", custom_eyebrow: "Custom KPI Detail", system_health_eyebrow: "System Health", system_health_title: "Overview", detail: { status: "Status", power: "Power", energy: "Energy", estimated_power_now: "Forecast production", estimated_energy_now: "Forecast production", deviation: "Deviation", rated_performance: "Rated / Performance", information: "Information", current: "Current", source: "Source" }, deviation: { inverter_mismatch: "Inverter status mismatch", below_peers: "{percent}% below peers", within_range: "Within range" }, rated_performance: { format: "{rated} W / {percent}", na: "n/a" }, info: { power_source: "Power source: {value}", current_inverter_status: 'Current inverter status: "{value}"', inverter_evaluation: "Inverter evaluation: {value}", inverter_source: "Inverter source: {value}" }, inverter_eval: { no_status: "No status available", fault_match: "Fault term matched", working_match: "Working term matched", no_match: "No configured term matched" }, telemetry: { title: "Panel / Inverter Info", configured_title: "Configured", unconfigured_title: "Unconfigured", none_configured: "No advanced telemetry configured for this panel.", setup_hint: "Configure in Panels > Advanced telemetry.", label: { inverter_status: "Inverter status", inverter_ac_power: "Inverter AC power", inverter_ac_voltage: "Inverter AC voltage", inverter_ac_current: "Inverter AC current", inverter_temp: "Inverter temperature", panel_current: "Panel current", panel_voltage: "Panel voltage", panel_power: "Panel power" } }, history: { power: "Power History", system_power: "System Power History", total_panel_power: "Total Panel Power History", system_energy: "System Energy History", total_panel_energy: "Total Panel Energy History", panel_power_values: "Panel Power Values", panel_energy_values: "Panel Energy Values", panel_compare: "Panel Performance Comparison", panel_compare_power: "Panel Power Comparison", panel_compare_energy: "Panel Energy Comparison", overlay_forecast: "Forecast", graph_not_configured: "No sensor configured for graph.", custom_not_configured: "No sensor configured for Custom KPI.", loading: "Loading sensor history...", no_data: "No history data for selected range.", unable_load: "Unable to load panel history ({error})", unable_load_plain: "Unable to load panel history", max: "Max {value}", median: "Median {value}", min: "Min {value}", time_range: "{start} - {end}" }, forecast: { enable_button: "Enable forecasts", disabled_hint: "Forecast overlay is disabled.", not_configured: "Forecast.Solar not configured.", default_sensor_not_found: "Default forecast sensor not found ({entity}).", power_compare_requires_system: "System power sensor is required for power forecast comparison.", energy_compare_requires_system: "System energy sensor is required for energy forecast comparison." }, panel_compare: { toggle: "Compare Panel Performance", toggle_power: "Compare Panel Power", toggle_energy: "Compare Panel Energy", loading: "Loading panel comparison history...", no_panels: "No configured panel sensors available for comparison.", no_panels_power: "No configured panel power sensors available for comparison.", no_panels_energy: "No configured panel energy sensors available for comparison.", no_data: "No comparison data for selected range.", unable_load: "Unable to load panel comparison history ({error}).", render_failure: "Comparison data loaded, but traces could not be drawn.", diagnostics_title: "Compare graph diagnostics (temporary)", diagnostics_summary: "model hasData={hasData}, drawable={drawable}, series={series}, range={range}h", diagnostics_reason_render_failure: "Series exist but no drawable traces were produced.", diagnostics_reason_suspect: "One or more series produced an invalid drawable shape.", diagnostics_row: "{label}: samples={samples}, points={points}, first={first}, last={last}, min={min}, max={max}" }, system_health: { everything_ok: "Everything is working well.", section: { inverter: "Inverter", error: "Error", deviation: "Deviation", offline: "Unavailable", setup: "Needs setup" }, item: "Panel on {slot} ({label}): {reason}" } }, quick_setup: { title: "Quick Setup:", select_power_sensor: "Select panel power sensor:", selector_label: "Select panel power sensor", no_sensors: "No available W sensors found.", disable_panel: "Disable Panel (hide but keep slot when off)" }, system_health_chip: { faults: "{count} Fault{suffix}", unavailable: "{count} Unavailable", deviation: "{count} Deviation", needs_setup: "{count} Needs Setup", ok: "System OK" } }, Js = { reason: { slot_hidden: "Panel slot is hidden in the card configuration.", select_power_sensor: "Select a power sensor to activate this panel slot.", power_entity_missing: "Power entity {entity} was not found.", power_entity_unavailable: "{entity} is unavailable.", inverter_fault_match: 'Current inverter status: "{status}" matches configured fault terms.', inverter_working_mismatch: 'Current inverter status: "{status}" does not match configured working terms.', producing_expected: "Producing within the expected array range.", producing_adjusted: "Producing within array-adjusted target range.", rated_not_configured: "Rated power not configured; excluded from deviation checks.", output_below_target: "Output is {percent}% and {shortfall} W below array target.", array_check_disabled: "Array Health Check is disabled.", need_non_derated_panels: "Need at least {count} non-derated active rated panels for deviation checks.", collecting_samples: "Collecting samples ({current}/{required}).", warmup_progress: "Warm-up in progress ({current}/{required} min).", low_light_pause: "Low-light pause: waiting above {floor} W target floor." }, status_display: { disabled: "Disabled", not_configured: "Not configured" }, energy: { default_unit: "kWh" }, power: { default_unit: "W" } }, er = { section: { layout_title: "Layout", layout_copy: "Set the array size first. Panel slots expand automatically from the row and column values.", display_title: "Display", display_copy: "Tune precision and panel detail behavior.", appearance_title: "Appearance", appearance_copy: "Auto follows the active Home Assistant theme. Force Light or Dark if a dashboard theme needs a specific card style.", forecast_title: "Forecast.Solar", forecast_copy: "Auto-detects Home Assistant default forecast sensors and overlays estimated production in Power/Energy KPI popups.", array_health_title: "Array Health Check", array_health_copy: "Automatically checks panel health by comparing active panels against each other using rated power, shared solar panel history, and configurable guardrails.", array_health_smoothing_help: "Smoothing window averages recent samples before checks; 0 means no smoothing.", inverter_title: "Inverter Status", inverter_copy: "Track textual status from each panel’s inverter status sensor. A panel turns red only when status text contains one of the configured fault terms. The current inverter status is shown in the panel popup.", status_colors_title: "Status Colors", status_colors_copy: "Production colors blend based on panel output. Alert colors override the production scale.", motion_title: "Motion", motion_copy: "Animate live production with left-collector power rails, Power/Energy KPI impact effects, and repeated alert ripples. Motion automatically respects reduced-motion preferences.", panels_title: "Panels", panels_copy: "Each generated slot can be configured with its own power, energy, and optional inverter status sensor. Disable a slot to hide that panel while keeping grid spacing.", panels_drag_hint: "In the card view, drag and drop panel tiles to swap their positions.", panel_defaults_title: "Panel default rated power", panel_defaults_copy: "Set a common default panel power and apply it to all panel slots.", autofill_title: "Auto-populate sensors", autofill_copy: "Fill panel sensors in slot order. Use sensor. for exact entity ID prefixes, or type friendly-name text to search sensor names.", advanced_title: "Advanced telemetry", advanced_copy: "Optional manual telemetry mappings shown in the panel popup when pressing INFO." }, field: { title: "Title", rows: "Rows", columns: "Columns", max_card_width: "Max card width (px)", max_card_height: "Max card height (px)", theme_mode: "Theme mode", power_decimals: "Power decimals", energy_decimals: "Energy decimals", custom_kpi_decimals: "Custom KPI decimals", panel_tap_action: "Panel tap action", system_power_sensor: "System power sensor (W)", system_energy_sensor: "System daily energy sensor", custom_kpi_sensor: "Custom KPI sensor", custom_kpi_heading: "Custom KPI heading", max_panel_tile_width: "Max panel tile width (px)", deviation_threshold: "Deviation threshold (%)", deviation_absolute_shortfall: "Absolute shortfall threshold (W)", deviation_check_time: "Deviation check time (minutes)", deviation_min_active_panels: "Minimum active panels", deviation_min_samples: "Minimum samples per panel", deviation_smoothing: "Smoothing window (minutes)", deviation_dynamic_floor: "Dynamic floor start (W)", deviation_history_window: "Shared history window (hours)", fault_terms: "Fault terms (comma-separated)", working_terms: "Working terms (comma-separated)", production_base: "Production base", production_mid: "Production mid", production_peak: "Production peak", deviation_color: "Deviation", error_color: "Error", unavailable_color: "Unavailable", production_intensity: "Production color intensity ({value})", default_panel_rated_power: "Default panel rated power (W)", power_prefix: "Power search", energy_prefix: "Energy search (optional)", display_name: "Display name", power_sensor: "Power sensor P(W)", energy_sensor: "Energy sensor (kWh/Wh)", panel_rated_power: "Panel rated power (W)", deviation_derate: "Deviation derate (%)", inverter_status_sensor: "Inverter status sensor (optional)", advanced_inverter_ac_power: "Inverter AC power (W)", advanced_inverter_ac_voltage: "Inverter AC voltage (V)", advanced_inverter_ac_current: "Inverter AC current (A)", advanced_inverter_temp: "Inverter temperature (°C/°F)", advanced_panel_current: "Panel current (A)", advanced_panel_voltage: "Panel voltage (V)", advanced_panel_power: "Panel power (W)", panel_energy_toggle: "Show panel energy", panel_enabled_toggle: "Show panel tile (hide but keep slot when off)" }, toggle: { use_system_power: "Use one system power sensor for top KPI", invert_system_power: "Invert system power value", use_system_energy: "Use one system daily energy sensor for top KPI", invert_custom_kpi: "Invert Custom KPI value", enable_forecast_overlay: "Enable forecast overlays in popups", motion_enabled: "Enable motion", motion_power_flow: "Power-rail flow to Power KPI", motion_update_shimmer: "Power/Energy KPI update effect", motion_alert_ripple: "Alert ripple for deviation/inverter/error", show_custom_kpi: "Show Custom KPI box", limit_panel_width: "Limit panel tile max width", enable_array_health: "Enable Array Health Check", enable_inverter_status: "Enable inverter status checks", show_inverter_status_tiles: "Show inverter status on panel tiles" }, select: { theme_auto: "Auto", theme_dark: "Dark", theme_light: "Light", panel_tap_details: "Open detail popover", panel_tap_none: "No action" }, button: { apply_default_rated_power: "Apply default rated W to all panels", autofill_sensors: "Auto-fill panel sensors", remove_all_sensors: "Remove all sensors" }, helper: { fault_example: "Example: fault, alarm, error, failed, failure, trip", working_example: "Working example: normal, ok, running, waiting for operation, producing", derate_help: "Used only by Array Health Check for naturally shaded panels.", autofill_search_help: "Tip: enter sensor.panel_ to match entity IDs exactly by prefix. Enter text such as Roof Panel or Daily Energy to search sensor friendly names instead. The same rule applies to Power and Energy search." }, forecast: { default_sensors: "Uses: sensor.power_production_now and sensor.energy_production_today.", line_help: "The forecast reference is a thin dashed line shown only for the selected history range up to the current time, with no future projection.", detected: "Forecast.Solar default sensors detected.", missing: "Forecast.Solar default sensors not fully detected. Expected: sensor.power_production_now and sensor.energy_production_today." }, panel_slot_title: "Row {row}, Column {column}", autofill: { enter_prefix: "Enter at least one prefix to run auto-fill.", power_summary: "Power matched {matched}, filled {filled}, skipped {skipped}.", energy_summary: "Energy matched {matched}, filled {filled}, skipped {skipped}.", cleared: "Cleared power, energy, inverter, and advanced telemetry sensors on all panels." } }, $s = {
  meta: Xs,
  common: Qs,
  card: Zs,
  state: Js,
  editor: er
}, tr = { DEV: !1 }, sr = {
  en: $s
}, ft = /* @__PURE__ */ new Set(), rr = () => typeof import.meta < "u" ? tr.DEV : typeof process < "u" ? process.env.NODE_ENV !== "production" : !1, ir = (i, e) => {
  if (!rr())
    return;
  const t = `${e ?? "unknown"}:${i}`;
  ft.has(t) || (ft.add(t), console.warn(
    `[Solar Panel Visualizer i18n] Missing translation key "${i}" for locale "${e ?? "unknown"}".`
  ));
}, yt = (i, e) => {
  if (i)
    return e.split(".").reduce(
      (t, s) => typeof t == "object" && t !== null ? t[s] : void 0,
      i
    );
}, vt = (i, e) => e ? i.replace(/\{([a-zA-Z0-9_]+)\}/g, (t, s) => {
  const r = e[s];
  return r === void 0 ? `{${s}}` : String(r);
}) : i, or = (i) => {
  if (!i)
    return ["en"];
  const e = i.trim().toLowerCase();
  if (e.length === 0)
    return ["en"];
  const t = e.split("-")[0], s = [e, t, "en"];
  return [...new Set(s)];
}, nr = (i, e, t, s) => {
  for (const o of or(e)) {
    const n = yt(i[o], t);
    if (typeof n == "string")
      return vt(n, s);
  }
  const r = yt(i.en ?? $s, t);
  return typeof r == "string" ? vt(r, s) : (ir(t, e), "");
}, Ke = (i, e, t) => nr(
  sr,
  i,
  e,
  t
), Ps = (i, e, t) => Ke(i?.locale?.language, e, t);
const Ge = globalThis, pt = Ge.ShadowRoot && (Ge.ShadyCSS === void 0 || Ge.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ct = /* @__PURE__ */ Symbol(), bt = /* @__PURE__ */ new WeakMap();
let Ss = class {
  constructor(e, t, s) {
    if (this._$cssResult$ = !0, s !== ct) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (pt && e === void 0) {
      const s = t !== void 0 && t.length === 1;
      s && (e = bt.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), s && bt.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const ar = (i) => new Ss(typeof i == "string" ? i : i + "", void 0, ct), dt = (i, ...e) => {
  const t = i.length === 1 ? i[0] : e.reduce((s, r, o) => s + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + i[o + 1], i[0]);
  return new Ss(t, i, ct);
}, lr = (i, e) => {
  if (pt) i.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const s = document.createElement("style"), r = Ge.litNonce;
    r !== void 0 && s.setAttribute("nonce", r), s.textContent = t.cssText, i.appendChild(s);
  }
}, wt = pt ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const s of e.cssRules) t += s.cssText;
  return ar(t);
})(i) : i;
const { is: pr, defineProperty: cr, getOwnPropertyDescriptor: dr, getOwnPropertyNames: hr, getOwnPropertySymbols: ur, getPrototypeOf: _r } = Object, ie = globalThis, xt = ie.trustedTypes, mr = xt ? xt.emptyScript : "", gr = ie.reactiveElementPolyfillSupport, Ie = (i, e) => i, it = { toAttribute(i, e) {
  switch (e) {
    case Boolean:
      i = i ? mr : null;
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
} }, Cs = (i, e) => !pr(i, e), $t = { attribute: !0, type: String, converter: it, reflect: !1, useDefault: !1, hasChanged: Cs };
Symbol.metadata ?? (Symbol.metadata = /* @__PURE__ */ Symbol("metadata")), ie.litPropertyMetadata ?? (ie.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let fe = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = $t) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const s = /* @__PURE__ */ Symbol(), r = this.getPropertyDescriptor(e, s, t);
      r !== void 0 && cr(this.prototype, e, r);
    }
  }
  static getPropertyDescriptor(e, t, s) {
    const { get: r, set: o } = dr(this.prototype, e) ?? { get() {
      return this[t];
    }, set(n) {
      this[t] = n;
    } };
    return { get: r, set(n) {
      const a = r?.call(this);
      o?.call(this, n), this.requestUpdate(e, a, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? $t;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Ie("elementProperties"))) return;
    const e = _r(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Ie("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Ie("properties"))) {
      const t = this.properties, s = [...hr(t), ...ur(t)];
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
      for (const r of s) t.unshift(wt(r));
    } else e !== void 0 && t.push(wt(e));
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
    return lr(e, this.constructor.elementStyles), e;
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
      const o = s.getPropertyOptions(r), n = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : it;
      this._$Em = r;
      const a = n.fromAttribute(t, o.type);
      this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
    }
  }
  requestUpdate(e, t, s, r = !1, o) {
    if (e !== void 0) {
      const n = this.constructor;
      if (r === !1 && (o = this[e]), s ?? (s = n.getPropertyOptions(e)), !((s.hasChanged ?? Cs)(o, t) || s.useDefault && s.reflect && o === this._$Ej?.get(e) && !this.hasAttribute(n._$Eu(e, s)))) return;
      this.C(e, t, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: s, reflect: r, wrapped: o }, n) {
    s && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, n ?? t ?? this[e]), o !== !0 || n !== void 0) || (this._$AL.has(e) || (this.hasUpdated || s || (t = void 0), this._$AL.set(e, t)), r === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
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
        const { wrapped: n } = o, a = this[r];
        n !== !0 || this._$AL.has(r) || a === void 0 || this.C(r, void 0, o, a);
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
fe.elementStyles = [], fe.shadowRootOptions = { mode: "open" }, fe[Ie("elementProperties")] = /* @__PURE__ */ new Map(), fe[Ie("finalized")] = /* @__PURE__ */ new Map(), gr?.({ ReactiveElement: fe }), (ie.reactiveElementVersions ?? (ie.reactiveElementVersions = [])).push("2.1.2");
const Te = globalThis, Pt = (i) => i, Ve = Te.trustedTypes, St = Ve ? Ve.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, Es = "$lit$", re = `lit$${Math.random().toFixed(9).slice(2)}$`, ks = "?" + re, fr = `<${ks}>`, ce = document, Re = () => ce.createComment(""), Ne = (i) => i === null || typeof i != "object" && typeof i != "function", ht = Array.isArray, yr = (i) => ht(i) || typeof i?.[Symbol.iterator] == "function", Ze = `[ 	
\f\r]`, Se = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Ct = /-->/g, Et = />/g, oe = RegExp(`>|${Ze}(?:([^\\s"'>=/]+)(${Ze}*=${Ze}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), kt = /'/g, Ft = /"/g, Fs = /^(?:script|style|textarea|title)$/i, Ms = (i) => (e, ...t) => ({ _$litType$: i, strings: e, values: t }), f = Ms(1), B = Ms(2), ve = /* @__PURE__ */ Symbol.for("lit-noChange"), v = /* @__PURE__ */ Symbol.for("lit-nothing"), Mt = /* @__PURE__ */ new WeakMap(), pe = ce.createTreeWalker(ce, 129);
function Is(i, e) {
  if (!ht(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return St !== void 0 ? St.createHTML(e) : e;
}
const vr = (i, e) => {
  const t = i.length - 1, s = [];
  let r, o = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", n = Se;
  for (let a = 0; a < t; a++) {
    const l = i[a];
    let c, d, p = -1, h = 0;
    for (; h < l.length && (n.lastIndex = h, d = n.exec(l), d !== null); ) h = n.lastIndex, n === Se ? d[1] === "!--" ? n = Ct : d[1] !== void 0 ? n = Et : d[2] !== void 0 ? (Fs.test(d[2]) && (r = RegExp("</" + d[2], "g")), n = oe) : d[3] !== void 0 && (n = oe) : n === oe ? d[0] === ">" ? (n = r ?? Se, p = -1) : d[1] === void 0 ? p = -2 : (p = n.lastIndex - d[2].length, c = d[1], n = d[3] === void 0 ? oe : d[3] === '"' ? Ft : kt) : n === Ft || n === kt ? n = oe : n === Ct || n === Et ? n = Se : (n = oe, r = void 0);
    const _ = n === oe && i[a + 1].startsWith("/>") ? " " : "";
    o += n === Se ? l + fr : p >= 0 ? (s.push(c), l.slice(0, p) + Es + l.slice(p) + re + _) : l + re + (p === -2 ? a : _);
  }
  return [Is(i, o + (i[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), s];
};
class Le {
  constructor({ strings: e, _$litType$: t }, s) {
    let r;
    this.parts = [];
    let o = 0, n = 0;
    const a = e.length - 1, l = this.parts, [c, d] = vr(e, t);
    if (this.el = Le.createElement(c, s), pe.currentNode = this.el.content, t === 2 || t === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (r = pe.nextNode()) !== null && l.length < a; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const p of r.getAttributeNames()) if (p.endsWith(Es)) {
          const h = d[n++], _ = r.getAttribute(p).split(re), g = /([.?@])?(.*)/.exec(h);
          l.push({ type: 1, index: o, name: g[2], strings: _, ctor: g[1] === "." ? wr : g[1] === "?" ? xr : g[1] === "@" ? $r : qe }), r.removeAttribute(p);
        } else p.startsWith(re) && (l.push({ type: 6, index: o }), r.removeAttribute(p));
        if (Fs.test(r.tagName)) {
          const p = r.textContent.split(re), h = p.length - 1;
          if (h > 0) {
            r.textContent = Ve ? Ve.emptyScript : "";
            for (let _ = 0; _ < h; _++) r.append(p[_], Re()), pe.nextNode(), l.push({ type: 2, index: ++o });
            r.append(p[h], Re());
          }
        }
      } else if (r.nodeType === 8) if (r.data === ks) l.push({ type: 2, index: o });
      else {
        let p = -1;
        for (; (p = r.data.indexOf(re, p + 1)) !== -1; ) l.push({ type: 7, index: o }), p += re.length - 1;
      }
      o++;
    }
  }
  static createElement(e, t) {
    const s = ce.createElement("template");
    return s.innerHTML = e, s;
  }
}
function be(i, e, t = i, s) {
  if (e === ve) return e;
  let r = s !== void 0 ? t._$Co?.[s] : t._$Cl;
  const o = Ne(e) ? void 0 : e._$litDirective$;
  return r?.constructor !== o && (r?._$AO?.(!1), o === void 0 ? r = void 0 : (r = new o(i), r._$AT(i, t, s)), s !== void 0 ? (t._$Co ?? (t._$Co = []))[s] = r : t._$Cl = r), r !== void 0 && (e = be(i, r._$AS(i, e.values), r, s)), e;
}
class br {
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
    const { el: { content: t }, parts: s } = this._$AD, r = (e?.creationScope ?? ce).importNode(t, !0);
    pe.currentNode = r;
    let o = pe.nextNode(), n = 0, a = 0, l = s[0];
    for (; l !== void 0; ) {
      if (n === l.index) {
        let c;
        l.type === 2 ? c = new De(o, o.nextSibling, this, e) : l.type === 1 ? c = new l.ctor(o, l.name, l.strings, this, e) : l.type === 6 && (c = new Pr(o, this, e)), this._$AV.push(c), l = s[++a];
      }
      n !== l?.index && (o = pe.nextNode(), n++);
    }
    return pe.currentNode = ce, r;
  }
  p(e) {
    let t = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(e, s, t), t += s.strings.length - 2) : s._$AI(e[t])), t++;
  }
}
class De {
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
    e = be(this, e, t), Ne(e) ? e === v || e == null || e === "" ? (this._$AH !== v && this._$AR(), this._$AH = v) : e !== this._$AH && e !== ve && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : yr(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== v && Ne(this._$AH) ? this._$AA.nextSibling.data = e : this.T(ce.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: t, _$litType$: s } = e, r = typeof s == "number" ? this._$AC(e) : (s.el === void 0 && (s.el = Le.createElement(Is(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === r) this._$AH.p(t);
    else {
      const o = new br(r, this), n = o.u(this.options);
      o.p(t), this.T(n), this._$AH = o;
    }
  }
  _$AC(e) {
    let t = Mt.get(e.strings);
    return t === void 0 && Mt.set(e.strings, t = new Le(e)), t;
  }
  k(e) {
    ht(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let s, r = 0;
    for (const o of e) r === t.length ? t.push(s = new De(this.O(Re()), this.O(Re()), this, this.options)) : s = t[r], s._$AI(o), r++;
    r < t.length && (this._$AR(s && s._$AB.nextSibling, r), t.length = r);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    for (this._$AP?.(!1, !0, t); e !== this._$AB; ) {
      const s = Pt(e).nextSibling;
      Pt(e).remove(), e = s;
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
    let n = !1;
    if (o === void 0) e = be(this, e, t, 0), n = !Ne(e) || e !== this._$AH && e !== ve, n && (this._$AH = e);
    else {
      const a = e;
      let l, c;
      for (e = o[0], l = 0; l < o.length - 1; l++) c = be(this, a[s + l], t, l), c === ve && (c = this._$AH[l]), n || (n = !Ne(c) || c !== this._$AH[l]), c === v ? e = v : e !== v && (e += (c ?? "") + o[l + 1]), this._$AH[l] = c;
    }
    n && !r && this.j(e);
  }
  j(e) {
    e === v ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class wr extends qe {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === v ? void 0 : e;
  }
}
class xr extends qe {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== v);
  }
}
class $r extends qe {
  constructor(e, t, s, r, o) {
    super(e, t, s, r, o), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = be(this, e, t, 0) ?? v) === ve) return;
    const s = this._$AH, r = e === v && s !== v || e.capture !== s.capture || e.once !== s.once || e.passive !== s.passive, o = e !== v && (s === v || r);
    r && this.element.removeEventListener(this.name, this, s), o && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Pr {
  constructor(e, t, s) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    be(this, e);
  }
}
const Sr = Te.litHtmlPolyfillSupport;
Sr?.(Le, De), (Te.litHtmlVersions ?? (Te.litHtmlVersions = [])).push("3.3.2");
const Cr = (i, e, t) => {
  const s = t?.renderBefore ?? e;
  let r = s._$litPart$;
  if (r === void 0) {
    const o = t?.renderBefore ?? null;
    s._$litPart$ = r = new De(e.insertBefore(Re(), o), o, void 0, t ?? {});
  }
  return r._$AI(i), r;
};
const Ae = globalThis;
class ye extends fe {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Cr(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return ve;
  }
}
ye._$litElement$ = !0, ye.finalized = !0, Ae.litElementHydrateSupport?.({ LitElement: ye });
const Er = Ae.litElementPolyfillSupport;
Er?.({ LitElement: ye });
(Ae.litElementVersions ?? (Ae.litElementVersions = [])).push("4.2.2");
const kr = (i) => Object.is(i, -0) ? 0 : i, Fr = (i) => Math.min(Math.max(Math.round(i), 0), 4), Mr = (i, e, t, s) => {
  const r = Number(i);
  if (!Number.isFinite(r))
    return null;
  const o = Fr(t), n = new Intl.NumberFormat(e, {
    minimumFractionDigits: o,
    maximumFractionDigits: o
  }).format(kr(r)), a = s?.trim();
  return a ? `${n} ${a}` : n;
}, Ir = "sensor.power_production_now", Tr = "sensor.energy_production_today", Ar = {
  power: Ir,
  energy: Tr
}, We = (i) => Ar[i], Rr = (i, e) => {
  const t = We(e);
  return i?.states?.[t] ? t : null;
}, Nr = 1100, Lr = 900, It = 900, Dr = 6e3, Or = 5e3, Hr = 16e3, Je = /* @__PURE__ */ new Set(["deviation", "inverter", "error"]);
class zr {
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
    e && (!this._flags.enabled || !this._flags.powerFlow || this._reducedMotion || e.popupOpen || e.totalPower <= 0 || this._armTransient("power", this._kpiShimmers, Lr, "kpi-shimmer"));
  }
  completeFlowPulse() {
    const e = this._flowPulsePanelId;
    e && this._finalizeActiveFlowPulse(e);
  }
  _refreshFlowPulseLoop(e) {
    const t = Object.entries(e.panelPowers).filter(([, n]) => typeof n == "number" && n > 0).map(([n]) => n);
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
    }, Hr);
    this._timers.set("flow-pulse-timeout", t);
  }
  _scheduleNextFlowPulse() {
    this._clearTimeoutByKey("flow-pulse-step");
    const e = window.setTimeout(() => {
      this._timers.delete("flow-pulse-step"), this._triggerNextFlowPulse();
    }, Or);
    this._timers.set("flow-pulse-step", e);
  }
  _finalizeActiveFlowPulse(e) {
    this._flowPulsePanelId === e && (this._clearTimeoutByKey("flow-pulse-timeout"), this._flowPulsePanelId = null, this._notify(), this.triggerPowerImpactFromPulse(), this._scheduleNextFlowPulse());
  }
  _clearFlowPulseLoop() {
    this._clearTimeoutByKey("flow-pulse-step"), this._clearTimeoutByKey("flow-pulse-timeout"), this._flowPulsePanelOrder = [], this._flowPulseIndex = 0, this._flowPulsePanelId !== null && (this._flowPulsePanelId = null, this._notify());
  }
  _triggerKpiShimmers(e, t) {
    e.energyKpiValue !== t.energyKpiValue && this._armTransient("energy", this._kpiShimmers, Nr, "kpi-shimmer");
  }
  _triggerAlertRipples(e, t) {
    for (const [s, r] of Object.entries(t.panelStatuses)) {
      const o = e.panelStatuses[s];
      r !== o && Je.has(r) && this._armTransient(s, this._alertRipples, It, "alert-ripple");
    }
  }
  _syncAlertRippleLoops(e) {
    if (!this._flags.alertRipple) {
      for (const s of [...this._timers.keys()])
        s.startsWith("alert-ripple-loop:") && this._clearTimeoutByKey(s);
      return;
    }
    const t = new Set(
      Object.entries(e.panelStatuses).filter(([, s]) => Je.has(s)).map(([s]) => s)
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
      this._armTransient(e, this._alertRipples, It, "alert-ripple"), this._armAlertRippleLoop(e);
    }, Dr);
    this._timers.set(t, s);
  }
  _canRepeatAlertRipple(e) {
    const t = this._snapshot;
    if (!t || !this._flags.enabled || !this._flags.alertRipple || this._reducedMotion)
      return !1;
    const s = t.panelStatuses[e];
    return Je.has(s);
  }
  _alertRippleLoopKey(e) {
    return `alert-ripple-loop:${e}`;
  }
  _armTransient(e, t, s, r) {
    t.add(e), this._notify();
    const o = `${r}:${e}`;
    this._clearTimeoutByKey(o);
    const n = window.setTimeout(() => {
      t.delete(e), this._timers.delete(o), this._notify();
    }, s);
    this._timers.set(o, n);
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
const Y = (i, e, t) => Math.max(e, Math.min(t, i)), Tt = (i, e) => Math.abs(i - e) < 0.01, Br = (i, e) => Math.hypot(e.x - i.x, e.y - i.y), Gr = (i, e) => ({
  x: i.left - e.left + i.width / 2,
  y: i.top - e.top + i.height / 2
}), Ce = "rgba(224, 232, 242, 1)", Wr = 8, At = 28, Be = 14, Ur = (i) => {
  const e = [];
  for (const t of i) {
    const s = e[e.length - 1];
    s && Tt(s.x, t.x) && Tt(s.y, t.y) || e.push(t);
  }
  return e;
}, Rt = (i) => {
  const e = Ur(i);
  if (e.length < 2)
    return { d: "", length: 0 };
  let t = `M ${e[0].x.toFixed(2)} ${e[0].y.toFixed(2)}`, s = 0;
  for (let r = 1; r < e.length; r += 1) {
    const o = e[r - 1], n = e[r];
    t += ` L ${n.x.toFixed(2)} ${n.y.toFixed(2)}`, s += Br(o, n);
  }
  return { d: t, length: s };
}, Kr = (i, e, t, s) => {
  const r = t - e;
  if (!Number.isFinite(i) || !Number.isFinite(e) || !Number.isFinite(t) || !Number.isFinite(s) || i <= 0 || r <= 0)
    return !1;
  const o = e + r * 0.28, n = i * 0.36;
  return s >= Math.max(o, n) && s <= t;
}, Vr = (i, e, t = !1, s = { x: 0, y: 0 }) => {
  const r = Gr(e, i), o = e.left - i.left, n = e.bottom - i.top;
  return {
    entry: {
      x: (t ? r.x : o - 0.5) + s.x,
      y: (t ? n + 0.5 : r.y) + s.y
    }
  };
}, jr = (i) => {
  const e = i.left + (i.right - i.left) * 0.22;
  return Y(i.statusCenterX || e, i.left + 10, i.right - 10);
}, Yr = (i) => {
  if (i.length === 0)
    return [];
  const e = i.reduce((a, l) => a + Math.max(1, l.bottom - l.top), 0) / i.length, t = Y(e * 0.32, 6, 28), s = [], r = [], o = new Array(i.length).fill(0), n = i.map((a, l) => ({ item: a, index: l })).sort((a, l) => a.item.top - l.item.top || a.item.left - l.item.left);
  for (const { item: a, index: l } of n) {
    const c = a.top + (a.bottom - a.top) / 2;
    let d = s.findIndex((p) => Math.abs(p - c) <= t);
    d < 0 ? (d = s.length, s.push(c), r.push(1)) : (r[d] += 1, s[d] = s[d] + (c - s[d]) / r[d]), o[l] = d;
  }
  return o;
}, qr = (i, e, t, s, r = Math.min(...i.map((n) => n.left)), o = "left-collector") => {
  const n = [], a = [], l = [], c = [], d = (m, b, k) => {
    const F = Rt(b);
    F.d && a.push({
      id: m,
      d: F.d,
      color: Ce,
      opacity: k,
      delayMs: 0,
      durationMs: 1200,
      travelPx: Math.max(24, F.length)
    });
  }, p = (m) => {
    l.some((k) => {
      const F = k.cx - m.cx, M = k.cy - m.cy;
      return Math.hypot(F, M) < Math.max(k.r, m.r) * 0.9;
    }) || l.push(m);
  }, h = /* @__PURE__ */ new Map();
  for (const m of i) {
    const b = h.get(m.row) ?? [];
    b.push(m), h.set(m.row, b);
  }
  const _ = [...h.entries()].sort((m, b) => m[0] - b[0]).map(([m, b]) => ({
    row: m,
    busY: 0,
    minTop: Math.min(...b.map((k) => k.top)),
    maxBottom: Math.max(...b.map((k) => k.bottom))
  }));
  if (_.length === 0)
    return { flowPaths: n, topologyPaths: a, topologyNodes: l, collectorX: Be, rowBuses: c };
  const g = Math.max(0, Math.min(r, ...i.map((m) => m.left))), x = Math.max(6, Be * 0.5), C = Math.max(x, g - 8), P = Y(
    g / 2,
    x,
    Math.min(C, Math.max(Be, s - Be))
  ), w = e.y + 8;
  for (let m = 0; m < _.length; m += 1) {
    const b = _[m], k = _[m - 1], F = b.minTop - 12, M = m === 0 ? w : Math.max(k.maxBottom + 8, k.busY + 8), O = b.minTop - 6;
    b.busY = O > M ? Y(F, M, O) : Math.max(w, b.minTop - 6);
  }
  const T = Y(0.24 / Math.sqrt(Math.max(_.length, 1)), 0.15, 0.22), R = Y(0.24 / Math.sqrt(Math.max(i.length, 1)), 0.09, 0.16);
  p({
    id: "power-socket-node",
    cx: e.x,
    cy: e.y,
    r: Y(t * 0.18, 2.8, 4.8),
    color: Ce,
    opacity: 0.36
  });
  const $ = _[0], E = Math.max(..._.map((m) => m.busY)), D = o === "direct-first-row", A = _.length > 1;
  D ? (d(
    "power-drop-rail",
    [
      e,
      { x: e.x, y: $.busY }
    ],
    T
  ), p({
    id: "power-drop-node",
    cx: e.x,
    cy: $.busY,
    r: Y(t * 0.18, 2.8, 4.8),
    color: Ce,
    opacity: 0.36
  }), A && d(
    "collector-rail",
    [
      { x: P, y: $.busY },
      { x: P, y: E }
    ],
    T
  )) : (d(
    "collector-rail",
    [
      { x: P, y: e.y },
      { x: P, y: E }
    ],
    T
  ), d(
    "power-entry-rail",
    [
      { x: P, y: e.y },
      e
    ],
    T
  ));
  for (const m of _) {
    const b = h.get(m.row) ?? [];
    if (b.length === 0)
      continue;
    const k = b.map((y) => y.anchorX), F = m.row === $.row, M = D && F ? [e.x, ...k, ...A ? [P] : []] : [P, ...k], O = Math.min(...M), J = Math.max(...M);
    c.push({
      row: m.row,
      y: m.busY,
      startX: O,
      endX: J
    }), d(
      `row-rail-${m.row}`,
      [
        { x: O, y: m.busY },
        { x: J, y: m.busY }
      ],
      T
    ), (!D || !F || A) && p({
      id: `row-node-${m.row}`,
      cx: P,
      cy: m.busY,
      r: Y(t * 0.2, 2.8, 4.8),
      color: Ce,
      opacity: 0.32
    });
    for (const y of b) {
      const S = D && F ? [
        { x: y.anchorX, y: y.anchorY },
        { x: y.anchorX, y: m.busY },
        { x: e.x, y: m.busY },
        e
      ] : D ? [
        { x: y.anchorX, y: y.anchorY },
        { x: y.anchorX, y: m.busY },
        { x: P, y: m.busY },
        { x: P, y: $.busY },
        { x: e.x, y: $.busY },
        e
      ] : [
        { x: y.anchorX, y: y.anchorY },
        { x: y.anchorX, y: m.busY },
        { x: P, y: m.busY },
        { x: P, y: e.y },
        e
      ], U = Rt(
        S
      );
      if (d(
        `tap-rail-${y.id}`,
        [
          { x: y.anchorX, y: y.anchorY },
          { x: y.anchorX, y: m.busY }
        ],
        R
      ), p({
        id: `tap-node-${y.id}`,
        cx: y.anchorX,
        cy: m.busY,
        r: Y(t * 0.18, 2.6, 4.4),
        color: Ce,
        opacity: 0.3
      }), !y.producing || !U.d)
        continue;
      const K = Math.max(At, U.length), ee = K + At;
      n.push({
        id: `flow-${y.id}`,
        panelId: y.id,
        d: U.d,
        color: y.accentColor,
        opacity: 0.62 + Math.min(y.intensity, 1) * 0.2,
        delayMs: 0,
        durationMs: Math.round(ee * Wr),
        travelPx: K,
        offsetPx: -ee
      });
    }
  }
  return { flowPaths: n, topologyPaths: a, topologyNodes: l, collectorX: P, rowBuses: c };
}, Xr = (i, e, t, s, r, o, n) => {
  const a = i.map((c) => ({
    id: c.panel.id,
    row: c.row,
    anchorX: jr(c),
    anchorY: c.top + 1.5,
    left: c.left,
    right: c.right,
    top: c.top,
    bottom: c.bottom,
    accentColor: c.panel.accentColor,
    intensity: c.panel.intensity,
    producing: e.has(c.panel.id)
  })), l = qr(
    a,
    t.entry,
    s,
    r,
    o,
    n
  );
  return {
    flowPaths: l.flowPaths,
    topologyPaths: l.topologyPaths,
    topologyNodes: l.topologyNodes
  };
}, Qr = (i, e, t, s) => {
  const r = e.querySelector("ha-card");
  if (!r)
    return null;
  const o = r.getBoundingClientRect();
  if (o.width <= 0 || o.height <= 0)
    return null;
  const n = {
    x: r.scrollLeft,
    y: r.scrollTop
  }, a = e.querySelector('[data-kpi="power"]');
  if (!a)
    return null;
  const l = s.panels.map((m) => e.querySelector(`[data-panel-id="${m.id}"]`)).filter((m) => !!m).map((m) => {
    const b = m.getBoundingClientRect();
    return {
      left: b.left - o.left + n.x,
      right: b.right - o.left + n.x,
      top: b.top - o.top + n.y,
      bottom: b.bottom - o.top + n.y
    };
  }).filter((m) => Number.isFinite(m.left) && Number.isFinite(m.right)), c = l.length > 0 ? Math.min(...l.map((m) => m.left)) : 0, d = l.length > 0 ? Math.max(...l.map((m) => m.right)) : o.width, p = s.panels.filter(
    (m) => !m.hiddenSlot && m.enabled && !!m.powerEntityName
  );
  if (p.length === 0)
    return null;
  const h = new Set(
    p.filter((m) => typeof m.power == "number" && m.power > 0).map((m) => m.id)
  ), _ = p.map((m) => ({
    panel: m,
    element: e.querySelector(`[data-panel-id="${m.id}"]`)
  })).filter(
    (m) => !!m.element
  ).map((m) => {
    const b = m.element.getBoundingClientRect(), k = {
      x: b.left - o.left + n.x + b.width / 2,
      y: b.top - o.top + n.y + b.height / 2
    }, M = m.element.querySelector(".status")?.getBoundingClientRect(), O = M && M.width > 0 ? M.left - o.left + n.x + M.width * 0.33 : k.x;
    return {
      panel: m.panel,
      row: 0,
      center: k,
      statusCenterX: O,
      left: b.left - o.left + n.x,
      right: b.right - o.left + n.x,
      top: b.top - o.top + n.y,
      bottom: b.bottom - o.top + n.y
    };
  }), g = Yr(_), x = _.map((m, b) => ({
    ...m,
    row: g[b] ?? 0
  }));
  if (x.length === 0)
    return null;
  const C = x.reduce((m, b) => {
    const k = b.right - b.left, F = b.bottom - b.top;
    return m + Math.min(k, F);
  }, 0) / x.length, P = Y(Math.round(C * 0.2), 18, 34), w = a.getBoundingClientRect(), T = w.left - o.left + n.x + w.width / 2, R = Kr(
    o.width,
    c,
    d,
    T
  ), $ = Vr(
    o,
    w,
    R,
    n
  ), { flowPaths: E, topologyPaths: D, topologyNodes: A } = Xr(
    x,
    h,
    $,
    P,
    o.width,
    c,
    R ? "direct-first-row" : "left-collector"
  );
  return {
    width: Math.max(
      r.clientWidth,
      o.width,
      d,
      $.entry.x
    ),
    height: Math.max(
      r.clientHeight,
      ...x.map((m) => m.bottom),
      $.entry.y
    ),
    flowPaths: E,
    topologyPaths: D,
    topologyNodes: A
  };
}, Zr = (i, e) => {
  if (!i || i.flowPaths.length === 0 && i.topologyPaths.length === 0)
    return v;
  const t = i.flowPaths.filter(
    (s) => e.showFlow && e.activeFlowPanelId !== null && s.panelId === e.activeFlowPanelId
  );
  return f`
    <svg
      class="spv-motion-overlay-svg"
      viewBox=${`0 0 ${i.width} ${i.height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      ${e.showTopology ? i.topologyPaths.map(
    (s) => B`<path
              class="spv-motion-backbone"
              d=${s.d}
              style=${`--spv-motion-color:${s.color}; --spv-motion-opacity:${s.opacity};`}
            ></path>`
  ) : v}

      ${e.showTopology ? i.topologyNodes.map(
    (s) => B`<circle
              class="spv-motion-node"
              cx=${s.cx}
              cy=${s.cy}
              r=${s.r}
              style=${`--spv-motion-color:${s.color}; --spv-motion-opacity:${s.opacity};`}
            ></circle>`
  ) : v}

      ${t.map(
    (s) => B`<path
          class="spv-motion-flow"
          d=${s.d}
          style=${`--spv-motion-color:${s.color}; --spv-motion-opacity:${s.opacity}; --spv-flow-duration:${s.durationMs}ms; --spv-flow-delay:${s.delayMs}ms; --spv-flow-travel:${s.travelPx}px; --spv-flow-offset:${s.offsetPx ?? -s.travelPx}px;`}
        ></path>`
  )}
    </svg>
  `;
}, Jr = dt`
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
`, Ts = 1.2, ei = /* @__PURE__ */ new Set(["unknown", "unavailable", "none", "null", ""]), se = (i, e = 0, t = 1) => Math.min(Math.max(i, e), t), me = (i) => {
  if (!i)
    return null;
  const e = i.state?.toString().trim().toLowerCase();
  if (ei.has(e))
    return null;
  const t = Number(i.state);
  return Number.isFinite(t) ? t : null;
}, ti = (i) => {
  if (i == null)
    return;
  const e = i.toString().replace(/[\u200B-\u200D\uFEFF]/g, "").replace(/\s+/g, " ").trim();
  return e.length > 0 ? e : void 0;
}, Nt = (i) => i.toLowerCase().match(/[a-z0-9]+/g) ?? [], Lt = (i, e) => {
  const t = Nt(i);
  return t.length === 0 ? !1 : e.some((s) => {
    const r = Nt(s);
    if (r.length === 0 || r.length > t.length)
      return !1;
    for (let o = 0; o <= t.length - r.length; o += 1) {
      let n = !0;
      for (let a = 0; a < r.length; a += 1)
        if (t[o + a] !== r[a]) {
          n = !1;
          break;
        }
      if (n)
        return !0;
    }
    return !1;
  });
}, Ee = (i, e) => {
  const t = i?.attributes?.friendly_name;
  return typeof t == "string" && t.trim().length > 0 ? t : e;
}, Dt = (i, e, t, s, r = "en") => {
  if (i === null)
    return s;
  const o = Object.is(i, -0) ? 0 : i, n = new Intl.NumberFormat(r, {
    minimumFractionDigits: t,
    maximumFractionDigits: t
  }).format(o);
  return e ? `${n} ${e}` : n;
}, Ot = (i) => {
  const e = i.replace("#", ""), t = e.length === 3 ? e.split("").map((s) => `${s}${s}`).join("") : e;
  return [
    parseInt(t.slice(0, 2), 16),
    parseInt(t.slice(2, 4), 16),
    parseInt(t.slice(4, 6), 16)
  ];
}, Ht = (i, e, t) => {
  const s = se(t), [r, o, n] = Ot(i), [a, l, c] = Ot(e), d = (p, h) => Math.round(p + (h - p) * s);
  return `rgb(${d(r, a)}, ${d(o, l)}, ${d(n, c)})`;
}, si = (i, e, t, s) => {
  const r = se(s);
  return r <= 0.5 ? Ht(i, e, r * 2) : Ht(e, t, (r - 0.5) * 2);
}, ri = (i) => {
  if (i.length === 0)
    return 0;
  const e = [...i].sort((o, n) => o - n), t = Math.floor(e.length * 0.4), s = e.slice(t), r = s.reduce((o, n) => o + n, 0) / Math.max(s.length, 1);
  return se(r, 0, Ts);
}, ii = (i, e, t) => {
  if (t <= 0)
    return i;
  const s = e - t * 60 * 1e3;
  return i.filter((r) => r.ts >= s);
}, oi = (i) => {
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
}, ni = (i, e, t, s) => {
  if (!e || e.length === 0)
    return {
      value: i,
      sampleCount: 1,
      firstSampleTs: t
    };
  const r = e.filter((d) => Number.isFinite(d.value)).sort((d, p) => d.ts - p.ts);
  if (r.length === 0)
    return {
      value: i,
      sampleCount: 1,
      firstSampleTs: t
    };
  const o = ii(r, t, s), n = oi(r), a = s > 0 ? Math.max(2, Math.ceil(s / Math.max(n, 0.1)) + 1) : 1;
  let l = o.length > 0 ? o : r;
  return s > 0 && l.length < a && r.length > l.length && (l = r.slice(-a)), {
    value: l.reduce((d, p) => d + p.value, 0) / Math.max(l.length, 1),
    sampleCount: l.length,
    firstSampleTs: r[0].ts ?? null
  };
}, ge = (i, e, t) => {
  const s = e?.locale?.language ?? "en", r = (u, N) => Ke(s, u, N), o = r("common.unavailable"), n = t?.nowMs ?? Date.now(), a = { ...lt, ...i.colors ?? {} }, l = i.enable_inverter_status ?? !1, c = (i.inverter_fault_terms ?? []).map((u) => u.trim().toLowerCase()).filter((u) => u.length > 0), d = (i.inverter_working_terms ?? []).map((u) => u.trim().toLowerCase()).filter((u) => u.length > 0), p = i.production_color_intensity ?? 1, h = t?.deviationEnabled ?? !0, _ = i.deviation_min_active_panels ?? 3, g = i.deviation_min_samples ?? 3, x = i.deviation_min_runtime_minutes ?? 15, C = i.deviation_smoothing_minutes ?? 0, P = i.deviation_dynamic_floor_w ?? 20, w = i.deviation_threshold_percent ?? 15, T = i.deviation_absolute_w_threshold ?? 50, R = t?.historyByEntityId ?? {}, $ = i.panels.map((u, N) => {
    const ue = u.enabled ?? !0, V = u.name ?? `Panel ${N + 1}`, q = u.inverter_status_entity ?? u.error_entity, I = q ? e?.states?.[q] : void 0, L = q ? ti(I?.state) ?? o : void 0, H = Ee(
      I,
      q
    ), X = L !== void 0 && L !== o && Lt(L, c), Q = L !== void 0 && L !== o && Lt(L, d);
    if (!ue)
      return {
        config: u,
        slotIndex: N,
        label: V,
        power: null,
        energy: null,
        inverterStatusEntityName: H,
        inverterStatusDisplay: L,
        inverterFaultMatched: X,
        inverterWorkingMatched: Q,
        reason: r("state.reason.slot_hidden"),
        status: "disabled",
        enabled: !1,
        hiddenSlot: !0
      };
    if (!u.power_entity)
      return {
        config: u,
        slotIndex: N,
        label: V,
        power: null,
        energy: null,
        inverterStatusEntityName: H,
        inverterStatusDisplay: L,
        inverterFaultMatched: X,
        inverterWorkingMatched: Q,
        reason: r("state.reason.select_power_sensor"),
        status: "unconfigured",
        enabled: !0,
        hiddenSlot: !1
      };
    const Z = e?.states?.[u.power_entity], _e = u.energy_entity ? e?.states?.[u.energy_entity] : void 0;
    if (!Z)
      return {
        config: u,
        slotIndex: N,
        label: V,
        power: null,
        energy: null,
        inverterStatusEntityName: H,
        inverterStatusDisplay: L,
        inverterFaultMatched: X,
        inverterWorkingMatched: Q,
        reason: r("state.reason.power_entity_missing", {
          entity: u.power_entity
        }),
        status: "offline",
        enabled: !0,
        hiddenSlot: !1
      };
    if (l && L && L !== o && X)
      return {
        config: u,
        slotIndex: N,
        label: V,
        power: me(Z),
        energy: me(_e),
        powerEntityName: Ee(Z, u.power_entity),
        inverterStatusEntityName: H,
        inverterStatusDisplay: L,
        inverterFaultMatched: X,
        inverterWorkingMatched: Q,
        reason: r("state.reason.inverter_fault_match", {
          status: L
        }),
        status: "error",
        enabled: !0,
        hiddenSlot: !1
      };
    if (l && L && L !== o && d.length > 0 && !Q)
      return {
        config: u,
        slotIndex: N,
        label: V,
        power: me(Z),
        energy: me(_e),
        powerEntityName: Ee(Z, u.power_entity),
        inverterStatusEntityName: H,
        inverterStatusDisplay: L,
        inverterFaultMatched: X,
        inverterWorkingMatched: Q,
        reason: r("state.reason.inverter_working_mismatch", {
          status: L
        }),
        status: "inverter",
        enabled: !0,
        hiddenSlot: !1
      };
    const He = me(Z), ze = me(_e);
    return He === null ? {
      config: u,
      slotIndex: N,
      label: V,
      power: null,
      energy: ze,
      powerEntityName: Ee(Z, u.power_entity),
      inverterStatusEntityName: H,
      inverterStatusDisplay: L,
      inverterFaultMatched: X,
      inverterWorkingMatched: Q,
      reason: r("state.reason.power_entity_unavailable", {
        entity: u.power_entity
      }),
      status: "offline",
      enabled: !0,
      hiddenSlot: !1
    } : {
      config: u,
      slotIndex: N,
      label: V,
      power: He,
      energy: ze,
      powerEntityName: Ee(Z, u.power_entity),
      inverterStatusEntityName: H,
      inverterStatusDisplay: L,
      inverterFaultMatched: X,
      inverterWorkingMatched: Q,
      reason: r("state.reason.producing_expected"),
      status: "normal",
      enabled: !0,
      hiddenSlot: !1
    };
  }), D = $.filter(
    (u) => u.status === "normal" && u.power !== null
  ).map((u) => u.power ?? 0), A = D.length > 0 ? Math.max(...D) : 0;
  let m = 0, b = 0, k = 0, F = 0, M = 0, O = 0, J = 0, y, S = !1;
  const U = $.filter((u) => u.status === "normal" && u.power !== null).flatMap((u) => {
    const N = u.config.rated_power_w ?? i.default_panel_rated_power_w ?? null;
    if (N === null || N <= 0 || !u.config.power_entity)
      return [];
    const ue = Math.min(
      Math.max(u.config.deviation_derate_percent ?? 100, 1),
      100
    ), V = N * (ue / 100);
    if (V <= 0)
      return [];
    const q = ni(
      u.power,
      R[u.config.power_entity],
      n,
      C
    );
    return [
      {
        id: u.config.id,
        effectivePower: q.value,
        livePower: u.power,
        ratedPowerW: N,
        ratedForDeviationW: V,
        isDerated: ue < 100,
        sampleCount: q.sampleCount,
        firstSampleTs: q.firstSampleTs
      }
    ];
  }), K = U.filter((u) => !u.isDerated), ee = K.length > 0 ? Math.min(...K.map((u) => u.sampleCount)) : 0, de = K.length > 0 ? Math.min(
    ...K.map(
      (u) => u.firstSampleTs === null ? 0 : (n - u.firstSampleTs) / 6e4
    )
  ) : 0;
  h ? K.length < _ ? y = r("state.reason.need_non_derated_panels", {
    count: _
  }) : ee < g ? y = r("state.reason.collecting_samples", {
    current: ee,
    required: g
  }) : de < x ? y = r("state.reason.warmup_progress", {
    current: Math.floor(de),
    required: x
  }) : S = !0 : y = r("state.reason.array_check_disabled");
  const we = K.map(
    (u) => se(u.effectivePower / u.ratedForDeviationW, 0, Ts)
  ), xe = ri(we);
  S && Math.max(
    ...K.map(
      (N) => N.ratedForDeviationW * xe
    ),
    0
  ) < P && (S = !1, y = r("state.reason.low_light_pause", {
    floor: P.toFixed(0)
  }));
  const he = $.map((u) => {
    const N = (u.config.power_entity ? e?.states?.[u.config.power_entity]?.attributes?.unit_of_measurement : void 0) ?? r("state.power.default_unit"), ue = u.config.energy_entity ? e?.states?.[u.config.energy_entity]?.attributes?.unit_of_measurement : void 0, V = !!u.config.energy_entity, q = u.config.show_energy ?? !1;
    let I = u.status, L = null;
    const H = u.config.rated_power_w ?? i.default_panel_rated_power_w ?? null, X = H !== null && u.power !== null && H > 0 ? se(u.power / H * 100, 0, 999) : null;
    if (I === "normal" && H === null && (u.reason = r("state.reason.rated_not_configured")), S && I === "normal" && H !== null && u.power !== null) {
      const Xe = U.find(
        (Pe) => Pe.id === u.config.id
      );
      if (Xe) {
        const Pe = Xe.ratedForDeviationW * xe, Qe = Math.max(Pe - Xe.effectivePower, 0), _t = Pe > 0 ? Qe / Pe * 100 : 0;
        _t >= w && Qe >= T ? (I = "deviation", L = se(_t, 0, 100), u.reason = r("state.reason.output_below_target", {
          percent: L.toFixed(0),
          shortfall: Qe.toFixed(0)
        })) : u.reason = r("state.reason.producing_adjusted");
      }
    } else I === "normal" && y && (u.reason = y);
    I === "error" && (k += 1), I === "inverter" && (b += 1), I === "deviation" && (m += 1), I === "offline" && (F += 1), I === "normal" && (M += 1), I === "unconfigured" && (O += 1), I === "disabled" && (J += 1);
    const Q = H !== null && H > 0 && u.power !== null ? u.power / H : null, Z = u.power !== null && A > 0 ? u.power / A : 0, _e = se(Q ?? Z, 0, 1), He = se((p - 0.2) / 1.4, 0, 1), ze = se(
      (0.1 + He * 0.9) * (0.15 + _e * 0.85),
      0.06,
      1
    ), Ds = I === "deviation" || I === "error" || I === "inverter" ? 1 : ze, Os = I === "normal" && u.power !== null && u.power <= 0, Hs = I === "error" || I === "inverter" ? a.error : Os || I === "offline" || I === "unconfigured" || I === "disabled" ? a.unavailable : I === "deviation" ? a.deviation : si(
      a.production_start,
      a.production_mid,
      a.production_end,
      _e
    );
    return {
      id: u.config.id,
      slotIndex: u.slotIndex,
      label: u.label,
      status: I,
      power: u.power,
      powerDisplay: I === "disabled" ? r("state.status_display.disabled") : I === "unconfigured" ? r("state.status_display.not_configured") : Dt(
        u.power,
        N,
        i.power_decimals ?? 0,
        o,
        s
      ),
      energy: u.energy,
      energyDisplay: u.hiddenSlot || !V || !q ? void 0 : u.energy !== null ? Dt(
        u.energy,
        ue ?? r("state.energy.default_unit"),
        i.energy_decimals ?? 2,
        o,
        s
      ) : o,
      powerEntityName: u.powerEntityName,
      inverterStatusEntityName: u.inverterStatusEntityName,
      inverterStatusDisplay: u.inverterStatusDisplay,
      inverterFaultMatched: u.inverterFaultMatched,
      inverterWorkingMatched: u.inverterWorkingMatched,
      deviationPercent: L,
      reason: u.reason,
      accentColor: Hs,
      intensity: Ds,
      enabled: u.enabled,
      hiddenSlot: u.hiddenSlot,
      ratedPowerW: H,
      performancePercent: X
    };
  }), Oe = he.reduce((u, N) => u + (N.power ?? 0), 0), $e = he.map((u) => u.energy).filter((u) => u !== null), G = $e.length > 0 ? $e.reduce((u, N) => u + N, 0) : null;
  return {
    panels: he,
    totalPower: Oe,
    totalEnergy: G,
    maxPower: A,
    deviationCount: m,
    inverterCount: b,
    errorCount: k,
    offlineCount: F,
    normalCount: M,
    unconfiguredCount: O,
    disabledCount: J,
    deviationReady: S,
    deviationSuppressedReason: y
  };
}, zt = (i, e = 0) => Math.max(36, i - 36 - Math.max(0, e)), ai = ({
  candidates: i,
  panelWidthPx: e,
  panelHeightPx: t,
  fontPx: s,
  reservedRightPx: r = 0,
  measureTextWidthPx: o
}) => {
  const n = i.find((p) => p.variant === "compact");
  if (!n)
    throw new Error("Panel performance label requires a compact candidate.");
  if (t < 96 || e < 112)
    return n;
  const a = i.find((p) => p.variant === "full"), l = zt(e, r);
  if (a && o(a.text, s) <= l)
    return a;
  const c = zt(e), d = i.find((p) => p.variant === "medium");
  return d && o(d.text, s) <= c ? d : n;
}, ut = (i) => Number.isFinite(i.ts) && Number.isFinite(i.value), li = 1e-4, pi = (i) => i === 1 ? 6e4 : i === 6 ? 3 * 6e4 : i === 24 ? 10 * 6e4 : 5 * 6e4, Ue = (i, e, t) => {
  const s = e - t * 60 * 60 * 1e3;
  return i.filter(ut).filter((r) => r.ts >= s && r.ts <= e).sort((r, o) => r.ts - o.ts);
}, As = (i, e) => {
  if (i.length < 2)
    return [...i].sort((d, p) => d.ts - p.ts);
  const t = e?.zeroTolerance ?? li, s = [...i].filter(ut).sort((d, p) => d.ts - p.ts);
  if (s.length < 2)
    return s;
  const r = s.slice(1).map((d, p) => d.ts - s[p].ts).filter((d) => Number.isFinite(d) && d > 0).sort((d, p) => d - p), o = r.length > 0 ? r[Math.floor(r.length / 2)] : Number.NaN, n = pi(e?.rangeHours), a = Math.min(
    Math.max(
      Number.isFinite(e?.stepMs) ? e?.stepMs : Number.isFinite(o) ? o : n,
      3e4
    ),
    n * 2
  ), l = a * 2, c = [s[0]];
  for (let d = 1; d < s.length; d += 1) {
    const p = s[d - 1], h = s[d], _ = h.ts - p.ts, g = Math.abs(p.value) <= t, x = h.value > t;
    if (g && x && _ >= l) {
      const C = Math.max(p.ts + 1, h.ts - a);
      C > p.ts && C < h.ts && c.push({ ts: C, value: 0 });
    }
    c.push(h);
  }
  return c.filter(
    (d, p, h) => p === 0 ? !0 : d.ts !== h[p - 1].ts || d.value !== h[p - 1].value
  );
}, ot = (i, e) => {
  if (i.length <= e || e <= 2)
    return [...i];
  const t = i[0], s = i[i.length - 1], r = i.slice(1, i.length - 1), o = e - 2, n = r.length / o, a = [t];
  let l = -1;
  for (let c = 0; c < o; c += 1) {
    const d = Math.min(
      r.length - 1,
      Math.floor(c * n)
    );
    d !== l && (l = d, a.push(r[d]));
  }
  return a.push(s), a.sort((c, d) => c.ts - d.ts).filter(
    (c, d, p) => d === 0 ? !0 : c.ts !== p[d - 1].ts || c.value !== p[d - 1].value
  ).slice(0, e);
}, ci = (i) => {
  const e = i.map(
    (n) => [...n].filter(ut).sort((a, l) => a.ts - l.ts).filter(
      (a, l, c) => l === c.length - 1 ? !0 : a.ts !== c[l + 1].ts
    )
  ).filter((n) => n.length > 0);
  if (e.length === 0)
    return [];
  const t = [
    ...new Set(e.flatMap((n) => n.map((a) => a.ts)))
  ].sort((n, a) => n - a), s = e.map(() => 0), r = e.map(() => null), o = [];
  for (const n of t) {
    let a = 0;
    for (let c = 0; c < e.length; c += 1) {
      const d = e[c];
      for (; s[c] < d.length && d[s[c]].ts <= n; )
        r[c] = d[s[c]].value, s[c] += 1;
      r[c] !== null && (a += 1);
    }
    if (a === 0)
      continue;
    const l = r.reduce(
      (c, d) => c + (d ?? 0),
      0
    );
    o.push({
      ts: n,
      value: Object.is(l, -0) ? 0 : l
    });
  }
  return o;
}, Bt = (i) => Number.isFinite(i.ts) && Number.isFinite(i.value), di = (i) => i.map(
  (e, t) => `${t === 0 ? "M" : "L"}${e.x.toFixed(2)},${e.y.toFixed(2)}`
).join(" "), hi = (i, e, t, s, r = 320, o = 132, n = 10) => {
  const a = t * 60 * 60 * 1e3, l = e - a, c = e, d = Math.max(c - l, 1), p = Math.max(r - n * 2, 1), h = Math.max(o - n * 2, 1), _ = i.map(($) => {
    const E = Ue($.samples, e, t).filter(Bt), D = E.length === 1 ? [
      { ts: l, value: E[0].value },
      { ts: c, value: E[0].value }
    ] : E, A = As(D, { rangeHours: t }), m = ot(A, s).filter(Bt), b = m.map((k) => k.value);
    return {
      id: $.id,
      samples: m,
      sampleCount: m.length,
      firstTs: m.length > 0 ? m[0].ts : null,
      lastTs: m.length > 0 ? m[m.length - 1].ts : null,
      minValue: b.length > 0 ? Math.min(...b) : null,
      maxValue: b.length > 0 ? Math.max(...b) : null
    };
  }), g = _.flatMap(($) => $.samples.map((E) => E.value)), x = g.length > 0;
  let C = 0, P = 1;
  x && (C = Math.min(...g), P = Math.max(...g), C === P && (C -= 1, P += 1));
  const w = Math.max(P - C, 1), T = _.map(($) => {
    const E = $.samples.map((A) => {
      const m = (A.ts - l) / d, b = n + Math.min(Math.max(m, 0), 1) * p, k = o - n - (A.value - C) / w * h;
      return !Number.isFinite(b) || !Number.isFinite(k) ? null : { x: b, y: k };
    }).filter((A) => A !== null), D = E.length >= 2 ? di(E) : "";
    return {
      id: $.id,
      samples: $.samples,
      points: E,
      linePath: D,
      firstPoint: E.length > 0 ? E[0] : null,
      lastPoint: E.length > 0 ? E[E.length - 1] : null,
      sampleCount: $.sampleCount,
      pointsCount: E.length,
      firstTs: $.firstTs,
      lastTs: $.lastTs,
      minValue: $.minValue,
      maxValue: $.maxValue
    };
  }), R = T.filter(($) => $.pointsCount > 0).length;
  return {
    startTs: l,
    endTs: c,
    hasData: x,
    drawableCount: R,
    series: T
  };
}, ke = (i, e, t, s, r = "en") => {
  if (i === null)
    return s;
  const o = Object.is(i, -0) ? 0 : i;
  return `${new Intl.NumberFormat(r, {
    minimumFractionDigits: e,
    maximumFractionDigits: e
  }).format(o)} ${t}`;
}, te = (i) => Object.is(i, -0) ? 0 : i, ui = (i) => {
  if (!i)
    return;
  const e = i.replace(/[\u200B-\u200D\uFEFF]/g, "").replace(/\s+/g, " ").trim();
  return e.length > 0 ? e : void 0;
}, Gt = 1, _i = "spv:history:", mi = "spv-card-config-updated", gi = 6e4, et = [1, 6, 24], tt = 150, fi = 45e3, yi = 45e3, vi = 64, bi = /* @__PURE__ */ new Set(["unknown", "unavailable", "none", "null", ""]), Wt = [
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
}, rt = (i, e = 120) => i.length <= e ? i : `${i.slice(0, e - 1)}…`, le = class le extends ye {
  constructor() {
    super(...arguments), this._cardWidth = 0, this._selectedPanelId = null, this._showLivePowerPopup = !1, this._showEnergyPopup = !1, this._showCustomKpiPopup = !1, this._showSystemHealthPopup = !1, this._dragSourceSlotIndex = null, this._historyByEntityId = {}, this._historyState = "idle", this._historySignature = "", this._historyQuerySignature = "", this._historyLastLoadMs = 0, this._historyLoadToken = 0, this._popupGraphRangeHours = 6, this._popupGraphCache = {}, this._popupGraphRequestToken = 0, this._popupGraphLatestTokenByKey = {}, this._kpiCompareExpanded = {
      power: !1,
      energy: !1
    }, this._kpiCompareRangeHours = {
      power: 6,
      energy: 6
    }, this._kpiCompareCache = {}, this._kpiCompareRequestToken = 0, this._kpiCompareLatestTokenByKey = {}, this._persistConfigToken = 0, this._popupScrollRestoreToken = 0, this._popupScrollRestore = null, this._motionEngine = new zr(() => this.requestUpdate()), this._motionOverlayModel = null, this._motionOverlaySignature = "", this._overlayMeasureFrame = null, this._panelDetailOverflowFrame = null, this._activePulseColor = "rgba(111, 201, 255, 0.72)", this._onMotionAnimationEnd = (e) => {
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
        Me({
          ...this._config,
          enable_forecast_overlay: !0
        })
      ), this._showLivePowerPopup && e) {
        const s = this._getSystemPowerEntityId(), r = s ? this._popupGraphRangeHours : this._kpiCompareRangeHours.power;
        if (s)
          this._ensurePopupGraphLoadedByEntity(s, r);
        else {
          const o = this._derived ?? (this._config && this.hass ? ge(this._config, this.hass) : null);
          o && this._ensurePanelCompareLoaded(o, "power", r);
        }
        this._ensurePopupGraphLoadedByEntity(e, r);
      }
      if (this._showEnergyPopup && t) {
        const s = this._getSystemEnergyEntityId(), r = s ? this._popupGraphRangeHours : this._kpiCompareRangeHours.energy;
        if (s)
          this._ensurePopupGraphLoadedByEntity(s, r);
        else {
          const o = this._derived ?? (this._config && this.hass ? ge(this._config, this.hass) : null);
          o && this._ensurePanelCompareLoaded(o, "energy", r);
        }
        this._ensurePopupGraphLoadedByEntity(t, r);
      }
    }, this._closeDialog = () => {
      this._closeAllPopups(), this._kpiCompareExpanded = { power: !1, energy: !1 }, this._kpiCompareRangeHours = { power: 6, energy: 6 };
    }, this._openLivePowerPopup = () => {
      this._selectedPanelId = null;
      const e = this._getSystemPowerEntityId();
      if (this._kpiCompareExpanded = { power: !1, energy: !1 }, this._kpiCompareRangeHours = { power: 6, energy: 6 }, this._showLivePowerPopup = !0, this._showEnergyPopup = !1, this._showCustomKpiPopup = !1, this._showSystemHealthPopup = !1, this._popupGraphRangeHours = 6, e) {
        if (this._ensurePopupGraphLoadedByEntity(e, 6), this._isForecastOverlayEnabled()) {
          const t = this._getForecastEntityId("power");
          t && this._ensurePopupGraphLoadedByEntity(t, 6);
        }
      } else {
        const t = this._derived ?? (this._config && this.hass ? ge(this._config, this.hass) : null);
        if (t && (this._kpiCompareExpanded = {
          ...this._kpiCompareExpanded,
          power: this._buildPanelCompareTargets(t, "power").length > 0
        }, this._ensurePanelCompareLoaded(t, "power", this._kpiCompareRangeHours.power)), this._isForecastOverlayEnabled()) {
          const s = this._getForecastEntityId("power");
          s && this._ensurePopupGraphLoadedByEntity(
            s,
            this._kpiCompareRangeHours.power
          );
        }
      }
    }, this._closeLivePowerPopup = () => {
      this._closeAllPopups();
    }, this._openEnergyPopup = () => {
      this._selectedPanelId = null;
      const e = this._getSystemEnergyEntityId();
      if (this._kpiCompareExpanded = { power: !1, energy: !1 }, this._kpiCompareRangeHours = { power: 6, energy: 6 }, this._showEnergyPopup = !0, this._showLivePowerPopup = !1, this._showCustomKpiPopup = !1, this._showSystemHealthPopup = !1, this._popupGraphRangeHours = 6, e) {
        if (this._ensurePopupGraphLoadedByEntity(e, 6), this._isForecastOverlayEnabled()) {
          const t = this._getForecastEntityId("energy");
          t && this._ensurePopupGraphLoadedByEntity(t, 6);
        }
      } else {
        const t = this._derived ?? (this._config && this.hass ? ge(this._config, this.hass) : null);
        if (t && (this._kpiCompareExpanded = {
          ...this._kpiCompareExpanded,
          energy: this._buildPanelCompareTargets(t, "energy").length > 0
        }, this._ensurePanelCompareLoaded(t, "energy", this._kpiCompareRangeHours.energy)), this._isForecastOverlayEnabled()) {
          const s = this._getForecastEntityId("energy");
          s && this._ensurePopupGraphLoadedByEntity(
            s,
            this._kpiCompareRangeHours.energy
          );
        }
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
    return await Promise.resolve().then(() => ki), document.createElement("solar-panel-visualizer-card-editor");
  }
  static getStubConfig() {
    return Ys();
  }
  _normalizeCardConfig(e) {
    return Me(e);
  }
  _renderCardOverlay(e) {
    const t = this._getCurrentConfig(), s = this._motionEngine.getState();
    return Zr(this._motionOverlayModel, {
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
    return Ps(this.hass, e, t);
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
    const r = Qr(this, s, e, t), o = JSON.stringify(r);
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
    const t = qs(e);
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
    ), n = 220 + r * o + Math.max(0, r - 1) * 10, a = this._config?.max_card_height_px ? Math.min(n, this._config.max_card_height_px) : n;
    return Math.max(5, Math.ceil(a / 50));
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
        const n = this._getPanelDetailMaxScrollTop(t);
        t.scrollTop = Math.min(r, n);
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
    const s = t.dataset.performanceFull, r = t.dataset.performanceMedium, o = t.dataset.performanceCompact, n = [s, r, o].filter(
      (c) => !!c
    );
    if (n.length === 0)
      return;
    const a = t.textContent?.trim(), l = Math.max(
      0,
      n.findIndex((c) => c === a)
    );
    for (const c of n.slice(l))
      if (t.textContent = c, t.scrollWidth <= t.clientWidth + 1)
        return;
    t.textContent = n[n.length - 1];
  }
  render() {
    if (!this._config)
      return v;
    const e = this._derived ?? ge(this._config, this.hass), t = this.hass?.locale?.language ?? "en", s = this._t("common.unavailable"), r = this._t("common.not_configured"), o = this._resolveDefaultTitle(this._config.title), n = this._resolveThemeMode(), a = this._resolveSummaryPower(e), l = this._resolveSummaryEnergy(e), c = this._resolveCustomKpi(), d = this._isSummaryEnergyConfigured(), p = this._config.show_custom_kpi ?? !0, h = this._computeRenderedColumns(
      this._config.columns,
      this._config.max_card_width_px
    ), _ = this._computeRenderedRows(
      this._config.panels.length,
      h
    ), g = this._computePanelHeightPx(
      _,
      this._config.max_card_height_px,
      h,
      this._config.max_card_width_px
    ), x = this._computePanelWidthPx(
      h,
      this._config.max_card_width_px
    ), C = this._computePanelScale(g), P = this._getPanelWidthCapPx(), w = P !== null ? `grid-template-columns: repeat(${h}, minmax(0, ${P}px)); justify-content: center;` : `grid-template-columns: repeat(${h}, minmax(0, 1fr));`, T = this._config.deviation_history_hours ?? 12, R = `--spv-max-width:${this._config.max_card_width_px ?? 980}px; ${this._config.max_card_height_px ? `--spv-max-height:${this._config.max_card_height_px}px;` : "--spv-max-height:none;"} --spv-panel-height:${g}px; --spv-panel-scale:${C}; --spv-panel-max-width:${P ? `${P}px` : "100%"};`, $ = this._buildSystemHealthState(e), E = e.inverterCount + e.errorCount + e.offlineCount + e.deviationCount, D = this._motionOverlayModel ? `width:${this._motionOverlayModel.width}px; height:${this._motionOverlayModel.height}px;` : "", A = (this._config.enable_array_checks ?? !1) && this._historyState === "loading" ? this._t("card.subtitle.loading_history", { hours: T }) : e.deviationReady ? e.deviationCount > 0 ? this._t("card.subtitle.deviation_detected", {
      count: e.deviationCount,
      suffix: e.deviationCount === 1 ? "" : "s"
    }) : this._t("card.subtitle.tap_diagnostics") : this._historyStateReason ?? e.deviationSuppressedReason ?? this._t("card.subtitle.warmup"), m = e.panels.find(
      (b) => b.id === this._selectedPanelId
    );
    return f`
      <ha-card style=${R} data-spv-theme=${n}>
        <div class="chrome"></div>
        <div class="spv-overlay-anchor" style=${D}>
          ${this._renderCardOverlay(e)}
        </div>
        <div class="header">
          <div class="header-copy">
            <div class="topline">
              <span class="eyebrow">${this._t("card.eyebrow")}</span>
              <button
                class="system-health"
                type="button"
                style=${`--health-color:${$.color};`}
                @click=${this._openSystemHealthPopup}
              >
                ${$.label}
              </button>
            </div>
            <h1 class="title">${o}</h1>
            <p class="subtitle">${A}</p>
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
                ${ke(
      a.value,
      this._config.power_decimals ?? 0,
      a.unit,
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
                ${d ? ke(
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
            ${p ? f`
                  <button
                    class="summary-chip summary-button ${this._getSummaryExtraClass("custom")}"
                    style=${this._getSummaryExtraStyle("custom")}
                    type="button"
                    data-kpi="custom"
                    @click=${this._openCustomKpiPopup}
                  >
                    <span class="summary-label">${this._resolveCustomKpiTitle(c.title)}</span>
                    <span class="summary-value custom-kpi-value">${c.value}</span>
                  </button>
                ` : v}
          </div>
        </div>

        <div
          class="grid"
          style=${w}
        >
          ${e.panels.map((b) => this._renderPanel(b, g, x))}
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
    this._derived = ge(this._config, this.hass, {
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
    const r = this._shouldShowPerformance(e, t, s), o = this._getPanelExtraClass(e), n = ui(e.inverterStatusDisplay), a = this._formatInverterTileSummary(e, n), l = Math.max(0, Math.min(e.intensity, 1)), c = Math.round(24 + l * 62), d = Math.round(6 + l * 24), p = Math.round(4 + l * 18), h = [
      `--panel-accent:${e.accentColor}`,
      `--panel-intensity:${l.toFixed(3)}`,
      `--panel-border-accent:color-mix(in srgb, ${e.accentColor} ${c}%, var(--spv-panel-accent-mix-base))`,
      `--panel-fill-accent:color-mix(in srgb, ${e.accentColor} ${d}%, transparent)`,
      `--panel-glow-accent:color-mix(in srgb, ${e.accentColor} ${p}%, transparent)`
    ].join("; "), _ = r ? this._buildPanelPerformanceLabelCandidates(e) : null;
    return e.hiddenSlot ? f`
        <button
          class="panel hidden-slot ${o}"
          type="button"
          data-panel-id=${e.id}
          data-slot-index=${String(e.slotIndex)}
          draggable="true"
          @dragstart=${(g) => this._handleDragStart(g, e.slotIndex)}
          @dragover=${this._handleDragOver}
          @drop=${(g) => this._handleDrop(g, e.slotIndex)}
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
      ` : f`
      <button
        class="panel ${e.status} ${r ? "has-performance" : ""} ${o}"
        type="button"
        style=${h}
        data-panel-id=${e.id}
        data-slot-index=${String(e.slotIndex)}
        draggable="true"
        @dragstart=${(g) => this._handleDragStart(g, e.slotIndex)}
        @dragover=${this._handleDragOver}
        @drop=${(g) => this._handleDrop(g, e.slotIndex)}
        @dragend=${this._handleDragEnd}
        @click=${() => this._handlePanelClick(e)}
      >
        <span class="status">${this._panelStatusLabel(e.status)}</span>
        <div class="panel-primary">
          <p class="panel-name" title=${e.label}>${e.label}</p>
          <p class="power">${e.powerDisplay}</p>
        </div>
        <div class="panel-detail-scroll" @scroll=${this._handlePanelDetailScroll}>
          ${r ? f`<p
                class="performance"
                data-performance-full=${_?.[0]?.text ?? ""}
                data-performance-medium=${_?.[1]?.text ?? ""}
                data-performance-compact=${_?.[2]?.text ?? ""}
              >
                ${this._formatPanelPerformanceText(
      e,
      s,
      t,
      _
    )}
              </p>` : v}
          ${e.energyDisplay ? f`<p class="energy">${e.energyDisplay}</p>` : v}
          ${(this._config?.show_inverter_status_on_tiles ?? !1) && a ? f`<p class="inverter-status">${a}</p>` : v}
        </div>
        <span class="slot">${this._formatSlotLabel(e.slotIndex)}</span>
      </button>
    `;
  }
  _renderPopupCloseButton(e, t) {
    return f`
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
    return e.status === "unconfigured" ? f`
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
      ` : f`
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
              ${e.powerEntityName ? f`<p class="info-line">${this._t("card.popup.info.power_source", {
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
    const s = this._getPanelTelemetryMetrics(t), r = s.filter((a) => !!a.entityId), o = s.filter((a) => !a.entityId), n = r.length > 0;
    return f`
      <section class="telemetry-section">
        <h3 class="telemetry-title">${this._t("card.popup.telemetry.title")}</h3>

        ${n ? f`
              <div class="telemetry-group">
                <h4 class="telemetry-title">${this._t("card.popup.telemetry.configured_title")}</h4>
                <div class="telemetry-grid">
                  ${r.map(
      (a) => f`
                      <div class="detail-card">
                        <span class="detail-label">${a.label}</span>
                        <span class="detail-value">
                          ${this._formatTelemetryMetricValue(a.entityId ?? "")}
                        </span>
                      </div>
                    `
    )}
                </div>
              </div>
            ` : v}

        ${o.length > 0 ? f`
              <div class="telemetry-group">
                <h4 class="telemetry-title">${this._t("card.popup.telemetry.unconfigured_title")}</h4>
                <p class="telemetry-empty">${this._t("card.popup.telemetry.setup_hint")}</p>
                <div class="telemetry-grid">
                  ${o.map(
      (a) => f`
                      <div class="detail-card">
                        <span class="detail-label">${a.label}</span>
                        <span class="detail-value">${this._t("common.not_configured")}</span>
                      </div>
                    `
    )}
                </div>
              </div>
            ` : n ? v : f`<p class="telemetry-empty">${this._t("card.popup.telemetry.setup_hint")}</p>`}
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
    if (r.length === 0 || bi.has(r))
      return this._t("common.unavailable");
    const o = Number(t.state), n = typeof t.attributes?.unit_of_measurement == "string" ? t.attributes.unit_of_measurement.trim() : "";
    if (Number.isFinite(o)) {
      const a = this.hass?.locale?.language ?? "en", l = Object.is(o, -0) ? 0 : o, c = Number.isInteger(l) ? 0 : 2, d = new Intl.NumberFormat(a, {
        minimumFractionDigits: 0,
        maximumFractionDigits: c
      }).format(l);
      return n ? `${d} ${n}` : d;
    }
    return n ? `${s} ${n}` : s;
  }
  _renderKpiCompareControls(e, t) {
    const s = this._kpiCompareExpanded[t], r = t === "power" ? this._t("card.popup.panel_compare.toggle_power") : this._t("card.popup.panel_compare.toggle_energy");
    return f`
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
      return f`
        <p class="graph-state">
          ${t === "energy" ? this._t("card.popup.panel_compare.no_panels_energy") : this._t("card.popup.panel_compare.no_panels_power")}
        </p>
      `;
    const o = this._getPanelCompareSignature(t, s), n = this._getPanelCompareCacheKey(t, o, r), a = this._kpiCompareCache[n], l = a?.loading ?? !1, c = a?.error, d = s.map((y, S) => ({
      ...y,
      color: Wt[S % Wt.length],
      samples: this._adjustGraphSamplesForEntity(
        y.entityId,
        a?.samplesByPanelId[y.panelId] ?? []
      )
    })), p = hi(
      d.map((y) => ({
        id: y.panelId,
        samples: y.samples
      })),
      Date.now(),
      r,
      tt,
      320,
      132,
      10
    ), h = new Map(p.series.map((y) => [y.id, y])), _ = p.series.some(
      (y) => y.sampleCount > 0 && (y.pointsCount === 0 || y.sampleCount > 1 && y.pointsCount < 2)
    ), g = p.hasData && p.drawableCount === 0, x = g || _, C = t === "energy" ? "kWh" : "W", P = p.series.flatMap(
      (y) => y.samples.map((S) => S.value).filter((S) => Number.isFinite(S))
    ), w = P.length > 0 ? this._computeGraphStats(
      P.map((y, S) => ({
        ts: S,
        value: y
      }))
    ) : { min: null, max: null, median: null }, T = P.length > 0 ? Math.min(...P) : null, R = P.length > 0 ? Math.max(...P) : null, $ = T === null || R === null ? null : T === R ? T - 1 : T, E = T === null || R === null ? null : T === R ? R + 1 : R, D = w.max !== null && $ !== null && E !== null ? this._toGraphY(w.max, $, E, 132, 10) : null, A = w.median !== null && $ !== null && E !== null ? this._toGraphY(w.median, $, E, 132, 10) : null, m = w.min !== null && $ !== null && E !== null ? this._toGraphY(w.min, $, E, 132, 10) : null, b = w.max !== null ? this._t("card.popup.history.max", {
      value: this._formatGraphPower(w.max, C)
    }) : null, k = w.median !== null ? this._t("card.popup.history.median", {
      value: this._formatGraphPower(w.median, C)
    }) : null, F = w.min !== null ? this._t("card.popup.history.min", {
      value: this._formatGraphPower(w.min, C)
    }) : null, M = this._buildGraphHourTicks(
      {
        startTs: p.startTs,
        endTs: p.endTs
      },
      r
    ), O = this._buildGraphAxisTicks(M), J = t === "energy" ? this._t("card.popup.history.panel_compare_energy") : this._t("card.popup.history.panel_compare_power");
    return f`
      <div class="graph-section">
        <div class="graph-header">
          <span class="graph-title">${J}</span>
          <div class="range-chips">
            ${et.map(
      (y) => f`
                <button
                  class="range-chip ${this._kpiCompareRangeHours[t] === y ? "active" : ""}"
                  type="button"
                  @pointerdown=${this._preventRangeChipFocusScroll}
                  @mousedown=${this._preventRangeChipFocusScroll}
                  @click=${(S) => this._handlePanelCompareRangeChange(S, e, t, y)}
                >
                  ${y}h
                </button>
              `
    )}
          </div>
        </div>

        ${l ? f`<p class="graph-state">${this._t("card.popup.panel_compare.loading")}</p>` : c ? f`<p class="graph-state">${c}</p>` : p.hasData ? g ? f`<p class="graph-state">${this._t("card.popup.panel_compare.render_failure")}</p>` : f`
                  <div class="graph-box">
                    ${b ? f`<span class="graph-overlay graph-overlay-max">${b}</span>` : v}
                    ${k ? f`
                          <span class="graph-overlay graph-overlay-median">
                            ${k}
                          </span>
                        ` : v}
                    ${F ? f`<span class="graph-overlay graph-overlay-min">${F}</span>` : v}
                    <svg class="graph-svg" viewBox="0 0 320 132" preserveAspectRatio="none">
                      ${M.map(
      (y) => B`
                          <line
                            class="graph-hour-line"
                            x1=${y.x.toFixed(2)}
                            x2=${y.x.toFixed(2)}
                            y1="10"
                            y2="122"
                          ></line>
                        `
    )}
                      ${d.map((y) => {
      const S = h.get(y.panelId);
      return !S || S.pointsCount === 0 ? v : S.pointsCount >= 2 ? B`
                            <path
                              d=${S.linePath}
                              fill="none"
                              stroke=${y.color}
                              stroke-width="1.08"
                              stroke-linejoin="round"
                              stroke-linecap="round"
                              opacity="0.88"
                            ></path>
                            ${S.firstPoint && S.lastPoint ? B`
                                  <circle
                                    cx=${S.firstPoint.x.toFixed(2)}
                                    cy=${S.firstPoint.y.toFixed(2)}
                                    r="1.7"
                                    fill=${y.color}
                                    opacity="0.95"
                                  ></circle>
                                  <circle
                                    cx=${S.lastPoint.x.toFixed(2)}
                                    cy=${S.lastPoint.y.toFixed(2)}
                                    r="1.7"
                                    fill=${y.color}
                                    opacity="0.95"
                                  ></circle>
                                ` : v}
                          ` : S.firstPoint ? B`
                          <circle
                            cx=${S.firstPoint.x.toFixed(2)}
                            cy=${S.firstPoint.y.toFixed(2)}
                            r="2.4"
                            fill=${y.color}
                            opacity="0.95"
                          ></circle>
                        ` : v;
    })}
                      ${D !== null ? B`
                            <line
                              class="graph-stat-line graph-stat-max"
                              x1="10"
                              x2="310"
                              y1=${D.toFixed(2)}
                              y2=${D.toFixed(2)}
                            ></line>
                          ` : v}
                      ${A !== null ? B`
                            <line
                              class="graph-stat-line graph-stat-median"
                              x1="10"
                              x2="310"
                              y1=${A.toFixed(2)}
                              y2=${A.toFixed(2)}
                            ></line>
                          ` : v}
                      ${m !== null ? B`
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
                    ${O.map(
      (y) => f`
                        <span class="graph-axis-label" style=${`left:${y.leftPercent.toFixed(2)}%;`}>
                          ${y.label}
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
                ` : f`<p class="graph-state">${this._t("card.popup.panel_compare.no_data")}</p>`}

        ${x ? f`
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
                  ${g ? this._t("card.popup.panel_compare.diagnostics_reason_render_failure") : this._t("card.popup.panel_compare.diagnostics_reason_suspect")}
                </span>
                ${d.map((y) => {
      const S = h.get(y.panelId), U = this._getUnitForEntity(y.entityId, C);
      return f`
                    <span class="compare-diagnostics-row">
                      ${this._t("card.popup.panel_compare.diagnostics_row", {
        label: y.label,
        samples: S?.sampleCount ?? 0,
        points: S?.pointsCount ?? 0,
        pathLen: S?.linePath.length ?? 0,
        first: this._formatGraphDiagnosticTime(S?.firstTs ?? null),
        last: this._formatGraphDiagnosticTime(S?.lastTs ?? null),
        min: S?.minValue === null || S?.minValue === void 0 ? "--" : this._formatGraphPower(S.minValue, U),
        max: S?.maxValue === null || S?.maxValue === void 0 ? "--" : this._formatGraphPower(S.maxValue, U)
      })}
                    </span>
                  `;
    })}
              </div>
            ` : v}

        <div class="compare-legend">
          ${d.map(
      (y) => f`
              <div class="compare-legend-item">
                <span
                  class="compare-legend-chip"
                  style=${`background:${y.color};`}
                ></span>
                <span class="compare-legend-label">${y.label}</span>
              </div>
            `
    )}
        </div>
      </div>
    `;
  }
  _renderAggregatedPanelGraph(e, t, s = {}) {
    const r = this._buildPanelCompareTargets(e, t), o = this._kpiCompareRangeHours[t];
    if (r.length === 0)
      return f`
        <p class="graph-state">
          ${t === "energy" ? this._t("card.popup.panel_compare.no_panels_energy") : this._t("card.popup.panel_compare.no_panels_power")}
        </p>
      `;
    const n = this._getPanelCompareSignature(t, r), a = this._getPanelCompareCacheKey(t, n, o), l = this._kpiCompareCache[a], c = l?.loading ?? !1, d = l?.error, p = ci(
      r.map(
        (g) => this._adjustGraphSamplesForEntity(
          g.entityId,
          l?.samplesByPanelId[g.panelId] ?? []
        )
      )
    ), h = t === "energy" ? this._resolveUnit("energy_entity", "kWh") : this._resolveUnit("power_entity", "W"), _ = t === "energy" ? this._t("card.popup.history.total_panel_energy") : this._t("card.popup.history.total_panel_power");
    return f`
      <div class="graph-section">
        <div class="graph-header">
          <span class="graph-title">${_}</span>
          <div class="range-chips">
            ${et.map(
      (g) => f`
                <button
                  class="range-chip ${this._kpiCompareRangeHours[t] === g ? "active" : ""}"
                  type="button"
                  @pointerdown=${this._preventRangeChipFocusScroll}
                  @mousedown=${this._preventRangeChipFocusScroll}
                  @click=${(x) => this._handleAggregatedPanelRangeChange(
        x,
        e,
        t,
        g,
        s.overlayEntityId ?? void 0
      )}
                >
                  ${g}h
                </button>
              `
    )}
          </div>
        </div>
        ${this._renderPopupGraphBodyFromSamples(
      `panel-total-${t}|${n}|${o}`,
      h,
      p,
      o,
      c,
      d,
      s
    )}
        ${s.overlayStateMessage ? f`<p class="graph-forecast-state">${s.overlayStateMessage}</p>` : v}
        ${s.showEnableForecastButton ? f`
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
  _handleAggregatedPanelRangeChange(e, t, s, r, o) {
    e.preventDefault(), e.stopPropagation();
    const n = this._captureScrollPositionsForPopupGraph(e);
    this._kpiCompareRangeHours = {
      ...this._kpiCompareRangeHours,
      [s]: r
    }, this._scheduleCapturedScrollRestore(n), this._ensurePanelCompareLoaded(t, s, r, n), o && this._ensurePopupGraphLoadedByEntity(o, r, n);
  }
  _handlePanelCompareRangeChange(e, t, s, r) {
    e.preventDefault(), e.stopPropagation();
    const o = this._captureScrollPositionsForPopupGraph(e);
    if (this._kpiCompareRangeHours = {
      ...this._kpiCompareRangeHours,
      [s]: r
    }, this._scheduleCapturedScrollRestore(o), this._kpiCompareExpanded[s] && this._ensurePanelCompareLoaded(t, s, r, o), !this._getSystemEntityIdForKind(s) && this._isForecastOverlayEnabled()) {
      const n = this._getForecastEntityId(s);
      n && this._ensurePopupGraphLoadedByEntity(n, r, o);
    }
  }
  _buildPanelCompareTargets(e, t) {
    const s = new Map(
      (this._config?.panels ?? []).map((r) => [r.id, r])
    );
    return e.panels.filter((r) => !r.hiddenSlot && r.enabled).map((r) => {
      const o = s.get(r.id), n = t === "energy" ? o?.energy_entity?.trim() : o?.power_entity?.trim();
      return n ? {
        panelId: r.id,
        label: r.label,
        entityId: n
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
    const n = this._getPanelCompareSignature(t, o), a = this._getPanelCompareCacheKey(t, n, s), l = this._kpiCompareCache[a], c = Date.now();
    if (l?.loading || l && !l.error && l.loadedAt && c - l.loadedAt < yi)
      return;
    const d = ++this._kpiCompareRequestToken;
    if (this._kpiCompareLatestTokenByKey[a] = d, this._kpiCompareCache = {
      ...this._kpiCompareCache,
      [a]: {
        loading: !0,
        samplesByPanelId: l?.samplesByPanelId ?? {},
        loadedAt: l?.loadedAt
      }
    }, this._scheduleCapturedScrollRestore(r), !this.hass.callApi && !this.hass.callWS) {
      if (this._kpiCompareLatestTokenByKey[a] !== d)
        return;
      this._kpiCompareCache = {
        ...this._kpiCompareCache,
        [a]: {
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
      const p = [...new Set(o.map((w) => w.entityId))], h = {};
      let _ = null;
      const g = await Promise.allSettled(
        p.map(async (w) => ({
          entityId: w,
          samples: await this._loadPopupGraphRecorderSamples(w, s)
        }))
      );
      for (const w of g) {
        if (w.status === "fulfilled") {
          h[w.value.entityId] = w.value.samples;
          continue;
        }
        _ || (_ = rt(
          st(w.reason, this._t("common.unknown_recorder_error"))
        ));
      }
      if (this._kpiCompareLatestTokenByKey[a] !== d)
        return;
      const x = Object.values(h).some(
        (w) => w.length > 0
      );
      if (Object.keys(h).length === 0 && _) {
        this._kpiCompareCache = {
          ...this._kpiCompareCache,
          [a]: {
            loading: !1,
            samplesByPanelId: {},
            error: this._t("card.popup.panel_compare.unable_load", {
              error: _
            }),
            loadedAt: Date.now()
          }
        }, this._scheduleCapturedScrollRestore(r);
        return;
      }
      const P = {};
      for (const w of o)
        P[w.panelId] = h[w.entityId] ?? [];
      this._kpiCompareCache = {
        ...this._kpiCompareCache,
        [a]: {
          loading: !1,
          samplesByPanelId: P,
          error: !x && _ ? this._t("card.popup.panel_compare.unable_load", {
            error: _
          }) : void 0,
          loadedAt: Date.now()
        }
      }, this._scheduleCapturedScrollRestore(r);
    } catch (p) {
      if (this._kpiCompareLatestTokenByKey[a] !== d)
        return;
      this._kpiCompareCache = {
        ...this._kpiCompareCache,
        [a]: {
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
    const t = this._getSystemPowerEntityId(), s = this._resolveSummaryPower(e), r = this._resolveForecastMetricDisplay(
      "power",
      this._config?.power_decimals ?? 0,
      "W"
    ), o = this._isForecastOverlayEnabled() && !!r.entityId, n = r.entityId ? this._isForecastOverlayEnabled() ? null : this._t("card.popup.forecast.disabled_hint") : this._t("card.popup.forecast.default_sensor_not_found", {
      entity: r.expectedEntityId
    }), a = !this._isForecastOverlayEnabled() && !!r.entityId, l = this.hass?.locale?.language ?? "en";
    return f`
      <div class="spv-popup-backdrop" @click=${this._closeLivePowerPopup}>
        <div class="spv-popup" @click=${(c) => c.stopPropagation()}>
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
        overlayEntityId: o ? r.entityId : null,
        overlayStateMessage: n,
        showEnableForecastButton: a
      }
    ) : this._renderAggregatedPanelGraph(e, "power", {
      overlayEntityId: o ? r.entityId : null,
      overlayStateMessage: n,
      showEnableForecastButton: a
    })}

          <div class="detail-grid">
            <div class="detail-card">
              <span class="detail-label">${this._t("card.popup.detail.current")}</span>
              <span class="detail-value">
                ${ke(
      s.value,
      this._config?.power_decimals ?? 0,
      s.unit,
      this._t("common.unavailable"),
      l
    )}
              </span>
            </div>
            <div class="detail-card">
              <span class="detail-label">${this._t("card.popup.detail.estimated_power_now")}</span>
              <span class="detail-value">${r.display}</span>
            </div>
            <div class="detail-card detail-card-source">
              <span class="detail-label">${this._t("card.popup.detail.source")}</span>
              <span class="detail-value">
                ${t ? this._t("card.summary.system_sensor") : this._t("card.summary.sum_panel_sensors")}
              </span>
            </div>
          </div>

          ${this._renderKpiCompareControls(e, "power")}
        </div>
      </div>
    `;
  }
  _renderEnergyDialog(e) {
    const t = this._getSystemEnergyEntityId(), s = this._resolveSummaryEnergy(e), r = this._resolveForecastMetricDisplay(
      "energy",
      this._config?.energy_decimals ?? 2,
      "kWh"
    ), o = this._isForecastOverlayEnabled() && !!r.entityId, n = r.entityId ? this._isForecastOverlayEnabled() ? null : this._t("card.popup.forecast.disabled_hint") : this._t("card.popup.forecast.default_sensor_not_found", {
      entity: r.expectedEntityId
    }), a = !this._isForecastOverlayEnabled() && !!r.entityId, l = this.hass?.locale?.language ?? "en";
    return f`
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
        overlayEntityId: o ? r.entityId : null,
        overlayStateMessage: n,
        showEnableForecastButton: a
      }
    ) : this._renderAggregatedPanelGraph(e, "energy", {
      overlayEntityId: o ? r.entityId : null,
      overlayStateMessage: n,
      showEnableForecastButton: a
    })}

          <div class="detail-grid">
            <div class="detail-card">
              <span class="detail-label">${this._t("card.popup.detail.current")}</span>
              <span class="detail-value">
                ${ke(
      s.value,
      this._config?.energy_decimals ?? 2,
      s.unit,
      this._t("common.unavailable"),
      l
    )}
              </span>
            </div>
            <div class="detail-card">
              <span class="detail-label">${this._t("card.popup.detail.estimated_energy_now")}</span>
              <span class="detail-value">${r.display}</span>
            </div>
            <div class="detail-card detail-card-source">
              <span class="detail-label">${this._t("card.popup.detail.source")}</span>
              <span class="detail-value">
                ${t ? this._t("card.summary.system_sensor") : this._t("card.summary.sum_panel_sensors")}
              </span>
            </div>
          </div>

          ${this._renderKpiCompareControls(e, "energy")}
        </div>
      </div>
    `;
  }
  _renderCustomKpiDialog() {
    const e = this._resolveCustomKpi(), t = e.title.length > 0 ? this._resolveCustomKpiTitle(e.title) : this._t("card.summary.custom_default_title"), s = this._getCustomKpiEntityId();
    return f`
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
    ) : f`<p class="graph-state">${this._t("card.popup.history.custom_not_configured")}</p>`}
        </div>
      </div>
    `;
  }
  _renderSystemHealthDialog(e) {
    const t = this._buildSystemHealthSections(e), s = t.length > 0;
    return f`
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
      (r) => f`
                  <div class="graph-section">
                    <div class="graph-header">
                      <span class="graph-title">${r.title}</span>
                    </div>
                    ${r.items.map(
        (o) => f`<p class="system-health-item">${o}</p>`
      )}
                  </div>
                `
    ) : f`<p class="system-health-item">${this._t("card.popup.system_health.everything_ok")}</p>`}
        </div>
      </div>
    `;
  }
  _renderMetricList(e, t) {
    return f`
      <div class="graph-section">
        <div class="graph-header">
          <span class="graph-title">${e}</span>
        </div>
        ${t.map(
      (s) => f`
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
    return f`
      <div class="graph-section">
        <div class="graph-header">
          <span class="graph-title">${t}</span>
          <div class="range-chips">
            ${et.map(
      (r) => f`
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
        ${e ? this._renderPopupGraphBody(e, s) : f`<p class="graph-state">${this._t("card.popup.history.graph_not_configured")}</p>`}
        ${s.overlayStateMessage ? f`<p class="graph-forecast-state">${s.overlayStateMessage}</p>` : v}
        ${s.showEnableForecastButton ? f`
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
    const s = this._getPopupGraphCacheKey(e, this._popupGraphRangeHours), r = this._popupGraphCache[s], o = r?.loading ?? !1, n = r?.error, a = r?.samples ?? [], l = this._adjustGraphSamplesForEntity(e, a), c = t.invertPrimaryValues ? l.map((p) => ({
      ts: p.ts,
      value: te(p.value * -1)
    })) : l, d = this._getUnitForEntity(e, "W");
    return this._renderPopupGraphBodyFromSamples(
      s,
      d,
      c,
      this._popupGraphRangeHours,
      o,
      n,
      t
    );
  }
  _renderPopupGraphBodyFromSamples(e, t, s, r, o, n, a = {}) {
    const l = this._fillRangeStartWithFirstSample(
      s,
      r,
      a.fillStartWithFirstSample ?? !1
    ), c = As(l, {
      rangeHours: r
    }), d = this._expandSinglePointRangeSamples(
      c,
      r
    ), p = a.overlayEntityId ?? null, h = p ? this._popupGraphCache[this._getPopupGraphCacheKey(p, r)] : void 0, _ = h?.samples ?? [], g = p ? this._expandSinglePointRangeSamples(
      this._adjustGraphSamplesForEntity(p, _),
      r
    ) : [], x = p ? h?.loading ?? !1 : !1, C = p ? h?.error : void 0;
    if (o)
      return f`<p class="graph-state">${this._t("card.popup.history.loading")}</p>`;
    if (n)
      return f`<p class="graph-state">${n}</p>`;
    if (d.length === 0)
      return f`<p class="graph-state">${this._t("card.popup.history.no_data")}</p>`;
    const P = ot(d, tt), w = this._computeGraphStats(d), T = Date.now(), R = T - r * 60 * 60 * 1e3, $ = T, E = p && !x && !C && g.length > 0 ? ot(g, tt) : [], D = d.map((G) => G.value).filter((G) => Number.isFinite(G)), A = E.map((G) => G.value).filter((G) => Number.isFinite(G)), m = [...D, ...A], b = m.length > 0 ? Math.min(...m) : null, k = m.length > 0 ? Math.max(...m) : null, F = b === null || k === null ? null : b === k ? b - 1 : b, M = b === null || k === null ? null : b === k ? k + 1 : k, O = F !== null && M !== null ? {
      startTs: R,
      endTs: $,
      minValue: F,
      maxValue: M
    } : null, J = O !== null ? this._buildAlignedGraphLinePath(P, O, 320, 132, 10) : "", y = O !== null ? this._buildAlignedGraphAreaPath(P, O, 320, 132, 10) : "", S = O !== null && E.length > 0 ? this._buildAlignedGraphLinePath(E, O, 320, 132, 10) : "", U = this._buildGraphHourTicks(
      {
        startTs: R,
        endTs: $
      },
      r
    ), K = this._buildGraphAxisTicks(U), ee = w.max !== null && F !== null && M !== null ? this._toGraphY(w.max, F, M, 132, 10) : null, de = w.median !== null && F !== null && M !== null ? this._toGraphY(w.median, F, M, 132, 10) : null, we = w.min !== null && F !== null && M !== null ? this._toGraphY(w.min, F, M, 132, 10) : null, xe = `spv-graph-${e.replace(/[^a-zA-Z0-9_-]/g, "-")}`, he = w.max !== null ? this._t("card.popup.history.max", {
      value: this._formatGraphPower(w.max, t)
    }) : null, Oe = w.median !== null ? this._t("card.popup.history.median", {
      value: this._formatGraphPower(w.median, t)
    }) : null, $e = w.min !== null ? this._t("card.popup.history.min", {
      value: this._formatGraphPower(w.min, t)
    }) : null;
    return f`
      <div class="graph-box">
        ${he ? f`<span class="graph-overlay graph-overlay-max">${he}</span>` : v}
        ${Oe ? f`
              <span class="graph-overlay graph-overlay-median">
                ${Oe}
              </span>
            ` : v}
        ${$e ? f`<span class="graph-overlay graph-overlay-min">${$e}</span>` : v}
        <svg class="graph-svg" viewBox="0 0 320 132" preserveAspectRatio="none">
          <defs>
            <linearGradient id=${xe} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="rgba(142, 208, 114, 0.48)"></stop>
              <stop offset="100%" stop-color="rgba(142, 208, 114, 0.04)"></stop>
            </linearGradient>
          </defs>
          <path
            d=${y}
            fill=${`url(#${xe})`}
          ></path>
          ${U.map(
      (G) => B`
              <line
                class="graph-hour-line"
                x1=${G.x.toFixed(2)}
                x2=${G.x.toFixed(2)}
                y1="10"
                y2="122"
              ></line>
            `
    )}
          ${B`
            <path
            d=${J}
            fill="none"
            stroke="rgba(186, 226, 106, 0.95)"
            stroke-width="2.2"
            stroke-linejoin="round"
            stroke-linecap="round"
            ></path>
          `}
          ${S.length > 0 ? B`
                <path
                  d=${S}
                  fill="none"
                  stroke="var(--spv-forecast-line)"
                  stroke-width="1.5"
                  stroke-dasharray="6 5"
                  stroke-linejoin="round"
                  stroke-linecap="round"
                  opacity="0.82"
                ></path>
              ` : v}
          ${ee !== null ? B`
                <line
                  class="graph-stat-line graph-stat-max"
                  x1="10"
                  x2="310"
                  y1=${ee.toFixed(2)}
                  y2=${ee.toFixed(2)}
                ></line>
              ` : v}
          ${de !== null ? B`
                <line
                  class="graph-stat-line graph-stat-median"
                  x1="10"
                  x2="310"
                  y1=${de.toFixed(2)}
                  y2=${de.toFixed(2)}
                ></line>
              ` : v}
          ${we !== null ? B`
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
        ${K.map(
      (G) => f`
            <span class="graph-axis-label" style=${`left:${G.leftPercent.toFixed(2)}%;`}>
              ${G.label}
            </span>
          `
    )}
      </div>
      <div class="graph-meta">
        <span>
          ${this._t("card.popup.history.time_range", {
      start: this._formatGraphTime(R),
      end: this._formatGraphTime($)
    })}
        </span>
      </div>
      ${p && x ? f`<p class="graph-forecast-state">${this._t("card.popup.history.loading")}</p>` : v}
      ${p && !x && C ? f`<p class="graph-forecast-state">${C}</p>` : v}
      ${p && !x && !C && g.length === 0 ? f`<p class="graph-forecast-state">${this._t("card.popup.history.no_data")}</p>` : v}
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
    const r = this._getPopupGraphCacheKey(e, t), o = this._popupGraphCache[r], n = Date.now();
    if (o?.loading || o && !o.error && o.loadedAt && n - o.loadedAt < fi)
      return;
    const a = ++this._popupGraphRequestToken;
    if (this._popupGraphLatestTokenByKey[r] = a, this._popupGraphCache = {
      ...this._popupGraphCache,
      [r]: {
        loading: !0,
        samples: o?.samples ?? [],
        loadedAt: o?.loadedAt
      }
    }, this._scheduleCapturedScrollRestore(s), !this.hass.callApi && !this.hass.callWS) {
      if (this._popupGraphLatestTokenByKey[r] !== a)
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
      if (this._popupGraphLatestTokenByKey[r] !== a)
        return;
      const l = await this._loadPopupGraphRecorderSamples(e, t);
      if (this._popupGraphLatestTokenByKey[r] !== a)
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
      if (this._popupGraphLatestTokenByKey[r] !== a)
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
    const s = Date.now(), r = Math.min(168, t + 6), o = new Date(s - r * 60 * 60 * 1e3).toISOString(), n = new Date(s).toISOString(), a = this._getSharedHistorySamplesForRange(e, t);
    if (a) {
      const p = Ue(a, s, t), h = this._stabilizePopupRangeSamples(
        e,
        a,
        p,
        s,
        t
      );
      if (this._hasPopupRangeCoverage(h, s, t))
        return h;
      try {
        const _ = await this._fetchRecorderHistoryRaw(o, n, [e]), g = this._parseRecorderResponse(_, r, [e])[e] ?? [], x = this._mergeGraphSampleSets(a, g), C = Ue(x, s, t);
        return this._stabilizePopupRangeSamples(e, x, C, s, t);
      } catch {
        return h;
      }
    }
    const l = await this._fetchRecorderHistoryRaw(o, n, [e]), c = this._parseRecorderResponse(l, r, [e])[e] ?? [], d = Ue(c, s, t);
    return this._stabilizePopupRangeSamples(e, c, d, s, t);
  }
  _getSharedHistorySamplesForRange(e, t) {
    if (!(this._config?.enable_array_checks ?? !1) || this._getHistoryHours() < t)
      return null;
    const s = this._historyByEntityId[e];
    return !s || s.length === 0 ? null : s;
  }
  _stabilizePopupRangeSamples(e, t, s, r, o) {
    const n = r - o * 60 * 60 * 1e3, a = [...t].sort((_, g) => _.ts - g.ts), l = [...s].sort((_, g) => _.ts - g.ts), c = a.filter((_) => _.ts < n).at(-1) ?? null, d = this._isForecastDefaultEntity(e), p = Number(this.hass?.states?.[e]?.state);
    if (l.length === 0)
      d && Number.isFinite(p) ? l.push({ ts: n, value: p }) : c ? l.push({ ts: n, value: c.value }) : Number.isFinite(p) && l.push({ ts: n, value: p });
    else if (l[0].ts > n && (c || d)) {
      const _ = d ? l[0].value : c?.value ?? l[0].value;
      l.unshift({ ts: n, value: _ });
    }
    const h = l[l.length - 1];
    if (!h && Number.isFinite(p))
      l.push({ ts: r, value: p });
    else if (h && h.ts < r) {
      const _ = Number.isFinite(p) ? p : h.value;
      l.push({ ts: r, value: _ });
    }
    return l.filter((_) => Number.isFinite(_.ts) && Number.isFinite(_.value)).sort((_, g) => _.ts - g.ts);
  }
  _hasPopupRangeCoverage(e, t, s) {
    if (e.length === 0)
      return !1;
    const r = t - s * 60 * 60 * 1e3, o = e[0].ts, n = e[e.length - 1].ts, a = 900 * 1e3;
    return o <= r + a && n >= t - a;
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
    const s = this.hass?.locale?.language ?? "en", r = te(e), o = t.trim().toLowerCase(), n = o.includes("wh") || o.includes("kwh") ? this._config?.energy_decimals ?? 2 : this._config?.power_decimals ?? 0;
    return `${new Intl.NumberFormat(s, {
      minimumFractionDigits: n,
      maximumFractionDigits: n
    }).format(r)} ${t}`;
  }
  _computeGraphStats(e) {
    const t = e.map((a) => a.value).filter((a) => Number.isFinite(a)).sort((a, l) => a - l);
    if (t.length === 0)
      return { min: null, max: null, median: null };
    const s = t[0] ?? null, r = t[t.length - 1] ?? null, o = Math.floor(t.length / 2), n = t.length % 2 === 0 ? (t[o - 1] + t[o]) / 2 : t[o];
    return { min: s, max: r, median: n };
  }
  _buildGraphHourTicks(e, t) {
    if (e.startTs === null || e.endTs === null)
      return [];
    const s = e.startTs, r = e.endTs, o = Math.max(r - s, 1), n = 320, a = 10, l = n - a * 2, c = t === 1 ? 900 * 1e3 : t === 6 ? 3600 * 1e3 : 14400 * 1e3, d = [], p = (_) => {
      const g = new Date(_), x = `${g.getHours()}`.padStart(2, "0"), C = `${g.getMinutes()}`.padStart(2, "0");
      return t === 1 ? `${x}:${C}` : `${x}h`;
    };
    let h = Math.ceil(s / c) * c;
    for (; h < r; ) {
      const _ = a + (h - s) / o * l;
      d.push({
        x: _,
        label: p(h)
      }), h += c;
    }
    if (t === 6 && d.length < 3) {
      const _ = [0.25, 0.5, 0.75];
      for (const g of _) {
        const x = s + o * g, C = a + (x - s) / o * l;
        d.push({
          x: C,
          label: p(x)
        });
      }
    }
    return d.sort((_, g) => _.x - g.x), d;
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
    const n = Math.max(s - t, 1), a = Math.max(r - o * 2, 1);
    return r - o - (e - t) / n * a;
  }
  _buildAlignedGraphLinePath(e, t, s, r, o) {
    const n = e.filter((h) => Number.isFinite(h.ts) && Number.isFinite(h.value)).sort((h, _) => h.ts - _.ts);
    if (n.length === 0)
      return "";
    const a = Math.max(t.endTs - t.startTs, 1), l = Math.max(t.maxValue - t.minValue, 1), c = Math.max(s - o * 2, 1), d = Math.max(r - o * 2, 1), p = [];
    for (const h of n) {
      const _ = Math.min(Math.max(h.ts, t.startTs), t.endTs), g = o + (_ - t.startTs) / a * c, x = (h.value - t.minValue) / l, C = r - o - Math.min(Math.max(x, 0), 1) * d, P = p[p.length - 1];
      P && Math.abs(P.x - g) < 0.01 && Math.abs(P.y - C) < 0.01 || p.push({ x: g, y: C });
    }
    return p.length === 0 ? "" : (p.length === 1 && p.push({ ...p[0] }), p.map(
      (h, _) => `${_ === 0 ? "M" : "L"}${h.x.toFixed(2)},${h.y.toFixed(2)}`
    ).join(" "));
  }
  _buildAlignedGraphAreaPath(e, t, s, r, o) {
    const n = this._buildAlignedGraphLinePath(e, t, s, r, o);
    if (!n)
      return "";
    const a = e.filter((x) => Number.isFinite(x.ts) && Number.isFinite(x.value)).sort((x, C) => x.ts - C.ts);
    if (a.length === 0)
      return "";
    const l = Math.max(t.endTs - t.startTs, 1), c = Math.max(s - o * 2, 1), d = Math.min(Math.max(a[0].ts, t.startTs), t.endTs), p = Math.min(
      Math.max(a[a.length - 1].ts, t.startTs),
      t.endTs
    ), h = o + (d - t.startTs) / l * c, _ = o + (p - t.startTs) / l * c, g = r - o;
    return `${n} L${_.toFixed(2)},${g.toFixed(2)} L${h.toFixed(2)},${g.toFixed(2)} Z`;
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
    const t = e.panels.filter((d) => !d.hiddenSlot), s = (d) => t.filter((p) => p.status === d).map((p) => `Panel on ${this._formatSlotLabel(p.slotIndex)} (${p.label}): ${p.reason}`), r = [], o = s("inverter");
    o.length > 0 && r.push({ title: "Inverter", items: o });
    const n = s("error");
    n.length > 0 && r.push({ title: "Error", items: n });
    const a = s("deviation");
    a.length > 0 && r.push({ title: "Deviation", items: a });
    const l = s("offline");
    l.length > 0 && r.push({ title: "Unavailable", items: l });
    const c = s("unconfigured");
    return c.length > 0 && r.push({ title: "Needs setup", items: c }), r;
  }
  _computeRenderedColumns(e, t) {
    const s = Math.max(1, Math.floor(e)), r = this._cardWidth > 0 ? this._cardWidth : t ?? 980, o = t ? Math.min(r, t) : r;
    if (!Number.isFinite(o) || o <= 0)
      return s;
    const n = Math.max(120, o - 40), a = o <= 560 ? 8 : 10, l = o <= 760, c = l ? Math.min(s, 3) : s, d = this._getPanelWidthCapPx(), p = d !== null ? d : l ? 100 : Math.max(130, Math.min(220, n * 0.32)), h = Math.floor((n + a) / (p + a));
    return Math.max(1, Math.min(c, h || 1));
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
    const s = this._cardWidth > 0 ? this._cardWidth : t ?? 980, r = t ? Math.min(s, t) : s, o = r <= 560 ? 8 : 10, n = Math.max(120, r - 40), a = Math.max(1, e), l = (n - Math.max(0, a - 1) * o) / a;
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
    const n = Math.max(1, e), a = 250, l = 36, c = Math.max(n - 1, 0) * 10, p = (t - a - l - c) / n;
    if (!Number.isFinite(p))
      return o;
    const h = Math.min(240, Math.max(96, p)), _ = Math.min(h, o * 1.6);
    return Math.round(Math.min(220, Math.max(92, _)));
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
    const o = this._computePanelScale(s), a = Math.min(0.96, Math.max(0.62, 0.72 * o)) * 16;
    return ai({
      candidates: r,
      panelWidthPx: t,
      panelHeightPx: s,
      fontPx: a,
      reservedRightPx: vi,
      measureTextWidthPx: (l, c) => this._measureTextWidthPx(l, c)
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
    if (le._textMeasureContext === void 0) {
      const r = document.createElement("canvas");
      le._textMeasureContext = r.getContext("2d");
    }
    const s = le._textMeasureContext;
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
  _getSystemEntityIdForKind(e) {
    return e === "energy" ? this._getSystemEnergyEntityId() : this._getSystemPowerEntityId();
  }
  _getForecastEntityId(e) {
    return Rr(this.hass, e);
  }
  _isForecastDefaultEntity(e) {
    return e === We("power") || e === We("energy");
  }
  _isForecastOverlayEnabled() {
    return this._config?.enable_forecast_overlay ?? !1;
  }
  _resolveForecastMetricDisplay(e, t, s) {
    const r = We(e), o = this._getForecastEntityId(e);
    if (!o)
      return {
        expectedEntityId: r,
        entityId: null,
        value: null,
        unit: s,
        display: this._t("common.not_configured")
      };
    const n = this._getUnitForEntity(o, s), a = Number(this.hass?.states?.[o]?.state), l = Number.isFinite(a) ? te(a) : null, c = this.hass?.locale?.language ?? "en";
    return {
      expectedEntityId: r,
      entityId: o,
      value: l,
      unit: n,
      display: ke(l, t, n, this._t("common.unavailable"), c)
    };
  }
  _resolveSummaryPower(e) {
    const t = this._getSystemPowerEntityId();
    if (t) {
      const s = this.hass?.states?.[t], r = Number(s?.state), o = Number.isFinite(r) ? r : null;
      return {
        value: o === null ? null : this._config?.invert_system_power ? te(o * -1) : te(o),
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
    const n = Number(r.state);
    if (Number.isFinite(n)) {
      const a = this.hass?.locale?.language ?? "en", l = this._getUnitForEntity(s, ""), c = this._config?.invert_custom_kpi ? te(n * -1) : te(n), d = Mr(
        String(c),
        a,
        this._config?.custom_kpi_decimals ?? 0,
        l
      );
      return {
        title: t,
        value: d ?? r.state
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
    return f`
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
        ${s.length === 0 ? f`<p class="subtitle">No available W sensors found.</p>` : v}
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
    const s = this._config.panels.find((n) => n.id === e)?.power_entity, r = new Set(
      this._config.panels.filter((n) => n.id !== e).map((n) => n.power_entity).filter((n) => !!n)
    ), o = [];
    for (const n of Object.values(this.hass.states)) {
      if (!n.entity_id.startsWith("sensor."))
        continue;
      const a = n.attributes?.unit_of_measurement;
      typeof a != "string" || a.trim().toLowerCase() !== "w" || r.has(n.entity_id) && n.entity_id !== s || o.push(n.entity_id);
    }
    return typeof s == "string" && s.length > 0 && !o.includes(s) && o.push(s), o.sort((n, a) => n.localeCompare(a));
  }
  _updatePanelConfigFromCard(e, t, s) {
    if (!this._config)
      return;
    const r = this._config.panels.findIndex((a) => a.id === e);
    if (r < 0)
      return;
    const o = this._config.panels.map((a, l) => {
      if (l !== r)
        return a;
      const c = { ...a, [t]: s };
      if (t === "power_entity") {
        const d = a.power_entity, p = typeof s == "string" ? s.trim() : "", h = this._getEntityFriendlyName(p);
        h && this._shouldAutoRenamePanelName(a.name, a.id, d) && (c.name = h);
      }
      return c;
    }), n = Me({
      ...this._config,
      panels: o
    });
    this._commitConfigFromCard(n), t === "power_entity" && (typeof s == "string" ? s.trim() : "").length > 0 && (this._selectedPanelId = e, this._ensurePopupGraphLoaded(e, this._popupGraphRangeHours));
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
    const r = [...this._config.panels], o = r[s], n = r[t];
    !o || !n || (r[s] = n, r[t] = o, this._commitConfigFromCard(
      Me({
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
      new CustomEvent(mi, {
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
      const { config: n, replaced: a } = this._replaceCardConfigInDashboardConfig(
        o,
        e
      );
      if (!a) {
        console.warn("Solar Panel Visualizer: Could not locate card config to persist changes.");
        return;
      }
      if (await this.hass.callWS({
        type: "lovelace/config/save",
        ...r ? { url_path: r } : {},
        config: n
      }), t !== this._persistConfigToken)
        return;
      s && (s.config = n), this._sourceConfigRef = void 0;
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
    const o = (n) => {
      if (r)
        return n;
      if (t(n))
        return r = !0, s;
      if (Array.isArray(n)) {
        let c = !1;
        const d = n.map((p) => {
          const h = o(p);
          return h !== p && (c = !0), h;
        });
        return c ? d : n;
      }
      if (typeof n != "object" || n === null)
        return n;
      let a = !1;
      const l = {};
      for (const [c, d] of Object.entries(n)) {
        const p = o(d);
        l[c] = p, p !== d && (a = !0);
      }
      return a ? l : n;
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
    const n = (Array.isArray(t.panels) ? t.panels : []).map(
      (l) => typeof l == "object" && l !== null && typeof l.id == "string" ? l.id : ""
    ).sort().join("|"), a = this._config.panels.map((l) => l.id).sort().join("|");
    return n.length > 0 && n === a;
  }
  _adjustGraphSamplesForEntity(e, t) {
    const s = this._getSystemPowerEntityId(), r = (this._config?.invert_system_power ?? !1) && !!s && e === s;
    return t.map((o) => ({
      ts: o.ts,
      value: te(r ? o.value * -1 : o.value)
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
    const o = Date.now() - t * 60 * 60 * 1e3, n = [...e].sort((l, c) => l.ts - c.ts), a = n[0];
    return !a || a.ts <= o ? n : [{ ts: o, value: a.value }, ...n];
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
    for (const n of o) {
      if (typeof n != "string" || n.trim().length === 0)
        continue;
      const a = Date.parse(n);
      if (Number.isFinite(a))
        return String(a);
    }
    if (!/^[-+]?\d+(\.\d+)?$/.test(s))
      return s;
  }
  _historyCacheKey() {
    return `${_i}${this._getHistorySignature()}`;
  }
  _pruneSamples(e, t = this._getHistoryHours()) {
    const r = Date.now() - t * 60 * 60 * 1e3;
    return e.filter((o) => o.ts >= r && Number.isFinite(o.value)).sort((o, n) => o.ts - n.ts);
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
      const o = this.hass.states[r], n = Number(o?.state);
      if (!Number.isFinite(n))
        continue;
      const l = [...this._historyByEntityId[r] ?? []], c = l[l.length - 1];
      (!c || Math.abs(t - c.ts) > 6e4 || Math.abs(c.value - n) > 0.01) && (l.push({ ts: t, value: n }), this._historyByEntityId[r] = this._pruneSamples(l), e = !0);
    }
    e && this._saveHistoryCache();
  }
  _saveHistoryCache() {
    if (typeof window > "u" || !this._config)
      return;
    const e = {
      v: Gt,
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
        if (t.v !== Gt || !t.samples)
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
    if (t === this._historyQuerySignature && this._historyState !== "idle" && s - this._historyLastLoadMs < gi) {
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
      const n = await this._fetchRecorderHistoryRaw(r, o, t);
      if (e !== this._historyLoadToken)
        return;
      const a = this._parseRecorderResponse(n, this._getHistoryHours(), t);
      Object.keys(a).length === 0 ? (this._historyState = "fallback", this._historyStateReason = "Solar panel history returned no samples, using live warm-up only.") : (this._historyByEntityId = {
        ...this._historyByEntityId,
        ...a
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
    const r = [], o = s.join(","), n = `history/period/${e}`, a = `history/period/${encodeURIComponent(e)}`, l = [], c = {
      end_time: t,
      filter_entity_id: o,
      no_attributes: !0,
      significant_changes_only: !1,
      minimal_response: !0
    }, d = {
      end_time: t,
      filter_entity_id: o
    };
    if (l.push({ path: n, params: d }), l.push({ path: n, params: c }), a !== n && (l.push({ path: a, params: d }), l.push({ path: a, params: c })), this.hass.callApi)
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
        } catch (_) {
          r.push(_);
        }
    }
    throw r.length > 0 ? r[r.length - 1] : new Error("Recorder API unavailable");
  }
  _parseRecorderResponse(e, t = this._getHistoryHours(), s = []) {
    const r = {}, o = (l) => {
      if (typeof l == "number" && Number.isFinite(l))
        return l > 1e11 ? l : l * 1e3;
      if (typeof l == "string" && l.trim().length > 0) {
        const c = l.trim(), d = Number(c);
        if (Number.isFinite(d) && /^\d+(\.\d+)?$/.test(c))
          return d > 1e11 ? d : d * 1e3;
        const p = Date.parse(c);
        if (Number.isFinite(p))
          return p;
      }
      return Number.NaN;
    }, n = (l, c) => {
      if (!Array.isArray(l) || l.length === 0)
        return;
      let d = c;
      for (const p of l) {
        if (Array.isArray(p)) {
          if (!d || p.length < 2)
            continue;
          const P = o(p[0]), w = Number(p[1]), T = o(p[1]), R = Number(p[0]);
          let $ = P, E = w;
          if ((!Number.isFinite($) || !Number.isFinite(E)) && ($ = T, E = R), !Number.isFinite($) || !Number.isFinite(E))
            continue;
          r[d] || (r[d] = []), r[d].push({ ts: $, value: E });
          continue;
        }
        if (typeof p != "object" || p === null)
          continue;
        const h = p, _ = typeof h.entity_id == "string" && h.entity_id.length > 0 ? h.entity_id : typeof h.e == "string" && h.e.length > 0 ? h.e : d;
        if (!_)
          continue;
        d = _;
        const g = Number(h.state ?? h.s);
        if (!Number.isFinite(g))
          continue;
        const x = typeof h.last_changed == "string" ? h.last_changed : typeof h.last_updated == "string" ? h.last_updated : h.lc ?? h.lu ?? h.last_changed_ts ?? h.last_updated_ts ?? h.ts, C = o(x);
        Number.isFinite(C) && (r[_] || (r[_] = []), r[_].push({ ts: C, value: g }));
      }
    }, a = typeof e == "object" && e !== null && "result" in e ? e.result : e;
    if (Array.isArray(a))
      for (const [l, c] of a.entries())
        n(c, s[l]);
    else if (typeof a == "object" && a !== null)
      for (const [l, c] of Object.entries(
        a
      ))
        n(c, l);
    else
      return r;
    for (const [l, c] of Object.entries(r))
      r[l] = this._pruneSamples(c, t);
    return r;
  }
};
le.properties = {
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
}, le.styles = [dt`
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

  `, Jr];
let nt = le;
class Rs extends nt {
}
customElements.get("solar-panel-visualizer") || customElements.define("solar-panel-visualizer", Rs);
if (!customElements.get("solar-panel-visualizer-card")) {
  class i extends Rs {
  }
  customElements.define("solar-panel-visualizer-card", i);
}
const wi = /(\d+)/, Ut = (i) => {
  const e = wi.exec(i);
  if (!e)
    return null;
  const t = Number(e[1]);
  return Number.isFinite(t) ? t : null;
}, xi = (i) => {
  const e = Ut(i.entityId);
  return e !== null ? e : i.friendlyName ? Ut(i.friendlyName) : null;
}, $i = (i) => {
  const e = i.map((s) => ({
    ...s,
    sortNumber: xi(s)
  }));
  return e.some((s) => s.sortNumber !== null) ? [...e].sort((s, r) => s.sortNumber === null && r.sortNumber === null ? s.entityId.localeCompare(r.entityId) : s.sortNumber === null ? 1 : r.sortNumber === null ? -1 : s.sortNumber !== r.sortNumber ? s.sortNumber - r.sortNumber : s.entityId.localeCompare(r.entityId)).map(({ entityId: s, friendlyName: r }) => ({ entityId: s, friendlyName: r })) : [...e].sort((s, r) => s.entityId.localeCompare(r.entityId)).map(({ entityId: s, friendlyName: r }) => ({ entityId: s, friendlyName: r }));
}, Pi = (i, e, t) => {
  const s = e.trim().replace(/\*+$/, "");
  if (s.length === 0)
    return [];
  const r = s.startsWith("sensor."), o = s.toLowerCase(), n = [];
  for (const [a, l] of Object.entries(i)) {
    if (!a.startsWith("sensor."))
      continue;
    const c = l.attributes?.unit_of_measurement;
    if (typeof c != "string")
      continue;
    const d = c.trim().toLowerCase();
    if (!t(d))
      continue;
    const p = typeof l.attributes?.friendly_name == "string" ? l.attributes.friendly_name : void 0, h = p?.trim().toLowerCase();
    (r ? a.startsWith(s) : h?.includes(o)) && n.push({
      entityId: a,
      friendlyName: p
    });
  }
  return $i(n);
}, Kt = (i, e, t, s, r) => {
  const o = s.trim().replace(/\*+$/, "");
  if (o.length === 0)
    return {
      panels: [...i],
      matched: 0,
      filled: 0,
      skipped: i.length
    };
  const n = Pi(e, o, r), a = new Set(
    i.map((_) => _[t]).filter((_) => typeof _ == "string" && _.length > 0)
  ), l = n.map((_) => _.entityId).filter((_) => !a.has(_));
  let c = 0, d = 0, p = 0;
  return {
    panels: i.map((_) => {
      const g = { ..._ };
      if (g.enabled === !1)
        return p += 1, g;
      const x = g[t];
      if (typeof x == "string" && x.trim().length > 0)
        return p += 1, g;
      const C = l[c];
      return C ? (g[t] = C, c += 1, d += 1, g) : (p += 1, g);
    }),
    matched: n.length,
    filled: d,
    skipped: p
  };
}, Si = (i, e, t, s) => {
  const r = i?.trim() ?? "";
  if (!r || r === e || /^panel\s+\d+$/i.test(r))
    return !0;
  const o = s(t);
  return !!(o && r === o);
}, Ci = (i, e) => i.map((t) => {
  const s = t.power_entity?.trim();
  if (!s)
    return t;
  const r = e(s);
  return r ? {
    ...t,
    name: r
  } : t;
}), Vt = "spv-card-config-updated", Ei = (i, e) => {
  i.dispatchEvent(
    new CustomEvent("config-changed", {
      detail: { config: e },
      bubbles: !0,
      composed: !0
    })
  );
}, Ns = (i) => typeof i == "string" ? i.trim().toLowerCase() : "", ne = (i, e) => {
  const t = Ns(i.attributes?.unit_of_measurement);
  return t.length > 0 && e.includes(t);
}, ae = (i, e) => {
  const t = Ns(i.attributes?.device_class);
  return t.length > 0 && e.includes(t);
}, jt = [
  {
    key: "inverter_ac_power_entity",
    labelKey: "editor.field.advanced_inverter_ac_power",
    matcher: (i) => ne(i, ["w", "kw"]) || ae(i, ["power"])
  },
  {
    key: "inverter_ac_voltage_entity",
    labelKey: "editor.field.advanced_inverter_ac_voltage",
    matcher: (i) => ne(i, ["v", "kv", "mv"]) || ae(i, ["voltage"])
  },
  {
    key: "inverter_ac_current_entity",
    labelKey: "editor.field.advanced_inverter_ac_current",
    matcher: (i) => ne(i, ["a", "ma"]) || ae(i, ["current"])
  },
  {
    key: "inverter_temp_entity",
    labelKey: "editor.field.advanced_inverter_temp",
    matcher: (i) => ae(i, ["temperature"]) || ne(i, ["°c", "°f", "℃", "℉", "c", "f"])
  },
  {
    key: "panel_current_entity",
    labelKey: "editor.field.advanced_panel_current",
    matcher: (i) => ne(i, ["a", "ma"]) || ae(i, ["current"])
  },
  {
    key: "panel_voltage_entity",
    labelKey: "editor.field.advanced_panel_voltage",
    matcher: (i) => ne(i, ["v", "kv", "mv"]) || ae(i, ["voltage"])
  },
  {
    key: "panel_power_entity",
    labelKey: "editor.field.advanced_panel_power",
    matcher: (i) => ne(i, ["w", "kw"]) || ae(i, ["power"])
  }
], Ye = class Ye extends ye {
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
        s = s.map((n) => ({ ...n, power_entity: void 0 }));
        const o = Kt(
          s,
          this.hass.states,
          "power_entity",
          e,
          (n) => n === "w"
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
        s = s.map((n) => ({ ...n, energy_entity: void 0 }));
        const o = Kt(
          s,
          this.hass.states,
          "energy_entity",
          t,
          (n) => n === "kwh" || n === "wh"
        );
        s = o.panels, r.push(
          this._t("editor.autofill.energy_summary", {
            matched: o.matched,
            filled: o.filled,
            skipped: o.skipped
          })
        );
      }
      s = Ci(
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
    super.connectedCallback(), window.addEventListener(Vt, this._handleCardConfigSync);
  }
  disconnectedCallback() {
    window.removeEventListener(Vt, this._handleCardConfigSync), super.disconnectedCallback();
  }
  setConfig(e) {
    this._config = this._normalizeEditorConfig(e ?? {});
  }
  _getCardType() {
    return at;
  }
  _normalizeEditorConfig(e) {
    return Me(e);
  }
  _renderExtraSections() {
    return v;
  }
  _t(e, t) {
    return Ps(this.hass, e, t);
  }
  render() {
    if (!this.hass)
      return v;
    const e = !!this.hass.states["sensor.power_production_now"], t = !!this.hass.states["sensor.energy_production_today"], s = e && t ? this._t("editor.forecast.detected") : this._t("editor.forecast.missing");
    return f`
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
          ${this._renderEditorInput(
      this._t("editor.field.max_panel_tile_width"),
      String(this._config.panel_max_width_px ?? 220),
      (r) => this._updateRootValue(
        "panel_max_width_px",
        this._parseNumberWithClamp(
          r,
          this._config.panel_max_width_px ?? 220,
          120,
          320
        )
      ),
      {
        type: "number",
        min: 120,
        max: 320,
        disabled: !(this._config.limit_panel_width ?? !1),
        updateOn: "change"
      }
    )}
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
          ${this._renderEditorInput(
      this._t("editor.field.fault_terms"),
      (this._config.inverter_fault_terms ?? []).join(", "),
      (r) => this._updateRootValue(
        "inverter_fault_terms",
        r
      )
    )}
          ${this._renderEditorInput(
      this._t("editor.field.working_terms"),
      (this._config.inverter_working_terms ?? []).join(", "),
      (r) => this._updateRootValue(
        "inverter_working_terms",
        r
      )
    )}
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
              ${this._renderEditorInput(
      this._t("editor.field.power_prefix"),
      this._autoFillPowerPrefix,
      (r) => {
        this._autoFillPowerPrefix = r;
      }
    )}
              ${this._renderEditorInput(
      this._t("editor.field.energy_prefix"),
      this._autoFillEnergyPrefix,
      (r) => {
        this._autoFillEnergyPrefix = r;
      }
    )}
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
            ${this._autoFillResultMessage ? f`<p class="section-copy">${this._autoFillResultMessage}</p>` : v}
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
    return f`
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
    return f`
      <details class="panel-advanced">
        <summary>${this._t("editor.section.advanced_title")}</summary>
        <div class="panel-advanced-grid">
          <p class="section-copy">
            ${this._t("editor.section.advanced_copy")}
          </p>
          ${jt.map(
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
      (n) => this._updatePanelAdvancedMetricValue(e, t, n)
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
      (n) => this._updatePanelValue(e, t, n)
    );
  }
  _renderTextField(e, t, s) {
    return this._renderEditorInput(
      t,
      s,
      (r) => this._updateRootValue(e, r)
    );
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
      (n) => this._updatePanelValue(e, t, n)
    );
  }
  _renderSelectorWithClear(e, t, s, r) {
    return f`
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
    return this._renderEditorInput(
      t,
      String(s),
      (n) => this._updateRootValue(
        e,
        this._parseNumberWithClamp(n, s, r, o)
      ),
      { type: "number", min: r, max: o, updateOn: "change" }
    );
  }
  _renderOptionalNumberField(e, t, s, r, o) {
    return this._renderEditorInput(
      t,
      s !== void 0 ? String(s) : "",
      (n) => this._updateRootValue(
        e,
        this._parseOptionalNumber(n, r, o)
      ),
      { type: "number", min: r, max: o, updateOn: "change" }
    );
  }
  _renderPanelTextField(e, t, s, r) {
    return this._renderEditorInput(
      s,
      r,
      (o) => this._updatePanelValue(e, t, o)
    );
  }
  _renderPanelOptionalNumberField(e, t, s, r, o, n) {
    return this._renderEditorInput(
      s,
      r !== void 0 ? String(r) : "",
      (a) => this._updatePanelValue(
        e,
        t,
        this._parseOptionalNumber(a, o, n)
      ),
      { type: "number", min: o, max: n, updateOn: "change" }
    );
  }
  _renderPanelNumberField(e, t, s, r, o, n) {
    return this._renderEditorInput(
      s,
      String(r),
      (a) => this._updatePanelValue(
        e,
        t,
        this._parseNumberWithClamp(a, r, o, n)
      ),
      { type: "number", min: o, max: n, updateOn: "change" }
    );
  }
  _renderEditorInput(e, t, s, r = {}) {
    const o = r.updateOn ?? "input", n = (l) => {
      o === "input" && s(l.currentTarget.value);
    }, a = (l) => {
      o === "change" && s(l.currentTarget.value);
    };
    return f`
      <label class="field">
        <span class="field-label">${e}</span>
        <input
          class="text-input"
          type=${r.type ?? "text"}
          .value=${t}
          min=${r.min === void 0 ? v : String(r.min)}
          max=${r.max === void 0 ? v : String(r.max)}
          ?disabled=${r.disabled ?? !1}
          @input=${n}
          @change=${a}
        />
      </label>
    `;
  }
  _renderSelectField(e, t, s, r) {
    return f`
      <label class="color-field">
        <span>${t}</span>
        <select
          .value=${s}
          @change=${(o) => this._updateRootValue(e, o.currentTarget.value)}
        >
          ${r.map(
      (o) => f`<option value=${o.value}>${o.label}</option>`
    )}
        </select>
      </label>
    `;
  }
  _renderColorField(e, t) {
    const s = this._config.colors?.[e] ?? "";
    return f`
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
    const r = this._config.panels.map((n, a) => {
      if (a !== e)
        return n;
      const l = { ...n, [t]: s };
      if (t === "power_entity") {
        const c = n.power_entity, d = typeof s == "string" ? s.trim() : "";
        if (d.length > 0) {
          const p = this._getEntityFriendlyName(d);
          p && this._shouldAutoRenamePanel(n.name, n.id, c) && (l.name = p);
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
    const r = typeof s == "string" && s.trim().length > 0 ? s.trim() : void 0, o = this._config.panels.map((a, l) => {
      if (l !== e)
        return a;
      const c = {
        ...a.advanced_metrics ?? {}
      };
      return c[t] = r, jt.every(
        (d) => !c[d.key] || c[d.key]?.trim().length === 0
      ) ? {
        ...a,
        advanced_metrics: void 0
      } : {
        ...a,
        advanced_metrics: c
      };
    }), n = this._normalizeEditorConfig({
      ...this._config,
      panels: o
    });
    this._commit(n);
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
      this._config.panels.map((a, l) => l === e ? void 0 : a[t]).filter((a) => typeof a == "string" && a.length > 0)
    ), o = this._config.panels[e]?.[t], n = [];
    for (const a of Object.values(this.hass.states)) {
      if (!a.entity_id.startsWith("sensor."))
        continue;
      const l = a.attributes?.unit_of_measurement;
      if (typeof l != "string")
        continue;
      const c = l.trim().toLowerCase();
      s(c) && (r.has(a.entity_id) && a.entity_id !== o || n.push(a.entity_id));
    }
    return typeof o == "string" && o.length > 0 && !n.includes(o) && n.push(o), n.sort((a, l) => a.localeCompare(l));
  }
  _getAdvancedSensorEntityIds(e, t, s) {
    if (!this.hass)
      return [];
    const r = this._config.panels[e]?.advanced_metrics?.[t], o = [];
    for (const n of Object.values(this.hass.states))
      n.entity_id.startsWith("sensor.") && s(n) && o.push(n.entity_id);
    return typeof r == "string" && r.length > 0 && !o.includes(r) && o.push(r), o.sort((n, a) => n.localeCompare(a));
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
    return Si(
      e,
      t,
      s,
      (r) => this._getEntityFriendlyName(r)
    );
  }
  _commit(e) {
    this._config = e, Ei(this, e);
  }
  _isReorderOnlySync(e) {
    if (e.type !== this._getCardType() || e.rows !== this._config.rows || e.columns !== this._config.columns || e.panels.length !== this._config.panels.length)
      return !1;
    const t = this._toPanelSignatureMap(this._config.panels), s = this._toPanelSignatureMap(e.panels);
    if (t.size !== s.size)
      return !1;
    for (const [n, a] of t.entries())
      if (s.get(n) !== a)
        return !1;
    const r = this._config.panels.map((n) => n.id).join("|"), o = e.panels.map((n) => n.id).join("|");
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
Ye.properties = {
  hass: { attribute: !1 },
  _config: { state: !0 },
  _autoFillPowerPrefix: { state: !0 },
  _autoFillEnergyPrefix: { state: !0 },
  _autoFillResultMessage: { state: !0 }
}, Ye.styles = dt`
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

    .field {
      display: grid;
      gap: 6px;
      min-width: 0;
      color: var(--secondary-text-color);
      font-size: 0.78rem;
      font-weight: 500;
    }

    .field-label {
      line-height: 1.2;
    }

    .text-input {
      box-sizing: border-box;
      width: 100%;
      min-height: 42px;
      border-radius: 12px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: var(--primary-text-color);
      padding: 0 12px;
      font: inherit;
      outline: none;
    }

    .text-input:focus {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 1px var(--primary-color);
    }

    .text-input:disabled {
      cursor: not-allowed;
      opacity: 0.55;
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
let je = Ye;
class Ls extends je {
}
customElements.get("solar-panel-visualizer-card-editor") || customElements.define(
  "solar-panel-visualizer-card-editor",
  Ls
);
const ki = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SolarPanelVisualizerBaseCardEditor: je,
  SolarPanelVisualizerCardEditor: Ls
}, Symbol.toStringTag, { value: "Module" })), Yt = typeof navigator < "u" ? navigator.language : "en";
window.customCards = window.customCards || [];
window.customCards.push({
  type: qt,
  name: Ke(Yt, "meta.card_name"),
  description: Ke(Yt, "meta.card_description"),
  icon: "mdi:solar-panel",
  preview: !0
});
