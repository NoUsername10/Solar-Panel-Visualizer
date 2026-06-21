const kr = "solar-panel-visualizer", Rt = `custom:${kr}`, Nt = {
  production_start: "#8dcf72",
  production_mid: "#bfe36a",
  production_end: "#ffd35a",
  deviation: "#ff9667",
  error: "#ff627f",
  unavailable: "#586779"
}, Ir = 2, pt = 3, Fr = 15, Tr = 50, Mr = 3, Ar = 3, Rr = 20, Nr = 0, Lr = 30, Dr = 12, Or = 0, Gr = 2, Hr = 0, zr = !1, Br = 220, Ur = 980, Wr = 1, Kr = !1, Vr = !0, jr = !0, Yr = !0, qr = !0, Xr = "auto", dt = 1e4, Y = 30, Qr = ["fault", "alarm", "error", "failed", "failure", "trip"], Zr = [
  "normal",
  "ok",
  "running",
  "waiting for operation",
  "producing"
], V = (i, e, t = 1, r = Y) => {
  const s = Number(i);
  return Number.isFinite(s) ? Math.min(Math.max(Math.round(s), t), r) : e;
}, ze = (i, e, t = 0, r = 100) => {
  const s = Number(i);
  return Number.isFinite(s) ? Math.min(Math.max(s, t), r) : e;
}, G = (i) => {
  if (typeof i != "string")
    return;
  const e = i.trim();
  return e.length > 0 ? e : void 0;
}, $s = (i) => {
  if (typeof i == "string")
    return i.trim();
}, H = (i, e) => typeof i == "boolean" ? i : e, Wt = (i, e) => {
  const r = (Array.isArray(i) ? i : typeof i == "string" ? i.split(",") : []).map((s) => typeof s == "string" ? s.trim().toLowerCase() : "").filter((s) => s.length > 0);
  return r.length === 0 ? [...e] : [...new Set(r)];
}, Kt = (i, e, t) => {
  if (i == null || i === "")
    return;
  const r = Number(i);
  if (Number.isFinite(r))
    return Math.min(Math.max(r, e), t);
}, Jr = (i, e, t) => {
  if (i == null || i === "")
    return;
  const r = Number(i);
  if (!(!Number.isFinite(r) || r < e))
    return Math.min(r, t);
}, Cs = (i) => `panel-${i + 1}`, Es = (i) => i === "none" ? "none" : "details", ks = (i) => i === "dark" || i === "light" ? i : Xr, Is = (i) => {
  if (typeof i != "object" || i === null)
    return;
  const e = i, t = e.columns === "full" || typeof e.columns == "number" ? e.columns : void 0, r = e.rows === "auto" || typeof e.rows == "number" ? e.rows : void 0;
  if (!(t === void 0 && r === void 0))
    return {
      columns: t,
      rows: r
    };
}, Fs = [
  "inverter_ac_power_entity",
  "inverter_ac_voltage_entity",
  "inverter_ac_current_entity",
  "inverter_temp_entity",
  "panel_current_entity",
  "panel_voltage_entity",
  "panel_power_entity"
], Ts = (i, e) => {
  if (!e || typeof i != "object" || i === null)
    return;
  const t = i, r = {};
  let s = !1;
  for (const n of Fs) {
    const o = G(t[n]);
    r[n] = o, o && (s = !0);
  }
  if (s)
    return r;
}, Ft = (i, e) => {
  const t = H(i?.enabled, !0);
  return {
    id: G(i?.id) ?? Cs(e),
    name: G(i?.name),
    power_entity: t ? G(i?.power_entity) : void 0,
    energy_entity: t ? G(i?.energy_entity) : void 0,
    show_energy: H(i?.show_energy, !1),
    inverter_status_entity: t ? G(i?.inverter_status_entity) ?? G(i?.error_entity) : void 0,
    error_entity: t ? G(i?.error_entity) : void 0,
    advanced_metrics: Ts(i?.advanced_metrics, t),
    enabled: t,
    rated_power_w: Jr(i?.rated_power_w, 1, dt),
    deviation_derate_percent: ze(i?.deviation_derate_percent, 100, 1, 100)
  };
}, Ms = (i) => `string-${i + 1}`, As = (i, e) => ({
  id: G(i?.id) ?? Ms(e),
  name: G(i?.name),
  panel_count: V(
    i?.panel_count,
    pt,
    1,
    Y
  ),
  power_entity: G(i?.power_entity),
  energy_entity: G(i?.energy_entity)
}), Rs = (i) => Array.isArray(i) ? i.slice(0, Y).map(
  (e, t) => As(
    typeof e == "object" && e !== null ? e : void 0,
    t
  )
) : [], Ns = /^string\s+\d+\s+panel\s+\d+$/i, Ls = /^panel\s+\d+$/i, Vt = (i) => typeof i == "string" && (Ns.test(i.trim()) || Ls.test(i.trim())), es = (i, e, t = []) => {
  const r = i * e;
  return Array.from(
    { length: r },
    (s, n) => Ft(t[n], n)
  );
}, Ds = (i, e, t = [], r = e) => {
  const n = i.length * e, o = V(
    r,
    e,
    1,
    Y
  );
  return Array.from({ length: n }, (l, a) => {
    const c = Math.floor(a / e), p = a % e, d = c * o + p, h = i[c], u = p < o ? t[d] ?? {} : {}, g = `${h?.name ?? `String ${c + 1}`} Panel ${p + 1}`, f = G(u.name);
    return !h || p >= h.panel_count ? Ft(
      {
        ...u,
        name: f && !Vt(f) ? f : void 0,
        enabled: !1,
        power_entity: void 0,
        energy_entity: void 0,
        show_energy: !1
      },
      a
    ) : Ft(
      {
        ...u,
        name: f && !Vt(f) ? f : g,
        enabled: !0,
        power_entity: h.power_entity,
        energy_entity: h.energy_entity,
        show_energy: h.energy_entity ? !0 : H(u.show_energy, !1)
      },
      a
    );
  });
}, Os = (i = Ir, e = pt) => ({
  type: Rt,
  title: "Solar Array",
  theme_mode: Xr,
  rows: i,
  columns: e,
  panels: es(i, e),
  enable_inverter_status: !1,
  enable_string_sensor_sharing: !1,
  string_groups: [],
  inverter_fault_terms: [...Qr],
  inverter_working_terms: [...Zr],
  show_inverter_status_on_tiles: !1,
  enable_array_checks: !1,
  deviation_threshold_percent: Fr,
  deviation_absolute_w_threshold: Tr,
  deviation_min_active_panels: Mr,
  deviation_min_samples: Ar,
  deviation_min_runtime_minutes: Rr,
  deviation_smoothing_minutes: Nr,
  deviation_dynamic_floor_w: Lr,
  deviation_history_hours: Dr,
  colors: Nt,
  production_color_intensity: Wr,
  show_energy: !0,
  use_system_power_entity: !1,
  system_power_entity: void 0,
  invert_system_power: !1,
  use_system_energy_entity: !1,
  system_energy_entity: void 0,
  enable_forecast_overlay: Kr,
  motion_enabled: Vr,
  motion_power_flow: jr,
  motion_update_shimmer: Yr,
  motion_alert_ripple: qr,
  show_custom_kpi: !0,
  custom_kpi_title: "Custom KPI",
  custom_kpi_entity: void 0,
  custom_kpi_decimals: Hr,
  invert_custom_kpi: !1,
  panel_tap_action: "details",
  power_decimals: Or,
  energy_decimals: Gr,
  limit_panel_width: zr,
  panel_max_width_px: Br,
  max_card_width_px: Ur
}), Be = (i = {}) => {
  const e = H(
    i.enable_string_sensor_sharing,
    !1
  ), t = Rs(i.string_groups), r = e && t.length > 0, s = r ? t.length : V(i.rows, Ir), n = r ? Math.max(...t.map((l) => l.panel_count), 1) : V(i.columns, pt), o = {
    ...Nt,
    ...i.colors ?? {}
  };
  return {
    type: G(i.type) ?? Rt,
    title: G(i.title),
    theme_mode: ks(i.theme_mode),
    rows: s,
    columns: n,
    panels: r ? Ds(
      t,
      n,
      i.panels ?? [],
      V(i.columns, pt)
    ) : es(s, n, i.panels ?? []),
    enable_inverter_status: H(i.enable_inverter_status, !1),
    enable_string_sensor_sharing: e,
    string_groups: t,
    inverter_fault_terms: Wt(
      i.inverter_fault_terms,
      Qr
    ),
    inverter_working_terms: Wt(
      i.inverter_working_terms,
      Zr
    ),
    show_inverter_status_on_tiles: H(
      i.show_inverter_status_on_tiles,
      !1
    ),
    enable_array_checks: H(i.enable_array_checks, !1),
    deviation_threshold_percent: ze(
      i.deviation_threshold_percent,
      Fr,
      1,
      100
    ),
    deviation_absolute_w_threshold: ze(
      i.deviation_absolute_w_threshold,
      Tr,
      0,
      5e3
    ),
    deviation_min_active_panels: V(
      i.deviation_min_active_panels,
      Mr,
      2,
      30
    ),
    deviation_min_samples: V(
      i.deviation_min_samples,
      Ar,
      1,
      120
    ),
    deviation_min_runtime_minutes: V(
      i.deviation_min_runtime_minutes,
      Rr,
      0,
      1440
    ),
    deviation_smoothing_minutes: V(
      i.deviation_smoothing_minutes,
      Nr,
      0,
      1440
    ),
    deviation_dynamic_floor_w: ze(
      i.deviation_dynamic_floor_w,
      Lr,
      0,
      5e3
    ),
    deviation_restart_entity: G(i.deviation_restart_entity),
    deviation_history_hours: V(
      i.deviation_history_hours,
      Dr,
      1,
      168
    ),
    colors: o,
    production_color_intensity: ze(
      i.production_color_intensity,
      Wr,
      0.2,
      1.6
    ),
    show_energy: !0,
    use_system_power_entity: H(i.use_system_power_entity, !1),
    system_power_entity: G(i.system_power_entity),
    invert_system_power: H(i.invert_system_power, !1),
    use_system_energy_entity: H(i.use_system_energy_entity, !1),
    system_energy_entity: G(i.system_energy_entity),
    enable_forecast_overlay: H(
      i.enable_forecast_overlay,
      Kr
    ),
    motion_enabled: H(i.motion_enabled, Vr),
    motion_power_flow: H(
      i.motion_power_flow,
      jr
    ),
    motion_update_shimmer: H(
      i.motion_update_shimmer,
      Yr
    ),
    motion_alert_ripple: H(
      i.motion_alert_ripple,
      qr
    ),
    show_custom_kpi: H(i.show_custom_kpi, !0),
    custom_kpi_title: $s(i.custom_kpi_title) ?? "Custom KPI",
    custom_kpi_entity: G(i.custom_kpi_entity),
    custom_kpi_decimals: V(
      i.custom_kpi_decimals,
      Hr,
      0,
      4
    ),
    invert_custom_kpi: H(i.invert_custom_kpi, !1),
    panel_tap_action: Es(i.panel_tap_action),
    power_decimals: V(
      i.power_decimals,
      Or,
      0,
      4
    ),
    energy_decimals: V(
      i.energy_decimals,
      Gr,
      0,
      4
    ),
    limit_panel_width: H(
      i.limit_panel_width,
      zr
    ),
    panel_max_width_px: V(
      i.panel_max_width_px,
      Br,
      120,
      320
    ),
    default_panel_rated_power_w: Jr(
      i.default_panel_rated_power_w,
      1,
      dt
    ),
    max_card_width_px: Kt(i.max_card_width_px, 300, 2400) ?? Ur,
    max_card_height_px: Kt(i.max_card_height_px, 300, 2600),
    grid_options: Is(i.grid_options)
  };
}, Gs = (i) => {
  const e = [];
  return typeof i != "object" || i === null ? ["Configuration must be an object."] : (i.rows !== void 0 && (!Number.isFinite(Number(i.rows)) || Number(i.rows) < 1) && e.push("`rows` must be a positive number."), i.columns !== void 0 && (!Number.isFinite(Number(i.columns)) || Number(i.columns) < 1) && e.push("`columns` must be a positive number."), i.max_card_width_px !== void 0 && !Number.isFinite(Number(i.max_card_width_px)) && e.push("`max_card_width_px` must be a number if set."), i.panel_max_width_px !== void 0 && (!Number.isFinite(Number(i.panel_max_width_px)) || Number(i.panel_max_width_px) < 120 || Number(i.panel_max_width_px) > 320) && e.push("`panel_max_width_px` must be between 120 and 320."), i.max_card_height_px !== void 0 && !Number.isFinite(Number(i.max_card_height_px)) && e.push("`max_card_height_px` must be a number if set."), i.custom_kpi_decimals !== void 0 && (!Number.isFinite(Number(i.custom_kpi_decimals)) || Number(i.custom_kpi_decimals) < 0 || Number(i.custom_kpi_decimals) > 4) && e.push("`custom_kpi_decimals` must be between 0 and 4."), i.production_color_intensity !== void 0 && (!Number.isFinite(Number(i.production_color_intensity)) || Number(i.production_color_intensity) < 0.2 || Number(i.production_color_intensity) > 1.6) && e.push("`production_color_intensity` must be between 0.2 and 1.6."), i.deviation_absolute_w_threshold !== void 0 && (!Number.isFinite(Number(i.deviation_absolute_w_threshold)) || Number(i.deviation_absolute_w_threshold) < 0) && e.push("`deviation_absolute_w_threshold` must be 0 or higher."), i.deviation_min_active_panels !== void 0 && (!Number.isFinite(Number(i.deviation_min_active_panels)) || Number(i.deviation_min_active_panels) < 2) && e.push("`deviation_min_active_panels` must be 2 or higher."), i.deviation_min_samples !== void 0 && (!Number.isFinite(Number(i.deviation_min_samples)) || Number(i.deviation_min_samples) < 1) && e.push("`deviation_min_samples` must be 1 or higher."), i.deviation_min_runtime_minutes !== void 0 && (!Number.isFinite(Number(i.deviation_min_runtime_minutes)) || Number(i.deviation_min_runtime_minutes) < 0) && e.push("`deviation_min_runtime_minutes` must be 0 or higher."), i.deviation_smoothing_minutes !== void 0 && (!Number.isFinite(Number(i.deviation_smoothing_minutes)) || Number(i.deviation_smoothing_minutes) < 0) && e.push("`deviation_smoothing_minutes` must be 0 or higher."), i.deviation_dynamic_floor_w !== void 0 && (!Number.isFinite(Number(i.deviation_dynamic_floor_w)) || Number(i.deviation_dynamic_floor_w) < 0) && e.push("`deviation_dynamic_floor_w` must be 0 or higher."), i.deviation_history_hours !== void 0 && (!Number.isFinite(Number(i.deviation_history_hours)) || Number(i.deviation_history_hours) < 1) && e.push("`deviation_history_hours` must be 1 or higher."), Array.isArray(i.panels) && i.panels.forEach((t, r) => {
    const s = t?.deviation_derate_percent;
    s !== void 0 && (!Number.isFinite(Number(s)) || Number(s) < 1 || Number(s) > 100) && e.push(
      `\`panels[${r}].deviation_derate_percent\` must be between 1 and 100.`
    );
  }), e);
}, Hs = { card_name: "Solar Panel Visualizer", card_description: "GUI-first solar array card with panel health, animated power rails, forecasts, history graphs, and light/dark themes." }, zs = { unavailable: "Unavailable", not_configured: "Not configured", disabled: "Disabled", unknown_recorder_error: "Unknown recorder error" }, Bs = { default_title: "Solar Array", eyebrow: "Solar Panel Visualizer", subtitle: { loading_history: "Loading shared {hours}h solar panel history...", warmup: "Deviation checks are warming up.", deviation_detected: "{count} panel{suffix} below expected output", tap_diagnostics: "Tap a panel for detailed diagnostics", drag_hint: "Drag and drop panel tiles to swap positions." }, summary: { power: "Power", energy: "Energy", alerts: "Alerts", system_sensor: "System sensor", sum_panel_sensors: "Sum of panel sensors", custom_sensor: "Custom KPI sensor", custom_default_title: "Custom KPI" }, panel: { hidden: "hidden", hidden_name: "Hidden Panel", hidden_performance: "Hidden", info_label: "Info", info_title: "Open panel details", inverter_prefix: "Status: {status}", inverter_short: { ok: "Status: OK", deviation: "Status: Deviation", error: "Status: Error" }, performance_compact: "{percent}%", performance_medium: "{percent}% of {rated}W", performance_full: "{percent}% of {rated}W Panel", string_label: "String {index}", slot_label: "R{row}C{column}", status: { normal: "normal", deviation: "deviation", inverter: "inverter", error: "error", offline: "offline", unconfigured: "unconfigured", disabled: "hidden" } }, popup: { close_detail: "Close detail", close_live_power: "Close live power detail", close_energy: "Close energy detail", close_custom_kpi: "Close custom KPI detail", close_system_health: "Close system health", panel_eyebrow: "Panel Detail {slot}", power_eyebrow: "Power Detail", power_title: "Live Power", energy_eyebrow: "Energy Detail", energy_title: "Energy", custom_eyebrow: "Custom KPI Detail", system_health_eyebrow: "System Health", system_health_title: "Overview", detail: { status: "Status", power: "Power", energy: "Energy", estimated_power_now: "Forecast production", estimated_energy_now: "Forecast production", deviation: "Deviation", rated_performance: "Rated / Performance", information: "Information", current: "Current", source: "Source" }, deviation: { inverter_mismatch: "Status mismatch", below_peers: "{percent}% below peers", within_range: "Within range" }, rated_performance: { format: "{rated} W / {percent}", na: "n/a" }, info: { power_source: "Power source: {value}", string_share: "{label}: {percent}% of {source}", current_inverter_status: 'Current status: "{value}"', inverter_evaluation: "Status evaluation: {value}", inverter_source: "Status source: {value}" }, inverter_eval: { no_status: "No status available", fault_match: "Fault term matched", working_match: "Working term matched", no_match: "No configured term matched" }, telemetry: { title: "Panel / Inverter Info", configured_title: "Configured", unconfigured_title: "Unconfigured", none_configured: "No advanced telemetry configured for this panel.", setup_hint: "Configure in Panels > Advanced telemetry.", label: { inverter_status: "Inverter / panel status", inverter_ac_power: "Inverter AC power", inverter_ac_voltage: "Inverter AC voltage", inverter_ac_current: "Inverter AC current", inverter_temp: "Inverter temperature", panel_current: "Panel current", panel_voltage: "Panel voltage", panel_power: "Panel power" } }, history: { power: "Power History", system_power: "System Power History", total_panel_power: "Total Panel Power History", system_energy: "System Energy History", total_panel_energy: "Total Panel Energy History", panel_power_values: "Panel Power Values", panel_energy_values: "Panel Energy Values", panel_compare: "Panel Performance Comparison", panel_compare_power: "Panel Power Comparison", panel_compare_energy: "Panel Energy Comparison", overlay_forecast: "Forecast", graph_not_configured: "No sensor configured for graph.", custom_not_configured: "No sensor configured for Custom KPI.", loading: "Loading sensor history...", no_data: "No history data for selected range.", unable_load: "Unable to load panel history ({error})", unable_load_plain: "Unable to load panel history", max: "Max {value}", median: "Median {value}", min: "Min {value}", time_range: "{start} - {end}" }, forecast: { enable_button: "Enable forecasts", disabled_hint: "Forecast overlay is disabled.", not_configured: "Forecast.Solar not configured.", default_sensor_not_found: "Default forecast sensor not found ({entity}).", power_compare_requires_system: "System power sensor is required for power forecast comparison.", energy_compare_requires_system: "System energy sensor is required for energy forecast comparison." }, panel_compare: { toggle: "Compare Panel Performance", toggle_power: "Compare Panel Power", toggle_energy: "Compare Panel Energy", loading: "Loading panel comparison history...", no_panels: "No configured panel sensors available for comparison.", no_panels_power: "No configured panel power sensors available for comparison.", no_panels_energy: "No configured panel energy sensors available for comparison.", no_data: "No comparison data for selected range.", unable_load: "Unable to load panel comparison history ({error}).", render_failure: "Comparison data loaded, but traces could not be drawn.", diagnostics_title: "Compare graph diagnostics (temporary)", diagnostics_summary: "model hasData={hasData}, drawable={drawable}, series={series}, range={range}h", diagnostics_reason_render_failure: "Series exist but no drawable traces were produced.", diagnostics_reason_suspect: "One or more series produced an invalid drawable shape.", diagnostics_row: "{label}: samples={samples}, points={points}, first={first}, last={last}, min={min}, max={max}" }, system_health: { everything_ok: "Everything is working well.", section: { inverter: "Inverter", error: "Error", deviation: "Deviation", offline: "Unavailable", setup: "Needs setup" }, item: "Panel on {slot} ({label}): {reason}" } }, quick_setup: { title: "Quick Setup:", select_power_sensor: "Select panel power sensor:", selector_label: "Select panel power sensor", no_sensors: "No available W sensors found.", disable_panel: "Disable Panel (hide but keep slot when off)" }, system_health_chip: { faults: "{count} Fault{suffix}", unavailable: "{count} Unavailable", deviation: "{count} Deviation", needs_setup: "{count} Needs Setup", ok: "System OK" } }, Us = { reason: { slot_hidden: "Panel slot is hidden in the card configuration.", select_power_sensor: "Select a power sensor to activate this panel slot.", power_entity_missing: "Power entity {entity} was not found.", power_entity_unavailable: "{entity} is unavailable.", inverter_fault_match: 'Current status: "{status}" matches configured fault terms.', inverter_working_mismatch: 'Current status: "{status}" does not match configured working terms.', producing_expected: "Producing within the expected array range.", producing_adjusted: "Producing within array-adjusted target range.", rated_not_configured: "Rated power not configured; excluded from deviation checks.", output_below_target: "Output is {percent}% and {shortfall} W below array target.", array_check_disabled: "Array Health Check is disabled.", need_non_derated_panels: "Need at least {count} non-derated active rated panels for deviation checks.", collecting_samples: "Collecting samples ({current}/{required}).", warmup_progress: "Warm-up in progress ({current}/{required} min).", low_light_pause: "Low-light pause: waiting above {floor} W target floor." }, status_display: { disabled: "Disabled", not_configured: "Not configured" }, energy: { default_unit: "kWh" }, power: { default_unit: "W" } }, Ws = { section: { layout_title: "Layout", layout_copy: "Set the array size first. Panel slots expand automatically from the row and column values.", display_title: "Display", display_copy: "Tune precision and panel detail behavior.", appearance_title: "Appearance", appearance_copy: "Auto follows the active Home Assistant theme. Force Light or Dark if a dashboard theme needs a specific card style.", forecast_title: "Forecast.Solar", forecast_copy: "Auto-detects Home Assistant default forecast sensors and overlays estimated production in Power/Energy KPI popups.", array_health_title: "Array Health Check", array_health_copy: "Automatically checks panel health by comparing active panels against each other using rated power, shared solar panel history, and configurable guardrails.", array_health_smoothing_help: "Smoothing window averages recent samples before checks; 0 means no smoothing.", inverter_title: "Status Checks", inverter_copy: "Track textual status from each panel’s inverter or panel status sensor. A panel turns red only when status text contains one of the configured fault terms. The current status is shown in the panel popup.", status_colors_title: "Status Colors", status_colors_copy: "Production colors blend based on panel output. Alert colors override the production scale.", motion_title: "Motion", motion_copy: "Animate live production with left-collector power rails, Power/Energy KPI impact effects, and repeated alert ripples. Motion automatically respects reduced-motion preferences.", panels_title: "Panels", panels_copy: "Each generated slot can be configured with its own power, energy, and optional inverter/panel status sensor. Disable a slot to hide that panel while keeping grid spacing.", panels_drag_hint: "In the card view, drag and drop panel tiles to swap their positions.", string_setup_title: "String of panels", string_setup_copy: "Use this when one power or energy sensor represents a full string of physical panels. The tree creates one visual row per string.", panel_defaults_title: "Panel default rated power", panel_defaults_copy: "Set a common default panel power and apply it to all panel slots.", autofill_title: "Auto-populate sensors", autofill_copy: "Fill panel sensors in slot order. Use sensor. for exact entity ID prefixes, or type friendly-name text to search sensor names.", advanced_title: "Advanced telemetry", advanced_copy: "Optional manual telemetry mappings shown in the panel popup when pressing INFO." }, field: { title: "Title", rows: "Rows", columns: "Columns", max_card_width: "Max card width (px)", max_card_height: "Max card height (px)", theme_mode: "Theme mode", power_decimals: "Power decimals", energy_decimals: "Energy decimals", custom_kpi_decimals: "Custom KPI decimals", panel_tap_action: "Panel tap action", system_power_sensor: "System power sensor (W)", system_energy_sensor: "System daily energy sensor", custom_kpi_sensor: "Custom KPI sensor", custom_kpi_heading: "Custom KPI heading", max_panel_tile_width: "Max panel tile width (px)", deviation_threshold: "Deviation threshold (%)", deviation_absolute_shortfall: "Absolute shortfall threshold (W)", deviation_check_time: "Deviation check time (minutes)", deviation_min_active_panels: "Minimum active panels", deviation_min_samples: "Minimum samples per panel", deviation_smoothing: "Smoothing window (minutes)", deviation_dynamic_floor: "Dynamic floor start (W)", deviation_history_window: "Shared history window (hours)", fault_terms: "Fault terms (comma-separated)", working_terms: "Working terms (comma-separated)", production_base: "Production base", production_mid: "Production mid", production_peak: "Production peak", deviation_color: "Deviation", error_color: "Error", unavailable_color: "Unavailable", production_intensity: "Production color intensity ({value})", default_panel_rated_power: "Default panel rated power (W)", power_prefix: "Power search", energy_prefix: "Energy search (optional)", status_prefix: "Status search (optional)", autofill_sort_mode: "Auto-fill sort order", string_group_count: "Number of strings", string_group_name: "String name", string_group_panel_count: "Number of panels", string_group_power_sensor: "String power sensor", string_group_energy_sensor: "String energy sensor (optional)", display_name: "Display name", power_sensor: "Power sensor P(W)", energy_sensor: "Energy sensor (kWh/Wh)", panel_rated_power: "Panel rated power (W)", deviation_derate: "Deviation derate (%)", inverter_status_sensor: "Inverter / panel status sensor (optional)", advanced_inverter_ac_power: "Inverter AC power (W)", advanced_inverter_ac_voltage: "Inverter AC voltage (V)", advanced_inverter_ac_current: "Inverter AC current (A)", advanced_inverter_temp: "Inverter temperature (°C/°F)", advanced_panel_current: "Panel current (A)", advanced_panel_voltage: "Panel voltage (V)", advanced_panel_power: "Panel power (W)", panel_energy_toggle: "Show panel energy", panel_enabled_toggle: "Show panel tile (hide but keep slot when off)" }, toggle: { use_system_power: "Use one system power sensor for top KPI", invert_system_power: "Invert system power value", use_system_energy: "Use one system daily energy sensor for top KPI", invert_custom_kpi: "Invert Custom KPI value", enable_forecast_overlay: "Enable forecast overlays in popups", motion_enabled: "Enable motion", motion_power_flow: "Power-rail flow to Power KPI", motion_update_shimmer: "Power/Energy KPI update effect", motion_alert_ripple: "Alert ripple for deviation/inverter/error", show_custom_kpi: "Show Custom KPI box", limit_panel_width: "Limit panel tile max width", enable_array_health: "Enable Array Health Check", enable_inverter_status: "Enable status checks", show_inverter_status_tiles: "Show status on panel tiles", enable_string_sensor_sharing: "String of panels / share duplicate sensors", autofill_inverter_status: "Fill inverter or panel status", autofill_advanced_telemetry: "Fill advanced telemetry" }, select: { theme_auto: "Auto", theme_dark: "Dark", theme_light: "Light", panel_tap_details: "Open detail popover", panel_tap_none: "No action", autofill_sort_auto: "Auto detect (recommended)", autofill_sort_entity: "Literal entity ID order", autofill_sort_friendly: "Literal friendly name order", autofill_sort_grouped: "Group by repeated suffix" }, button: { apply_default_rated_power: "Apply default rated W to all panels", autofill_sensors: "Auto-fill panel sensors", remove_all_sensors: "Remove all sensors" }, helper: { fault_example: "Example: fault, alarm, error, failed, failure, trip", working_example: "Working example: normal, ok, running, waiting for operation, producing", derate_help: "Used only by Array Health Check for naturally shaded panels.", autofill_search_help: "Search with sensor.panel_ to match entity IDs by prefix, or type words like Roof Panel or Daily Energy to search friendly names. Auto detect is recommended for most setups: it uses natural sorting and can group matching sensors by repeated serial/device parts or serial-like suffixes when that better matches the physical layout. Use the other sort modes only when Auto does not match your array.", string_sensor_sharing_help: "Turn this on to allow duplicate string sensors. Shared power and energy values are split across the generated panels by rated W, with equal split if rated W is missing.", autofill_inverter_status_help: "When enabled, status is filled from configured panel power sensors. The card first tries one-to-one panel status matches, then falls back to a shared inverter/string status sensor. Use Status search only when you need to narrow the candidates.", autofill_advanced_help: "When enabled, advanced telemetry is filled from configured panel power sensors by matching the same repeated serial/device/group. Existing advanced telemetry choices are preserved." }, forecast: { default_sensors: "Uses: sensor.power_production_now and sensor.energy_production_today.", line_help: "The forecast reference is a thin dashed line shown only for the selected history range up to the current time, with no future projection.", detected: "Forecast.Solar default sensors detected.", missing: "Forecast.Solar default sensors not fully detected. Expected: sensor.power_production_now and sensor.energy_production_today." }, panel_slot_title: "Row {row}, Column {column}", autofill: { enter_prefix: "Enter at least one prefix to run auto-fill.", power_summary: "Power matched {matched}, filled {filled}, skipped {skipped}.", energy_summary: "Energy matched {matched}, filled {filled}, skipped {skipped}.", inverter_status_summary: "Status filled {filled} panels, skipped {skipped} panels.", advanced_summary: "Advanced telemetry filled {filled} fields, skipped {skipped} panels.", cleared: "Cleared power, energy, inverter, and advanced telemetry sensors on all panels." }, string_group: { panel_count_chip: "{count} panels" } }, ts = {
  meta: Hs,
  common: zs,
  card: Bs,
  state: Us,
  editor: Ws
}, Ks = { DEV: !1 }, Vs = {
  en: ts
}, jt = /* @__PURE__ */ new Set(), js = () => typeof import.meta < "u" ? Ks.DEV : typeof process < "u" ? process.env.NODE_ENV !== "production" : !1, Ys = (i, e) => {
  if (!js())
    return;
  const t = `${e ?? "unknown"}:${i}`;
  jt.has(t) || (jt.add(t), console.warn(
    `[Solar Panel Visualizer i18n] Missing translation key "${i}" for locale "${e ?? "unknown"}".`
  ));
}, Yt = (i, e) => {
  if (i)
    return e.split(".").reduce(
      (t, r) => typeof t == "object" && t !== null ? t[r] : void 0,
      i
    );
}, qt = (i, e) => e ? i.replace(/\{([a-zA-Z0-9_]+)\}/g, (t, r) => {
  const s = e[r];
  return s === void 0 ? `{${r}}` : String(s);
}) : i, qs = (i) => {
  if (!i)
    return ["en"];
  const e = i.trim().toLowerCase();
  if (e.length === 0)
    return ["en"];
  const t = e.split("-")[0], r = [e, t, "en"];
  return [...new Set(r)];
}, Xs = (i, e, t, r) => {
  for (const n of qs(e)) {
    const o = Yt(i[n], t);
    if (typeof o == "string")
      return qt(o, r);
  }
  const s = Yt(i.en ?? ts, t);
  return typeof s == "string" ? qt(s, r) : (Ys(t, e), "");
}, ht = (i, e, t) => Xs(
  Vs,
  i,
  e,
  t
), rs = (i, e, t) => ht(i?.locale?.language, e, t);
const ot = globalThis, Lt = ot.ShadowRoot && (ot.ShadyCSS === void 0 || ot.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Dt = /* @__PURE__ */ Symbol(), Xt = /* @__PURE__ */ new WeakMap();
let ss = class {
  constructor(e, t, r) {
    if (this._$cssResult$ = !0, r !== Dt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (Lt && e === void 0) {
      const r = t !== void 0 && t.length === 1;
      r && (e = Xt.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), r && Xt.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Qs = (i) => new ss(typeof i == "string" ? i : i + "", void 0, Dt), Ot = (i, ...e) => {
  const t = i.length === 1 ? i[0] : e.reduce((r, s, n) => r + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + i[n + 1], i[0]);
  return new ss(t, i, Dt);
}, Zs = (i, e) => {
  if (Lt) i.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const r = document.createElement("style"), s = ot.litNonce;
    s !== void 0 && r.setAttribute("nonce", s), r.textContent = t.cssText, i.appendChild(r);
  }
}, Qt = Lt ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const r of e.cssRules) t += r.cssText;
  return Qs(t);
})(i) : i;
const { is: Js, defineProperty: ei, getOwnPropertyDescriptor: ti, getOwnPropertyNames: ri, getOwnPropertySymbols: si, getPrototypeOf: ii } = Object, le = globalThis, Zt = le.trustedTypes, ni = Zt ? Zt.emptyScript : "", oi = le.reactiveElementPolyfillSupport, Ue = (i, e) => i, Tt = { toAttribute(i, e) {
  switch (e) {
    case Boolean:
      i = i ? ni : null;
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
} }, is = (i, e) => !Js(i, e), Jt = { attribute: !0, type: String, converter: Tt, reflect: !1, useDefault: !1, hasChanged: is };
Symbol.metadata ?? (Symbol.metadata = /* @__PURE__ */ Symbol("metadata")), le.litPropertyMetadata ?? (le.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let ke = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = Jt) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const r = /* @__PURE__ */ Symbol(), s = this.getPropertyDescriptor(e, r, t);
      s !== void 0 && ei(this.prototype, e, s);
    }
  }
  static getPropertyDescriptor(e, t, r) {
    const { get: s, set: n } = ti(this.prototype, e) ?? { get() {
      return this[t];
    }, set(o) {
      this[t] = o;
    } };
    return { get: s, set(o) {
      const l = s?.call(this);
      n?.call(this, o), this.requestUpdate(e, l, r);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Jt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Ue("elementProperties"))) return;
    const e = ii(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Ue("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Ue("properties"))) {
      const t = this.properties, r = [...ri(t), ...si(t)];
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
      for (const s of r) t.unshift(Qt(s));
    } else e !== void 0 && t.push(Qt(e));
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
    return Zs(e, this.constructor.elementStyles), e;
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
      const n = (r.converter?.toAttribute !== void 0 ? r.converter : Tt).toAttribute(t, r.type);
      this._$Em = e, n == null ? this.removeAttribute(s) : this.setAttribute(s, n), this._$Em = null;
    }
  }
  _$AK(e, t) {
    const r = this.constructor, s = r._$Eh.get(e);
    if (s !== void 0 && this._$Em !== s) {
      const n = r.getPropertyOptions(s), o = typeof n.converter == "function" ? { fromAttribute: n.converter } : n.converter?.fromAttribute !== void 0 ? n.converter : Tt;
      this._$Em = s;
      const l = o.fromAttribute(t, n.type);
      this[s] = l ?? this._$Ej?.get(s) ?? l, this._$Em = null;
    }
  }
  requestUpdate(e, t, r, s = !1, n) {
    if (e !== void 0) {
      const o = this.constructor;
      if (s === !1 && (n = this[e]), r ?? (r = o.getPropertyOptions(e)), !((r.hasChanged ?? is)(n, t) || r.useDefault && r.reflect && n === this._$Ej?.get(e) && !this.hasAttribute(o._$Eu(e, r)))) return;
      this.C(e, t, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: r, reflect: s, wrapped: n }, o) {
    r && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, o ?? t ?? this[e]), n !== !0 || o !== void 0) || (this._$AL.has(e) || (this.hasUpdated || r || (t = void 0), this._$AL.set(e, t)), s === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
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
        for (const [s, n] of this._$Ep) this[s] = n;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [s, n] of r) {
        const { wrapped: o } = n, l = this[s];
        o !== !0 || this._$AL.has(s) || l === void 0 || this.C(s, void 0, n, l);
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
ke.elementStyles = [], ke.shadowRootOptions = { mode: "open" }, ke[Ue("elementProperties")] = /* @__PURE__ */ new Map(), ke[Ue("finalized")] = /* @__PURE__ */ new Map(), oi?.({ ReactiveElement: ke }), (le.reactiveElementVersions ?? (le.reactiveElementVersions = [])).push("2.1.2");
const We = globalThis, er = (i) => i, ut = We.trustedTypes, tr = ut ? ut.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, ns = "$lit$", ae = `lit$${Math.random().toFixed(9).slice(2)}$`, os = "?" + ae, ai = `<${os}>`, ge = document, Ve = () => ge.createComment(""), je = (i) => i === null || typeof i != "object" && typeof i != "function", Gt = Array.isArray, li = (i) => Gt(i) || typeof i?.[Symbol.iterator] == "function", xt = `[ 	
\f\r]`, Oe = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, rr = /-->/g, sr = />/g, de = RegExp(`>|${xt}(?:([^\\s"'>=/]+)(${xt}*=${xt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ir = /'/g, nr = /"/g, as = /^(?:script|style|textarea|title)$/i, ls = (i) => (e, ...t) => ({ _$litType$: i, strings: e, values: t }), y = ls(1), U = ls(2), Fe = /* @__PURE__ */ Symbol.for("lit-noChange"), w = /* @__PURE__ */ Symbol.for("lit-nothing"), or = /* @__PURE__ */ new WeakMap(), me = ge.createTreeWalker(ge, 129);
function cs(i, e) {
  if (!Gt(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return tr !== void 0 ? tr.createHTML(e) : e;
}
const ci = (i, e) => {
  const t = i.length - 1, r = [];
  let s, n = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", o = Oe;
  for (let l = 0; l < t; l++) {
    const a = i[l];
    let c, p, d = -1, h = 0;
    for (; h < a.length && (o.lastIndex = h, p = o.exec(a), p !== null); ) h = o.lastIndex, o === Oe ? p[1] === "!--" ? o = rr : p[1] !== void 0 ? o = sr : p[2] !== void 0 ? (as.test(p[2]) && (s = RegExp("</" + p[2], "g")), o = de) : p[3] !== void 0 && (o = de) : o === de ? p[0] === ">" ? (o = s ?? Oe, d = -1) : p[1] === void 0 ? d = -2 : (d = o.lastIndex - p[2].length, c = p[1], o = p[3] === void 0 ? de : p[3] === '"' ? nr : ir) : o === nr || o === ir ? o = de : o === rr || o === sr ? o = Oe : (o = de, s = void 0);
    const u = o === de && i[l + 1].startsWith("/>") ? " " : "";
    n += o === Oe ? a + ai : d >= 0 ? (r.push(c), a.slice(0, d) + ns + a.slice(d) + ae + u) : a + ae + (d === -2 ? l : u);
  }
  return [cs(i, n + (i[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), r];
};
class Ye {
  constructor({ strings: e, _$litType$: t }, r) {
    let s;
    this.parts = [];
    let n = 0, o = 0;
    const l = e.length - 1, a = this.parts, [c, p] = ci(e, t);
    if (this.el = Ye.createElement(c, r), me.currentNode = this.el.content, t === 2 || t === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (s = me.nextNode()) !== null && a.length < l; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const d of s.getAttributeNames()) if (d.endsWith(ns)) {
          const h = p[o++], u = s.getAttribute(d).split(ae), g = /([.?@])?(.*)/.exec(h);
          a.push({ type: 1, index: n, name: g[2], strings: u, ctor: g[1] === "." ? di : g[1] === "?" ? hi : g[1] === "@" ? ui : ft }), s.removeAttribute(d);
        } else d.startsWith(ae) && (a.push({ type: 6, index: n }), s.removeAttribute(d));
        if (as.test(s.tagName)) {
          const d = s.textContent.split(ae), h = d.length - 1;
          if (h > 0) {
            s.textContent = ut ? ut.emptyScript : "";
            for (let u = 0; u < h; u++) s.append(d[u], Ve()), me.nextNode(), a.push({ type: 2, index: ++n });
            s.append(d[h], Ve());
          }
        }
      } else if (s.nodeType === 8) if (s.data === os) a.push({ type: 2, index: n });
      else {
        let d = -1;
        for (; (d = s.data.indexOf(ae, d + 1)) !== -1; ) a.push({ type: 7, index: n }), d += ae.length - 1;
      }
      n++;
    }
  }
  static createElement(e, t) {
    const r = ge.createElement("template");
    return r.innerHTML = e, r;
  }
}
function Te(i, e, t = i, r) {
  if (e === Fe) return e;
  let s = r !== void 0 ? t._$Co?.[r] : t._$Cl;
  const n = je(e) ? void 0 : e._$litDirective$;
  return s?.constructor !== n && (s?._$AO?.(!1), n === void 0 ? s = void 0 : (s = new n(i), s._$AT(i, t, r)), r !== void 0 ? (t._$Co ?? (t._$Co = []))[r] = s : t._$Cl = s), s !== void 0 && (e = Te(i, s._$AS(i, e.values), s, r)), e;
}
class pi {
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
    const { el: { content: t }, parts: r } = this._$AD, s = (e?.creationScope ?? ge).importNode(t, !0);
    me.currentNode = s;
    let n = me.nextNode(), o = 0, l = 0, a = r[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let c;
        a.type === 2 ? c = new Xe(n, n.nextSibling, this, e) : a.type === 1 ? c = new a.ctor(n, a.name, a.strings, this, e) : a.type === 6 && (c = new _i(n, this, e)), this._$AV.push(c), a = r[++l];
      }
      o !== a?.index && (n = me.nextNode(), o++);
    }
    return me.currentNode = ge, s;
  }
  p(e) {
    let t = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(e, r, t), t += r.strings.length - 2) : r._$AI(e[t])), t++;
  }
}
class Xe {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, t, r, s) {
    this.type = 2, this._$AH = w, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = r, this.options = s, this._$Cv = s?.isConnected ?? !0;
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
    e = Te(this, e, t), je(e) ? e === w || e == null || e === "" ? (this._$AH !== w && this._$AR(), this._$AH = w) : e !== this._$AH && e !== Fe && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : li(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== w && je(this._$AH) ? this._$AA.nextSibling.data = e : this.T(ge.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: t, _$litType$: r } = e, s = typeof r == "number" ? this._$AC(e) : (r.el === void 0 && (r.el = Ye.createElement(cs(r.h, r.h[0]), this.options)), r);
    if (this._$AH?._$AD === s) this._$AH.p(t);
    else {
      const n = new pi(s, this), o = n.u(this.options);
      n.p(t), this.T(o), this._$AH = n;
    }
  }
  _$AC(e) {
    let t = or.get(e.strings);
    return t === void 0 && or.set(e.strings, t = new Ye(e)), t;
  }
  k(e) {
    Gt(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let r, s = 0;
    for (const n of e) s === t.length ? t.push(r = new Xe(this.O(Ve()), this.O(Ve()), this, this.options)) : r = t[s], r._$AI(n), s++;
    s < t.length && (this._$AR(r && r._$AB.nextSibling, s), t.length = s);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    for (this._$AP?.(!1, !0, t); e !== this._$AB; ) {
      const r = er(e).nextSibling;
      er(e).remove(), e = r;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class ft {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, r, s, n) {
    this.type = 1, this._$AH = w, this._$AN = void 0, this.element = e, this.name = t, this._$AM = s, this.options = n, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = w;
  }
  _$AI(e, t = this, r, s) {
    const n = this.strings;
    let o = !1;
    if (n === void 0) e = Te(this, e, t, 0), o = !je(e) || e !== this._$AH && e !== Fe, o && (this._$AH = e);
    else {
      const l = e;
      let a, c;
      for (e = n[0], a = 0; a < n.length - 1; a++) c = Te(this, l[r + a], t, a), c === Fe && (c = this._$AH[a]), o || (o = !je(c) || c !== this._$AH[a]), c === w ? e = w : e !== w && (e += (c ?? "") + n[a + 1]), this._$AH[a] = c;
    }
    o && !s && this.j(e);
  }
  j(e) {
    e === w ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class di extends ft {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === w ? void 0 : e;
  }
}
class hi extends ft {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== w);
  }
}
class ui extends ft {
  constructor(e, t, r, s, n) {
    super(e, t, r, s, n), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = Te(this, e, t, 0) ?? w) === Fe) return;
    const r = this._$AH, s = e === w && r !== w || e.capture !== r.capture || e.once !== r.once || e.passive !== r.passive, n = e !== w && (r === w || s);
    s && this.element.removeEventListener(this.name, this, r), n && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class _i {
  constructor(e, t, r) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    Te(this, e);
  }
}
const mi = We.litHtmlPolyfillSupport;
mi?.(Ye, Xe), (We.litHtmlVersions ?? (We.litHtmlVersions = [])).push("3.3.2");
const gi = (i, e, t) => {
  const r = t?.renderBefore ?? e;
  let s = r._$litPart$;
  if (s === void 0) {
    const n = t?.renderBefore ?? null;
    r._$litPart$ = s = new Xe(e.insertBefore(Ve(), n), n, void 0, t ?? {});
  }
  return s._$AI(i), s;
};
const Ke = globalThis;
class Ie extends ke {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = gi(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return Fe;
  }
}
Ie._$litElement$ = !0, Ie.finalized = !0, Ke.litElementHydrateSupport?.({ LitElement: Ie });
const fi = Ke.litElementPolyfillSupport;
fi?.({ LitElement: Ie });
(Ke.litElementVersions ?? (Ke.litElementVersions = [])).push("4.2.2");
const yi = (i) => Object.is(i, -0) ? 0 : i, vi = (i) => Math.min(Math.max(Math.round(i), 0), 4), wi = (i, e, t, r) => {
  const s = Number(i);
  if (!Number.isFinite(s))
    return null;
  const n = vi(t), o = new Intl.NumberFormat(e, {
    minimumFractionDigits: n,
    maximumFractionDigits: n
  }).format(yi(s)), l = r?.trim();
  return l ? `${o} ${l}` : o;
}, bi = "sensor.power_production_now", xi = "sensor.energy_production_today", Pi = {
  power: bi,
  energy: xi
}, at = (i) => Pi[i], Si = (i, e) => {
  const t = at(e);
  return i?.states?.[t] ? t : null;
}, $i = 1100, Ci = 900, ar = 900, Ei = 6e3, ki = 5e3, Ii = 16e3, Pt = /* @__PURE__ */ new Set(["deviation", "inverter", "error"]);
class Fi {
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
    e && (!this._flags.enabled || !this._flags.powerFlow || this._reducedMotion || e.popupOpen || e.totalPower <= 0 || this._armTransient("power", this._kpiShimmers, Ci, "kpi-shimmer"));
  }
  completeFlowPulse() {
    const e = this._flowPulsePanelId;
    e && this._finalizeActiveFlowPulse(e);
  }
  _refreshFlowPulseLoop(e) {
    const t = Object.entries(e.panelPowers).filter(([, o]) => typeof o == "number" && o > 0).map(([o]) => o);
    if (!this._canRunFlowPulse(e, t.length)) {
      this._clearFlowPulseLoop();
      return;
    }
    const s = t.join("|"), n = this._flowPulsePanelOrder.join("|");
    s !== n && (this._flowPulsePanelOrder = t, this._flowPulseIndex = 0, this._clearTimeoutByKey("flow-pulse-step"), this._clearTimeoutByKey("flow-pulse-timeout"), this._flowPulsePanelId !== null && (this._flowPulsePanelId = null, this._notify())), !(this._timers.has("flow-pulse-step") || this._timers.has("flow-pulse-timeout") || this._flowPulsePanelId !== null) && this._triggerNextFlowPulse();
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
    }, Ii);
    this._timers.set("flow-pulse-timeout", t);
  }
  _scheduleNextFlowPulse() {
    this._clearTimeoutByKey("flow-pulse-step");
    const e = window.setTimeout(() => {
      this._timers.delete("flow-pulse-step"), this._triggerNextFlowPulse();
    }, ki);
    this._timers.set("flow-pulse-step", e);
  }
  _finalizeActiveFlowPulse(e) {
    this._flowPulsePanelId === e && (this._clearTimeoutByKey("flow-pulse-timeout"), this._flowPulsePanelId = null, this._notify(), this.triggerPowerImpactFromPulse(), this._scheduleNextFlowPulse());
  }
  _clearFlowPulseLoop() {
    this._clearTimeoutByKey("flow-pulse-step"), this._clearTimeoutByKey("flow-pulse-timeout"), this._flowPulsePanelOrder = [], this._flowPulseIndex = 0, this._flowPulsePanelId !== null && (this._flowPulsePanelId = null, this._notify());
  }
  _triggerKpiShimmers(e, t) {
    e.energyKpiValue !== t.energyKpiValue && this._armTransient("energy", this._kpiShimmers, $i, "kpi-shimmer");
  }
  _triggerAlertRipples(e, t) {
    for (const [r, s] of Object.entries(t.panelStatuses)) {
      const n = e.panelStatuses[r];
      s !== n && Pt.has(s) && this._armTransient(r, this._alertRipples, ar, "alert-ripple");
    }
  }
  _syncAlertRippleLoops(e) {
    if (!this._flags.alertRipple) {
      for (const r of [...this._timers.keys()])
        r.startsWith("alert-ripple-loop:") && this._clearTimeoutByKey(r);
      return;
    }
    const t = new Set(
      Object.entries(e.panelStatuses).filter(([, r]) => Pt.has(r)).map(([r]) => r)
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
      this._armTransient(e, this._alertRipples, ar, "alert-ripple"), this._armAlertRippleLoop(e);
    }, Ei);
    this._timers.set(t, r);
  }
  _canRepeatAlertRipple(e) {
    const t = this._snapshot;
    if (!t || !this._flags.enabled || !this._flags.alertRipple || this._reducedMotion)
      return !1;
    const r = t.panelStatuses[e];
    return Pt.has(r);
  }
  _alertRippleLoopKey(e) {
    return `alert-ripple-loop:${e}`;
  }
  _armTransient(e, t, r, s) {
    t.add(e), this._notify();
    const n = `${s}:${e}`;
    this._clearTimeoutByKey(n);
    const o = window.setTimeout(() => {
      t.delete(e), this._timers.delete(n), this._notify();
    }, r);
    this._timers.set(n, o);
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
const Q = (i, e, t) => Math.max(e, Math.min(t, i)), lr = (i, e) => Math.abs(i - e) < 0.01, Ti = (i, e) => Math.hypot(e.x - i.x, e.y - i.y), Mi = (i, e) => ({
  x: i.left - e.left + i.width / 2,
  y: i.top - e.top + i.height / 2
}), Ge = "rgba(224, 232, 242, 1)", Ai = 8, cr = 28, it = 14, Ri = (i) => {
  const e = [];
  for (const t of i) {
    const r = e[e.length - 1];
    r && lr(r.x, t.x) && lr(r.y, t.y) || e.push(t);
  }
  return e;
}, pr = (i) => {
  const e = Ri(i);
  if (e.length < 2)
    return { d: "", length: 0 };
  let t = `M ${e[0].x.toFixed(2)} ${e[0].y.toFixed(2)}`, r = 0;
  for (let s = 1; s < e.length; s += 1) {
    const n = e[s - 1], o = e[s];
    t += ` L ${o.x.toFixed(2)} ${o.y.toFixed(2)}`, r += Ti(n, o);
  }
  return { d: t, length: r };
}, Ni = (i, e, t, r) => {
  const s = t - e;
  if (!Number.isFinite(i) || !Number.isFinite(e) || !Number.isFinite(t) || !Number.isFinite(r) || i <= 0 || s <= 0)
    return !1;
  const n = e + s * 0.28, o = i * 0.36;
  return r >= Math.max(n, o) && r <= t;
}, Li = (i, e, t = !1, r = { x: 0, y: 0 }) => {
  const s = Mi(e, i), n = e.left - i.left, o = e.bottom - i.top;
  return {
    entry: {
      x: (t ? s.x : n - 0.5) + r.x,
      y: (t ? o + 0.5 : s.y) + r.y
    }
  };
}, Di = (i) => {
  const e = i.left + (i.right - i.left) * 0.22;
  return Q(i.statusCenterX || e, i.left + 10, i.right - 10);
}, Oi = (i) => {
  if (i.length === 0)
    return [];
  const e = i.reduce((l, a) => l + Math.max(1, a.bottom - a.top), 0) / i.length, t = Q(e * 0.32, 6, 28), r = [], s = [], n = new Array(i.length).fill(0), o = i.map((l, a) => ({ item: l, index: a })).sort((l, a) => l.item.top - a.item.top || l.item.left - a.item.left);
  for (const { item: l, index: a } of o) {
    const c = l.top + (l.bottom - l.top) / 2;
    let p = r.findIndex((d) => Math.abs(d - c) <= t);
    p < 0 ? (p = r.length, r.push(c), s.push(1)) : (s[p] += 1, r[p] = r[p] + (c - r[p]) / s[p]), n[a] = p;
  }
  return n;
}, Gi = (i, e, t, r, s = Math.min(...i.map((o) => o.left)), n = "left-collector") => {
  const o = [], l = [], a = [], c = [], p = (m, P, k) => {
    const F = pr(P);
    F.d && l.push({
      id: m,
      d: F.d,
      color: Ge,
      opacity: k,
      delayMs: 0,
      durationMs: 1200,
      travelPx: Math.max(24, F.length)
    });
  }, d = (m) => {
    a.some((k) => {
      const F = k.cx - m.cx, A = k.cy - m.cy;
      return Math.hypot(F, A) < Math.max(k.r, m.r) * 0.9;
    }) || a.push(m);
  }, h = /* @__PURE__ */ new Map();
  for (const m of i) {
    const P = h.get(m.row) ?? [];
    P.push(m), h.set(m.row, P);
  }
  const u = [...h.entries()].sort((m, P) => m[0] - P[0]).map(([m, P]) => ({
    row: m,
    busY: 0,
    minTop: Math.min(...P.map((k) => k.top)),
    maxBottom: Math.max(...P.map((k) => k.bottom))
  }));
  if (u.length === 0)
    return { flowPaths: o, topologyPaths: l, topologyNodes: a, collectorX: it, rowBuses: c };
  const g = Math.max(0, Math.min(s, ...i.map((m) => m.left))), f = Math.max(6, it * 0.5), v = Math.max(f, g - 8), x = Q(
    g / 2,
    f,
    Math.min(v, Math.max(it, r - it))
  ), S = e.y + 8;
  for (let m = 0; m < u.length; m += 1) {
    const P = u[m], k = u[m - 1], F = P.minTop - 12, A = m === 0 ? S : Math.max(k.maxBottom + 8, k.busY + 8), O = P.minTop - 6;
    P.busY = O > A ? Q(F, A, O) : Math.max(S, P.minTop - 6);
  }
  const I = Q(0.24 / Math.sqrt(Math.max(u.length, 1)), 0.15, 0.22), M = Q(0.24 / Math.sqrt(Math.max(i.length, 1)), 0.09, 0.16);
  d({
    id: "power-socket-node",
    cx: e.x,
    cy: e.y,
    r: Q(t * 0.18, 2.8, 4.8),
    color: Ge,
    opacity: 0.36
  });
  const $ = u[0], E = Math.max(...u.map((m) => m.busY)), L = n === "direct-first-row", R = u.length > 1;
  L ? (p(
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
    r: Q(t * 0.18, 2.8, 4.8),
    color: Ge,
    opacity: 0.36
  }), R && p(
    "collector-rail",
    [
      { x, y: $.busY },
      { x, y: E }
    ],
    I
  )) : (p(
    "collector-rail",
    [
      { x, y: e.y },
      { x, y: E }
    ],
    I
  ), p(
    "power-entry-rail",
    [
      { x, y: e.y },
      e
    ],
    I
  ));
  for (const m of u) {
    const P = h.get(m.row) ?? [];
    if (P.length === 0)
      continue;
    const k = P.map((b) => b.anchorX), F = m.row === $.row, A = L && F ? [e.x, ...k, ...R ? [x] : []] : [x, ...k], O = Math.min(...A), se = Math.max(...A);
    c.push({
      row: m.row,
      y: m.busY,
      startX: O,
      endX: se
    }), p(
      `row-rail-${m.row}`,
      [
        { x: O, y: m.busY },
        { x: se, y: m.busY }
      ],
      I
    ), (!L || !F || R) && d({
      id: `row-node-${m.row}`,
      cx: x,
      cy: m.busY,
      r: Q(t * 0.2, 2.8, 4.8),
      color: Ge,
      opacity: 0.32
    });
    for (const b of P) {
      const C = L && F ? [
        { x: b.anchorX, y: b.anchorY },
        { x: b.anchorX, y: m.busY },
        { x: e.x, y: m.busY },
        e
      ] : L ? [
        { x: b.anchorX, y: b.anchorY },
        { x: b.anchorX, y: m.busY },
        { x, y: m.busY },
        { x, y: $.busY },
        { x: e.x, y: $.busY },
        e
      ] : [
        { x: b.anchorX, y: b.anchorY },
        { x: b.anchorX, y: m.busY },
        { x, y: m.busY },
        { x, y: e.y },
        e
      ], W = pr(
        C
      );
      if (p(
        `tap-rail-${b.id}`,
        [
          { x: b.anchorX, y: b.anchorY },
          { x: b.anchorX, y: m.busY }
        ],
        M
      ), d({
        id: `tap-node-${b.id}`,
        cx: b.anchorX,
        cy: m.busY,
        r: Q(t * 0.18, 2.6, 4.4),
        color: Ge,
        opacity: 0.3
      }), !b.producing || !W.d)
        continue;
      const pe = Math.max(cr, W.length), K = pe + cr;
      o.push({
        id: `flow-${b.id}`,
        panelId: b.id,
        d: W.d,
        color: b.accentColor,
        opacity: 0.62 + Math.min(b.intensity, 1) * 0.2,
        delayMs: 0,
        durationMs: Math.round(K * Ai),
        travelPx: pe,
        offsetPx: -K
      });
    }
  }
  return { flowPaths: o, topologyPaths: l, topologyNodes: a, collectorX: x, rowBuses: c };
}, Hi = (i, e, t, r, s, n, o) => {
  const l = i.map((c) => ({
    id: c.panel.id,
    row: c.row,
    anchorX: Di(c),
    anchorY: c.top + 1.5,
    left: c.left,
    right: c.right,
    top: c.top,
    bottom: c.bottom,
    accentColor: c.panel.accentColor,
    intensity: c.panel.intensity,
    producing: e.has(c.panel.id)
  })), a = Gi(
    l,
    t.entry,
    r,
    s,
    n,
    o
  );
  return {
    flowPaths: a.flowPaths,
    topologyPaths: a.topologyPaths,
    topologyNodes: a.topologyNodes
  };
}, zi = (i, e, t, r) => {
  const s = e.querySelector("ha-card");
  if (!s)
    return null;
  const n = s.getBoundingClientRect();
  if (n.width <= 0 || n.height <= 0)
    return null;
  const o = {
    x: s.scrollLeft,
    y: s.scrollTop
  }, l = e.querySelector('[data-kpi="power"]');
  if (!l)
    return null;
  const a = r.panels.map((m) => e.querySelector(`[data-panel-id="${m.id}"]`)).filter((m) => !!m).map((m) => {
    const P = m.getBoundingClientRect();
    return {
      left: P.left - n.left + o.x,
      right: P.right - n.left + o.x,
      top: P.top - n.top + o.y,
      bottom: P.bottom - n.top + o.y
    };
  }).filter((m) => Number.isFinite(m.left) && Number.isFinite(m.right)), c = a.length > 0 ? Math.min(...a.map((m) => m.left)) : 0, p = a.length > 0 ? Math.max(...a.map((m) => m.right)) : n.width, d = r.panels.filter(
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
    const P = m.element.getBoundingClientRect(), k = {
      x: P.left - n.left + o.x + P.width / 2,
      y: P.top - n.top + o.y + P.height / 2
    }, A = m.element.querySelector(".status")?.getBoundingClientRect(), O = A && A.width > 0 ? A.left - n.left + o.x + A.width * 0.33 : k.x;
    return {
      panel: m.panel,
      row: 0,
      center: k,
      statusCenterX: O,
      left: P.left - n.left + o.x,
      right: P.right - n.left + o.x,
      top: P.top - n.top + o.y,
      bottom: P.bottom - n.top + o.y
    };
  }), g = Oi(u), f = u.map((m, P) => ({
    ...m,
    row: g[P] ?? 0
  }));
  if (f.length === 0)
    return null;
  const v = f.reduce((m, P) => {
    const k = P.right - P.left, F = P.bottom - P.top;
    return m + Math.min(k, F);
  }, 0) / f.length, x = Q(Math.round(v * 0.2), 18, 34), S = l.getBoundingClientRect(), I = S.left - n.left + o.x + S.width / 2, M = Ni(
    n.width,
    c,
    p,
    I
  ), $ = Li(
    n,
    S,
    M,
    o
  ), { flowPaths: E, topologyPaths: L, topologyNodes: R } = Hi(
    f,
    h,
    $,
    x,
    n.width,
    c,
    M ? "direct-first-row" : "left-collector"
  );
  return {
    width: Math.max(
      s.clientWidth,
      n.width,
      p,
      $.entry.x
    ),
    height: Math.max(
      s.clientHeight,
      ...f.map((m) => m.bottom),
      $.entry.y
    ),
    flowPaths: E,
    topologyPaths: L,
    topologyNodes: R
  };
}, Bi = (i, e) => {
  if (!i || i.flowPaths.length === 0 && i.topologyPaths.length === 0)
    return w;
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
    (r) => U`<path
              class="spv-motion-backbone"
              d=${r.d}
              style=${`--spv-motion-color:${r.color}; --spv-motion-opacity:${r.opacity};`}
            ></path>`
  ) : w}

      ${e.showTopology ? i.topologyNodes.map(
    (r) => U`<circle
              class="spv-motion-node"
              cx=${r.cx}
              cy=${r.cy}
              r=${r.r}
              style=${`--spv-motion-color:${r.color}; --spv-motion-opacity:${r.opacity};`}
            ></circle>`
  ) : w}

      ${t.map(
    (r) => U`<path
          class="spv-motion-flow"
          d=${r.d}
          style=${`--spv-motion-color:${r.color}; --spv-motion-opacity:${r.opacity}; --spv-flow-duration:${r.durationMs}ms; --spv-flow-delay:${r.delayMs}ms; --spv-flow-travel:${r.travelPx}px; --spv-flow-offset:${r.offsetPx ?? -r.travelPx}px;`}
        ></path>`
  )}
    </svg>
  `;
}, Ui = Ot`
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
`, Wi = new Intl.Collator("en", {
  numeric: !0,
  sensitivity: "base"
}), q = (i, e) => {
  const t = Wi.compare(i, e);
  return t !== 0 ? t : i === e ? 0 : i < e ? -1 : 1;
}, ps = 1.2, Ki = /* @__PURE__ */ new Set(["unknown", "unavailable", "none", "null", ""]), ne = (i, e = 0, t = 1) => Math.min(Math.max(i, e), t), Se = (i) => {
  if (!i)
    return null;
  const e = i.state?.toString().trim().toLowerCase();
  if (Ki.has(e))
    return null;
  const t = Number(i.state);
  return Number.isFinite(t) ? t : null;
}, Vi = (i) => {
  if (i == null)
    return;
  const e = i.toString().replace(/[\u200B-\u200D\uFEFF]/g, "").replace(/\s+/g, " ").trim();
  return e.length > 0 ? e : void 0;
}, dr = (i) => i.toLowerCase().match(/[a-z0-9]+/g) ?? [], hr = (i, e) => {
  const t = dr(i);
  return t.length === 0 ? !1 : e.some((r) => {
    const s = dr(r);
    if (s.length === 0 || s.length > t.length)
      return !1;
    for (let n = 0; n <= t.length - s.length; n += 1) {
      let o = !0;
      for (let l = 0; l < s.length; l += 1)
        if (t[n + l] !== s[l]) {
          o = !1;
          break;
        }
      if (o)
        return !0;
    }
    return !1;
  });
}, $e = (i, e) => {
  const t = i?.attributes?.friendly_name;
  return typeof t == "string" && t.trim().length > 0 ? t : e;
}, ur = (i, e, t, r, s = "en") => {
  if (i === null)
    return r;
  const n = Object.is(i, -0) ? 0 : i, o = new Intl.NumberFormat(s, {
    minimumFractionDigits: t,
    maximumFractionDigits: t
  }).format(n);
  return e ? `${o} ${e}` : o;
}, _r = (i) => {
  const e = i.replace("#", ""), t = e.length === 3 ? e.split("").map((r) => `${r}${r}`).join("") : e;
  return [
    parseInt(t.slice(0, 2), 16),
    parseInt(t.slice(2, 4), 16),
    parseInt(t.slice(4, 6), 16)
  ];
}, mr = (i, e, t) => {
  const r = ne(t), [s, n, o] = _r(i), [l, a, c] = _r(e), p = (d, h) => Math.round(d + (h - d) * r);
  return `rgb(${p(s, l)}, ${p(n, a)}, ${p(o, c)})`;
}, ji = (i, e, t, r) => {
  const s = ne(r);
  return s <= 0.5 ? mr(i, e, s * 2) : mr(e, t, (s - 0.5) * 2);
}, Yi = (i) => {
  if (i.length === 0)
    return 0;
  const e = [...i].sort((n, o) => n - o), t = Math.floor(e.length * 0.4), r = e.slice(t), s = r.reduce((n, o) => n + o, 0) / Math.max(r.length, 1);
  return ne(s, 0, ps);
}, Ce = (i, e) => i === null ? null : i * e, qi = (i, e) => !i || e === 1 ? i : i.map((t) => ({
  ts: t.ts,
  value: t.value * e
})), Xi = (i, e) => {
  const t = i.rated_power_w ?? e.default_panel_rated_power_w ?? null;
  return t !== null && Number.isFinite(t) && t > 0 ? t : null;
}, gr = (i, e, t) => {
  if (!(i.enable_string_sensor_sharing ?? !1))
    return /* @__PURE__ */ new Map();
  const r = /* @__PURE__ */ new Map();
  i.panels.forEach((o, l) => {
    if (o.enabled === !1)
      return;
    const a = o[e]?.trim();
    if (!a)
      return;
    const c = r.get(a) ?? [];
    c.push({
      panel: o,
      slotIndex: l,
      ratedPower: Xi(o, i)
    }), r.set(a, c);
  });
  const s = [...r.entries()].filter(([, o]) => o.length > 1).sort(([, o], [, l]) => o[0].slotIndex - l[0].slotIndex), n = /* @__PURE__ */ new Map();
  return s.forEach(([o, l], a) => {
    const c = l.some(
      (u) => u.ratedPower === null || u.ratedPower <= 0
    ), p = l.reduce(
      (u, g) => u + (g.ratedPower ?? 0),
      0
    ), d = t ? `String ${a + 1}` : void 0, h = 1 / l.length;
    l.forEach((u) => {
      const g = c || p <= 0 ? h : (u.ratedPower ?? 0) / p;
      n.set(u.panel.id, {
        entityId: o,
        factor: g,
        groupLabel: d
      });
    });
  }), n;
}, Qi = (i) => ({
  powerByPanelId: gr(i, "power_entity", !0),
  energyByPanelId: gr(i, "energy_entity", !1)
}), Zi = (i, e, t) => {
  if (t <= 0)
    return i;
  const r = e - t * 60 * 1e3;
  return i.filter((s) => s.ts >= r);
}, Ji = (i) => {
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
}, en = (i, e, t, r) => {
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
  const n = Zi(s, t, r), o = Ji(s), l = r > 0 ? Math.max(2, Math.ceil(r / Math.max(o, 0.1)) + 1) : 1;
  let a = n.length > 0 ? n : s;
  return r > 0 && a.length < l && s.length > a.length && (a = s.slice(-l)), {
    value: a.reduce((p, d) => p + d.value, 0) / Math.max(a.length, 1),
    sampleCount: a.length,
    firstSampleTs: s[0].ts ?? null
  };
}, Ee = (i, e, t) => {
  const r = e?.locale?.language ?? "en", s = (_, N) => ht(r, _, N), n = s("common.unavailable"), o = t?.nowMs ?? Date.now(), l = { ...Nt, ...i.colors ?? {} }, a = i.enable_inverter_status ?? !1, c = (i.inverter_fault_terms ?? []).map((_) => _.trim().toLowerCase()).filter((_) => _.length > 0), p = (i.inverter_working_terms ?? []).map((_) => _.trim().toLowerCase()).filter((_) => _.length > 0), d = i.production_color_intensity ?? 1, h = t?.deviationEnabled ?? !0, u = i.deviation_min_active_panels ?? 3, g = i.deviation_min_samples ?? 3, f = i.deviation_min_runtime_minutes ?? 15, v = i.deviation_smoothing_minutes ?? 0, x = i.deviation_dynamic_floor_w ?? 20, S = i.deviation_threshold_percent ?? 15, I = i.deviation_absolute_w_threshold ?? 50, M = t?.historyByEntityId ?? {}, $ = Qi(i), E = i.panels.map((_, N) => {
    const be = _.enabled ?? !0, j = _.name ?? `Panel ${N + 1}`, X = $.powerByPanelId.get(_.id), wt = $.energyByPanelId.get(_.id), T = X?.factor ?? 1, oe = wt?.factor ?? 1, z = {
      powerShareFactor: T,
      energyShareFactor: oe,
      stringGroupLabel: X?.groupLabel,
      stringPowerSourceEntityId: X?.entityId,
      stringPowerSharePercent: X ? X.factor * 100 : void 0
    }, xe = _.inverter_status_entity ?? _.error_entity, rt = xe ? e?.states?.[xe] : void 0, D = xe ? Vi(rt?.state) ?? n : void 0, Z = $e(
      rt,
      xe
    ), J = D !== void 0 && D !== n && hr(D, c), ee = D !== void 0 && D !== n && hr(D, p);
    if (!be)
      return {
        config: _,
        slotIndex: N,
        label: j,
        power: null,
        energy: null,
        ...z,
        inverterStatusEntityName: Z,
        inverterStatusDisplay: D,
        inverterFaultMatched: J,
        inverterWorkingMatched: ee,
        reason: s("state.reason.slot_hidden"),
        status: "disabled",
        enabled: !1,
        hiddenSlot: !0
      };
    if (!_.power_entity)
      return {
        config: _,
        slotIndex: N,
        label: j,
        power: null,
        energy: null,
        ...z,
        inverterStatusEntityName: Z,
        inverterStatusDisplay: D,
        inverterFaultMatched: J,
        inverterWorkingMatched: ee,
        reason: s("state.reason.select_power_sensor"),
        status: "unconfigured",
        enabled: !0,
        hiddenSlot: !1
      };
    const te = e?.states?.[_.power_entity], Le = _.energy_entity ? e?.states?.[_.energy_entity] : void 0;
    if (!te)
      return {
        config: _,
        slotIndex: N,
        label: j,
        power: null,
        energy: null,
        ...z,
        inverterStatusEntityName: Z,
        inverterStatusDisplay: D,
        inverterFaultMatched: J,
        inverterWorkingMatched: ee,
        reason: s("state.reason.power_entity_missing", {
          entity: _.power_entity
        }),
        status: "offline",
        enabled: !0,
        hiddenSlot: !1
      };
    if (a && D && D !== n && J)
      return {
        config: _,
        slotIndex: N,
        label: j,
        power: Ce(Se(te), T),
        energy: Ce(Se(Le), oe),
        ...z,
        powerEntityName: $e(te, _.power_entity),
        inverterStatusEntityName: Z,
        inverterStatusDisplay: D,
        inverterFaultMatched: J,
        inverterWorkingMatched: ee,
        reason: s("state.reason.inverter_fault_match", {
          status: D
        }),
        status: "error",
        enabled: !0,
        hiddenSlot: !1
      };
    if (a && D && D !== n && p.length > 0 && !ee)
      return {
        config: _,
        slotIndex: N,
        label: j,
        power: Ce(Se(te), T),
        energy: Ce(Se(Le), oe),
        ...z,
        powerEntityName: $e(te, _.power_entity),
        inverterStatusEntityName: Z,
        inverterStatusDisplay: D,
        inverterFaultMatched: J,
        inverterWorkingMatched: ee,
        reason: s("state.reason.inverter_working_mismatch", {
          status: D
        }),
        status: "inverter",
        enabled: !0,
        hiddenSlot: !1
      };
    const st = Ce(Se(te), T), Pe = Ce(Se(Le), oe);
    return st === null ? {
      config: _,
      slotIndex: N,
      label: j,
      power: null,
      energy: Pe,
      ...z,
      powerEntityName: $e(te, _.power_entity),
      inverterStatusEntityName: Z,
      inverterStatusDisplay: D,
      inverterFaultMatched: J,
      inverterWorkingMatched: ee,
      reason: s("state.reason.power_entity_unavailable", {
        entity: _.power_entity
      }),
      status: "offline",
      enabled: !0,
      hiddenSlot: !1
    } : {
      config: _,
      slotIndex: N,
      label: j,
      power: st,
      energy: Pe,
      ...z,
      powerEntityName: $e(te, _.power_entity),
      inverterStatusEntityName: Z,
      inverterStatusDisplay: D,
      inverterFaultMatched: J,
      inverterWorkingMatched: ee,
      reason: s("state.reason.producing_expected"),
      status: "normal",
      enabled: !0,
      hiddenSlot: !1
    };
  }), R = E.filter(
    (_) => _.status === "normal" && _.power !== null
  ).map((_) => _.power ?? 0), m = R.length > 0 ? Math.max(...R) : 0;
  let P = 0, k = 0, F = 0, A = 0, O = 0, se = 0, b = 0, C, W = !1;
  const pe = E.filter((_) => _.status === "normal" && _.power !== null).flatMap((_) => {
    const N = _.config.rated_power_w ?? i.default_panel_rated_power_w ?? null;
    if (N === null || N <= 0 || !_.config.power_entity)
      return [];
    const be = Math.min(
      Math.max(_.config.deviation_derate_percent ?? 100, 1),
      100
    ), j = N * (be / 100);
    if (j <= 0)
      return [];
    const X = en(
      _.power,
      qi(
        M[_.config.power_entity],
        _.powerShareFactor
      ),
      o,
      v
    );
    return [
      {
        id: _.config.id,
        effectivePower: X.value,
        livePower: _.power,
        ratedPowerW: N,
        ratedForDeviationW: j,
        isDerated: be < 100,
        sampleCount: X.sampleCount,
        firstSampleTs: X.firstSampleTs
      }
    ];
  }), K = pe.filter((_) => !_.isDerated), ye = K.length > 0 ? Math.min(...K.map((_) => _.sampleCount)) : 0, ve = K.length > 0 ? Math.min(
    ...K.map(
      (_) => _.firstSampleTs === null ? 0 : (o - _.firstSampleTs) / 6e4
    )
  ) : 0;
  h ? K.length < u ? C = s("state.reason.need_non_derated_panels", {
    count: u
  }) : ye < g ? C = s("state.reason.collecting_samples", {
    current: ye,
    required: g
  }) : ve < f ? C = s("state.reason.warmup_progress", {
    current: Math.floor(ve),
    required: f
  }) : W = !0 : C = s("state.reason.array_check_disabled");
  const et = K.map(
    (_) => ne(_.effectivePower / _.ratedForDeviationW, 0, ps)
  ), Ne = Yi(et);
  W && Math.max(
    ...K.map(
      (N) => N.ratedForDeviationW * Ne
    ),
    0
  ) < x && (W = !1, C = s("state.reason.low_light_pause", {
    floor: x.toFixed(0)
  }));
  const we = E.map((_) => {
    const N = (_.config.power_entity ? e?.states?.[_.config.power_entity]?.attributes?.unit_of_measurement : void 0) ?? s("state.power.default_unit"), be = _.config.energy_entity ? e?.states?.[_.config.energy_entity]?.attributes?.unit_of_measurement : void 0, j = !!_.config.energy_entity, X = _.config.show_energy ?? !1, wt = _.stringPowerSourceEntityId ? $e(
      e?.states?.[_.stringPowerSourceEntityId],
      _.stringPowerSourceEntityId
    ) : void 0;
    let T = _.status, oe = null;
    const z = _.config.rated_power_w ?? i.default_panel_rated_power_w ?? null, xe = z !== null && _.power !== null && z > 0 ? ne(_.power / z * 100, 0, 999) : null;
    if (T === "normal" && z === null && (_.reason = s("state.reason.rated_not_configured")), W && T === "normal" && z !== null && _.power !== null) {
      const Pe = pe.find(
        (De) => De.id === _.config.id
      );
      if (Pe) {
        const De = Pe.ratedForDeviationW * Ne, bt = Math.max(De - Pe.effectivePower, 0), Ut = De > 0 ? bt / De * 100 : 0;
        Ut >= S && bt >= I ? (T = "deviation", oe = ne(Ut, 0, 100), _.reason = s("state.reason.output_below_target", {
          percent: oe.toFixed(0),
          shortfall: bt.toFixed(0)
        })) : _.reason = s("state.reason.producing_adjusted");
      }
    } else T === "normal" && C && (_.reason = C);
    T === "error" && (F += 1), T === "inverter" && (k += 1), T === "deviation" && (P += 1), T === "offline" && (A += 1), T === "normal" && (O += 1), T === "unconfigured" && (se += 1), T === "disabled" && (b += 1);
    const rt = z !== null && z > 0 && _.power !== null ? _.power / z : null, D = _.power !== null && m > 0 ? _.power / m : 0, Z = ne(rt ?? D, 0, 1), J = ne((d - 0.2) / 1.4, 0, 1), ee = ne(
      (0.1 + J * 0.9) * (0.15 + Z * 0.85),
      0.06,
      1
    ), te = T === "deviation" || T === "error" || T === "inverter" ? 1 : ee, Le = T === "normal" && _.power !== null && _.power <= 0, st = T === "error" || T === "inverter" ? l.error : Le || T === "offline" || T === "unconfigured" || T === "disabled" ? l.unavailable : T === "deviation" ? l.deviation : ji(
      l.production_start,
      l.production_mid,
      l.production_end,
      Z
    );
    return {
      id: _.config.id,
      slotIndex: _.slotIndex,
      label: _.label,
      status: T,
      power: _.power,
      powerDisplay: T === "disabled" ? s("state.status_display.disabled") : T === "unconfigured" ? s("state.status_display.not_configured") : ur(
        _.power,
        N,
        i.power_decimals ?? 0,
        n,
        r
      ),
      energy: _.energy,
      energyDisplay: _.hiddenSlot || !j || !X ? void 0 : _.energy !== null ? ur(
        _.energy,
        be ?? s("state.energy.default_unit"),
        i.energy_decimals ?? 2,
        n,
        r
      ) : n,
      powerEntityName: _.powerEntityName,
      inverterStatusEntityName: _.inverterStatusEntityName,
      inverterStatusDisplay: _.inverterStatusDisplay,
      inverterFaultMatched: _.inverterFaultMatched,
      inverterWorkingMatched: _.inverterWorkingMatched,
      deviationPercent: oe,
      reason: _.reason,
      accentColor: st,
      intensity: te,
      enabled: _.enabled,
      hiddenSlot: _.hiddenSlot,
      ratedPowerW: z,
      performancePercent: xe,
      powerShareFactor: _.powerShareFactor,
      energyShareFactor: _.energyShareFactor,
      stringGroupLabel: _.stringGroupLabel,
      stringPowerSourceName: wt,
      stringPowerSharePercent: _.stringPowerSharePercent
    };
  }), tt = we.reduce((_, N) => _ + (N.power ?? 0), 0), B = we.map((_) => _.energy).filter((_) => _ !== null), Ss = B.length > 0 ? B.reduce((_, N) => _ + N, 0) : null;
  return {
    panels: we,
    totalPower: tt,
    totalEnergy: Ss,
    maxPower: m,
    deviationCount: P,
    inverterCount: k,
    errorCount: F,
    offlineCount: A,
    normalCount: O,
    unconfiguredCount: se,
    disabledCount: b,
    deviationReady: W,
    deviationSuppressedReason: C
  };
}, fr = (i, e = 0) => Math.max(36, i - 36 - Math.max(0, e)), tn = ({
  candidates: i,
  panelWidthPx: e,
  panelHeightPx: t,
  fontPx: r,
  reservedRightPx: s = 0,
  measureTextWidthPx: n
}) => {
  const o = i.find((d) => d.variant === "compact");
  if (!o)
    throw new Error("Panel performance label requires a compact candidate.");
  if (t < 96 || e < 112)
    return o;
  const l = i.find((d) => d.variant === "full"), a = fr(e, s);
  if (l && n(l.text, r) <= a)
    return l;
  const c = fr(e), p = i.find((d) => d.variant === "medium");
  return p && n(p.text, r) <= c ? p : o;
}, Ht = (i) => Number.isFinite(i.ts) && Number.isFinite(i.value), rn = 1e-4, sn = (i) => i === 1 ? 6e4 : i === 6 ? 3 * 6e4 : i === 24 ? 10 * 6e4 : 5 * 6e4, lt = (i, e, t) => {
  const r = e - t * 60 * 60 * 1e3;
  return i.filter(Ht).filter((s) => s.ts >= r && s.ts <= e).sort((s, n) => s.ts - n.ts);
}, ds = (i, e) => {
  if (i.length < 2)
    return [...i].sort((p, d) => p.ts - d.ts);
  const t = e?.zeroTolerance ?? rn, r = [...i].filter(Ht).sort((p, d) => p.ts - d.ts);
  if (r.length < 2)
    return r;
  const s = r.slice(1).map((p, d) => p.ts - r[d].ts).filter((p) => Number.isFinite(p) && p > 0).sort((p, d) => p - d), n = s.length > 0 ? s[Math.floor(s.length / 2)] : Number.NaN, o = sn(e?.rangeHours), l = Math.min(
    Math.max(
      Number.isFinite(e?.stepMs) ? e?.stepMs : Number.isFinite(n) ? n : o,
      3e4
    ),
    o * 2
  ), a = l * 2, c = [r[0]];
  for (let p = 1; p < r.length; p += 1) {
    const d = r[p - 1], h = r[p], u = h.ts - d.ts, g = Math.abs(d.value) <= t, f = h.value > t;
    if (g && f && u >= a) {
      const v = Math.max(d.ts + 1, h.ts - l);
      v > d.ts && v < h.ts && c.push({ ts: v, value: 0 });
    }
    c.push(h);
  }
  return c.filter(
    (p, d, h) => d === 0 ? !0 : p.ts !== h[d - 1].ts || p.value !== h[d - 1].value
  );
}, Mt = (i, e) => {
  if (i.length <= e || e <= 2)
    return [...i];
  const t = i[0], r = i[i.length - 1], s = i.slice(1, i.length - 1), n = e - 2, o = s.length / n, l = [t];
  let a = -1;
  for (let c = 0; c < n; c += 1) {
    const p = Math.min(
      s.length - 1,
      Math.floor(c * o)
    );
    p !== a && (a = p, l.push(s[p]));
  }
  return l.push(r), l.sort((c, p) => c.ts - p.ts).filter(
    (c, p, d) => p === 0 ? !0 : c.ts !== d[p - 1].ts || c.value !== d[p - 1].value
  ).slice(0, e);
}, nn = (i) => {
  const e = i.map(
    (o) => [...o].filter(Ht).sort((l, a) => l.ts - a.ts).filter(
      (l, a, c) => a === c.length - 1 ? !0 : l.ts !== c[a + 1].ts
    )
  ).filter((o) => o.length > 0);
  if (e.length === 0)
    return [];
  const t = [
    ...new Set(e.flatMap((o) => o.map((l) => l.ts)))
  ].sort((o, l) => o - l), r = e.map(() => 0), s = e.map(() => null), n = [];
  for (const o of t) {
    let l = 0;
    for (let c = 0; c < e.length; c += 1) {
      const p = e[c];
      for (; r[c] < p.length && p[r[c]].ts <= o; )
        s[c] = p[r[c]].value, r[c] += 1;
      s[c] !== null && (l += 1);
    }
    if (l === 0)
      continue;
    const a = s.reduce(
      (c, p) => c + (p ?? 0),
      0
    );
    n.push({
      ts: o,
      value: Object.is(a, -0) ? 0 : a
    });
  }
  return n;
}, yr = (i) => Number.isFinite(i.ts) && Number.isFinite(i.value), on = (i) => i.map(
  (e, t) => `${t === 0 ? "M" : "L"}${e.x.toFixed(2)},${e.y.toFixed(2)}`
).join(" "), an = (i, e, t, r, s = 320, n = 132, o = 10) => {
  const l = t * 60 * 60 * 1e3, a = e - l, c = e, p = Math.max(c - a, 1), d = Math.max(s - o * 2, 1), h = Math.max(n - o * 2, 1), u = i.map(($) => {
    const E = lt($.samples, e, t).filter(yr), L = E.length === 1 ? [
      { ts: a, value: E[0].value },
      { ts: c, value: E[0].value }
    ] : E, R = ds(L, { rangeHours: t }), m = Mt(R, r).filter(yr), P = m.map((k) => k.value);
    return {
      id: $.id,
      samples: m,
      sampleCount: m.length,
      firstTs: m.length > 0 ? m[0].ts : null,
      lastTs: m.length > 0 ? m[m.length - 1].ts : null,
      minValue: P.length > 0 ? Math.min(...P) : null,
      maxValue: P.length > 0 ? Math.max(...P) : null
    };
  }), g = u.flatMap(($) => $.samples.map((E) => E.value)), f = g.length > 0;
  let v = 0, x = 1;
  f && (v = Math.min(...g), x = Math.max(...g), v === x && (v -= 1, x += 1));
  const S = Math.max(x - v, 1), I = u.map(($) => {
    const E = $.samples.map((R) => {
      const m = (R.ts - a) / p, P = o + Math.min(Math.max(m, 0), 1) * d, k = n - o - (R.value - v) / S * h;
      return !Number.isFinite(P) || !Number.isFinite(k) ? null : { x: P, y: k };
    }).filter((R) => R !== null), L = E.length >= 2 ? on(E) : "";
    return {
      id: $.id,
      samples: $.samples,
      points: E,
      linePath: L,
      firstPoint: E.length > 0 ? E[0] : null,
      lastPoint: E.length > 0 ? E[E.length - 1] : null,
      sampleCount: $.sampleCount,
      pointsCount: E.length,
      firstTs: $.firstTs,
      lastTs: $.lastTs,
      minValue: $.minValue,
      maxValue: $.maxValue
    };
  }), M = I.filter(($) => $.pointsCount > 0).length;
  return {
    startTs: a,
    endTs: c,
    hasData: f,
    drawableCount: M,
    series: I
  };
}, He = (i, e, t, r, s = "en") => {
  if (i === null)
    return r;
  const n = Object.is(i, -0) ? 0 : i;
  return `${new Intl.NumberFormat(s, {
    minimumFractionDigits: e,
    maximumFractionDigits: e
  }).format(n)} ${t}`;
}, re = (i) => Object.is(i, -0) ? 0 : i, ln = (i) => {
  if (!i)
    return;
  const e = i.replace(/[\u200B-\u200D\uFEFF]/g, "").replace(/\s+/g, " ").trim();
  return e.length > 0 ? e : void 0;
}, vr = 1, cn = "spv:history:", pn = "spv-card-config-updated", dn = 6e4, nt = [1, 6, 24], St = 150, hn = 45e3, un = 45e3, _n = 64, mn = /* @__PURE__ */ new Set(["unknown", "unavailable", "none", "null", ""]), wr = [
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
], $t = (i, e = "Unknown recorder error") => {
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
}, Ct = (i, e = 120) => i.length <= e ? i : `${i.slice(0, e - 1)}…`, _e = class _e extends Ie {
  constructor() {
    super(...arguments), this._cardWidth = 0, this._selectedPanelId = null, this._showLivePowerPopup = !1, this._showEnergyPopup = !1, this._showCustomKpiPopup = !1, this._showSystemHealthPopup = !1, this._dragSourceSlotIndex = null, this._historyByEntityId = {}, this._historyState = "idle", this._historySignature = "", this._historyQuerySignature = "", this._historyLastLoadMs = 0, this._historyLoadToken = 0, this._popupGraphRangeHours = 6, this._popupGraphCache = {}, this._popupGraphRequestToken = 0, this._popupGraphLatestTokenByKey = {}, this._telemetryGraphPanelId = null, this._telemetryGraphEntityId = null, this._telemetryGraphRangeHours = 6, this._kpiCompareExpanded = {
      power: !1,
      energy: !1
    }, this._kpiCompareRangeHours = {
      power: 6,
      energy: 6
    }, this._kpiCompareCache = {}, this._kpiCompareRequestToken = 0, this._kpiCompareLatestTokenByKey = {}, this._persistConfigToken = 0, this._popupScrollRestoreToken = 0, this._popupScrollRestore = null, this._motionEngine = new Fi(() => this.requestUpdate()), this._motionOverlayModel = null, this._motionOverlaySignature = "", this._overlayMeasureFrame = null, this._panelDetailOverflowFrame = null, this._activePulseColor = "rgba(111, 201, 255, 0.72)", this._onMotionAnimationEnd = (e) => {
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
        Be({
          ...this._config,
          enable_forecast_overlay: !0
        })
      ), this._showLivePowerPopup && e) {
        const r = this._getSystemPowerEntityId(), s = r ? this._popupGraphRangeHours : this._kpiCompareRangeHours.power;
        if (r)
          this._ensurePopupGraphLoadedByEntity(r, s);
        else {
          const n = this._derived ?? (this._config && this.hass ? Ee(this._config, this.hass) : null);
          n && this._ensurePanelCompareLoaded(n, "power", s);
        }
        this._ensurePopupGraphLoadedByEntity(e, s);
      }
      if (this._showEnergyPopup && t) {
        const r = this._getSystemEnergyEntityId(), s = r ? this._popupGraphRangeHours : this._kpiCompareRangeHours.energy;
        if (r)
          this._ensurePopupGraphLoadedByEntity(r, s);
        else {
          const n = this._derived ?? (this._config && this.hass ? Ee(this._config, this.hass) : null);
          n && this._ensurePanelCompareLoaded(n, "energy", s);
        }
        this._ensurePopupGraphLoadedByEntity(t, s);
      }
    }, this._handlePopupUserInteraction = (e) => {
      e.stopPropagation(), this._clearPopupScrollRestore();
    }, this._stopPopupEventPropagation = (e) => {
      e.stopPropagation();
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
        const t = this._derived ?? (this._config && this.hass ? Ee(this._config, this.hass) : null);
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
        const t = this._derived ?? (this._config && this.hass ? Ee(this._config, this.hass) : null);
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
    return await Promise.resolve().then(() => Un), document.createElement("solar-panel-visualizer-card-editor");
  }
  static getStubConfig() {
    return Os();
  }
  _normalizeCardConfig(e) {
    return Be(e);
  }
  _renderCardOverlay(e) {
    const t = this._getCurrentConfig(), r = this._motionEngine.getState();
    return Bi(this._motionOverlayModel, {
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
    return rs(this.hass, e, t);
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
    const s = zi(this, r, e, t), n = JSON.stringify(s);
    n !== this._motionOverlaySignature && (this._motionOverlayModel = s, this._motionOverlaySignature = n, this.requestUpdate());
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
    const t = Gs(e);
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
    ), s = this._computeRenderedRows(e, r), n = this._computePanelHeightPx(
      s,
      this._config?.max_card_height_px,
      r,
      this._config?.max_card_width_px
    ), o = 220 + s * n + Math.max(0, s - 1) * 10, l = this._config?.max_card_height_px ? Math.min(o, this._config.max_card_height_px) : o;
    return Math.max(5, Math.ceil(l / 50));
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
      const n = t.scrollHeight > t.clientHeight + 1;
      if (r.classList.toggle("has-detail-overflow", n), n) {
        this._syncPerformanceLabelFit(t);
        const o = this._getPanelDetailMaxScrollTop(t);
        t.scrollTop = Math.min(s, o);
      } else
        t.scrollTop = 0;
    });
  }
  _getPanelDetailMaxScrollTop(e) {
    const t = Math.max(0, e.scrollHeight - e.clientHeight), r = Array.from(e.children).filter(
      (n) => n instanceof HTMLElement && n.offsetParent !== null && n.offsetHeight > 0
    ), s = r[r.length - 1];
    return s ? Math.min(t, Math.max(0, s.offsetTop)) : t;
  }
  _syncPerformanceLabelFit(e) {
    const t = e.querySelector(".performance");
    if (!t)
      return;
    const r = t.dataset.performanceFull, s = t.dataset.performanceMedium, n = t.dataset.performanceCompact, o = [r, s, n].filter(
      (c) => !!c
    );
    if (o.length === 0)
      return;
    const l = t.textContent?.trim(), a = Math.max(
      0,
      o.findIndex((c) => c === l)
    );
    for (const c of o.slice(a))
      if (t.textContent = c, t.scrollWidth <= t.clientWidth + 1)
        return;
    t.textContent = o[o.length - 1];
  }
  render() {
    if (!this._config)
      return w;
    const e = this._derived ?? Ee(this._config, this.hass), t = this.hass?.locale?.language ?? "en", r = this._t("common.unavailable"), s = this._t("common.not_configured"), n = this._resolveDefaultTitle(this._config.title), o = this._resolveThemeMode(), l = this._resolveSummaryPower(e), a = this._resolveSummaryEnergy(e), c = this._resolveCustomKpi(), p = this._isSummaryEnergyConfigured(), d = this._config.show_custom_kpi ?? !0, h = this._computeRenderedColumns(
      this._config.columns,
      this._config.max_card_width_px
    ), u = this._computeRenderedRows(
      this._config.panels.length,
      h
    ), g = this._computePanelHeightPx(
      u,
      this._config.max_card_height_px,
      h,
      this._config.max_card_width_px
    ), f = this._computePanelWidthPx(
      h,
      this._config.max_card_width_px
    ), v = this._computePanelScale(g), x = this._getPanelWidthCapPx(), S = x !== null ? `grid-template-columns: repeat(${h}, minmax(0, ${x}px)); justify-content: center;` : `grid-template-columns: repeat(${h}, minmax(0, 1fr));`, I = this._config.deviation_history_hours ?? 12, M = `--spv-max-width:${this._config.max_card_width_px ?? 980}px; ${this._config.max_card_height_px ? `--spv-max-height:${this._config.max_card_height_px}px;` : "--spv-max-height:none;"} --spv-panel-height:${g}px; --spv-panel-scale:${v}; --spv-panel-max-width:${x ? `${x}px` : "100%"};`, $ = this._buildSystemHealthState(e), E = e.inverterCount + e.errorCount + e.offlineCount + e.deviationCount, L = this._motionOverlayModel ? `width:${this._motionOverlayModel.width}px; height:${this._motionOverlayModel.height}px;` : "", R = (this._config.enable_array_checks ?? !1) && this._historyState === "loading" ? this._t("card.subtitle.loading_history", { hours: I }) : e.deviationReady ? e.deviationCount > 0 ? this._t("card.subtitle.deviation_detected", {
      count: e.deviationCount,
      suffix: e.deviationCount === 1 ? "" : "s"
    }) : this._t("card.subtitle.tap_diagnostics") : this._historyStateReason ?? e.deviationSuppressedReason ?? this._t("card.subtitle.warmup"), m = e.panels.find(
      (P) => P.id === this._selectedPanelId
    );
    return y`
      <ha-card style=${M} data-spv-theme=${o}>
        <div class="chrome"></div>
        <div class="spv-overlay-anchor" style=${L}>
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
            <h1 class="title">${n}</h1>
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
                ${He(
      l.value,
      this._config.power_decimals ?? 0,
      l.unit,
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
                ${p ? He(
      a.value,
      this._config.energy_decimals ?? 2,
      a.unit,
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
                ` : w}
          </div>
        </div>

        <div
          class="grid"
          style=${S}
        >
          ${e.panels.map((P) => this._renderPanel(P, g, f))}
        </div>

        ${this._showLivePowerPopup ? this._renderLivePowerDialog(e) : w}
        ${this._showEnergyPopup ? this._renderEnergyDialog(e) : w}
        ${this._showCustomKpiPopup ? this._renderCustomKpiDialog() : w}
        ${this._showSystemHealthPopup ? this._renderSystemHealthDialog(e) : w}
        ${m ? this._renderPanelDialog(m) : w}
      </ha-card>
    `;
  }
  _refreshDerived() {
    if (!this._config) {
      this._derived = void 0;
      return;
    }
    this._derived = Ee(this._config, this.hass, {
      deviationEnabled: this._config.enable_array_checks ?? !1,
      historyByEntityId: this._historyByEntityId,
      nowMs: Date.now()
    });
  }
  _formatSlotLabel(e) {
    const t = this._config?.columns ?? 1, r = Math.floor(e / t) + 1, s = e % t + 1;
    return this._t("card.panel.slot_label", { row: r, column: s });
  }
  _formatPanelSlotLabel(e) {
    const t = this._formatSlotLabel(e.slotIndex);
    return e.stringGroupLabel ? `${e.stringGroupLabel} · ${t}` : t;
  }
  _renderPanel(e, t, r) {
    const s = this._shouldShowPerformance(e, t, r), n = this._getPanelExtraClass(e), o = ln(e.inverterStatusDisplay), l = this._formatInverterTileSummary(e, o), a = Math.max(0, Math.min(e.intensity, 1)), c = Math.round(24 + a * 62), p = Math.round(6 + a * 24), d = Math.round(4 + a * 18), h = [
      `--panel-accent:${e.accentColor}`,
      `--panel-intensity:${a.toFixed(3)}`,
      `--panel-border-accent:color-mix(in srgb, ${e.accentColor} ${c}%, var(--spv-panel-accent-mix-base))`,
      `--panel-fill-accent:color-mix(in srgb, ${e.accentColor} ${p}%, transparent)`,
      `--panel-glow-accent:color-mix(in srgb, ${e.accentColor} ${d}%, transparent)`
    ].join("; "), u = s ? this._buildPanelPerformanceLabelCandidates(e) : null;
    return e.hiddenSlot ? y`
        <button
          class="panel hidden-slot ${n}"
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
      ` : y`
      <button
        class="panel ${e.status} ${s ? "has-performance" : ""} ${n}"
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
              </p>` : w}
          ${e.energyDisplay ? y`<p class="energy">${e.energyDisplay}</p>` : w}
          ${(this._config?.show_inverter_status_on_tiles ?? !1) && l ? y`<p class="inverter-status">${l}</p>` : w}
        </div>
        <span class="slot ${e.stringGroupLabel ? "has-string-label" : ""}">
          ${this._formatPanelSlotLabel(e)}
        </span>
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
    })}</p>` : w}
              ${e.stringGroupLabel && e.stringPowerSourceName && e.stringPowerSharePercent !== void 0 ? y`<p class="info-line">${this._t("card.popup.info.string_share", {
      label: e.stringGroupLabel,
      percent: e.stringPowerSharePercent.toFixed(0),
      source: e.stringPowerSourceName
    })}</p>` : w}
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
      return w;
    const r = this._getPanelTelemetryMetrics(t), s = r.filter((a) => !!a.entityId), n = r.filter((a) => !a.entityId), o = s.length > 0, l = this._telemetryGraphPanelId === e.id ? this._telemetryGraphEntityId : null;
    return y`
      <section class="telemetry-section">
        <h3 class="telemetry-title">${this._t("card.popup.telemetry.title")}</h3>

        ${o ? y`
              <div class="telemetry-group">
                <h4 class="telemetry-title">${this._t("card.popup.telemetry.configured_title")}</h4>
                <div class="telemetry-grid">
                  ${s.map(
      (a) => this._renderTelemetryMetricCard(
        e.id,
        a,
        a.entityId === l
      )
    )}
                </div>
              </div>
            ` : w}

        ${n.length > 0 ? y`
              <div class="telemetry-group">
                <h4 class="telemetry-title">${this._t("card.popup.telemetry.unconfigured_title")}</h4>
                <p class="telemetry-empty">${this._t("card.popup.telemetry.setup_hint")}</p>
                <div class="telemetry-grid">
                  ${n.map(
      (a) => y`
                      <div class="detail-card telemetry-card">
                        <span class="detail-label">${a.label}</span>
                        <span class="detail-value">${this._t("common.not_configured")}</span>
                      </div>
                    `
    )}
                </div>
              </div>
            ` : o ? w : y`<p class="telemetry-empty">${this._t("card.popup.telemetry.setup_hint")}</p>`}
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
          @click=${(n) => this._toggleTelemetryGraph(n, e, s)}
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
        ${r ? this._renderTelemetryMetricGraph(t) : w}
      </div>
    ` : w;
  }
  _renderTelemetryMetricGraph(e) {
    const t = e.entityId;
    if (!t)
      return w;
    const r = this._telemetryGraphRangeHours, s = this._getPopupGraphCacheKey(t, r), n = this._popupGraphCache[s], o = n?.samples ?? [], l = this._adjustGraphSamplesForEntity(t, o), a = this._getUnitForEntity(t, "");
    return y`
      <div class="telemetry-card-graph">
        <div class="graph-header">
          <span class="graph-title">${e.label}</span>
          <div class="range-chips">
            ${nt.map(
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
      a,
      l,
      r,
      n?.loading ?? !1,
      n?.error,
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
    if (s.length === 0 || mn.has(s))
      return this._t("common.unavailable");
    const n = Number(t.state), o = typeof t.attributes?.unit_of_measurement == "string" ? t.attributes.unit_of_measurement.trim() : "";
    if (Number.isFinite(n)) {
      const l = this.hass?.locale?.language ?? "en", a = Object.is(n, -0) ? 0 : n, c = Number.isInteger(a) ? 0 : 2, p = new Intl.NumberFormat(l, {
        minimumFractionDigits: 0,
        maximumFractionDigits: c
      }).format(a);
      return o ? `${p} ${o}` : p;
    }
    return o ? `${r} ${o}` : r;
  }
  _renderKpiCompareControls(e, t) {
    const r = this._kpiCompareExpanded[t], s = t === "power" ? this._t("card.popup.panel_compare.toggle_power") : this._t("card.popup.panel_compare.toggle_energy");
    return y`
      <div class="compare-toggle-row">
        <button
          class="inline-button"
          type="button"
          @click=${(n) => this._togglePanelCompareGraph(n, t, e)}
        >
          ${s}
        </button>
      </div>
      ${r ? this._renderPanelCompareGraph(e, t) : w}
    `;
  }
  _togglePanelCompareGraph(e, t, r) {
    const s = this._captureScrollPositionsForPopupGraph(e), n = !this._kpiCompareExpanded[t];
    this._kpiCompareExpanded = {
      ...this._kpiCompareExpanded,
      [t]: n
    }, this._scheduleCapturedScrollRestore(s), n && this._ensurePanelCompareLoaded(
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
    const n = this._getPanelCompareSignature(t, r), o = this._getPanelCompareCacheKey(t, n, s), l = this._kpiCompareCache[o], a = l?.loading ?? !1, c = l?.error, p = r.map((b, C) => ({
      ...b,
      color: wr[C % wr.length],
      samples: this._scaleGraphSamples(
        this._adjustGraphSamplesForEntity(
          b.entityId,
          l?.samplesByPanelId[b.panelId] ?? []
        ),
        b.scale
      )
    })), d = an(
      p.map((b) => ({
        id: b.panelId,
        samples: b.samples
      })),
      Date.now(),
      s,
      St,
      320,
      132,
      10
    ), h = new Map(d.series.map((b) => [b.id, b])), u = d.series.some(
      (b) => b.sampleCount > 0 && (b.pointsCount === 0 || b.sampleCount > 1 && b.pointsCount < 2)
    ), g = d.hasData && d.drawableCount === 0, f = g || u, v = t === "energy" ? "kWh" : "W", x = d.series.flatMap(
      (b) => b.samples.map((C) => C.value).filter((C) => Number.isFinite(C))
    ), S = x.length > 0 ? this._computeGraphStats(
      x.map((b, C) => ({
        ts: C,
        value: b
      }))
    ) : { min: null, max: null, median: null }, I = x.length > 0 ? Math.min(...x) : null, M = x.length > 0 ? Math.max(...x) : null, $ = I === null || M === null ? null : I === M ? I - 1 : I, E = I === null || M === null ? null : I === M ? M + 1 : M, L = S.max !== null && $ !== null && E !== null ? this._toGraphY(S.max, $, E, 132, 10) : null, R = S.median !== null && $ !== null && E !== null ? this._toGraphY(S.median, $, E, 132, 10) : null, m = S.min !== null && $ !== null && E !== null ? this._toGraphY(S.min, $, E, 132, 10) : null, P = S.max !== null ? this._t("card.popup.history.max", {
      value: this._formatGraphPower(S.max, v)
    }) : null, k = S.median !== null ? this._t("card.popup.history.median", {
      value: this._formatGraphPower(S.median, v)
    }) : null, F = S.min !== null ? this._t("card.popup.history.min", {
      value: this._formatGraphPower(S.min, v)
    }) : null, A = this._buildGraphHourTicks(
      {
        startTs: d.startTs,
        endTs: d.endTs
      },
      s
    ), O = this._buildGraphAxisTicks(A), se = t === "energy" ? this._t("card.popup.history.panel_compare_energy") : this._t("card.popup.history.panel_compare_power");
    return y`
      <div class="graph-section">
        <div class="graph-header">
          <span class="graph-title">${se}</span>
          <div class="range-chips">
            ${nt.map(
      (b) => y`
                <button
                  class="range-chip ${this._kpiCompareRangeHours[t] === b ? "active" : ""}"
                  type="button"
                  @pointerdown=${this._preventRangeChipFocusScroll}
                  @mousedown=${this._preventRangeChipFocusScroll}
                  @click=${(C) => this._handlePanelCompareRangeChange(C, e, t, b)}
                >
                  ${b}h
                </button>
              `
    )}
          </div>
        </div>

        ${a ? y`<p class="graph-state">${this._t("card.popup.panel_compare.loading")}</p>` : c ? y`<p class="graph-state">${c}</p>` : d.hasData ? g ? y`<p class="graph-state">${this._t("card.popup.panel_compare.render_failure")}</p>` : y`
                  <div class="graph-box">
                    ${P ? y`<span class="graph-overlay graph-overlay-max">${P}</span>` : w}
                    ${k ? y`
                          <span class="graph-overlay graph-overlay-median">
                            ${k}
                          </span>
                        ` : w}
                    ${F ? y`<span class="graph-overlay graph-overlay-min">${F}</span>` : w}
                    <svg class="graph-svg" viewBox="0 0 320 132" preserveAspectRatio="none">
                      ${A.map(
      (b) => U`
                          <line
                            class="graph-hour-line"
                            x1=${b.x.toFixed(2)}
                            x2=${b.x.toFixed(2)}
                            y1="10"
                            y2="122"
                          ></line>
                        `
    )}
                      ${p.map((b) => {
      const C = h.get(b.panelId);
      return !C || C.pointsCount === 0 ? w : C.pointsCount >= 2 ? U`
                            <path
                              d=${C.linePath}
                              fill="none"
                              stroke=${b.color}
                              stroke-width="1.08"
                              stroke-linejoin="round"
                              stroke-linecap="round"
                              opacity="0.88"
                            ></path>
                            ${C.firstPoint && C.lastPoint ? U`
                                  <circle
                                    cx=${C.firstPoint.x.toFixed(2)}
                                    cy=${C.firstPoint.y.toFixed(2)}
                                    r="1.7"
                                    fill=${b.color}
                                    opacity="0.95"
                                  ></circle>
                                  <circle
                                    cx=${C.lastPoint.x.toFixed(2)}
                                    cy=${C.lastPoint.y.toFixed(2)}
                                    r="1.7"
                                    fill=${b.color}
                                    opacity="0.95"
                                  ></circle>
                                ` : w}
                          ` : C.firstPoint ? U`
                          <circle
                            cx=${C.firstPoint.x.toFixed(2)}
                            cy=${C.firstPoint.y.toFixed(2)}
                            r="2.4"
                            fill=${b.color}
                            opacity="0.95"
                          ></circle>
                        ` : w;
    })}
                      ${L !== null ? U`
                            <line
                              class="graph-stat-line graph-stat-max"
                              x1="10"
                              x2="310"
                              y1=${L.toFixed(2)}
                              y2=${L.toFixed(2)}
                            ></line>
                          ` : w}
                      ${R !== null ? U`
                            <line
                              class="graph-stat-line graph-stat-median"
                              x1="10"
                              x2="310"
                              y1=${R.toFixed(2)}
                              y2=${R.toFixed(2)}
                            ></line>
                          ` : w}
                      ${m !== null ? U`
                            <line
                              class="graph-stat-line graph-stat-min"
                              x1="10"
                              x2="310"
                              y1=${m.toFixed(2)}
                              y2=${m.toFixed(2)}
                            ></line>
                          ` : w}
                    </svg>
                  </div>
                  <div class="graph-axis">
                    ${O.map(
      (b) => y`
                        <span class="graph-axis-label" style=${`left:${b.leftPercent.toFixed(2)}%;`}>
                          ${b.label}
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

        ${f ? y`
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
                  ${g ? this._t("card.popup.panel_compare.diagnostics_reason_render_failure") : this._t("card.popup.panel_compare.diagnostics_reason_suspect")}
                </span>
                ${p.map((b) => {
      const C = h.get(b.panelId), W = this._getUnitForEntity(b.entityId, v);
      return y`
                    <span class="compare-diagnostics-row">
                      ${this._t("card.popup.panel_compare.diagnostics_row", {
        label: b.label,
        samples: C?.sampleCount ?? 0,
        points: C?.pointsCount ?? 0,
        pathLen: C?.linePath.length ?? 0,
        first: this._formatGraphDiagnosticTime(C?.firstTs ?? null),
        last: this._formatGraphDiagnosticTime(C?.lastTs ?? null),
        min: C?.minValue === null || C?.minValue === void 0 ? "--" : this._formatGraphPower(C.minValue, W),
        max: C?.maxValue === null || C?.maxValue === void 0 ? "--" : this._formatGraphPower(C.maxValue, W)
      })}
                    </span>
                  `;
    })}
              </div>
            ` : w}

        <div class="compare-legend">
          ${p.map(
      (b) => y`
              <div class="compare-legend-item">
                <span
                  class="compare-legend-chip"
                  style=${`background:${b.color};`}
                ></span>
                <span class="compare-legend-label">${b.label}</span>
              </div>
            `
    )}
        </div>
      </div>
    `;
  }
  _renderAggregatedPanelGraph(e, t, r = {}) {
    const s = this._buildPanelCompareTargets(e, t), n = this._kpiCompareRangeHours[t];
    if (s.length === 0)
      return y`
        <p class="graph-state">
          ${t === "energy" ? this._t("card.popup.panel_compare.no_panels_energy") : this._t("card.popup.panel_compare.no_panels_power")}
        </p>
      `;
    const o = this._getPanelCompareSignature(t, s), l = this._getPanelCompareCacheKey(t, o, n), a = this._kpiCompareCache[l], c = a?.loading ?? !1, p = a?.error, d = nn(
      s.map(
        (g) => this._scaleGraphSamples(
          this._adjustGraphSamplesForEntity(
            g.entityId,
            a?.samplesByPanelId[g.panelId] ?? []
          ),
          g.scale
        )
      )
    ), h = t === "energy" ? this._resolveUnit("energy_entity", "kWh") : this._resolveUnit("power_entity", "W"), u = t === "energy" ? this._t("card.popup.history.total_panel_energy") : this._t("card.popup.history.total_panel_power");
    return y`
      <div class="graph-section">
        <div class="graph-header">
          <span class="graph-title">${u}</span>
          <div class="range-chips">
            ${nt.map(
      (g) => y`
                <button
                  class="range-chip ${this._kpiCompareRangeHours[t] === g ? "active" : ""}"
                  type="button"
                  @pointerdown=${this._preventRangeChipFocusScroll}
                  @mousedown=${this._preventRangeChipFocusScroll}
                  @click=${(f) => this._handleAggregatedPanelRangeChange(
        f,
        e,
        t,
        g,
        r.overlayEntityId ?? void 0
      )}
                >
                  ${g}h
                </button>
              `
    )}
          </div>
        </div>
        ${this._renderPopupGraphBodyFromSamples(
      `panel-total-${t}|${o}|${n}`,
      h,
      d,
      n,
      c,
      p,
      r
    )}
        ${r.overlayStateMessage ? y`<p class="graph-forecast-state">${r.overlayStateMessage}</p>` : w}
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
            ` : w}
      </div>
    `;
  }
  _handleAggregatedPanelRangeChange(e, t, r, s, n) {
    e.preventDefault(), e.stopPropagation();
    const o = this._captureScrollPositionsForPopupGraph(e);
    this._kpiCompareRangeHours = {
      ...this._kpiCompareRangeHours,
      [r]: s
    }, this._scheduleCapturedScrollRestore(o), this._ensurePanelCompareLoaded(t, r, s, o), n && this._ensurePopupGraphLoadedByEntity(n, s, o);
  }
  _handlePanelCompareRangeChange(e, t, r, s) {
    e.preventDefault(), e.stopPropagation();
    const n = this._captureScrollPositionsForPopupGraph(e);
    if (this._kpiCompareRangeHours = {
      ...this._kpiCompareRangeHours,
      [r]: s
    }, this._scheduleCapturedScrollRestore(n), this._kpiCompareExpanded[r] && this._ensurePanelCompareLoaded(t, r, s, n), !this._getSystemEntityIdForKind(r) && this._isForecastOverlayEnabled()) {
      const o = this._getForecastEntityId(r);
      o && this._ensurePopupGraphLoadedByEntity(o, s, n);
    }
  }
  _buildPanelCompareTargets(e, t) {
    const r = new Map(
      (this._config?.panels ?? []).map((s) => [s.id, s])
    );
    return e.panels.filter((s) => !s.hiddenSlot && s.enabled).map((s) => {
      const n = r.get(s.id), o = t === "energy" ? n?.energy_entity?.trim() : n?.power_entity?.trim();
      return o ? {
        panelId: s.id,
        label: s.label,
        entityId: o,
        scale: t === "energy" ? s.energyShareFactor ?? 1 : s.powerShareFactor ?? 1
      } : null;
    }).filter((s) => !!s);
  }
  _getPanelCompareSignature(e, t) {
    return `${e}|${t.map((r) => `${r.panelId}:${r.entityId}:${r.scale}`).join("|")}`;
  }
  _getPanelCompareCacheKey(e, t, r) {
    return `${e}|${t}|${r}`;
  }
  async _ensurePanelCompareLoaded(e, t, r, s) {
    if (!this._config || !this.hass)
      return;
    const n = this._buildPanelCompareTargets(e, t);
    if (n.length === 0)
      return;
    const o = this._getPanelCompareSignature(t, n), l = this._getPanelCompareCacheKey(t, o, r), a = this._kpiCompareCache[l], c = Date.now();
    if (a?.loading || a && !a.error && a.loadedAt && c - a.loadedAt < un)
      return;
    const p = ++this._kpiCompareRequestToken;
    if (this._kpiCompareLatestTokenByKey[l] = p, this._kpiCompareCache = {
      ...this._kpiCompareCache,
      [l]: {
        loading: !0,
        samplesByPanelId: a?.samplesByPanelId ?? {},
        loadedAt: a?.loadedAt
      }
    }, this._scheduleCapturedScrollRestore(s), !this.hass.callApi && !this.hass.callWS) {
      if (this._kpiCompareLatestTokenByKey[l] !== p)
        return;
      this._kpiCompareCache = {
        ...this._kpiCompareCache,
        [l]: {
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
      const d = [...new Set(n.map((S) => S.entityId))], h = {};
      let u = null;
      const g = await Promise.allSettled(
        d.map(async (S) => ({
          entityId: S,
          samples: await this._loadPopupGraphRecorderSamples(S, r)
        }))
      );
      for (const S of g) {
        if (S.status === "fulfilled") {
          h[S.value.entityId] = S.value.samples;
          continue;
        }
        u || (u = Ct(
          $t(S.reason, this._t("common.unknown_recorder_error"))
        ));
      }
      if (this._kpiCompareLatestTokenByKey[l] !== p)
        return;
      const f = Object.values(h).some(
        (S) => S.length > 0
      );
      if (Object.keys(h).length === 0 && u) {
        this._kpiCompareCache = {
          ...this._kpiCompareCache,
          [l]: {
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
      const x = {};
      for (const S of n)
        x[S.panelId] = h[S.entityId] ?? [];
      this._kpiCompareCache = {
        ...this._kpiCompareCache,
        [l]: {
          loading: !1,
          samplesByPanelId: x,
          error: !f && u ? this._t("card.popup.panel_compare.unable_load", {
            error: u
          }) : void 0,
          loadedAt: Date.now()
        }
      }, this._scheduleCapturedScrollRestore(s);
    } catch (d) {
      if (this._kpiCompareLatestTokenByKey[l] !== p)
        return;
      this._kpiCompareCache = {
        ...this._kpiCompareCache,
        [l]: {
          loading: !1,
          samplesByPanelId: {},
          error: this._t("card.popup.panel_compare.unable_load", {
            error: Ct($t(d, this._t("common.unknown_recorder_error")))
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
    ), n = this._isForecastOverlayEnabled() && !!s.entityId, o = s.entityId ? this._isForecastOverlayEnabled() ? null : this._t("card.popup.forecast.disabled_hint") : this._t("card.popup.forecast.default_sensor_not_found", {
      entity: s.expectedEntityId
    }), l = !this._isForecastOverlayEnabled() && !!s.entityId, a = this.hass?.locale?.language ?? "en";
    return y`
      <div class="spv-popup-backdrop" @click=${this._closeLivePowerPopup}>
        <div
          class="spv-popup"
          @pointerdown=${this._handlePopupUserInteraction}
          @wheel=${this._handlePopupUserInteraction}
          @click=${this._stopPopupEventPropagation}
        >
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
        overlayEntityId: n ? s.entityId : null,
        overlayStateMessage: o,
        showEnableForecastButton: l
      }
    ) : this._renderAggregatedPanelGraph(e, "power", {
      overlayEntityId: n ? s.entityId : null,
      overlayStateMessage: o,
      showEnableForecastButton: l
    })}

          <div class="detail-grid">
            <div class="detail-card">
              <span class="detail-label">${this._t("card.popup.detail.current")}</span>
              <span class="detail-value">
                ${He(
      r.value,
      this._config?.power_decimals ?? 0,
      r.unit,
      this._t("common.unavailable"),
      a
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
    ), n = this._isForecastOverlayEnabled() && !!s.entityId, o = s.entityId ? this._isForecastOverlayEnabled() ? null : this._t("card.popup.forecast.disabled_hint") : this._t("card.popup.forecast.default_sensor_not_found", {
      entity: s.expectedEntityId
    }), l = !this._isForecastOverlayEnabled() && !!s.entityId, a = this.hass?.locale?.language ?? "en";
    return y`
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

          ${t ? this._renderPopupGraphForEntity(
      t,
      this._t("card.popup.history.system_energy"),
      {
        overlayEntityId: n ? s.entityId : null,
        overlayStateMessage: o,
        showEnableForecastButton: l
      }
    ) : this._renderAggregatedPanelGraph(e, "energy", {
      overlayEntityId: n ? s.entityId : null,
      overlayStateMessage: o,
      showEnableForecastButton: l
    })}

          <div class="detail-grid">
            <div class="detail-card">
              <span class="detail-label">${this._t("card.popup.detail.current")}</span>
              <span class="detail-value">
                ${He(
      r.value,
      this._config?.energy_decimals ?? 2,
      r.unit,
      this._t("common.unavailable"),
      a
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
        <div
          class="spv-popup"
          @pointerdown=${this._handlePopupUserInteraction}
          @wheel=${this._handlePopupUserInteraction}
          @click=${this._stopPopupEventPropagation}
        >
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
        <div
          class="spv-popup"
          @pointerdown=${this._handlePopupUserInteraction}
          @wheel=${this._handlePopupUserInteraction}
          @click=${this._stopPopupEventPropagation}
        >
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
        (n) => y`<p class="system-health-item">${n}</p>`
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
      this._t("card.popup.history.power"),
      {
        primaryValueScale: e.powerShareFactor ?? 1
      }
    );
  }
  _renderPopupGraphForEntity(e, t, r = {}) {
    return y`
      <div class="graph-section">
        <div class="graph-header">
          <span class="graph-title">${t}</span>
          <div class="range-chips">
            ${nt.map(
      (s) => y`
                <button
                  class="range-chip ${this._popupGraphRangeHours === s ? "active" : ""}"
                  type="button"
                  @pointerdown=${this._preventRangeChipFocusScroll}
                  @mousedown=${this._preventRangeChipFocusScroll}
                  @click=${(n) => this._handlePopupGraphRangeChangeForEntity(
        n,
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
        ${r.overlayStateMessage ? y`<p class="graph-forecast-state">${r.overlayStateMessage}</p>` : w}
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
            ` : w}
      </div>
    `;
  }
  _renderPopupGraphBody(e, t = {}) {
    const r = this._getPopupGraphCacheKey(e, this._popupGraphRangeHours), s = this._popupGraphCache[r], n = s?.loading ?? !1, o = s?.error, l = s?.samples ?? [], a = this._adjustGraphSamplesForEntity(e, l), c = t.invertPrimaryValues ? a.map((h) => ({
      ts: h.ts,
      value: re(h.value * -1)
    })) : a, p = this._scaleGraphSamples(
      c,
      t.primaryValueScale ?? 1
    ), d = this._getUnitForEntity(e, "W");
    return this._renderPopupGraphBodyFromSamples(
      r,
      d,
      p,
      this._popupGraphRangeHours,
      n,
      o,
      t
    );
  }
  _renderPopupGraphBodyFromSamples(e, t, r, s, n, o, l = {}) {
    const a = this._fillRangeStartWithFirstSample(
      r,
      s,
      l.fillStartWithFirstSample ?? !1
    ), c = ds(a, {
      rangeHours: s
    }), p = this._expandSinglePointRangeSamples(
      c,
      s
    ), d = l.overlayEntityId ?? null, h = d ? this._popupGraphCache[this._getPopupGraphCacheKey(d, s)] : void 0, u = h?.samples ?? [], g = d ? this._expandSinglePointRangeSamples(
      this._adjustGraphSamplesForEntity(d, u),
      s
    ) : [], f = d ? h?.loading ?? !1 : !1, v = d ? h?.error : void 0;
    if (n)
      return y`<p class="graph-state">${this._t("card.popup.history.loading")}</p>`;
    if (o)
      return y`<p class="graph-state">${o}</p>`;
    if (p.length === 0)
      return y`<p class="graph-state">${this._t("card.popup.history.no_data")}</p>`;
    const x = Mt(p, St), S = this._computeGraphStats(p), I = Date.now(), M = I - s * 60 * 60 * 1e3, $ = I, E = d && !f && !v && g.length > 0 ? Mt(g, St) : [], L = p.map((B) => B.value).filter((B) => Number.isFinite(B)), R = E.map((B) => B.value).filter((B) => Number.isFinite(B)), m = [...L, ...R], P = m.length > 0 ? Math.min(...m) : null, k = m.length > 0 ? Math.max(...m) : null, F = P === null || k === null ? null : P === k ? P - 1 : P, A = P === null || k === null ? null : P === k ? k + 1 : k, O = F !== null && A !== null ? {
      startTs: M,
      endTs: $,
      minValue: F,
      maxValue: A
    } : null, se = O !== null ? this._buildAlignedGraphLinePath(x, O, 320, 132, 10) : "", b = O !== null ? this._buildAlignedGraphAreaPath(x, O, 320, 132, 10) : "", C = O !== null && E.length > 0 ? this._buildAlignedGraphLinePath(E, O, 320, 132, 10) : "", W = this._buildGraphHourTicks(
      {
        startTs: M,
        endTs: $
      },
      s
    ), pe = this._buildGraphAxisTicks(W), K = S.max !== null && F !== null && A !== null ? this._toGraphY(S.max, F, A, 132, 10) : null, ye = S.median !== null && F !== null && A !== null ? this._toGraphY(S.median, F, A, 132, 10) : null, ve = S.min !== null && F !== null && A !== null ? this._toGraphY(S.min, F, A, 132, 10) : null, et = `spv-graph-${e.replace(/[^a-zA-Z0-9_-]/g, "-")}`, Ne = S.max !== null ? this._t("card.popup.history.max", {
      value: this._formatGraphPower(S.max, t)
    }) : null, we = S.median !== null ? this._t("card.popup.history.median", {
      value: this._formatGraphPower(S.median, t)
    }) : null, tt = S.min !== null ? this._t("card.popup.history.min", {
      value: this._formatGraphPower(S.min, t)
    }) : null;
    return y`
      <div class="graph-box">
        ${Ne ? y`<span class="graph-overlay graph-overlay-max">${Ne}</span>` : w}
        ${we ? y`
              <span class="graph-overlay graph-overlay-median">
                ${we}
              </span>
            ` : w}
        ${tt ? y`<span class="graph-overlay graph-overlay-min">${tt}</span>` : w}
        <svg class="graph-svg" viewBox="0 0 320 132" preserveAspectRatio="none">
          <defs>
            <linearGradient id=${et} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="rgba(142, 208, 114, 0.48)"></stop>
              <stop offset="100%" stop-color="rgba(142, 208, 114, 0.04)"></stop>
            </linearGradient>
          </defs>
          <path
            d=${b}
            fill=${`url(#${et})`}
          ></path>
          ${W.map(
      (B) => U`
              <line
                class="graph-hour-line"
                x1=${B.x.toFixed(2)}
                x2=${B.x.toFixed(2)}
                y1="10"
                y2="122"
              ></line>
            `
    )}
          ${U`
            <path
            d=${se}
            fill="none"
            stroke="rgba(186, 226, 106, 0.95)"
            stroke-width="2.2"
            stroke-linejoin="round"
            stroke-linecap="round"
            ></path>
          `}
          ${C.length > 0 ? U`
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
              ` : w}
          ${K !== null ? U`
                <line
                  class="graph-stat-line graph-stat-max"
                  x1="10"
                  x2="310"
                  y1=${K.toFixed(2)}
                  y2=${K.toFixed(2)}
                ></line>
              ` : w}
          ${ye !== null ? U`
                <line
                  class="graph-stat-line graph-stat-median"
                  x1="10"
                  x2="310"
                  y1=${ye.toFixed(2)}
                  y2=${ye.toFixed(2)}
                ></line>
              ` : w}
          ${ve !== null ? U`
                <line
                  class="graph-stat-line graph-stat-min"
                  x1="10"
                  x2="310"
                  y1=${ve.toFixed(2)}
                  y2=${ve.toFixed(2)}
                ></line>
              ` : w}
        </svg>
      </div>
      <div class="graph-axis">
        ${pe.map(
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
      start: this._formatGraphTime(M),
      end: this._formatGraphTime($)
    })}
        </span>
      </div>
      ${d && f ? y`<p class="graph-forecast-state">${this._t("card.popup.history.loading")}</p>` : w}
      ${d && !f && v ? y`<p class="graph-forecast-state">${v}</p>` : w}
      ${d && !f && !v && g.length === 0 ? y`<p class="graph-forecast-state">${this._t("card.popup.history.no_data")}</p>` : w}
    `;
  }
  _handlePopupGraphRangeChangeForEntity(e, t, r, s) {
    e.preventDefault(), e.stopPropagation();
    const n = this._captureScrollPositionsForPopupGraph(e);
    this._popupGraphRangeHours = r, this._scheduleCapturedScrollRestore(n), t && this._ensurePopupGraphLoadedByEntity(t, r, n), s && this._ensurePopupGraphLoadedByEntity(s, r, n);
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
    const n = this._getPanelConfig(e)?.power_entity;
    n && await this._ensurePopupGraphLoadedByEntity(n, t, r);
  }
  async _ensurePopupGraphLoadedByEntity(e, t, r) {
    if (!this._config || !this.hass)
      return;
    const s = this._getPopupGraphCacheKey(e, t), n = this._popupGraphCache[s], o = Date.now();
    if (n?.loading || n && !n.error && n.loadedAt && o - n.loadedAt < hn)
      return;
    const l = ++this._popupGraphRequestToken;
    if (this._popupGraphLatestTokenByKey[s] = l, this._popupGraphCache = {
      ...this._popupGraphCache,
      [s]: {
        loading: !0,
        samples: n?.samples ?? [],
        loadedAt: n?.loadedAt
      }
    }, this._scheduleCapturedScrollRestore(r), !this.hass.callApi && !this.hass.callWS) {
      if (this._popupGraphLatestTokenByKey[s] !== l)
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
      if (this._popupGraphLatestTokenByKey[s] !== l)
        return;
      const a = await this._loadPopupGraphRecorderSamples(e, t);
      if (this._popupGraphLatestTokenByKey[s] !== l)
        return;
      this._popupGraphCache = {
        ...this._popupGraphCache,
        [s]: {
          loading: !1,
          samples: a,
          loadedAt: Date.now()
        }
      }, this._scheduleCapturedScrollRestore(r);
    } catch (a) {
      if (this._popupGraphLatestTokenByKey[s] !== l)
        return;
      this._popupGraphCache = {
        ...this._popupGraphCache,
        [s]: {
          loading: !1,
          samples: [],
          error: `Unable to load panel history (${Ct($t(a))})`,
          loadedAt: Date.now()
        }
      }, this._scheduleCapturedScrollRestore(r);
    }
  }
  async _loadPopupGraphRecorderSamples(e, t) {
    if (!this.hass || !this.hass.callApi && !this.hass.callWS)
      throw new Error("Recorder API unavailable");
    const r = Date.now(), s = Math.min(168, t + 6), n = new Date(r - s * 60 * 60 * 1e3).toISOString(), o = new Date(r).toISOString(), l = this._getSharedHistorySamplesForRange(e, t);
    if (l) {
      const d = lt(l, r, t), h = this._stabilizePopupRangeSamples(
        e,
        l,
        d,
        r,
        t
      );
      if (this._hasPopupRangeCoverage(h, r, t))
        return h;
      try {
        const u = await this._fetchRecorderHistoryRaw(n, o, [e]), g = this._parseRecorderResponse(u, s, [e])[e] ?? [], f = this._mergeGraphSampleSets(l, g), v = lt(f, r, t);
        return this._stabilizePopupRangeSamples(e, f, v, r, t);
      } catch {
        return h;
      }
    }
    const a = await this._fetchRecorderHistoryRaw(n, o, [e]), c = this._parseRecorderResponse(a, s, [e])[e] ?? [], p = lt(c, r, t);
    return this._stabilizePopupRangeSamples(e, c, p, r, t);
  }
  _getSharedHistorySamplesForRange(e, t) {
    if (!(this._config?.enable_array_checks ?? !1) || this._getHistoryHours() < t)
      return null;
    const r = this._historyByEntityId[e];
    return !r || r.length === 0 ? null : r;
  }
  _stabilizePopupRangeSamples(e, t, r, s, n) {
    const o = s - n * 60 * 60 * 1e3, l = [...t].sort((u, g) => u.ts - g.ts), a = [...r].sort((u, g) => u.ts - g.ts), c = l.filter((u) => u.ts < o).at(-1) ?? null, p = this._isForecastDefaultEntity(e), d = Number(this.hass?.states?.[e]?.state);
    if (a.length === 0)
      p && Number.isFinite(d) ? a.push({ ts: o, value: d }) : c ? a.push({ ts: o, value: c.value }) : Number.isFinite(d) && a.push({ ts: o, value: d });
    else if (a[0].ts > o && (c || p)) {
      const u = p ? a[0].value : c?.value ?? a[0].value;
      a.unshift({ ts: o, value: u });
    }
    const h = a[a.length - 1];
    if (!h && Number.isFinite(d))
      a.push({ ts: s, value: d });
    else if (h && h.ts < s) {
      const u = Number.isFinite(d) ? d : h.value;
      a.push({ ts: s, value: u });
    }
    return a.filter((u) => Number.isFinite(u.ts) && Number.isFinite(u.value)).sort((u, g) => u.ts - g.ts);
  }
  _hasPopupRangeCoverage(e, t, r) {
    if (e.length === 0)
      return !1;
    const s = t - r * 60 * 60 * 1e3, n = e[0].ts, o = e[e.length - 1].ts, l = 900 * 1e3;
    return n <= s + l && o >= t - l;
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
    const s = this.hass?.locale?.language ?? "en", n = re(e), o = r.toLowerCase(), l = o.includes("wh") || o.includes("kwh") ? this._config?.energy_decimals ?? 2 : this._config?.power_decimals ?? 0, a = new Intl.NumberFormat(s, {
      minimumFractionDigits: l,
      maximumFractionDigits: l
    }).format(n);
    return r ? `${a} ${t}` : a;
  }
  _computeGraphStats(e) {
    const t = e.map((l) => l.value).filter((l) => Number.isFinite(l)).sort((l, a) => l - a);
    if (t.length === 0)
      return { min: null, max: null, median: null };
    const r = t[0] ?? null, s = t[t.length - 1] ?? null, n = Math.floor(t.length / 2), o = t.length % 2 === 0 ? (t[n - 1] + t[n]) / 2 : t[n];
    return { min: r, max: s, median: o };
  }
  _buildGraphHourTicks(e, t) {
    if (e.startTs === null || e.endTs === null)
      return [];
    const r = e.startTs, s = e.endTs, n = Math.max(s - r, 1), o = 320, l = 10, a = o - l * 2, c = t === 1 ? 900 * 1e3 : t === 6 ? 3600 * 1e3 : 14400 * 1e3, p = [], d = (u) => {
      const g = new Date(u), f = `${g.getHours()}`.padStart(2, "0"), v = `${g.getMinutes()}`.padStart(2, "0");
      return t === 1 ? `${f}:${v}` : `${f}h`;
    };
    let h = Math.ceil(r / c) * c;
    for (; h < s; ) {
      const u = l + (h - r) / n * a;
      p.push({
        x: u,
        label: d(h)
      }), h += c;
    }
    if (t === 6 && p.length < 3) {
      const u = [0.25, 0.5, 0.75];
      for (const g of u) {
        const f = r + n * g, v = l + (f - r) / n * a;
        p.push({
          x: v,
          label: d(f)
        });
      }
    }
    return p.sort((u, g) => u.x - g.x), p;
  }
  _buildGraphAxisTicks(e) {
    if (e.length === 0)
      return [];
    const t = 10, s = 320 - t * 2;
    return e.map((n) => ({
      label: n.label,
      leftPercent: (n.x - t) / s * 100
    }));
  }
  _toGraphY(e, t, r, s, n) {
    const o = Math.max(r - t, 1), l = Math.max(s - n * 2, 1);
    return s - n - (e - t) / o * l;
  }
  _buildAlignedGraphLinePath(e, t, r, s, n) {
    const o = e.filter((h) => Number.isFinite(h.ts) && Number.isFinite(h.value)).sort((h, u) => h.ts - u.ts);
    if (o.length === 0)
      return "";
    const l = Math.max(t.endTs - t.startTs, 1), a = Math.max(t.maxValue - t.minValue, 1), c = Math.max(r - n * 2, 1), p = Math.max(s - n * 2, 1), d = [];
    for (const h of o) {
      const u = Math.min(Math.max(h.ts, t.startTs), t.endTs), g = n + (u - t.startTs) / l * c, f = (h.value - t.minValue) / a, v = s - n - Math.min(Math.max(f, 0), 1) * p, x = d[d.length - 1];
      x && Math.abs(x.x - g) < 0.01 && Math.abs(x.y - v) < 0.01 || d.push({ x: g, y: v });
    }
    return d.length === 0 ? "" : (d.length === 1 && d.push({ ...d[0] }), d.map(
      (h, u) => `${u === 0 ? "M" : "L"}${h.x.toFixed(2)},${h.y.toFixed(2)}`
    ).join(" "));
  }
  _buildAlignedGraphAreaPath(e, t, r, s, n) {
    const o = this._buildAlignedGraphLinePath(e, t, r, s, n);
    if (!o)
      return "";
    const l = e.filter((f) => Number.isFinite(f.ts) && Number.isFinite(f.value)).sort((f, v) => f.ts - v.ts);
    if (l.length === 0)
      return "";
    const a = Math.max(t.endTs - t.startTs, 1), c = Math.max(r - n * 2, 1), p = Math.min(Math.max(l[0].ts, t.startTs), t.endTs), d = Math.min(
      Math.max(l[l.length - 1].ts, t.startTs),
      t.endTs
    ), h = n + (p - t.startTs) / a * c, u = n + (d - t.startTs) / a * c, g = s - n;
    return `${o} L${u.toFixed(2)},${g.toFixed(2)} L${h.toFixed(2)},${g.toFixed(2)} Z`;
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
    const t = e.panels.filter((p) => !p.hiddenSlot), r = (p) => t.filter((d) => d.status === p).map((d) => `Panel on ${this._formatSlotLabel(d.slotIndex)} (${d.label}): ${d.reason}`), s = [], n = r("inverter");
    n.length > 0 && s.push({ title: "Inverter", items: n });
    const o = r("error");
    o.length > 0 && s.push({ title: "Error", items: o });
    const l = r("deviation");
    l.length > 0 && s.push({ title: "Deviation", items: l });
    const a = r("offline");
    a.length > 0 && s.push({ title: "Unavailable", items: a });
    const c = r("unconfigured");
    return c.length > 0 && s.push({ title: "Needs setup", items: c }), s;
  }
  _computeRenderedColumns(e, t) {
    const r = Math.max(1, Math.floor(e)), s = this._cardWidth > 0 ? this._cardWidth : t ?? 980, n = t ? Math.min(s, t) : s;
    if (!Number.isFinite(n) || n <= 0)
      return r;
    const o = Math.max(120, n - 40), l = n <= 560 ? 8 : 10, a = n <= 760, c = a ? Math.min(r, 3) : r, p = this._getPanelWidthCapPx(), d = p !== null ? p : a ? 100 : Math.max(130, Math.min(220, o * 0.32)), h = Math.floor((o + l) / (d + l));
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
    const r = this._cardWidth > 0 ? this._cardWidth : t ?? 980, s = t ? Math.min(r, t) : r, n = s <= 560 ? 8 : 10, o = Math.max(120, s - 40), l = Math.max(1, e), a = (o - Math.max(0, l - 1) * n) / l;
    return this._applyPanelWidthCapPx(a);
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
    const n = this._computeWidthBasedPanelHeight(r, s);
    if (!t || !Number.isFinite(t))
      return n;
    const o = Math.max(1, e), l = 250, a = 36, c = Math.max(o - 1, 0) * 10, d = (t - l - a - c) / o;
    if (!Number.isFinite(d))
      return n;
    const h = Math.min(240, Math.max(96, d)), u = Math.min(h, n * 1.6);
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
    const n = this._computePanelScale(r), l = Math.min(0.96, Math.max(0.62, 0.72 * n)) * 16;
    return tn({
      candidates: s,
      panelWidthPx: t,
      panelHeightPx: r,
      fontPx: l,
      reservedRightPx: _n,
      measureTextWidthPx: (a, c) => this._measureTextWidthPx(a, c)
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
    if (_e._textMeasureContext === void 0) {
      const s = document.createElement("canvas");
      _e._textMeasureContext = s.getContext("2d");
    }
    const r = _e._textMeasureContext;
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
      const n = this.hass?.states?.[s]?.attributes?.unit_of_measurement;
      if (typeof n == "string" && n.trim().length > 0)
        return n;
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
    return Si(this.hass, e);
  }
  _isForecastDefaultEntity(e) {
    return e === at("power") || e === at("energy");
  }
  _isForecastOverlayEnabled() {
    return this._config?.enable_forecast_overlay ?? !1;
  }
  _resolveForecastMetricDisplay(e, t, r) {
    const s = at(e), n = this._getForecastEntityId(e);
    if (!n)
      return {
        expectedEntityId: s,
        entityId: null,
        value: null,
        unit: r,
        display: this._t("common.not_configured")
      };
    const o = this._getUnitForEntity(n, r), l = Number(this.hass?.states?.[n]?.state), a = Number.isFinite(l) ? re(l) : null, c = this.hass?.locale?.language ?? "en";
    return {
      expectedEntityId: s,
      entityId: n,
      value: a,
      unit: o,
      display: He(a, t, o, this._t("common.unavailable"), c)
    };
  }
  _resolveSummaryPower(e) {
    const t = this._getSystemPowerEntityId();
    if (t) {
      const r = this.hass?.states?.[t], s = Number(r?.state), n = Number.isFinite(s) ? s : null;
      return {
        value: n === null ? null : this._config?.invert_system_power ? re(n * -1) : re(n),
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
    const n = s.state?.toString().trim().toLowerCase();
    if (!n || n === "unknown" || n === "unavailable")
      return { title: t, value: "Unavailable" };
    const o = Number(s.state);
    if (Number.isFinite(o)) {
      const l = this.hass?.locale?.language ?? "en", a = this._getUnitForEntity(r, ""), c = this._config?.invert_custom_kpi ? re(o * -1) : re(o), p = wi(
        String(c),
        l,
        this._config?.custom_kpi_decimals ?? 0,
        a
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
    const n = ++this._popupScrollRestoreToken;
    return this._popupScrollRestore = {
      token: n,
      popup: s,
      top: s.scrollTop,
      left: s.scrollLeft,
      expiresAt: Date.now() + 2500,
      frameId: null,
      framesRemaining: 0
    }, this._scheduleCapturedScrollRestore(n), n;
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
    const t = this._config?.panels.find((n) => n.id === e.id);
    if (!t)
      return w;
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
          @value-changed=${(n) => this._updatePanelConfigFromCard(e.id, "power_entity", n.detail.value)}
        ></ha-selector>
        ${r.length === 0 ? y`<p class="subtitle">No available W sensors found.</p>` : w}
        <div class="toggle">
          <ha-formfield label="Disable Panel (hide but keep slot when off)">
            <ha-switch
              .checked=${s}
              @change=${(n) => this._updatePanelConfigFromCard(
      e.id,
      "enabled",
      !n.currentTarget.checked
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
    const r = this._config.panels.find((o) => o.id === e)?.power_entity, s = this._config.enable_string_sensor_sharing ? /* @__PURE__ */ new Set() : new Set(
      this._config.panels.filter((o) => o.id !== e).map((o) => o.power_entity).filter((o) => !!o)
    ), n = [];
    for (const o of Object.values(this.hass.states)) {
      if (!o.entity_id.startsWith("sensor."))
        continue;
      const l = o.attributes?.unit_of_measurement;
      typeof l != "string" || l.trim().toLowerCase() !== "w" || s.has(o.entity_id) && o.entity_id !== r || n.push(o.entity_id);
    }
    return typeof r == "string" && r.length > 0 && !n.includes(r) && n.push(r), n.sort(q);
  }
  _updatePanelConfigFromCard(e, t, r) {
    if (!this._config)
      return;
    const s = this._config.panels.findIndex((l) => l.id === e);
    if (s < 0)
      return;
    const n = this._config.panels.map((l, a) => {
      if (a !== s)
        return l;
      const c = { ...l, [t]: r };
      if (t === "power_entity") {
        const p = l.power_entity, d = typeof r == "string" ? r.trim() : "", h = this._getEntityFriendlyName(d);
        h && this._shouldAutoRenamePanelName(l.name, l.id, p) && (c.name = h);
      }
      return c;
    }), o = Be({
      ...this._config,
      panels: n
    });
    this._commitConfigFromCard(o), t === "power_entity" && (typeof r == "string" ? r.trim() : "").length > 0 && (this._selectedPanelId = e, this._ensurePopupGraphLoaded(e, this._popupGraphRangeHours));
  }
  _getEntityFriendlyName(e) {
    const t = e?.trim();
    if (!t)
      return;
    const s = this.hass?.states?.[t]?.attributes?.friendly_name;
    if (typeof s != "string")
      return;
    const n = s.trim();
    return n.length > 0 ? n : void 0;
  }
  _shouldAutoRenamePanelName(e, t, r) {
    const s = e?.trim() ?? "";
    if (!s || s === t || /^panel\s+\d+$/i.test(s))
      return !0;
    const n = this._getEntityFriendlyName(r);
    return !!(n && s === n);
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
    const s = [...this._config.panels], n = s[r], o = s[t];
    !n || !o || (s[r] = o, s[t] = n, this._commitConfigFromCard(
      Be({
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
      new CustomEvent(pn, {
        detail: { config: e }
      })
    ), this._persistConfigToLovelace(e);
  }
  async _persistConfigToLovelace(e) {
    if (!this.hass?.callWS)
      return;
    const t = ++this._persistConfigToken, r = this._findLovelaceContext(), s = this._resolveDashboardUrlPath(r);
    try {
      const n = r && typeof r.config == "object" ? r.config : await this.hass.callWS({
        type: "lovelace/config",
        ...s ? { url_path: s } : {}
      });
      if (t !== this._persistConfigToken)
        return;
      const { config: o, replaced: l } = this._replaceCardConfigInDashboardConfig(
        n,
        e
      );
      if (!l) {
        console.warn("Solar Panel Visualizer: Could not locate card config to persist changes.");
        return;
      }
      if (await this.hass.callWS({
        type: "lovelace/config/save",
        ...s ? { url_path: s } : {},
        config: o
      }), t !== this._persistConfigToken)
        return;
      r && (r.config = o), this._sourceConfigRef = void 0;
    } catch (n) {
      console.warn("Solar Panel Visualizer: Failed to persist dashboard config.", n);
    }
  }
  _findLovelaceContext() {
    const e = /* @__PURE__ */ new Set();
    let t = this;
    for (; t && !e.has(t); ) {
      if (e.add(t), typeof t == "object" && t !== null && "lovelace" in t && t.lovelace && typeof t.lovelace == "object")
        return t.lovelace;
      const r = t, s = typeof r.getRootNode == "function" ? r.getRootNode() : null, n = s && "host" in s ? s.host : null;
      if (n && n !== t) {
        t = n;
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
      (n) => !!this._sourceConfigRef && n === this._sourceConfigRef,
      t
    );
    if (r.replaced)
      return {
        config: r.value,
        replaced: !0
      };
    const s = this._replaceFirstMatch(
      e,
      (n) => this._matchesCurrentCardSignature(n),
      t
    );
    return {
      config: s.value,
      replaced: s.replaced
    };
  }
  _replaceFirstMatch(e, t, r) {
    let s = !1;
    const n = (o) => {
      if (s)
        return o;
      if (t(o))
        return s = !0, r;
      if (Array.isArray(o)) {
        let c = !1;
        const p = o.map((d) => {
          const h = n(d);
          return h !== d && (c = !0), h;
        });
        return c ? p : o;
      }
      if (typeof o != "object" || o === null)
        return o;
      let l = !1;
      const a = {};
      for (const [c, p] of Object.entries(o)) {
        const d = n(p);
        a[c] = d, d !== p && (l = !0);
      }
      return l ? a : o;
    };
    return { value: n(e), replaced: s };
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
    const o = (Array.isArray(t.panels) ? t.panels : []).map(
      (a) => typeof a == "object" && a !== null && typeof a.id == "string" ? a.id : ""
    ).sort().join("|"), l = this._config.panels.map((a) => a.id).sort().join("|");
    return o.length > 0 && o === l;
  }
  _adjustGraphSamplesForEntity(e, t) {
    const r = this._getSystemPowerEntityId(), s = (this._config?.invert_system_power ?? !1) && !!r && e === r;
    return t.map((n) => ({
      ts: n.ts,
      value: re(s ? n.value * -1 : n.value)
    }));
  }
  _scaleGraphSamples(e, t = 1) {
    return t === 1 ? e : e.map((r) => ({
      ts: r.ts,
      value: re(r.value * t)
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
    const n = Date.now() - t * 60 * 60 * 1e3, o = [...e].sort((a, c) => a.ts - c.ts), l = o[0];
    return !l || l.ts <= n ? o : [{ ts: n, value: l.value }, ...o];
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
    const n = [
      t?.attributes?.last_restart,
      t?.attributes?.last_reset,
      t?.attributes?.boot_time,
      t?.attributes?.started,
      t?.attributes?.start_time
    ];
    for (const o of n) {
      if (typeof o != "string" || o.trim().length === 0)
        continue;
      const l = Date.parse(o);
      if (Number.isFinite(l))
        return String(l);
    }
    if (!/^[-+]?\d+(\.\d+)?$/.test(r))
      return r;
  }
  _historyCacheKey() {
    return `${cn}${this._getHistorySignature()}`;
  }
  _pruneSamples(e, t = this._getHistoryHours()) {
    const s = Date.now() - t * 60 * 60 * 1e3;
    return e.filter((n) => n.ts >= s && Number.isFinite(n.value)).sort((n, o) => n.ts - o.ts);
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
      const n = this.hass.states[s], o = Number(n?.state);
      if (!Number.isFinite(o))
        continue;
      const a = [...this._historyByEntityId[s] ?? []], c = a[a.length - 1];
      (!c || Math.abs(t - c.ts) > 6e4 || Math.abs(c.value - o) > 0.01) && (a.push({ ts: t, value: o }), this._historyByEntityId[s] = this._pruneSamples(a), e = !0);
    }
    e && this._saveHistoryCache();
  }
  _saveHistoryCache() {
    if (typeof window > "u" || !this._config)
      return;
    const e = {
      v: vr,
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
        if (t.v !== vr || !t.samples)
          return;
        const r = {};
        for (const [s, n] of Object.entries(t.samples))
          r[s] = this._pruneSamples(n);
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
    if (t === this._historyQuerySignature && this._historyState !== "idle" && r - this._historyLastLoadMs < dn) {
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
    const r = Date.now(), s = new Date(r - this._getHistoryHours() * 60 * 60 * 1e3).toISOString(), n = new Date(r).toISOString();
    this._historyState = "loading", this._historyStateReason = void 0, this.requestUpdate();
    try {
      const o = await this._fetchRecorderHistoryRaw(s, n, t);
      if (e !== this._historyLoadToken)
        return;
      const l = this._parseRecorderResponse(o, this._getHistoryHours(), t);
      Object.keys(l).length === 0 ? (this._historyState = "fallback", this._historyStateReason = "Solar panel history returned no samples, using live warm-up only.") : (this._historyByEntityId = {
        ...this._historyByEntityId,
        ...l
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
    const s = [], n = r.join(","), o = `history/period/${e}`, l = `history/period/${encodeURIComponent(e)}`, a = [], c = {
      end_time: t,
      filter_entity_id: n,
      no_attributes: !0,
      significant_changes_only: !1,
      minimal_response: !0
    }, p = {
      end_time: t,
      filter_entity_id: n
    };
    if (a.push({ path: o, params: p }), a.push({ path: o, params: c }), l !== o && (a.push({ path: l, params: p }), a.push({ path: l, params: c })), this.hass.callApi)
      for (const d of a)
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
    const s = {}, n = (a) => {
      if (typeof a == "number" && Number.isFinite(a))
        return a > 1e11 ? a : a * 1e3;
      if (typeof a == "string" && a.trim().length > 0) {
        const c = a.trim(), p = Number(c);
        if (Number.isFinite(p) && /^\d+(\.\d+)?$/.test(c))
          return p > 1e11 ? p : p * 1e3;
        const d = Date.parse(c);
        if (Number.isFinite(d))
          return d;
      }
      return Number.NaN;
    }, o = (a, c) => {
      if (!Array.isArray(a) || a.length === 0)
        return;
      let p = c;
      for (const d of a) {
        if (Array.isArray(d)) {
          if (!p || d.length < 2)
            continue;
          const x = n(d[0]), S = Number(d[1]), I = n(d[1]), M = Number(d[0]);
          let $ = x, E = S;
          if ((!Number.isFinite($) || !Number.isFinite(E)) && ($ = I, E = M), !Number.isFinite($) || !Number.isFinite(E))
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
        const g = Number(h.state ?? h.s);
        if (!Number.isFinite(g))
          continue;
        const f = typeof h.last_changed == "string" ? h.last_changed : typeof h.last_updated == "string" ? h.last_updated : h.lc ?? h.lu ?? h.last_changed_ts ?? h.last_updated_ts ?? h.ts, v = n(f);
        Number.isFinite(v) && (s[u] || (s[u] = []), s[u].push({ ts: v, value: g }));
      }
    }, l = typeof e == "object" && e !== null && "result" in e ? e.result : e;
    if (Array.isArray(l))
      for (const [a, c] of l.entries())
        o(c, r[a]);
    else if (typeof l == "object" && l !== null)
      for (const [a, c] of Object.entries(
        l
      ))
        o(c, a);
    else
      return s;
    for (const [a, c] of Object.entries(s))
      s[a] = this._pruneSamples(c, t);
    return s;
  }
};
_e.properties = {
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
}, _e.styles = [Ot`
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

  `, Ui];
let At = _e;
class hs extends At {
}
customElements.get("solar-panel-visualizer") || customElements.define("solar-panel-visualizer", hs);
if (!customElements.get("solar-panel-visualizer-card")) {
  class i extends hs {
  }
  customElements.define("solar-panel-visualizer-card", i);
}
const gn = /[._\-\s]+/, us = /^\d+$/, zt = /^(?=.*[a-z])(?=.*\d)[a-z0-9]{6,}$/i, fn = /^(?=.*[a-z])\d{3,}[a-z0-9]*$/i, yn = /^[a-z]+\d{1,2}$/i, Bt = /* @__PURE__ */ new Set([
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
]), vn = /* @__PURE__ */ new Set([
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
]), wn = /* @__PURE__ */ new Set(["sensor", "binary_sensor"]), bn = /* @__PURE__ */ new Set([
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
]), fe = (i, e) => {
  if (e === "friendlyName") {
    const t = i.friendlyName?.trim();
    if (t)
      return t;
  }
  return i.entityId;
}, Me = (i) => i.split(gn).map((e) => e.trim()).filter((e) => e.length > 0), xn = (i, e, t = {}) => {
  if (i.length < (t.minCandidates ?? 4))
    return null;
  const r = i.map(
    (n) => Me(fe(n, e))
  ), s = Math.min(...r.map((n) => n.length));
  if (s < 3)
    return null;
  for (let n = s - 1; n > 0; n -= 1) {
    const o = r.map((p) => p[n].toLowerCase()), l = new Set(o);
    if (!t.allowSingleGroup && l.size <= 1 || l.size >= i.length || [...l].every((p) => Bt.has(p)) || !t.allowNumericGroup && [...l].every((p) => us.test(p)))
      continue;
    const a = /* @__PURE__ */ new Map();
    for (const p of o)
      a.set(p, (a.get(p) ?? 0) + 1);
    if (!(![...a.values()].some((p) => p > 1) || new Set(
      r.map((p) => p[n - 1].toLowerCase())
    ).size !== 1))
      return { sortBy: e, tokenIndex: n };
  }
  return null;
}, Pn = (i) => {
  const e = i.toLowerCase();
  return Bt.has(e) || us.test(e) || yn.test(e) ? !1 : zt.test(e) || fn.test(e);
}, Sn = (i, e, t = {}) => {
  if (i.length < (t.minCandidates ?? 4))
    return null;
  const r = i.map(
    (c) => Me(fe(c, e))
  ), s = Math.min(...r.map((c) => c.length));
  if (s < 3)
    return null;
  const n = s - 1, o = r.map((c) => c[n].toLowerCase()), l = new Set(o);
  if (!t.allowSingleGroup && l.size <= 1 || l.size >= i.length || ![...l].every(Pn))
    return null;
  const a = /* @__PURE__ */ new Map();
  for (const c of o)
    a.set(c, (a.get(c) ?? 0) + 1);
  return [...a.values()].some((c) => c > 1) ? { sortBy: e, tokenIndex: n } : null;
}, Qe = (i, e = {}) => {
  const t = ["entityId", "friendlyName"];
  for (const r of t) {
    const s = Sn(i, r, e);
    if (s)
      return s;
    const n = xn(i, r, e);
    if (n)
      return n;
  }
  return null;
}, _s = (i, e) => [...i].sort((t, r) => {
  const s = q(
    fe(t, e),
    fe(r, e)
  );
  return s !== 0 ? s : q(t.entityId, r.entityId);
}), br = (i, e, t = {}) => {
  const r = Qe(i, t);
  return r ? [...i].sort((s, n) => {
    const o = Me(fe(s, r.sortBy)), l = Me(fe(n, r.sortBy)), a = o[r.tokenIndex] ?? "", c = l[r.tokenIndex] ?? "", p = q(a, c);
    if (p !== 0)
      return p;
    const d = o.filter((g, f) => f !== r.tokenIndex).join(" "), h = l.filter((g, f) => f !== r.tokenIndex).join(" "), u = q(d, h);
    return u !== 0 ? u : q(s.entityId, n.entityId);
  }) : _s(i, e);
}, $n = (i, e = "auto", t = "entityId") => (e === "grouped" ? br(i, t, { allowNumericGroup: !0 }) : e === "auto" && Qe(i) ? br(i, t) : _s(
  i,
  e === "friendlyName" || e === "entityId" ? e : t
)).map((s) => ({
  entityId: s.entityId,
  friendlyName: s.friendlyName
})), ms = (i, e, t, r) => {
  const s = e.trim().replace(/\*+$/, "");
  if (s.length === 0)
    return [];
  const n = s.startsWith("sensor."), o = s.toLowerCase(), l = [];
  for (const [a, c] of Object.entries(i)) {
    if (!a.startsWith("sensor."))
      continue;
    const p = c.attributes?.unit_of_measurement, d = typeof p == "string" ? p.trim().toLowerCase() : "";
    if (!t(d, c))
      continue;
    const h = typeof c.attributes?.friendly_name == "string" ? c.attributes.friendly_name : void 0, u = h?.trim().toLowerCase();
    (n ? a.startsWith(s) : u?.includes(o)) && l.push({
      entityId: a,
      friendlyName: h
    });
  }
  return $n(
    l,
    r,
    n ? "entityId" : "friendlyName"
  );
}, gs = (i, e, t, r, s, n = "auto", o = {}) => {
  const l = r.trim().replace(/\*+$/, "");
  if (l.length === 0)
    return {
      panels: [...i],
      matched: 0,
      filled: 0,
      skipped: i.length
    };
  const a = ms(
    e,
    l,
    s,
    n
  ), c = new Set(
    i.map((v) => v[t]).filter((v) => typeof v == "string" && v.length > 0)
  ), p = Math.max(
    1,
    Math.floor(o.repeatEachCandidate ?? 1)
  ), d = a.flatMap(
    (v) => Array.from({ length: p }, () => v.entityId)
  ).filter((v) => !c.has(v));
  let h = 0, u = 0, g = 0;
  return {
    panels: i.map((v) => {
      const x = { ...v };
      if (x.enabled === !1)
        return g += 1, x;
      const S = x[t];
      if (typeof S == "string" && S.trim().length > 0)
        return g += 1, x;
      const I = d[h];
      return I ? (x[t] = I, h += 1, u += 1, x) : (g += 1, x);
    }),
    matched: a.length,
    filled: u,
    skipped: g
  };
}, Cn = (i, e, t, r, s = "auto", n = {}) => {
  const o = t.trim().replace(/\*+$/, "");
  if (o.length === 0)
    return {
      panels: [...i],
      matched: 0,
      filled: 0,
      skipped: i.length
    };
  const l = ms(
    e,
    o,
    r,
    s
  ), a = i.filter((f) => f.power_entity?.trim()).map((f) => {
    const v = f.power_entity ? e[f.power_entity] : void 0;
    return {
      entityId: f.power_entity ?? "",
      friendlyName: ce(v)
    };
  }), c = Qe(a, {
    allowNumericGroup: !0,
    allowSingleGroup: !0,
    minCandidates: 2
  });
  if (!c)
    return gs(
      i,
      e,
      "energy_entity",
      o,
      r,
      s
    );
  let p = 0, d = 0;
  const h = /* @__PURE__ */ new Set(), u = l.flatMap((f) => {
    const v = e[f.entityId];
    return v ? [{
      entityId: f.entityId,
      entity: v,
      tokens: Ze(f.entityId, v)
    }] : [];
  });
  return {
    panels: i.map((f) => {
      const v = { ...f };
      if (v.enabled === !1)
        return d += 1, v;
      const x = Re(v, e, c), S = v.energy_entity;
      if (typeof S == "string" && S.trim().length > 0)
        return x && !n.shareSingleGroupEnergy && h.add(x), d += 1, v;
      const I = An(
        v,
        i,
        e,
        c,
        x
      ), M = vs(u, x);
      if (M.length === 1) {
        const E = x ?? M[0].entityId;
        return !n.shareSingleGroupEnergy && h.has(E) ? (d += 1, v) : (v.energy_entity = M[0].entityId, n.shareSingleGroupEnergy || h.add(E), p += 1, v);
      }
      const $ = qe(M, (E) => {
        const L = Je(E.tokens, x ?? void 0);
        return ys(I, L);
      });
      return $ ? (v.energy_entity = $.entityId, p += 1, v) : (d += 1, v);
    }),
    matched: l.length,
    filled: p,
    skipped: d
  };
}, yt = (i) => typeof i.attributes?.unit_of_measurement == "string" ? i.attributes.unit_of_measurement.trim().toLowerCase() : "", vt = (i) => typeof i.attributes?.device_class == "string" ? i.attributes.device_class.trim().toLowerCase() : "", xr = (i) => ["w", "kw"].includes(yt(i)) || vt(i) === "power", Pr = (i) => ["v", "kv", "mv"].includes(yt(i)) || vt(i) === "voltage", Sr = (i) => ["a", "ma"].includes(yt(i)) || vt(i) === "current", En = (i) => ["°c", "°f", "℃", "℉", "c", "f"].includes(yt(i)) || vt(i) === "temperature", ce = (i) => {
  const e = i?.attributes?.friendly_name;
  if (typeof e != "string")
    return;
  const t = e.trim();
  return t.length > 0 ? t : void 0;
}, fs = (i, e) => typeof e.entity_id == "string" && e.entity_id.trim().length > 0 ? e.entity_id : i, kn = (i) => i.split(".")[0] ?? "", Ze = (i, e) => Me(`${i} ${ce(e) ?? ""}`).map((t) => t.toLowerCase()), Je = (i, e) => i.filter((t) => e && t === e.toLowerCase() || Bt.has(t) ? !1 : t.length > 0), ys = (i, e) => {
  const t = new Set(e);
  return i.filter((r) => t.has(r)).length;
}, _t = (i) => {
  const e = /* @__PURE__ */ new Map();
  for (const t of i)
    e.set(t, (e.get(t) ?? 0) + 1);
  return e;
}, In = (i, e, t, r) => {
  const s = i.filter((o) => o.enabled === !1 || !o.power_entity?.trim() ? !1 : !t || !r ? !0 : Re(o, e, t) === r);
  if (s.length === 0)
    return /* @__PURE__ */ new Map();
  const n = _t(
    Ae(s[0], e, r)
  );
  for (const o of s.slice(1)) {
    const l = _t(Ae(o, e, r));
    for (const [a, c] of [...n.entries()]) {
      const p = Math.min(c, l.get(a) ?? 0);
      p <= 0 ? n.delete(a) : n.set(a, p);
    }
  }
  return n;
}, ct = (i, e) => {
  const t = new Set(i.tokens);
  return e.some((r) => t.has(r));
}, he = (i, e) => Object.entries(i).map(([t, r]) => ({
  entityId: fs(t, r),
  entity: r
})).filter(({ entityId: t, entity: r }) => t.startsWith("sensor.") && e(r)).map(({ entityId: t, entity: r }) => ({
  entityId: t,
  entity: r,
  tokens: Ze(t, r)
})).sort((t, r) => q(t.entityId, r.entityId)), Fn = (i) => i.tokens.some((e) => vn.has(e)), Tn = (i, e = "") => Object.entries(i).map(([t, r]) => {
  const s = fs(t, r);
  return {
    entityId: s,
    entity: r,
    tokens: Ze(s, r)
  };
}).filter((t) => wn.has(kn(t.entityId))).filter(Fn).filter((t) => {
  const r = e.trim().replace(/\*+$/, "").toLowerCase();
  return r ? r.startsWith("sensor.") || r.startsWith("binary_sensor.") ? t.entityId.toLowerCase().startsWith(r) : !!ce(t.entity)?.trim().toLowerCase().includes(r) : !0;
}).sort((t, r) => q(t.entityId, r.entityId)), qe = (i, e) => {
  const t = i.map((r) => ({
    candidate: r,
    score: e(r)
  })).filter((r) => r.score > 0).sort((r, s) => s.score - r.score || q(r.candidate.entityId, s.candidate.entityId));
  return t.length === 0 || t.length > 1 && t[0].score === t[1].score ? null : t[0].candidate;
}, vs = (i, e) => {
  if (!e)
    return [];
  const t = e.toLowerCase();
  return i.filter((r) => r.tokens.includes(t));
}, ws = (i, e) => {
  const t = new Set(
    e.map((r) => r.toLowerCase())
  );
  return t.size === 0 ? [] : i.filter(
    (r) => r.tokens.some((s) => t.has(s))
  );
}, Re = (i, e, t) => {
  if (!t || !i.power_entity)
    return null;
  const r = e[i.power_entity];
  return Me(
    fe(
      {
        entityId: i.power_entity,
        friendlyName: ce(r)
      },
      t.sortBy
    )
  )[t.tokenIndex]?.toLowerCase() ?? null;
}, Ae = (i, e, t) => i.power_entity ? Je(
  Ze(i.power_entity, e[i.power_entity]),
  t ?? void 0
) : [], Mn = (i, e) => i.power_entity ? Je(
  Ze(i.power_entity, e[i.power_entity])
).filter((t) => zt.test(t)) : [], bs = (i, e, t) => {
  const r = Re(i, e, t), s = Mn(i, e), n = r && zt.test(r) ? [r, ...s] : [...s, r];
  return [
    ...new Set(
      n.filter((o) => !!o).map((o) => o.toLowerCase())
    )
  ];
}, An = (i, e, t, r, s) => {
  const n = Ae(i, t, s);
  if (!s)
    return n;
  const o = /* @__PURE__ */ new Map();
  for (const l of e) {
    if (l.enabled === !1 || !l.power_entity?.trim() || Re(l, t, r) !== s)
      continue;
    const a = new Set(
      Ae(l, t, s)
    );
    for (const c of a)
      o.set(c, (o.get(c) ?? 0) + 1);
  }
  return n.filter((l) => o.get(l) === 1);
}, Rn = (i, e, t, r, s) => {
  if (i === "panel_power_entity")
    return e.power_entity?.trim() || null;
  const n = vs(t[i], r);
  if (n.length === 0)
    return null;
  if (i === "inverter_temp_entity") {
    const o = n.filter(
      (l) => ct(l, ["temp", "temperature", "inverter"])
    );
    return o.length === 1 ? o[0].entityId : n.length === 1 ? n[0].entityId : null;
  }
  return i === "inverter_ac_power_entity" || i === "inverter_ac_voltage_entity" || i === "inverter_ac_current_entity" ? qe(n, (l) => ct(l, ["ac", "inverter"]) ? 2 : 0)?.entityId ?? null : i === "panel_current_entity" || i === "panel_voltage_entity" ? qe(n, (l) => {
    const a = Je(l.tokens, r ?? void 0), c = ys(s, a);
    if (c === 0)
      return 0;
    const p = ct(l, ["ac", "inverter"]) ? 1 : 0;
    return c * 2 - p;
  })?.entityId ?? null : null;
}, Nn = (i) => {
  let e = 0;
  const t = `${i.entityId} ${ce(i.entity) ?? ""}`.toLowerCase();
  /device[._\-\s]+status/.test(t) && (e += 120), /inverter[._\-\s]+status/.test(t) && (e += 100), ce(i.entity)?.trim().toLowerCase() === "device status" && (e += 80);
  for (const r of i.tokens)
    r === "status" ? e += 20 : r === "state" ? e += 12 : ["fault", "alarm", "error"].includes(r) ? e += 10 : ["mode", "operation", "operating"].includes(r) ? e += 5 : ["work", "working", "run", "running"].includes(r) && (e += 3);
  ct(i, ["inverter"]) && (e += 2);
  for (const r of i.tokens)
    bn.has(r) && (e -= 8);
  return e;
}, Ln = (i, e, t, r, s, n) => {
  const o = Re(i, t, s), l = bs(i, t, s), c = (l.length > 0 ? ws(r, l) : r).filter(
    (u) => !n.has(u.entityId)
  );
  if (c.length === 0)
    return null;
  const p = _t(Ae(i, t, o)), d = In(
    e,
    t,
    s,
    o
  ), h = /* @__PURE__ */ new Map();
  for (const [u, g] of p.entries()) {
    const f = g - (d.get(u) ?? 0);
    f > 0 && h.set(u, f);
  }
  return h.size === 0 ? null : qe(c, (u) => {
    const g = _t(
      Je(u.tokens, o ?? void 0)
    );
    let f = 0;
    for (const [v, x] of h.entries()) {
      const S = Math.max(
        0,
        (g.get(v) ?? 0) - (d.get(v) ?? 0)
      );
      f += Math.min(x, S);
    }
    return f > 0 ? f * 10 : 0;
  });
}, Dn = (i, e, t, r) => {
  const s = new Set(
    i.map((a) => a.inverter_status_entity).filter((a) => typeof a == "string" && a.trim().length > 0)
  );
  let n = 0, o = 0;
  return {
    panels: i.map((a) => {
      if (a.enabled === !1 || !a.power_entity?.trim())
        return o += 1, a;
      if (typeof a.inverter_status_entity == "string" && a.inverter_status_entity.trim().length > 0)
        return a;
      const c = Ln(
        a,
        i,
        e,
        t,
        r,
        s
      );
      return c ? (s.add(c.entityId), n += 1, {
        ...a,
        inverter_status_entity: c.entityId
      }) : (o += 1, a);
    }),
    filled: n,
    skippedPanels: o
  };
}, On = (i, e, t = "") => {
  const s = i.filter(
    (h) => typeof h.power_entity == "string" && h.power_entity.trim().length > 0
  ).map((h) => {
    const u = h.power_entity ? e[h.power_entity] : void 0;
    return {
      entityId: h.power_entity ?? "",
      friendlyName: ce(u)
    };
  }), n = Qe(s, {
    allowNumericGroup: !0,
    allowSingleGroup: !0,
    minCandidates: 2
  }), o = Tn(e, t), l = Dn(
    i,
    e,
    o,
    n
  );
  if (l.filled > 0)
    return l;
  const a = /* @__PURE__ */ new Map();
  let c = 0, p = 0;
  return {
    panels: i.map((h) => {
      if (h.enabled === !1 || !h.power_entity?.trim())
        return p += 1, h;
      if (typeof h.inverter_status_entity == "string" && h.inverter_status_entity.trim().length > 0)
        return h;
      const u = bs(h, e, n);
      if (u.length === 0)
        return p += 1, h;
      const g = u[0];
      if (!a.has(g)) {
        const v = ws(
          o,
          u
        ), x = v.length === 1 ? v[0] : qe(v, Nn);
        a.set(g, x?.entityId ?? null);
      }
      const f = a.get(g);
      return f ? (c += 1, {
        ...h,
        inverter_status_entity: f
      }) : (p += 1, h);
    }),
    filled: c,
    skippedPanels: p
  };
}, Gn = (i, e) => {
  const r = i.filter(
    (c) => c.enabled !== !1 && typeof c.power_entity == "string" && c.power_entity.trim().length > 0
  ).map((c) => {
    const p = c.power_entity ? e[c.power_entity] : void 0;
    return {
      entityId: c.power_entity ?? "",
      friendlyName: ce(p)
    };
  }), s = Qe(r, {
    allowNumericGroup: !0,
    allowSingleGroup: !0,
    minCandidates: 2
  }), n = {
    inverter_ac_power_entity: he(e, xr),
    inverter_ac_voltage_entity: he(e, Pr),
    inverter_ac_current_entity: he(e, Sr),
    inverter_temp_entity: he(e, En),
    panel_current_entity: he(e, Sr),
    panel_voltage_entity: he(e, Pr),
    panel_power_entity: he(e, xr)
  };
  let o = 0, l = 0;
  return {
    panels: i.map((c) => {
      if (c.enabled === !1 || !c.power_entity?.trim())
        return l += 1, c;
      const p = Re(c, e, s), d = Ae(c, e, p), h = {
        ...c.advanced_metrics ?? {}
      };
      let u = !1;
      const g = [
        "inverter_ac_power_entity",
        "inverter_ac_voltage_entity",
        "inverter_ac_current_entity",
        "inverter_temp_entity",
        "panel_current_entity",
        "panel_voltage_entity",
        "panel_power_entity"
      ];
      for (const f of g) {
        if (typeof h[f] == "string" && h[f]?.trim())
          continue;
        const v = Rn(
          f,
          c,
          n,
          p,
          d
        );
        v && (h[f] = v, o += 1, u = !0);
      }
      return u ? {
        ...c,
        advanced_metrics: h
      } : c;
    }),
    filled: o,
    skippedPanels: l
  };
}, Hn = (i, e, t, r) => {
  const s = i?.trim() ?? "";
  if (!s || s === e || /^panel\s+\d+$/i.test(s))
    return !0;
  const n = r(t);
  return !!(n && s === n);
}, zn = (i, e) => i.map((t) => {
  const r = t.power_entity?.trim();
  if (!r)
    return t;
  const s = e(r);
  return s ? {
    ...t,
    name: s
  } : t;
}), $r = "spv-card-config-updated", Bn = (i, e) => {
  i.dispatchEvent(
    new CustomEvent("config-changed", {
      detail: { config: e },
      bubbles: !0,
      composed: !0
    })
  );
}, xs = (i) => typeof i == "string" ? i.trim().toLowerCase() : "", ue = (i, e) => {
  const t = xs(i.attributes?.unit_of_measurement);
  return t.length > 0 && e.includes(t);
}, ie = (i, e) => {
  const t = xs(i.attributes?.device_class);
  return t.length > 0 && e.includes(t);
}, Et = (i, e) => ["w", "kw"].includes(i) || ie(e, ["power"]), kt = (i, e) => ["wh", "kwh", "mwh"].includes(i) || ie(e, ["energy"]), It = (i, e) => typeof e.entity_id == "string" && e.entity_id.trim().length > 0 ? e.entity_id : i, Cr = [
  {
    key: "inverter_ac_power_entity",
    labelKey: "editor.field.advanced_inverter_ac_power",
    matcher: (i) => ue(i, ["w", "kw"]) || ie(i, ["power"])
  },
  {
    key: "inverter_ac_voltage_entity",
    labelKey: "editor.field.advanced_inverter_ac_voltage",
    matcher: (i) => ue(i, ["v", "kv", "mv"]) || ie(i, ["voltage"])
  },
  {
    key: "inverter_ac_current_entity",
    labelKey: "editor.field.advanced_inverter_ac_current",
    matcher: (i) => ue(i, ["a", "ma"]) || ie(i, ["current"])
  },
  {
    key: "inverter_temp_entity",
    labelKey: "editor.field.advanced_inverter_temp",
    matcher: (i) => ie(i, ["temperature"]) || ue(i, ["°c", "°f", "℃", "℉", "c", "f"])
  },
  {
    key: "panel_current_entity",
    labelKey: "editor.field.advanced_panel_current",
    matcher: (i) => ue(i, ["a", "ma"]) || ie(i, ["current"])
  },
  {
    key: "panel_voltage_entity",
    labelKey: "editor.field.advanced_panel_voltage",
    matcher: (i) => ue(i, ["v", "kv", "mv"]) || ie(i, ["voltage"])
  },
  {
    key: "panel_power_entity",
    labelKey: "editor.field.advanced_panel_power",
    matcher: (i) => ue(i, ["w", "kw"]) || ie(i, ["power"])
  }
], gt = class gt extends Ie {
  constructor() {
    super(...arguments), this._config = this._normalizeEditorConfig({
      type: this._getCardType()
    }), this._autoFillPowerPrefix = "", this._autoFillEnergyPrefix = "", this._autoFillStatusPrefix = "", this._autoFillSortMode = "auto", this._autoFillInverterStatus = !1, this._autoFillAdvancedTelemetry = !1, this._autoFillResultMessage = "", this._applyDefaultRatedPowerToAllPanels = () => {
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
      const e = this._autoFillPowerPrefix.trim(), t = this._autoFillEnergyPrefix.trim(), r = this._autoFillStatusPrefix.trim();
      if (!e && !t && !this._autoFillInverterStatus && !this._autoFillAdvancedTelemetry) {
        this._autoFillResultMessage = this._t("editor.autofill.enter_prefix");
        return;
      }
      let s = [...this._config.panels];
      const n = [];
      if (e) {
        s = s.map((l) => ({ ...l, power_entity: void 0 }));
        const o = gs(
          s,
          this.hass.states,
          "power_entity",
          e,
          Et,
          this._autoFillSortMode
        );
        s = o.panels, n.push(
          this._t("editor.autofill.power_summary", {
            matched: o.matched,
            filled: o.filled,
            skipped: o.skipped
          })
        );
      }
      if (t) {
        s = s.map((l) => ({ ...l, energy_entity: void 0 }));
        const o = Cn(
          s,
          this.hass.states,
          t,
          kt,
          this._autoFillSortMode,
          {
            shareSingleGroupEnergy: this._config.enable_string_sensor_sharing ?? !1
          }
        );
        s = o.panels, n.push(
          this._t("editor.autofill.energy_summary", {
            matched: o.matched,
            filled: o.filled,
            skipped: o.skipped
          })
        );
      }
      if (s = zn(
        s,
        (o) => this._getEntityFriendlyName(o)
      ), this._autoFillInverterStatus) {
        const o = On(
          s,
          this.hass.states,
          r
        );
        s = o.panels, n.push(
          this._t("editor.autofill.inverter_status_summary", {
            filled: o.filled,
            skipped: o.skippedPanels
          })
        );
      }
      if (this._autoFillAdvancedTelemetry) {
        const o = Gn(
          s,
          this.hass.states
        );
        s = o.panels, n.push(
          this._t("editor.autofill.advanced_summary", {
            filled: o.filled,
            skipped: o.skippedPanels
          })
        );
      }
      this._autoFillResultMessage = n.join(" "), this._commit(
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
    super.connectedCallback(), window.addEventListener($r, this._handleCardConfigSync);
  }
  disconnectedCallback() {
    window.removeEventListener($r, this._handleCardConfigSync), super.disconnectedCallback();
  }
  setConfig(e) {
    this._config = this._normalizeEditorConfig(e ?? {});
  }
  _getCardType() {
    return Rt;
  }
  _normalizeEditorConfig(e) {
    return Be(e);
  }
  _renderExtraSections() {
    return w;
  }
  _t(e, t) {
    return rs(this.hass, e, t);
  }
  render() {
    if (!this.hass)
      return w;
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
            ${this._renderNumberField("rows", this._t("editor.field.rows"), this._config.rows, 1, Y)}
            ${this._renderNumberField(
      "columns",
      this._t("editor.field.columns"),
      this._config.columns,
      1,
      Y
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

          ${this._renderStringSetupSection()}

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
      dt
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
              ${this._renderEditorInput(
      this._t("editor.field.status_prefix"),
      this._autoFillStatusPrefix,
      (s) => {
        this._autoFillStatusPrefix = s;
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
            ${this._autoFillResultMessage ? y`<p class="section-copy">${this._autoFillResultMessage}</p>` : w}
          </div>

          <div class="panel-list">
            ${this._config.panels.map(
      (s, n) => this._renderPanelEditor(s, n)
    )}
          </div>
        </section>

        ${this._renderExtraSections()}
      </div>
    `;
  }
  _renderStringSetupSection() {
    const e = this._config.enable_string_sensor_sharing ?? !1, t = this._getStringGroupsForEditor();
    return y`
      <div class="section string-setup-section">
        <div class="section-header">
          <h4 class="section-title">${this._t("editor.section.string_setup_title")}</h4>
          <p class="section-copy">
            ${this._t("editor.section.string_setup_copy")}
          </p>
        </div>
        <div class="toggle">
          <ha-formfield label=${this._t("editor.toggle.enable_string_sensor_sharing")}>
            <ha-switch
              .checked=${e}
              @change=${(r) => this._handleStringSensorSharingToggle(
      r.currentTarget.checked
    )}
            ></ha-switch>
          </ha-formfield>
        </div>
        <p class="section-copy">
          ${this._t("editor.helper.string_sensor_sharing_help")}
        </p>
        ${e ? y`
              <div class="grid">
                ${this._renderEditorInput(
      this._t("editor.field.string_group_count"),
      String(t.length),
      (r) => this._updateStringGroupCount(r),
      {
        type: "number",
        min: 1,
        max: Y,
        updateOn: "change"
      }
    )}
              </div>
              <div class="panel-list">
                ${t.map(
      (r, s) => this._renderStringGroupEditor(r, s)
    )}
              </div>
            ` : w}
      </div>
    `;
  }
  _renderStringGroupEditor(e, t) {
    const r = this._getStringSensorEntityIdsByUnit(
      e.power_entity,
      Et
    ), s = this._getStringSensorEntityIdsByUnit(
      e.energy_entity,
      kt
    ), n = e.name ?? `String ${t + 1}`;
    return y`
      <details class="string-group-editor" ?open=${t === 0}>
        <summary>
          <span>${n}</span>
          <span class="chip">
            ${this._t("editor.string_group.panel_count_chip", {
      count: e.panel_count
    })}
          </span>
        </summary>
        <div class="panel-form">
          <div class="grid">
            ${this._renderEditorInput(
      this._t("editor.field.string_group_name"),
      e.name ?? "",
      (o) => this._updateStringGroupValue(t, "name", o),
      { updateOn: "change" }
    )}
            ${this._renderEditorInput(
      this._t("editor.field.string_group_panel_count"),
      String(e.panel_count),
      (o) => this._updateStringGroupValue(
        t,
        "panel_count",
        this._parseNumberWithClamp(
          o,
          e.panel_count,
          1,
          Y
        )
      ),
      {
        type: "number",
        min: 1,
        max: Y,
        updateOn: "change"
      }
    )}
          </div>
          ${this._renderSelectorWithClear(
      this._t("editor.field.string_group_power_sensor"),
      e.power_entity,
      {
        entity: {
          domain: "sensor",
          include_entities: r
        }
      },
      (o) => this._updateStringGroupValue(t, "power_entity", o)
    )}
          ${this._renderSelectorWithClear(
      this._t("editor.field.string_group_energy_sensor"),
      e.energy_entity,
      {
        entity: {
          domain: "sensor",
          include_entities: s
        }
      },
      (o) => this._updateStringGroupValue(t, "energy_entity", o)
    )}
        </div>
      </details>
    `;
  }
  _renderPanelEditor(e, t) {
    const r = this._getAvailableSensorEntityIdsByUnit(
      t,
      "power_entity",
      Et
    ), s = this._getAvailableSensorEntityIdsByUnit(
      t,
      "energy_entity",
      kt
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
                @change=${(n) => this._updatePanelValue(
      t,
      "show_energy",
      n.currentTarget.checked
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
      dt
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
                @change=${(n) => this._updatePanelValue(
      t,
      "enabled",
      n.currentTarget.checked
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
          ${Cr.map(
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
  _renderPanelAdvancedSensorSelector(e, t, r, s, n) {
    return this._renderSelectorWithClear(
      r,
      s,
      {
        entity: {
          domain: "sensor",
          include_entities: n
        }
      },
      (o) => this._updatePanelAdvancedMetricValue(e, t, o)
    );
  }
  _formatPanelSlotTitle(e) {
    const t = Math.floor(e / this._config.columns) + 1, r = e % this._config.columns + 1;
    return this._t("editor.panel_slot_title", { row: t, column: r });
  }
  _renderPanelEntityPicker(e, t, r, s, n) {
    return this._renderSelectorWithClear(
      r,
      s,
      {
        entity: {
          domain: n
        }
      },
      (o) => this._updatePanelValue(e, t, o)
    );
  }
  _renderTextField(e, t, r) {
    return this._renderEditorInput(
      t,
      r,
      (s) => this._updateRootValue(e, s)
    );
  }
  _renderPanelSensorSelector(e, t, r, s, n) {
    return this._renderSelectorWithClear(
      r,
      s,
      {
        entity: {
          domain: "sensor",
          include_entities: n
        }
      },
      (o) => this._updatePanelValue(e, t, o)
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
        @value-changed=${(n) => s(
      typeof n.detail?.value == "string" ? n.detail.value : ""
    )}
      ></ha-selector>
    `;
  }
  _renderNumberField(e, t, r, s, n) {
    return this._renderEditorInput(
      t,
      String(r),
      (o) => this._updateRootValue(
        e,
        this._parseNumberWithClamp(o, r, s, n)
      ),
      { type: "number", min: s, max: n, updateOn: "change" }
    );
  }
  _renderOptionalNumberField(e, t, r, s, n) {
    return this._renderEditorInput(
      t,
      r !== void 0 ? String(r) : "",
      (o) => this._updateRootValue(
        e,
        this._parseOptionalNumber(o, s, n)
      ),
      { type: "number", min: s, max: n, updateOn: "change" }
    );
  }
  _renderPanelTextField(e, t, r, s) {
    return this._renderEditorInput(
      r,
      s,
      (n) => this._updatePanelValue(e, t, n)
    );
  }
  _renderPanelOptionalNumberField(e, t, r, s, n, o) {
    return this._renderEditorInput(
      r,
      s !== void 0 ? String(s) : "",
      (l) => this._updatePanelValue(
        e,
        t,
        this._parseOptionalNumber(l, n, o)
      ),
      { type: "number", min: n, max: o, updateOn: "change" }
    );
  }
  _renderPanelNumberField(e, t, r, s, n, o) {
    return this._renderEditorInput(
      r,
      String(s),
      (l) => this._updatePanelValue(
        e,
        t,
        this._parseNumberWithClamp(l, s, n, o)
      ),
      { type: "number", min: n, max: o, updateOn: "change" }
    );
  }
  _renderEditorInput(e, t, r, s = {}) {
    const n = s.updateOn ?? "input", o = (a) => {
      n === "input" && r(a.currentTarget.value);
    }, l = (a) => {
      n === "change" && r(a.currentTarget.value);
    };
    return y`
      <label class="field">
        <span class="field-label">${e}</span>
        <input
          class="text-input"
          type=${s.type ?? "text"}
          .value=${t}
          min=${s.min === void 0 ? w : String(s.min)}
          max=${s.max === void 0 ? w : String(s.max)}
          ?disabled=${s.disabled ?? !1}
          @input=${o}
          @change=${l}
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
          @change=${(n) => this._updateRootValue(e, n.currentTarget.value)}
        >
          ${s.map(
      (n) => y`<option value=${n.value}>${n.label}</option>`
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
  _getStringGroupsForEditor() {
    const e = this._config.string_groups ?? [];
    return e.length > 0 ? e : this._buildStringGroupsFromCurrentPanels();
  }
  _buildStringGroupsFromCurrentPanels() {
    return Array.from({ length: Math.max(this._config.rows, 1) }, (e, t) => {
      const r = t * this._config.columns, n = this._config.panels.slice(
        r,
        r + this._config.columns
      ).filter((a) => a.enabled !== !1), o = n.find((a) => a.power_entity), l = n.find((a) => a.energy_entity);
      return {
        id: `string-${t + 1}`,
        name: `String ${t + 1}`,
        panel_count: Math.min(
          Math.max(n.length || this._config.columns || 1, 1),
          Y
        ),
        power_entity: o?.power_entity,
        energy_entity: l?.energy_entity
      };
    });
  }
  _makeDefaultStringGroup(e) {
    return {
      id: `string-${e + 1}`,
      name: `String ${e + 1}`,
      panel_count: Math.min(Math.max(this._config.columns || 3, 1), Y)
    };
  }
  _handleStringSensorSharingToggle(e) {
    const t = e && (this._config.string_groups?.length ?? 0) === 0 ? this._buildStringGroupsFromCurrentPanels() : this._config.string_groups ?? [];
    this._commit(
      this._normalizeEditorConfig({
        ...this._config,
        enable_string_sensor_sharing: e,
        string_groups: t
      })
    );
  }
  _updateStringGroupCount(e) {
    const t = this._parseNumberWithClamp(
      e,
      this._getStringGroupsForEditor().length || 1,
      1,
      Y
    ), r = this._getStringGroupsForEditor(), s = Array.from(
      { length: t },
      (n, o) => r[o] ?? this._makeDefaultStringGroup(o)
    );
    this._commitStringGroups(s);
  }
  _updateStringGroupValue(e, t, r) {
    const s = this._getStringGroupsForEditor().map((n, o) => o !== e ? n : {
      ...n,
      [t]: r
    });
    this._commitStringGroups(s);
  }
  _commitStringGroups(e) {
    this._commit(
      this._normalizeEditorConfig({
        ...this._config,
        enable_string_sensor_sharing: !0,
        string_groups: e
      })
    );
  }
  _updatePanelValue(e, t, r) {
    const s = this._config.panels.map((o, l) => {
      if (l !== e)
        return o;
      const a = { ...o, [t]: r };
      if (t === "power_entity") {
        const c = o.power_entity, p = typeof r == "string" ? r.trim() : "";
        if (p.length > 0) {
          const d = this._getEntityFriendlyName(p);
          d && this._shouldAutoRenamePanel(o.name, o.id, c) && (a.name = d);
        }
      }
      return t === "enabled" && r === !1 && (a.power_entity = void 0, a.energy_entity = void 0, a.show_energy = !1, a.inverter_status_entity = void 0, a.error_entity = void 0, a.advanced_metrics = void 0), a;
    }), n = this._normalizeEditorConfig({
      ...this._config,
      panels: s
    });
    this._commit(n);
  }
  _updatePanelAdvancedMetricValue(e, t, r) {
    const s = typeof r == "string" && r.trim().length > 0 ? r.trim() : void 0, n = this._config.panels.map((l, a) => {
      if (a !== e)
        return l;
      const c = {
        ...l.advanced_metrics ?? {}
      };
      return c[t] = s, Cr.every(
        (p) => !c[p.key] || c[p.key]?.trim().length === 0
      ) ? {
        ...l,
        advanced_metrics: void 0
      } : {
        ...l,
        advanced_metrics: c
      };
    }), o = this._normalizeEditorConfig({
      ...this._config,
      panels: n
    });
    this._commit(o);
  }
  _parseOptionalNumber(e, t, r) {
    if (e.trim() === "")
      return;
    const s = Number(e);
    if (Number.isFinite(s))
      return Math.min(Math.max(s, t), r);
  }
  _parseNumberWithClamp(e, t, r, s) {
    const n = Number(e);
    return Number.isFinite(n) ? Math.min(Math.max(n, r), s) : t;
  }
  _getAvailableSensorEntityIdsByUnit(e, t, r) {
    if (!this.hass)
      return [];
    const n = this._config.enable_string_sensor_sharing ?? !1 ? /* @__PURE__ */ new Set() : new Set(
      this._config.panels.map((a, c) => c === e ? void 0 : a[t]).filter((a) => typeof a == "string" && a.length > 0)
    ), o = this._config.panels[e]?.[t], l = [];
    for (const [a, c] of Object.entries(this.hass.states)) {
      const p = It(a, c);
      if (!p.startsWith("sensor."))
        continue;
      const d = c.attributes?.unit_of_measurement, h = typeof d == "string" ? d.trim().toLowerCase() : "";
      r(h, c) && (n.has(p) && p !== o || l.push(p));
    }
    return typeof o == "string" && o.length > 0 && !l.includes(o) && l.push(o), l.sort(q);
  }
  _getStringSensorEntityIdsByUnit(e, t) {
    if (!this.hass)
      return [];
    const r = [];
    for (const [s, n] of Object.entries(this.hass.states)) {
      const o = It(s, n);
      if (!o.startsWith("sensor."))
        continue;
      const l = n.attributes?.unit_of_measurement, a = typeof l == "string" ? l.trim().toLowerCase() : "";
      t(a, n) && r.push(o);
    }
    return typeof e == "string" && e.length > 0 && !r.includes(e) && r.push(e), r.sort(q);
  }
  _getAdvancedSensorEntityIds(e, t, r) {
    if (!this.hass)
      return [];
    const s = this._config.panels[e]?.advanced_metrics?.[t], n = [];
    for (const [o, l] of Object.entries(this.hass.states)) {
      const a = It(o, l);
      a.startsWith("sensor.") && r(l) && n.push(a);
    }
    return typeof s == "string" && s.length > 0 && !n.includes(s) && n.push(s), n.sort(q);
  }
  _getEntityFriendlyName(e) {
    const t = e?.trim();
    if (!this.hass || !t)
      return;
    const s = this.hass.states[t]?.attributes?.friendly_name;
    if (typeof s != "string")
      return;
    const n = s.trim();
    return n.length > 0 ? n : void 0;
  }
  _shouldAutoRenamePanel(e, t, r) {
    return Hn(
      e,
      t,
      r,
      (s) => this._getEntityFriendlyName(s)
    );
  }
  _commit(e) {
    this._config = e, Bn(this, e);
  }
  _isReorderOnlySync(e) {
    if (e.type !== this._getCardType() || e.rows !== this._config.rows || e.columns !== this._config.columns || e.panels.length !== this._config.panels.length)
      return !1;
    const t = this._toPanelSignatureMap(this._config.panels), r = this._toPanelSignatureMap(e.panels);
    if (t.size !== r.size)
      return !1;
    for (const [o, l] of t.entries())
      if (r.get(o) !== l)
        return !1;
    const s = this._config.panels.map((o) => o.id).join("|"), n = e.panels.map((o) => o.id).join("|");
    return s !== n;
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
gt.properties = {
  hass: { attribute: !1 },
  _config: { state: !0 },
  _autoFillPowerPrefix: { state: !0 },
  _autoFillEnergyPrefix: { state: !0 },
  _autoFillStatusPrefix: { state: !0 },
  _autoFillSortMode: { state: !0 },
  _autoFillInverterStatus: { state: !0 },
  _autoFillAdvancedTelemetry: { state: !0 },
  _autoFillResultMessage: { state: !0 }
}, gt.styles = Ot`
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
let mt = gt;
class Ps extends mt {
}
customElements.get("solar-panel-visualizer-card-editor") || customElements.define(
  "solar-panel-visualizer-card-editor",
  Ps
);
const Un = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SolarPanelVisualizerBaseCardEditor: mt,
  SolarPanelVisualizerCardEditor: Ps
}, Symbol.toStringTag, { value: "Module" })), Er = typeof navigator < "u" ? navigator.language : "en";
window.customCards = window.customCards || [];
window.customCards.push({
  type: kr,
  name: ht(Er, "meta.card_name"),
  description: ht(Er, "meta.card_description"),
  icon: "mdi:solar-panel",
  preview: !0
});
