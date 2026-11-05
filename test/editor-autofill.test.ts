import { describe, expect, it } from "vitest";
import {
  applyAutoPopulateFriendlyNames,
  autoPopulateAdvancedTelemetry,
  autoPopulateEnergyEntitiesByPowerAnchor,
  autoPopulateInverterStatusEntities,
  autoPopulatePanelEntities,
  shouldAutoRenamePanelName,
  sortSensorsForAutoPopulate,
} from "../src/editor-autofill";
import type { HassEntity, PanelConfig } from "../src/types";

const makeSensor = (
  entityId: string,
  unit: string,
  friendlyName?: string,
  attributes: Record<string, unknown> = {},
): HassEntity => ({
  entity_id: entityId,
  state: "0",
  attributes: {
    ...attributes,
    unit_of_measurement: unit,
    friendly_name: friendlyName,
  },
});

describe("autoPopulateAdvancedTelemetry", () => {
  it("reuses one inverter temperature sensor for panels with the same serial group", () => {
    const panels: PanelConfig[] = [
      {
        id: "panel-1",
        power_entity: "sensor.sds_mppt_map_mppt1_power_device_30m3y10",
      },
      {
        id: "panel-2",
        power_entity: "sensor.sds_mppt_map_mppt2_power_device_30m3y10",
      },
      {
        id: "panel-3",
        power_entity: "sensor.sds_mppt_map_mppt1_power_device_40m3y20",
      },
    ];
    const states: Record<string, HassEntity> = {
      "sensor.sds_mppt_map_mppt1_power_device_30m3y10": makeSensor(
        "sensor.sds_mppt_map_mppt1_power_device_30m3y10",
        "W",
        "MPPT 1 Power",
      ),
      "sensor.sds_mppt_map_mppt2_power_device_30m3y10": makeSensor(
        "sensor.sds_mppt_map_mppt2_power_device_30m3y10",
        "W",
        "MPPT 2 Power",
      ),
      "sensor.sds_mppt_map_mppt1_power_device_40m3y20": makeSensor(
        "sensor.sds_mppt_map_mppt1_power_device_40m3y20",
        "W",
        "MPPT 1 Power",
      ),
      "sensor.inverter_temperature_device_30m3y10": makeSensor(
        "sensor.inverter_temperature_device_30m3y10",
        "\u00b0C",
        "Inverter Temperature",
        { device_class: "temperature" },
      ),
      "sensor.inverter_temperature_device_40m3y20": makeSensor(
        "sensor.inverter_temperature_device_40m3y20",
        "\u00b0C",
        "Inverter Temperature",
        { device_class: "temperature" },
      ),
    };

    const result = autoPopulateAdvancedTelemetry(panels, states);

    expect(result.panels.map((panel) => panel.advanced_metrics?.inverter_temp_entity)).toEqual([
      "sensor.inverter_temperature_device_30m3y10",
      "sensor.inverter_temperature_device_30m3y10",
      "sensor.inverter_temperature_device_40m3y20",
    ]);
  });

  it("maps panel current and voltage by local input tokens inside the same serial group", () => {
    const panels: PanelConfig[] = [
      {
        id: "panel-1",
        power_entity: "sensor.sds_mppt_map_mppt1_power_device_30m3y10",
      },
      {
        id: "panel-2",
        power_entity: "sensor.sds_mppt_map_mppt2_power_device_30m3y10",
      },
    ];
    const states: Record<string, HassEntity> = {
      "sensor.sds_mppt_map_mppt1_power_device_30m3y10": makeSensor(
        "sensor.sds_mppt_map_mppt1_power_device_30m3y10",
        "W",
        "MPPT 1 Power",
      ),
      "sensor.sds_mppt_map_mppt2_power_device_30m3y10": makeSensor(
        "sensor.sds_mppt_map_mppt2_power_device_30m3y10",
        "W",
        "MPPT 2 Power",
      ),
      "sensor.sds_mppt_map_mppt1_current_device_30m3y10": makeSensor(
        "sensor.sds_mppt_map_mppt1_current_device_30m3y10",
        "A",
        "MPPT 1 Current",
        { device_class: "current" },
      ),
      "sensor.sds_mppt_map_mppt2_current_device_30m3y10": makeSensor(
        "sensor.sds_mppt_map_mppt2_current_device_30m3y10",
        "A",
        "MPPT 2 Current",
        { device_class: "current" },
      ),
      "sensor.sds_mppt_map_mppt1_voltage_device_30m3y10": makeSensor(
        "sensor.sds_mppt_map_mppt1_voltage_device_30m3y10",
        "V",
        "MPPT 1 Voltage",
        { device_class: "voltage" },
      ),
      "sensor.sds_mppt_map_mppt2_voltage_device_30m3y10": makeSensor(
        "sensor.sds_mppt_map_mppt2_voltage_device_30m3y10",
        "V",
        "MPPT 2 Voltage",
        { device_class: "voltage" },
      ),
    };

    const result = autoPopulateAdvancedTelemetry(panels, states);

    expect(result.panels[0].advanced_metrics).toMatchObject({
      panel_current_entity: "sensor.sds_mppt_map_mppt1_current_device_30m3y10",
      panel_voltage_entity: "sensor.sds_mppt_map_mppt1_voltage_device_30m3y10",
      panel_power_entity: "sensor.sds_mppt_map_mppt1_power_device_30m3y10",
    });
    expect(result.panels[1].advanced_metrics).toMatchObject({
      panel_current_entity: "sensor.sds_mppt_map_mppt2_current_device_30m3y10",
      panel_voltage_entity: "sensor.sds_mppt_map_mppt2_voltage_device_30m3y10",
      panel_power_entity: "sensor.sds_mppt_map_mppt2_power_device_30m3y10",
    });
  });

  it("skips disabled slots and preserves existing manual advanced telemetry", () => {
    const panels: PanelConfig[] = [
      {
        id: "panel-1",
        enabled: false,
        power_entity: "sensor.sds_mppt_map_mppt1_power_device_30m3y10",
      },
      {
        id: "panel-2",
        power_entity: "sensor.sds_mppt_map_mppt2_power_device_30m3y10",
        advanced_metrics: {
          panel_current_entity: "sensor.manual_current",
        },
      },
      {
        id: "panel-3",
        power_entity: "sensor.sds_mppt_map_mppt1_power_device_30m3y10",
      },
    ];
    const states: Record<string, HassEntity> = {
      "sensor.sds_mppt_map_mppt1_power_device_30m3y10": makeSensor(
        "sensor.sds_mppt_map_mppt1_power_device_30m3y10",
        "W",
      ),
      "sensor.sds_mppt_map_mppt2_power_device_30m3y10": makeSensor(
        "sensor.sds_mppt_map_mppt2_power_device_30m3y10",
        "W",
      ),
      "sensor.sds_mppt_map_mppt2_current_device_30m3y10": makeSensor(
        "sensor.sds_mppt_map_mppt2_current_device_30m3y10",
        "A",
      ),
      "sensor.sds_mppt_map_mppt2_voltage_device_30m3y10": makeSensor(
        "sensor.sds_mppt_map_mppt2_voltage_device_30m3y10",
        "V",
      ),
      "sensor.sds_mppt_map_mppt1_voltage_device_30m3y10": makeSensor(
        "sensor.sds_mppt_map_mppt1_voltage_device_30m3y10",
        "V",
      ),
    };

    const result = autoPopulateAdvancedTelemetry(panels, states);

    expect(result.panels[0].advanced_metrics).toBeUndefined();
    expect(result.panels[1].advanced_metrics).toMatchObject({
      panel_current_entity: "sensor.manual_current",
      panel_voltage_entity: "sensor.sds_mppt_map_mppt2_voltage_device_30m3y10",
      panel_power_entity: "sensor.sds_mppt_map_mppt2_power_device_30m3y10",
    });
    expect(result.skippedPanels).toBe(1);
  });

  it("leaves uncertain telemetry empty when no serial group can be detected", () => {
    const panels: PanelConfig[] = [
      { id: "panel-1", power_entity: "sensor.roof_panel_1_power" },
      { id: "panel-2", power_entity: "sensor.roof_panel_2_power" },
    ];
    const states: Record<string, HassEntity> = {
      "sensor.roof_panel_1_power": makeSensor("sensor.roof_panel_1_power", "W"),
      "sensor.roof_panel_2_power": makeSensor("sensor.roof_panel_2_power", "W"),
      "sensor.roof_panel_current": makeSensor("sensor.roof_panel_current", "A"),
      "sensor.roof_panel_voltage": makeSensor("sensor.roof_panel_voltage", "V"),
    };

    const result = autoPopulateAdvancedTelemetry(panels, states);

    expect(result.panels[0].advanced_metrics).toEqual({
      panel_power_entity: "sensor.roof_panel_1_power",
    });
    expect(result.panels[1].advanced_metrics).toEqual({
      panel_power_entity: "sensor.roof_panel_2_power",
    });
  });
});

