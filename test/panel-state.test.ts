import { normalizeConfig } from "../src/config";
import { deriveArrayState } from "../src/panel-state";
import type { HomeAssistant, PowerSample } from "../src/types";

const createHass = (states: HomeAssistant["states"]): HomeAssistant => ({
  states,
  locale: { language: "en" },
});

const historyFromValues = (
  entityId: string,
  values: number[],
  nowMs: number,
  stepMinutes = 5,
): Record<string, PowerSample[]> => ({
  [entityId]: values.map((value, index) => ({
    value,
    ts: nowMs - (values.length - index) * stepMinutes * 60_000,
  })),
});

describe("deriveArrayState", () => {
  it("splits duplicate string power sensors by rated power when sharing is enabled", () => {
    const config = normalizeConfig({
      rows: 1,
      columns: 2,
      enable_string_sensor_sharing: true,
      panels: [
        {
          id: "p1",
          name: "North panel",
          power_entity: "sensor.string_power",
          rated_power_w: 400,
        },
        {
          id: "p2",
          name: "South panel",
          power_entity: "sensor.string_power",
          rated_power_w: 600,
        },
      ],
    });
    const hass = createHass({
      "sensor.string_power": {
        entity_id: "sensor.string_power",
        state: "1000",
        attributes: {
          unit_of_measurement: "W",
          friendly_name: "DC Power String 1",
        },
      },
    });

    const derived = deriveArrayState(config, hass);

    expect(derived.totalPower).toBe(1000);
    expect(derived.panels[0].power).toBe(400);
    expect(derived.panels[1].power).toBe(600);
    expect(derived.panels[0].powerShareFactor).toBeCloseTo(0.4);
    expect(derived.panels[1].powerShareFactor).toBeCloseTo(0.6);
    expect(derived.panels[0].stringGroupLabel).toBe("String 1");
    expect(derived.panels[0].stringPowerSourceName).toBe("DC Power String 1");
    expect(derived.panels[0].stringPowerSharePercent).toBeCloseTo(40);
  });

  it("falls back to equal split when a shared string group is missing rated power", () => {
    const config = normalizeConfig({
      rows: 1,
      columns: 2,
      enable_string_sensor_sharing: true,
      panels: [
        { id: "p1", power_entity: "sensor.string_power", rated_power_w: 500 },
        { id: "p2", power_entity: "sensor.string_power" },
      ],
    });
    const hass = createHass({
      "sensor.string_power": {
        entity_id: "sensor.string_power",
        state: "900",
        attributes: { unit_of_measurement: "W" },
      },
    });

    const derived = deriveArrayState(config, hass);

    expect(derived.totalPower).toBe(900);
    expect(derived.panels[0].power).toBe(450);
    expect(derived.panels[1].power).toBe(450);
  });

  it("splits duplicate string energy sensors and keeps the total undoubled", () => {
    const config = normalizeConfig({
      rows: 1,
      columns: 2,
      enable_string_sensor_sharing: true,
      panels: [
        {
          id: "p1",
          power_entity: "sensor.p1",
          energy_entity: "sensor.string_energy",
          show_energy: true,
          rated_power_w: 300,
        },
        {
          id: "p2",
          power_entity: "sensor.p2",
          energy_entity: "sensor.string_energy",
          show_energy: true,
          rated_power_w: 700,
        },
      ],
    });
    const hass = createHass({
      "sensor.p1": {
        entity_id: "sensor.p1",
        state: "300",
        attributes: { unit_of_measurement: "W" },
      },
      "sensor.p2": {
        entity_id: "sensor.p2",
        state: "700",
        attributes: { unit_of_measurement: "W" },
      },
      "sensor.string_energy": {
        entity_id: "sensor.string_energy",
        state: "10",
        attributes: { unit_of_measurement: "kWh" },
      },
    });

    const derived = deriveArrayState(config, hass);

    expect(derived.totalEnergy).toBe(10);
    expect(derived.panels[0].energy).toBe(3);
    expect(derived.panels[1].energy).toBe(7);
    expect(derived.panels[0].energyShareFactor).toBeCloseTo(0.3);
    expect(derived.panels[1].energyShareFactor).toBeCloseTo(0.7);
  });

  it("keeps duplicate sensors counted per panel when string sharing is off", () => {
    const config = normalizeConfig({
      rows: 1,
      columns: 2,
      panels: [
        { id: "p1", power_entity: "sensor.string_power" },
        { id: "p2", power_entity: "sensor.string_power" },
      ],
    });
    const hass = createHass({
      "sensor.string_power": {
        entity_id: "sensor.string_power",
        state: "1000",
        attributes: { unit_of_measurement: "W" },
      },
    });

    const derived = deriveArrayState(config, hass);

    expect(derived.totalPower).toBe(2000);
    expect(derived.panels[0].power).toBe(1000);
    expect(derived.panels[1].power).toBe(1000);
    expect(derived.panels[0].stringGroupLabel).toBeUndefined();
  });

  it("flags a deviating panel with target-based checks", () => {
    const nowMs = Date.now();
    const config = normalizeConfig({
      rows: 1,
      columns: 3,
      deviation_threshold_percent: 15,
      deviation_absolute_w_threshold: 50,
      deviation_min_active_panels: 3,
      deviation_min_samples: 3,
      deviation_min_runtime_minutes: 15,
      deviation_dynamic_floor_w: 0,
      default_panel_rated_power_w: 500,
      panels: [
        { id: "p1", power_entity: "sensor.p1" },
        { id: "p2", power_entity: "sensor.p2" },
        { id: "p3", power_entity: "sensor.p3" },
      ],
    });

    const hass = createHass({
      "sensor.p1": {
        entity_id: "sensor.p1",
        state: "420",
        attributes: { unit_of_measurement: "W" },
      },
      "sensor.p2": {
        entity_id: "sensor.p2",
        state: "415",
        attributes: { unit_of_measurement: "W" },
      },
      "sensor.p3": {
        entity_id: "sensor.p3",
        state: "260",
        attributes: { unit_of_measurement: "W" },
      },
    });

    const history = {
      ...historyFromValues("sensor.p1", [430, 425, 420], nowMs),
      ...historyFromValues("sensor.p2", [420, 418, 415], nowMs),
      ...historyFromValues("sensor.p3", [300, 280, 260], nowMs),
    };

    const derived = deriveArrayState(config, hass, { nowMs, historyByEntityId: history });
    expect(derived.deviationReady).toBe(true);
    expect(derived.deviationCount).toBe(1);
    expect(derived.panels[2].status).toBe("deviation");
  });

  it("does not flag naturally shaded panels when derate aligns expected output", () => {
    const nowMs = Date.now();
    const config = normalizeConfig({
      rows: 1,
      columns: 3,
      deviation_threshold_percent: 15,
      deviation_absolute_w_threshold: 50,
      deviation_min_active_panels: 2,
      deviation_min_samples: 3,
      deviation_min_runtime_minutes: 15,
      deviation_dynamic_floor_w: 0,
      default_panel_rated_power_w: 500,
      panels: [
        { id: "p1", power_entity: "sensor.p1" },
        { id: "p2", power_entity: "sensor.p2" },
        { id: "p3", power_entity: "sensor.p3", deviation_derate_percent: 60 },
      ],
    });

    const hass = createHass({
      "sensor.p1": {
        entity_id: "sensor.p1",
        state: "420",
        attributes: { unit_of_measurement: "W" },
      },
      "sensor.p2": {
        entity_id: "sensor.p2",
        state: "415",
        attributes: { unit_of_measurement: "W" },
      },
      "sensor.p3": {
        entity_id: "sensor.p3",
        state: "260",
        attributes: { unit_of_measurement: "W" },
      },
    });

    const history = {
      ...historyFromValues("sensor.p1", [430, 425, 420], nowMs),
      ...historyFromValues("sensor.p2", [420, 418, 415], nowMs),
      ...historyFromValues("sensor.p3", [275, 268, 260], nowMs),
    };

    const derived = deriveArrayState(config, hass, { nowMs, historyByEntityId: history });
    expect(derived.deviationReady).toBe(true);
    expect(derived.deviationCount).toBe(0);
    expect(derived.panels[2].status).toBe("normal");
  });

  it("requires enough non-derated panels to start deviation checks", () => {
    const nowMs = Date.now();
    const config = normalizeConfig({
      rows: 1,
      columns: 3,
      deviation_min_active_panels: 3,
      deviation_min_samples: 1,
      deviation_min_runtime_minutes: 0,
      deviation_dynamic_floor_w: 0,
      default_panel_rated_power_w: 500,
      panels: [
        { id: "p1", power_entity: "sensor.p1" },
        { id: "p2", power_entity: "sensor.p2" },
        { id: "p3", power_entity: "sensor.p3", deviation_derate_percent: 50 },
      ],
    });

    const hass = createHass({
      "sensor.p1": {
        entity_id: "sensor.p1",
        state: "420",
        attributes: { unit_of_measurement: "W" },
      },
      "sensor.p2": {
        entity_id: "sensor.p2",
        state: "415",
        attributes: { unit_of_measurement: "W" },
      },
      "sensor.p3": {
        entity_id: "sensor.p3",
        state: "200",
        attributes: { unit_of_measurement: "W" },
      },
    });

    const history = {
      ...historyFromValues("sensor.p1", [420], nowMs),
      ...historyFromValues("sensor.p2", [415], nowMs),
      ...historyFromValues("sensor.p3", [200], nowMs),
    };

    const derived = deriveArrayState(config, hass, { nowMs, historyByEntityId: history });
    expect(derived.deviationReady).toBe(false);
    expect(derived.deviationSuppressedReason).toContain("non-derated active rated panels");
  });

  it("keeps performance percent based on actual rated power when derate is used", () => {
    const nowMs = Date.now();
    const config = normalizeConfig({
      rows: 1,
      columns: 1,
      deviation_min_active_panels: 1,
      deviation_min_samples: 1,
      deviation_min_runtime_minutes: 0,
      deviation_dynamic_floor_w: 0,
      default_panel_rated_power_w: 500,
      panels: [{ id: "p1", power_entity: "sensor.p1", deviation_derate_percent: 50 }],
    });

    const hass = createHass({
      "sensor.p1": {
        entity_id: "sensor.p1",
        state: "250",
        attributes: { unit_of_measurement: "W" },
      },
    });

    const history = {
      ...historyFromValues("sensor.p1", [250], nowMs),
    };

    const derived = deriveArrayState(config, hass, { nowMs, historyByEntityId: history });
    expect(derived.panels[0].performancePercent).toBe(50);
  });

  it("can still flag a derated panel when it falls below its derated target", () => {
    const nowMs = Date.now();
    const config = normalizeConfig({
      rows: 1,
      columns: 3,
      deviation_threshold_percent: 15,
      deviation_absolute_w_threshold: 50,
      deviation_min_active_panels: 2,
      deviation_min_samples: 3,
      deviation_min_runtime_minutes: 15,
      deviation_dynamic_floor_w: 0,
      default_panel_rated_power_w: 500,
      panels: [
        { id: "p1", power_entity: "sensor.p1" },
        { id: "p2", power_entity: "sensor.p2" },
        { id: "p3", power_entity: "sensor.p3", deviation_derate_percent: 50 },
      ],
    });

    const hass = createHass({
      "sensor.p1": {
        entity_id: "sensor.p1",
        state: "420",
        attributes: { unit_of_measurement: "W" },
      },
      "sensor.p2": {
        entity_id: "sensor.p2",
        state: "410",
        attributes: { unit_of_measurement: "W" },
      },
      "sensor.p3": {
        entity_id: "sensor.p3",
        state: "90",
        attributes: { unit_of_measurement: "W" },
      },
    });

    const history = {
      ...historyFromValues("sensor.p1", [430, 425, 420], nowMs),
      ...historyFromValues("sensor.p2", [420, 415, 410], nowMs),
      ...historyFromValues("sensor.p3", [120, 100, 90], nowMs),
    };

    const derived = deriveArrayState(config, hass, { nowMs, historyByEntityId: history });
    expect(derived.deviationReady).toBe(true);
    expect(derived.panels[2].status).toBe("deviation");
  });

  it("suppresses deviation when too few active rated panels are available", () => {
    const config = normalizeConfig({
      rows: 1,
      columns: 2,
      deviation_min_active_panels: 3,
      default_panel_rated_power_w: 500,
      panels: [
        { id: "p1", power_entity: "sensor.p1" },
        { id: "p2", power_entity: "sensor.p2" },
      ],
    });

    const hass = createHass({
      "sensor.p1": {
        entity_id: "sensor.p1",
        state: "440",
        attributes: { unit_of_measurement: "W" },
      },
      "sensor.p2": {
        entity_id: "sensor.p2",
        state: "430",
        attributes: { unit_of_measurement: "W" },
      },
    });

    const derived = deriveArrayState(config, hass, { nowMs: Date.now() });
    expect(derived.deviationReady).toBe(false);
    expect(derived.deviationSuppressedReason).toContain("at least 3");
  });

  it("suppresses deviation during low-light dynamic floor periods", () => {
    const nowMs = Date.now();
    const config = normalizeConfig({
      rows: 1,
      columns: 3,
      deviation_min_samples: 1,
      deviation_min_runtime_minutes: 0,
      deviation_dynamic_floor_w: 50,
      default_panel_rated_power_w: 500,
      panels: [
        { id: "p1", power_entity: "sensor.p1" },
        { id: "p2", power_entity: "sensor.p2" },
        { id: "p3", power_entity: "sensor.p3" },
      ],
    });

    const hass = createHass({
      "sensor.p1": {
        entity_id: "sensor.p1",
        state: "3",
        attributes: { unit_of_measurement: "W" },
      },
      "sensor.p2": {
        entity_id: "sensor.p2",
        state: "4",
        attributes: { unit_of_measurement: "W" },
      },
      "sensor.p3": {
        entity_id: "sensor.p3",
        state: "2",
        attributes: { unit_of_measurement: "W" },
      },
    });

    const history = {
      ...historyFromValues("sensor.p1", [3], nowMs),
      ...historyFromValues("sensor.p2", [4], nowMs),
      ...historyFromValues("sensor.p3", [2], nowMs),
    };

    const derived = deriveArrayState(config, hass, { nowMs, historyByEntityId: history });
    expect(derived.deviationReady).toBe(false);
    expect(derived.deviationCount).toBe(0);
  });

  it("marks panels as error when inverter status matches fault terms", () => {
    const config = normalizeConfig({
      rows: 1,
      columns: 1,
      enable_inverter_status: true,
      inverter_fault_terms: ["fault", "alarm"],
      panels: [
        {
          id: "p1",
          power_entity: "sensor.p1",
          inverter_status_entity: "sensor.p1_status",
        },
      ],
    });

    const hass = createHass({
      "sensor.p1": {
        entity_id: "sensor.p1",
        state: "380",
        attributes: { unit_of_measurement: "W" },
      },
      "sensor.p1_status": {
        entity_id: "sensor.p1_status",
        state: "Waiting - Grid Fault",
        attributes: {},
      },
    });

    const derived = deriveArrayState(config, hass);
    expect(derived.errorCount).toBe(1);
    expect(derived.panels[0].status).toBe("error");
    expect(derived.panels[0].inverterStatusDisplay).toBe("Waiting - Grid Fault");
  });

  it("marks panels as error when a one-to-one panel status sensor matches fault terms", () => {
    const config = normalizeConfig({
      rows: 1,
      columns: 1,
      enable_inverter_status: true,
      inverter_fault_terms: ["fault", "alarm"],
      panels: [
        {
          id: "p1",
          power_entity: "sensor.power_1_0_1",
          inverter_status_entity: "sensor.status_1_0_1",
        },
      ],
    });

    const hass = createHass({
      "sensor.power_1_0_1": {
        entity_id: "sensor.power_1_0_1",
        state: "380",
        attributes: { unit_of_measurement: "W" },
      },
      "sensor.status_1_0_1": {
        entity_id: "sensor.status_1_0_1",
        state: "Panel Fault",
        attributes: {},
      },
    });

    const derived = deriveArrayState(config, hass);
    expect(derived.errorCount).toBe(1);
    expect(derived.panels[0].status).toBe("error");
    expect(derived.panels[0].inverterStatusDisplay).toBe("Panel Fault");
  });

  it("keeps panel normal when inverter status does not match fault terms", () => {
    const config = normalizeConfig({
      rows: 1,
      columns: 1,
      enable_inverter_status: true,
      inverter_fault_terms: ["fault", "alarm"],
      panels: [
        {
          id: "p1",
          power_entity: "sensor.p1",
          inverter_status_entity: "sensor.p1_status",
        },
      ],
    });

    const hass = createHass({
      "sensor.p1": {
        entity_id: "sensor.p1",
        state: "380",
        attributes: { unit_of_measurement: "W" },
      },
      "sensor.p1_status": {
        entity_id: "sensor.p1_status",
        state: "Waiting for operation",
        attributes: {},
      },
    });

    const derived = deriveArrayState(config, hass);
    expect(derived.errorCount).toBe(0);
    expect(derived.panels[0].status).toBe("normal");
    expect(derived.panels[0].inverterStatusDisplay).toBe("Waiting for operation");
  });

  it("treats a plain Waiting status as a default working state", () => {
    const config = normalizeConfig({
      rows: 1,
      columns: 1,
      enable_inverter_status: true,
      panels: [
        {
          id: "p1",
          power_entity: "sensor.p1",
          inverter_status_entity: "sensor.p1_status",
        },
      ],
    });

    const hass = createHass({
      "sensor.p1": {
        entity_id: "sensor.p1",
        state: "380",
        attributes: { unit_of_measurement: "W" },
      },
      "sensor.p1_status": {
        entity_id: "sensor.p1_status",
        state: "Waiting",
        attributes: {},
      },
    });

    const derived = deriveArrayState(config, hass);
    expect(derived.errorCount).toBe(0);
    expect(derived.inverterCount).toBe(0);
    expect(derived.panels[0].status).toBe("normal");
    expect(derived.panels[0].inverterWorkingMatched).toBe(true);
  });

  it("marks panel as inverter when inverter status does not match working terms", () => {
    const config = normalizeConfig({
      rows: 1,
      columns: 1,
      enable_inverter_status: true,
      inverter_fault_terms: ["fault", "alarm"],
      inverter_working_terms: ["normal", "running"],
      panels: [
        {
          id: "p1",
          power_entity: "sensor.p1",
          inverter_status_entity: "sensor.p1_status",
        },
      ],
    });

    const hass = createHass({
      "sensor.p1": {
        entity_id: "sensor.p1",
        state: "380",
        attributes: { unit_of_measurement: "W" },
      },
      "sensor.p1_status": {
        entity_id: "sensor.p1_status",
        state: "Waiting for operation",
        attributes: {},
      },
    });

    const derived = deriveArrayState(config, hass);
    expect(derived.inverterCount).toBe(1);
    expect(derived.panels[0].status).toBe("inverter");
    expect(derived.panels[0].reason).toContain("does not match configured working terms");
  });

  it("uses whole-word inverter matching and ignores partial token matches", () => {
    const config = normalizeConfig({
      rows: 1,
      columns: 1,
      enable_inverter_status: true,
      inverter_fault_terms: ["rr"],
      inverter_working_terms: ["n"],
      panels: [
        {
          id: "p1",
          power_entity: "sensor.p1",
          inverter_status_entity: "sensor.p1_status",
        },
      ],
    });

    const hass = createHass({
      "sensor.p1": {
        entity_id: "sensor.p1",
        state: "380",
        attributes: { unit_of_measurement: "W" },
      },
      "sensor.p1_status": {
        entity_id: "sensor.p1_status",
        state: "Normal",
        attributes: {},
      },
    });

    const derived = deriveArrayState(config, hass);
    expect(derived.panels[0].inverterFaultMatched).toBe(false);
    expect(derived.panels[0].inverterWorkingMatched).toBe(false);
    expect(derived.panels[0].status).toBe("inverter");
  });

  it("handles missing entities without crashing", () => {
    const config = normalizeConfig({
      rows: 1,
      columns: 1,
      panels: [{ id: "p1", power_entity: "sensor.missing" }],
    });

    const derived = deriveArrayState(config, createHass({}));
    expect(derived.offlineCount).toBe(1);
    expect(derived.panels[0].status).toBe("offline");
  });

  it("uses default rated panel power to calculate performance", () => {
    const config = normalizeConfig({
      rows: 1,
      columns: 1,
      default_panel_rated_power_w: 500,
      panels: [{ id: "p1", power_entity: "sensor.p1" }],
    });

    const hass = createHass({
      "sensor.p1": {
        entity_id: "sensor.p1",
        state: "450",
        attributes: { unit_of_measurement: "W" },
      },
    });

    const derived = deriveArrayState(config, hass);
    expect(derived.panels[0].ratedPowerW).toBe(500);
    expect(derived.panels[0].performancePercent).toBe(90);
  });

  it("uses a 3-step production gradient scaled by rated power", () => {
    const config = normalizeConfig({
      rows: 1,
      columns: 1,
      colors: {
        production_start: "#000000",
        production_mid: "#808080",
        production_end: "#ffffff",
      },
      panels: [{ id: "p1", power_entity: "sensor.p1", rated_power_w: 100 }],
    });

    const hass = createHass({
      "sensor.p1": {
        entity_id: "sensor.p1",
        state: "25",
        attributes: { unit_of_measurement: "W" },
      },
    });

    const derived = deriveArrayState(config, hass);
    expect(derived.panels[0].accentColor).toBe("rgb(64, 64, 64)");
  });

  it("does not show unavailable energy text when no energy sensor is configured", () => {
    const config = normalizeConfig({
      rows: 1,
      columns: 1,
      panels: [{ id: "p1", power_entity: "sensor.p1" }],
    });

    const hass = createHass({
      "sensor.p1": {
        entity_id: "sensor.p1",
        state: "50",
        attributes: { unit_of_measurement: "W" },
      },
    });

    const derived = deriveArrayState(config, hass);
    expect(derived.panels[0].energyDisplay).toBeUndefined();
  });

  it("hides panel energy text when show_energy is disabled", () => {
    const config = normalizeConfig({
      rows: 1,
      columns: 1,
      panels: [
        {
          id: "p1",
          power_entity: "sensor.p1_power",
          energy_entity: "sensor.p1_energy",
          show_energy: false,
        },
      ],
    });

    const hass = createHass({
      "sensor.p1_power": {
        entity_id: "sensor.p1_power",
        state: "50",
        attributes: { unit_of_measurement: "W" },
      },
      "sensor.p1_energy": {
        entity_id: "sensor.p1_energy",
        state: "1.23",
        attributes: { unit_of_measurement: "kWh" },
      },
    });

    const derived = deriveArrayState(config, hass);
    expect(derived.panels[0].energyDisplay).toBeUndefined();
  });

  it("keeps disabled panel slots as hidden placeholders", () => {
    const config = normalizeConfig({
      rows: 1,
      columns: 2,
      panels: [
        { id: "p1", power_entity: "sensor.p1", enabled: false },
        { id: "p2", power_entity: "sensor.p2" },
      ],
    });

    const hass = createHass({
      "sensor.p2": {
        entity_id: "sensor.p2",
        state: "300",
        attributes: { unit_of_measurement: "W" },
      },
    });

    const derived = deriveArrayState(config, hass);
    expect(derived.disabledCount).toBe(1);
    expect(derived.panels[0].hiddenSlot).toBe(true);
    expect(derived.panels[1].hiddenSlot).toBe(false);
  });
});
