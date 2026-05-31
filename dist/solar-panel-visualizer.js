const ur = "solar-panel-visualizer", xt = `custom:${ur}`, Pt = {
  production_start: "#8dcf72",
  production_mid: "#bfe36a",
  production_end: "#ffd35a",
  deviation: "#ff9667",
  error: "#ff627f",
  unavailable: "#586779"
}, _r = 2, mr = 3, fr = 15, gr = 50, yr = 3, vr = 3, br = 20, wr = 0, xr = 30, Pr = 12, $r = 0, Sr = 2, Cr = 0, Er = !1, kr = 220, Ir = 980, Tr = 1, Fr = !1, Mr = !0, Ar = !0, Rr = !0, Nr = !0, Lr = "auto", et = 1e4, Dr = ["fault", "alarm", "error", "failed", "failure", "trip"], Or = [
  "normal",
  "ok",
  "running",
  "waiting for operation",
  "producing"
], j = (i, e, t = 1, r = 12) => {
  const s = Number(i);
  return Number.isFinite(s) ? Math.min(Math.max(Math.round(s), t), r) : e;
}, Ae = (i, e, t = 0, r = 100) => {
  const s = Number(i);
  return Number.isFinite(s) ? Math.min(Math.max(s, t), r) : e;
}, W = (i) => {
  if (typeof i != "string")
    return;
  const e = i.trim();
  return e.length > 0 ? e : void 0;
}, hs = (i) => {
  if (typeof i == "string")
    return i.trim();
}, H = (i, e) => typeof i == "boolean" ? i : e, Tt = (i, e) => {
  const r = (Array.isArray(i) ? i : typeof i == "string" ? i.split(",") : []).map((s) => typeof s == "string" ? s.trim().toLowerCase() : "").filter((s) => s.length > 0);
  return r.length === 0 ? [...e] : [...new Set(r)];
}, Ft = (i, e, t) => {
  if (i == null || i === "")
    return;
  const r = Number(i);
  if (Number.isFinite(r))
    return Math.min(Math.max(r, e), t);
}, Gr = (i, e, t) => {
  if (i == null || i === "")
    return;
  const r = Number(i);
  if (!(!Number.isFinite(r) || r < e))
    return Math.min(r, t);
}, us = (i) => `panel-${i + 1}`, _s = (i) => i === "none" ? "none" : "details", ms = (i) => i === "dark" || i === "light" ? i : Lr, fs = (i) => {
  if (typeof i != "object" || i === null)
    return;
  const e = i, t = e.columns === "full" || typeof e.columns == "number" ? e.columns : void 0, r = e.rows === "auto" || typeof e.rows == "number" ? e.rows : void 0;
  if (!(t === void 0 && r === void 0))
    return {
      columns: t,
      rows: r
    };
}, gs = [
  "inverter_ac_power_entity",
  "inverter_ac_voltage_entity",
  "inverter_ac_current_entity",
  "inverter_temp_entity",
  "panel_current_entity",
  "panel_voltage_entity",
  "panel_power_entity"
], ys = (i, e) => {
  if (!e || typeof i != "object" || i === null)
    return;
  const t = i, r = {};
  let s = !1;
  for (const o of gs) {
    const n = W(t[o]);
    r[o] = n, n && (s = !0);
  }
  if (s)
    return r;
}, vs = (i, e) => {
  const t = H(i?.enabled, !0);
  return {
    id: W(i?.id) ?? us(e),
    name: W(i?.name),
    power_entity: t ? W(i?.power_entity) : void 0,
    energy_entity: t ? W(i?.energy_entity) : void 0,
    show_energy: H(i?.show_energy, !1),
    inverter_status_entity: t ? W(i?.inverter_status_entity) ?? W(i?.error_entity) : void 0,
    error_entity: t ? W(i?.error_entity) : void 0,
    advanced_metrics: ys(i?.advanced_metrics, t),
    enabled: t,
    rated_power_w: Gr(i?.rated_power_w, 1, et),
    deviation_derate_percent: Ae(i?.deviation_derate_percent, 100, 1, 100)
  };
}, Hr = (i, e, t = []) => {
  const r = i * e;
  return Array.from(
    { length: r },
    (s, o) => vs(t[o], o)
  );
}, bs = (i = _r, e = mr) => ({
  type: xt,
  title: "Solar Array",
  theme_mode: Lr,
  rows: i,
  columns: e,
  panels: Hr(i, e),
  enable_inverter_status: !1,
  inverter_fault_terms: [...Dr],
  inverter_working_terms: [...Or],
  show_inverter_status_on_tiles: !1,
  enable_array_checks: !1,
  deviation_threshold_percent: fr,
  deviation_absolute_w_threshold: gr,
  deviation_min_active_panels: yr,
  deviation_min_samples: vr,
  deviation_min_runtime_minutes: br,
  deviation_smoothing_minutes: wr,
  deviation_dynamic_floor_w: xr,
  deviation_history_hours: Pr,
  colors: Pt,
  production_color_intensity: Tr,
  show_energy: !0,
  use_system_power_entity: !1,
  system_power_entity: void 0,
  invert_system_power: !1,
  use_system_energy_entity: !1,
  system_energy_entity: void 0,
  enable_forecast_overlay: Fr,
  motion_enabled: Mr,
  motion_power_flow: Ar,
  motion_update_shimmer: Rr,
  motion_alert_ripple: Nr,
  show_custom_kpi: !0,
  custom_kpi_title: "Custom KPI",
  custom_kpi_entity: void 0,
  custom_kpi_decimals: Cr,
  invert_custom_kpi: !1,
  panel_tap_action: "details",
  power_decimals: $r,
  energy_decimals: Sr,
  limit_panel_width: Er,
  panel_max_width_px: kr,
  max_card_width_px: Ir
}), Re = (i = {}) => {
  const e = j(i.rows, _r), t = j(i.columns, mr), r = {
    ...Pt,
    ...i.colors ?? {}
  };
  return {
    type: W(i.type) ?? xt,
    title: W(i.title),
    theme_mode: ms(i.theme_mode),
    rows: e,
    columns: t,
    panels: Hr(e, t, i.panels ?? []),
    enable_inverter_status: H(i.enable_inverter_status, !1),
    inverter_fault_terms: Tt(
      i.inverter_fault_terms,
      Dr
    ),
    inverter_working_terms: Tt(
      i.inverter_working_terms,
      Or
    ),
    show_inverter_status_on_tiles: H(
      i.show_inverter_status_on_tiles,
      !1
    ),
    enable_array_checks: H(i.enable_array_checks, !1),
    deviation_threshold_percent: Ae(
      i.deviation_threshold_percent,
      fr,
      1,
      100
    ),
    deviation_absolute_w_threshold: Ae(
      i.deviation_absolute_w_threshold,
      gr,
      0,
      5e3
    ),
    deviation_min_active_panels: j(
      i.deviation_min_active_panels,
      yr,
      2,
      30
    ),
    deviation_min_samples: j(
      i.deviation_min_samples,
      vr,
      1,
      120
    ),
    deviation_min_runtime_minutes: j(
      i.deviation_min_runtime_minutes,
      br,
      0,
      1440
    ),
    deviation_smoothing_minutes: j(
      i.deviation_smoothing_minutes,
      wr,
      0,
      1440
    ),
    deviation_dynamic_floor_w: Ae(
      i.deviation_dynamic_floor_w,
      xr,
      0,
      5e3
    ),
    deviation_restart_entity: W(i.deviation_restart_entity),
    deviation_history_hours: j(
      i.deviation_history_hours,
      Pr,
      1,
      168
    ),
    colors: r,
    production_color_intensity: Ae(
      i.production_color_intensity,
      Tr,
      0.2,
      1.6
    ),
    show_energy: !0,
    use_system_power_entity: H(i.use_system_power_entity, !1),
    system_power_entity: W(i.system_power_entity),
    invert_system_power: H(i.invert_system_power, !1),
    use_system_energy_entity: H(i.use_system_energy_entity, !1),
    system_energy_entity: W(i.system_energy_entity),
    enable_forecast_overlay: H(
      i.enable_forecast_overlay,
      Fr
    ),
    motion_enabled: H(i.motion_enabled, Mr),
    motion_power_flow: H(
      i.motion_power_flow,
      Ar
    ),
    motion_update_shimmer: H(
      i.motion_update_shimmer,
      Rr
    ),
    motion_alert_ripple: H(
      i.motion_alert_ripple,
      Nr
    ),
    show_custom_kpi: H(i.show_custom_kpi, !0),
    custom_kpi_title: hs(i.custom_kpi_title) ?? "Custom KPI",
    custom_kpi_entity: W(i.custom_kpi_entity),
    custom_kpi_decimals: j(
      i.custom_kpi_decimals,
      Cr,
      0,
      4
    ),
    invert_custom_kpi: H(i.invert_custom_kpi, !1),
    panel_tap_action: _s(i.panel_tap_action),
    power_decimals: j(
      i.power_decimals,
      $r,
      0,
      4
    ),
    energy_decimals: j(
      i.energy_decimals,
      Sr,
      0,
      4
    ),
    limit_panel_width: H(
      i.limit_panel_width,
      Er
    ),
    panel_max_width_px: j(
      i.panel_max_width_px,
      kr,
      120,
      320
    ),
    default_panel_rated_power_w: Gr(
      i.default_panel_rated_power_w,
      1,
      et
    ),
    max_card_width_px: Ft(i.max_card_width_px, 300, 2400) ?? Ir,
    max_card_height_px: Ft(i.max_card_height_px, 300, 2600),
    grid_options: fs(i.grid_options)
  };
}, ws = (i) => {
  const e = [];
  return typeof i != "object" || i === null ? ["Configuration must be an object."] : (i.rows !== void 0 && (!Number.isFinite(Number(i.rows)) || Number(i.rows) < 1) && e.push("`rows` must be a positive number."), i.columns !== void 0 && (!Number.isFinite(Number(i.columns)) || Number(i.columns) < 1) && e.push("`columns` must be a positive number."), i.max_card_width_px !== void 0 && !Number.isFinite(Number(i.max_card_width_px)) && e.push("`max_card_width_px` must be a number if set."), i.panel_max_width_px !== void 0 && (!Number.isFinite(Number(i.panel_max_width_px)) || Number(i.panel_max_width_px) < 120 || Number(i.panel_max_width_px) > 320) && e.push("`panel_max_width_px` must be between 120 and 320."), i.max_card_height_px !== void 0 && !Number.isFinite(Number(i.max_card_height_px)) && e.push("`max_card_height_px` must be a number if set."), i.custom_kpi_decimals !== void 0 && (!Number.isFinite(Number(i.custom_kpi_decimals)) || Number(i.custom_kpi_decimals) < 0 || Number(i.custom_kpi_decimals) > 4) && e.push("`custom_kpi_decimals` must be between 0 and 4."), i.production_color_intensity !== void 0 && (!Number.isFinite(Number(i.production_color_intensity)) || Number(i.production_color_intensity) < 0.2 || Number(i.production_color_intensity) > 1.6) && e.push("`production_color_intensity` must be between 0.2 and 1.6."), i.deviation_absolute_w_threshold !== void 0 && (!Number.isFinite(Number(i.deviation_absolute_w_threshold)) || Number(i.deviation_absolute_w_threshold) < 0) && e.push("`deviation_absolute_w_threshold` must be 0 or higher."), i.deviation_min_active_panels !== void 0 && (!Number.isFinite(Number(i.deviation_min_active_panels)) || Number(i.deviation_min_active_panels) < 2) && e.push("`deviation_min_active_panels` must be 2 or higher."), i.deviation_min_samples !== void 0 && (!Number.isFinite(Number(i.deviation_min_samples)) || Number(i.deviation_min_samples) < 1) && e.push("`deviation_min_samples` must be 1 or higher."), i.deviation_min_runtime_minutes !== void 0 && (!Number.isFinite(Number(i.deviation_min_runtime_minutes)) || Number(i.deviation_min_runtime_minutes) < 0) && e.push("`deviation_min_runtime_minutes` must be 0 or higher."), i.deviation_smoothing_minutes !== void 0 && (!Number.isFinite(Number(i.deviation_smoothing_minutes)) || Number(i.deviation_smoothing_minutes) < 0) && e.push("`deviation_smoothing_minutes` must be 0 or higher."), i.deviation_dynamic_floor_w !== void 0 && (!Number.isFinite(Number(i.deviation_dynamic_floor_w)) || Number(i.deviation_dynamic_floor_w) < 0) && e.push("`deviation_dynamic_floor_w` must be 0 or higher."), i.deviation_history_hours !== void 0 && (!Number.isFinite(Number(i.deviation_history_hours)) || Number(i.deviation_history_hours) < 1) && e.push("`deviation_history_hours` must be 1 or higher."), Array.isArray(i.panels) && i.panels.forEach((t, r) => {
    const s = t?.deviation_derate_percent;
    s !== void 0 && (!Number.isFinite(Number(s)) || Number(s) < 1 || Number(s) > 100) && e.push(
      `\`panels[${r}].deviation_derate_percent\` must be between 1 and 100.`
    );
  }), e);
}, xs = { card_name: "Solar Panel Visualizer", card_description: "GUI-first solar array card with panel health, animated power rails, forecasts, history graphs, and light/dark themes." }, Ps = { unavailable: "Unavailable", not_configured: "Not configured", disabled: "Disabled", unknown_recorder_error: "Unknown recorder error" }, $s = { default_title: "Solar Array", eyebrow: "Solar Panel Visualizer", subtitle: { loading_history: "Loading shared {hours}h solar panel history...", warmup: "Deviation checks are warming up.", deviation_detected: "{count} panel{suffix} below expected output", tap_diagnostics: "Tap a panel for detailed diagnostics", drag_hint: "Drag and drop panel tiles to swap positions." }, summary: { power: "Power", energy: "Energy", alerts: "Alerts", system_sensor: "System sensor", sum_panel_sensors: "Sum of panel sensors", custom_sensor: "Custom KPI sensor", custom_default_title: "Custom KPI" }, panel: { hidden: "hidden", hidden_name: "Hidden Panel", hidden_performance: "Hidden", info_label: "Info", info_title: "Open panel details", inverter_prefix: "Inverter: {status}", inverter_short: { ok: "Inverter: OK", deviation: "Inverter: Deviation", error: "Inverter: Error" }, performance_compact: "{percent}%", performance_medium: "{percent}% of {rated}W", performance_full: "{percent}% of {rated}W Panel", slot_label: "R{row}C{column}", status: { normal: "normal", deviation: "deviation", inverter: "inverter", error: "error", offline: "offline", unconfigured: "unconfigured", disabled: "hidden" } }, popup: { close_detail: "Close detail", close_live_power: "Close live power detail", close_energy: "Close energy detail", close_custom_kpi: "Close custom KPI detail", close_system_health: "Close system health", panel_eyebrow: "Panel Detail {slot}", power_eyebrow: "Power Detail", power_title: "Live Power", energy_eyebrow: "Energy Detail", energy_title: "Energy", custom_eyebrow: "Custom KPI Detail", system_health_eyebrow: "System Health", system_health_title: "Overview", detail: { status: "Status", power: "Power", energy: "Energy", estimated_power_now: "Forecast production", estimated_energy_now: "Forecast production", deviation: "Deviation", rated_performance: "Rated / Performance", information: "Information", current: "Current", source: "Source" }, deviation: { inverter_mismatch: "Inverter status mismatch", below_peers: "{percent}% below peers", within_range: "Within range" }, rated_performance: { format: "{rated} W / {percent}", na: "n/a" }, info: { power_source: "Power source: {value}", current_inverter_status: 'Current inverter status: "{value}"', inverter_evaluation: "Inverter evaluation: {value}", inverter_source: "Inverter source: {value}" }, inverter_eval: { no_status: "No status available", fault_match: "Fault term matched", working_match: "Working term matched", no_match: "No configured term matched" }, telemetry: { title: "Panel / Inverter Info", configured_title: "Configured", unconfigured_title: "Unconfigured", none_configured: "No advanced telemetry configured for this panel.", setup_hint: "Configure in Panels > Advanced telemetry.", label: { inverter_status: "Inverter status", inverter_ac_power: "Inverter AC power", inverter_ac_voltage: "Inverter AC voltage", inverter_ac_current: "Inverter AC current", inverter_temp: "Inverter temperature", panel_current: "Panel current", panel_voltage: "Panel voltage", panel_power: "Panel power" } }, history: { power: "Power History", system_power: "System Power History", total_panel_power: "Total Panel Power History", system_energy: "System Energy History", total_panel_energy: "Total Panel Energy History", panel_power_values: "Panel Power Values", panel_energy_values: "Panel Energy Values", panel_compare: "Panel Performance Comparison", panel_compare_power: "Panel Power Comparison", panel_compare_energy: "Panel Energy Comparison", overlay_forecast: "Forecast", graph_not_configured: "No sensor configured for graph.", custom_not_configured: "No sensor configured for Custom KPI.", loading: "Loading sensor history...", no_data: "No history data for selected range.", unable_load: "Unable to load panel history ({error})", unable_load_plain: "Unable to load panel history", max: "Max {value}", median: "Median {value}", min: "Min {value}", time_range: "{start} - {end}" }, forecast: { enable_button: "Enable forecasts", disabled_hint: "Forecast overlay is disabled.", not_configured: "Forecast.Solar not configured.", default_sensor_not_found: "Default forecast sensor not found ({entity}).", power_compare_requires_system: "System power sensor is required for power forecast comparison.", energy_compare_requires_system: "System energy sensor is required for energy forecast comparison." }, panel_compare: { toggle: "Compare Panel Performance", toggle_power: "Compare Panel Power", toggle_energy: "Compare Panel Energy", loading: "Loading panel comparison history...", no_panels: "No configured panel sensors available for comparison.", no_panels_power: "No configured panel power sensors available for comparison.", no_panels_energy: "No configured panel energy sensors available for comparison.", no_data: "No comparison data for selected range.", unable_load: "Unable to load panel comparison history ({error}).", render_failure: "Comparison data loaded, but traces could not be drawn.", diagnostics_title: "Compare graph diagnostics (temporary)", diagnostics_summary: "model hasData={hasData}, drawable={drawable}, series={series}, range={range}h", diagnostics_reason_render_failure: "Series exist but no drawable traces were produced.", diagnostics_reason_suspect: "One or more series produced an invalid drawable shape.", diagnostics_row: "{label}: samples={samples}, points={points}, first={first}, last={last}, min={min}, max={max}" }, system_health: { everything_ok: "Everything is working well.", section: { inverter: "Inverter", error: "Error", deviation: "Deviation", offline: "Unavailable", setup: "Needs setup" }, item: "Panel on {slot} ({label}): {reason}" } }, quick_setup: { title: "Quick Setup:", select_power_sensor: "Select panel power sensor:", selector_label: "Select panel power sensor", no_sensors: "No available W sensors found.", disable_panel: "Disable Panel (hide but keep slot when off)" }, system_health_chip: { faults: "{count} Fault{suffix}", unavailable: "{count} Unavailable", deviation: "{count} Deviation", needs_setup: "{count} Needs Setup", ok: "System OK" } }, Ss = { reason: { slot_hidden: "Panel slot is hidden in the card configuration.", select_power_sensor: "Select a power sensor to activate this panel slot.", power_entity_missing: "Power entity {entity} was not found.", power_entity_unavailable: "{entity} is unavailable.", inverter_fault_match: 'Current inverter status: "{status}" matches configured fault terms.', inverter_working_mismatch: 'Current inverter status: "{status}" does not match configured working terms.', producing_expected: "Producing within the expected array range.", producing_adjusted: "Producing within array-adjusted target range.", rated_not_configured: "Rated power not configured; excluded from deviation checks.", output_below_target: "Output is {percent}% and {shortfall} W below array target.", array_check_disabled: "Array Health Check is disabled.", need_non_derated_panels: "Need at least {count} non-derated active rated panels for deviation checks.", collecting_samples: "Collecting samples ({current}/{required}).", warmup_progress: "Warm-up in progress ({current}/{required} min).", low_light_pause: "Low-light pause: waiting above {floor} W target floor." }, status_display: { disabled: "Disabled", not_configured: "Not configured" }, energy: { default_unit: "kWh" }, power: { default_unit: "W" } }, Cs = { section: { layout_title: "Layout", layout_copy: "Set the array size first. Panel slots expand automatically from the row and column values.", display_title: "Display", display_copy: "Tune precision and panel detail behavior.", appearance_title: "Appearance", appearance_copy: "Auto follows the active Home Assistant theme. Force Light or Dark if a dashboard theme needs a specific card style.", forecast_title: "Forecast.Solar", forecast_copy: "Auto-detects Home Assistant default forecast sensors and overlays estimated production in Power/Energy KPI popups.", array_health_title: "Array Health Check", array_health_copy: "Automatically checks panel health by comparing active panels against each other using rated power, shared solar panel history, and configurable guardrails.", array_health_smoothing_help: "Smoothing window averages recent samples before checks; 0 means no smoothing.", inverter_title: "Inverter Status", inverter_copy: "Track textual status from each panel’s inverter status sensor. A panel turns red only when status text contains one of the configured fault terms. The current inverter status is shown in the panel popup.", status_colors_title: "Status Colors", status_colors_copy: "Production colors blend based on panel output. Alert colors override the production scale.", motion_title: "Motion", motion_copy: "Animate live production with left-collector power rails, Power/Energy KPI impact effects, and repeated alert ripples. Motion automatically respects reduced-motion preferences.", panels_title: "Panels", panels_copy: "Each generated slot can be configured with its own power, energy, and optional inverter status sensor. Disable a slot to hide that panel while keeping grid spacing.", panels_drag_hint: "In the card view, drag and drop panel tiles to swap their positions.", panel_defaults_title: "Panel default rated power", panel_defaults_copy: "Set a common default panel power and apply it to all panel slots.", autofill_title: "Auto-populate sensors", autofill_copy: "Fill panel sensors in slot order. Use sensor. for exact entity ID prefixes, or type friendly-name text to search sensor names.", advanced_title: "Advanced telemetry", advanced_copy: "Optional manual telemetry mappings shown in the panel popup when pressing INFO." }, field: { title: "Title", rows: "Rows", columns: "Columns", max_card_width: "Max card width (px)", max_card_height: "Max card height (px)", theme_mode: "Theme mode", power_decimals: "Power decimals", energy_decimals: "Energy decimals", custom_kpi_decimals: "Custom KPI decimals", panel_tap_action: "Panel tap action", system_power_sensor: "System power sensor (W)", system_energy_sensor: "System daily energy sensor", custom_kpi_sensor: "Custom KPI sensor", custom_kpi_heading: "Custom KPI heading", max_panel_tile_width: "Max panel tile width (px)", deviation_threshold: "Deviation threshold (%)", deviation_absolute_shortfall: "Absolute shortfall threshold (W)", deviation_check_time: "Deviation check time (minutes)", deviation_min_active_panels: "Minimum active panels", deviation_min_samples: "Minimum samples per panel", deviation_smoothing: "Smoothing window (minutes)", deviation_dynamic_floor: "Dynamic floor start (W)", deviation_history_window: "Shared history window (hours)", fault_terms: "Fault terms (comma-separated)", working_terms: "Working terms (comma-separated)", production_base: "Production base", production_mid: "Production mid", production_peak: "Production peak", deviation_color: "Deviation", error_color: "Error", unavailable_color: "Unavailable", production_intensity: "Production color intensity ({value})", default_panel_rated_power: "Default panel rated power (W)", power_prefix: "Power search", energy_prefix: "Energy search (optional)", autofill_sort_mode: "Auto-fill sort order", display_name: "Display name", power_sensor: "Power sensor P(W)", energy_sensor: "Energy sensor (kWh/Wh)", panel_rated_power: "Panel rated power (W)", deviation_derate: "Deviation derate (%)", inverter_status_sensor: "Inverter status sensor (optional)", advanced_inverter_ac_power: "Inverter AC power (W)", advanced_inverter_ac_voltage: "Inverter AC voltage (V)", advanced_inverter_ac_current: "Inverter AC current (A)", advanced_inverter_temp: "Inverter temperature (°C/°F)", advanced_panel_current: "Panel current (A)", advanced_panel_voltage: "Panel voltage (V)", advanced_panel_power: "Panel power (W)", panel_energy_toggle: "Show panel energy", panel_enabled_toggle: "Show panel tile (hide but keep slot when off)" }, toggle: { use_system_power: "Use one system power sensor for top KPI", invert_system_power: "Invert system power value", use_system_energy: "Use one system daily energy sensor for top KPI", invert_custom_kpi: "Invert Custom KPI value", enable_forecast_overlay: "Enable forecast overlays in popups", motion_enabled: "Enable motion", motion_power_flow: "Power-rail flow to Power KPI", motion_update_shimmer: "Power/Energy KPI update effect", motion_alert_ripple: "Alert ripple for deviation/inverter/error", show_custom_kpi: "Show Custom KPI box", limit_panel_width: "Limit panel tile max width", enable_array_health: "Enable Array Health Check", enable_inverter_status: "Enable inverter status checks", show_inverter_status_tiles: "Show inverter status on panel tiles", autofill_inverter_status: "Fill inverter status", autofill_advanced_telemetry: "Fill advanced telemetry" }, select: { theme_auto: "Auto", theme_dark: "Dark", theme_light: "Light", panel_tap_details: "Open detail popover", panel_tap_none: "No action", autofill_sort_auto: "Auto detect (recommended)", autofill_sort_entity: "Literal entity ID order", autofill_sort_friendly: "Literal friendly name order", autofill_sort_grouped: "Group by repeated suffix" }, button: { apply_default_rated_power: "Apply default rated W to all panels", autofill_sensors: "Auto-fill panel sensors", remove_all_sensors: "Remove all sensors" }, helper: { fault_example: "Example: fault, alarm, error, failed, failure, trip", working_example: "Working example: normal, ok, running, waiting for operation, producing", derate_help: "Used only by Array Health Check for naturally shaded panels.", autofill_search_help: "Search with sensor.panel_ to match entity IDs by prefix, or type words like Roof Panel or Daily Energy to search friendly names. Auto detect is recommended for most setups: it uses natural sorting and can group matching sensors by repeated serial/device parts when that better matches the physical layout. Use the other sort modes only when Auto does not match your array.", autofill_inverter_status_help: "When enabled, inverter status is filled from configured panel power sensors by matching the same repeated serial/device/group. One same-group status sensor can be reused for all panels on that inverter.", autofill_advanced_help: "When enabled, advanced telemetry is filled from configured panel power sensors by matching the same repeated serial/device/group. Existing advanced telemetry choices are preserved." }, forecast: { default_sensors: "Uses: sensor.power_production_now and sensor.energy_production_today.", line_help: "The forecast reference is a thin dashed line shown only for the selected history range up to the current time, with no future projection.", detected: "Forecast.Solar default sensors detected.", missing: "Forecast.Solar default sensors not fully detected. Expected: sensor.power_production_now and sensor.energy_production_today." }, panel_slot_title: "Row {row}, Column {column}", autofill: { enter_prefix: "Enter at least one prefix to run auto-fill.", power_summary: "Power matched {matched}, filled {filled}, skipped {skipped}.", energy_summary: "Energy matched {matched}, filled {filled}, skipped {skipped}.", inverter_status_summary: "Inverter status filled {filled} panels, skipped {skipped} panels.", advanced_summary: "Advanced telemetry filled {filled} fields, skipped {skipped} panels.", cleared: "Cleared power, energy, inverter, and advanced telemetry sensors on all panels." } }, zr = {
  meta: xs,
  common: Ps,
  card: $s,
  state: Ss,
  editor: Cs
}, Es = { DEV: !1 }, ks = {
  en: zr
}, Mt = /* @__PURE__ */ new Set(), Is = () => typeof import.meta < "u" ? Es.DEV : typeof process < "u" ? process.env.NODE_ENV !== "production" : !1, Ts = (i, e) => {
  if (!Is())
    return;
  const t = `${e ?? "unknown"}:${i}`;
  Mt.has(t) || (Mt.add(t), console.warn(
    `[Solar Panel Visualizer i18n] Missing translation key "${i}" for locale "${e ?? "unknown"}".`
  ));
}, At = (i, e) => {
  if (i)
    return e.split(".").reduce(
      (t, r) => typeof t == "object" && t !== null ? t[r] : void 0,
      i
    );
}, Rt = (i, e) => e ? i.replace(/\{([a-zA-Z0-9_]+)\}/g, (t, r) => {
  const s = e[r];
  return s === void 0 ? `{${r}}` : String(s);
}) : i, Fs = (i) => {
  if (!i)
    return ["en"];
  const e = i.trim().toLowerCase();
  if (e.length === 0)
    return ["en"];
  const t = e.split("-")[0], r = [e, t, "en"];
  return [...new Set(r)];
}, Ms = (i, e, t, r) => {
  for (const o of Fs(e)) {
    const n = At(i[o], t);
    if (typeof n == "string")
      return Rt(n, r);
  }
  const s = At(i.en ?? zr, t);
  return typeof s == "string" ? Rt(s, r) : (Ts(t, e), "");
}, tt = (i, e, t) => Ms(
  ks,
  i,
  e,
  t
), Br = (i, e, t) => tt(i?.locale?.language, e, t);
const Xe = globalThis, $t = Xe.ShadowRoot && (Xe.ShadyCSS === void 0 || Xe.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, St = /* @__PURE__ */ Symbol(), Nt = /* @__PURE__ */ new WeakMap();
let Wr = class {
  constructor(e, t, r) {
    if (this._$cssResult$ = !0, r !== St) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if ($t && e === void 0) {
      const r = t !== void 0 && t.length === 1;
      r && (e = Nt.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), r && Nt.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const As = (i) => new Wr(typeof i == "string" ? i : i + "", void 0, St), Ct = (i, ...e) => {
  const t = i.length === 1 ? i[0] : e.reduce((r, s, o) => r + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + i[o + 1], i[0]);
  return new Wr(t, i, St);
}, Rs = (i, e) => {
  if ($t) i.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const r = document.createElement("style"), s = Xe.litNonce;
    s !== void 0 && r.setAttribute("nonce", s), r.textContent = t.cssText, i.appendChild(r);
  }
}, Lt = $t ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const r of e.cssRules) t += r.cssText;
  return As(t);
})(i) : i;
const { is: Ns, defineProperty: Ls, getOwnPropertyDescriptor: Ds, getOwnPropertyNames: Os, getOwnPropertySymbols: Gs, getPrototypeOf: Hs } = Object, oe = globalThis, Dt = oe.trustedTypes, zs = Dt ? Dt.emptyScript : "", Bs = oe.reactiveElementPolyfillSupport, Ne = (i, e) => i, yt = { toAttribute(i, e) {
  switch (e) {
    case Boolean:
      i = i ? zs : null;
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
} }, Ur = (i, e) => !Ns(i, e), Ot = { attribute: !0, type: String, converter: yt, reflect: !1, useDefault: !1, hasChanged: Ur };
Symbol.metadata ?? (Symbol.metadata = /* @__PURE__ */ Symbol("metadata")), oe.litPropertyMetadata ?? (oe.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let be = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = Ot) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const r = /* @__PURE__ */ Symbol(), s = this.getPropertyDescriptor(e, r, t);
      s !== void 0 && Ls(this.prototype, e, s);
    }
  }
  static getPropertyDescriptor(e, t, r) {
    const { get: s, set: o } = Ds(this.prototype, e) ?? { get() {
      return this[t];
    }, set(n) {
      this[t] = n;
    } };
    return { get: s, set(n) {
      const a = s?.call(this);
      o?.call(this, n), this.requestUpdate(e, a, r);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Ot;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Ne("elementProperties"))) return;
    const e = Hs(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Ne("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Ne("properties"))) {
      const t = this.properties, r = [...Os(t), ...Gs(t)];
      for (const s of r) this.createProperty(s, t[s]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [r, s] of t) this.elementProperties.set(r, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, r] of this.elementProperties) {
      const s = this._$Eu(t, r);
      s !== void 0 && this._$Eh.set(s, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const r = new Set(e.flat(1 / 0).reverse());
      for (const s of r) t.unshift(Lt(s));
    } else e !== void 0 && t.push(Lt(e));
    return t;
  }
  static _$Eu(e, t) {
    const r = t.attribute;
    return r === !1 ? void 0 : typeof r == "string" ? r : typeof e == "string" ? e.toLowerCase() : void 0;
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
    for (const r of t.keys()) this.hasOwnProperty(r) && (e.set(r, this[r]), delete this[r]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Rs(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((e) => e.hostDisconnected?.());
  }
  attributeChangedCallback(e, t, r) {
    this._$AK(e, r);
  }
  _$ET(e, t) {
    const r = this.constructor.elementProperties.get(e), s = this.constructor._$Eu(e, r);
    if (s !== void 0 && r.reflect === !0) {
      const o = (r.converter?.toAttribute !== void 0 ? r.converter : yt).toAttribute(t, r.type);
      this._$Em = e, o == null ? this.removeAttribute(s) : this.setAttribute(s, o), this._$Em = null;
    }
  }
  _$AK(e, t) {
    const r = this.constructor, s = r._$Eh.get(e);
    if (s !== void 0 && this._$Em !== s) {
      const o = r.getPropertyOptions(s), n = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : yt;
      this._$Em = s;
      const a = n.fromAttribute(t, o.type);
      this[s] = a ?? this._$Ej?.get(s) ?? a, this._$Em = null;
    }
  }
  requestUpdate(e, t, r, s = !1, o) {
    if (e !== void 0) {
      const n = this.constructor;
      if (s === !1 && (o = this[e]), r ?? (r = n.getPropertyOptions(e)), !((r.hasChanged ?? Ur)(o, t) || r.useDefault && r.reflect && o === this._$Ej?.get(e) && !this.hasAttribute(n._$Eu(e, r)))) return;
      this.C(e, t, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: r, reflect: s, wrapped: o }, n) {
    r && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, n ?? t ?? this[e]), o !== !0 || n !== void 0) || (this._$AL.has(e) || (this.hasUpdated || r || (t = void 0), this._$AL.set(e, t)), s === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
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
        for (const [s, o] of this._$Ep) this[s] = o;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [s, o] of r) {
        const { wrapped: n } = o, a = this[s];
        n !== !0 || this._$AL.has(s) || a === void 0 || this.C(s, void 0, o, a);
      }
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((r) => r.hostUpdate?.()), this.update(t)) : this._$EM();
    } catch (r) {
      throw e = !1, this._$EM(), r;
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
be.elementStyles = [], be.shadowRootOptions = { mode: "open" }, be[Ne("elementProperties")] = /* @__PURE__ */ new Map(), be[Ne("finalized")] = /* @__PURE__ */ new Map(), Bs?.({ ReactiveElement: be }), (oe.reactiveElementVersions ?? (oe.reactiveElementVersions = [])).push("2.1.2");
const Le = globalThis, Gt = (i) => i, rt = Le.trustedTypes, Ht = rt ? rt.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, Kr = "$lit$", ie = `lit$${Math.random().toFixed(9).slice(2)}$`, Vr = "?" + ie, Ws = `<${Vr}>`, he = document, Oe = () => he.createComment(""), Ge = (i) => i === null || typeof i != "object" && typeof i != "function", Et = Array.isArray, Us = (i) => Et(i) || typeof i?.[Symbol.iterator] == "function", ut = `[ 	
\f\r]`, Ie = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, zt = /-->/g, Bt = />/g, ne = RegExp(`>|${ut}(?:([^\\s"'>=/]+)(${ut}*=${ut}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Wt = /'/g, Ut = /"/g, jr = /^(?:script|style|textarea|title)$/i, Yr = (i) => (e, ...t) => ({ _$litType$: i, strings: e, values: t }), y = Yr(1), z = Yr(2), xe = /* @__PURE__ */ Symbol.for("lit-noChange"), b = /* @__PURE__ */ Symbol.for("lit-nothing"), Kt = /* @__PURE__ */ new WeakMap(), de = he.createTreeWalker(he, 129);
function qr(i, e) {
  if (!Et(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Ht !== void 0 ? Ht.createHTML(e) : e;
}
const Ks = (i, e) => {
  const t = i.length - 1, r = [];
  let s, o = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", n = Ie;
  for (let a = 0; a < t; a++) {
    const l = i[a];
    let c, p, d = -1, h = 0;
    for (; h < l.length && (n.lastIndex = h, p = n.exec(l), p !== null); ) h = n.lastIndex, n === Ie ? p[1] === "!--" ? n = zt : p[1] !== void 0 ? n = Bt : p[2] !== void 0 ? (jr.test(p[2]) && (s = RegExp("</" + p[2], "g")), n = ne) : p[3] !== void 0 && (n = ne) : n === ne ? p[0] === ">" ? (n = s ?? Ie, d = -1) : p[1] === void 0 ? d = -2 : (d = n.lastIndex - p[2].length, c = p[1], n = p[3] === void 0 ? ne : p[3] === '"' ? Ut : Wt) : n === Ut || n === Wt ? n = ne : n === zt || n === Bt ? n = Ie : (n = ne, s = void 0);
    const u = n === ne && i[a + 1].startsWith("/>") ? " " : "";
    o += n === Ie ? l + Ws : d >= 0 ? (r.push(c), l.slice(0, d) + Kr + l.slice(d) + ie + u) : l + ie + (d === -2 ? a : u);
  }
  return [qr(i, o + (i[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), r];
};
class He {
  constructor({ strings: e, _$litType$: t }, r) {
    let s;
    this.parts = [];
    let o = 0, n = 0;
    const a = e.length - 1, l = this.parts, [c, p] = Ks(e, t);
    if (this.el = He.createElement(c, r), de.currentNode = this.el.content, t === 2 || t === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (s = de.nextNode()) !== null && l.length < a; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const d of s.getAttributeNames()) if (d.endsWith(Kr)) {
          const h = p[n++], u = s.getAttribute(d).split(ie), f = /([.?@])?(.*)/.exec(h);
          l.push({ type: 1, index: o, name: f[2], strings: u, ctor: f[1] === "." ? js : f[1] === "?" ? Ys : f[1] === "@" ? qs : nt }), s.removeAttribute(d);
        } else d.startsWith(ie) && (l.push({ type: 6, index: o }), s.removeAttribute(d));
        if (jr.test(s.tagName)) {
          const d = s.textContent.split(ie), h = d.length - 1;
          if (h > 0) {
            s.textContent = rt ? rt.emptyScript : "";
            for (let u = 0; u < h; u++) s.append(d[u], Oe()), de.nextNode(), l.push({ type: 2, index: ++o });
            s.append(d[h], Oe());
          }
        }
      } else if (s.nodeType === 8) if (s.data === Vr) l.push({ type: 2, index: o });
      else {
        let d = -1;
        for (; (d = s.data.indexOf(ie, d + 1)) !== -1; ) l.push({ type: 7, index: o }), d += ie.length - 1;
      }
      o++;
    }
  }
  static createElement(e, t) {
    const r = he.createElement("template");
    return r.innerHTML = e, r;
  }
}
function Pe(i, e, t = i, r) {
  if (e === xe) return e;
  let s = r !== void 0 ? t._$Co?.[r] : t._$Cl;
  const o = Ge(e) ? void 0 : e._$litDirective$;
  return s?.constructor !== o && (s?._$AO?.(!1), o === void 0 ? s = void 0 : (s = new o(i), s._$AT(i, t, r)), r !== void 0 ? (t._$Co ?? (t._$Co = []))[r] = s : t._$Cl = s), s !== void 0 && (e = Pe(i, s._$AS(i, e.values), s, r)), e;
}
class Vs {
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
    const { el: { content: t }, parts: r } = this._$AD, s = (e?.creationScope ?? he).importNode(t, !0);
    de.currentNode = s;
    let o = de.nextNode(), n = 0, a = 0, l = r[0];
    for (; l !== void 0; ) {
      if (n === l.index) {
        let c;
        l.type === 2 ? c = new Be(o, o.nextSibling, this, e) : l.type === 1 ? c = new l.ctor(o, l.name, l.strings, this, e) : l.type === 6 && (c = new Xs(o, this, e)), this._$AV.push(c), l = r[++a];
      }
      n !== l?.index && (o = de.nextNode(), n++);
    }
    return de.currentNode = he, s;
  }
  p(e) {
    let t = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(e, r, t), t += r.strings.length - 2) : r._$AI(e[t])), t++;
  }
}
class Be {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, t, r, s) {
    this.type = 2, this._$AH = b, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = r, this.options = s, this._$Cv = s?.isConnected ?? !0;
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
    e = Pe(this, e, t), Ge(e) ? e === b || e == null || e === "" ? (this._$AH !== b && this._$AR(), this._$AH = b) : e !== this._$AH && e !== xe && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Us(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== b && Ge(this._$AH) ? this._$AA.nextSibling.data = e : this.T(he.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: t, _$litType$: r } = e, s = typeof r == "number" ? this._$AC(e) : (r.el === void 0 && (r.el = He.createElement(qr(r.h, r.h[0]), this.options)), r);
    if (this._$AH?._$AD === s) this._$AH.p(t);
    else {
      const o = new Vs(s, this), n = o.u(this.options);
      o.p(t), this.T(n), this._$AH = o;
    }
  }
  _$AC(e) {
    let t = Kt.get(e.strings);
    return t === void 0 && Kt.set(e.strings, t = new He(e)), t;
  }
  k(e) {
    Et(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let r, s = 0;
    for (const o of e) s === t.length ? t.push(r = new Be(this.O(Oe()), this.O(Oe()), this, this.options)) : r = t[s], r._$AI(o), s++;
    s < t.length && (this._$AR(r && r._$AB.nextSibling, s), t.length = s);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    for (this._$AP?.(!1, !0, t); e !== this._$AB; ) {
      const r = Gt(e).nextSibling;
      Gt(e).remove(), e = r;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class nt {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, r, s, o) {
    this.type = 1, this._$AH = b, this._$AN = void 0, this.element = e, this.name = t, this._$AM = s, this.options = o, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = b;
  }
  _$AI(e, t = this, r, s) {
    const o = this.strings;
    let n = !1;
    if (o === void 0) e = Pe(this, e, t, 0), n = !Ge(e) || e !== this._$AH && e !== xe, n && (this._$AH = e);
    else {
      const a = e;
      let l, c;
      for (e = o[0], l = 0; l < o.length - 1; l++) c = Pe(this, a[r + l], t, l), c === xe && (c = this._$AH[l]), n || (n = !Ge(c) || c !== this._$AH[l]), c === b ? e = b : e !== b && (e += (c ?? "") + o[l + 1]), this._$AH[l] = c;
    }
    n && !s && this.j(e);
  }
  j(e) {
    e === b ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class js extends nt {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === b ? void 0 : e;
  }
}
class Ys extends nt {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== b);
  }
}
class qs extends nt {
  constructor(e, t, r, s, o) {
    super(e, t, r, s, o), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = Pe(this, e, t, 0) ?? b) === xe) return;
    const r = this._$AH, s = e === b && r !== b || e.capture !== r.capture || e.once !== r.once || e.passive !== r.passive, o = e !== b && (r === b || s);
    s && this.element.removeEventListener(this.name, this, r), o && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Xs {
  constructor(e, t, r) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    Pe(this, e);
  }
}
const Qs = Le.litHtmlPolyfillSupport;
Qs?.(He, Be), (Le.litHtmlVersions ?? (Le.litHtmlVersions = [])).push("3.3.2");
const Zs = (i, e, t) => {
  const r = t?.renderBefore ?? e;
  let s = r._$litPart$;
  if (s === void 0) {
    const o = t?.renderBefore ?? null;
    r._$litPart$ = s = new Be(e.insertBefore(Oe(), o), o, void 0, t ?? {});
  }
  return s._$AI(i), s;
};
const De = globalThis;
class we extends be {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Zs(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return xe;
  }
}
we._$litElement$ = !0, we.finalized = !0, De.litElementHydrateSupport?.({ LitElement: we });
const Js = De.litElementPolyfillSupport;
Js?.({ LitElement: we });
(De.litElementVersions ?? (De.litElementVersions = [])).push("4.2.2");
const ei = (i) => Object.is(i, -0) ? 0 : i, ti = (i) => Math.min(Math.max(Math.round(i), 0), 4), ri = (i, e, t, r) => {
  const s = Number(i);
  if (!Number.isFinite(s))
    return null;
  const o = ti(t), n = new Intl.NumberFormat(e, {
    minimumFractionDigits: o,
    maximumFractionDigits: o
  }).format(ei(s)), a = r?.trim();
  return a ? `${n} ${a}` : n;
}, si = "sensor.power_production_now", ii = "sensor.energy_production_today", oi = {
  power: si,
  energy: ii
}, Qe = (i) => oi[i], ni = (i, e) => {
  const t = Qe(e);
  return i?.states?.[t] ? t : null;
}, ai = 1100, li = 900, Vt = 900, pi = 6e3, ci = 5e3, di = 16e3, _t = /* @__PURE__ */ new Set(["deviation", "inverter", "error"]);
class hi {
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
    const r = this._snapshot;
    if (this._flags = e, this._snapshot = t, !e.enabled || this._reducedMotion) {
      this._clearAllMotion(), this._refreshFlowPulseLoop(t);
      return;
    }
    e.updateShimmer && r && this._triggerKpiShimmers(r, t), e.alertRipple && r && this._triggerAlertRipples(r, t), this._syncAlertRippleLoops(t), this._refreshFlowPulseLoop(t);
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
    e && (!this._flags.enabled || !this._flags.powerFlow || this._reducedMotion || e.popupOpen || e.totalPower <= 0 || this._armTransient("power", this._kpiShimmers, li, "kpi-shimmer"));
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
    const s = t.join("|"), o = this._flowPulsePanelOrder.join("|");
    s !== o && (this._flowPulsePanelOrder = t, this._flowPulseIndex = 0, this._clearTimeoutByKey("flow-pulse-step"), this._clearTimeoutByKey("flow-pulse-timeout"), this._flowPulsePanelId !== null && (this._flowPulsePanelId = null, this._notify())), !(this._timers.has("flow-pulse-step") || this._timers.has("flow-pulse-timeout") || this._flowPulsePanelId !== null) && this._triggerNextFlowPulse();
  }
  _canRunFlowPulse(e, t) {
    const r = typeof document < "u" ? document.hidden : !1;
    return !!(this._flags.enabled && this._flags.powerFlow && !this._reducedMotion && !r && e && e.totalPower > 0 && !e.popupOpen && t > 0);
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
    }, di);
    this._timers.set("flow-pulse-timeout", t);
  }
  _scheduleNextFlowPulse() {
    this._clearTimeoutByKey("flow-pulse-step");
    const e = window.setTimeout(() => {
      this._timers.delete("flow-pulse-step"), this._triggerNextFlowPulse();
    }, ci);
    this._timers.set("flow-pulse-step", e);
  }
  _finalizeActiveFlowPulse(e) {
    this._flowPulsePanelId === e && (this._clearTimeoutByKey("flow-pulse-timeout"), this._flowPulsePanelId = null, this._notify(), this.triggerPowerImpactFromPulse(), this._scheduleNextFlowPulse());
  }
  _clearFlowPulseLoop() {
    this._clearTimeoutByKey("flow-pulse-step"), this._clearTimeoutByKey("flow-pulse-timeout"), this._flowPulsePanelOrder = [], this._flowPulseIndex = 0, this._flowPulsePanelId !== null && (this._flowPulsePanelId = null, this._notify());
  }
  _triggerKpiShimmers(e, t) {
    e.energyKpiValue !== t.energyKpiValue && this._armTransient("energy", this._kpiShimmers, ai, "kpi-shimmer");
  }
  _triggerAlertRipples(e, t) {
    for (const [r, s] of Object.entries(t.panelStatuses)) {
      const o = e.panelStatuses[r];
      s !== o && _t.has(s) && this._armTransient(r, this._alertRipples, Vt, "alert-ripple");
    }
  }
  _syncAlertRippleLoops(e) {
    if (!this._flags.alertRipple) {
      for (const r of [...this._timers.keys()])
        r.startsWith("alert-ripple-loop:") && this._clearTimeoutByKey(r);
      return;
    }
    const t = new Set(
      Object.entries(e.panelStatuses).filter(([, r]) => _t.has(r)).map(([r]) => r)
    );
    for (const r of t) {
      const s = this._alertRippleLoopKey(r);
      this._timers.has(s) || this._armAlertRippleLoop(r);
    }
    for (const r of [...this._timers.keys()]) {
      if (!r.startsWith("alert-ripple-loop:"))
        continue;
      const s = r.slice(18);
      t.has(s) || this._clearTimeoutByKey(r);
    }
  }
  _armAlertRippleLoop(e) {
    const t = this._alertRippleLoopKey(e);
    this._clearTimeoutByKey(t);
    const r = window.setTimeout(() => {
      if (!this._canRepeatAlertRipple(e)) {
        this._clearTimeoutByKey(t);
        return;
      }
      this._armTransient(e, this._alertRipples, Vt, "alert-ripple"), this._armAlertRippleLoop(e);
    }, pi);
    this._timers.set(t, r);
  }
  _canRepeatAlertRipple(e) {
    const t = this._snapshot;
    if (!t || !this._flags.enabled || !this._flags.alertRipple || this._reducedMotion)
      return !1;
    const r = t.panelStatuses[e];
    return _t.has(r);
  }
  _alertRippleLoopKey(e) {
    return `alert-ripple-loop:${e}`;
  }
  _armTransient(e, t, r, s) {
    t.add(e), this._notify();
    const o = `${s}:${e}`;
    this._clearTimeoutByKey(o);
    const n = window.setTimeout(() => {
      t.delete(e), this._timers.delete(o), this._notify();
    }, r);
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
const Y = (i, e, t) => Math.max(e, Math.min(t, i)), jt = (i, e) => Math.abs(i - e) < 0.01, ui = (i, e) => Math.hypot(e.x - i.x, e.y - i.y), _i = (i, e) => ({
  x: i.left - e.left + i.width / 2,
  y: i.top - e.top + i.height / 2
}), Te = "rgba(224, 232, 242, 1)", mi = 8, Yt = 28, Ye = 14, fi = (i) => {
  const e = [];
  for (const t of i) {
    const r = e[e.length - 1];
    r && jt(r.x, t.x) && jt(r.y, t.y) || e.push(t);
  }
  return e;
}, qt = (i) => {
  const e = fi(i);
  if (e.length < 2)
    return { d: "", length: 0 };
  let t = `M ${e[0].x.toFixed(2)} ${e[0].y.toFixed(2)}`, r = 0;
  for (let s = 1; s < e.length; s += 1) {
    const o = e[s - 1], n = e[s];
    t += ` L ${n.x.toFixed(2)} ${n.y.toFixed(2)}`, r += ui(o, n);
  }
  return { d: t, length: r };
}, gi = (i, e, t, r) => {
  const s = t - e;
  if (!Number.isFinite(i) || !Number.isFinite(e) || !Number.isFinite(t) || !Number.isFinite(r) || i <= 0 || s <= 0)
    return !1;
  const o = e + s * 0.28, n = i * 0.36;
  return r >= Math.max(o, n) && r <= t;
}, yi = (i, e, t = !1, r = { x: 0, y: 0 }) => {
  const s = _i(e, i), o = e.left - i.left, n = e.bottom - i.top;
  return {
    entry: {
      x: (t ? s.x : o - 0.5) + r.x,
      y: (t ? n + 0.5 : s.y) + r.y
    }
  };
}, vi = (i) => {
  const e = i.left + (i.right - i.left) * 0.22;
  return Y(i.statusCenterX || e, i.left + 10, i.right - 10);
}, bi = (i) => {
  if (i.length === 0)
    return [];
  const e = i.reduce((a, l) => a + Math.max(1, l.bottom - l.top), 0) / i.length, t = Y(e * 0.32, 6, 28), r = [], s = [], o = new Array(i.length).fill(0), n = i.map((a, l) => ({ item: a, index: l })).sort((a, l) => a.item.top - l.item.top || a.item.left - l.item.left);
  for (const { item: a, index: l } of n) {
    const c = a.top + (a.bottom - a.top) / 2;
    let p = r.findIndex((d) => Math.abs(d - c) <= t);
    p < 0 ? (p = r.length, r.push(c), s.push(1)) : (s[p] += 1, r[p] = r[p] + (c - r[p]) / s[p]), o[l] = p;
  }
  return o;
}, wi = (i, e, t, r, s = Math.min(...i.map((n) => n.left)), o = "left-collector") => {
  const n = [], a = [], l = [], c = [], p = (m, w, k) => {
    const T = qt(w);
    T.d && a.push({
      id: m,
      d: T.d,
      color: Te,
      opacity: k,
      delayMs: 0,
      durationMs: 1200,
      travelPx: Math.max(24, T.length)
    });
  }, d = (m) => {
    l.some((k) => {
      const T = k.cx - m.cx, F = k.cy - m.cy;
      return Math.hypot(T, F) < Math.max(k.r, m.r) * 0.9;
    }) || l.push(m);
  }, h = /* @__PURE__ */ new Map();
  for (const m of i) {
    const w = h.get(m.row) ?? [];
    w.push(m), h.set(m.row, w);
  }
  const u = [...h.entries()].sort((m, w) => m[0] - w[0]).map(([m, w]) => ({
    row: m,
    busY: 0,
    minTop: Math.min(...w.map((k) => k.top)),
    maxBottom: Math.max(...w.map((k) => k.bottom))
  }));
  if (u.length === 0)
    return { flowPaths: n, topologyPaths: a, topologyNodes: l, collectorX: Ye, rowBuses: c };
  const f = Math.max(0, Math.min(s, ...i.map((m) => m.left))), g = Math.max(6, Ye * 0.5), P = Math.max(g, f - 8), S = Y(
    f / 2,
    g,
    Math.min(P, Math.max(Ye, r - Ye))
  ), x = e.y + 8;
  for (let m = 0; m < u.length; m += 1) {
    const w = u[m], k = u[m - 1], T = w.minTop - 12, F = m === 0 ? x : Math.max(k.maxBottom + 8, k.busY + 8), O = w.minTop - 6;
    w.busY = O > F ? Y(T, F, O) : Math.max(x, w.minTop - 6);
  }
  const I = Y(0.24 / Math.sqrt(Math.max(u.length, 1)), 0.15, 0.22), A = Y(0.24 / Math.sqrt(Math.max(i.length, 1)), 0.09, 0.16);
  d({
    id: "power-socket-node",
    cx: e.x,
    cy: e.y,
    r: Y(t * 0.18, 2.8, 4.8),
    color: Te,
    opacity: 0.36
  });
  const $ = u[0], E = Math.max(...u.map((m) => m.busY)), D = o === "direct-first-row", R = u.length > 1;
  D ? (p(
    "power-drop-rail",
    [
      e,
      { x: e.x, y: $.busY }
    ],
    I
  ), d({
    id: "power-drop-node",
    cx: e.x,
    cy: $.busY,
    r: Y(t * 0.18, 2.8, 4.8),
    color: Te,
    opacity: 0.36
  }), R && p(
    "collector-rail",
    [
      { x: S, y: $.busY },
      { x: S, y: E }
    ],
    I
  )) : (p(
    "collector-rail",
    [
      { x: S, y: e.y },
      { x: S, y: E }
    ],
    I
  ), p(
    "power-entry-rail",
    [
      { x: S, y: e.y },
      e
    ],
    I
  ));
  for (const m of u) {
    const w = h.get(m.row) ?? [];
    if (w.length === 0)
      continue;
    const k = w.map((v) => v.anchorX), T = m.row === $.row, F = D && T ? [e.x, ...k, ...R ? [S] : []] : [S, ...k], O = Math.min(...F), ee = Math.max(...F);
    c.push({
      row: m.row,
      y: m.busY,
      startX: O,
      endX: ee
    }), p(
      `row-rail-${m.row}`,
      [
        { x: O, y: m.busY },
        { x: ee, y: m.busY }
      ],
      I
    ), (!D || !T || R) && d({
      id: `row-node-${m.row}`,
      cx: S,
      cy: m.busY,
      r: Y(t * 0.2, 2.8, 4.8),
      color: Te,
      opacity: 0.32
    });
    for (const v of w) {
      const C = D && T ? [
        { x: v.anchorX, y: v.anchorY },
        { x: v.anchorX, y: m.busY },
        { x: e.x, y: m.busY },
        e
      ] : D ? [
        { x: v.anchorX, y: v.anchorY },
        { x: v.anchorX, y: m.busY },
        { x: S, y: m.busY },
        { x: S, y: $.busY },
        { x: e.x, y: $.busY },
        e
      ] : [
        { x: v.anchorX, y: v.anchorY },
        { x: v.anchorX, y: m.busY },
        { x: S, y: m.busY },
        { x: S, y: e.y },
        e
      ], U = qt(
        C
      );
      if (p(
        `tap-rail-${v.id}`,
        [
          { x: v.anchorX, y: v.anchorY },
          { x: v.anchorX, y: m.busY }
        ],
        A
      ), d({
        id: `tap-node-${v.id}`,
        cx: v.anchorX,
        cy: m.busY,
        r: Y(t * 0.18, 2.6, 4.4),
        color: Te,
        opacity: 0.3
      }), !v.producing || !U.d)
        continue;
      const K = Math.max(Yt, U.length), te = K + Yt;
      n.push({
        id: `flow-${v.id}`,
        panelId: v.id,
        d: U.d,
        color: v.accentColor,
        opacity: 0.62 + Math.min(v.intensity, 1) * 0.2,
        delayMs: 0,
        durationMs: Math.round(te * mi),
        travelPx: K,
        offsetPx: -te
      });
    }
  }
  return { flowPaths: n, topologyPaths: a, topologyNodes: l, collectorX: S, rowBuses: c };
}, xi = (i, e, t, r, s, o, n) => {
  const a = i.map((c) => ({
    id: c.panel.id,
    row: c.row,
    anchorX: vi(c),
    anchorY: c.top + 1.5,
    left: c.left,
    right: c.right,
    top: c.top,
    bottom: c.bottom,
    accentColor: c.panel.accentColor,
    intensity: c.panel.intensity,
    producing: e.has(c.panel.id)
  })), l = wi(
    a,
    t.entry,
    r,
    s,
    o,
    n
  );
  return {
    flowPaths: l.flowPaths,
    topologyPaths: l.topologyPaths,
    topologyNodes: l.topologyNodes
  };
}, Pi = (i, e, t, r) => {
  const s = e.querySelector("ha-card");
  if (!s)
    return null;
  const o = s.getBoundingClientRect();
  if (o.width <= 0 || o.height <= 0)
    return null;
  const n = {
    x: s.scrollLeft,
    y: s.scrollTop
  }, a = e.querySelector('[data-kpi="power"]');
  if (!a)
    return null;
  const l = r.panels.map((m) => e.querySelector(`[data-panel-id="${m.id}"]`)).filter((m) => !!m).map((m) => {
    const w = m.getBoundingClientRect();
    return {
      left: w.left - o.left + n.x,
      right: w.right - o.left + n.x,
      top: w.top - o.top + n.y,
      bottom: w.bottom - o.top + n.y
    };
  }).filter((m) => Number.isFinite(m.left) && Number.isFinite(m.right)), c = l.length > 0 ? Math.min(...l.map((m) => m.left)) : 0, p = l.length > 0 ? Math.max(...l.map((m) => m.right)) : o.width, d = r.panels.filter(
    (m) => !m.hiddenSlot && m.enabled && !!m.powerEntityName
  );
  if (d.length === 0)
    return null;
  const h = new Set(
    d.filter((m) => typeof m.power == "number" && m.power > 0).map((m) => m.id)
  ), u = d.map((m) => ({
    panel: m,
    element: e.querySelector(`[data-panel-id="${m.id}"]`)
  })).filter(
    (m) => !!m.element
  ).map((m) => {
    const w = m.element.getBoundingClientRect(), k = {
      x: w.left - o.left + n.x + w.width / 2,
      y: w.top - o.top + n.y + w.height / 2
    }, F = m.element.querySelector(".status")?.getBoundingClientRect(), O = F && F.width > 0 ? F.left - o.left + n.x + F.width * 0.33 : k.x;
    return {
      panel: m.panel,
      row: 0,
      center: k,
      statusCenterX: O,
      left: w.left - o.left + n.x,
      right: w.right - o.left + n.x,
      top: w.top - o.top + n.y,
      bottom: w.bottom - o.top + n.y
    };
  }), f = bi(u), g = u.map((m, w) => ({
    ...m,
    row: f[w] ?? 0
  }));
  if (g.length === 0)
    return null;
  const P = g.reduce((m, w) => {
    const k = w.right - w.left, T = w.bottom - w.top;
    return m + Math.min(k, T);
  }, 0) / g.length, S = Y(Math.round(P * 0.2), 18, 34), x = a.getBoundingClientRect(), I = x.left - o.left + n.x + x.width / 2, A = gi(
    o.width,
    c,
    p,
    I
  ), $ = yi(
    o,
    x,
    A,
    n
  ), { flowPaths: E, topologyPaths: D, topologyNodes: R } = xi(
    g,
    h,
    $,
    S,
    o.width,
    c,
    A ? "direct-first-row" : "left-collector"
  );
  return {
    width: Math.max(
      s.clientWidth,
      o.width,
      p,
      $.entry.x
    ),
    height: Math.max(
      s.clientHeight,
      ...g.map((m) => m.bottom),
      $.entry.y
    ),
    flowPaths: E,
    topologyPaths: D,
    topologyNodes: R
  };
}, $i = (i, e) => {
  if (!i || i.flowPaths.length === 0 && i.topologyPaths.length === 0)
    return b;
  const t = i.flowPaths.filter(
    (r) => e.showFlow && e.activeFlowPanelId !== null && r.panelId === e.activeFlowPanelId
  );
  return y`
    <svg
      class="spv-motion-overlay-svg"
      viewBox=${`0 0 ${i.width} ${i.height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      ${e.showTopology ? i.topologyPaths.map(
    (r) => z`<path
              class="spv-motion-backbone"
              d=${r.d}
              style=${`--spv-motion-color:${r.color}; --spv-motion-opacity:${r.opacity};`}
            ></path>`
  ) : b}

      ${e.showTopology ? i.topologyNodes.map(
    (r) => z`<circle
              class="spv-motion-node"
              cx=${r.cx}
              cy=${r.cy}
              r=${r.r}
              style=${`--spv-motion-color:${r.color}; --spv-motion-opacity:${r.opacity};`}
            ></circle>`
  ) : b}

      ${t.map(
    (r) => z`<path
          class="spv-motion-flow"
          d=${r.d}
          style=${`--spv-motion-color:${r.color}; --spv-motion-opacity:${r.opacity}; --spv-flow-duration:${r.durationMs}ms; --spv-flow-delay:${r.delayMs}ms; --spv-flow-travel:${r.travelPx}px; --spv-flow-offset:${r.offsetPx ?? -r.travelPx}px;`}
        ></path>`
  )}
    </svg>
  `;
}, Si = Ct`
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
`, Ci = new Intl.Collator("en", {
  numeric: !0,
  sensitivity: "base"
}), q = (i, e) => {
  const t = Ci.compare(i, e);
  return t !== 0 ? t : i === e ? 0 : i < e ? -1 : 1;
}, Xr = 1.2, Ei = /* @__PURE__ */ new Set(["unknown", "unavailable", "none", "null", ""]), se = (i, e = 0, t = 1) => Math.min(Math.max(i, e), t), ye = (i) => {
  if (!i)
    return null;
  const e = i.state?.toString().trim().toLowerCase();
  if (Ei.has(e))
    return null;
  const t = Number(i.state);
  return Number.isFinite(t) ? t : null;
}, ki = (i) => {
  if (i == null)
    return;
  const e = i.toString().replace(/[\u200B-\u200D\uFEFF]/g, "").replace(/\s+/g, " ").trim();
  return e.length > 0 ? e : void 0;
}, Xt = (i) => i.toLowerCase().match(/[a-z0-9]+/g) ?? [], Qt = (i, e) => {
  const t = Xt(i);
  return t.length === 0 ? !1 : e.some((r) => {
    const s = Xt(r);
    if (s.length === 0 || s.length > t.length)
      return !1;
    for (let o = 0; o <= t.length - s.length; o += 1) {
      let n = !0;
      for (let a = 0; a < s.length; a += 1)
        if (t[o + a] !== s[a]) {
          n = !1;
          break;
        }
      if (n)
        return !0;
    }
    return !1;
  });
}, Fe = (i, e) => {
  const t = i?.attributes?.friendly_name;
  return typeof t == "string" && t.trim().length > 0 ? t : e;
}, Zt = (i, e, t, r, s = "en") => {
  if (i === null)
    return r;
  const o = Object.is(i, -0) ? 0 : i, n = new Intl.NumberFormat(s, {
    minimumFractionDigits: t,
    maximumFractionDigits: t
  }).format(o);
  return e ? `${n} ${e}` : n;
}, Jt = (i) => {
  const e = i.replace("#", ""), t = e.length === 3 ? e.split("").map((r) => `${r}${r}`).join("") : e;
  return [
    parseInt(t.slice(0, 2), 16),
    parseInt(t.slice(2, 4), 16),
    parseInt(t.slice(4, 6), 16)
  ];
}, er = (i, e, t) => {
  const r = se(t), [s, o, n] = Jt(i), [a, l, c] = Jt(e), p = (d, h) => Math.round(d + (h - d) * r);
  return `rgb(${p(s, a)}, ${p(o, l)}, ${p(n, c)})`;
}, Ii = (i, e, t, r) => {
  const s = se(r);
  return s <= 0.5 ? er(i, e, s * 2) : er(e, t, (s - 0.5) * 2);
}, Ti = (i) => {
  if (i.length === 0)
    return 0;
  const e = [...i].sort((o, n) => o - n), t = Math.floor(e.length * 0.4), r = e.slice(t), s = r.reduce((o, n) => o + n, 0) / Math.max(r.length, 1);
  return se(s, 0, Xr);
}, Fi = (i, e, t) => {
  if (t <= 0)
    return i;
  const r = e - t * 60 * 1e3;
  return i.filter((s) => s.ts >= r);
}, Mi = (i) => {
  if (i.length < 2)
    return 1;
  const e = [];
  for (let r = 1; r < i.length; r += 1) {
    const s = (i[r].ts - i[r - 1].ts) / 6e4;
    Number.isFinite(s) && s > 0 && e.push(s);
  }
  if (e.length === 0)
    return 1;
  e.sort((r, s) => r - s);
  const t = Math.floor(e.length / 2);
  return e.length % 2 === 0 ? (e[t - 1] + e[t]) / 2 : e[t];
}, Ai = (i, e, t, r) => {
  if (!e || e.length === 0)
    return {
      value: i,
      sampleCount: 1,
      firstSampleTs: t
    };
  const s = e.filter((p) => Number.isFinite(p.value)).sort((p, d) => p.ts - d.ts);
  if (s.length === 0)
    return {
      value: i,
      sampleCount: 1,
      firstSampleTs: t
    };
  const o = Fi(s, t, r), n = Mi(s), a = r > 0 ? Math.max(2, Math.ceil(r / Math.max(n, 0.1)) + 1) : 1;
  let l = o.length > 0 ? o : s;
  return r > 0 && l.length < a && s.length > l.length && (l = s.slice(-a)), {
    value: l.reduce((p, d) => p + d.value, 0) / Math.max(l.length, 1),
    sampleCount: l.length,
    firstSampleTs: s[0].ts ?? null
  };
}, ve = (i, e, t) => {
  const r = e?.locale?.language ?? "en", s = (_, N) => tt(r, _, N), o = s("common.unavailable"), n = t?.nowMs ?? Date.now(), a = { ...Pt, ...i.colors ?? {} }, l = i.enable_inverter_status ?? !1, c = (i.inverter_fault_terms ?? []).map((_) => _.trim().toLowerCase()).filter((_) => _.length > 0), p = (i.inverter_working_terms ?? []).map((_) => _.trim().toLowerCase()).filter((_) => _.length > 0), d = i.production_color_intensity ?? 1, h = t?.deviationEnabled ?? !0, u = i.deviation_min_active_panels ?? 3, f = i.deviation_min_samples ?? 3, g = i.deviation_min_runtime_minutes ?? 15, P = i.deviation_smoothing_minutes ?? 0, S = i.deviation_dynamic_floor_w ?? 20, x = i.deviation_threshold_percent ?? 15, I = i.deviation_absolute_w_threshold ?? 50, A = t?.historyByEntityId ?? {}, $ = i.panels.map((_, N) => {
    const fe = _.enabled ?? !0, V = _.name ?? `Panel ${N + 1}`, X = _.inverter_status_entity ?? _.error_entity, M = X ? e?.states?.[X] : void 0, L = X ? ki(M?.state) ?? o : void 0, G = Fe(
      M,
      X
    ), Q = L !== void 0 && L !== o && Qt(L, c), Z = L !== void 0 && L !== o && Qt(L, p);
    if (!fe)
      return {
        config: _,
        slotIndex: N,
        label: V,
        power: null,
        energy: null,
        inverterStatusEntityName: G,
        inverterStatusDisplay: L,
        inverterFaultMatched: Q,
        inverterWorkingMatched: Z,
        reason: s("state.reason.slot_hidden"),
        status: "disabled",
        enabled: !1,
        hiddenSlot: !0
      };
    if (!_.power_entity)
      return {
        config: _,
        slotIndex: N,
        label: V,
        power: null,
        energy: null,
        inverterStatusEntityName: G,
        inverterStatusDisplay: L,
        inverterFaultMatched: Q,
        inverterWorkingMatched: Z,
        reason: s("state.reason.select_power_sensor"),
        status: "unconfigured",
        enabled: !0,
        hiddenSlot: !1
      };
    const J = e?.states?.[_.power_entity], ge = _.energy_entity ? e?.states?.[_.energy_entity] : void 0;
    if (!J)
      return {
        config: _,
        slotIndex: N,
        label: V,
        power: null,
        energy: null,
        inverterStatusEntityName: G,
        inverterStatusDisplay: L,
        inverterFaultMatched: Q,
        inverterWorkingMatched: Z,
        reason: s("state.reason.power_entity_missing", {
          entity: _.power_entity
        }),
        status: "offline",
        enabled: !0,
        hiddenSlot: !1
      };
    if (l && L && L !== o && Q)
      return {
        config: _,
        slotIndex: N,
        label: V,
        power: ye(J),
        energy: ye(ge),
        powerEntityName: Fe(J, _.power_entity),
        inverterStatusEntityName: G,
        inverterStatusDisplay: L,
        inverterFaultMatched: Q,
        inverterWorkingMatched: Z,
        reason: s("state.reason.inverter_fault_match", {
          status: L
        }),
        status: "error",
        enabled: !0,
        hiddenSlot: !1
      };
    if (l && L && L !== o && p.length > 0 && !Z)
      return {
        config: _,
        slotIndex: N,
        label: V,
        power: ye(J),
        energy: ye(ge),
        powerEntityName: Fe(J, _.power_entity),
        inverterStatusEntityName: G,
        inverterStatusDisplay: L,
        inverterFaultMatched: Q,
        inverterWorkingMatched: Z,
        reason: s("state.reason.inverter_working_mismatch", {
          status: L
        }),
        status: "inverter",
        enabled: !0,
        hiddenSlot: !1
      };
    const Ve = ye(J), je = ye(ge);
    return Ve === null ? {
      config: _,
      slotIndex: N,
      label: V,
      power: null,
      energy: je,
      powerEntityName: Fe(J, _.power_entity),
      inverterStatusEntityName: G,
      inverterStatusDisplay: L,
      inverterFaultMatched: Q,
      inverterWorkingMatched: Z,
      reason: s("state.reason.power_entity_unavailable", {
        entity: _.power_entity
      }),
      status: "offline",
      enabled: !0,
      hiddenSlot: !1
    } : {
      config: _,
      slotIndex: N,
      label: V,
      power: Ve,
      energy: je,
      powerEntityName: Fe(J, _.power_entity),
      inverterStatusEntityName: G,
      inverterStatusDisplay: L,
      inverterFaultMatched: Q,
      inverterWorkingMatched: Z,
      reason: s("state.reason.producing_expected"),
      status: "normal",
      enabled: !0,
      hiddenSlot: !1
    };
  }), D = $.filter(
    (_) => _.status === "normal" && _.power !== null
  ).map((_) => _.power ?? 0), R = D.length > 0 ? Math.max(...D) : 0;
  let m = 0, w = 0, k = 0, T = 0, F = 0, O = 0, ee = 0, v, C = !1;
  const U = $.filter((_) => _.status === "normal" && _.power !== null).flatMap((_) => {
    const N = _.config.rated_power_w ?? i.default_panel_rated_power_w ?? null;
    if (N === null || N <= 0 || !_.config.power_entity)
      return [];
    const fe = Math.min(
      Math.max(_.config.deviation_derate_percent ?? 100, 1),
      100
    ), V = N * (fe / 100);
    if (V <= 0)
      return [];
    const X = Ai(
      _.power,
      A[_.config.power_entity],
      n,
      P
    );
    return [
      {
        id: _.config.id,
        effectivePower: X.value,
        livePower: _.power,
        ratedPowerW: N,
        ratedForDeviationW: V,
        isDerated: fe < 100,
        sampleCount: X.sampleCount,
        firstSampleTs: X.firstSampleTs
      }
    ];
  }), K = U.filter((_) => !_.isDerated), te = K.length > 0 ? Math.min(...K.map((_) => _.sampleCount)) : 0, _e = K.length > 0 ? Math.min(
    ...K.map(
      (_) => _.firstSampleTs === null ? 0 : (n - _.firstSampleTs) / 6e4
    )
  ) : 0;
  h ? K.length < u ? v = s("state.reason.need_non_derated_panels", {
    count: u
  }) : te < f ? v = s("state.reason.collecting_samples", {
    current: te,
    required: f
  }) : _e < g ? v = s("state.reason.warmup_progress", {
    current: Math.floor(_e),
    required: g
  }) : C = !0 : v = s("state.reason.array_check_disabled");
  const Se = K.map(
    (_) => se(_.effectivePower / _.ratedForDeviationW, 0, Xr)
  ), Ce = Ti(Se);
  C && Math.max(
    ...K.map(
      (N) => N.ratedForDeviationW * Ce
    ),
    0
  ) < S && (C = !1, v = s("state.reason.low_light_pause", {
    floor: S.toFixed(0)
  }));
  const me = $.map((_) => {
    const N = (_.config.power_entity ? e?.states?.[_.config.power_entity]?.attributes?.unit_of_measurement : void 0) ?? s("state.power.default_unit"), fe = _.config.energy_entity ? e?.states?.[_.config.energy_entity]?.attributes?.unit_of_measurement : void 0, V = !!_.config.energy_entity, X = _.config.show_energy ?? !1;
    let M = _.status, L = null;
    const G = _.config.rated_power_w ?? i.default_panel_rated_power_w ?? null, Q = G !== null && _.power !== null && G > 0 ? se(_.power / G * 100, 0, 999) : null;
    if (M === "normal" && G === null && (_.reason = s("state.reason.rated_not_configured")), C && M === "normal" && G !== null && _.power !== null) {
      const dt = U.find(
        (ke) => ke.id === _.config.id
      );
      if (dt) {
        const ke = dt.ratedForDeviationW * Ce, ht = Math.max(ke - dt.effectivePower, 0), It = ke > 0 ? ht / ke * 100 : 0;
        It >= x && ht >= I ? (M = "deviation", L = se(It, 0, 100), _.reason = s("state.reason.output_below_target", {
          percent: L.toFixed(0),
          shortfall: ht.toFixed(0)
        })) : _.reason = s("state.reason.producing_adjusted");
      }
    } else M === "normal" && v && (_.reason = v);
    M === "error" && (k += 1), M === "inverter" && (w += 1), M === "deviation" && (m += 1), M === "offline" && (T += 1), M === "normal" && (F += 1), M === "unconfigured" && (O += 1), M === "disabled" && (ee += 1);
    const Z = G !== null && G > 0 && _.power !== null ? _.power / G : null, J = _.power !== null && R > 0 ? _.power / R : 0, ge = se(Z ?? J, 0, 1), Ve = se((d - 0.2) / 1.4, 0, 1), je = se(
      (0.1 + Ve * 0.9) * (0.15 + ge * 0.85),
      0.06,
      1
    ), ps = M === "deviation" || M === "error" || M === "inverter" ? 1 : je, cs = M === "normal" && _.power !== null && _.power <= 0, ds = M === "error" || M === "inverter" ? a.error : cs || M === "offline" || M === "unconfigured" || M === "disabled" ? a.unavailable : M === "deviation" ? a.deviation : Ii(
      a.production_start,
      a.production_mid,
      a.production_end,
      ge
    );
    return {
      id: _.config.id,
      slotIndex: _.slotIndex,
      label: _.label,
      status: M,
      power: _.power,
      powerDisplay: M === "disabled" ? s("state.status_display.disabled") : M === "unconfigured" ? s("state.status_display.not_configured") : Zt(
        _.power,
        N,
        i.power_decimals ?? 0,
        o,
        r
      ),
      energy: _.energy,
      energyDisplay: _.hiddenSlot || !V || !X ? void 0 : _.energy !== null ? Zt(
        _.energy,
        fe ?? s("state.energy.default_unit"),
        i.energy_decimals ?? 2,
        o,
        r
      ) : o,
      powerEntityName: _.powerEntityName,
      inverterStatusEntityName: _.inverterStatusEntityName,
      inverterStatusDisplay: _.inverterStatusDisplay,
      inverterFaultMatched: _.inverterFaultMatched,
      inverterWorkingMatched: _.inverterWorkingMatched,
      deviationPercent: L,
      reason: _.reason,
      accentColor: ds,
      intensity: ps,
      enabled: _.enabled,
      hiddenSlot: _.hiddenSlot,
      ratedPowerW: G,
      performancePercent: Q
    };
  }), Ke = me.reduce((_, N) => _ + (N.power ?? 0), 0), Ee = me.map((_) => _.energy).filter((_) => _ !== null), B = Ee.length > 0 ? Ee.reduce((_, N) => _ + N, 0) : null;
  return {
    panels: me,
    totalPower: Ke,
    totalEnergy: B,
    maxPower: R,
    deviationCount: m,
    inverterCount: w,
    errorCount: k,
    offlineCount: T,
    normalCount: F,
    unconfiguredCount: O,
    disabledCount: ee,
    deviationReady: C,
    deviationSuppressedReason: v
  };
}, tr = (i, e = 0) => Math.max(36, i - 36 - Math.max(0, e)), Ri = ({
  candidates: i,
  panelWidthPx: e,
  panelHeightPx: t,
  fontPx: r,
  reservedRightPx: s = 0,
  measureTextWidthPx: o
}) => {
  const n = i.find((d) => d.variant === "compact");
  if (!n)
    throw new Error("Panel performance label requires a compact candidate.");
  if (t < 96 || e < 112)
    return n;
  const a = i.find((d) => d.variant === "full"), l = tr(e, s);
  if (a && o(a.text, r) <= l)
    return a;
  const c = tr(e), p = i.find((d) => d.variant === "medium");
  return p && o(p.text, r) <= c ? p : n;
}, kt = (i) => Number.isFinite(i.ts) && Number.isFinite(i.value), Ni = 1e-4, Li = (i) => i === 1 ? 6e4 : i === 6 ? 3 * 6e4 : i === 24 ? 10 * 6e4 : 5 * 6e4, Ze = (i, e, t) => {
  const r = e - t * 60 * 60 * 1e3;
  return i.filter(kt).filter((s) => s.ts >= r && s.ts <= e).sort((s, o) => s.ts - o.ts);
}, Qr = (i, e) => {
  if (i.length < 2)
    return [...i].sort((p, d) => p.ts - d.ts);
  const t = e?.zeroTolerance ?? Ni, r = [...i].filter(kt).sort((p, d) => p.ts - d.ts);
  if (r.length < 2)
    return r;
  const s = r.slice(1).map((p, d) => p.ts - r[d].ts).filter((p) => Number.isFinite(p) && p > 0).sort((p, d) => p - d), o = s.length > 0 ? s[Math.floor(s.length / 2)] : Number.NaN, n = Li(e?.rangeHours), a = Math.min(
    Math.max(
      Number.isFinite(e?.stepMs) ? e?.stepMs : Number.isFinite(o) ? o : n,
      3e4
    ),
    n * 2
  ), l = a * 2, c = [r[0]];
  for (let p = 1; p < r.length; p += 1) {
    const d = r[p - 1], h = r[p], u = h.ts - d.ts, f = Math.abs(d.value) <= t, g = h.value > t;
    if (f && g && u >= l) {
      const P = Math.max(d.ts + 1, h.ts - a);
      P > d.ts && P < h.ts && c.push({ ts: P, value: 0 });
    }
    c.push(h);
  }
  return c.filter(
    (p, d, h) => d === 0 ? !0 : p.ts !== h[d - 1].ts || p.value !== h[d - 1].value
  );
}, vt = (i, e) => {
  if (i.length <= e || e <= 2)
    return [...i];
  const t = i[0], r = i[i.length - 1], s = i.slice(1, i.length - 1), o = e - 2, n = s.length / o, a = [t];
  let l = -1;
  for (let c = 0; c < o; c += 1) {
    const p = Math.min(
      s.length - 1,
      Math.floor(c * n)
    );
    p !== l && (l = p, a.push(s[p]));
  }
  return a.push(r), a.sort((c, p) => c.ts - p.ts).filter(
    (c, p, d) => p === 0 ? !0 : c.ts !== d[p - 1].ts || c.value !== d[p - 1].value
  ).slice(0, e);
}, Di = (i) => {
  const e = i.map(
    (n) => [...n].filter(kt).sort((a, l) => a.ts - l.ts).filter(
      (a, l, c) => l === c.length - 1 ? !0 : a.ts !== c[l + 1].ts
    )
  ).filter((n) => n.length > 0);
  if (e.length === 0)
    return [];
  const t = [
    ...new Set(e.flatMap((n) => n.map((a) => a.ts)))
  ].sort((n, a) => n - a), r = e.map(() => 0), s = e.map(() => null), o = [];
  for (const n of t) {
    let a = 0;
    for (let c = 0; c < e.length; c += 1) {
      const p = e[c];
      for (; r[c] < p.length && p[r[c]].ts <= n; )
        s[c] = p[r[c]].value, r[c] += 1;
      s[c] !== null && (a += 1);
    }
    if (a === 0)
      continue;
    const l = s.reduce(
      (c, p) => c + (p ?? 0),
      0
    );
    o.push({
      ts: n,
      value: Object.is(l, -0) ? 0 : l
    });
  }
  return o;
}, rr = (i) => Number.isFinite(i.ts) && Number.isFinite(i.value), Oi = (i) => i.map(
  (e, t) => `${t === 0 ? "M" : "L"}${e.x.toFixed(2)},${e.y.toFixed(2)}`
).join(" "), Gi = (i, e, t, r, s = 320, o = 132, n = 10) => {
  const a = t * 60 * 60 * 1e3, l = e - a, c = e, p = Math.max(c - l, 1), d = Math.max(s - n * 2, 1), h = Math.max(o - n * 2, 1), u = i.map(($) => {
    const E = Ze($.samples, e, t).filter(rr), D = E.length === 1 ? [
      { ts: l, value: E[0].value },
      { ts: c, value: E[0].value }
    ] : E, R = Qr(D, { rangeHours: t }), m = vt(R, r).filter(rr), w = m.map((k) => k.value);
    return {
      id: $.id,
      samples: m,
      sampleCount: m.length,
      firstTs: m.length > 0 ? m[0].ts : null,
      lastTs: m.length > 0 ? m[m.length - 1].ts : null,
      minValue: w.length > 0 ? Math.min(...w) : null,
      maxValue: w.length > 0 ? Math.max(...w) : null
    };
  }), f = u.flatMap(($) => $.samples.map((E) => E.value)), g = f.length > 0;
  let P = 0, S = 1;
  g && (P = Math.min(...f), S = Math.max(...f), P === S && (P -= 1, S += 1));
  const x = Math.max(S - P, 1), I = u.map(($) => {
    const E = $.samples.map((R) => {
      const m = (R.ts - l) / p, w = n + Math.min(Math.max(m, 0), 1) * d, k = o - n - (R.value - P) / x * h;
      return !Number.isFinite(w) || !Number.isFinite(k) ? null : { x: w, y: k };
    }).filter((R) => R !== null), D = E.length >= 2 ? Oi(E) : "";
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
  }), A = I.filter(($) => $.pointsCount > 0).length;
  return {
    startTs: l,
    endTs: c,
    hasData: g,
    drawableCount: A,
    series: I
  };
}, Me = (i, e, t, r, s = "en") => {
  if (i === null)
    return r;
  const o = Object.is(i, -0) ? 0 : i;
  return `${new Intl.NumberFormat(s, {
    minimumFractionDigits: e,
    maximumFractionDigits: e
  }).format(o)} ${t}`;
}, re = (i) => Object.is(i, -0) ? 0 : i, Hi = (i) => {
  if (!i)
    return;
  const e = i.replace(/[\u200B-\u200D\uFEFF]/g, "").replace(/\s+/g, " ").trim();
  return e.length > 0 ? e : void 0;
}, sr = 1, zi = "spv:history:", Bi = "spv-card-config-updated", Wi = 6e4, qe = [1, 6, 24], mt = 150, Ui = 45e3, Ki = 45e3, Vi = 64, ji = /* @__PURE__ */ new Set(["unknown", "unavailable", "none", "null", ""]), ir = [
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
], ft = (i, e = "Unknown recorder error") => {
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
}, gt = (i, e = 120) => i.length <= e ? i : `${i.slice(0, e - 1)}…`, ce = class ce extends we {
  constructor() {
    super(...arguments), this._cardWidth = 0, this._selectedPanelId = null, this._showLivePowerPopup = !1, this._showEnergyPopup = !1, this._showCustomKpiPopup = !1, this._showSystemHealthPopup = !1, this._dragSourceSlotIndex = null, this._historyByEntityId = {}, this._historyState = "idle", this._historySignature = "", this._historyQuerySignature = "", this._historyLastLoadMs = 0, this._historyLoadToken = 0, this._popupGraphRangeHours = 6, this._popupGraphCache = {}, this._popupGraphRequestToken = 0, this._popupGraphLatestTokenByKey = {}, this._telemetryGraphPanelId = null, this._telemetryGraphEntityId = null, this._telemetryGraphRangeHours = 6, this._kpiCompareExpanded = {
      power: !1,
      energy: !1
    }, this._kpiCompareRangeHours = {
      power: 6,
      energy: 6
    }, this._kpiCompareCache = {}, this._kpiCompareRequestToken = 0, this._kpiCompareLatestTokenByKey = {}, this._persistConfigToken = 0, this._popupScrollRestoreToken = 0, this._popupScrollRestore = null, this._motionEngine = new hi(() => this.requestUpdate()), this._motionOverlayModel = null, this._motionOverlaySignature = "", this._overlayMeasureFrame = null, this._panelDetailOverflowFrame = null, this._activePulseColor = "rgba(111, 201, 255, 0.72)", this._onMotionAnimationEnd = (e) => {
      const t = e;
      if (t.animationName !== "spv-flow-pulse")
        return;
      const r = t.target;
      r instanceof SVGPathElement && r.classList.contains("spv-motion-flow") && (this._hasPopupOpen() || this._motionEngine.completeFlowPulse());
    }, this._handlePanelDetailScroll = (e) => {
      const t = e.currentTarget;
      if (!t)
        return;
      const r = this._getPanelDetailMaxScrollTop(t);
      t.scrollTop > r && (t.scrollTop = r);
    }, this._enableForecastOverlayFromPopup = () => {
      if (!this._config || this._isForecastOverlayEnabled())
        return;
      const e = this._getForecastEntityId("power"), t = this._getForecastEntityId("energy");
      if (this._commitConfigFromCard(
        Re({
          ...this._config,
          enable_forecast_overlay: !0
        })
      ), this._showLivePowerPopup && e) {
        const r = this._getSystemPowerEntityId(), s = r ? this._popupGraphRangeHours : this._kpiCompareRangeHours.power;
        if (r)
          this._ensurePopupGraphLoadedByEntity(r, s);
        else {
          const o = this._derived ?? (this._config && this.hass ? ve(this._config, this.hass) : null);
          o && this._ensurePanelCompareLoaded(o, "power", s);
        }
        this._ensurePopupGraphLoadedByEntity(e, s);
      }
      if (this._showEnergyPopup && t) {
        const r = this._getSystemEnergyEntityId(), s = r ? this._popupGraphRangeHours : this._kpiCompareRangeHours.energy;
        if (r)
          this._ensurePopupGraphLoadedByEntity(r, s);
        else {
          const o = this._derived ?? (this._config && this.hass ? ve(this._config, this.hass) : null);
          o && this._ensurePanelCompareLoaded(o, "energy", s);
        }
        this._ensurePopupGraphLoadedByEntity(t, s);
      }
    }, this._closeDialog = () => {
      this._closeAllPopups(), this._kpiCompareExpanded = { power: !1, energy: !1 }, this._kpiCompareRangeHours = { power: 6, energy: 6 };
    }, this._openLivePowerPopup = () => {
      this._selectedPanelId = null, this._clearTelemetryGraph();
      const e = this._getSystemPowerEntityId();
      if (this._kpiCompareExpanded = { power: !1, energy: !1 }, this._kpiCompareRangeHours = { power: 6, energy: 6 }, this._showLivePowerPopup = !0, this._showEnergyPopup = !1, this._showCustomKpiPopup = !1, this._showSystemHealthPopup = !1, this._popupGraphRangeHours = 6, e) {
        if (this._ensurePopupGraphLoadedByEntity(e, 6), this._isForecastOverlayEnabled()) {
          const t = this._getForecastEntityId("power");
          t && this._ensurePopupGraphLoadedByEntity(t, 6);
        }
      } else {
        const t = this._derived ?? (this._config && this.hass ? ve(this._config, this.hass) : null);
        if (t && (this._kpiCompareExpanded = {
          ...this._kpiCompareExpanded,
          power: this._buildPanelCompareTargets(t, "power").length > 0
        }, this._ensurePanelCompareLoaded(t, "power", this._kpiCompareRangeHours.power)), this._isForecastOverlayEnabled()) {
          const r = this._getForecastEntityId("power");
          r && this._ensurePopupGraphLoadedByEntity(
            r,
            this._kpiCompareRangeHours.power
          );
        }
      }
    }, this._closeLivePowerPopup = () => {
      this._closeAllPopups();
    }, this._openEnergyPopup = () => {
      this._selectedPanelId = null, this._clearTelemetryGraph();
      const e = this._getSystemEnergyEntityId();
      if (this._kpiCompareExpanded = { power: !1, energy: !1 }, this._kpiCompareRangeHours = { power: 6, energy: 6 }, this._showEnergyPopup = !0, this._showLivePowerPopup = !1, this._showCustomKpiPopup = !1, this._showSystemHealthPopup = !1, this._popupGraphRangeHours = 6, e) {
        if (this._ensurePopupGraphLoadedByEntity(e, 6), this._isForecastOverlayEnabled()) {
          const t = this._getForecastEntityId("energy");
          t && this._ensurePopupGraphLoadedByEntity(t, 6);
        }
      } else {
        const t = this._derived ?? (this._config && this.hass ? ve(this._config, this.hass) : null);
        if (t && (this._kpiCompareExpanded = {
          ...this._kpiCompareExpanded,
          energy: this._buildPanelCompareTargets(t, "energy").length > 0
        }, this._ensurePanelCompareLoaded(t, "energy", this._kpiCompareRangeHours.energy)), this._isForecastOverlayEnabled()) {
          const r = this._getForecastEntityId("energy");
          r && this._ensurePopupGraphLoadedByEntity(
            r,
            this._kpiCompareRangeHours.energy
          );
        }
      }
    }, this._closeEnergyPopup = () => {
      this._closeAllPopups();
    }, this._openCustomKpiPopup = () => {
      this._selectedPanelId = null, this._clearTelemetryGraph(), this._kpiCompareExpanded = { power: !1, energy: !1 }, this._kpiCompareRangeHours = { power: 6, energy: 6 }, this._showCustomKpiPopup = !0, this._showLivePowerPopup = !1, this._showEnergyPopup = !1, this._showSystemHealthPopup = !1, this._popupGraphRangeHours = 6;
      const e = this._getCustomKpiEntityId();
      e && this._ensurePopupGraphLoadedByEntity(e, 6);
    }, this._closeCustomKpiPopup = () => {
      this._closeAllPopups();
    }, this._openSystemHealthPopup = () => {
      this._showSystemHealthPopup = !0, this._showLivePowerPopup = !1, this._showEnergyPopup = !1, this._showCustomKpiPopup = !1, this._selectedPanelId = null, this._clearTelemetryGraph(), this._kpiCompareExpanded = { power: !1, energy: !1 }, this._kpiCompareRangeHours = { power: 6, energy: 6 };
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
    return await Promise.resolve().then(() => yo), document.createElement("solar-panel-visualizer-card-editor");
  }
  static getStubConfig() {
    return bs();
  }
  _normalizeCardConfig(e) {
    return Re(e);
  }
  _renderCardOverlay(e) {
    const t = this._getCurrentConfig(), r = this._motionEngine.getState();
    return $i(this._motionOverlayModel, {
      showTopology: !!(t?.motion_enabled ?? !0) && !!(t?.motion_power_flow ?? !0),
      showFlow: r.powerFlowActive,
      activeFlowPanelId: r.flowPulsePanelId,
      powerImpactActive: r.kpiShimmers.has("power")
    });
  }
  _afterBaseUpdated(e) {
    const t = this._getCurrentConfig(), r = this._getCurrentDerived();
    if (!t || !r)
      return;
    const s = (t.motion_enabled ?? !0) && (t.motion_power_flow ?? !0);
    this.toggleAttribute("data-spv-busbars", s), this._motionEngine.update(this._buildMotionFlags(t), this._buildMotionSnapshot(r)), this._syncActivePulseColor(r), this._scheduleOverlayMeasure();
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
    return Br(this.hass, e, t);
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
    const t = {}, r = {};
    for (const s of e.panels)
      t[s.id] = s.power, r[s.id] = s.status;
    return {
      totalPower: e.totalPower,
      popupOpen: this._hasPopupOpen(),
      powerKpiValue: this._resolveSummaryPower(e).value?.toString() ?? this._t("state.unavailable"),
      energyKpiValue: this._resolveSummaryEnergy(e).value?.toString() ?? this._t("state.unavailable"),
      panelPowers: t,
      panelStatuses: r
    };
  }
  _scheduleOverlayMeasure() {
    this._overlayMeasureFrame !== null || typeof window > "u" || (this._overlayMeasureFrame = window.requestAnimationFrame(() => {
      this._overlayMeasureFrame = null, this._measureOverlay();
    }));
  }
  _syncActivePulseColor(e) {
    const t = this._motionEngine.getState().flowPulsePanelId, r = e.panels.find((s) => s.id === t);
    r?.accentColor && (this._activePulseColor = r.accentColor);
  }
  _measureOverlay() {
    const e = this._getCurrentConfig(), t = this._getCurrentDerived(), r = this.shadowRoot;
    if (!e || !t || !r)
      return;
    const s = Pi(this, r, e, t), o = JSON.stringify(s);
    o !== this._motionOverlaySignature && (this._motionOverlayModel = s, this._motionOverlaySignature = o, this.requestUpdate());
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
    const t = ws(e);
    if (t.length > 0)
      throw new Error(t.join(" "));
    const r = this._normalizeCardConfig(e), s = this._config !== void 0 && this._configsEqual(this._config, r);
    this._sourceConfigRef = e, this._config = r, s || (this._historySignature = "", this._historyQuerySignature = "", this._historyLastLoadMs = 0, this._historyLoadToken = 0, this._popupGraphRangeHours = 6, this._popupGraphCache = {}, this._popupGraphLatestTokenByKey = {}, this._kpiCompareExpanded = { power: !1, energy: !1 }, this._kpiCompareRangeHours = { power: 6, energy: 6 }, this._kpiCompareCache = {}, this._kpiCompareLatestTokenByKey = {}, this._showLivePowerPopup = !1, this._showEnergyPopup = !1, this._showCustomKpiPopup = !1, this._showSystemHealthPopup = !1, this._selectedPanelId = null), this._refreshDerived(), this._ensureHistoryLoaded();
  }
  _configsEqual(e, t) {
    return JSON.stringify(e) === JSON.stringify(t);
  }
  getCardSize() {
    const e = this._config?.panels.length ?? 6, t = this._config?.columns ?? 3, r = this._computeRenderedColumns(
      t,
      this._config?.max_card_width_px
    ), s = this._computeRenderedRows(e, r), o = this._computePanelHeightPx(
      s,
      this._config?.max_card_height_px,
      r,
      this._config?.max_card_width_px
    ), n = 220 + s * o + Math.max(0, s - 1) * 10, a = this._config?.max_card_height_px ? Math.min(n, this._config.max_card_height_px) : n;
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
      const r = t.closest(".panel");
      if (!r)
        return;
      if (r.classList.contains("hidden-slot") || t.childElementCount === 0) {
        r.classList.remove("has-detail-overflow"), t.scrollTop = 0;
        return;
      }
      const s = t.scrollTop;
      r.classList.remove("has-detail-overflow"), this._syncPerformanceLabelFit(t);
      const o = t.scrollHeight > t.clientHeight + 1;
      if (r.classList.toggle("has-detail-overflow", o), o) {
        this._syncPerformanceLabelFit(t);
        const n = this._getPanelDetailMaxScrollTop(t);
        t.scrollTop = Math.min(s, n);
      } else
        t.scrollTop = 0;
    });
  }
  _getPanelDetailMaxScrollTop(e) {
    const t = Math.max(0, e.scrollHeight - e.clientHeight), r = Array.from(e.children).filter(
      (o) => o instanceof HTMLElement && o.offsetParent !== null && o.offsetHeight > 0
    ), s = r[r.length - 1];
    return s ? Math.min(t, Math.max(0, s.offsetTop)) : t;
  }
  _syncPerformanceLabelFit(e) {
    const t = e.querySelector(".performance");
    if (!t)
      return;
    const r = t.dataset.performanceFull, s = t.dataset.performanceMedium, o = t.dataset.performanceCompact, n = [r, s, o].filter(
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
      return b;
    const e = this._derived ?? ve(this._config, this.hass), t = this.hass?.locale?.language ?? "en", r = this._t("common.unavailable"), s = this._t("common.not_configured"), o = this._resolveDefaultTitle(this._config.title), n = this._resolveThemeMode(), a = this._resolveSummaryPower(e), l = this._resolveSummaryEnergy(e), c = this._resolveCustomKpi(), p = this._isSummaryEnergyConfigured(), d = this._config.show_custom_kpi ?? !0, h = this._computeRenderedColumns(
      this._config.columns,
      this._config.max_card_width_px
    ), u = this._computeRenderedRows(
      this._config.panels.length,
      h
    ), f = this._computePanelHeightPx(
      u,
      this._config.max_card_height_px,
      h,
      this._config.max_card_width_px
    ), g = this._computePanelWidthPx(
      h,
      this._config.max_card_width_px
    ), P = this._computePanelScale(f), S = this._getPanelWidthCapPx(), x = S !== null ? `grid-template-columns: repeat(${h}, minmax(0, ${S}px)); justify-content: center;` : `grid-template-columns: repeat(${h}, minmax(0, 1fr));`, I = this._config.deviation_history_hours ?? 12, A = `--spv-max-width:${this._config.max_card_width_px ?? 980}px; ${this._config.max_card_height_px ? `--spv-max-height:${this._config.max_card_height_px}px;` : "--spv-max-height:none;"} --spv-panel-height:${f}px; --spv-panel-scale:${P}; --spv-panel-max-width:${S ? `${S}px` : "100%"};`, $ = this._buildSystemHealthState(e), E = e.inverterCount + e.errorCount + e.offlineCount + e.deviationCount, D = this._motionOverlayModel ? `width:${this._motionOverlayModel.width}px; height:${this._motionOverlayModel.height}px;` : "", R = (this._config.enable_array_checks ?? !1) && this._historyState === "loading" ? this._t("card.subtitle.loading_history", { hours: I }) : e.deviationReady ? e.deviationCount > 0 ? this._t("card.subtitle.deviation_detected", {
      count: e.deviationCount,
      suffix: e.deviationCount === 1 ? "" : "s"
    }) : this._t("card.subtitle.tap_diagnostics") : this._historyStateReason ?? e.deviationSuppressedReason ?? this._t("card.subtitle.warmup"), m = e.panels.find(
      (w) => w.id === this._selectedPanelId
    );
    return y`
      <ha-card style=${A} data-spv-theme=${n}>
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
            <p class="subtitle">${R}</p>
            <p class="subtitle subtitle-hint">${this._t("card.subtitle.drag_hint")}</p>
          </div>
          <div class="summary ${d ? "with-custom" : "without-custom"}">
            <button
              class="summary-chip summary-button ${this._getSummaryExtraClass("power")}"
              style=${this._getSummaryExtraStyle("power")}
              type="button"
              data-kpi="power"
              @click=${this._openLivePowerPopup}
            >
              <span class="summary-label">${this._t("card.summary.power")}</span>
              <span class="summary-value">
                ${Me(
      a.value,
      this._config.power_decimals ?? 0,
      a.unit,
      r,
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
                ${p ? Me(
      l.value,
      this._config.energy_decimals ?? 2,
      l.unit,
      r,
      t
    ) : s}
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
            ${d ? y`
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
                ` : b}
          </div>
        </div>

        <div
          class="grid"
          style=${x}
        >
          ${e.panels.map((w) => this._renderPanel(w, f, g))}
        </div>

        ${this._showLivePowerPopup ? this._renderLivePowerDialog(e) : b}
        ${this._showEnergyPopup ? this._renderEnergyDialog(e) : b}
        ${this._showCustomKpiPopup ? this._renderCustomKpiDialog() : b}
        ${this._showSystemHealthPopup ? this._renderSystemHealthDialog(e) : b}
        ${m ? this._renderPanelDialog(m) : b}
      </ha-card>
    `;
  }
  _refreshDerived() {
    if (!this._config) {
      this._derived = void 0;
      return;
    }
    this._derived = ve(this._config, this.hass, {
      deviationEnabled: this._config.enable_array_checks ?? !1,
      historyByEntityId: this._historyByEntityId,
      nowMs: Date.now()
    });
  }
  _formatSlotLabel(e) {
    const t = this._config?.columns ?? 1, r = Math.floor(e / t) + 1, s = e % t + 1;
    return this._t("card.panel.slot_label", { row: r, column: s });
  }
  _renderPanel(e, t, r) {
    const s = this._shouldShowPerformance(e, t, r), o = this._getPanelExtraClass(e), n = Hi(e.inverterStatusDisplay), a = this._formatInverterTileSummary(e, n), l = Math.max(0, Math.min(e.intensity, 1)), c = Math.round(24 + l * 62), p = Math.round(6 + l * 24), d = Math.round(4 + l * 18), h = [
      `--panel-accent:${e.accentColor}`,
      `--panel-intensity:${l.toFixed(3)}`,
      `--panel-border-accent:color-mix(in srgb, ${e.accentColor} ${c}%, var(--spv-panel-accent-mix-base))`,
      `--panel-fill-accent:color-mix(in srgb, ${e.accentColor} ${p}%, transparent)`,
      `--panel-glow-accent:color-mix(in srgb, ${e.accentColor} ${d}%, transparent)`
    ].join("; "), u = s ? this._buildPanelPerformanceLabelCandidates(e) : null;
    return e.hiddenSlot ? y`
        <button
          class="panel hidden-slot ${o}"
          type="button"
          data-panel-id=${e.id}
          data-slot-index=${String(e.slotIndex)}
          draggable="true"
          @dragstart=${(f) => this._handleDragStart(f, e.slotIndex)}
          @dragover=${this._handleDragOver}
          @drop=${(f) => this._handleDrop(f, e.slotIndex)}
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
      ` : y`
      <button
        class="panel ${e.status} ${s ? "has-performance" : ""} ${o}"
        type="button"
        style=${h}
        data-panel-id=${e.id}
        data-slot-index=${String(e.slotIndex)}
        draggable="true"
        @dragstart=${(f) => this._handleDragStart(f, e.slotIndex)}
        @dragover=${this._handleDragOver}
        @drop=${(f) => this._handleDrop(f, e.slotIndex)}
        @dragend=${this._handleDragEnd}
        @click=${() => this._handlePanelClick(e)}
      >
        <span class="status">${this._panelStatusLabel(e.status)}</span>
        <div class="panel-primary">
          <p class="panel-name" title=${e.label}>${e.label}</p>
          <p class="power">${e.powerDisplay}</p>
        </div>
        <div class="panel-detail-scroll" @scroll=${this._handlePanelDetailScroll}>
          ${s ? y`<p
                class="performance"
                data-performance-full=${u?.[0]?.text ?? ""}
                data-performance-medium=${u?.[1]?.text ?? ""}
                data-performance-compact=${u?.[2]?.text ?? ""}
              >
                ${this._formatPanelPerformanceText(
      e,
      r,
      t,
      u
    )}
              </p>` : b}
          ${e.energyDisplay ? y`<p class="energy">${e.energyDisplay}</p>` : b}
          ${(this._config?.show_inverter_status_on_tiles ?? !1) && a ? y`<p class="inverter-status">${a}</p>` : b}
        </div>
        <span class="slot">${this._formatSlotLabel(e.slotIndex)}</span>
      </button>
    `;
  }
  _renderPopupCloseButton(e, t) {
    return y`
      <div class="spv-popup-close-anchor">
        <button
          class="spv-popup-close"
          type="button"
          @click=${(r) => this._handlePopupCloseClick(r, e)}
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
    const r = this._getPanelConfig(e.id)?.energy_entity ? e.energyDisplay ?? this._t("common.unavailable") : this._t("common.not_configured");
    return e.status === "unconfigured" ? y`
        <div class="spv-popup-backdrop" @click=${this._closeDialog}>
          <div class="spv-popup" @click=${(s) => s.stopPropagation()}>
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
      ` : y`
      <div class="spv-popup-backdrop" @click=${this._closeDialog}>
        <div class="spv-popup" @click=${(s) => s.stopPropagation()}>
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
                ${r}
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
              ${e.powerEntityName ? y`<p class="info-line">${this._t("card.popup.info.power_source", {
      value: e.powerEntityName
    })}</p>` : b}
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
      return b;
    const r = this._getPanelTelemetryMetrics(t), s = r.filter((l) => !!l.entityId), o = r.filter((l) => !l.entityId), n = s.length > 0, a = this._telemetryGraphPanelId === e.id ? this._telemetryGraphEntityId : null;
    return y`
      <section class="telemetry-section">
        <h3 class="telemetry-title">${this._t("card.popup.telemetry.title")}</h3>

        ${n ? y`
              <div class="telemetry-group">
                <h4 class="telemetry-title">${this._t("card.popup.telemetry.configured_title")}</h4>
                <div class="telemetry-grid">
                  ${s.map(
      (l) => this._renderTelemetryMetricCard(
        e.id,
        l,
        l.entityId === a
      )
    )}
                </div>
              </div>
            ` : b}

        ${o.length > 0 ? y`
              <div class="telemetry-group">
                <h4 class="telemetry-title">${this._t("card.popup.telemetry.unconfigured_title")}</h4>
                <p class="telemetry-empty">${this._t("card.popup.telemetry.setup_hint")}</p>
                <div class="telemetry-grid">
                  ${o.map(
      (l) => y`
                      <div class="detail-card telemetry-card">
                        <span class="detail-label">${l.label}</span>
                        <span class="detail-value">${this._t("common.not_configured")}</span>
                      </div>
                    `
    )}
                </div>
              </div>
            ` : n ? b : y`<p class="telemetry-empty">${this._t("card.popup.telemetry.setup_hint")}</p>`}
      </section>
    `;
  }
  _renderTelemetryMetricCard(e, t, r) {
    const s = t.entityId;
    return s ? y`
      <div class="detail-card telemetry-card is-expandable ${r ? "is-open" : ""}">
        <button
          class="telemetry-card-toggle"
          type="button"
          aria-expanded=${r ? "true" : "false"}
          @click=${(o) => this._toggleTelemetryGraph(o, e, s)}
        >
          <span class="telemetry-card-main">
            <span class="detail-label">${t.label}</span>
            <span class="detail-value">
              ${this._formatTelemetryMetricValue(s)}
            </span>
          </span>
          <span class="telemetry-card-affordance" aria-hidden="true">
            ${r ? "-" : "+"}
          </span>
        </button>
        ${r ? this._renderTelemetryMetricGraph(t) : b}
      </div>
    ` : b;
  }
  _renderTelemetryMetricGraph(e) {
    const t = e.entityId;
    if (!t)
      return b;
    const r = this._telemetryGraphRangeHours, s = this._getPopupGraphCacheKey(t, r), o = this._popupGraphCache[s], n = o?.samples ?? [], a = this._adjustGraphSamplesForEntity(t, n), l = this._getUnitForEntity(t, "");
    return y`
      <div class="telemetry-card-graph">
        <div class="graph-header">
          <span class="graph-title">${e.label}</span>
          <div class="range-chips">
            ${qe.map(
      (c) => y`
                <button
                  class="range-chip ${this._telemetryGraphRangeHours === c ? "active" : ""}"
                  type="button"
                  @pointerdown=${this._preventRangeChipFocusScroll}
                  @mousedown=${this._preventRangeChipFocusScroll}
                  @click=${(p) => this._handleTelemetryGraphRangeChange(p, t, c)}
                >
                  ${c}h
                </button>
              `
    )}
          </div>
        </div>
        ${this._renderPopupGraphBodyFromSamples(
      s,
      l,
      a,
      r,
      o?.loading ?? !1,
      o?.error,
      { fillStartWithFirstSample: !0 }
    )}
      </div>
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
    const r = t.state?.toString().trim() ?? "", s = r.toLowerCase();
    if (s.length === 0 || ji.has(s))
      return this._t("common.unavailable");
    const o = Number(t.state), n = typeof t.attributes?.unit_of_measurement == "string" ? t.attributes.unit_of_measurement.trim() : "";
    if (Number.isFinite(o)) {
      const a = this.hass?.locale?.language ?? "en", l = Object.is(o, -0) ? 0 : o, c = Number.isInteger(l) ? 0 : 2, p = new Intl.NumberFormat(a, {
        minimumFractionDigits: 0,
        maximumFractionDigits: c
      }).format(l);
      return n ? `${p} ${n}` : p;
    }
    return n ? `${r} ${n}` : r;
  }
  _renderKpiCompareControls(e, t) {
    const r = this._kpiCompareExpanded[t], s = t === "power" ? this._t("card.popup.panel_compare.toggle_power") : this._t("card.popup.panel_compare.toggle_energy");
    return y`
      <div class="compare-toggle-row">
        <button
          class="inline-button"
          type="button"
          @click=${(o) => this._togglePanelCompareGraph(o, t, e)}
        >
          ${s}
        </button>
      </div>
      ${r ? this._renderPanelCompareGraph(e, t) : b}
    `;
  }
  _togglePanelCompareGraph(e, t, r) {
    const s = this._captureScrollPositionsForPopupGraph(e), o = !this._kpiCompareExpanded[t];
    this._kpiCompareExpanded = {
      ...this._kpiCompareExpanded,
      [t]: o
    }, this._scheduleCapturedScrollRestore(s), o && this._ensurePanelCompareLoaded(
      r,
      t,
      this._kpiCompareRangeHours[t],
      s
    );
  }
  _renderPanelCompareGraph(e, t) {
    const r = this._buildPanelCompareTargets(e, t), s = this._kpiCompareRangeHours[t];
    if (r.length === 0)
      return y`
        <p class="graph-state">
          ${t === "energy" ? this._t("card.popup.panel_compare.no_panels_energy") : this._t("card.popup.panel_compare.no_panels_power")}
        </p>
      `;
    const o = this._getPanelCompareSignature(t, r), n = this._getPanelCompareCacheKey(t, o, s), a = this._kpiCompareCache[n], l = a?.loading ?? !1, c = a?.error, p = r.map((v, C) => ({
      ...v,
      color: ir[C % ir.length],
      samples: this._adjustGraphSamplesForEntity(
        v.entityId,
        a?.samplesByPanelId[v.panelId] ?? []
      )
    })), d = Gi(
      p.map((v) => ({
        id: v.panelId,
        samples: v.samples
      })),
      Date.now(),
      s,
      mt,
      320,
      132,
      10
    ), h = new Map(d.series.map((v) => [v.id, v])), u = d.series.some(
      (v) => v.sampleCount > 0 && (v.pointsCount === 0 || v.sampleCount > 1 && v.pointsCount < 2)
    ), f = d.hasData && d.drawableCount === 0, g = f || u, P = t === "energy" ? "kWh" : "W", S = d.series.flatMap(
      (v) => v.samples.map((C) => C.value).filter((C) => Number.isFinite(C))
    ), x = S.length > 0 ? this._computeGraphStats(
      S.map((v, C) => ({
        ts: C,
        value: v
      }))
    ) : { min: null, max: null, median: null }, I = S.length > 0 ? Math.min(...S) : null, A = S.length > 0 ? Math.max(...S) : null, $ = I === null || A === null ? null : I === A ? I - 1 : I, E = I === null || A === null ? null : I === A ? A + 1 : A, D = x.max !== null && $ !== null && E !== null ? this._toGraphY(x.max, $, E, 132, 10) : null, R = x.median !== null && $ !== null && E !== null ? this._toGraphY(x.median, $, E, 132, 10) : null, m = x.min !== null && $ !== null && E !== null ? this._toGraphY(x.min, $, E, 132, 10) : null, w = x.max !== null ? this._t("card.popup.history.max", {
      value: this._formatGraphPower(x.max, P)
    }) : null, k = x.median !== null ? this._t("card.popup.history.median", {
      value: this._formatGraphPower(x.median, P)
    }) : null, T = x.min !== null ? this._t("card.popup.history.min", {
      value: this._formatGraphPower(x.min, P)
    }) : null, F = this._buildGraphHourTicks(
      {
        startTs: d.startTs,
        endTs: d.endTs
      },
      s
    ), O = this._buildGraphAxisTicks(F), ee = t === "energy" ? this._t("card.popup.history.panel_compare_energy") : this._t("card.popup.history.panel_compare_power");
    return y`
      <div class="graph-section">
        <div class="graph-header">
          <span class="graph-title">${ee}</span>
          <div class="range-chips">
            ${qe.map(
      (v) => y`
                <button
                  class="range-chip ${this._kpiCompareRangeHours[t] === v ? "active" : ""}"
                  type="button"
                  @pointerdown=${this._preventRangeChipFocusScroll}
                  @mousedown=${this._preventRangeChipFocusScroll}
                  @click=${(C) => this._handlePanelCompareRangeChange(C, e, t, v)}
                >
                  ${v}h
                </button>
              `
    )}
          </div>
        </div>

        ${l ? y`<p class="graph-state">${this._t("card.popup.panel_compare.loading")}</p>` : c ? y`<p class="graph-state">${c}</p>` : d.hasData ? f ? y`<p class="graph-state">${this._t("card.popup.panel_compare.render_failure")}</p>` : y`
                  <div class="graph-box">
                    ${w ? y`<span class="graph-overlay graph-overlay-max">${w}</span>` : b}
                    ${k ? y`
                          <span class="graph-overlay graph-overlay-median">
                            ${k}
                          </span>
                        ` : b}
                    ${T ? y`<span class="graph-overlay graph-overlay-min">${T}</span>` : b}
                    <svg class="graph-svg" viewBox="0 0 320 132" preserveAspectRatio="none">
                      ${F.map(
      (v) => z`
                          <line
                            class="graph-hour-line"
                            x1=${v.x.toFixed(2)}
                            x2=${v.x.toFixed(2)}
                            y1="10"
                            y2="122"
                          ></line>
                        `
    )}
                      ${p.map((v) => {
      const C = h.get(v.panelId);
      return !C || C.pointsCount === 0 ? b : C.pointsCount >= 2 ? z`
                            <path
                              d=${C.linePath}
                              fill="none"
                              stroke=${v.color}
                              stroke-width="1.08"
                              stroke-linejoin="round"
                              stroke-linecap="round"
                              opacity="0.88"
                            ></path>
                            ${C.firstPoint && C.lastPoint ? z`
                                  <circle
                                    cx=${C.firstPoint.x.toFixed(2)}
                                    cy=${C.firstPoint.y.toFixed(2)}
                                    r="1.7"
                                    fill=${v.color}
                                    opacity="0.95"
                                  ></circle>
                                  <circle
                                    cx=${C.lastPoint.x.toFixed(2)}
                                    cy=${C.lastPoint.y.toFixed(2)}
                                    r="1.7"
                                    fill=${v.color}
                                    opacity="0.95"
                                  ></circle>
                                ` : b}
                          ` : C.firstPoint ? z`
                          <circle
                            cx=${C.firstPoint.x.toFixed(2)}
                            cy=${C.firstPoint.y.toFixed(2)}
                            r="2.4"
                            fill=${v.color}
                            opacity="0.95"
                          ></circle>
                        ` : b;
    })}
                      ${D !== null ? z`
                            <line
                              class="graph-stat-line graph-stat-max"
                              x1="10"
                              x2="310"
                              y1=${D.toFixed(2)}
                              y2=${D.toFixed(2)}
                            ></line>
                          ` : b}
                      ${R !== null ? z`
                            <line
                              class="graph-stat-line graph-stat-median"
                              x1="10"
                              x2="310"
                              y1=${R.toFixed(2)}
                              y2=${R.toFixed(2)}
                            ></line>
                          ` : b}
                      ${m !== null ? z`
                            <line
                              class="graph-stat-line graph-stat-min"
                              x1="10"
                              x2="310"
                              y1=${m.toFixed(2)}
                              y2=${m.toFixed(2)}
                            ></line>
                          ` : b}
                    </svg>
                  </div>
                  <div class="graph-axis">
                    ${O.map(
      (v) => y`
                        <span class="graph-axis-label" style=${`left:${v.leftPercent.toFixed(2)}%;`}>
                          ${v.label}
                        </span>
                      `
    )}
                  </div>
                  <div class="graph-meta">
                    <span>
                      ${this._t("card.popup.history.time_range", {
      start: this._formatGraphTime(d.startTs),
      end: this._formatGraphTime(d.endTs)
    })}
                    </span>
                  </div>
                ` : y`<p class="graph-state">${this._t("card.popup.panel_compare.no_data")}</p>`}

        ${g ? y`
              <div class="compare-diagnostics">
                <span class="compare-diagnostics-title">
                  ${this._t("card.popup.panel_compare.diagnostics_title")}
                </span>
                <span class="compare-diagnostics-row">
                  ${this._t("card.popup.panel_compare.diagnostics_summary", {
      hasData: d.hasData ? "true" : "false",
      drawable: d.drawableCount,
      series: d.series.length,
      range: s
    })}
                </span>
                <span class="compare-diagnostics-row">
                  ${f ? this._t("card.popup.panel_compare.diagnostics_reason_render_failure") : this._t("card.popup.panel_compare.diagnostics_reason_suspect")}
                </span>
                ${p.map((v) => {
      const C = h.get(v.panelId), U = this._getUnitForEntity(v.entityId, P);
      return y`
                    <span class="compare-diagnostics-row">
                      ${this._t("card.popup.panel_compare.diagnostics_row", {
        label: v.label,
        samples: C?.sampleCount ?? 0,
        points: C?.pointsCount ?? 0,
        pathLen: C?.linePath.length ?? 0,
        first: this._formatGraphDiagnosticTime(C?.firstTs ?? null),
        last: this._formatGraphDiagnosticTime(C?.lastTs ?? null),
        min: C?.minValue === null || C?.minValue === void 0 ? "--" : this._formatGraphPower(C.minValue, U),
        max: C?.maxValue === null || C?.maxValue === void 0 ? "--" : this._formatGraphPower(C.maxValue, U)
      })}
                    </span>
                  `;
    })}
              </div>
            ` : b}

        <div class="compare-legend">
          ${p.map(
      (v) => y`
              <div class="compare-legend-item">
                <span
                  class="compare-legend-chip"
                  style=${`background:${v.color};`}
                ></span>
                <span class="compare-legend-label">${v.label}</span>
              </div>
            `
    )}
        </div>
      </div>
    `;
  }
  _renderAggregatedPanelGraph(e, t, r = {}) {
    const s = this._buildPanelCompareTargets(e, t), o = this._kpiCompareRangeHours[t];
    if (s.length === 0)
      return y`
        <p class="graph-state">
          ${t === "energy" ? this._t("card.popup.panel_compare.no_panels_energy") : this._t("card.popup.panel_compare.no_panels_power")}
        </p>
      `;
    const n = this._getPanelCompareSignature(t, s), a = this._getPanelCompareCacheKey(t, n, o), l = this._kpiCompareCache[a], c = l?.loading ?? !1, p = l?.error, d = Di(
      s.map(
        (f) => this._adjustGraphSamplesForEntity(
          f.entityId,
          l?.samplesByPanelId[f.panelId] ?? []
        )
      )
    ), h = t === "energy" ? this._resolveUnit("energy_entity", "kWh") : this._resolveUnit("power_entity", "W"), u = t === "energy" ? this._t("card.popup.history.total_panel_energy") : this._t("card.popup.history.total_panel_power");
    return y`
      <div class="graph-section">
        <div class="graph-header">
          <span class="graph-title">${u}</span>
          <div class="range-chips">
            ${qe.map(
      (f) => y`
                <button
                  class="range-chip ${this._kpiCompareRangeHours[t] === f ? "active" : ""}"
                  type="button"
                  @pointerdown=${this._preventRangeChipFocusScroll}
                  @mousedown=${this._preventRangeChipFocusScroll}
                  @click=${(g) => this._handleAggregatedPanelRangeChange(
        g,
        e,
        t,
        f,
        r.overlayEntityId ?? void 0
      )}
                >
                  ${f}h
                </button>
              `
    )}
          </div>
        </div>
        ${this._renderPopupGraphBodyFromSamples(
      `panel-total-${t}|${n}|${o}`,
      h,
      d,
      o,
      c,
      p,
      r
    )}
        ${r.overlayStateMessage ? y`<p class="graph-forecast-state">${r.overlayStateMessage}</p>` : b}
        ${r.showEnableForecastButton ? y`
              <div class="forecast-enable-row">
                <button
                  class="inline-button"
                  type="button"
                  @click=${this._enableForecastOverlayFromPopup}
                >
                  ${this._t("card.popup.forecast.enable_button")}
                </button>
              </div>
            ` : b}
      </div>
    `;
  }
  _handleAggregatedPanelRangeChange(e, t, r, s, o) {
    e.preventDefault(), e.stopPropagation();
    const n = this._captureScrollPositionsForPopupGraph(e);
    this._kpiCompareRangeHours = {
      ...this._kpiCompareRangeHours,
      [r]: s
    }, this._scheduleCapturedScrollRestore(n), this._ensurePanelCompareLoaded(t, r, s, n), o && this._ensurePopupGraphLoadedByEntity(o, s, n);
  }
  _handlePanelCompareRangeChange(e, t, r, s) {
    e.preventDefault(), e.stopPropagation();
    const o = this._captureScrollPositionsForPopupGraph(e);
    if (this._kpiCompareRangeHours = {
      ...this._kpiCompareRangeHours,
      [r]: s
    }, this._scheduleCapturedScrollRestore(o), this._kpiCompareExpanded[r] && this._ensurePanelCompareLoaded(t, r, s, o), !this._getSystemEntityIdForKind(r) && this._isForecastOverlayEnabled()) {
      const n = this._getForecastEntityId(r);
      n && this._ensurePopupGraphLoadedByEntity(n, s, o);
    }
  }
  _buildPanelCompareTargets(e, t) {
    const r = new Map(
      (this._config?.panels ?? []).map((s) => [s.id, s])
    );
    return e.panels.filter((s) => !s.hiddenSlot && s.enabled).map((s) => {
      const o = r.get(s.id), n = t === "energy" ? o?.energy_entity?.trim() : o?.power_entity?.trim();
      return n ? {
        panelId: s.id,
        label: s.label,
        entityId: n
      } : null;
    }).filter((s) => !!s);
  }
  _getPanelCompareSignature(e, t) {
    return `${e}|${t.map((r) => `${r.panelId}:${r.entityId}`).join("|")}`;
  }
  _getPanelCompareCacheKey(e, t, r) {
    return `${e}|${t}|${r}`;
  }
  async _ensurePanelCompareLoaded(e, t, r, s) {
    if (!this._config || !this.hass)
      return;
    const o = this._buildPanelCompareTargets(e, t);
    if (o.length === 0)
      return;
    const n = this._getPanelCompareSignature(t, o), a = this._getPanelCompareCacheKey(t, n, r), l = this._kpiCompareCache[a], c = Date.now();
    if (l?.loading || l && !l.error && l.loadedAt && c - l.loadedAt < Ki)
      return;
    const p = ++this._kpiCompareRequestToken;
    if (this._kpiCompareLatestTokenByKey[a] = p, this._kpiCompareCache = {
      ...this._kpiCompareCache,
      [a]: {
        loading: !0,
        samplesByPanelId: l?.samplesByPanelId ?? {},
        loadedAt: l?.loadedAt
      }
    }, this._scheduleCapturedScrollRestore(s), !this.hass.callApi && !this.hass.callWS) {
      if (this._kpiCompareLatestTokenByKey[a] !== p)
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
      }, this._scheduleCapturedScrollRestore(s);
      return;
    }
    try {
      const d = [...new Set(o.map((x) => x.entityId))], h = {};
      let u = null;
      const f = await Promise.allSettled(
        d.map(async (x) => ({
          entityId: x,
          samples: await this._loadPopupGraphRecorderSamples(x, r)
        }))
      );
      for (const x of f) {
        if (x.status === "fulfilled") {
          h[x.value.entityId] = x.value.samples;
          continue;
        }
        u || (u = gt(
          ft(x.reason, this._t("common.unknown_recorder_error"))
        ));
      }
      if (this._kpiCompareLatestTokenByKey[a] !== p)
        return;
      const g = Object.values(h).some(
        (x) => x.length > 0
      );
      if (Object.keys(h).length === 0 && u) {
        this._kpiCompareCache = {
          ...this._kpiCompareCache,
          [a]: {
            loading: !1,
            samplesByPanelId: {},
            error: this._t("card.popup.panel_compare.unable_load", {
              error: u
            }),
            loadedAt: Date.now()
          }
        }, this._scheduleCapturedScrollRestore(s);
        return;
      }
      const S = {};
      for (const x of o)
        S[x.panelId] = h[x.entityId] ?? [];
      this._kpiCompareCache = {
        ...this._kpiCompareCache,
        [a]: {
          loading: !1,
          samplesByPanelId: S,
          error: !g && u ? this._t("card.popup.panel_compare.unable_load", {
            error: u
          }) : void 0,
          loadedAt: Date.now()
        }
      }, this._scheduleCapturedScrollRestore(s);
    } catch (d) {
      if (this._kpiCompareLatestTokenByKey[a] !== p)
        return;
      this._kpiCompareCache = {
        ...this._kpiCompareCache,
        [a]: {
          loading: !1,
          samplesByPanelId: {},
          error: this._t("card.popup.panel_compare.unable_load", {
            error: gt(ft(d, this._t("common.unknown_recorder_error")))
          }),
          loadedAt: Date.now()
        }
      }, this._scheduleCapturedScrollRestore(s);
    }
  }
  _renderInverterEvaluation(e) {
    return !e.inverterStatusDisplay || e.inverterStatusDisplay === this._t("common.unavailable") ? this._t("card.popup.inverter_eval.no_status") : e.inverterFaultMatched ? this._t("card.popup.inverter_eval.fault_match") : e.inverterWorkingMatched ? this._t("card.popup.inverter_eval.working_match") : this._t("card.popup.inverter_eval.no_match");
  }
  _renderLivePowerDialog(e) {
    const t = this._getSystemPowerEntityId(), r = this._resolveSummaryPower(e), s = this._resolveForecastMetricDisplay(
      "power",
      this._config?.power_decimals ?? 0,
      "W"
    ), o = this._isForecastOverlayEnabled() && !!s.entityId, n = s.entityId ? this._isForecastOverlayEnabled() ? null : this._t("card.popup.forecast.disabled_hint") : this._t("card.popup.forecast.default_sensor_not_found", {
      entity: s.expectedEntityId
    }), a = !this._isForecastOverlayEnabled() && !!s.entityId, l = this.hass?.locale?.language ?? "en";
    return y`
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
        overlayEntityId: o ? s.entityId : null,
        overlayStateMessage: n,
        showEnableForecastButton: a
      }
    ) : this._renderAggregatedPanelGraph(e, "power", {
      overlayEntityId: o ? s.entityId : null,
      overlayStateMessage: n,
      showEnableForecastButton: a
    })}

          <div class="detail-grid">
            <div class="detail-card">
              <span class="detail-label">${this._t("card.popup.detail.current")}</span>
              <span class="detail-value">
                ${Me(
      r.value,
      this._config?.power_decimals ?? 0,
      r.unit,
      this._t("common.unavailable"),
      l
    )}
              </span>
            </div>
            <div class="detail-card">
              <span class="detail-label">${this._t("card.popup.detail.estimated_power_now")}</span>
              <span class="detail-value">${s.display}</span>
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
    const t = this._getSystemEnergyEntityId(), r = this._resolveSummaryEnergy(e), s = this._resolveForecastMetricDisplay(
      "energy",
      this._config?.energy_decimals ?? 2,
      "kWh"
    ), o = this._isForecastOverlayEnabled() && !!s.entityId, n = s.entityId ? this._isForecastOverlayEnabled() ? null : this._t("card.popup.forecast.disabled_hint") : this._t("card.popup.forecast.default_sensor_not_found", {
      entity: s.expectedEntityId
    }), a = !this._isForecastOverlayEnabled() && !!s.entityId, l = this.hass?.locale?.language ?? "en";
    return y`
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
        overlayEntityId: o ? s.entityId : null,
        overlayStateMessage: n,
        showEnableForecastButton: a
      }
    ) : this._renderAggregatedPanelGraph(e, "energy", {
      overlayEntityId: o ? s.entityId : null,
      overlayStateMessage: n,
      showEnableForecastButton: a
    })}

          <div class="detail-grid">
            <div class="detail-card">
              <span class="detail-label">${this._t("card.popup.detail.current")}</span>
              <span class="detail-value">
                ${Me(
      r.value,
      this._config?.energy_decimals ?? 2,
      r.unit,
      this._t("common.unavailable"),
      l
    )}
              </span>
            </div>
            <div class="detail-card">
              <span class="detail-label">${this._t("card.popup.detail.estimated_energy_now")}</span>
              <span class="detail-value">${s.display}</span>
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
    const e = this._resolveCustomKpi(), t = e.title.length > 0 ? this._resolveCustomKpiTitle(e.title) : this._t("card.summary.custom_default_title"), r = this._getCustomKpiEntityId();
    return y`
      <div class="spv-popup-backdrop" @click=${this._closeCustomKpiPopup}>
        <div class="spv-popup" @click=${(s) => s.stopPropagation()}>
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
                ${r ? this._t("card.summary.custom_sensor") : this._t("common.not_configured")}
              </span>
            </div>
          </div>

          ${r ? this._renderPopupGraphForEntity(
      r,
      `${t} ${this._t("card.popup.history.power")}`,
      {
        fillStartWithFirstSample: !0,
        invertPrimaryValues: this._config?.invert_custom_kpi ?? !1
      }
    ) : y`<p class="graph-state">${this._t("card.popup.history.custom_not_configured")}</p>`}
        </div>
      </div>
    `;
  }
  _renderSystemHealthDialog(e) {
    const t = this._buildSystemHealthSections(e), r = t.length > 0;
    return y`
      <div class="spv-popup-backdrop" @click=${this._closeSystemHealthPopup}>
        <div class="spv-popup" @click=${(s) => s.stopPropagation()}>
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

          ${r ? t.map(
      (s) => y`
                  <div class="graph-section">
                    <div class="graph-header">
                      <span class="graph-title">${s.title}</span>
                    </div>
                    ${s.items.map(
        (o) => y`<p class="system-health-item">${o}</p>`
      )}
                  </div>
                `
    ) : y`<p class="system-health-item">${this._t("card.popup.system_health.everything_ok")}</p>`}
        </div>
      </div>
    `;
  }
  _renderMetricList(e, t) {
    return y`
      <div class="graph-section">
        <div class="graph-header">
          <span class="graph-title">${e}</span>
        </div>
        ${t.map(
      (r) => y`
            <p class="subtitle">
              ${r.label}: ${r.value}
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
  _renderPopupGraphForEntity(e, t, r = {}) {
    return y`
      <div class="graph-section">
        <div class="graph-header">
          <span class="graph-title">${t}</span>
          <div class="range-chips">
            ${qe.map(
      (s) => y`
                <button
                  class="range-chip ${this._popupGraphRangeHours === s ? "active" : ""}"
                  type="button"
                  @pointerdown=${this._preventRangeChipFocusScroll}
                  @mousedown=${this._preventRangeChipFocusScroll}
                  @click=${(o) => this._handlePopupGraphRangeChangeForEntity(
        o,
        e,
        s,
        r.overlayEntityId ?? void 0
      )}
                >
                  ${s}h
                </button>
              `
    )}
          </div>
        </div>
        ${e ? this._renderPopupGraphBody(e, r) : y`<p class="graph-state">${this._t("card.popup.history.graph_not_configured")}</p>`}
        ${r.overlayStateMessage ? y`<p class="graph-forecast-state">${r.overlayStateMessage}</p>` : b}
        ${r.showEnableForecastButton ? y`
              <div class="forecast-enable-row">
                <button
                  class="inline-button"
                  type="button"
                  @click=${this._enableForecastOverlayFromPopup}
                >
                  ${this._t("card.popup.forecast.enable_button")}
                </button>
              </div>
            ` : b}
      </div>
    `;
  }
  _renderPopupGraphBody(e, t = {}) {
    const r = this._getPopupGraphCacheKey(e, this._popupGraphRangeHours), s = this._popupGraphCache[r], o = s?.loading ?? !1, n = s?.error, a = s?.samples ?? [], l = this._adjustGraphSamplesForEntity(e, a), c = t.invertPrimaryValues ? l.map((d) => ({
      ts: d.ts,
      value: re(d.value * -1)
    })) : l, p = this._getUnitForEntity(e, "W");
    return this._renderPopupGraphBodyFromSamples(
      r,
      p,
      c,
      this._popupGraphRangeHours,
      o,
      n,
      t
    );
  }
  _renderPopupGraphBodyFromSamples(e, t, r, s, o, n, a = {}) {
    const l = this._fillRangeStartWithFirstSample(
      r,
      s,
      a.fillStartWithFirstSample ?? !1
    ), c = Qr(l, {
      rangeHours: s
    }), p = this._expandSinglePointRangeSamples(
      c,
      s
    ), d = a.overlayEntityId ?? null, h = d ? this._popupGraphCache[this._getPopupGraphCacheKey(d, s)] : void 0, u = h?.samples ?? [], f = d ? this._expandSinglePointRangeSamples(
      this._adjustGraphSamplesForEntity(d, u),
      s
    ) : [], g = d ? h?.loading ?? !1 : !1, P = d ? h?.error : void 0;
    if (o)
      return y`<p class="graph-state">${this._t("card.popup.history.loading")}</p>`;
    if (n)
      return y`<p class="graph-state">${n}</p>`;
    if (p.length === 0)
      return y`<p class="graph-state">${this._t("card.popup.history.no_data")}</p>`;
    const S = vt(p, mt), x = this._computeGraphStats(p), I = Date.now(), A = I - s * 60 * 60 * 1e3, $ = I, E = d && !g && !P && f.length > 0 ? vt(f, mt) : [], D = p.map((B) => B.value).filter((B) => Number.isFinite(B)), R = E.map((B) => B.value).filter((B) => Number.isFinite(B)), m = [...D, ...R], w = m.length > 0 ? Math.min(...m) : null, k = m.length > 0 ? Math.max(...m) : null, T = w === null || k === null ? null : w === k ? w - 1 : w, F = w === null || k === null ? null : w === k ? k + 1 : k, O = T !== null && F !== null ? {
      startTs: A,
      endTs: $,
      minValue: T,
      maxValue: F
    } : null, ee = O !== null ? this._buildAlignedGraphLinePath(S, O, 320, 132, 10) : "", v = O !== null ? this._buildAlignedGraphAreaPath(S, O, 320, 132, 10) : "", C = O !== null && E.length > 0 ? this._buildAlignedGraphLinePath(E, O, 320, 132, 10) : "", U = this._buildGraphHourTicks(
      {
        startTs: A,
        endTs: $
      },
      s
    ), K = this._buildGraphAxisTicks(U), te = x.max !== null && T !== null && F !== null ? this._toGraphY(x.max, T, F, 132, 10) : null, _e = x.median !== null && T !== null && F !== null ? this._toGraphY(x.median, T, F, 132, 10) : null, Se = x.min !== null && T !== null && F !== null ? this._toGraphY(x.min, T, F, 132, 10) : null, Ce = `spv-graph-${e.replace(/[^a-zA-Z0-9_-]/g, "-")}`, me = x.max !== null ? this._t("card.popup.history.max", {
      value: this._formatGraphPower(x.max, t)
    }) : null, Ke = x.median !== null ? this._t("card.popup.history.median", {
      value: this._formatGraphPower(x.median, t)
    }) : null, Ee = x.min !== null ? this._t("card.popup.history.min", {
      value: this._formatGraphPower(x.min, t)
    }) : null;
    return y`
      <div class="graph-box">
        ${me ? y`<span class="graph-overlay graph-overlay-max">${me}</span>` : b}
        ${Ke ? y`
              <span class="graph-overlay graph-overlay-median">
                ${Ke}
              </span>
            ` : b}
        ${Ee ? y`<span class="graph-overlay graph-overlay-min">${Ee}</span>` : b}
        <svg class="graph-svg" viewBox="0 0 320 132" preserveAspectRatio="none">
          <defs>
            <linearGradient id=${Ce} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="rgba(142, 208, 114, 0.48)"></stop>
              <stop offset="100%" stop-color="rgba(142, 208, 114, 0.04)"></stop>
            </linearGradient>
          </defs>
          <path
            d=${v}
            fill=${`url(#${Ce})`}
          ></path>
          ${U.map(
      (B) => z`
              <line
                class="graph-hour-line"
                x1=${B.x.toFixed(2)}
                x2=${B.x.toFixed(2)}
                y1="10"
                y2="122"
              ></line>
            `
    )}
          ${z`
            <path
            d=${ee}
            fill="none"
            stroke="rgba(186, 226, 106, 0.95)"
            stroke-width="2.2"
            stroke-linejoin="round"
            stroke-linecap="round"
            ></path>
          `}
          ${C.length > 0 ? z`
                <path
                  d=${C}
                  fill="none"
                  stroke="var(--spv-forecast-line)"
                  stroke-width="1.5"
                  stroke-dasharray="6 5"
                  stroke-linejoin="round"
                  stroke-linecap="round"
                  opacity="0.82"
                ></path>
              ` : b}
          ${te !== null ? z`
                <line
                  class="graph-stat-line graph-stat-max"
                  x1="10"
                  x2="310"
                  y1=${te.toFixed(2)}
                  y2=${te.toFixed(2)}
                ></line>
              ` : b}
          ${_e !== null ? z`
                <line
                  class="graph-stat-line graph-stat-median"
                  x1="10"
                  x2="310"
                  y1=${_e.toFixed(2)}
                  y2=${_e.toFixed(2)}
                ></line>
              ` : b}
          ${Se !== null ? z`
                <line
                  class="graph-stat-line graph-stat-min"
                  x1="10"
                  x2="310"
                  y1=${Se.toFixed(2)}
                  y2=${Se.toFixed(2)}
                ></line>
              ` : b}
        </svg>
      </div>
      <div class="graph-axis">
        ${K.map(
      (B) => y`
            <span class="graph-axis-label" style=${`left:${B.leftPercent.toFixed(2)}%;`}>
              ${B.label}
            </span>
          `
    )}
      </div>
      <div class="graph-meta">
        <span>
          ${this._t("card.popup.history.time_range", {
      start: this._formatGraphTime(A),
      end: this._formatGraphTime($)
    })}
        </span>
      </div>
      ${d && g ? y`<p class="graph-forecast-state">${this._t("card.popup.history.loading")}</p>` : b}
      ${d && !g && P ? y`<p class="graph-forecast-state">${P}</p>` : b}
      ${d && !g && !P && f.length === 0 ? y`<p class="graph-forecast-state">${this._t("card.popup.history.no_data")}</p>` : b}
    `;
  }
  _handlePopupGraphRangeChangeForEntity(e, t, r, s) {
    e.preventDefault(), e.stopPropagation();
    const o = this._captureScrollPositionsForPopupGraph(e);
    this._popupGraphRangeHours = r, this._scheduleCapturedScrollRestore(o), t && this._ensurePopupGraphLoadedByEntity(t, r, o), s && this._ensurePopupGraphLoadedByEntity(s, r, o);
  }
  _toggleTelemetryGraph(e, t, r) {
    e.preventDefault(), e.stopPropagation();
    const s = this._captureScrollPositionsForPopupGraph(e);
    if (this._telemetryGraphPanelId === t && this._telemetryGraphEntityId === r) {
      this._clearTelemetryGraph(), this._scheduleCapturedScrollRestore(s);
      return;
    }
    this._telemetryGraphPanelId = t, this._telemetryGraphEntityId = r, this._telemetryGraphRangeHours = 6, this._scheduleCapturedScrollRestore(s), this._ensurePopupGraphLoadedByEntity(r, this._telemetryGraphRangeHours, s);
  }
  _handleTelemetryGraphRangeChange(e, t, r) {
    e.preventDefault(), e.stopPropagation();
    const s = this._captureScrollPositionsForPopupGraph(e);
    this._telemetryGraphRangeHours = r, this._scheduleCapturedScrollRestore(s), this._ensurePopupGraphLoadedByEntity(t, r, s);
  }
  _clearTelemetryGraph() {
    this._telemetryGraphPanelId = null, this._telemetryGraphEntityId = null, this._telemetryGraphRangeHours = 6;
  }
  _getPopupGraphCacheKey(e, t) {
    return `${e}|${t}`;
  }
  _getPanelConfig(e) {
    return this._config?.panels.find((t) => t.id === e);
  }
  async _ensurePopupGraphLoaded(e, t, r) {
    if (!this._config || !this.hass)
      return;
    const o = this._getPanelConfig(e)?.power_entity;
    o && await this._ensurePopupGraphLoadedByEntity(o, t, r);
  }
  async _ensurePopupGraphLoadedByEntity(e, t, r) {
    if (!this._config || !this.hass)
      return;
    const s = this._getPopupGraphCacheKey(e, t), o = this._popupGraphCache[s], n = Date.now();
    if (o?.loading || o && !o.error && o.loadedAt && n - o.loadedAt < Ui)
      return;
    const a = ++this._popupGraphRequestToken;
    if (this._popupGraphLatestTokenByKey[s] = a, this._popupGraphCache = {
      ...this._popupGraphCache,
      [s]: {
        loading: !0,
        samples: o?.samples ?? [],
        loadedAt: o?.loadedAt
      }
    }, this._scheduleCapturedScrollRestore(r), !this.hass.callApi && !this.hass.callWS) {
      if (this._popupGraphLatestTokenByKey[s] !== a)
        return;
      this._popupGraphCache = {
        ...this._popupGraphCache,
        [s]: {
          loading: !1,
          samples: [],
          error: "Unable to load panel history",
          loadedAt: Date.now()
        }
      }, this._scheduleCapturedScrollRestore(r);
      return;
    }
    try {
      if (this._popupGraphLatestTokenByKey[s] !== a)
        return;
      const l = await this._loadPopupGraphRecorderSamples(e, t);
      if (this._popupGraphLatestTokenByKey[s] !== a)
        return;
      this._popupGraphCache = {
        ...this._popupGraphCache,
        [s]: {
          loading: !1,
          samples: l,
          loadedAt: Date.now()
        }
      }, this._scheduleCapturedScrollRestore(r);
    } catch (l) {
      if (this._popupGraphLatestTokenByKey[s] !== a)
        return;
      this._popupGraphCache = {
        ...this._popupGraphCache,
        [s]: {
          loading: !1,
          samples: [],
          error: `Unable to load panel history (${gt(ft(l))})`,
          loadedAt: Date.now()
        }
      }, this._scheduleCapturedScrollRestore(r);
    }
  }
  async _loadPopupGraphRecorderSamples(e, t) {
    if (!this.hass || !this.hass.callApi && !this.hass.callWS)
      throw new Error("Recorder API unavailable");
    const r = Date.now(), s = Math.min(168, t + 6), o = new Date(r - s * 60 * 60 * 1e3).toISOString(), n = new Date(r).toISOString(), a = this._getSharedHistorySamplesForRange(e, t);
    if (a) {
      const d = Ze(a, r, t), h = this._stabilizePopupRangeSamples(
        e,
        a,
        d,
        r,
        t
      );
      if (this._hasPopupRangeCoverage(h, r, t))
        return h;
      try {
        const u = await this._fetchRecorderHistoryRaw(o, n, [e]), f = this._parseRecorderResponse(u, s, [e])[e] ?? [], g = this._mergeGraphSampleSets(a, f), P = Ze(g, r, t);
        return this._stabilizePopupRangeSamples(e, g, P, r, t);
      } catch {
        return h;
      }
    }
    const l = await this._fetchRecorderHistoryRaw(o, n, [e]), c = this._parseRecorderResponse(l, s, [e])[e] ?? [], p = Ze(c, r, t);
    return this._stabilizePopupRangeSamples(e, c, p, r, t);
  }
  _getSharedHistorySamplesForRange(e, t) {
    if (!(this._config?.enable_array_checks ?? !1) || this._getHistoryHours() < t)
      return null;
    const r = this._historyByEntityId[e];
    return !r || r.length === 0 ? null : r;
  }
  _stabilizePopupRangeSamples(e, t, r, s, o) {
    const n = s - o * 60 * 60 * 1e3, a = [...t].sort((u, f) => u.ts - f.ts), l = [...r].sort((u, f) => u.ts - f.ts), c = a.filter((u) => u.ts < n).at(-1) ?? null, p = this._isForecastDefaultEntity(e), d = Number(this.hass?.states?.[e]?.state);
    if (l.length === 0)
      p && Number.isFinite(d) ? l.push({ ts: n, value: d }) : c ? l.push({ ts: n, value: c.value }) : Number.isFinite(d) && l.push({ ts: n, value: d });
    else if (l[0].ts > n && (c || p)) {
      const u = p ? l[0].value : c?.value ?? l[0].value;
      l.unshift({ ts: n, value: u });
    }
    const h = l[l.length - 1];
    if (!h && Number.isFinite(d))
      l.push({ ts: s, value: d });
    else if (h && h.ts < s) {
      const u = Number.isFinite(d) ? d : h.value;
      l.push({ ts: s, value: u });
    }
    return l.filter((u) => Number.isFinite(u.ts) && Number.isFinite(u.value)).sort((u, f) => u.ts - f.ts);
  }
  _hasPopupRangeCoverage(e, t, r) {
    if (e.length === 0)
      return !1;
    const s = t - r * 60 * 60 * 1e3, o = e[0].ts, n = e[e.length - 1].ts, a = 900 * 1e3;
    return o <= s + a && n >= t - a;
  }
  _mergeGraphSampleSets(...e) {
    const t = /* @__PURE__ */ new Map();
    for (const r of e)
      for (const s of r)
        !Number.isFinite(s.ts) || !Number.isFinite(s.value) || t.set(s.ts, s);
    return [...t.values()].sort((r, s) => r.ts - s.ts);
  }
  _getUnitForEntity(e, t) {
    const r = this.hass?.states?.[e]?.attributes?.unit_of_measurement;
    return typeof r == "string" && r.trim().length > 0 ? r : t;
  }
  _formatGraphPower(e, t) {
    const r = t.trim();
    if (e === null)
      return r ? `0 ${t}` : "0";
    const s = this.hass?.locale?.language ?? "en", o = re(e), n = r.toLowerCase(), a = n.includes("wh") || n.includes("kwh") ? this._config?.energy_decimals ?? 2 : this._config?.power_decimals ?? 0, l = new Intl.NumberFormat(s, {
      minimumFractionDigits: a,
      maximumFractionDigits: a
    }).format(o);
    return r ? `${l} ${t}` : l;
  }
  _computeGraphStats(e) {
    const t = e.map((a) => a.value).filter((a) => Number.isFinite(a)).sort((a, l) => a - l);
    if (t.length === 0)
      return { min: null, max: null, median: null };
    const r = t[0] ?? null, s = t[t.length - 1] ?? null, o = Math.floor(t.length / 2), n = t.length % 2 === 0 ? (t[o - 1] + t[o]) / 2 : t[o];
    return { min: r, max: s, median: n };
  }
  _buildGraphHourTicks(e, t) {
    if (e.startTs === null || e.endTs === null)
      return [];
    const r = e.startTs, s = e.endTs, o = Math.max(s - r, 1), n = 320, a = 10, l = n - a * 2, c = t === 1 ? 900 * 1e3 : t === 6 ? 3600 * 1e3 : 14400 * 1e3, p = [], d = (u) => {
      const f = new Date(u), g = `${f.getHours()}`.padStart(2, "0"), P = `${f.getMinutes()}`.padStart(2, "0");
      return t === 1 ? `${g}:${P}` : `${g}h`;
    };
    let h = Math.ceil(r / c) * c;
    for (; h < s; ) {
      const u = a + (h - r) / o * l;
      p.push({
        x: u,
        label: d(h)
      }), h += c;
    }
    if (t === 6 && p.length < 3) {
      const u = [0.25, 0.5, 0.75];
      for (const f of u) {
        const g = r + o * f, P = a + (g - r) / o * l;
        p.push({
          x: P,
          label: d(g)
        });
      }
    }
    return p.sort((u, f) => u.x - f.x), p;
  }
  _buildGraphAxisTicks(e) {
    if (e.length === 0)
      return [];
    const t = 10, s = 320 - t * 2;
    return e.map((o) => ({
      label: o.label,
      leftPercent: (o.x - t) / s * 100
    }));
  }
  _toGraphY(e, t, r, s, o) {
    const n = Math.max(r - t, 1), a = Math.max(s - o * 2, 1);
    return s - o - (e - t) / n * a;
  }
  _buildAlignedGraphLinePath(e, t, r, s, o) {
    const n = e.filter((h) => Number.isFinite(h.ts) && Number.isFinite(h.value)).sort((h, u) => h.ts - u.ts);
    if (n.length === 0)
      return "";
    const a = Math.max(t.endTs - t.startTs, 1), l = Math.max(t.maxValue - t.minValue, 1), c = Math.max(r - o * 2, 1), p = Math.max(s - o * 2, 1), d = [];
    for (const h of n) {
      const u = Math.min(Math.max(h.ts, t.startTs), t.endTs), f = o + (u - t.startTs) / a * c, g = (h.value - t.minValue) / l, P = s - o - Math.min(Math.max(g, 0), 1) * p, S = d[d.length - 1];
      S && Math.abs(S.x - f) < 0.01 && Math.abs(S.y - P) < 0.01 || d.push({ x: f, y: P });
    }
    return d.length === 0 ? "" : (d.length === 1 && d.push({ ...d[0] }), d.map(
      (h, u) => `${u === 0 ? "M" : "L"}${h.x.toFixed(2)},${h.y.toFixed(2)}`
    ).join(" "));
  }
  _buildAlignedGraphAreaPath(e, t, r, s, o) {
    const n = this._buildAlignedGraphLinePath(e, t, r, s, o);
    if (!n)
      return "";
    const a = e.filter((g) => Number.isFinite(g.ts) && Number.isFinite(g.value)).sort((g, P) => g.ts - P.ts);
    if (a.length === 0)
      return "";
    const l = Math.max(t.endTs - t.startTs, 1), c = Math.max(r - o * 2, 1), p = Math.min(Math.max(a[0].ts, t.startTs), t.endTs), d = Math.min(
      Math.max(a[a.length - 1].ts, t.startTs),
      t.endTs
    ), h = o + (p - t.startTs) / l * c, u = o + (d - t.startTs) / l * c, f = s - o;
    return `${n} L${u.toFixed(2)},${f.toFixed(2)} L${h.toFixed(2)},${f.toFixed(2)} Z`;
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
    }, r = e.inverterCount + e.errorCount;
    return r > 0 ? {
      label: `${r} Fault${r === 1 ? "" : "s"}`,
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
    const t = e.panels.filter((p) => !p.hiddenSlot), r = (p) => t.filter((d) => d.status === p).map((d) => `Panel on ${this._formatSlotLabel(d.slotIndex)} (${d.label}): ${d.reason}`), s = [], o = r("inverter");
    o.length > 0 && s.push({ title: "Inverter", items: o });
    const n = r("error");
    n.length > 0 && s.push({ title: "Error", items: n });
    const a = r("deviation");
    a.length > 0 && s.push({ title: "Deviation", items: a });
    const l = r("offline");
    l.length > 0 && s.push({ title: "Unavailable", items: l });
    const c = r("unconfigured");
    return c.length > 0 && s.push({ title: "Needs setup", items: c }), s;
  }
  _computeRenderedColumns(e, t) {
    const r = Math.max(1, Math.floor(e)), s = this._cardWidth > 0 ? this._cardWidth : t ?? 980, o = t ? Math.min(s, t) : s;
    if (!Number.isFinite(o) || o <= 0)
      return r;
    const n = Math.max(120, o - 40), a = o <= 560 ? 8 : 10, l = o <= 760, c = l ? Math.min(r, 3) : r, p = this._getPanelWidthCapPx(), d = p !== null ? p : l ? 100 : Math.max(130, Math.min(220, n * 0.32)), h = Math.floor((n + a) / (d + a));
    return Math.max(1, Math.min(c, h || 1));
  }
  _computeRenderedRows(e, t) {
    const r = Math.max(1, e), s = Math.max(1, t);
    return Math.max(1, Math.ceil(r / s));
  }
  _computeWidthBasedPanelHeight(e, t) {
    const s = this._computeTileWidthPx(e, t) * 0.62;
    return Math.round(Math.min(220, Math.max(92, s)));
  }
  _computePanelWidthPx(e, t) {
    const r = this._computeTileWidthPx(e, t);
    return Math.max(96, Math.round(r));
  }
  _computeTileWidthPx(e, t) {
    const r = this._cardWidth > 0 ? this._cardWidth : t ?? 980, s = t ? Math.min(r, t) : r, o = s <= 560 ? 8 : 10, n = Math.max(120, s - 40), a = Math.max(1, e), l = (n - Math.max(0, a - 1) * o) / a;
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
  _computePanelHeightPx(e, t, r = this._config?.columns ?? 3, s) {
    const o = this._computeWidthBasedPanelHeight(r, s);
    if (!t || !Number.isFinite(t))
      return o;
    const n = Math.max(1, e), a = 250, l = 36, c = Math.max(n - 1, 0) * 10, d = (t - a - l - c) / n;
    if (!Number.isFinite(d))
      return o;
    const h = Math.min(240, Math.max(96, d)), u = Math.min(h, o * 1.6);
    return Math.round(Math.min(220, Math.max(92, u)));
  }
  _computePanelScale(e) {
    const r = e / 128, s = Math.min(1.28, Math.max(0.76, r));
    return Number(s.toFixed(3));
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
  _shouldShowPerformance(e, t, r) {
    return e.performancePercent === null || e.ratedPowerW === null ? !1 : t >= 94 && r >= 110;
  }
  _formatPanelPerformanceText(e, t, r, s = this._buildPanelPerformanceLabelCandidates(e)) {
    if (!s)
      return "";
    const o = this._computePanelScale(r), a = Math.min(0.96, Math.max(0.62, 0.72 * o)) * 16;
    return Ri({
      candidates: s,
      panelWidthPx: t,
      panelHeightPx: r,
      fontPx: a,
      reservedRightPx: Vi,
      measureTextWidthPx: (l, c) => this._measureTextWidthPx(l, c)
    }).text;
  }
  _buildPanelPerformanceLabelCandidates(e) {
    if (e.performancePercent === null || e.ratedPowerW === null)
      return null;
    const t = e.performancePercent.toFixed(0), r = e.ratedPowerW.toFixed(0);
    return [
      {
        variant: "full",
        text: this._t("card.panel.performance_full", { percent: t, rated: r })
      },
      {
        variant: "medium",
        text: this._t("card.panel.performance_medium", { percent: t, rated: r })
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
      const s = document.createElement("canvas");
      ce._textMeasureContext = s.getContext("2d");
    }
    const r = ce._textMeasureContext;
    return r ? (r.font = `500 ${t}px system-ui, -apple-system, "Segoe UI", sans-serif`, r.measureText(e).width) : e.length * t * 0.52;
  }
  _handlePanelClick(e) {
    e.hiddenSlot || (this._config?.panel_tap_action ?? "details") === "details" && (this._showLivePowerPopup = !1, this._showEnergyPopup = !1, this._showCustomKpiPopup = !1, this._showSystemHealthPopup = !1, this._selectedPanelId = e.id, this._popupGraphRangeHours = 6, this._clearTelemetryGraph(), this._kpiCompareExpanded = { power: !1, energy: !1 }, this._kpiCompareRangeHours = { power: 6, energy: 6 }, this._ensurePopupGraphLoaded(e.id, 6));
  }
  _resolveUnit(e, t) {
    if (!this._config)
      return t;
    for (const r of this._config.panels) {
      const s = r[e];
      if (!s)
        continue;
      const o = this.hass?.states?.[s]?.attributes?.unit_of_measurement;
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
    return ni(this.hass, e);
  }
  _isForecastDefaultEntity(e) {
    return e === Qe("power") || e === Qe("energy");
  }
  _isForecastOverlayEnabled() {
    return this._config?.enable_forecast_overlay ?? !1;
  }
  _resolveForecastMetricDisplay(e, t, r) {
    const s = Qe(e), o = this._getForecastEntityId(e);
    if (!o)
      return {
        expectedEntityId: s,
        entityId: null,
        value: null,
        unit: r,
        display: this._t("common.not_configured")
      };
    const n = this._getUnitForEntity(o, r), a = Number(this.hass?.states?.[o]?.state), l = Number.isFinite(a) ? re(a) : null, c = this.hass?.locale?.language ?? "en";
    return {
      expectedEntityId: s,
      entityId: o,
      value: l,
      unit: n,
      display: Me(l, t, n, this._t("common.unavailable"), c)
    };
  }
  _resolveSummaryPower(e) {
    const t = this._getSystemPowerEntityId();
    if (t) {
      const r = this.hass?.states?.[t], s = Number(r?.state), o = Number.isFinite(s) ? s : null;
      return {
        value: o === null ? null : this._config?.invert_system_power ? re(o * -1) : re(o),
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
      const r = this.hass?.states?.[t], s = Number(r?.state);
      return {
        value: Number.isFinite(s) ? s : null,
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
    const e = this._config?.custom_kpi_title, t = e !== void 0 ? e : "Custom KPI", r = this._getCustomKpiEntityId();
    if (!r)
      return { title: t, value: "Not configured" };
    const s = this.hass?.states?.[r];
    if (!s)
      return { title: t, value: "Unavailable" };
    const o = s.state?.toString().trim().toLowerCase();
    if (!o || o === "unknown" || o === "unavailable")
      return { title: t, value: "Unavailable" };
    const n = Number(s.state);
    if (Number.isFinite(n)) {
      const a = this.hass?.locale?.language ?? "en", l = this._getUnitForEntity(r, ""), c = this._config?.invert_custom_kpi ? re(n * -1) : re(n), p = ri(
        String(c),
        a,
        this._config?.custom_kpi_decimals ?? 0,
        l
      );
      return {
        title: t,
        value: p ?? s.state
      };
    }
    return { title: t, value: s.state };
  }
  _getCustomKpiEntityId() {
    const e = this._config?.custom_kpi_entity?.trim();
    return e && e.length > 0 ? e : null;
  }
  _handlePopupCloseClick(e, t) {
    e.preventDefault(), e.stopPropagation(), t();
  }
  _closeAllPopups() {
    this._selectedPanelId = null, this._showLivePowerPopup = !1, this._showEnergyPopup = !1, this._showCustomKpiPopup = !1, this._showSystemHealthPopup = !1, this._clearTelemetryGraph(), this._clearPopupScrollRestore();
  }
  _clearPopupScrollRestore() {
    const e = this._popupScrollRestore;
    e?.frameId !== null && typeof window < "u" && window.cancelAnimationFrame(e.frameId), this._popupScrollRestore = null, this._popupScrollRestoreToken++;
  }
  _captureScrollPositionsForPopupGraph(e) {
    const s = (e?.currentTarget instanceof HTMLElement ? e.currentTarget : e?.target instanceof HTMLElement ? e.target : null)?.closest(".spv-popup") ?? null ?? this.renderRoot.querySelector(".spv-popup");
    if (!s)
      return this._popupScrollRestore = null, null;
    const o = ++this._popupScrollRestoreToken;
    return this._popupScrollRestore = {
      token: o,
      popup: s,
      top: s.scrollTop,
      left: s.scrollLeft,
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
    const r = this._popupScrollRestore;
    if (!(!r || r.token !== e)) {
      if (r.expiresAt < Date.now()) {
        this._popupScrollRestore = null;
        return;
      }
      r.framesRemaining = Math.max(r.framesRemaining, t), r.frameId === null && (r.frameId = window.requestAnimationFrame(() => {
        const s = this._popupScrollRestore;
        if (!(!s || s.token !== e)) {
          if (s.frameId = null, !this._hasPopupOpen()) {
            this._popupScrollRestore = null;
            return;
          }
          if (s.expiresAt < Date.now()) {
            this._popupScrollRestore = null;
            return;
          }
          if (s.popup.isConnected && (s.popup.scrollTop = s.top, s.popup.scrollLeft = s.left), s.framesRemaining = Math.max(0, s.framesRemaining - 1), s.framesRemaining > 0) {
            this._scheduleCapturedScrollRestore(e, s.framesRemaining);
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
      return b;
    const r = this._getAvailableQuickSetupPowerEntities(e.id), s = !(t.enabled ?? !0);
    return y`
      <div class="inline-config">
        <p class="subtitle">Quick Setup:</p>
        <ha-selector
          .hass=${this.hass}
          .value=${t.power_entity ?? ""}
          .required=${!1}
          .selector=${{
      entity: {
        domain: "sensor",
        include_entities: r
      }
    }}
          .label=${"Select panel power sensor"}
          @value-changed=${(o) => this._updatePanelConfigFromCard(e.id, "power_entity", o.detail.value)}
        ></ha-selector>
        ${r.length === 0 ? y`<p class="subtitle">No available W sensors found.</p>` : b}
        <div class="toggle">
          <ha-formfield label="Disable Panel (hide but keep slot when off)">
            <ha-switch
              .checked=${s}
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
    const r = this._config.panels.find((n) => n.id === e)?.power_entity, s = new Set(
      this._config.panels.filter((n) => n.id !== e).map((n) => n.power_entity).filter((n) => !!n)
    ), o = [];
    for (const n of Object.values(this.hass.states)) {
      if (!n.entity_id.startsWith("sensor."))
        continue;
      const a = n.attributes?.unit_of_measurement;
      typeof a != "string" || a.trim().toLowerCase() !== "w" || s.has(n.entity_id) && n.entity_id !== r || o.push(n.entity_id);
    }
    return typeof r == "string" && r.length > 0 && !o.includes(r) && o.push(r), o.sort(q);
  }
  _updatePanelConfigFromCard(e, t, r) {
    if (!this._config)
      return;
    const s = this._config.panels.findIndex((a) => a.id === e);
    if (s < 0)
      return;
    const o = this._config.panels.map((a, l) => {
      if (l !== s)
        return a;
      const c = { ...a, [t]: r };
      if (t === "power_entity") {
        const p = a.power_entity, d = typeof r == "string" ? r.trim() : "", h = this._getEntityFriendlyName(d);
        h && this._shouldAutoRenamePanelName(a.name, a.id, p) && (c.name = h);
      }
      return c;
    }), n = Re({
      ...this._config,
      panels: o
    });
    this._commitConfigFromCard(n), t === "power_entity" && (typeof r == "string" ? r.trim() : "").length > 0 && (this._selectedPanelId = e, this._ensurePopupGraphLoaded(e, this._popupGraphRangeHours));
  }
  _getEntityFriendlyName(e) {
    const t = e?.trim();
    if (!t)
      return;
    const s = this.hass?.states?.[t]?.attributes?.friendly_name;
    if (typeof s != "string")
      return;
    const o = s.trim();
    return o.length > 0 ? o : void 0;
  }
  _shouldAutoRenamePanelName(e, t, r) {
    const s = e?.trim() ?? "";
    if (!s || s === t || /^panel\s+\d+$/i.test(s))
      return !0;
    const o = this._getEntityFriendlyName(r);
    return !!(o && s === o);
  }
  _handleDragStart(e, t) {
    this._dragSourceSlotIndex = t, e.dataTransfer && (e.dataTransfer.effectAllowed = "move", e.dataTransfer.setData("text/plain", String(t)));
  }
  _handleDrop(e, t) {
    if (e.preventDefault(), !this._config)
      return;
    const r = this._dragSourceSlotIndex ?? Number(e.dataTransfer?.getData("text/plain") ?? Number.NaN);
    if (!Number.isFinite(r) || r === t)
      return;
    const s = [...this._config.panels], o = s[r], n = s[t];
    !o || !n || (s[r] = n, s[t] = o, this._commitConfigFromCard(
      Re({
        ...this._config,
        panels: s
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
      new CustomEvent(Bi, {
        detail: { config: e }
      })
    ), this._persistConfigToLovelace(e);
  }
  async _persistConfigToLovelace(e) {
    if (!this.hass?.callWS)
      return;
    const t = ++this._persistConfigToken, r = this._findLovelaceContext(), s = this._resolveDashboardUrlPath(r);
    try {
      const o = r && typeof r.config == "object" ? r.config : await this.hass.callWS({
        type: "lovelace/config",
        ...s ? { url_path: s } : {}
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
        ...s ? { url_path: s } : {},
        config: n
      }), t !== this._persistConfigToken)
        return;
      r && (r.config = n), this._sourceConfigRef = void 0;
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
      const r = t, s = typeof r.getRootNode == "function" ? r.getRootNode() : null, o = s && "host" in s ? s.host : null;
      if (o && o !== t) {
        t = o;
        continue;
      }
      t = r.parentElement ?? null;
    }
    return null;
  }
  _resolveDashboardUrlPath(e) {
    const t = e?.urlPath?.trim();
    if (t)
      return t;
    if (typeof window > "u")
      return;
    const r = window.location.pathname.replace(/^\/+/, "").split("/")[0]?.trim();
    return r && r.length > 0 ? r : void 0;
  }
  _replaceCardConfigInDashboardConfig(e, t) {
    const r = this._replaceFirstMatch(
      e,
      (o) => !!this._sourceConfigRef && o === this._sourceConfigRef,
      t
    );
    if (r.replaced)
      return {
        config: r.value,
        replaced: !0
      };
    const s = this._replaceFirstMatch(
      e,
      (o) => this._matchesCurrentCardSignature(o),
      t
    );
    return {
      config: s.value,
      replaced: s.replaced
    };
  }
  _replaceFirstMatch(e, t, r) {
    let s = !1;
    const o = (n) => {
      if (s)
        return n;
      if (t(n))
        return s = !0, r;
      if (Array.isArray(n)) {
        let c = !1;
        const p = n.map((d) => {
          const h = o(d);
          return h !== d && (c = !0), h;
        });
        return c ? p : n;
      }
      if (typeof n != "object" || n === null)
        return n;
      let a = !1;
      const l = {};
      for (const [c, p] of Object.entries(n)) {
        const d = o(p);
        l[c] = d, d !== p && (a = !0);
      }
      return a ? l : n;
    };
    return { value: o(e), replaced: s };
  }
  _matchesCurrentCardSignature(e) {
    if (!this._config || typeof e != "object" || e === null)
      return !1;
    const t = e;
    if (t.type !== this._config.type)
      return !1;
    const r = Number(t.rows), s = Number(t.columns);
    if (r !== this._config.rows || s !== this._config.columns)
      return !1;
    const n = (Array.isArray(t.panels) ? t.panels : []).map(
      (l) => typeof l == "object" && l !== null && typeof l.id == "string" ? l.id : ""
    ).sort().join("|"), a = this._config.panels.map((l) => l.id).sort().join("|");
    return n.length > 0 && n === a;
  }
  _adjustGraphSamplesForEntity(e, t) {
    const r = this._getSystemPowerEntityId(), s = (this._config?.invert_system_power ?? !1) && !!r && e === r;
    return t.map((o) => ({
      ts: o.ts,
      value: re(s ? o.value * -1 : o.value)
    }));
  }
  _expandSinglePointRangeSamples(e, t) {
    if (e.length !== 1)
      return e;
    const r = e[0].value, s = Date.now();
    return [
      { ts: s - t * 60 * 60 * 1e3, value: r },
      { ts: s, value: r }
    ];
  }
  _fillRangeStartWithFirstSample(e, t, r) {
    if (!r || e.length === 0)
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
    const t = this.hass?.states?.[e], r = t?.state?.toString().trim();
    if (!r)
      return;
    const s = Date.parse(r);
    if (Number.isFinite(s))
      return String(s);
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
    if (!/^[-+]?\d+(\.\d+)?$/.test(r))
      return r;
  }
  _historyCacheKey() {
    return `${zi}${this._getHistorySignature()}`;
  }
  _pruneSamples(e, t = this._getHistoryHours()) {
    const s = Date.now() - t * 60 * 60 * 1e3;
    return e.filter((o) => o.ts >= s && Number.isFinite(o.value)).sort((o, n) => o.ts - n.ts);
  }
  _syncLiveSamplesFromHass() {
    if (!this.hass || !this._config)
      return;
    let e = !1;
    const t = Date.now();
    for (const r of this._config.panels) {
      const s = r.power_entity;
      if (!s)
        continue;
      const o = this.hass.states[s], n = Number(o?.state);
      if (!Number.isFinite(n))
        continue;
      const l = [...this._historyByEntityId[s] ?? []], c = l[l.length - 1];
      (!c || Math.abs(t - c.ts) > 6e4 || Math.abs(c.value - n) > 0.01) && (l.push({ ts: t, value: n }), this._historyByEntityId[s] = this._pruneSamples(l), e = !0);
    }
    e && this._saveHistoryCache();
  }
  _saveHistoryCache() {
    if (typeof window > "u" || !this._config)
      return;
    const e = {
      v: sr,
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
        if (t.v !== sr || !t.samples)
          return;
        const r = {};
        for (const [s, o] of Object.entries(t.samples))
          r[s] = this._pruneSamples(o);
        this._historyByEntityId = r;
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
    const t = this._getHistoryQuerySignature(), r = Date.now();
    if (this._historyState === "loading" && t === this._historyQuerySignature) {
      this._historySignature = e;
      return;
    }
    if (t === this._historyQuerySignature && this._historyState !== "idle" && r - this._historyLastLoadMs < Wi) {
      this._historySignature = e;
      return;
    }
    this._historySignature = e, this._historyQuerySignature = t, this._historyLastLoadMs = r, this._historyByEntityId = {}, this._loadHistoryCache();
    const s = ++this._historyLoadToken;
    this._loadHistoryFromRecorder(s);
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
    const r = Date.now(), s = new Date(r - this._getHistoryHours() * 60 * 60 * 1e3).toISOString(), o = new Date(r).toISOString();
    this._historyState = "loading", this._historyStateReason = void 0, this.requestUpdate();
    try {
      const n = await this._fetchRecorderHistoryRaw(s, o, t);
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
  async _fetchRecorderHistoryRaw(e, t, r) {
    if (!this.hass)
      throw new Error("Home Assistant context unavailable");
    const s = [], o = r.join(","), n = `history/period/${e}`, a = `history/period/${encodeURIComponent(e)}`, l = [], c = {
      end_time: t,
      filter_entity_id: o,
      no_attributes: !0,
      significant_changes_only: !1,
      minimal_response: !0
    }, p = {
      end_time: t,
      filter_entity_id: o
    };
    if (l.push({ path: n, params: p }), l.push({ path: n, params: c }), a !== n && (l.push({ path: a, params: p }), l.push({ path: a, params: c })), this.hass.callApi)
      for (const d of l)
        try {
          return await this.hass.callApi("GET", d.path, d.params);
        } catch (h) {
          s.push(h);
        }
    if (this.hass.callWS) {
      const d = [
        {
          type: "history/history_during_period",
          start_time: e,
          end_time: t,
          entity_ids: r,
          no_attributes: !0,
          significant_changes_only: !1,
          minimal_response: !0
        },
        {
          type: "history/history_during_period",
          start_time: e,
          end_time: t,
          entity_ids: r
        }
      ];
      for (const h of d)
        try {
          return await this.hass.callWS(h);
        } catch (u) {
          s.push(u);
        }
    }
    throw s.length > 0 ? s[s.length - 1] : new Error("Recorder API unavailable");
  }
  _parseRecorderResponse(e, t = this._getHistoryHours(), r = []) {
    const s = {}, o = (l) => {
      if (typeof l == "number" && Number.isFinite(l))
        return l > 1e11 ? l : l * 1e3;
      if (typeof l == "string" && l.trim().length > 0) {
        const c = l.trim(), p = Number(c);
        if (Number.isFinite(p) && /^\d+(\.\d+)?$/.test(c))
          return p > 1e11 ? p : p * 1e3;
        const d = Date.parse(c);
        if (Number.isFinite(d))
          return d;
      }
      return Number.NaN;
    }, n = (l, c) => {
      if (!Array.isArray(l) || l.length === 0)
        return;
      let p = c;
      for (const d of l) {
        if (Array.isArray(d)) {
          if (!p || d.length < 2)
            continue;
          const S = o(d[0]), x = Number(d[1]), I = o(d[1]), A = Number(d[0]);
          let $ = S, E = x;
          if ((!Number.isFinite($) || !Number.isFinite(E)) && ($ = I, E = A), !Number.isFinite($) || !Number.isFinite(E))
            continue;
          s[p] || (s[p] = []), s[p].push({ ts: $, value: E });
          continue;
        }
        if (typeof d != "object" || d === null)
          continue;
        const h = d, u = typeof h.entity_id == "string" && h.entity_id.length > 0 ? h.entity_id : typeof h.e == "string" && h.e.length > 0 ? h.e : p;
        if (!u)
          continue;
        p = u;
        const f = Number(h.state ?? h.s);
        if (!Number.isFinite(f))
          continue;
        const g = typeof h.last_changed == "string" ? h.last_changed : typeof h.last_updated == "string" ? h.last_updated : h.lc ?? h.lu ?? h.last_changed_ts ?? h.last_updated_ts ?? h.ts, P = o(g);
        Number.isFinite(P) && (s[u] || (s[u] = []), s[u].push({ ts: P, value: f }));
      }
    }, a = typeof e == "object" && e !== null && "result" in e ? e.result : e;
    if (Array.isArray(a))
      for (const [l, c] of a.entries())
        n(c, r[l]);
    else if (typeof a == "object" && a !== null)
      for (const [l, c] of Object.entries(
        a
      ))
        n(c, l);
    else
      return s;
    for (const [l, c] of Object.entries(s))
      s[l] = this._pruneSamples(c, t);
    return s;
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
  _telemetryGraphPanelId: { state: !0 },
  _telemetryGraphEntityId: { state: !0 },
  _telemetryGraphRangeHours: { state: !0 },
  _kpiCompareExpanded: { state: !0 },
  _kpiCompareRangeHours: { state: !0 },
  _kpiCompareCache: { state: !0 }
}, ce.styles = [Ct`
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

  `, Si];
let bt = ce;
class Zr extends bt {
}
customElements.get("solar-panel-visualizer") || customElements.define("solar-panel-visualizer", Zr);
if (!customElements.get("solar-panel-visualizer-card")) {
  class i extends Zr {
  }
  customElements.define("solar-panel-visualizer-card", i);
}
const Yi = /[._\-\s]+/, qi = /^\d+$/, Jr = /^(?=.*[a-z])(?=.*\d)[a-z0-9]{6,}$/i, es = /* @__PURE__ */ new Set([
  "sensor",
  "power",
  "current",
  "voltage",
  "temperature",
  "temp",
  "device",
  "serial",
  "inverter",
  "panel",
  "map",
  "ac",
  "dc",
  "pv"
]), Xi = /* @__PURE__ */ new Set([
  "status",
  "state",
  "mode",
  "operation",
  "operating",
  "work",
  "working",
  "run",
  "running",
  "fault",
  "alarm",
  "error"
]), Qi = /* @__PURE__ */ new Set(["sensor", "binary_sensor"]), Zi = /* @__PURE__ */ new Set([
  "battery",
  "bms",
  "cloud",
  "connection",
  "communication",
  "firmware",
  "grid",
  "meter",
  "network",
  "online",
  "update",
  "wifi"
]), $e = (i, e) => {
  if (e === "friendlyName") {
    const t = i.friendlyName?.trim();
    if (t)
      return t;
  }
  return i.entityId;
}, ze = (i) => i.split(Yi).map((e) => e.trim()).filter((e) => e.length > 0), Ji = (i, e, t = {}) => {
  if (i.length < (t.minCandidates ?? 4))
    return null;
  const r = i.map(
    (o) => ze($e(o, e))
  ), s = Math.min(...r.map((o) => o.length));
  if (s < 3)
    return null;
  for (let o = s - 1; o > 0; o -= 1) {
    const n = r.map((p) => p[o].toLowerCase()), a = new Set(n);
    if (!t.allowSingleGroup && a.size <= 1 || a.size >= i.length || [...a].every((p) => es.has(p)) || !t.allowNumericGroup && [...a].every((p) => qi.test(p)))
      continue;
    const l = /* @__PURE__ */ new Map();
    for (const p of n)
      l.set(p, (l.get(p) ?? 0) + 1);
    if (!(![...l.values()].some((p) => p > 1) || new Set(
      r.map((p) => p[o - 1].toLowerCase())
    ).size !== 1))
      return { sortBy: e, tokenIndex: o };
  }
  return null;
}, We = (i, e = {}) => {
  const t = ["entityId", "friendlyName"];
  for (const r of t) {
    const s = Ji(i, r, e);
    if (s)
      return s;
  }
  return null;
}, ts = (i, e) => [...i].sort((t, r) => {
  const s = q(
    $e(t, e),
    $e(r, e)
  );
  return s !== 0 ? s : q(t.entityId, r.entityId);
}), or = (i, e, t = {}) => {
  const r = We(i, t);
  return r ? [...i].sort((s, o) => {
    const n = ze($e(s, r.sortBy)), a = ze($e(o, r.sortBy)), l = n[r.tokenIndex] ?? "", c = a[r.tokenIndex] ?? "", p = q(l, c);
    if (p !== 0)
      return p;
    const d = n.filter((f, g) => g !== r.tokenIndex).join(" "), h = a.filter((f, g) => g !== r.tokenIndex).join(" "), u = q(d, h);
    return u !== 0 ? u : q(s.entityId, o.entityId);
  }) : ts(i, e);
}, eo = (i, e = "auto", t = "entityId") => (e === "grouped" ? or(i, t, { allowNumericGroup: !0 }) : e === "auto" && We(i) ? or(i, t) : ts(
  i,
  e === "friendlyName" || e === "entityId" ? e : t
)).map((s) => ({
  entityId: s.entityId,
  friendlyName: s.friendlyName
})), rs = (i, e, t, r) => {
  const s = e.trim().replace(/\*+$/, "");
  if (s.length === 0)
    return [];
  const o = s.startsWith("sensor."), n = s.toLowerCase(), a = [];
  for (const [l, c] of Object.entries(i)) {
    if (!l.startsWith("sensor."))
      continue;
    const p = c.attributes?.unit_of_measurement;
    if (typeof p != "string")
      continue;
    const d = p.trim().toLowerCase();
    if (!t(d))
      continue;
    const h = typeof c.attributes?.friendly_name == "string" ? c.attributes.friendly_name : void 0, u = h?.trim().toLowerCase();
    (o ? l.startsWith(s) : u?.includes(n)) && a.push({
      entityId: l,
      friendlyName: h
    });
  }
  return eo(
    a,
    r,
    o ? "entityId" : "friendlyName"
  );
}, ss = (i, e, t, r, s, o = "auto") => {
  const n = r.trim().replace(/\*+$/, "");
  if (n.length === 0)
    return {
      panels: [...i],
      matched: 0,
      filled: 0,
      skipped: i.length
    };
  const a = rs(
    e,
    n,
    s,
    o
  ), l = new Set(
    i.map((f) => f[t]).filter((f) => typeof f == "string" && f.length > 0)
  ), c = a.map((f) => f.entityId).filter((f) => !l.has(f));
  let p = 0, d = 0, h = 0;
  return {
    panels: i.map((f) => {
      const g = { ...f };
      if (g.enabled === !1)
        return h += 1, g;
      const P = g[t];
      if (typeof P == "string" && P.trim().length > 0)
        return h += 1, g;
      const S = c[p];
      return S ? (g[t] = S, p += 1, d += 1, g) : (h += 1, g);
    }),
    matched: a.length,
    filled: d,
    skipped: h
  };
}, to = (i, e, t, r, s = "auto") => {
  const o = t.trim().replace(/\*+$/, "");
  if (o.length === 0)
    return {
      panels: [...i],
      matched: 0,
      filled: 0,
      skipped: i.length
    };
  const n = rs(
    e,
    o,
    r,
    s
  ), a = i.filter((f) => f.power_entity?.trim()).map((f) => {
    const g = f.power_entity ? e[f.power_entity] : void 0;
    return {
      entityId: f.power_entity ?? "",
      friendlyName: ue(g)
    };
  }), l = We(a, {
    allowNumericGroup: !0,
    allowSingleGroup: !0,
    minCandidates: 2
  });
  if (!l)
    return ss(
      i,
      e,
      "energy_entity",
      o,
      r,
      s
    );
  let c = 0, p = 0;
  const d = /* @__PURE__ */ new Set(), h = n.flatMap((f) => {
    const g = e[f.entityId];
    return g ? [{
      entityId: f.entityId,
      entity: g,
      tokens: Ue(f.entityId, g)
    }] : [];
  });
  return {
    panels: i.map((f) => {
      const g = { ...f };
      if (g.enabled === !1)
        return p += 1, g;
      const P = ct(g, e, l), S = g.energy_entity;
      if (typeof S == "string" && S.trim().length > 0)
        return P && d.add(P), p += 1, g;
      const x = po(
        g,
        i,
        e,
        l,
        P
      ), I = ns(h, P);
      if (I.length === 1) {
        const $ = P ?? I[0].entityId;
        return d.has($) ? (p += 1, g) : (g.energy_entity = I[0].entityId, d.add($), c += 1, g);
      }
      const A = st(I, ($) => {
        const E = pt($.tokens, P ?? void 0);
        return os(x, E);
      });
      return A ? (g.energy_entity = A.entityId, c += 1, g) : (p += 1, g);
    }),
    matched: n.length,
    filled: c,
    skipped: p
  };
}, at = (i) => typeof i.attributes?.unit_of_measurement == "string" ? i.attributes.unit_of_measurement.trim().toLowerCase() : "", lt = (i) => typeof i.attributes?.device_class == "string" ? i.attributes.device_class.trim().toLowerCase() : "", nr = (i) => ["w", "kw"].includes(at(i)) || lt(i) === "power", ar = (i) => ["v", "kv", "mv"].includes(at(i)) || lt(i) === "voltage", lr = (i) => ["a", "ma"].includes(at(i)) || lt(i) === "current", ro = (i) => ["°c", "°f", "℃", "℉", "c", "f"].includes(at(i)) || lt(i) === "temperature", ue = (i) => {
  const e = i?.attributes?.friendly_name;
  if (typeof e != "string")
    return;
  const t = e.trim();
  return t.length > 0 ? t : void 0;
}, is = (i, e) => typeof e.entity_id == "string" && e.entity_id.trim().length > 0 ? e.entity_id : i, so = (i) => i.split(".")[0] ?? "", Ue = (i, e) => ze(`${i} ${ue(e) ?? ""}`).map((t) => t.toLowerCase()), pt = (i, e) => i.filter((t) => e && t === e.toLowerCase() || es.has(t) ? !1 : t.length > 0), os = (i, e) => {
  const t = new Set(e);
  return i.filter((r) => t.has(r)).length;
}, Je = (i, e) => {
  const t = new Set(i.tokens);
  return e.some((r) => t.has(r));
}, ae = (i, e) => Object.entries(i).map(([t, r]) => ({
  entityId: is(t, r),
  entity: r
})).filter(({ entityId: t, entity: r }) => t.startsWith("sensor.") && e(r)).map(({ entityId: t, entity: r }) => ({
  entityId: t,
  entity: r,
  tokens: Ue(t, r)
})).sort((t, r) => q(t.entityId, r.entityId)), io = (i) => i.tokens.some((e) => Xi.has(e)), oo = (i) => Object.entries(i).map(([e, t]) => ({
  entityId: is(e, t),
  entity: t
})).filter(({ entityId: e }) => Qi.has(so(e))).map(({ entityId: e, entity: t }) => ({
  entityId: e,
  entity: t,
  tokens: Ue(e, t)
})).filter(io).sort((e, t) => q(e.entityId, t.entityId)), st = (i, e) => {
  const t = i.map((r) => ({
    candidate: r,
    score: e(r)
  })).filter((r) => r.score > 0).sort((r, s) => s.score - r.score || q(r.candidate.entityId, s.candidate.entityId));
  return t.length === 0 || t.length > 1 && t[0].score === t[1].score ? null : t[0].candidate;
}, ns = (i, e) => {
  if (!e)
    return [];
  const t = e.toLowerCase();
  return i.filter((r) => r.tokens.includes(t));
}, no = (i, e) => {
  const t = new Set(
    e.map((r) => r.toLowerCase())
  );
  return t.size === 0 ? [] : i.filter(
    (r) => r.tokens.some((s) => t.has(s))
  );
}, ct = (i, e, t) => {
  if (!t || !i.power_entity)
    return null;
  const r = e[i.power_entity];
  return ze(
    $e(
      {
        entityId: i.power_entity,
        friendlyName: ue(r)
      },
      t.sortBy
    )
  )[t.tokenIndex]?.toLowerCase() ?? null;
}, wt = (i, e, t) => i.power_entity ? pt(
  Ue(i.power_entity, e[i.power_entity]),
  t ?? void 0
) : [], ao = (i, e) => i.power_entity ? pt(
  Ue(i.power_entity, e[i.power_entity])
).filter((t) => Jr.test(t)) : [], lo = (i, e, t) => {
  const r = ct(i, e, t), s = ao(i, e), o = r && Jr.test(r) ? [r, ...s] : [...s, r];
  return [
    ...new Set(
      o.filter((n) => !!n).map((n) => n.toLowerCase())
    )
  ];
}, po = (i, e, t, r, s) => {
  const o = wt(i, t, s);
  if (!s)
    return o;
  const n = /* @__PURE__ */ new Map();
  for (const a of e) {
    if (a.enabled === !1 || !a.power_entity?.trim() || ct(a, t, r) !== s)
      continue;
    const l = new Set(
      wt(a, t, s)
    );
    for (const c of l)
      n.set(c, (n.get(c) ?? 0) + 1);
  }
  return o.filter((a) => n.get(a) === 1);
}, co = (i, e, t, r, s) => {
  if (i === "panel_power_entity")
    return e.power_entity?.trim() || null;
  const o = ns(t[i], r);
  if (o.length === 0)
    return null;
  if (i === "inverter_temp_entity") {
    const n = o.filter(
      (a) => Je(a, ["temp", "temperature", "inverter"])
    );
    return n.length === 1 ? n[0].entityId : o.length === 1 ? o[0].entityId : null;
  }
  return i === "inverter_ac_power_entity" || i === "inverter_ac_voltage_entity" || i === "inverter_ac_current_entity" ? st(o, (a) => Je(a, ["ac", "inverter"]) ? 2 : 0)?.entityId ?? null : i === "panel_current_entity" || i === "panel_voltage_entity" ? st(o, (a) => {
    const l = pt(a.tokens, r ?? void 0), c = os(s, l);
    if (c === 0)
      return 0;
    const p = Je(a, ["ac", "inverter"]) ? 1 : 0;
    return c * 2 - p;
  })?.entityId ?? null : null;
}, ho = (i) => {
  let e = 0;
  const t = `${i.entityId} ${ue(i.entity) ?? ""}`.toLowerCase();
  /device[._\-\s]+status/.test(t) && (e += 120), /inverter[._\-\s]+status/.test(t) && (e += 100), ue(i.entity)?.trim().toLowerCase() === "device status" && (e += 80);
  for (const r of i.tokens)
    r === "status" ? e += 20 : r === "state" ? e += 12 : ["fault", "alarm", "error"].includes(r) ? e += 10 : ["mode", "operation", "operating"].includes(r) ? e += 5 : ["work", "working", "run", "running"].includes(r) && (e += 3);
  Je(i, ["inverter"]) && (e += 2);
  for (const r of i.tokens)
    Zi.has(r) && (e -= 8);
  return e;
}, uo = (i, e) => {
  const r = i.filter(
    (p) => typeof p.power_entity == "string" && p.power_entity.trim().length > 0
  ).map((p) => {
    const d = p.power_entity ? e[p.power_entity] : void 0;
    return {
      entityId: p.power_entity ?? "",
      friendlyName: ue(d)
    };
  }), s = We(r, {
    allowNumericGroup: !0,
    allowSingleGroup: !0,
    minCandidates: 2
  }), o = oo(e), n = /* @__PURE__ */ new Map();
  let a = 0, l = 0;
  return {
    panels: i.map((p) => {
      if (p.enabled === !1 || !p.power_entity?.trim())
        return l += 1, p;
      if (typeof p.inverter_status_entity == "string" && p.inverter_status_entity.trim().length > 0)
        return p;
      const d = lo(p, e, s);
      if (d.length === 0)
        return l += 1, p;
      const h = d[0];
      if (!n.has(h)) {
        const f = no(
          o,
          d
        ), g = f.length === 1 ? f[0] : st(f, ho);
        n.set(h, g?.entityId ?? null);
      }
      const u = n.get(h);
      return u ? (a += 1, {
        ...p,
        inverter_status_entity: u
      }) : (l += 1, p);
    }),
    filled: a,
    skippedPanels: l
  };
}, _o = (i, e) => {
  const r = i.filter(
    (c) => c.enabled !== !1 && typeof c.power_entity == "string" && c.power_entity.trim().length > 0
  ).map((c) => {
    const p = c.power_entity ? e[c.power_entity] : void 0;
    return {
      entityId: c.power_entity ?? "",
      friendlyName: ue(p)
    };
  }), s = We(r, {
    allowNumericGroup: !0,
    allowSingleGroup: !0,
    minCandidates: 2
  }), o = {
    inverter_ac_power_entity: ae(e, nr),
    inverter_ac_voltage_entity: ae(e, ar),
    inverter_ac_current_entity: ae(e, lr),
    inverter_temp_entity: ae(e, ro),
    panel_current_entity: ae(e, lr),
    panel_voltage_entity: ae(e, ar),
    panel_power_entity: ae(e, nr)
  };
  let n = 0, a = 0;
  return {
    panels: i.map((c) => {
      if (c.enabled === !1 || !c.power_entity?.trim())
        return a += 1, c;
      const p = ct(c, e, s), d = wt(c, e, p), h = {
        ...c.advanced_metrics ?? {}
      };
      let u = !1;
      const f = [
        "inverter_ac_power_entity",
        "inverter_ac_voltage_entity",
        "inverter_ac_current_entity",
        "inverter_temp_entity",
        "panel_current_entity",
        "panel_voltage_entity",
        "panel_power_entity"
      ];
      for (const g of f) {
        if (typeof h[g] == "string" && h[g]?.trim())
          continue;
        const P = co(
          g,
          c,
          o,
          p,
          d
        );
        P && (h[g] = P, n += 1, u = !0);
      }
      return u ? {
        ...c,
        advanced_metrics: h
      } : c;
    }),
    filled: n,
    skippedPanels: a
  };
}, mo = (i, e, t, r) => {
  const s = i?.trim() ?? "";
  if (!s || s === e || /^panel\s+\d+$/i.test(s))
    return !0;
  const o = r(t);
  return !!(o && s === o);
}, fo = (i, e) => i.map((t) => {
  const r = t.power_entity?.trim();
  if (!r)
    return t;
  const s = e(r);
  return s ? {
    ...t,
    name: s
  } : t;
}), pr = "spv-card-config-updated", go = (i, e) => {
  i.dispatchEvent(
    new CustomEvent("config-changed", {
      detail: { config: e },
      bubbles: !0,
      composed: !0
    })
  );
}, as = (i) => typeof i == "string" ? i.trim().toLowerCase() : "", le = (i, e) => {
  const t = as(i.attributes?.unit_of_measurement);
  return t.length > 0 && e.includes(t);
}, pe = (i, e) => {
  const t = as(i.attributes?.device_class);
  return t.length > 0 && e.includes(t);
}, cr = (i, e) => typeof e.entity_id == "string" && e.entity_id.trim().length > 0 ? e.entity_id : i, dr = [
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
], ot = class ot extends we {
  constructor() {
    super(...arguments), this._config = this._normalizeEditorConfig({
      type: this._getCardType()
    }), this._autoFillPowerPrefix = "", this._autoFillEnergyPrefix = "", this._autoFillSortMode = "auto", this._autoFillInverterStatus = !1, this._autoFillAdvancedTelemetry = !1, this._autoFillResultMessage = "", this._applyDefaultRatedPowerToAllPanels = () => {
      const e = this._config.default_panel_rated_power_w;
      if (!e)
        return;
      const t = this._config.panels.map((r) => ({
        ...r,
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
      if (!e && !t && !this._autoFillInverterStatus && !this._autoFillAdvancedTelemetry) {
        this._autoFillResultMessage = this._t("editor.autofill.enter_prefix");
        return;
      }
      let r = [...this._config.panels];
      const s = [];
      if (e) {
        r = r.map((n) => ({ ...n, power_entity: void 0 }));
        const o = ss(
          r,
          this.hass.states,
          "power_entity",
          e,
          (n) => n === "w",
          this._autoFillSortMode
        );
        r = o.panels, s.push(
          this._t("editor.autofill.power_summary", {
            matched: o.matched,
            filled: o.filled,
            skipped: o.skipped
          })
        );
      }
      if (t) {
        r = r.map((n) => ({ ...n, energy_entity: void 0 }));
        const o = to(
          r,
          this.hass.states,
          t,
          (n) => n === "kwh" || n === "wh",
          this._autoFillSortMode
        );
        r = o.panels, s.push(
          this._t("editor.autofill.energy_summary", {
            matched: o.matched,
            filled: o.filled,
            skipped: o.skipped
          })
        );
      }
      if (r = fo(
        r,
        (o) => this._getEntityFriendlyName(o)
      ), this._autoFillInverterStatus) {
        const o = uo(
          r,
          this.hass.states
        );
        r = o.panels, s.push(
          this._t("editor.autofill.inverter_status_summary", {
            filled: o.filled,
            skipped: o.skippedPanels
          })
        );
      }
      if (this._autoFillAdvancedTelemetry) {
        const o = _o(
          r,
          this.hass.states
        );
        r = o.panels, s.push(
          this._t("editor.autofill.advanced_summary", {
            filled: o.filled,
            skipped: o.skippedPanels
          })
        );
      }
      this._autoFillResultMessage = s.join(" "), this._commit(
        this._normalizeEditorConfig({
          ...this._config,
          panels: r
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
      const r = e.detail?.config;
      if (!r || typeof r != "object")
        return;
      const s = this._normalizeEditorConfig(
        r
      );
      this._isReorderOnlySync(s) && this._commit(s);
    };
  }
  connectedCallback() {
    super.connectedCallback(), window.addEventListener(pr, this._handleCardConfigSync);
  }
  disconnectedCallback() {
    window.removeEventListener(pr, this._handleCardConfigSync), super.disconnectedCallback();
  }
  setConfig(e) {
    this._config = this._normalizeEditorConfig(e ?? {});
  }
  _getCardType() {
    return xt;
  }
  _normalizeEditorConfig(e) {
    return Re(e);
  }
  _renderExtraSections() {
    return b;
  }
  _t(e, t) {
    return Br(this.hass, e, t);
  }
  render() {
    if (!this.hass)
      return b;
    const e = !!this.hass.states["sensor.power_production_now"], t = !!this.hass.states["sensor.energy_production_today"], r = e && t ? this._t("editor.forecast.detected") : this._t("editor.forecast.missing");
    return y`
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
                @change=${(s) => this._updateRootValue(
      "use_system_power_entity",
      s.currentTarget.checked
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
      (s) => this._updateRootValue("system_power_entity", s)
    )}
          <div class="toggle">
            <ha-formfield label=${this._t("editor.toggle.invert_system_power")}>
              <ha-switch
                .checked=${this._config.invert_system_power ?? !1}
                @change=${(s) => this._updateRootValue(
      "invert_system_power",
      s.currentTarget.checked
    )}
              ></ha-switch>
            </ha-formfield>
          </div>
          <div class="toggle">
            <ha-formfield label=${this._t("editor.toggle.use_system_energy")}>
              <ha-switch
                .checked=${this._config.use_system_energy_entity ?? !1}
                @change=${(s) => this._updateRootValue(
      "use_system_energy_entity",
      s.currentTarget.checked
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
      (s) => this._updateRootValue("system_energy_entity", s)
    )}
          ${this._renderSelectorWithClear(
      this._t("editor.field.custom_kpi_sensor"),
      this._config.custom_kpi_entity,
      {
        entity: {
          domain: "sensor"
        }
      },
      (s) => this._updateRootValue("custom_kpi_entity", s)
    )}
          <div class="toggle">
            <ha-formfield label=${this._t("editor.toggle.invert_custom_kpi")}>
              <ha-switch
                .checked=${this._config.invert_custom_kpi ?? !1}
                @change=${(s) => this._updateRootValue(
      "invert_custom_kpi",
      s.currentTarget.checked
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
                @change=${(s) => this._updateRootValue(
      "show_custom_kpi",
      s.currentTarget.checked
    )}
              ></ha-switch>
            </ha-formfield>
          </div>
          <div class="toggle">
            <ha-formfield label=${this._t("editor.toggle.limit_panel_width")}>
              <ha-switch
                .checked=${this._config.limit_panel_width ?? !1}
                @change=${(s) => this._updateRootValue(
      "limit_panel_width",
      s.currentTarget.checked
    )}
              ></ha-switch>
            </ha-formfield>
          </div>
          ${this._renderEditorInput(
      this._t("editor.field.max_panel_tile_width"),
      String(this._config.panel_max_width_px ?? 220),
      (s) => this._updateRootValue(
        "panel_max_width_px",
        this._parseNumberWithClamp(
          s,
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
                @change=${(s) => this._updateRootValue(
      "enable_forecast_overlay",
      s.currentTarget.checked
    )}
              ></ha-switch>
            </ha-formfield>
          </div>
          <p class="section-copy">${r}</p>
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
                @change=${(s) => this._updateRootValue(
      "enable_array_checks",
      s.currentTarget.checked
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
                @change=${(s) => this._updateRootValue(
      "enable_inverter_status",
      s.currentTarget.checked
    )}
              ></ha-switch>
            </ha-formfield>
            <ha-formfield label=${this._t("editor.toggle.show_inverter_status_tiles")}>
              <ha-switch
                .checked=${this._config.show_inverter_status_on_tiles ?? !1}
                @change=${(s) => this._updateRootValue(
      "show_inverter_status_on_tiles",
      s.currentTarget.checked
    )}
              ></ha-switch>
            </ha-formfield>
          </div>
          ${this._renderEditorInput(
      this._t("editor.field.fault_terms"),
      (this._config.inverter_fault_terms ?? []).join(", "),
      (s) => this._updateRootValue(
        "inverter_fault_terms",
        s
      )
    )}
          ${this._renderEditorInput(
      this._t("editor.field.working_terms"),
      (this._config.inverter_working_terms ?? []).join(", "),
      (s) => this._updateRootValue(
        "inverter_working_terms",
        s
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
              @input=${(s) => this._updateRootValue(
      "production_color_intensity",
      Number(s.currentTarget.value)
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
                @change=${(s) => this._updateRootValue(
      "motion_enabled",
      s.currentTarget.checked
    )}
              ></ha-switch>
            </ha-formfield>
          </div>
          <div class="toggle">
            <ha-formfield label=${this._t("editor.toggle.motion_power_flow")}>
              <ha-switch
                .checked=${this._config.motion_power_flow ?? !0}
                @change=${(s) => this._updateRootValue(
      "motion_power_flow",
      s.currentTarget.checked
    )}
              ></ha-switch>
            </ha-formfield>
          </div>
          <div class="toggle">
            <ha-formfield label=${this._t("editor.toggle.motion_update_shimmer")}>
              <ha-switch
                .checked=${this._config.motion_update_shimmer ?? !0}
                @change=${(s) => this._updateRootValue(
      "motion_update_shimmer",
      s.currentTarget.checked
    )}
              ></ha-switch>
            </ha-formfield>
          </div>
          <div class="toggle">
            <ha-formfield label=${this._t("editor.toggle.motion_alert_ripple")}>
              <ha-switch
                .checked=${this._config.motion_alert_ripple ?? !0}
                @change=${(s) => this._updateRootValue(
      "motion_alert_ripple",
      s.currentTarget.checked
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
      et
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
      (s) => {
        this._autoFillPowerPrefix = s;
      }
    )}
              ${this._renderEditorInput(
      this._t("editor.field.energy_prefix"),
      this._autoFillEnergyPrefix,
      (s) => {
        this._autoFillEnergyPrefix = s;
      }
    )}
              ${this._renderAutoFillSortModeField()}
            </div>
            <p class="section-copy">
              ${this._t("editor.helper.autofill_search_help")}
            </p>
            <label class="autofill-option">
              <input
                type="checkbox"
                .checked=${this._autoFillInverterStatus}
                @change=${(s) => {
      this._autoFillInverterStatus = s.currentTarget.checked;
    }}
              />
              <span>${this._t("editor.toggle.autofill_inverter_status")}</span>
            </label>
            <p class="section-copy">
              ${this._t("editor.helper.autofill_inverter_status_help")}
            </p>
            <label class="autofill-option">
              <input
                type="checkbox"
                .checked=${this._autoFillAdvancedTelemetry}
                @change=${(s) => {
      this._autoFillAdvancedTelemetry = s.currentTarget.checked;
    }}
              />
              <span>${this._t("editor.toggle.autofill_advanced_telemetry")}</span>
            </label>
            <p class="section-copy">
              ${this._t("editor.helper.autofill_advanced_help")}
            </p>
            <div class="button-row">
              <button class="secondary-button" type="button" @click=${this._handleAutoPopulateSensors}>
                ${this._t("editor.button.autofill_sensors")}
              </button>
              <button class="secondary-button" type="button" @click=${this._handleRemoveAllPanelSensors}>
                ${this._t("editor.button.remove_all_sensors")}
              </button>
            </div>
            ${this._autoFillResultMessage ? y`<p class="section-copy">${this._autoFillResultMessage}</p>` : b}
          </div>

          <div class="panel-list">
            ${this._config.panels.map(
      (s, o) => this._renderPanelEditor(s, o)
    )}
          </div>
        </section>

        ${this._renderExtraSections()}
      </div>
    `;
  }
  _renderPanelEditor(e, t) {
    const r = this._getAvailableSensorEntityIdsByUnit(
      t,
      "power_entity",
      (o) => o === "w"
    ), s = this._getAvailableSensorEntityIdsByUnit(
      t,
      "energy_entity",
      (o) => o === "kwh" || o === "wh"
    );
    return y`
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
      r
    )}
          ${this._renderPanelSensorSelector(
      t,
      "energy_entity",
      this._t("editor.field.energy_sensor"),
      e.energy_entity,
      s
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
      et
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
    return y`
      <details class="panel-advanced">
        <summary>${this._t("editor.section.advanced_title")}</summary>
        <div class="panel-advanced-grid">
          <p class="section-copy">
            ${this._t("editor.section.advanced_copy")}
          </p>
          ${dr.map(
      (r) => this._renderPanelAdvancedSensorSelector(
        e,
        r.key,
        this._t(r.labelKey),
        t.advanced_metrics?.[r.key],
        this._getAdvancedSensorEntityIds(e, r.key, r.matcher)
      )
    )}
        </div>
      </details>
    `;
  }
  _renderPanelAdvancedSensorSelector(e, t, r, s, o) {
    return this._renderSelectorWithClear(
      r,
      s,
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
    const t = Math.floor(e / this._config.columns) + 1, r = e % this._config.columns + 1;
    return this._t("editor.panel_slot_title", { row: t, column: r });
  }
  _renderPanelEntityPicker(e, t, r, s, o) {
    return this._renderSelectorWithClear(
      r,
      s,
      {
        entity: {
          domain: o
        }
      },
      (n) => this._updatePanelValue(e, t, n)
    );
  }
  _renderTextField(e, t, r) {
    return this._renderEditorInput(
      t,
      r,
      (s) => this._updateRootValue(e, s)
    );
  }
  _renderPanelSensorSelector(e, t, r, s, o) {
    return this._renderSelectorWithClear(
      r,
      s,
      {
        entity: {
          domain: "sensor",
          include_entities: o
        }
      },
      (n) => this._updatePanelValue(e, t, n)
    );
  }
  _renderSelectorWithClear(e, t, r, s) {
    return y`
      <ha-selector
        .hass=${this.hass}
        .value=${t}
        .selector=${r}
        .label=${e}
        .required=${!1}
        @value-changed=${(o) => s(
      typeof o.detail?.value == "string" ? o.detail.value : ""
    )}
      ></ha-selector>
    `;
  }
  _renderNumberField(e, t, r, s, o) {
    return this._renderEditorInput(
      t,
      String(r),
      (n) => this._updateRootValue(
        e,
        this._parseNumberWithClamp(n, r, s, o)
      ),
      { type: "number", min: s, max: o, updateOn: "change" }
    );
  }
  _renderOptionalNumberField(e, t, r, s, o) {
    return this._renderEditorInput(
      t,
      r !== void 0 ? String(r) : "",
      (n) => this._updateRootValue(
        e,
        this._parseOptionalNumber(n, s, o)
      ),
      { type: "number", min: s, max: o, updateOn: "change" }
    );
  }
  _renderPanelTextField(e, t, r, s) {
    return this._renderEditorInput(
      r,
      s,
      (o) => this._updatePanelValue(e, t, o)
    );
  }
  _renderPanelOptionalNumberField(e, t, r, s, o, n) {
    return this._renderEditorInput(
      r,
      s !== void 0 ? String(s) : "",
      (a) => this._updatePanelValue(
        e,
        t,
        this._parseOptionalNumber(a, o, n)
      ),
      { type: "number", min: o, max: n, updateOn: "change" }
    );
  }
  _renderPanelNumberField(e, t, r, s, o, n) {
    return this._renderEditorInput(
      r,
      String(s),
      (a) => this._updatePanelValue(
        e,
        t,
        this._parseNumberWithClamp(a, s, o, n)
      ),
      { type: "number", min: o, max: n, updateOn: "change" }
    );
  }
  _renderEditorInput(e, t, r, s = {}) {
    const o = s.updateOn ?? "input", n = (l) => {
      o === "input" && r(l.currentTarget.value);
    }, a = (l) => {
      o === "change" && r(l.currentTarget.value);
    };
    return y`
      <label class="field">
        <span class="field-label">${e}</span>
        <input
          class="text-input"
          type=${s.type ?? "text"}
          .value=${t}
          min=${s.min === void 0 ? b : String(s.min)}
          max=${s.max === void 0 ? b : String(s.max)}
          ?disabled=${s.disabled ?? !1}
          @input=${n}
          @change=${a}
        />
      </label>
    `;
  }
  _renderSelectField(e, t, r, s) {
    return y`
      <label class="color-field">
        <span>${t}</span>
        <select
          .value=${r}
          @change=${(o) => this._updateRootValue(e, o.currentTarget.value)}
        >
          ${s.map(
      (o) => y`<option value=${o.value}>${o.label}</option>`
    )}
        </select>
      </label>
    `;
  }
  _renderAutoFillSortModeField() {
    const e = [
      { value: "auto", label: this._t("editor.select.autofill_sort_auto") },
      { value: "entityId", label: this._t("editor.select.autofill_sort_entity") },
      { value: "friendlyName", label: this._t("editor.select.autofill_sort_friendly") },
      { value: "grouped", label: this._t("editor.select.autofill_sort_grouped") }
    ];
    return y`
      <label class="color-field">
        <span>${this._t("editor.field.autofill_sort_mode")}</span>
        <select
          .value=${this._autoFillSortMode}
          @change=${(t) => {
      this._autoFillSortMode = t.currentTarget.value;
    }}
        >
          ${e.map(
      (t) => y`<option value=${t.value}>${t.label}</option>`
    )}
        </select>
      </label>
    `;
  }
  _renderColorField(e, t) {
    const r = this._config.colors?.[e] ?? "";
    return y`
      <label class="color-field">
        <span>${t}</span>
        <input
          type="color"
          .value=${r}
          @input=${(s) => this._updateColor(e, s.currentTarget.value)}
        />
      </label>
    `;
  }
  _updateRootValue(e, t) {
    const r = this._normalizeEditorConfig({
      ...this._config,
      [e]: t
    });
    this._commit(r);
  }
  _updateColor(e, t) {
    const r = this._normalizeEditorConfig({
      ...this._config,
      colors: {
        ...this._config.colors ?? {},
        [e]: t
      }
    });
    this._commit(r);
  }
  _updatePanelValue(e, t, r) {
    const s = this._config.panels.map((n, a) => {
      if (a !== e)
        return n;
      const l = { ...n, [t]: r };
      if (t === "power_entity") {
        const c = n.power_entity, p = typeof r == "string" ? r.trim() : "";
        if (p.length > 0) {
          const d = this._getEntityFriendlyName(p);
          d && this._shouldAutoRenamePanel(n.name, n.id, c) && (l.name = d);
        }
      }
      return t === "enabled" && r === !1 && (l.power_entity = void 0, l.energy_entity = void 0, l.show_energy = !1, l.inverter_status_entity = void 0, l.error_entity = void 0, l.advanced_metrics = void 0), l;
    }), o = this._normalizeEditorConfig({
      ...this._config,
      panels: s
    });
    this._commit(o);
  }
  _updatePanelAdvancedMetricValue(e, t, r) {
    const s = typeof r == "string" && r.trim().length > 0 ? r.trim() : void 0, o = this._config.panels.map((a, l) => {
      if (l !== e)
        return a;
      const c = {
        ...a.advanced_metrics ?? {}
      };
      return c[t] = s, dr.every(
        (p) => !c[p.key] || c[p.key]?.trim().length === 0
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
  _parseOptionalNumber(e, t, r) {
    if (e.trim() === "")
      return;
    const s = Number(e);
    if (Number.isFinite(s))
      return Math.min(Math.max(s, t), r);
  }
  _parseNumberWithClamp(e, t, r, s) {
    const o = Number(e);
    return Number.isFinite(o) ? Math.min(Math.max(o, r), s) : t;
  }
  _getAvailableSensorEntityIdsByUnit(e, t, r) {
    if (!this.hass)
      return [];
    const s = new Set(
      this._config.panels.map((a, l) => l === e ? void 0 : a[t]).filter((a) => typeof a == "string" && a.length > 0)
    ), o = this._config.panels[e]?.[t], n = [];
    for (const [a, l] of Object.entries(this.hass.states)) {
      const c = cr(a, l);
      if (!c.startsWith("sensor."))
        continue;
      const p = l.attributes?.unit_of_measurement;
      if (typeof p != "string")
        continue;
      const d = p.trim().toLowerCase();
      r(d) && (s.has(c) && c !== o || n.push(c));
    }
    return typeof o == "string" && o.length > 0 && !n.includes(o) && n.push(o), n.sort(q);
  }
  _getAdvancedSensorEntityIds(e, t, r) {
    if (!this.hass)
      return [];
    const s = this._config.panels[e]?.advanced_metrics?.[t], o = [];
    for (const [n, a] of Object.entries(this.hass.states)) {
      const l = cr(n, a);
      l.startsWith("sensor.") && r(a) && o.push(l);
    }
    return typeof s == "string" && s.length > 0 && !o.includes(s) && o.push(s), o.sort(q);
  }
  _getEntityFriendlyName(e) {
    const t = e?.trim();
    if (!this.hass || !t)
      return;
    const s = this.hass.states[t]?.attributes?.friendly_name;
    if (typeof s != "string")
      return;
    const o = s.trim();
    return o.length > 0 ? o : void 0;
  }
  _shouldAutoRenamePanel(e, t, r) {
    return mo(
      e,
      t,
      r,
      (s) => this._getEntityFriendlyName(s)
    );
  }
  _commit(e) {
    this._config = e, go(this, e);
  }
  _isReorderOnlySync(e) {
    if (e.type !== this._getCardType() || e.rows !== this._config.rows || e.columns !== this._config.columns || e.panels.length !== this._config.panels.length)
      return !1;
    const t = this._toPanelSignatureMap(this._config.panels), r = this._toPanelSignatureMap(e.panels);
    if (t.size !== r.size)
      return !1;
    for (const [n, a] of t.entries())
      if (r.get(n) !== a)
        return !1;
    const s = this._config.panels.map((n) => n.id).join("|"), o = e.panels.map((n) => n.id).join("|");
    return s !== o;
  }
  _toPanelSignatureMap(e) {
    const t = /* @__PURE__ */ new Map();
    for (const r of e)
      t.set(
        r.id,
        JSON.stringify({
          name: r.name ?? "",
          power_entity: r.power_entity ?? "",
          energy_entity: r.energy_entity ?? "",
          inverter_status_entity: r.inverter_status_entity ?? "",
          error_entity: r.error_entity ?? "",
          show_energy: r.show_energy ?? !1,
          enabled: r.enabled ?? !0,
          rated_power_w: r.rated_power_w ?? null,
          deviation_derate_percent: r.deviation_derate_percent ?? 100,
          advanced_metrics: r.advanced_metrics ?? {}
        })
      );
    return t;
  }
};
ot.properties = {
  hass: { attribute: !1 },
  _config: { state: !0 },
  _autoFillPowerPrefix: { state: !0 },
  _autoFillEnergyPrefix: { state: !0 },
  _autoFillSortMode: { state: !0 },
  _autoFillInverterStatus: { state: !0 },
  _autoFillAdvancedTelemetry: { state: !0 },
  _autoFillResultMessage: { state: !0 }
}, ot.styles = Ct`
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

    .autofill-option {
      display: flex;
      align-items: center;
      gap: 10px;
      min-height: 32px;
      color: var(--primary-text-color);
      font-size: 0.95rem;
      font-weight: 500;
      cursor: pointer;
    }

    .autofill-option input {
      width: 18px;
      height: 18px;
      margin: 0;
      accent-color: var(--primary-color);
      cursor: pointer;
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
let it = ot;
class ls extends it {
}
customElements.get("solar-panel-visualizer-card-editor") || customElements.define(
  "solar-panel-visualizer-card-editor",
  ls
);
const yo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SolarPanelVisualizerBaseCardEditor: it,
  SolarPanelVisualizerCardEditor: ls
}, Symbol.toStringTag, { value: "Module" })), hr = typeof navigator < "u" ? navigator.language : "en";
window.customCards = window.customCards || [];
window.customCards.push({
  type: ur,
  name: tt(hr, "meta.card_name"),
  description: tt(hr, "meta.card_description"),
  icon: "mdi:solar-panel",
  preview: !0
});