describe("autoPopulateInverterStatusEntities", () => {
  it("maps one-to-one panel status sensors by matching power anchor tokens", () => {
    const panels: PanelConfig[] = Array.from({ length: 30 }, (_, index) => ({
      id: `panel-${index + 1}`,
      power_entity: `sensor.power_1_0_${index + 1}`,
    }));
    const states: Record<string, HassEntity> = Object.fromEntries(
      panels.flatMap((panel, index) => {
        const panelNumber = index + 1;
        const powerEntityId = `sensor.power_1_0_${panelNumber}`;
        const statusEntityId = `sensor.status_1_0_${panelNumber}`;
        return [
          [
            powerEntityId,
            makeSensor(powerEntityId, "W", `Optimizer 1.0.${panelNumber} Power`),
          ],
          [
            statusEntityId,
            makeSensor(statusEntityId, "", `Optimizer 1.0.${panelNumber} Status`),
          ],
        ];
      }),
    );

    const result = autoPopulateInverterStatusEntities(panels, states);

    expect(result.panels.map((panel) => panel.inverter_status_entity)).toEqual(
      Array.from({ length: 30 }, (_, index) => `sensor.status_1_0_${index + 1}`),
    );
    expect(result.filled).toBe(30);
  });

  it("uses explicit status search text to narrow one-to-one panel status matches", () => {
    const panels: PanelConfig[] = [
      { id: "panel-1", power_entity: "sensor.power_1_0_1" },
      { id: "panel-2", power_entity: "sensor.power_1_0_2" },
      { id: "panel-3", power_entity: "sensor.power_1_0_3" },
    ];
    const states: Record<string, HassEntity> = {
      "sensor.power_1_0_1": makeSensor("sensor.power_1_0_1", "W"),
      "sensor.power_1_0_2": makeSensor("sensor.power_1_0_2", "W"),
      "sensor.power_1_0_3": makeSensor("sensor.power_1_0_3", "W"),
      "sensor.status_1_0_1": makeSensor("sensor.status_1_0_1", ""),
      "sensor.status_1_0_2": makeSensor("sensor.status_1_0_2", ""),
      "sensor.status_1_0_3": makeSensor("sensor.status_1_0_3", ""),
      "sensor.inverter_status_1_0": makeSensor(
        "sensor.inverter_status_1_0",
        "",
        "Inverter Status",
      ),
    };

    const result = autoPopulateInverterStatusEntities(
      panels,
      states,
      "sensor.status_1_0_",
    );

    expect(result.panels.map((panel) => panel.inverter_status_entity)).toEqual([
      "sensor.status_1_0_1",
      "sensor.status_1_0_2",
      "sensor.status_1_0_3",
    ]);
  });

  it("prefers clear one-to-one panel status over a shared status candidate", () => {
    const panels: PanelConfig[] = [
      { id: "panel-1", power_entity: "sensor.power_1_0_1" },
      { id: "panel-2", power_entity: "sensor.power_1_0_2" },
      { id: "panel-3", power_entity: "sensor.power_1_0_3" },
    ];
    const states: Record<string, HassEntity> = {
      "sensor.power_1_0_1": makeSensor("sensor.power_1_0_1", "W"),
      "sensor.power_1_0_2": makeSensor("sensor.power_1_0_2", "W"),
      "sensor.power_1_0_3": makeSensor("sensor.power_1_0_3", "W"),
      "sensor.status_1_0_1": makeSensor("sensor.status_1_0_1", ""),
      "sensor.status_1_0_2": makeSensor("sensor.status_1_0_2", ""),
      "sensor.status_1_0_3": makeSensor("sensor.status_1_0_3", ""),
      "sensor.inverter_status_1_0": makeSensor(
        "sensor.inverter_status_1_0",
        "",
        "Inverter Status",
      ),
    };

    const result = autoPopulateInverterStatusEntities(panels, states);

    expect(result.panels.map((panel) => panel.inverter_status_entity)).toEqual([
      "sensor.status_1_0_1",
      "sensor.status_1_0_2",
      "sensor.status_1_0_3",
    ]);
  });

  it("preserves manual one-to-one status values and skips disabled panel slots", () => {
    const panels: PanelConfig[] = [
      {
        id: "panel-1",
        enabled: false,
        power_entity: "sensor.power_1_0_1",
      },
      {
        id: "panel-2",
        power_entity: "sensor.power_1_0_2",
        inverter_status_entity: "sensor.manual_status",
      },
      { id: "panel-3", power_entity: "sensor.power_1_0_3" },
    ];
    const states: Record<string, HassEntity> = {
      "sensor.power_1_0_1": makeSensor("sensor.power_1_0_1", "W"),
      "sensor.power_1_0_2": makeSensor("sensor.power_1_0_2", "W"),
      "sensor.power_1_0_3": makeSensor("sensor.power_1_0_3", "W"),
      "sensor.status_1_0_1": makeSensor("sensor.status_1_0_1", ""),
      "sensor.status_1_0_2": makeSensor("sensor.status_1_0_2", ""),
      "sensor.status_1_0_3": makeSensor("sensor.status_1_0_3", ""),
    };

    const result = autoPopulateInverterStatusEntities(panels, states);

    expect(result.panels.map((panel) => panel.inverter_status_entity)).toEqual([
      undefined,
      "sensor.manual_status",
      "sensor.status_1_0_3",
    ]);
    expect(result.skippedPanels).toBe(1);
  });

  it("leaves one-to-one panel status empty when local matches are ambiguous", () => {
    const panels: PanelConfig[] = [
      { id: "panel-1", power_entity: "sensor.power_1_0_1" },
      { id: "panel-2", power_entity: "sensor.power_1_0_2" },
    ];
    const states: Record<string, HassEntity> = {
      "sensor.power_1_0_1": makeSensor("sensor.power_1_0_1", "W"),
      "sensor.power_1_0_2": makeSensor("sensor.power_1_0_2", "W"),
      "sensor.left_status_1_0_1": makeSensor("sensor.left_status_1_0_1", ""),
      "sensor.right_status_1_0_1": makeSensor("sensor.right_status_1_0_1", ""),
      "sensor.status_1_0_2": makeSensor("sensor.status_1_0_2", ""),
    };

    const result = autoPopulateInverterStatusEntities(panels, states);

    expect(result.panels.map((panel) => panel.inverter_status_entity)).toEqual([
      undefined,
      "sensor.status_1_0_2",
    ]);
  });

  it("reuses one same-serial status sensor for all enabled panels in that group", () => {
    const panels: PanelConfig[] = [
      {
        id: "panel-1",
        power_entity: "sensor.sds_mppt_map_mppt1_power_device_30m3y10",
      },
      {
        id: "panel-2",
        power_entity: "sensor.sds_mppt_map_mppt2_power_device_30m3y10",
      },
      {
        id: "panel-3",
        power_entity: "sensor.sds_mppt_map_mppt1_power_device_40m3y20",
      },
    ];
    const states: Record<string, HassEntity> = {
      "sensor.sds_mppt_map_mppt1_power_device_30m3y10": makeSensor(
        "sensor.sds_mppt_map_mppt1_power_device_30m3y10",
        "W",
        "MPPT 1 Power",
      ),
      "sensor.sds_mppt_map_mppt2_power_device_30m3y10": makeSensor(
        "sensor.sds_mppt_map_mppt2_power_device_30m3y10",
        "W",
        "MPPT 2 Power",
      ),
      "sensor.sds_mppt_map_mppt1_power_device_40m3y20": makeSensor(
        "sensor.sds_mppt_map_mppt1_power_device_40m3y20",
        "W",
        "MPPT 1 Power",
      ),
      "sensor.inverter_status_device_30m3y10": makeSensor(
        "sensor.inverter_status_device_30m3y10",
        "",
        "Inverter Status",
      ),
      "sensor.inverter_status_device_40m3y20": makeSensor(
        "sensor.inverter_status_device_40m3y20",
        "",
        "Inverter Status",
      ),
    };

    const result = autoPopulateInverterStatusEntities(panels, states);

    expect(result.panels.map((panel) => panel.inverter_status_entity)).toEqual([
      "sensor.inverter_status_device_30m3y10",
      "sensor.inverter_status_device_30m3y10",
      "sensor.inverter_status_device_40m3y20",
    ]);
    expect(result.filled).toBe(3);
  });

  it("prefers the actual device status sensor over same-serial work mode sensors", () => {
    const panels: PanelConfig[] = [
      {
        id: "panel-1",
        enabled: false,
        power_entity: "sensor.sds_mppt_map_mppt1_power_device_30m3y10115030t",
      },
      {
        id: "panel-2",
        power_entity: "sensor.sds_mppt_map_mppt1_power_device_30m3y10115030t",
      },
      {
        id: "panel-3",
        power_entity: "sensor.sds_mppt_map_mppt2_power_device_30m3y10115030t",
      },
    ];
    const states: Record<string, HassEntity> = {
      "sensor.sds_mppt_map_mppt1_power_device_30m3y10115030t": makeSensor(
        "sensor.sds_mppt_map_mppt1_power_device_30m3y10115030t",
        "W",
        "MPPT 1 Power",
      ),
      "sensor.sds_mppt_map_mppt2_power_device_30m3y10115030t": makeSensor(
        "sensor.sds_mppt_map_mppt2_power_device_30m3y10115030t",
        "W",
        "MPPT 2 Power",
      ),
      "sensor.sds_device_status_device_30m3y10115030t": makeSensor(
        "sensor.sds_device_status_device_30m3y10115030t",
        "",
        "Device Status",
      ),
      "sensor.sds_work_mode_device_30m3y10115030t": makeSensor(
        "sensor.sds_work_mode_device_30m3y10115030t",
        "",
        "Work Mode",
      ),
    };

    const result = autoPopulateInverterStatusEntities(panels, states);

    expect(result.panels.map((panel) => panel.inverter_status_entity)).toEqual([
      undefined,
      "sensor.sds_device_status_device_30m3y10115030t",
      "sensor.sds_device_status_device_30m3y10115030t",
    ]);
  });

  it("matches device status by serial token even when the serial is not repeated in enabled panels", () => {
    const panels: PanelConfig[] = [
      {
        id: "panel-1",
        enabled: false,
      },
      {
        id: "panel-2",
        power_entity: "sensor.sds_mppt_map_mppt1_power_device_30m3y10115030t",
      },
      {
        id: "panel-3",
        power_entity: "sensor.sds_mppt_map_mppt1_power_device_30m3y10115036l",
      },
    ];
    const states: Record<string, HassEntity> = {
      "sensor.sds_mppt_map_mppt1_power_device_30m3y10115030t": makeSensor(
        "sensor.sds_mppt_map_mppt1_power_device_30m3y10115030t",
        "W",
        "MPPT 1 Power",
      ),
      "sensor.sds_mppt_map_mppt1_power_device_30m3y10115036l": makeSensor(
        "sensor.sds_mppt_map_mppt1_power_device_30m3y10115036l",
        "W",
        "MPPT 1 Power",
      ),
      "sensor.sds_device_status_device_30m3y10115030t": makeSensor(
        "sensor.sds_device_status_device_30m3y10115030t",
        "",
        "Device Status",
      ),
      "sensor.sds_device_status_device_30m3y10115036l": makeSensor(
        "sensor.sds_device_status_device_30m3y10115036l",
        "",
        "Device Status",
      ),
    };

    const result = autoPopulateInverterStatusEntities(panels, states);

    expect(result.panels.map((panel) => panel.inverter_status_entity)).toEqual([
      undefined,
      "sensor.sds_device_status_device_30m3y10115030t",
      "sensor.sds_device_status_device_30m3y10115036l",
    ]);
  });

  it("prefers device status when several same-serial status sensors exist", () => {
    const panels: PanelConfig[] = [
      {
        id: "panel-1",
        power_entity: "sensor.sds_mppt_map_mppt1_power_device_30m3y10115030t",
      },
      {
        id: "panel-2",
        power_entity: "sensor.sds_mppt_map_mppt2_power_device_30m3y10115030t",
      },
    ];
    const states: Record<string, HassEntity> = {
      "sensor.sds_mppt_map_mppt1_power_device_30m3y10115030t": makeSensor(
        "sensor.sds_mppt_map_mppt1_power_device_30m3y10115030t",
        "W",
        "MPPT 1 Power",
      ),
      "sensor.sds_mppt_map_mppt2_power_device_30m3y10115030t": makeSensor(
        "sensor.sds_mppt_map_mppt2_power_device_30m3y10115030t",
        "W",
        "MPPT 2 Power",
      ),
      "sensor.sds_battery_status_device_30m3y10115030t": makeSensor(
        "sensor.sds_battery_status_device_30m3y10115030t",
        "",
        "Battery Status",
      ),
      "sensor.sds_wifi_status_device_30m3y10115030t": makeSensor(
        "sensor.sds_wifi_status_device_30m3y10115030t",
        "",
        "Wifi Status",
      ),
      "sensor.sds_online_status_device_30m3y10115030t": makeSensor(
        "sensor.sds_online_status_device_30m3y10115030t",
        "",
        "Online Status",
      ),
      "sensor.sds_device_status_device_30m3y10115030t": makeSensor(
        "sensor.sds_device_status_device_30m3y10115030t",
        "",
        "Device Status",
      ),
    };

    const result = autoPopulateInverterStatusEntities(panels, states);

    expect(result.panels.map((panel) => panel.inverter_status_entity)).toEqual([
      "sensor.sds_device_status_device_30m3y10115030t",
      "sensor.sds_device_status_device_30m3y10115030t",
    ]);
  });

  it("can match status entities from the hass state key when entity_id is missing", () => {
    const panels: PanelConfig[] = [
      {
        id: "panel-1",
        power_entity: "sensor.sds_mppt_map_mppt1_power_device_30m3y10115030t",
      },
      {
        id: "panel-2",
        power_entity: "sensor.sds_mppt_map_mppt2_power_device_30m3y10115030t",
      },
    ];
    const statusWithoutEntityId = makeSensor(
      "sensor.sds_device_status_device_30m3y10115030t",
      "",
      "Device Status",
    );
    delete (statusWithoutEntityId as Partial<HassEntity>).entity_id;
    const states: Record<string, HassEntity> = {
      "sensor.sds_mppt_map_mppt1_power_device_30m3y10115030t": makeSensor(
        "sensor.sds_mppt_map_mppt1_power_device_30m3y10115030t",
        "W",
        "MPPT 1 Power",
      ),
      "sensor.sds_mppt_map_mppt2_power_device_30m3y10115030t": makeSensor(
        "sensor.sds_mppt_map_mppt2_power_device_30m3y10115030t",
        "W",
        "MPPT 2 Power",
      ),
      "sensor.sds_device_status_device_30m3y10115030t": statusWithoutEntityId,
    };

    const result = autoPopulateInverterStatusEntities(panels, states);

    expect(result.panels.map((panel) => panel.inverter_status_entity)).toEqual([
      "sensor.sds_device_status_device_30m3y10115030t",
      "sensor.sds_device_status_device_30m3y10115030t",
    ]);
  });

  it("can match binary_sensor inverter status entities", () => {
    const panels: PanelConfig[] = [
      {
        id: "panel-1",
        power_entity: "sensor.sds_mppt_map_mppt1_power_device_30m3y10115030t",
      },
      {
        id: "panel-2",
        power_entity: "sensor.sds_mppt_map_mppt2_power_device_30m3y10115030t",
      },
    ];
    const states: Record<string, HassEntity> = {
      "sensor.sds_mppt_map_mppt1_power_device_30m3y10115030t": makeSensor(
        "sensor.sds_mppt_map_mppt1_power_device_30m3y10115030t",
        "W",
        "MPPT 1 Power",
      ),
      "sensor.sds_mppt_map_mppt2_power_device_30m3y10115030t": makeSensor(
        "sensor.sds_mppt_map_mppt2_power_device_30m3y10115030t",
        "W",
        "MPPT 2 Power",
      ),
      "binary_sensor.sds_device_status_device_30m3y10115030t": makeSensor(
        "binary_sensor.sds_device_status_device_30m3y10115030t",
        "",
        "Device Status",
      ),
    };

    const result = autoPopulateInverterStatusEntities(panels, states);

    expect(result.panels.map((panel) => panel.inverter_status_entity)).toEqual([
      "binary_sensor.sds_device_status_device_30m3y10115030t",
      "binary_sensor.sds_device_status_device_30m3y10115030t",
    ]);
  });

  it("preserves manual status values and skips disabled panels", () => {
    const panels: PanelConfig[] = [
      {
        id: "panel-1",
        enabled: false,
        power_entity: "sensor.sds_mppt_map_mppt1_power_device_30m3y10",
      },
      {
        id: "panel-2",
        power_entity: "sensor.sds_mppt_map_mppt2_power_device_30m3y10",
        inverter_status_entity: "sensor.manual_status",
      },
      {
        id: "panel-3",
        power_entity: "sensor.sds_mppt_map_mppt1_power_device_40m3y20",
      },
    ];
    const states: Record<string, HassEntity> = {
      "sensor.sds_mppt_map_mppt1_power_device_30m3y10": makeSensor(
        "sensor.sds_mppt_map_mppt1_power_device_30m3y10",
        "W",
      ),
      "sensor.sds_mppt_map_mppt2_power_device_30m3y10": makeSensor(
        "sensor.sds_mppt_map_mppt2_power_device_30m3y10",
        "W",
      ),
      "sensor.sds_mppt_map_mppt1_power_device_40m3y20": makeSensor(
        "sensor.sds_mppt_map_mppt1_power_device_40m3y20",
        "W",
      ),
      "sensor.inverter_status_device_30m3y10": makeSensor(
        "sensor.inverter_status_device_30m3y10",
        "",
      ),
      "sensor.inverter_status_device_40m3y20": makeSensor(
        "sensor.inverter_status_device_40m3y20",
        "",
      ),
    };

    const result = autoPopulateInverterStatusEntities(panels, states);

    expect(result.panels.map((panel) => panel.inverter_status_entity)).toEqual([
      undefined,
      "sensor.manual_status",
      "sensor.inverter_status_device_40m3y20",
    ]);
    expect(result.skippedPanels).toBe(1);
  });

  it("leaves status empty when the same-group match is ambiguous", () => {
    const panels: PanelConfig[] = [
      {
        id: "panel-1",
        power_entity: "sensor.sds_mppt_map_mppt1_power_device_30m3y10",
      },
      {
        id: "panel-2",
        power_entity: "sensor.sds_mppt_map_mppt2_power_device_30m3y10",
      },
    ];
    const states: Record<string, HassEntity> = {
      "sensor.sds_mppt_map_mppt1_power_device_30m3y10": makeSensor(
        "sensor.sds_mppt_map_mppt1_power_device_30m3y10",
        "W",
      ),
      "sensor.sds_mppt_map_mppt2_power_device_30m3y10": makeSensor(
        "sensor.sds_mppt_map_mppt2_power_device_30m3y10",
        "W",
      ),
      "sensor.left_status_device_30m3y10": makeSensor(
        "sensor.left_status_device_30m3y10",
        "",
      ),
      "sensor.right_status_device_30m3y10": makeSensor(
        "sensor.right_status_device_30m3y10",
        "",
      ),
    };

    const result = autoPopulateInverterStatusEntities(panels, states);

    expect(result.panels.map((panel) => panel.inverter_status_entity)).toEqual([
      undefined,
      undefined,
    ]);
  });

  it("leaves status empty when there is no same-group status candidate", () => {
    const panels: PanelConfig[] = [
      { id: "panel-1", power_entity: "sensor.roof_panel_1_power" },
      { id: "panel-2", power_entity: "sensor.roof_panel_2_power" },
    ];
    const states: Record<string, HassEntity> = {
      "sensor.roof_panel_1_power": makeSensor("sensor.roof_panel_1_power", "W"),
      "sensor.roof_panel_2_power": makeSensor("sensor.roof_panel_2_power", "W"),
      "sensor.inverter_status_device_other": makeSensor(
        "sensor.inverter_status_device_other",
        "",
      ),
    };

    const result = autoPopulateInverterStatusEntities(panels, states);

    expect(result.panels.map((panel) => panel.inverter_status_entity)).toEqual([
      undefined,
      undefined,
    ]);
  });
});

