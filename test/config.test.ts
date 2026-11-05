import { buildStubConfig, normalizeConfig, validateConfig } from "../src/config";

describe("normalizeConfig", () => {
  it("creates slots from rows and columns", () => {
    const config = normalizeConfig({
      rows: 2,
      columns: 4,
      panels: [{ id: "a", power_entity: "sensor.a" }],
    });

    expect(config.panels).toHaveLength(8);
    expect(config.panels[0].id).toBe("a");
    expect(config.panels[7].id).toBe("panel-8");
  });

  it("fills defaults for a stub config", () => {
    const stub = buildStubConfig(1, 2);

    expect(stub.type).toBe("custom:solar-panel-visualizer");
    expect(stub.panels).toHaveLength(2);
    expect(stub.theme_mode).toBe("auto");
    expect(stub.show_energy).toBe(true);
    expect(stub.max_card_width_px).toBe(980);
    expect(stub.enable_inverter_status).toBe(false);
    expect(stub.enable_string_sensor_sharing).toBe(false);
    expect(stub.string_groups).toEqual([]);
    expect(stub.show_inverter_status_on_tiles).toBe(false);
    expect(stub.inverter_fault_terms).toEqual([
      "fault",
      "alarm",
      "error",
      "failed",
      "failure",
      "trip",
    ]);
    expect(stub.inverter_working_terms).toEqual([
      "normal",
      "ok",
      "running",
      "waiting",
      "waiting for operation",
      "producing",
    ]);
    expect(stub.enable_array_checks).toBe(false);
    expect(stub.deviation_min_active_panels).toBe(3);
    expect(stub.deviation_min_runtime_minutes).toBe(20);
    expect(stub.deviation_dynamic_floor_w).toBe(30);
    expect(stub.deviation_history_hours).toBe(12);
    expect(stub.use_system_power_entity).toBe(false);
    expect(stub.system_power_entity).toBeUndefined();
    expect(stub.invert_system_power).toBe(false);
    expect(stub.use_system_energy_entity).toBe(false);
    expect(stub.system_energy_entity).toBeUndefined();
    expect(stub.enable_forecast_overlay).toBe(false);
    expect(stub.motion_enabled).toBe(true);
    expect(stub.motion_power_flow).toBe(true);
    expect(stub.motion_update_shimmer).toBe(true);
    expect(stub.motion_alert_ripple).toBe(true);
    expect(stub.show_custom_kpi).toBe(true);
    expect(stub.custom_kpi_title).toBe("Custom KPI");
    expect(stub.custom_kpi_entity).toBeUndefined();
    expect(stub.custom_kpi_decimals).toBe(0);
    expect(stub.invert_custom_kpi).toBe(false);
    expect(stub.limit_panel_width).toBe(false);
    expect(stub.panel_max_width_px).toBe(220);
    expect(stub.panels[0].deviation_derate_percent).toBe(100);
    expect(stub.panels[0].show_energy).toBe(false);
  });

  it("normalizes optional card sizing and panel rated power", () => {
    const config = normalizeConfig({
      rows: 2,
      columns: 3,
      max_card_width_px: 2600,
      max_card_height_px: 120,
      panel_max_width_px: 500,
      panels: [{ id: "p1", rated_power_w: 0, deviation_derate_percent: 0 }],
    });

    expect(config.max_card_width_px).toBe(2400);
    expect(config.max_card_height_px).toBe(300);
    expect(config.panel_max_width_px).toBe(320);
    expect(config.panels[0].rated_power_w).toBeUndefined();
    expect(config.panels[0].deviation_derate_percent).toBe(1);
  });

  it("allows string-sized panel rated power up to 10 kW", () => {
    const config = normalizeConfig({
      rows: 1,
      columns: 2,
      default_panel_rated_power_w: 12000,
      panels: [
        { id: "string-1", rated_power_w: 10000 },
        { id: "string-2", rated_power_w: 15000 },
      ],
    });

    expect(config.default_panel_rated_power_w).toBe(10000);
    expect(config.panels[0].rated_power_w).toBe(10000);
    expect(config.panels[1].rated_power_w).toBe(10000);
  });

  it("normalizes system energy override settings", () => {
    const config = normalizeConfig({
      use_system_power_entity: true,
      system_power_entity: " sensor.house_power ",
      invert_system_power: true,
      use_system_energy_entity: true,
      system_energy_entity: " sensor.daily_energy ",
      invert_custom_kpi: true,
      enable_forecast_overlay: true,
    });

    expect(config.use_system_power_entity).toBe(true);
    expect(config.system_power_entity).toBe("sensor.house_power");
    expect(config.invert_system_power).toBe(true);
    expect(config.use_system_energy_entity).toBe(true);
    expect(config.system_energy_entity).toBe("sensor.daily_energy");
    expect(config.invert_custom_kpi).toBe(true);
    expect(config.enable_forecast_overlay).toBe(true);
  });

  it("normalizes string sensor sharing as an optional additive setting", () => {
    const defaults = normalizeConfig({});
    const enabled = normalizeConfig({ enable_string_sensor_sharing: true });

    expect(defaults.enable_string_sensor_sharing).toBe(false);
    expect(defaults.string_groups).toEqual([]);
    expect(enabled.enable_string_sensor_sharing).toBe(true);
    expect(enabled.string_groups).toEqual([]);
  });

  it("generates one visual row per configured string group", () => {
    const config = normalizeConfig({
      rows: 2,
      columns: 3,
      enable_string_sensor_sharing: true,
      string_groups: [
        {
          id: "roof-a",
          name: "Roof A",
          panel_count: 3,
          power_entity: "sensor.string_a_power",
          energy_entity: "sensor.string_a_energy",
        },
        {
          id: "roof-b",
          name: "Roof B",
          panel_count: 2,
          power_entity: "sensor.string_b_power",
          energy_entity: "sensor.string_b_energy",
        },
      ],
      panels: [
        { id: "p1", rated_power_w: 400 },
        { id: "p2", deviation_derate_percent: 80 },
        { id: "p3", inverter_status_entity: "sensor.p3_status" },
        { id: "p4", advanced_metrics: { panel_voltage_entity: "sensor.p4_voltage" } },
      ],
    });

    expect(config.rows).toBe(2);
    expect(config.columns).toBe(3);
    expect(config.panels).toHaveLength(6);
    expect(config.panels[0]).toMatchObject({
      id: "p1",
      enabled: true,
      power_entity: "sensor.string_a_power",
      energy_entity: "sensor.string_a_energy",
      show_energy: true,
      rated_power_w: 400,
    });
    expect(config.panels[2].inverter_status_entity).toBe("sensor.p3_status");
    expect(config.panels[3]).toMatchObject({
      id: "p4",
      enabled: true,
      power_entity: "sensor.string_b_power",
      energy_entity: "sensor.string_b_energy",
    });
    expect(config.panels[3].advanced_metrics?.panel_voltage_entity).toBe("sensor.p4_voltage");
    expect(config.panels[5]).toMatchObject({
      id: "panel-6",
      enabled: false,
      power_entity: undefined,
      energy_entity: undefined,
    });
  });

  it("regenerates stale automatic string panel names when string layout changes", () => {
    const config = normalizeConfig({
      enable_string_sensor_sharing: true,
      string_groups: [
        {
          id: "string-1",
          name: "String 1",
          panel_count: 2,
          power_entity: "sensor.string_1_power",
        },
        {
          id: "string-2",
          name: "String 2",
          panel_count: 5,
          power_entity: "sensor.string_2_power",
        },
      ],
      panels: [
        { id: "p1", name: "String 2 Panel 3" },
        { id: "p2", name: "String 2 Panel 3" },
        { id: "p3", name: "String 2 Panel 3" },
        { id: "p4", name: "String 2 Panel 3" },
        { id: "p5", name: "String 2 Panel 3" },
        { id: "p6", name: "String 2 Panel 3" },
        { id: "p7", name: "String 2 Panel 3" },
      ],
    });

    expect(config.rows).toBe(2);
    expect(config.columns).toBe(5);
    expect(config.panels.map((panel) => panel.name)).toEqual([
      "String 1 Panel 1",
      "String 1 Panel 2",
      undefined,
      undefined,
      undefined,
      "String 2 Panel 1",
      "String 2 Panel 2",
      "String 2 Panel 3",
      "String 2 Panel 4",
      "String 2 Panel 5",
    ]);
    expect(config.panels[2].enabled).toBe(false);
    expect(config.panels[3].enabled).toBe(false);
    expect(config.panels[4].enabled).toBe(false);
  });

  it("preserves custom panel names in string-generated layouts", () => {
    const config = normalizeConfig({
      enable_string_sensor_sharing: true,
      string_groups: [
        {
          id: "string-1",
          name: "String 1",
          panel_count: 2,
          power_entity: "sensor.string_1_power",
        },
      ],
      panels: [
        { id: "p1", name: "Garage east" },
        { id: "p2", name: "String 1 Panel custom" },
      ],
    });

    expect(config.panels.map((panel) => panel.name)).toEqual([
      "Garage east",
      "String 1 Panel custom",
    ]);
  });

  it("converts a default 3x3 panel grid into a 2-row string layout cleanly", () => {
    const config = normalizeConfig({
      rows: 3,
      columns: 3,
      enable_string_sensor_sharing: true,
      string_groups: [
        {
          id: "string-1",
          name: "String 1",
          panel_count: 5,
          power_entity: "sensor.string_1_power",
        },
        {
          id: "string-2",
          name: "String 2",
          panel_count: 12,
          power_entity: "sensor.string_2_power",
        },
      ],
      panels: [
        { id: "p1", name: "Panel 1", rated_power_w: 410 },
        { id: "p2", name: "Panel 2", deviation_derate_percent: 90 },
        { id: "p3", name: "Panel 3", inverter_status_entity: "sensor.p3_status" },
        { id: "p4", name: "Panel 4", advanced_metrics: { panel_voltage_entity: "sensor.p4_voltage" } },
        { id: "p5", name: "Panel 5" },
        { id: "p6", name: "Panel 6" },
        { id: "p7", name: "Panel 7" },
        { id: "p8", name: "Panel 8" },
        { id: "p9", name: "Panel 9" },
      ],
    });

    expect(config.rows).toBe(2);
    expect(config.columns).toBe(12);
    expect(config.panels).toHaveLength(24);
    expect(config.panels.map((panel) => panel.name)).toEqual([
      "String 1 Panel 1",
      "String 1 Panel 2",
      "String 1 Panel 3",
      "String 1 Panel 4",
      "String 1 Panel 5",
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      "String 2 Panel 1",
      "String 2 Panel 2",
      "String 2 Panel 3",
      "String 2 Panel 4",
      "String 2 Panel 5",
      "String 2 Panel 6",
      "String 2 Panel 7",
      "String 2 Panel 8",
      "String 2 Panel 9",
      "String 2 Panel 10",
      "String 2 Panel 11",
      "String 2 Panel 12",
    ]);
    expect(config.panels.slice(0, 5).map((panel) => panel.enabled)).toEqual([
      true,
      true,
      true,
      true,
      true,
    ]);
    expect(config.panels.slice(5, 12).map((panel) => panel.enabled)).toEqual(
      Array.from({ length: 7 }, () => false),
    );
    expect(config.panels.slice(12).map((panel) => panel.enabled)).toEqual(
      Array.from({ length: 12 }, () => true),
    );
    expect(config.panels[0].rated_power_w).toBe(410);
    expect(config.panels[1].deviation_derate_percent).toBe(90);
    expect(config.panels[2].inverter_status_entity).toBe("sensor.p3_status");
    expect(config.panels[12].advanced_metrics?.panel_voltage_entity).toBe("sensor.p4_voltage");
  });

  it("keeps existing manual panels unchanged when no string groups are saved", () => {
    const config = normalizeConfig({
      rows: 1,
      columns: 2,
      enable_string_sensor_sharing: true,
      panels: [
        { id: "p1", power_entity: "sensor.shared" },
        { id: "p2", power_entity: "sensor.shared" },
      ],
    });

    expect(config.rows).toBe(1);
    expect(config.columns).toBe(2);
    expect(config.panels.map((panel) => panel.power_entity)).toEqual([
      "sensor.shared",
      "sensor.shared",
    ]);
  });

  it("allows row and column layouts above the old 12-slot limit", () => {
    const config = normalizeConfig({
      rows: 20,
      columns: 25,
    });
    const clamped = normalizeConfig({
      rows: 40,
      columns: 50,
    });

    expect(config.rows).toBe(20);
    expect(config.columns).toBe(25);
    expect(clamped.rows).toBe(30);
    expect(clamped.columns).toBe(30);
  });

  it("normalizes motion settings on the main card", () => {
    const defaults = normalizeConfig({});
    const disabled = normalizeConfig({
      motion_enabled: false,
      motion_power_flow: false,
      motion_update_shimmer: false,
      motion_alert_ripple: false,
    });

    expect(defaults.motion_enabled).toBe(true);
    expect(defaults.motion_power_flow).toBe(true);
    expect(defaults.motion_update_shimmer).toBe(true);
    expect(defaults.motion_alert_ripple).toBe(true);
    expect(disabled.motion_enabled).toBe(false);
    expect(disabled.motion_power_flow).toBe(false);
    expect(disabled.motion_update_shimmer).toBe(false);
    expect(disabled.motion_alert_ripple).toBe(false);
  });

  it("allows clearing custom KPI heading text", () => {
    const config = normalizeConfig({
      custom_kpi_title: "   ",
    });

    expect(config.custom_kpi_title).toBe("");
  });

  it("normalizes custom KPI decimals with default and clamping", () => {
    expect(normalizeConfig({}).custom_kpi_decimals).toBe(0);
    expect(
      normalizeConfig({
        custom_kpi_decimals: -2,
      }).custom_kpi_decimals,
    ).toBe(0);
    expect(
      normalizeConfig({
        custom_kpi_decimals: 8,
      }).custom_kpi_decimals,
    ).toBe(4);
  });

  it("normalizes theme mode with default and fallback", () => {
    expect(normalizeConfig({}).theme_mode).toBe("auto");
    expect(normalizeConfig({ theme_mode: "dark" }).theme_mode).toBe("dark");
    expect(normalizeConfig({ theme_mode: "light" }).theme_mode).toBe("light");
    expect(normalizeConfig({ theme_mode: "blue" as never }).theme_mode).toBe("auto");
  });

  it("accepts minimal config and applies defaults for editor-first setup", () => {
    const minimal = { type: "custom:solar-panel-visualizer" };
    const errors = validateConfig(minimal);
    const normalized = normalizeConfig(minimal);

    expect(errors).toHaveLength(0);
    expect(normalized.rows).toBe(2);
    expect(normalized.columns).toBe(3);
    expect(normalized.panels).toHaveLength(6);
  });

  it("validates custom KPI decimals range", () => {
    const errors = validateConfig({
      custom_kpi_decimals: 7,
    });

    expect(errors).toContain("`custom_kpi_decimals` must be between 0 and 4.");
  });

  it("validates panel width cap range", () => {
    const errors = validateConfig({
      panel_max_width_px: 400,
    });

    expect(errors).toContain("`panel_max_width_px` must be between 120 and 320.");
  });

  it("validates panel deviation derate range", () => {
    const errors = validateConfig({
      panels: [
        {
          id: "p1",
          deviation_derate_percent: 101,
        },
      ],
    });

    expect(errors).toContain(
      "`panels[0].deviation_derate_percent` must be between 1 and 100.",
    );
  });

  it("preserves grid_options when editing", () => {
    const config = normalizeConfig({
      type: "custom:solar-panel-visualizer",
      grid_options: {
        columns: "full",
        rows: "auto",
      },
    });

    expect(config.grid_options).toEqual({
      columns: "full",
      rows: "auto",
    });
  });

  it("normalizes intelligent deviation guardrails", () => {
    const config = normalizeConfig({
      deviation_absolute_w_threshold: -1,
      deviation_min_active_panels: 1,
      deviation_min_samples: 0,
      deviation_min_runtime_minutes: -5,
      deviation_smoothing_minutes: -2,
      deviation_dynamic_floor_w: -3,
      deviation_history_hours: 900,
    });

    expect(config.deviation_absolute_w_threshold).toBe(0);
    expect(config.deviation_min_active_panels).toBe(2);
    expect(config.deviation_min_samples).toBe(1);
    expect(config.deviation_min_runtime_minutes).toBe(0);
    expect(config.deviation_smoothing_minutes).toBe(0);
    expect(config.deviation_dynamic_floor_w).toBe(0);
    expect(config.deviation_history_hours).toBe(168);
  });

  it("maps legacy error_entity to inverter_status_entity", () => {
    const config = normalizeConfig({
      rows: 1,
      columns: 1,
      panels: [
        {
          id: "p1",
          power_entity: "sensor.p1_power",
          error_entity: "sensor.p1_status",
        },
      ],
    });

    expect(config.panels[0].inverter_status_entity).toBe("sensor.p1_status");
  });

  it("clears panel sensors when panel is disabled", () => {
    const config = normalizeConfig({
      rows: 1,
      columns: 1,
      panels: [
        {
          id: "p1",
          enabled: false,
          power_entity: "sensor.p1_power",
          energy_entity: "sensor.p1_energy",
          inverter_status_entity: "sensor.p1_status",
          error_entity: "sensor.p1_legacy_error",
          advanced_metrics: {
            inverter_temp_entity: "sensor.p1_temp",
          },
        },
      ],
    });

    expect(config.panels[0].enabled).toBe(false);
    expect(config.panels[0].power_entity).toBeUndefined();
    expect(config.panels[0].energy_entity).toBeUndefined();
    expect(config.panels[0].inverter_status_entity).toBeUndefined();
    expect(config.panels[0].error_entity).toBeUndefined();
    expect(config.panels[0].advanced_metrics).toBeUndefined();
  });

  it("normalizes advanced telemetry mappings on panels", () => {
    const config = normalizeConfig({
      rows: 1,
      columns: 1,
      panels: [
        {
          id: "p1",
          advanced_metrics: {
            inverter_ac_power_entity: " sensor.p1_ac_power ",
            panel_voltage_entity: "sensor.p1_voltage",
            panel_current_entity: "",
          },
        },
      ],
    });

    expect(config.panels[0].advanced_metrics).toEqual({
      inverter_ac_power_entity: "sensor.p1_ac_power",
      inverter_ac_voltage_entity: undefined,
      inverter_ac_current_entity: undefined,
      inverter_temp_entity: undefined,
      panel_current_entity: undefined,
      panel_voltage_entity: "sensor.p1_voltage",
      panel_power_entity: undefined,
    });
  });

  it("normalizes inverter fault terms from comma-separated text", () => {
    const config = normalizeConfig({
      inverter_fault_terms: " fault,ALARM, error , fault ",
      inverter_working_terms: " normal, ok, waiting for operation ",
    });

    expect(config.inverter_fault_terms).toEqual(["fault", "alarm", "error"]);
    expect(config.inverter_working_terms).toEqual([
      "normal",
      "ok",
      "waiting for operation",
    ]);
  });
});
