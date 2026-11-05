import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("editor markup", () => {
  it("uses native inputs for text fields so core setup controls cannot disappear", () => {
    const source = readFileSync("src/solar-panel-visualizer-editor.ts", "utf8");

    expect(source).not.toContain("<ha-textfield");
    expect(source).toContain('class="text-input"');
    expect(source).toContain("_renderEditorInput");
  });

  it("renders switch labels through the Home Assistant switch slot", () => {
    const editorSource = readFileSync("src/solar-panel-visualizer-editor.ts", "utf8");
    const cardSource = readFileSync("src/solar-panel-visualizer-card.ts", "utf8");

    expect(editorSource).not.toContain("ha-formfield");
    expect(cardSource).not.toContain("ha-formfield");
    expect(editorSource.match(/<ha-switch/g)).toHaveLength(17);
    expect(cardSource.match(/<ha-switch/g)).toHaveLength(1);
    expect(editorSource).toContain('>${this._t("editor.toggle.motion_enabled")}</ha-switch>');
    expect(cardSource).toContain(">Disable Panel (hide but keep slot when off)</ha-switch>");
  });

  it("includes an editor-only auto-fill sort mode selector", () => {
    const source = readFileSync("src/solar-panel-visualizer-editor.ts", "utf8");

    expect(source).toContain("_renderAutoFillSortModeField");
    expect(source).toContain('value: "grouped"');
    expect(source).toContain("_autoFillSortMode");
    expect(source).not.toContain("autofill_sort_mode:");
  });

  it("includes editor-only status and advanced telemetry auto-fill controls", () => {
    const source = readFileSync("src/solar-panel-visualizer-editor.ts", "utf8");

    expect(source).toContain("_autoFillInverterStatus");
    expect(source).toContain("_autoFillStatusPrefix");
    expect(source).toContain("editor.field.status_prefix");
    expect(source).toContain("editor.toggle.autofill_inverter_status");
    expect(source).toContain("autoPopulateInverterStatusEntities");
    expect(source).toContain('class="autofill-option"');
    expect(source).toContain('type="checkbox"');
    expect(source).not.toContain("autofill_inverter_status:");
    expect(source).not.toContain("autofill_status_prefix:");
    expect(source).toContain("_autoFillAdvancedTelemetry");
    expect(source).toContain("editor.toggle.autofill_advanced_telemetry");
    expect(source).toContain("autoPopulateAdvancedTelemetry");
    expect(source).not.toContain("autofill_advanced_telemetry:");
  });

  it("includes saved string setup tree controls and removes the old auto-fill repeat field", () => {
    const source = readFileSync("src/solar-panel-visualizer-editor.ts", "utf8");

    expect(source).toContain("_renderStringSetupSection");
    expect(source).toContain("editor.toggle.enable_string_sensor_sharing");
    expect(source).toContain("editor.field.string_group_count");
    expect(source).toContain("editor.field.string_group_panel_count");
    expect(source).toContain("editor.field.string_group_power_sensor");
    expect(source).toContain("editor.field.string_group_energy_sensor");
    expect(source).toContain("enable_string_sensor_sharing");
    expect(source).toContain("allowDuplicatePanelSensors");
    expect(source).not.toContain("_autoFillPanelsPerString");
    expect(source).not.toContain("editor.field.autofill_panels_per_string");
    expect(source).not.toContain("autofill_panels_per_string:");
  });
});