describe("sortSensorsForAutoPopulate", () => {
  it("sorts entity ids by natural numeric groups", () => {
    const sorted = sortSensorsForAutoPopulate([
      { entityId: "sensor.slx_powerdc10" },
      { entityId: "sensor.slx_powerdc2" },
      { entityId: "sensor.slx_powerdc1" },
    ]);

    expect(sorted.map((item) => item.entityId)).toEqual([
      "sensor.slx_powerdc1",
      "sensor.slx_powerdc2",
      "sensor.slx_powerdc10",
    ]);
  });

  it("sorts dotted entity ids naturally across all numeric groups", () => {
    const sorted = sortSensorsForAutoPopulate([
      { entityId: "sensor.power_1_0_10" },
      { entityId: "sensor.power_1_0_2" },
      { entityId: "sensor.power_1_0_30" },
      { entityId: "sensor.power_1_0_1" },
    ]);

    expect(sorted.map((item) => item.entityId)).toEqual([
      "sensor.power_1_0_1",
      "sensor.power_1_0_2",
      "sensor.power_1_0_10",
      "sensor.power_1_0_30",
    ]);
  });

  it("sorts by friendly name when requested", () => {
    const sorted = sortSensorsForAutoPopulate(
      [
        { entityId: "sensor.slx_power_alpha", friendlyName: "Panel 3" },
        { entityId: "sensor.slx_power_beta", friendlyName: "Panel 1" },
        { entityId: "sensor.slx_power_gamma", friendlyName: "Panel 2" },
      ],
      "friendlyName",
    );

    expect(sorted.map((item) => item.entityId)).toEqual([
      "sensor.slx_power_beta",
      "sensor.slx_power_gamma",
      "sensor.slx_power_alpha",
    ]);
  });

  it("falls back to lexical entity_id order when no numbers are present", () => {
    const sorted = sortSensorsForAutoPopulate([
      { entityId: "sensor.slx_power_zeta" },
      { entityId: "sensor.slx_power_alpha" },
      { entityId: "sensor.slx_power_mu" },
    ]);

    expect(sorted.map((item) => item.entityId)).toEqual([
      "sensor.slx_power_alpha",
      "sensor.slx_power_mu",
      "sensor.slx_power_zeta",
    ]);
  });

  it("groups sensors by a repeated suffix token when requested", () => {
    const sorted = sortSensorsForAutoPopulate(
      [
        { entityId: "sensor.roof_input1_power_serial_BBB" },
        { entityId: "sensor.roof_input3_power_serial_AAA" },
        { entityId: "sensor.roof_input2_power_serial_BBB" },
        { entityId: "sensor.roof_input1_power_serial_AAA" },
        { entityId: "sensor.roof_input3_power_serial_BBB" },
        { entityId: "sensor.roof_input2_power_serial_AAA" },
      ],
      "grouped",
    );

    expect(sorted.map((item) => item.entityId)).toEqual([
      "sensor.roof_input1_power_serial_AAA",
      "sensor.roof_input2_power_serial_AAA",
      "sensor.roof_input3_power_serial_AAA",
      "sensor.roof_input1_power_serial_BBB",
      "sensor.roof_input2_power_serial_BBB",
      "sensor.roof_input3_power_serial_BBB",
    ]);
  });

  it("auto-detects complete repeated suffix groups without assuming a sensor name pattern", () => {
    const sorted = sortSensorsForAutoPopulate([
      { entityId: "sensor.roof_input1_power_serial_BBB" },
      { entityId: "sensor.roof_input2_power_serial_AAA" },
      { entityId: "sensor.roof_input2_power_serial_BBB" },
      { entityId: "sensor.roof_input1_power_serial_AAA" },
    ]);

    expect(sorted.map((item) => item.entityId)).toEqual([
      "sensor.roof_input1_power_serial_AAA",
      "sensor.roof_input2_power_serial_AAA",
      "sensor.roof_input1_power_serial_BBB",
      "sensor.roof_input2_power_serial_BBB",
    ]);
  });

  it("auto-detects entity id serial groups when friendly names hide the serial", () => {
    const sorted = sortSensorsForAutoPopulate(
      [
        {
          entityId: "sensor.sds_mppt_map_mppt1_power_device_40m3y20",
          friendlyName: "MPPT 1 Power",
        },
        {
          entityId: "sensor.sds_mppt_map_mppt1_power_device_30m3y10",
          friendlyName: "MPPT 1 Power",
        },
        {
          entityId: "sensor.sds_mppt_map_mppt2_power_device_40m3y20",
          friendlyName: "MPPT 2 Power",
        },
        {
          entityId: "sensor.sds_mppt_map_mppt2_power_device_30m3y10",
          friendlyName: "MPPT 2 Power",
        },
      ],
      "auto",
      "friendlyName",
    );

    expect(sorted.map((item) => item.entityId)).toEqual([
      "sensor.sds_mppt_map_mppt1_power_device_30m3y10",
      "sensor.sds_mppt_map_mppt2_power_device_30m3y10",
      "sensor.sds_mppt_map_mppt1_power_device_40m3y20",
      "sensor.sds_mppt_map_mppt2_power_device_40m3y20",
    ]);
  });

  it("auto-detects entity id serial groups when some HA entity ids have extra suffix tokens", () => {
    const sorted = sortSensorsForAutoPopulate(
      [
        {
          entityId: "sensor.sds_mppt_map_mppt1_power_device_40m3y20_extra",
          friendlyName: "MPPT 1 Power",
        },
        {
          entityId: "sensor.sds_mppt_map_mppt2_power_device_30m3y10",
          friendlyName: "MPPT 2 Power",
        },
        {
          entityId: "sensor.sds_mppt_map_mppt2_power_device_40m3y20_extra",
          friendlyName: "MPPT 2 Power",
        },
        {
          entityId: "sensor.sds_mppt_map_mppt1_power_device_30m3y10",
          friendlyName: "MPPT 1 Power",
        },
      ],
      "auto",
      "friendlyName",
    );

    expect(sorted.map((item) => item.entityId)).toEqual([
      "sensor.sds_mppt_map_mppt1_power_device_30m3y10",
      "sensor.sds_mppt_map_mppt2_power_device_30m3y10",
      "sensor.sds_mppt_map_mppt1_power_device_40m3y20_extra",
      "sensor.sds_mppt_map_mppt2_power_device_40m3y20_extra",
    ]);
  });

  it("auto-detects trailing serial suffixes after changing input tokens", () => {
    const sorted = sortSensorsForAutoPopulate(
      [
        {
          entityId: "sensor.slx_powerdc1_3030t",
          friendlyName: "DC Power String 1",
        },
        {
          entityId: "sensor.slx_powerdc2_3030l",
          friendlyName: "DC Power String 2",
        },
        {
          entityId: "sensor.slx_powerdc2_3030t",
          friendlyName: "DC Power String 2",
        },
        {
          entityId: "sensor.slx_powerdc1_3030l",
          friendlyName: "DC Power String 1",
        },
      ],
      "auto",
      "friendlyName",
    );

    expect(sorted.map((item) => item.entityId)).toEqual([
      "sensor.slx_powerdc1_3030l",
      "sensor.slx_powerdc2_3030l",
      "sensor.slx_powerdc1_3030t",
      "sensor.slx_powerdc2_3030t",
    ]);
  });

  it("does not mistake short local input suffixes for serial groups", () => {
    const sorted = sortSensorsForAutoPopulate([
      { entityId: "sensor.site_b_mppt2" },
      { entityId: "sensor.site_a_mppt2" },
      { entityId: "sensor.site_b_mppt1" },
      { entityId: "sensor.site_a_mppt1" },
    ]);

    expect(sorted.map((item) => item.entityId)).toEqual([
      "sensor.site_a_mppt1",
      "sensor.site_a_mppt2",
      "sensor.site_b_mppt1",
      "sensor.site_b_mppt2",
    ]);
  });

  it("auto-detects entity id serial groups when one group is incomplete", () => {
    const sorted = sortSensorsForAutoPopulate(
      [
        {
          entityId: "sensor.sds_mppt_map_mppt2_power_device_30m3y10",
          friendlyName: "MPPT 2 Power",
        },
        {
          entityId: "sensor.sds_mppt_map_mppt1_power_device_40m3y20",
          friendlyName: "MPPT 1 Power",
        },
        {
          entityId: "sensor.sds_mppt_map_mppt2_power_device_40m3y20",
          friendlyName: "MPPT 2 Power",
        },
        {
          entityId: "sensor.sds_mppt_map_mppt1_power_device_50m3y30",
          friendlyName: "MPPT 1 Power",
        },
        {
          entityId: "sensor.sds_mppt_map_mppt2_power_device_50m3y30",
          friendlyName: "MPPT 2 Power",
        },
      ],
      "auto",
      "friendlyName",
    );

    expect(sorted.map((item) => item.entityId)).toEqual([
      "sensor.sds_mppt_map_mppt2_power_device_30m3y10",
      "sensor.sds_mppt_map_mppt1_power_device_40m3y20",
      "sensor.sds_mppt_map_mppt2_power_device_40m3y20",
      "sensor.sds_mppt_map_mppt1_power_device_50m3y30",
      "sensor.sds_mppt_map_mppt2_power_device_50m3y30",
    ]);
  });

  it("does not auto-detect incomplete repeated suffix groups", () => {
    const sorted = sortSensorsForAutoPopulate([
      { entityId: "sensor.roof_input1_power_serial_BBB" },
      { entityId: "sensor.roof_input2_power_serial_AAA" },
      { entityId: "sensor.roof_input2_power_serial_BBB" },
      { entityId: "sensor.roof_input1_power" },
    ]);

    expect(sorted.map((item) => item.entityId)).toEqual([
      "sensor.roof_input1_power",
      "sensor.roof_input1_power_serial_BBB",
      "sensor.roof_input2_power_serial_AAA",
      "sensor.roof_input2_power_serial_BBB",
    ]);
  });

  it("keeps natural order when the repeated group appears before numeric inputs", () => {
    const sorted = sortSensorsForAutoPopulate([
      { entityId: "sensor.site_inverter_B_input_2_power" },
      { entityId: "sensor.site_inverter_A_input_2_power" },
      { entityId: "sensor.site_inverter_B_input_1_power" },
      { entityId: "sensor.site_inverter_A_input_1_power" },
    ]);

    expect(sorted.map((item) => item.entityId)).toEqual([
      "sensor.site_inverter_A_input_1_power",
      "sensor.site_inverter_A_input_2_power",
      "sensor.site_inverter_B_input_1_power",
      "sensor.site_inverter_B_input_2_power",
    ]);
  });
});

describe("autoPopulatePanelEntities", () => {
  it("fills empty slots in order and does not overwrite existing values", () => {
    const panels: PanelConfig[] = [
      { id: "panel-1", power_entity: undefined },
      { id: "panel-2", power_entity: "sensor.slx_powerdc2" },
      { id: "panel-3", power_entity: undefined },
    ];

    const states: Record<string, HassEntity> = {
      "sensor.slx_powerdc1": makeSensor("sensor.slx_powerdc1", "W", "Panel 1"),
      "sensor.slx_powerdc2": makeSensor("sensor.slx_powerdc2", "W", "Panel 2"),
      "sensor.slx_powerdc3": makeSensor("sensor.slx_powerdc3", "W", "Panel 3"),
    };

    const result = autoPopulatePanelEntities(
      panels,
      states,
      "power_entity",
      "sensor.slx_powerdc",
      (unit) => unit === "w",
    );

    expect(result.panels.map((panel) => panel.power_entity)).toEqual([
      "sensor.slx_powerdc1",
      "sensor.slx_powerdc2",
      "sensor.slx_powerdc3",
    ]);
    expect(result.matched).toBe(3);
    expect(result.filled).toBe(2);
    expect(result.skipped).toBe(1);
  });

  it("does not assign duplicate sensors when one is already used", () => {
    const panels: PanelConfig[] = [
      { id: "panel-1", energy_entity: undefined },
      { id: "panel-2", energy_entity: "sensor.slx_energy1" },
      { id: "panel-3", energy_entity: undefined },
    ];

    const states: Record<string, HassEntity> = {
      "sensor.slx_energy1": makeSensor("sensor.slx_energy1", "kWh"),
      "sensor.slx_energy2": makeSensor("sensor.slx_energy2", "kWh"),
    };

    const result = autoPopulatePanelEntities(
      panels,
      states,
      "energy_entity",
      "sensor.slx_energy",
      (unit) => unit === "kwh" || unit === "wh",
    );

    expect(result.panels.map((panel) => panel.energy_entity)).toEqual([
      "sensor.slx_energy2",
      "sensor.slx_energy1",
      undefined,
    ]);
    expect(result.matched).toBe(2);
    expect(result.filled).toBe(1);
    expect(result.skipped).toBe(2);
  });

  it("can repeat each matched power sensor across multiple enabled string panel slots", () => {
    const panels: PanelConfig[] = [
      { id: "panel-1", power_entity: undefined },
      { id: "panel-2", enabled: false, power_entity: undefined },
      { id: "panel-3", power_entity: undefined },
      { id: "panel-4", power_entity: undefined },
      { id: "panel-5", power_entity: undefined },
    ];

    const states: Record<string, HassEntity> = {
      "sensor.string_power_1": makeSensor("sensor.string_power_1", "W", "String Power 1"),
      "sensor.string_power_2": makeSensor("sensor.string_power_2", "W", "String Power 2"),
    };

    const result = autoPopulatePanelEntities(
      panels,
      states,
      "power_entity",
      "sensor.string_power_",
      (unit) => unit === "w",
      "auto",
      { repeatEachCandidate: 2 },
    );

    expect(result.panels.map((panel) => panel.power_entity)).toEqual([
      "sensor.string_power_1",
      undefined,
      "sensor.string_power_1",
      "sensor.string_power_2",
      "sensor.string_power_2",
    ]);
    expect(result.matched).toBe(2);
    expect(result.filled).toBe(4);
    expect(result.skipped).toBe(1);
  });

  it("matches every sensor that starts with the prefix", () => {
    const panels: PanelConfig[] = [
      { id: "panel-1", power_entity: undefined },
      { id: "panel-2", power_entity: undefined },
    ];

    const states: Record<string, HassEntity> = {
      "sensor.slx_powerdc1": makeSensor("sensor.slx_powerdc1", "W"),
      "sensor.slx_powerdcTotal": makeSensor("sensor.slx_powerdcTotal", "W"),
      "sensor.other_powerdc1": makeSensor("sensor.other_powerdc1", "W"),
    };

    const result = autoPopulatePanelEntities(
      panels,
      states,
      "power_entity",
      "sensor.slx_powerdc",
      (unit) => unit === "w",
    );

    expect(result.panels.map((panel) => panel.power_entity)).toEqual([
      "sensor.slx_powerdc1",
      "sensor.slx_powerdcTotal",
    ]);
    expect(result.matched).toBe(2);
  });

  it("matches power sensors by friendly name when search is not an entity id", () => {
    const panels: PanelConfig[] = [
      { id: "panel-1", power_entity: undefined },
      { id: "panel-2", power_entity: undefined },
    ];

    const states: Record<string, HassEntity> = {
      "sensor.ac_power_1": makeSensor("sensor.ac_power_1", "W", "Roof Panel 1 power"),
      "sensor.ac_power_2": makeSensor("sensor.ac_power_2", "W", "Roof Panel 2 power"),
      "sensor.other_power": makeSensor("sensor.other_power", "W", "Garage panel power"),
    };

    const result = autoPopulatePanelEntities(
      panels,
      states,
      "power_entity",
      "roof panel",
      (unit) => unit === "w",
    );

    expect(result.panels.map((panel) => panel.power_entity)).toEqual([
      "sensor.ac_power_1",
      "sensor.ac_power_2",
    ]);
    expect(result.matched).toBe(2);
  });

  it("fills dotted panel power sensors in natural entity id order", () => {
    const panels: PanelConfig[] = Array.from({ length: 30 }, (_, index) => ({
      id: `panel-${index + 1}`,
      power_entity: undefined,
    }));
    const states: Record<string, HassEntity> = Object.fromEntries(
      Array.from({ length: 30 }, (_, index) => {
        const number = index + 1;
        const entityId = `sensor.power_1_0_${number}`;
        return [
          entityId,
          makeSensor(entityId, "W", `Optimizer 1.0.${number} Power`),
        ];
      }).reverse(),
    );

    const result = autoPopulatePanelEntities(
      panels,
      states,
      "power_entity",
      "sensor.power_1_0_",
      (unit) => unit === "w",
    );

    expect(result.panels.map((panel) => panel.power_entity)).toEqual(
      Array.from({ length: 30 }, (_, index) => `sensor.power_1_0_${index + 1}`),
    );
    expect(result.matched).toBe(30);
    expect(result.filled).toBe(30);
  });

  it("fills friendly-name searches in natural friendly name order", () => {
    const panels: PanelConfig[] = [
      { id: "panel-1", power_entity: undefined },
      { id: "panel-2", power_entity: undefined },
      { id: "panel-3", power_entity: undefined },
      { id: "panel-4", power_entity: undefined },
    ];

    const states: Record<string, HassEntity> = {
      "sensor.optimizer_delta": makeSensor(
        "sensor.optimizer_delta",
        "W",
        "Optimizer 1.0.30 Power",
      ),
      "sensor.optimizer_beta": makeSensor(
        "sensor.optimizer_beta",
        "W",
        "Optimizer 1.0.2 Power",
      ),
      "sensor.optimizer_gamma": makeSensor(
        "sensor.optimizer_gamma",
        "W",
        "Optimizer 1.0.10 Power",
      ),
      "sensor.optimizer_alpha": makeSensor(
        "sensor.optimizer_alpha",
        "W",
        "Optimizer 1.0.1 Power",
      ),
    };

    const result = autoPopulatePanelEntities(
      panels,
      states,
      "power_entity",
      "optimizer",
      (unit) => unit === "w",
    );

    expect(result.panels.map((panel) => panel.power_entity)).toEqual([
      "sensor.optimizer_alpha",
      "sensor.optimizer_beta",
      "sensor.optimizer_gamma",
      "sensor.optimizer_delta",
    ]);
    expect(result.matched).toBe(4);
    expect(result.filled).toBe(4);
  });

  it("auto-populates repeated suffix sensor groups together", () => {
    const panels: PanelConfig[] = Array.from({ length: 6 }, (_, index) => ({
      id: `panel-${index + 1}`,
      power_entity: undefined,
    }));
    const states: Record<string, HassEntity> = {
      "sensor.roof_input1_power_serial_BBB": makeSensor(
        "sensor.roof_input1_power_serial_BBB",
        "W",
      ),
      "sensor.roof_input3_power_serial_AAA": makeSensor(
        "sensor.roof_input3_power_serial_AAA",
        "W",
      ),
      "sensor.roof_input2_power_serial_BBB": makeSensor(
        "sensor.roof_input2_power_serial_BBB",
        "W",
      ),
      "sensor.roof_input1_power_serial_AAA": makeSensor(
        "sensor.roof_input1_power_serial_AAA",
        "W",
      ),
      "sensor.roof_input3_power_serial_BBB": makeSensor(
        "sensor.roof_input3_power_serial_BBB",
        "W",
      ),
      "sensor.roof_input2_power_serial_AAA": makeSensor(
        "sensor.roof_input2_power_serial_AAA",
        "W",
      ),
    };

    const result = autoPopulatePanelEntities(
      panels,
      states,
      "power_entity",
      "sensor.roof_",
      (unit) => unit === "w",
    );

    expect(result.panels.map((panel) => panel.power_entity)).toEqual([
      "sensor.roof_input1_power_serial_AAA",
      "sensor.roof_input2_power_serial_AAA",
      "sensor.roof_input3_power_serial_AAA",
      "sensor.roof_input1_power_serial_BBB",
      "sensor.roof_input2_power_serial_BBB",
      "sensor.roof_input3_power_serial_BBB",
    ]);
    expect(result.matched).toBe(6);
    expect(result.filled).toBe(6);
  });

  it("auto-populates friendly-name searches by entity id serial groups", () => {
    const panels: PanelConfig[] = Array.from({ length: 4 }, (_, index) => ({
      id: `panel-${index + 1}`,
      power_entity: undefined,
    }));
    const states: Record<string, HassEntity> = {
      "sensor.sds_mppt_map_mppt1_power_device_40m3y20": makeSensor(
        "sensor.sds_mppt_map_mppt1_power_device_40m3y20",
        "W",
        "MPPT 1 Power",
      ),
      "sensor.sds_mppt_map_mppt1_power_device_30m3y10": makeSensor(
        "sensor.sds_mppt_map_mppt1_power_device_30m3y10",
        "W",
        "MPPT 1 Power",
      ),
      "sensor.sds_mppt_map_mppt2_power_device_40m3y20": makeSensor(
        "sensor.sds_mppt_map_mppt2_power_device_40m3y20",
        "W",
        "MPPT 2 Power",
      ),
      "sensor.sds_mppt_map_mppt2_power_device_30m3y10": makeSensor(
        "sensor.sds_mppt_map_mppt2_power_device_30m3y10",
        "W",
        "MPPT 2 Power",
      ),
    };

    const result = autoPopulatePanelEntities(
      panels,
      states,
      "power_entity",
      "mppt",
      (unit) => unit === "w",
    );

    expect(result.panels.map((panel) => panel.power_entity)).toEqual([
      "sensor.sds_mppt_map_mppt1_power_device_30m3y10",
      "sensor.sds_mppt_map_mppt2_power_device_30m3y10",
      "sensor.sds_mppt_map_mppt1_power_device_40m3y20",
      "sensor.sds_mppt_map_mppt2_power_device_40m3y20",
    ]);
    expect(result.matched).toBe(4);
    expect(result.filled).toBe(4);
  });

  it("auto-populates friendly-name DC string searches by trailing serial groups", () => {
    const panels: PanelConfig[] = Array.from({ length: 4 }, (_, index) => ({
      id: `panel-${index + 1}`,
      power_entity: undefined,
    }));
    const states: Record<string, HassEntity> = {
      "sensor.slx_powerdc1_3030t": makeSensor(
        "sensor.slx_powerdc1_3030t",
        "W",
        "DC Power String 1",
      ),
      "sensor.slx_powerdc1_3030l": makeSensor(
        "sensor.slx_powerdc1_3030l",
        "W",
        "DC Power String 1",
      ),
      "sensor.slx_powerdc2_3030t": makeSensor(
        "sensor.slx_powerdc2_3030t",
        "W",
        "DC Power String 2",
      ),
      "sensor.slx_powerdc2_3030l": makeSensor(
        "sensor.slx_powerdc2_3030l",
        "W",
        "DC Power String 2",
      ),
    };

    const result = autoPopulatePanelEntities(
      panels,
      states,
      "power_entity",
      "dc power",
      (unit) => unit === "w",
    );

    expect(result.panels.map((panel) => panel.power_entity)).toEqual([
      "sensor.slx_powerdc1_3030l",
      "sensor.slx_powerdc2_3030l",
      "sensor.slx_powerdc1_3030t",
      "sensor.slx_powerdc2_3030t",
    ]);
    expect(result.matched).toBe(4);
    expect(result.filled).toBe(4);
  });

  it("keeps serial-group order when the first panel slot is disabled", () => {
    const panels: PanelConfig[] = [
      { id: "panel-1", enabled: false, power_entity: undefined },
      { id: "panel-2", power_entity: undefined },
      { id: "panel-3", power_entity: undefined },
      { id: "panel-4", power_entity: undefined },
      { id: "panel-5", power_entity: undefined },
    ];
    const states: Record<string, HassEntity> = {
      "sensor.sds_mppt_map_mppt1_power_device_40m3y20": makeSensor(
        "sensor.sds_mppt_map_mppt1_power_device_40m3y20",
        "W",
        "MPPT 1 Power",
      ),
      "sensor.sds_mppt_map_mppt1_power_device_30m3y10": makeSensor(
        "sensor.sds_mppt_map_mppt1_power_device_30m3y10",
        "W",
        "MPPT 1 Power",
      ),
      "sensor.sds_mppt_map_mppt2_power_device_40m3y20": makeSensor(
        "sensor.sds_mppt_map_mppt2_power_device_40m3y20",
        "W",
        "MPPT 2 Power",
      ),
      "sensor.sds_mppt_map_mppt2_power_device_30m3y10": makeSensor(
        "sensor.sds_mppt_map_mppt2_power_device_30m3y10",
        "W",
        "MPPT 2 Power",
      ),
    };

    const result = autoPopulatePanelEntities(
      panels,
      states,
      "power_entity",
      "mppt",
      (unit) => unit === "w",
    );

    expect(result.panels.map((panel) => panel.power_entity)).toEqual([
      undefined,
      "sensor.sds_mppt_map_mppt1_power_device_30m3y10",
      "sensor.sds_mppt_map_mppt2_power_device_30m3y10",
      "sensor.sds_mppt_map_mppt1_power_device_40m3y20",
      "sensor.sds_mppt_map_mppt2_power_device_40m3y20",
    ]);
    expect(result.filled).toBe(4);
    expect(result.skipped).toBe(1);
  });

  it("keeps serial-group order with a disabled first slot and an incomplete first serial group", () => {
    const panels: PanelConfig[] = [
      { id: "panel-1", enabled: false, power_entity: undefined },
      { id: "panel-2", power_entity: undefined },
      { id: "panel-3", power_entity: undefined },
      { id: "panel-4", power_entity: undefined },
      { id: "panel-5", power_entity: undefined },
      { id: "panel-6", power_entity: undefined },
    ];
    const states: Record<string, HassEntity> = {
      "sensor.sds_mppt_map_mppt2_power_device_30m3y10": makeSensor(
        "sensor.sds_mppt_map_mppt2_power_device_30m3y10",
        "W",
        "MPPT 2 Power",
      ),
      "sensor.sds_mppt_map_mppt1_power_device_40m3y20": makeSensor(
        "sensor.sds_mppt_map_mppt1_power_device_40m3y20",
        "W",
        "MPPT 1 Power",
      ),
      "sensor.sds_mppt_map_mppt2_power_device_40m3y20": makeSensor(
        "sensor.sds_mppt_map_mppt2_power_device_40m3y20",
        "W",
        "MPPT 2 Power",
      ),
      "sensor.sds_mppt_map_mppt1_power_device_50m3y30": makeSensor(
        "sensor.sds_mppt_map_mppt1_power_device_50m3y30",
        "W",
        "MPPT 1 Power",
      ),
      "sensor.sds_mppt_map_mppt2_power_device_50m3y30": makeSensor(
        "sensor.sds_mppt_map_mppt2_power_device_50m3y30",
        "W",
        "MPPT 2 Power",
      ),
    };

    const result = autoPopulatePanelEntities(
      panels,
      states,
      "power_entity",
      "mppt",
      (unit) => unit === "w",
    );

    expect(result.panels.map((panel) => panel.power_entity)).toEqual([
      undefined,
      "sensor.sds_mppt_map_mppt2_power_device_30m3y10",
      "sensor.sds_mppt_map_mppt1_power_device_40m3y20",
      "sensor.sds_mppt_map_mppt2_power_device_40m3y20",
      "sensor.sds_mppt_map_mppt1_power_device_50m3y30",
      "sensor.sds_mppt_map_mppt2_power_device_50m3y30",
    ]);
    expect(result.filled).toBe(5);
    expect(result.skipped).toBe(1);
  });

  it("matches energy sensors by friendly name with case-insensitive search", () => {
    const panels: PanelConfig[] = [
      { id: "panel-1", energy_entity: undefined },
      { id: "panel-2", energy_entity: undefined },
    ];

    const states: Record<string, HassEntity> = {
      "sensor.energy_a": makeSensor("sensor.energy_a", "kWh", "Panel Daily Energy 1"),
      "sensor.energy_b": makeSensor("sensor.energy_b", "Wh", "Panel Daily Energy 2"),
      "sensor.energy_c": makeSensor("sensor.energy_c", "kWh", "Battery Daily Energy"),
    };

    const result = autoPopulatePanelEntities(
      panels,
      states,
      "energy_entity",
      "panel daily energy",
      (unit) => unit === "kwh" || unit === "wh",
    );

    expect(result.panels.map((panel) => panel.energy_entity)).toEqual([
      "sensor.energy_a",
      "sensor.energy_b",
    ]);
    expect(result.matched).toBe(2);
  });

  it("uses entity id prefix mode when search starts with sensor dot", () => {
    const panels: PanelConfig[] = [{ id: "panel-1", power_entity: undefined }];

    const states: Record<string, HassEntity> = {
      "sensor.real_power_1": makeSensor("sensor.real_power_1", "W", "Friendly Power 1"),
      "sensor.other_power_1": makeSensor("sensor.other_power_1", "W", "sensor.real power 2"),
    };

    const result = autoPopulatePanelEntities(
      panels,
      states,
      "power_entity",
      "sensor.real_power",
      (unit) => unit === "w",
    );

    expect(result.panels[0].power_entity).toBe("sensor.real_power_1");
    expect(result.matched).toBe(1);
  });

  it("supports wildcard suffix in prefix input", () => {
    const panels: PanelConfig[] = [{ id: "panel-1", power_entity: undefined }];

    const states: Record<string, HassEntity> = {
      "sensor.slx_powerdc1": makeSensor("sensor.slx_powerdc1", "W"),
    };

    const result = autoPopulatePanelEntities(
      panels,
      states,
      "power_entity",
      "sensor.slx_powerdc*",
      (unit) => unit === "w",
    );

    expect(result.panels[0].power_entity).toBe("sensor.slx_powerdc1");
    expect(result.matched).toBe(1);
    expect(result.filled).toBe(1);
  });

  it("matches prefix with exact case-sensitive startsWith", () => {
    const panels: PanelConfig[] = [{ id: "panel-1", power_entity: undefined }];
    const states: Record<string, HassEntity> = {
      "sensor.slx_powerdc1": makeSensor("sensor.slx_powerdc1", "W"),
    };

    const result = autoPopulatePanelEntities(
      panels,
      states,
      "power_entity",
      "sensor.slx_powerdc",
      (unit) => unit === "w",
    );

    expect(result.panels[0].power_entity).toBe("sensor.slx_powerdc1");
    expect(result.matched).toBe(1);
    expect(result.filled).toBe(1);
  });

  it("does not match when case differs", () => {
    const panels: PanelConfig[] = [{ id: "panel-1", power_entity: undefined }];
    const states: Record<string, HassEntity> = {
      "sensor.slx_powerdc1": makeSensor("sensor.slx_powerdc1", "W"),
    };

    const result = autoPopulatePanelEntities(
      panels,
      states,
      "power_entity",
      "sensor.slx_powerDC",
      (unit) => unit === "w",
    );

    expect(result.panels[0].power_entity).toBeUndefined();
    expect(result.matched).toBe(0);
    expect(result.filled).toBe(0);
  });

  it("repopulates all slots when caller clears existing assignments first", () => {
    const existingPanels: PanelConfig[] = [
      { id: "panel-1", power_entity: "sensor.old_1" },
      { id: "panel-2", power_entity: "sensor.old_2" },
      { id: "panel-3", power_entity: "sensor.old_3" },
    ];
    const cleared = existingPanels.map((panel) => ({ ...panel, power_entity: undefined }));
    const states: Record<string, HassEntity> = {
      "sensor.slx_powerdc1": makeSensor("sensor.slx_powerdc1", "W"),
      "sensor.slx_powerdc2": makeSensor("sensor.slx_powerdc2", "W"),
      "sensor.slx_powerdc3": makeSensor("sensor.slx_powerdc3", "W"),
    };

    const result = autoPopulatePanelEntities(
      cleared,
      states,
      "power_entity",
      "sensor.slx_powerdc",
      (unit) => unit === "w",
    );

    expect(result.panels.map((panel) => panel.power_entity)).toEqual([
      "sensor.slx_powerdc1",
      "sensor.slx_powerdc2",
      "sensor.slx_powerdc3",
    ]);
  });

  it("skips hidden panel slots during auto-population", () => {
    const panels: PanelConfig[] = [
      { id: "panel-1", enabled: true, power_entity: undefined },
      { id: "panel-2", enabled: false, power_entity: undefined },
      { id: "panel-3", enabled: true, power_entity: undefined },
    ];
    const states: Record<string, HassEntity> = {
      "sensor.slx_powerdc1": makeSensor("sensor.slx_powerdc1", "W"),
      "sensor.slx_powerdc2": makeSensor("sensor.slx_powerdc2", "W"),
      "sensor.slx_powerdc3": makeSensor("sensor.slx_powerdc3", "W"),
    };

    const result = autoPopulatePanelEntities(
      panels,
      states,
      "power_entity",
      "sensor.slx_powerdc",
      (unit) => unit === "w",
    );

    expect(result.panels.map((panel) => panel.power_entity)).toEqual([
      "sensor.slx_powerdc1",
      undefined,
      "sensor.slx_powerdc2",
    ]);
  });
});

describe("autoPopulateEnergyEntitiesByPowerAnchor", () => {
  it("assigns one inverter daily energy sensor only once per serial group", () => {
    const panels: PanelConfig[] = [
      {
        id: "panel-1",
        power_entity: "sensor.sds_mppt_map_mppt1_power_device_30m3y10",
      },
      {
        id: "panel-2",
        power_entity: "sensor.sds_mppt_map_mppt2_power_device_30m3y10",
      },
      {
        id: "panel-3",
        power_entity: "sensor.sds_mppt_map_mppt1_power_device_40m3y20",
      },
    ];
    const states: Record<string, HassEntity> = {
      "sensor.sds_mppt_map_mppt1_power_device_30m3y10": makeSensor(
        "sensor.sds_mppt_map_mppt1_power_device_30m3y10",
        "W",
        "MPPT 1 Power",
      ),
      "sensor.sds_mppt_map_mppt2_power_device_30m3y10": makeSensor(
        "sensor.sds_mppt_map_mppt2_power_device_30m3y10",
        "W",
        "MPPT 2 Power",
      ),
      "sensor.sds_mppt_map_mppt1_power_device_40m3y20": makeSensor(
        "sensor.sds_mppt_map_mppt1_power_device_40m3y20",
        "W",
        "MPPT 1 Power",
      ),
      "sensor.daily_yield_device_30m3y10": makeSensor(
        "sensor.daily_yield_device_30m3y10",
        "kWh",
        "Daily Yield",
      ),
      "sensor.daily_yield_device_40m3y20": makeSensor(
        "sensor.daily_yield_device_40m3y20",
        "kWh",
        "Daily Yield",
      ),
    };

    const result = autoPopulateEnergyEntitiesByPowerAnchor(
      panels,
      states,
      "daily",
      (unit) => unit === "kwh" || unit === "wh",
    );

    expect(result.panels.map((panel) => panel.energy_entity)).toEqual([
      "sensor.daily_yield_device_30m3y10",
      undefined,
      "sensor.daily_yield_device_40m3y20",
    ]);
    expect(result.matched).toBe(2);
    expect(result.filled).toBe(2);
  });

  it("can assign one inverter daily energy sensor to every matching string panel when sharing is enabled", () => {
    const panels: PanelConfig[] = [
      {
        id: "panel-1",
        power_entity: "sensor.sds_mppt_map_mppt1_power_device_30m3y10",
      },
      {
        id: "panel-2",
        power_entity: "sensor.sds_mppt_map_mppt2_power_device_30m3y10",
      },
      {
        id: "panel-3",
        power_entity: "sensor.sds_mppt_map_mppt1_power_device_40m3y20",
      },
    ];
    const states: Record<string, HassEntity> = {
      "sensor.sds_mppt_map_mppt1_power_device_30m3y10": makeSensor(
        "sensor.sds_mppt_map_mppt1_power_device_30m3y10",
        "W",
        "MPPT 1 Power",
      ),
      "sensor.sds_mppt_map_mppt2_power_device_30m3y10": makeSensor(
        "sensor.sds_mppt_map_mppt2_power_device_30m3y10",
        "W",
        "MPPT 2 Power",
      ),
      "sensor.sds_mppt_map_mppt1_power_device_40m3y20": makeSensor(
        "sensor.sds_mppt_map_mppt1_power_device_40m3y20",
        "W",
        "MPPT 1 Power",
      ),
      "sensor.daily_yield_device_30m3y10": makeSensor(
        "sensor.daily_yield_device_30m3y10",
        "kWh",
        "Daily Yield",
      ),
      "sensor.daily_yield_device_40m3y20": makeSensor(
        "sensor.daily_yield_device_40m3y20",
        "kWh",
        "Daily Yield",
      ),
    };

    const result = autoPopulateEnergyEntitiesByPowerAnchor(
      panels,
      states,
      "daily",
      (unit) => unit === "kwh" || unit === "wh",
      "auto",
      { shareSingleGroupEnergy: true },
    );

    expect(result.panels.map((panel) => panel.energy_entity)).toEqual([
      "sensor.daily_yield_device_30m3y10",
      "sensor.daily_yield_device_30m3y10",
      "sensor.daily_yield_device_40m3y20",
    ]);
    expect(result.matched).toBe(2);
    expect(result.filled).toBe(3);
  });

  it("finds one Yield Today energy sensor per trailing serial group by friendly name and energy device class", () => {
    const panels: PanelConfig[] = [
      {
        id: "panel-1",
        power_entity: "sensor.slx_powerdc1_3030t",
      },
      {
        id: "panel-2",
        power_entity: "sensor.slx_powerdc2_3030t",
      },
      {
        id: "panel-3",
        power_entity: "sensor.slx_powerdc1_3030l",
      },
      {
        id: "panel-4",
        power_entity: "sensor.slx_powerdc2_3030l",
      },
    ];
    const states: Record<string, HassEntity> = {
      "sensor.slx_powerdc1_3030t": makeSensor(
        "sensor.slx_powerdc1_3030t",
        "W",
        "DC Power String 1",
      ),
      "sensor.slx_powerdc2_3030t": makeSensor(
        "sensor.slx_powerdc2_3030t",
        "W",
        "DC Power String 2",
      ),
      "sensor.slx_powerdc1_3030l": makeSensor(
        "sensor.slx_powerdc1_3030l",
        "W",
        "DC Power String 1",
      ),
      "sensor.slx_powerdc2_3030l": makeSensor(
        "sensor.slx_powerdc2_3030l",
        "W",
        "DC Power String 2",
      ),
      "sensor.slx_yieldtoday_3030t": makeSensor(
        "sensor.slx_yieldtoday_3030t",
        "",
        "Yield Today",
        { device_class: "energy" },
      ),
      "sensor.slx_yieldtoday_3030l": makeSensor(
        "sensor.slx_yieldtoday_3030l",
        "",
        "Yield Today",
        { device_class: "energy" },
      ),
    };

    const result = autoPopulateEnergyEntitiesByPowerAnchor(
      panels,
      states,
      "Yield Today",
      (unit, entity) => unit === "kwh" || unit === "wh" || entity.attributes?.device_class === "energy",
    );

    expect(result.panels.map((panel) => panel.energy_entity)).toEqual([
      "sensor.slx_yieldtoday_3030t",
      undefined,
      "sensor.slx_yieldtoday_3030l",
      undefined,
    ]);
    expect(result.matched).toBe(2);
    expect(result.filled).toBe(2);
  });

  it("matches per-panel daily energy sensors by local tokens within the same serial", () => {
    const panels: PanelConfig[] = [
      {
        id: "panel-1",
        power_entity: "sensor.sds_mppt_map_mppt1_power_device_30m3y10",
      },
      {
        id: "panel-2",
        power_entity: "sensor.sds_mppt_map_mppt2_power_device_30m3y10",
      },
    ];
    const states: Record<string, HassEntity> = {
      "sensor.sds_mppt_map_mppt1_power_device_30m3y10": makeSensor(
        "sensor.sds_mppt_map_mppt1_power_device_30m3y10",
        "W",
        "MPPT 1 Power",
      ),
      "sensor.sds_mppt_map_mppt2_power_device_30m3y10": makeSensor(
        "sensor.sds_mppt_map_mppt2_power_device_30m3y10",
        "W",
        "MPPT 2 Power",
      ),
      "sensor.sds_mppt_map_mppt1_daily_device_30m3y10": makeSensor(
        "sensor.sds_mppt_map_mppt1_daily_device_30m3y10",
        "kWh",
        "MPPT 1 Daily Yield",
      ),
      "sensor.sds_mppt_map_mppt2_daily_device_30m3y10": makeSensor(
        "sensor.sds_mppt_map_mppt2_daily_device_30m3y10",
        "kWh",
        "MPPT 2 Daily Yield",
      ),
    };

    const result = autoPopulateEnergyEntitiesByPowerAnchor(
      panels,
      states,
      "daily",
      (unit) => unit === "kwh" || unit === "wh",
    );

    expect(result.panels.map((panel) => panel.energy_entity)).toEqual([
      "sensor.sds_mppt_map_mppt1_daily_device_30m3y10",
      "sensor.sds_mppt_map_mppt2_daily_device_30m3y10",
    ]);
  });

  it("does not use another input's daily energy sensor when a local match is missing", () => {
    const panels: PanelConfig[] = [
      {
        id: "panel-1",
        power_entity: "sensor.sds_mppt_map_mppt1_power_device_30m3y10",
      },
      {
        id: "panel-2",
        power_entity: "sensor.sds_mppt_map_mppt2_power_device_30m3y10",
      },
    ];
    const states: Record<string, HassEntity> = {
      "sensor.sds_mppt_map_mppt1_power_device_30m3y10": makeSensor(
        "sensor.sds_mppt_map_mppt1_power_device_30m3y10",
        "W",
        "MPPT 1 Power",
      ),
      "sensor.sds_mppt_map_mppt2_power_device_30m3y10": makeSensor(
        "sensor.sds_mppt_map_mppt2_power_device_30m3y10",
        "W",
        "MPPT 2 Power",
      ),
      "sensor.sds_mppt_map_mppt1_daily_device_30m3y10": makeSensor(
        "sensor.sds_mppt_map_mppt1_daily_device_30m3y10",
        "kWh",
        "MPPT 1 Daily Yield",
      ),
      "sensor.daily_yield_device_30m3y10": makeSensor(
        "sensor.daily_yield_device_30m3y10",
        "kWh",
        "Daily Yield",
      ),
    };

    const result = autoPopulateEnergyEntitiesByPowerAnchor(
      panels,
      states,
      "daily",
      (unit) => unit === "kwh" || unit === "wh",
    );

    expect(result.panels.map((panel) => panel.energy_entity)).toEqual([
      "sensor.sds_mppt_map_mppt1_daily_device_30m3y10",
      undefined,
    ]);
  });

  it("falls back to normal slot order when power serial groups cannot be detected", () => {
    const panels: PanelConfig[] = [
      { id: "panel-1", power_entity: "sensor.panel_1_power" },
      { id: "panel-2", power_entity: "sensor.panel_2_power" },
    ];
    const states: Record<string, HassEntity> = {
      "sensor.panel_1_power": makeSensor("sensor.panel_1_power", "W"),
      "sensor.panel_2_power": makeSensor("sensor.panel_2_power", "W"),
      "sensor.panel_1_daily": makeSensor("sensor.panel_1_daily", "kWh", "Panel 1 Daily"),
      "sensor.panel_2_daily": makeSensor("sensor.panel_2_daily", "kWh", "Panel 2 Daily"),
    };

    const result = autoPopulateEnergyEntitiesByPowerAnchor(
      panels,
      states,
      "daily",
      (unit) => unit === "kwh" || unit === "wh",
    );

    expect(result.panels.map((panel) => panel.energy_entity)).toEqual([
      "sensor.panel_1_daily",
      "sensor.panel_2_daily",
    ]);
  });

  it("uses the first enabled panel in a serial group for shared daily energy", () => {
    const panels: PanelConfig[] = [
      {
        id: "panel-1",
        enabled: false,
        power_entity: "sensor.sds_mppt_map_mppt1_power_device_30m3y10",
      },
      {
        id: "panel-2",
        power_entity: "sensor.sds_mppt_map_mppt2_power_device_30m3y10",
      },
      {
        id: "panel-3",
        power_entity: "sensor.sds_mppt_map_mppt1_power_device_40m3y20",
      },
    ];
    const states: Record<string, HassEntity> = {
      "sensor.sds_mppt_map_mppt1_power_device_30m3y10": makeSensor(
        "sensor.sds_mppt_map_mppt1_power_device_30m3y10",
        "W",
        "MPPT 1 Power",
      ),
      "sensor.sds_mppt_map_mppt2_power_device_30m3y10": makeSensor(
        "sensor.sds_mppt_map_mppt2_power_device_30m3y10",
        "W",
        "MPPT 2 Power",
      ),
      "sensor.sds_mppt_map_mppt1_power_device_40m3y20": makeSensor(
        "sensor.sds_mppt_map_mppt1_power_device_40m3y20",
        "W",
        "MPPT 1 Power",
      ),
      "sensor.daily_yield_device_30m3y10": makeSensor(
        "sensor.daily_yield_device_30m3y10",
        "kWh",
        "Daily Yield",
      ),
      "sensor.daily_yield_device_40m3y20": makeSensor(
        "sensor.daily_yield_device_40m3y20",
        "kWh",
        "Daily Yield",
      ),
    };

    const result = autoPopulateEnergyEntitiesByPowerAnchor(
      panels,
      states,
      "daily",
      (unit) => unit === "kwh" || unit === "wh",
    );

    expect(result.panels.map((panel) => panel.energy_entity)).toEqual([
      undefined,
      "sensor.daily_yield_device_30m3y10",
      "sensor.daily_yield_device_40m3y20",
    ]);
  });
});

describe("shouldAutoRenamePanelName", () => {
  it("allows names that match the previous power sensor friendly name", () => {
    expect(
      shouldAutoRenamePanelName(
        "Old MPPT Power 1",
        "panel-1",
        "sensor.old_mppt_1",
        (entityId) =>
          entityId === "sensor.old_mppt_1" ? "Old MPPT Power 1" : undefined,
      ),
    ).toBe(true);
  });

  it("preserves custom panel names", () => {
    expect(
      shouldAutoRenamePanelName(
        "South roof string",
        "panel-1",
        "sensor.old_mppt_1",
        (entityId) =>
          entityId === "sensor.old_mppt_1" ? "Old MPPT Power 1" : undefined,
      ),
    ).toBe(false);
  });
});

describe("applyAutoPopulateFriendlyNames", () => {
  const friendlyNames: Record<string, string> = {
    "sensor.old_mppt_1": "Old MPPT Power 1",
    "sensor.new_mppt_1": "MPPT 1 Power",
    "sensor.new_mppt_2": "MPPT 2 Power",
  };
  const resolveFriendlyName = (entityId: string | undefined): string | undefined =>
    entityId ? friendlyNames[entityId] : undefined;

  it("renames populated panels to the selected sensor friendly name", () => {
    const populatedPanels: PanelConfig[] = [
      {
        id: "panel-1",
        name: "AC Power1",
        power_entity: "sensor.new_mppt_1",
      },
    ];

    const result = applyAutoPopulateFriendlyNames(
      populatedPanels,
      resolveFriendlyName,
    );

    expect(result[0].name).toBe("MPPT 1 Power");
  });

  it("renames default panel names to the populated sensor friendly name", () => {
    const result = applyAutoPopulateFriendlyNames(
      [{ id: "panel-2", name: "Panel 2", power_entity: "sensor.new_mppt_2" }],
      resolveFriendlyName,
    );

    expect(result[0].name).toBe("MPPT 2 Power");
  });

  it("leaves the existing name when the populated sensor has no friendly name", () => {
    const result = applyAutoPopulateFriendlyNames(
      [
        {
          id: "panel-1",
          name: "South roof string",
          power_entity: "sensor.unknown_mppt_1",
        },
      ],
      resolveFriendlyName,
    );

    expect(result[0].name).toBe("South roof string");
  });
});
