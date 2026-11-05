import { LitElement, css, html, nothing } from "lit";
import {
  CARD_TYPE,
  MAX_LAYOUT_DIMENSION,
  MAX_PANEL_RATED_POWER_W,
  normalizeConfig,
} from "./config";
import {
  autoPopulateAdvancedTelemetry,
  autoPopulateEnergyEntitiesByPowerAnchor,
  autoPopulateInverterStatusEntities,
  applyAutoPopulateFriendlyNames,
  type AutoPopulateSortMode,
  autoPopulatePanelEntities,
  shouldAutoRenamePanelName,
} from "./editor-autofill";
import { translate, type TranslationKey } from "./i18n";
import { naturalCompare } from "./natural-sort";
import type {
  HassEntity,
  HomeAssistant,
  PanelConfig,
  SolarPanelVisualizerConfig,
  StringGroupConfig,
} from "./types";

const CARD_CONFIG_SYNC_EVENT = "spv-card-config-updated";

const fireConfigChanged = (
  element: HTMLElement,
  config: SolarPanelVisualizerConfig,
): void => {
  element.dispatchEvent(
    new CustomEvent("config-changed", {
      detail: { config },
      bubbles: true,
      composed: true,
    }),
  );
};

const normalizeAttr = (value: unknown): string =>
  typeof value === "string" ? value.trim().toLowerCase() : "";

const unitIs = (entity: HassEntity, units: string[]): boolean => {
  const normalizedUnit = normalizeAttr(entity.attributes?.unit_of_measurement);
  return normalizedUnit.length > 0 && units.includes(normalizedUnit);
};

const deviceClassIs = (entity: HassEntity, classes: string[]): boolean => {
  const normalizedDeviceClass = normalizeAttr(entity.attributes?.device_class);
  return normalizedDeviceClass.length > 0 && classes.includes(normalizedDeviceClass);
};

const entityMatchesPanelPower = (normalizedUnit: string, entity: HassEntity): boolean =>
  ["w", "kw"].includes(normalizedUnit) || deviceClassIs(entity, ["power"]);

const entityMatchesPanelEnergy = (normalizedUnit: string, entity: HassEntity): boolean =>
  ["wh", "kwh", "mwh"].includes(normalizedUnit) || deviceClassIs(entity, ["energy"]);

const getStateEntityId = (entityId: string, entity: HassEntity): string =>
  typeof entity.entity_id === "string" && entity.entity_id.trim().length > 0
    ? entity.entity_id
    : entityId;

interface AdvancedMetricFieldDef {
  key: keyof NonNullable<PanelConfig["advanced_metrics"]>;
  labelKey: TranslationKey;
  matcher: (entity: HassEntity) => boolean;
}

const ADVANCED_METRIC_FIELDS = [
  {
    key: "inverter_ac_power_entity",
    labelKey: "editor.field.advanced_inverter_ac_power",
    matcher: (entity: HassEntity) =>
      unitIs(entity, ["w", "kw"]) || deviceClassIs(entity, ["power"]),
  },
  {
    key: "inverter_ac_voltage_entity",
    labelKey: "editor.field.advanced_inverter_ac_voltage",
    matcher: (entity: HassEntity) =>
      unitIs(entity, ["v", "kv", "mv"]) || deviceClassIs(entity, ["voltage"]),
  },
  {
    key: "inverter_ac_current_entity",
    labelKey: "editor.field.advanced_inverter_ac_current",
    matcher: (entity: HassEntity) =>
      unitIs(entity, ["a", "ma"]) || deviceClassIs(entity, ["current"]),
  },
  {
    key: "inverter_temp_entity",
    labelKey: "editor.field.advanced_inverter_temp",
    matcher: (entity: HassEntity) =>
      deviceClassIs(entity, ["temperature"]) ||
      unitIs(entity, ["\u00b0c", "\u00b0f", "\u2103", "\u2109", "c", "f"]),
  },
  {
    key: "panel_current_entity",
    labelKey: "editor.field.advanced_panel_current",
    matcher: (entity: HassEntity) =>
      unitIs(entity, ["a", "ma"]) || deviceClassIs(entity, ["current"]),
  },
  {
    key: "panel_voltage_entity",
    labelKey: "editor.field.advanced_panel_voltage",
    matcher: (entity: HassEntity) =>
      unitIs(entity, ["v", "kv", "mv"]) || deviceClassIs(entity, ["voltage"]),
  },
  {
    key: "panel_power_entity",
    labelKey: "editor.field.advanced_panel_power",
    matcher: (entity: HassEntity) =>
      unitIs(entity, ["w", "kw"]) || deviceClassIs(entity, ["power"]),
  },
] as const satisfies readonly AdvancedMetricFieldDef[];

type AdvancedMetricKey = (typeof ADVANCED_METRIC_FIELDS)[number]["key"];

export class SolarPanelVisualizerBaseCardEditor extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
    _autoFillPowerPrefix: { state: true },
    _autoFillEnergyPrefix: { state: true },
    _autoFillStatusPrefix: { state: true },
    _autoFillSortMode: { state: true },
    _autoFillInverterStatus: { state: true },
    _autoFillAdvancedTelemetry: { state: true },
    _autoFillResultMessage: { state: true },
  };

  static styles = css`
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

  declare hass?: HomeAssistant;
  protected _config: SolarPanelVisualizerConfig = this._normalizeEditorConfig({
    type: this._getCardType(),
  });
  private _autoFillPowerPrefix = "";
  private _autoFillEnergyPrefix = "";
  private _autoFillStatusPrefix = "";
  private _autoFillSortMode: AutoPopulateSortMode = "auto";
  private _autoFillInverterStatus = false;
  private _autoFillAdvancedTelemetry = false;
  private _autoFillResultMessage = "";

  public connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener(CARD_CONFIG_SYNC_EVENT, this._handleCardConfigSync);
  }

  public disconnectedCallback(): void {
    window.removeEventListener(CARD_CONFIG_SYNC_EVENT, this._handleCardConfigSync);
    super.disconnectedCallback();
  }

  public setConfig(config: Partial<SolarPanelVisualizerConfig>): void {
    this._config = this._normalizeEditorConfig(config ?? {});
  }

  protected _getCardType(): string {
    return CARD_TYPE;
  }

  protected _normalizeEditorConfig(
    config: Partial<SolarPanelVisualizerConfig>,
  ): SolarPanelVisualizerConfig {
    return normalizeConfig(config);
  }

  protected _renderExtraSections() {
    return nothing;
  }

  protected _t(key: TranslationKey, params?: Record<string, string | number>): string {
    return translate(this.hass, key, params);
  }

  protected render() {
    if (!this.hass) {
      return nothing;
    }
    const hasForecastPowerDefault = Boolean(
      this.hass.states["sensor.power_production_now"],
    );
    const hasForecastEnergyDefault = Boolean(
      this.hass.states["sensor.energy_production_today"],
    );
    const forecastStatus = hasForecastPowerDefault && hasForecastEnergyDefault
      ? this._t("editor.forecast.detected")
      : this._t("editor.forecast.missing");

    return html`
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
            ${this._renderNumberField("rows", this._t("editor.field.rows"), this._config.rows, 1, MAX_LAYOUT_DIMENSION)}
            ${this._renderNumberField(
              "columns",
              this._t("editor.field.columns"),
              this._config.columns,
              1,
              MAX_LAYOUT_DIMENSION,
            )}
            ${this._renderNumberField(
              "max_card_width_px",
              this._t("editor.field.max_card_width"),
              this._config.max_card_width_px ?? 980,
              300,
              2400,
            )}
            ${this._renderOptionalNumberField(
              "max_card_height_px",
              this._t("editor.field.max_card_height"),
              this._config.max_card_height_px,
              300,
              2600,
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
                { value: "light", label: this._t("editor.select.theme_light") },
              ],
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
              4,
            )}
            ${this._renderNumberField(
              "energy_decimals",
              this._t("editor.field.energy_decimals"),
              this._config.energy_decimals ?? 2,
              0,
              4,
            )}
            ${this._renderNumberField(
              "custom_kpi_decimals",
              this._t("editor.field.custom_kpi_decimals"),
              this._config.custom_kpi_decimals ?? 0,
              0,
              4,
            )}
            ${this._renderSelectField(
              "panel_tap_action",
              this._t("editor.field.panel_tap_action"),
              this._config.panel_tap_action ?? "details",
              [
                { value: "details", label: this._t("editor.select.panel_tap_details") },
                { value: "none", label: this._t("editor.select.panel_tap_none") },
              ],
            )}
          </div>
          <div class="toggle">
            <ha-switch
              .checked=${this._config.use_system_power_entity ?? false}
              @change=${(event: Event) =>
                this._updateRootValue(
                  "use_system_power_entity",
                  (event.currentTarget as HTMLInputElement).checked,
                )}
            >${this._t("editor.toggle.use_system_power")}</ha-switch>
          </div>
          ${this._renderSelectorWithClear(
            this._t("editor.field.system_power_sensor"),
            this._config.system_power_entity,
            {
              entity: {
                domain: "sensor",
              },
            },
            (nextValue) => this._updateRootValue("system_power_entity", nextValue),
          )}
          <div class="toggle">
            <ha-switch
              .checked=${this._config.invert_system_power ?? false}
              @change=${(event: Event) =>
                this._updateRootValue(
                  "invert_system_power",
                  (event.currentTarget as HTMLInputElement).checked,
                )}
            >${this._t("editor.toggle.invert_system_power")}</ha-switch>
          </div>
          <div class="toggle">
            <ha-switch
              .checked=${this._config.use_system_energy_entity ?? false}
              @change=${(event: Event) =>
                this._updateRootValue(
                  "use_system_energy_entity",
                  (event.currentTarget as HTMLInputElement).checked,
                )}
            >${this._t("editor.toggle.use_system_energy")}</ha-switch>
          </div>
          ${this._renderSelectorWithClear(
            this._t("editor.field.system_energy_sensor"),
            this._config.system_energy_entity,
            {
              entity: {
                domain: "sensor",
              },
            },
            (nextValue) => this._updateRootValue("system_energy_entity", nextValue),
          )}
          ${this._renderSelectorWithClear(
            this._t("editor.field.custom_kpi_sensor"),
            this._config.custom_kpi_entity,
            {
              entity: {
                domain: "sensor",
              },
            },
            (nextValue) => this._updateRootValue("custom_kpi_entity", nextValue),
          )}
          <div class="toggle">
            <ha-switch
              .checked=${this._config.invert_custom_kpi ?? false}
              @change=${(event: Event) =>
                this._updateRootValue(
                  "invert_custom_kpi",
                  (event.currentTarget as HTMLInputElement).checked,
                )}
            >${this._t("editor.toggle.invert_custom_kpi")}</ha-switch>
          </div>
          ${this._renderTextField(
            "custom_kpi_title",
            this._t("editor.field.custom_kpi_heading"),
            this._config.custom_kpi_title ?? "",
          )}
          <div class="toggle">
            <ha-switch
              .checked=${this._config.show_custom_kpi ?? true}
              @change=${(event: Event) =>
                this._updateRootValue(
                  "show_custom_kpi",
                  (event.currentTarget as HTMLInputElement).checked,
                )}
            >${this._t("editor.toggle.show_custom_kpi")}</ha-switch>
          </div>
          <div class="toggle">
            <ha-switch
              .checked=${this._config.limit_panel_width ?? false}
              @change=${(event: Event) =>
                this._updateRootValue(
                  "limit_panel_width",
                  (event.currentTarget as HTMLInputElement).checked,
                )}
            >${this._t("editor.toggle.limit_panel_width")}</ha-switch>
          </div>
          ${this._renderEditorInput(
            this._t("editor.field.max_panel_tile_width"),
            String(this._config.panel_max_width_px ?? 220),
            (value) =>
              this._updateRootValue(
                "panel_max_width_px",
                this._parseNumberWithClamp(
                  value,
                  this._config.panel_max_width_px ?? 220,
                  120,
                  320,
                ),
              ),
            {
              type: "number",
              min: 120,
              max: 320,
              disabled: !(this._config.limit_panel_width ?? false),
              updateOn: "change",
            },
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
            <ha-switch
              .checked=${this._config.enable_forecast_overlay ?? false}
              @change=${(event: Event) =>
                this._updateRootValue(
                  "enable_forecast_overlay",
                  (event.currentTarget as HTMLInputElement).checked,
                )}
            >${this._t("editor.toggle.enable_forecast_overlay")}</ha-switch>
          </div>
          <p class="section-copy">${forecastStatus}</p>
        </section>

        <section class="section">
          <div class="section-header">
            <h3 class="section-title">${this._t("editor.section.array_health_title")}</h3>
            <p class="section-copy">
              ${this._t("editor.section.array_health_copy")}
            </p>
          </div>
          <div class="toggle">
            <ha-switch
              .checked=${this._config.enable_array_checks ?? false}
              @change=${(event: Event) =>
                this._updateRootValue(
                  "enable_array_checks",
                  (event.currentTarget as HTMLInputElement).checked,
                )}
            >${this._t("editor.toggle.enable_array_health")}</ha-switch>
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
              100,
            )}
            ${this._renderNumberField(
              "deviation_absolute_w_threshold",
              this._t("editor.field.deviation_absolute_shortfall"),
              this._config.deviation_absolute_w_threshold ?? 50,
              0,
              5000,
            )}
            ${this._renderNumberField(
              "deviation_min_runtime_minutes",
              this._t("editor.field.deviation_check_time"),
              this._config.deviation_min_runtime_minutes ?? 15,
              0,
              1440,
            )}
            ${this._renderNumberField(
              "deviation_min_active_panels",
              this._t("editor.field.deviation_min_active_panels"),
              this._config.deviation_min_active_panels ?? 3,
              2,
              30,
            )}
            ${this._renderNumberField(
              "deviation_min_samples",
              this._t("editor.field.deviation_min_samples"),
              this._config.deviation_min_samples ?? 3,
              1,
              120,
            )}
            ${this._renderNumberField(
              "deviation_smoothing_minutes",
              this._t("editor.field.deviation_smoothing"),
              this._config.deviation_smoothing_minutes ?? 0,
              0,
              1440,
            )}
            ${this._renderNumberField(
              "deviation_dynamic_floor_w",
              this._t("editor.field.deviation_dynamic_floor"),
              this._config.deviation_dynamic_floor_w ?? 20,
              0,
              5000,
            )}
            ${this._renderNumberField(
              "deviation_history_hours",
              this._t("editor.field.deviation_history_window"),
              this._config.deviation_history_hours ?? 12,
              1,
              168,
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
            <ha-switch
              .checked=${this._config.enable_inverter_status ?? false}
              @change=${(event: Event) =>
                this._updateRootValue(
                  "enable_inverter_status",
                  (event.currentTarget as HTMLInputElement).checked,
                )}
            >${this._t("editor.toggle.enable_inverter_status")}</ha-switch>
            <ha-switch
              .checked=${this._config.show_inverter_status_on_tiles ?? false}
              @change=${(event: Event) =>
                this._updateRootValue(
                  "show_inverter_status_on_tiles",
                  (event.currentTarget as HTMLInputElement).checked,
                )}
            >${this._t("editor.toggle.show_inverter_status_tiles")}</ha-switch>
          </div>
          ${this._renderEditorInput(
            this._t("editor.field.fault_terms"),
            (this._config.inverter_fault_terms ?? []).join(", "),
            (value) =>
              this._updateRootValue(
                "inverter_fault_terms",
                value,
              ),
          )}
          ${this._renderEditorInput(
            this._t("editor.field.working_terms"),
            (this._config.inverter_working_terms ?? []).join(", "),
            (value) =>
              this._updateRootValue(
                "inverter_working_terms",
                value,
              ),
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
                value: (this._config.production_color_intensity ?? 1).toFixed(2),
              })}
            </span>
            <input
              type="range"
              min="0.2"
              max="1.6"
              step="0.05"
              .value=${String(this._config.production_color_intensity ?? 1)}
              @input=${(event: Event) =>
                this._updateRootValue(
                  "production_color_intensity",
                  Number((event.currentTarget as HTMLInputElement).value),
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
            <ha-switch
              .checked=${this._config.motion_enabled ?? true}
              @change=${(event: Event) =>
                this._updateRootValue(
                  "motion_enabled",
                  (event.currentTarget as HTMLInputElement).checked,
                )}
            >${this._t("editor.toggle.motion_enabled")}</ha-switch>
          </div>
          <div class="toggle">
            <ha-switch
              .checked=${this._config.motion_power_flow ?? true}
              @change=${(event: Event) =>
                this._updateRootValue(
                  "motion_power_flow",
                  (event.currentTarget as HTMLInputElement).checked,
                )}
            >${this._t("editor.toggle.motion_power_flow")}</ha-switch>
          </div>
          <div class="toggle">
            <ha-switch
              .checked=${this._config.motion_update_shimmer ?? true}
              @change=${(event: Event) =>
                this._updateRootValue(
                  "motion_update_shimmer",
                  (event.currentTarget as HTMLInputElement).checked,
                )}
            >${this._t("editor.toggle.motion_update_shimmer")}</ha-switch>
          </div>
          <div class="toggle">
            <ha-switch
              .checked=${this._config.motion_alert_ripple ?? true}
              @change=${(event: Event) =>
                this._updateRootValue(
                  "motion_alert_ripple",
                  (event.currentTarget as HTMLInputElement).checked,
                )}
            >${this._t("editor.toggle.motion_alert_ripple")}</ha-switch>
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
                MAX_PANEL_RATED_POWER_W,
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
                (value) => {
                  this._autoFillPowerPrefix = value;
                },
              )}
              ${this._renderEditorInput(
                this._t("editor.field.energy_prefix"),
                this._autoFillEnergyPrefix,
                (value) => {
                  this._autoFillEnergyPrefix = value;
                },
              )}
              ${this._renderEditorInput(
                this._t("editor.field.status_prefix"),
                this._autoFillStatusPrefix,
                (value) => {
                  this._autoFillStatusPrefix = value;
                },
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
                @change=${(event: Event) => {
                  this._autoFillInverterStatus =
                    (event.currentTarget as HTMLInputElement).checked;
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
                @change=${(event: Event) => {
                  this._autoFillAdvancedTelemetry =
                    (event.currentTarget as HTMLInputElement).checked;
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
            ${this._autoFillResultMessage
              ? html`<p class="section-copy">${this._autoFillResultMessage}</p>`
              : nothing}
          </div>

          <div class="panel-list">
            ${this._config.panels.map((panel, index) =>
              this._renderPanelEditor(panel, index),
            )}
          </div>
        </section>

        ${this._renderExtraSections()}
      </div>
    `;
  }

  private _renderStringSetupSection() {
    const enabled = this._config.enable_string_sensor_sharing ?? false;
    const groups = this._getStringGroupsForEditor();

    return html`
      <div class="section string-setup-section">
        <div class="section-header">
          <h4 class="section-title">${this._t("editor.section.string_setup_title")}</h4>
          <p class="section-copy">
            ${this._t("editor.section.string_setup_copy")}
          </p>
        </div>
        <div class="toggle">
          <ha-switch
            .checked=${enabled}
            @change=${(event: Event) =>
              this._handleStringSensorSharingToggle(
                (event.currentTarget as HTMLInputElement).checked,
              )}
          >${this._t("editor.toggle.enable_string_sensor_sharing")}</ha-switch>
        </div>
        <p class="section-copy">
          ${this._t("editor.helper.string_sensor_sharing_help")}
        </p>
        ${enabled
          ? html`
              <div class="grid">
                ${this._renderEditorInput(
                  this._t("editor.field.string_group_count"),
                  String(groups.length),
                  (value) => this._updateStringGroupCount(value),
                  {
                    type: "number",
                    min: 1,
                    max: MAX_LAYOUT_DIMENSION,
                    updateOn: "change",
                  },
                )}
              </div>
              <div class="panel-list">
                ${groups.map((group, index) =>
                  this._renderStringGroupEditor(group, index),
                )}
              </div>
            `
          : nothing}
      </div>
    `;
  }

  private _renderStringGroupEditor(group: StringGroupConfig, index: number) {
    const powerSensorEntityIds = this._getStringSensorEntityIdsByUnit(
      group.power_entity,
      entityMatchesPanelPower,
    );
    const energySensorEntityIds = this._getStringSensorEntityIdsByUnit(
      group.energy_entity,
      entityMatchesPanelEnergy,
    );
    const title = group.name ?? `String ${index + 1}`;

    return html`
      <details class="string-group-editor" ?open=${index === 0}>
        <summary>
          <span>${title}</span>
          <span class="chip">
            ${this._t("editor.string_group.panel_count_chip", {
              count: group.panel_count,
            })}
          </span>
        </summary>
        <div class="panel-form">
          <div class="grid">
            ${this._renderEditorInput(
              this._t("editor.field.string_group_name"),
              group.name ?? "",
              (value) => this._updateStringGroupValue(index, "name", value),
              { updateOn: "change" },
            )}
            ${this._renderEditorInput(
              this._t("editor.field.string_group_panel_count"),
              String(group.panel_count),
              (value) =>
                this._updateStringGroupValue(
                  index,
                  "panel_count",
                  this._parseNumberWithClamp(
                    value,
                    group.panel_count,
                    1,
                    MAX_LAYOUT_DIMENSION,
                  ),
                ),
              {
                type: "number",
                min: 1,
                max: MAX_LAYOUT_DIMENSION,
                updateOn: "change",
              },
            )}
          </div>
          ${this._renderSelectorWithClear(
            this._t("editor.field.string_group_power_sensor"),
            group.power_entity,
            {
              entity: {
                domain: "sensor",
                include_entities: powerSensorEntityIds,
              },
            },
            (value) => this._updateStringGroupValue(index, "power_entity", value),
          )}
          ${this._renderSelectorWithClear(
            this._t("editor.field.string_group_energy_sensor"),
            group.energy_entity,
            {
              entity: {
                domain: "sensor",
                include_entities: energySensorEntityIds,
              },
            },
            (value) => this._updateStringGroupValue(index, "energy_entity", value),
          )}
        </div>
      </details>
    `;
  }

  private _renderPanelEditor(panel: PanelConfig, index: number) {
    const powerSensorEntityIds = this._getAvailableSensorEntityIdsByUnit(
      index,
      "power_entity",
      entityMatchesPanelPower,
    );
    const energySensorEntityIds = this._getAvailableSensorEntityIdsByUnit(
      index,
      "energy_entity",
      entityMatchesPanelEnergy,
    );
    return html`
      <details ?open=${index === 0}>
        <summary>
          <span>${this._formatPanelSlotTitle(index)}</span>
          <span class="chip">${panel.name ?? panel.id}</span>
        </summary>
        <div class="panel-form">
          ${this._renderPanelTextField(index, "name", this._t("editor.field.display_name"), panel.name ?? "")}
          ${this._renderPanelSensorSelector(
            index,
            "power_entity",
            this._t("editor.field.power_sensor"),
            panel.power_entity,
            powerSensorEntityIds,
          )}
          ${this._renderPanelSensorSelector(
            index,
            "energy_entity",
            this._t("editor.field.energy_sensor"),
            panel.energy_entity,
            energySensorEntityIds,
          )}
          <div class="toggle">
            <ha-switch
              .checked=${panel.show_energy ?? false}
              @change=${(event: Event) =>
                this._updatePanelValue(
                  index,
                  "show_energy",
                  (event.currentTarget as HTMLInputElement).checked,
                )}
            >${this._t("editor.field.panel_energy_toggle")}</ha-switch>
          </div>
          ${this._renderPanelOptionalNumberField(
            index,
            "rated_power_w",
            this._t("editor.field.panel_rated_power"),
            panel.rated_power_w,
            1,
            MAX_PANEL_RATED_POWER_W,
          )}
          ${this._renderPanelNumberField(
            index,
            "deviation_derate_percent",
            this._t("editor.field.deviation_derate"),
            panel.deviation_derate_percent ?? 100,
            1,
            100,
          )}
          <p class="section-copy">
            ${this._t("editor.helper.derate_help")}
          </p>
          ${this._renderPanelEntityPicker(
            index,
            "inverter_status_entity",
            this._t("editor.field.inverter_status_sensor"),
            panel.inverter_status_entity,
            ["sensor", "binary_sensor"],
          )}
          ${this._renderPanelAdvancedSection(index, panel)}
          <div class="toggle">
            <ha-switch
              .checked=${panel.enabled ?? true}
              @change=${(event: Event) =>
                this._updatePanelValue(
                  index,
                  "enabled",
                  (event.currentTarget as HTMLInputElement).checked,
                )}
            >${this._t("editor.field.panel_enabled_toggle")}</ha-switch>
          </div>
        </div>
      </details>
    `;
  }

  private _renderPanelAdvancedSection(index: number, panel: PanelConfig) {
    return html`
      <details class="panel-advanced">
        <summary>${this._t("editor.section.advanced_title")}</summary>
        <div class="panel-advanced-grid">
          <p class="section-copy">
            ${this._t("editor.section.advanced_copy")}
          </p>
          ${ADVANCED_METRIC_FIELDS.map((field) =>
            this._renderPanelAdvancedSensorSelector(
              index,
              field.key,
              this._t(field.labelKey),
              panel.advanced_metrics?.[field.key],
              this._getAdvancedSensorEntityIds(index, field.key, field.matcher),
            ),
          )}
        </div>
      </details>
    `;
  }

  private _renderPanelAdvancedSensorSelector(
    index: number,
    key: AdvancedMetricKey,
    label: string,
    value: string | undefined,
    includeEntities: string[],
  ) {
    return this._renderSelectorWithClear(
      label,
      value,
      {
        entity: {
          domain: "sensor",
          include_entities: includeEntities,
        },
      },
      (nextValue) => this._updatePanelAdvancedMetricValue(index, key, nextValue),
    );
  }

  private _formatPanelSlotTitle(index: number): string {
    const row = Math.floor(index / this._config.columns) + 1;
    const column = (index % this._config.columns) + 1;
    return this._t("editor.panel_slot_title", { row, column });
  }

  private _renderPanelEntityPicker(
    index: number,
    key: keyof PanelConfig,
    label: string,
    value: string | undefined,
    includeDomains: string[],
  ) {
    return this._renderSelectorWithClear(
      label,
      value,
      {
        entity: {
          domain: includeDomains,
        },
      },
      (nextValue) => this._updatePanelValue(index, key, nextValue),
    );
  }

  private _renderTextField(key: keyof SolarPanelVisualizerConfig, label: string, value: string) {
    return this._renderEditorInput(
      label,
      value,
      (nextValue) => this._updateRootValue(key, nextValue),
    );
  }

  private _renderPanelSensorSelector(
    index: number,
    key: "power_entity" | "energy_entity",
    label: string,
    value: string | undefined,
    includeEntities: string[],
  ) {
    return this._renderSelectorWithClear(
      label,
      value,
      {
        entity: {
          domain: "sensor",
          include_entities: includeEntities,
        },
      },
      (nextValue) => this._updatePanelValue(index, key, nextValue),
    );
  }

  private _renderSelectorWithClear(
    label: string,
    value: string | undefined,
    selector: Record<string, unknown>,
    onValueChanged: (value: string) => void,
  ) {
    return html`
      <ha-selector
        .hass=${this.hass}
        .value=${value}
        .selector=${selector}
        .label=${label}
        .required=${false}
        @value-changed=${(event: CustomEvent) =>
          onValueChanged(
            typeof event.detail?.value === "string" ? event.detail.value : "",
          )}
      ></ha-selector>
    `;
  }

  private _renderNumberField(
    key: keyof SolarPanelVisualizerConfig,
    label: string,
    value: number,
    min: number,
    max: number,
  ) {
    return this._renderEditorInput(
      label,
      String(value),
      (nextValue) =>
        this._updateRootValue(
          key,
          this._parseNumberWithClamp(nextValue, value, min, max),
        ),
      { type: "number", min, max, updateOn: "change" },
    );
  }

  private _renderOptionalNumberField(
    key: keyof SolarPanelVisualizerConfig,
    label: string,
    value: number | undefined,
    min: number,
    max: number,
  ) {
    return this._renderEditorInput(
      label,
      value !== undefined ? String(value) : "",
      (nextValue) =>
        this._updateRootValue(
          key,
          this._parseOptionalNumber(nextValue, min, max),
        ),
      { type: "number", min, max, updateOn: "change" },
    );
  }

  private _renderPanelTextField(
    index: number,
    key: keyof PanelConfig,
    label: string,
    value: string,
  ) {
    return this._renderEditorInput(
      label,
      value,
      (nextValue) => this._updatePanelValue(index, key, nextValue),
    );
  }

  private _renderPanelOptionalNumberField(
    index: number,
    key: keyof PanelConfig,
    label: string,
    value: number | undefined,
    min: number,
    max: number,
  ) {
    return this._renderEditorInput(
      label,
      value !== undefined ? String(value) : "",
      (nextValue) =>
        this._updatePanelValue(
          index,
          key,
          this._parseOptionalNumber(nextValue, min, max),
        ),
      { type: "number", min, max, updateOn: "change" },
    );
  }

  private _renderPanelNumberField(
    index: number,
    key: keyof PanelConfig,
    label: string,
    value: number,
    min: number,
    max: number,
  ) {
    return this._renderEditorInput(
      label,
      String(value),
      (nextValue) =>
        this._updatePanelValue(
          index,
          key,
          this._parseNumberWithClamp(nextValue, value, min, max),
        ),
      { type: "number", min, max, updateOn: "change" },
    );
  }

  private _renderEditorInput(
    label: string,
    value: string,
    onValueChanged: (value: string) => void,
    options: {
      type?: "text" | "number";
      min?: number;
      max?: number;
      disabled?: boolean;
      updateOn?: "input" | "change";
    } = {},
  ) {
    const updateOn = options.updateOn ?? "input";
    const handleInput = (event: Event): void => {
      if (updateOn === "input") {
        onValueChanged((event.currentTarget as HTMLInputElement).value);
      }
    };
    const handleChange = (event: Event): void => {
      if (updateOn === "change") {
        onValueChanged((event.currentTarget as HTMLInputElement).value);
      }
    };

    return html`
      <label class="field">
        <span class="field-label">${label}</span>
        <input
          class="text-input"
          type=${options.type ?? "text"}
          .value=${value}
          min=${options.min === undefined ? nothing : String(options.min)}
          max=${options.max === undefined ? nothing : String(options.max)}
          ?disabled=${options.disabled ?? false}
          @input=${handleInput}
          @change=${handleChange}
        />
      </label>
    `;
  }

  private _renderSelectField(
    key: keyof SolarPanelVisualizerConfig,
    label: string,
    value: string,
    options: Array<{ value: string; label: string }>,
  ) {
    return html`
      <label class="color-field">
        <span>${label}</span>
        <select
          .value=${value}
          @change=${(event: Event) =>
            this._updateRootValue(key, (event.currentTarget as HTMLSelectElement).value)}
        >
          ${options.map(
            (option) => html`<option value=${option.value}>${option.label}</option>`,
          )}
        </select>
      </label>
    `;
  }

  private _renderAutoFillSortModeField() {
    const options: Array<{ value: AutoPopulateSortMode; label: string }> = [
      { value: "auto", label: this._t("editor.select.autofill_sort_auto") },
      { value: "entityId", label: this._t("editor.select.autofill_sort_entity") },
      { value: "friendlyName", label: this._t("editor.select.autofill_sort_friendly") },
      { value: "grouped", label: this._t("editor.select.autofill_sort_grouped") },
    ];

    return html`
      <label class="color-field">
        <span>${this._t("editor.field.autofill_sort_mode")}</span>
        <select
          .value=${this._autoFillSortMode}
          @change=${(event: Event) => {
            this._autoFillSortMode = (event.currentTarget as HTMLSelectElement)
              .value as AutoPopulateSortMode;
          }}
        >
          ${options.map(
            (option) => html`<option value=${option.value}>${option.label}</option>`,
          )}
        </select>
      </label>
    `;
  }

  private _renderColorField(
    key: keyof NonNullable<SolarPanelVisualizerConfig["colors"]>,
    label: string,
  ) {
    const current = this._config.colors?.[key] ?? "";
    return html`
      <label class="color-field">
        <span>${label}</span>
        <input
          type="color"
          .value=${current}
          @input=${(event: Event) => this._updateColor(key, (event.currentTarget as HTMLInputElement).value)}
        />
      </label>
    `;
  }

  protected _updateRootValue(key: keyof SolarPanelVisualizerConfig, value: unknown): void {
    const nextConfig = this._normalizeEditorConfig({
      ...this._config,
      [key]: value,
    });
    this._commit(nextConfig);
  }

  private _updateColor(
    key: keyof NonNullable<SolarPanelVisualizerConfig["colors"]>,
    value: string,
  ): void {
    const nextConfig = this._normalizeEditorConfig({
      ...this._config,
      colors: {
        ...(this._config.colors ?? {}),
        [key]: value,
      },
    });
    this._commit(nextConfig);
  }

  private _getStringGroupsForEditor(): StringGroupConfig[] {
    const groups = this._config.string_groups ?? [];
    return groups.length > 0 ? groups : this._buildStringGroupsFromCurrentPanels();
  }

  private _buildStringGroupsFromCurrentPanels(): StringGroupConfig[] {
    return Array.from({ length: Math.max(this._config.rows, 1) }, (_, rowIndex) => {
      const startIndex = rowIndex * this._config.columns;
      const rowPanels = this._config.panels.slice(
        startIndex,
        startIndex + this._config.columns,
      );
      const enabledPanels = rowPanels.filter((panel) => panel.enabled !== false);
      const firstPowerPanel = enabledPanels.find((panel) => panel.power_entity);
      const firstEnergyPanel = enabledPanels.find((panel) => panel.energy_entity);
      return {
        id: `string-${rowIndex + 1}`,
        name: `String ${rowIndex + 1}`,
        panel_count: Math.min(
          Math.max(enabledPanels.length || this._config.columns || 1, 1),
          MAX_LAYOUT_DIMENSION,
        ),
        power_entity: firstPowerPanel?.power_entity,
        energy_entity: firstEnergyPanel?.energy_entity,
      };
    });
  }

  private _makeDefaultStringGroup(index: number): StringGroupConfig {
    return {
      id: `string-${index + 1}`,
      name: `String ${index + 1}`,
      panel_count: Math.min(Math.max(this._config.columns || 3, 1), MAX_LAYOUT_DIMENSION),
    };
  }

  private _handleStringSensorSharingToggle(enabled: boolean): void {
    const stringGroups =
      enabled && (this._config.string_groups?.length ?? 0) === 0
        ? this._buildStringGroupsFromCurrentPanels()
        : this._config.string_groups ?? [];
    this._commit(
      this._normalizeEditorConfig({
        ...this._config,
        enable_string_sensor_sharing: enabled,
        string_groups: stringGroups,
      }),
    );
  }

  private _updateStringGroupCount(value: string): void {
    const nextCount = this._parseNumberWithClamp(
      value,
      this._getStringGroupsForEditor().length || 1,
      1,
      MAX_LAYOUT_DIMENSION,
    );
    const currentGroups = this._getStringGroupsForEditor();
    const nextGroups = Array.from({ length: nextCount }, (_, index) =>
      currentGroups[index] ?? this._makeDefaultStringGroup(index),
    );
    this._commitStringGroups(nextGroups);
  }

  private _updateStringGroupValue(
    index: number,
    key: keyof StringGroupConfig,
    value: unknown,
  ): void {
    const nextGroups = this._getStringGroupsForEditor().map((group, groupIndex) => {
      if (groupIndex !== index) {
        return group;
      }
      return {
        ...group,
        [key]: value,
      } as StringGroupConfig;
    });
    this._commitStringGroups(nextGroups);
  }

  private _commitStringGroups(groups: StringGroupConfig[]): void {
    this._commit(
      this._normalizeEditorConfig({
        ...this._config,
        enable_string_sensor_sharing: true,
        string_groups: groups,
      }),
    );
  }

  protected _updatePanelValue(index: number, key: keyof PanelConfig, value: unknown): void {
    const panels = this._config.panels.map((panel, panelIndex) => {
      if (panelIndex !== index) {
        return panel;
      }

      const nextPanel: PanelConfig = { ...panel, [key]: value };
      if (key === "power_entity") {
        const previousEntityId = panel.power_entity;
        const nextEntityId = typeof value === "string" ? value.trim() : "";
        if (nextEntityId.length > 0) {
          const nextFriendlyName = this._getEntityFriendlyName(nextEntityId);
          if (
            nextFriendlyName &&
            this._shouldAutoRenamePanel(panel.name, panel.id, previousEntityId)
          ) {
            nextPanel.name = nextFriendlyName;
          }
        }
      }
      if (key === "enabled" && value === false) {
        nextPanel.power_entity = undefined;
        nextPanel.energy_entity = undefined;
        nextPanel.show_energy = false;
        nextPanel.inverter_status_entity = undefined;
        nextPanel.error_entity = undefined;
        nextPanel.advanced_metrics = undefined;
      }
      return nextPanel;
    });

    const nextConfig = this._normalizeEditorConfig({
      ...this._config,
      panels,
    });

    this._commit(nextConfig);
  }

  private _updatePanelAdvancedMetricValue(
    index: number,
    key: AdvancedMetricKey,
    value: unknown,
  ): void {
    const normalizedValue =
      typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
    const panels = this._config.panels.map((panel, panelIndex) => {
      if (panelIndex !== index) {
        return panel;
      }

      const nextAdvanced: NonNullable<PanelConfig["advanced_metrics"]> = {
        ...(panel.advanced_metrics ?? {}),
      };
      nextAdvanced[key] = normalizedValue;

      if (
        ADVANCED_METRIC_FIELDS.every(
          (field) => !nextAdvanced[field.key] || nextAdvanced[field.key]?.trim().length === 0,
        )
      ) {
        return {
          ...panel,
          advanced_metrics: undefined,
        };
      }

      return {
        ...panel,
        advanced_metrics: nextAdvanced,
      };
    });

    const nextConfig = this._normalizeEditorConfig({
      ...this._config,
      panels,
    });
    this._commit(nextConfig);
  }

  private _applyDefaultRatedPowerToAllPanels = (): void => {
    const ratedPower = this._config.default_panel_rated_power_w;
    if (!ratedPower) {
      return;
    }

    const panels = this._config.panels.map((panel) => ({
      ...panel,
      rated_power_w: ratedPower,
    }));

    this._commit(
      this._normalizeEditorConfig({
        ...this._config,
        panels,
      }),
    );
  };

  private _handleAutoPopulateSensors = (): void => {
    if (!this.hass) {
      return;
    }

    const powerPrefix = this._autoFillPowerPrefix.trim();
    const energyPrefix = this._autoFillEnergyPrefix.trim();
    const statusPrefix = this._autoFillStatusPrefix.trim();
    if (
      !powerPrefix &&
      !energyPrefix &&
      !this._autoFillInverterStatus &&
      !this._autoFillAdvancedTelemetry
    ) {
      this._autoFillResultMessage = this._t("editor.autofill.enter_prefix");
      return;
    }

    let panels = [...this._config.panels];
    const summaries: string[] = [];

    if (powerPrefix) {
      panels = panels.map((panel) => ({ ...panel, power_entity: undefined }));
      const powerResult = autoPopulatePanelEntities(
        panels,
        this.hass.states,
        "power_entity",
        powerPrefix,
        entityMatchesPanelPower,
        this._autoFillSortMode,
      );
      panels = powerResult.panels;
      summaries.push(
        this._t("editor.autofill.power_summary", {
          matched: powerResult.matched,
          filled: powerResult.filled,
          skipped: powerResult.skipped,
        }),
      );
    }

    if (energyPrefix) {
      panels = panels.map((panel) => ({ ...panel, energy_entity: undefined }));
      const energyResult = autoPopulateEnergyEntitiesByPowerAnchor(
        panels,
        this.hass.states,
        energyPrefix,
        entityMatchesPanelEnergy,
        this._autoFillSortMode,
        {
          shareSingleGroupEnergy: this._config.enable_string_sensor_sharing ?? false,
        },
      );
      panels = energyResult.panels;
      summaries.push(
        this._t("editor.autofill.energy_summary", {
          matched: energyResult.matched,
          filled: energyResult.filled,
          skipped: energyResult.skipped,
        }),
      );
    }

    panels = applyAutoPopulateFriendlyNames(
      panels,
      (entityId) => this._getEntityFriendlyName(entityId),
    );

    if (this._autoFillInverterStatus) {
      const statusResult = autoPopulateInverterStatusEntities(
        panels,
        this.hass.states,
        statusPrefix,
      );
      panels = statusResult.panels;
      summaries.push(
        this._t("editor.autofill.inverter_status_summary", {
          filled: statusResult.filled,
          skipped: statusResult.skippedPanels,
        }),
      );
    }

    if (this._autoFillAdvancedTelemetry) {
      const advancedResult = autoPopulateAdvancedTelemetry(
        panels,
        this.hass.states,
      );
      panels = advancedResult.panels;
      summaries.push(
        this._t("editor.autofill.advanced_summary", {
          filled: advancedResult.filled,
          skipped: advancedResult.skippedPanels,
        }),
      );
    }

    this._autoFillResultMessage = summaries.join(" ");
    this._commit(
      this._normalizeEditorConfig({
        ...this._config,
        panels,
      }),
    );
  };

  private _handleRemoveAllPanelSensors = (): void => {
    const panels = this._config.panels.map((panel) => ({
      ...panel,
      power_entity: undefined,
      energy_entity: undefined,
      show_energy: false,
      inverter_status_entity: undefined,
      error_entity: undefined,
      advanced_metrics: undefined,
    }));
    this._autoFillResultMessage =
      this._t("editor.autofill.cleared");
    this._commit(
      this._normalizeEditorConfig({
        ...this._config,
        panels,
      }),
    );
  };

  private _parseOptionalNumber(
    value: string,
    min: number,
    max: number,
  ): number | undefined {
    if (value.trim() === "") {
      return undefined;
    }

    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
      return undefined;
    }
    return Math.min(Math.max(numeric, min), max);
  }

  private _parseNumberWithClamp(
    value: string,
    fallback: number,
    min: number,
    max: number,
  ): number {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
      return fallback;
    }
    return Math.min(Math.max(numeric, min), max);
  }

  private _getAvailableSensorEntityIdsByUnit(
    targetPanelIndex: number,
    key: "power_entity" | "energy_entity",
    matcher: (normalizedUnit: string, entity: HassEntity) => boolean,
  ): string[] {
    if (!this.hass) {
      return [];
    }

    const allowDuplicatePanelSensors = this._config.enable_string_sensor_sharing ?? false;
    const usedByOthers = allowDuplicatePanelSensors
      ? new Set<string>()
      : new Set(
          this._config.panels
            .map((panel, index) => (index === targetPanelIndex ? undefined : panel[key]))
            .filter((entityId): entityId is string => typeof entityId === "string" && entityId.length > 0),
        );
    const selectedByCurrent = this._config.panels[targetPanelIndex]?.[key];

    const options: string[] = [];
    for (const [stateEntityId, entity] of Object.entries(this.hass.states)) {
      const entityId = getStateEntityId(stateEntityId, entity);
      if (!entityId.startsWith("sensor.")) {
        continue;
      }

      const unitRaw = entity.attributes?.unit_of_measurement;
      const normalizedUnit = typeof unitRaw === "string" ? unitRaw.trim().toLowerCase() : "";
      if (!matcher(normalizedUnit, entity)) {
        continue;
      }

      if (
        usedByOthers.has(entityId) &&
        entityId !== selectedByCurrent
      ) {
        continue;
      }

      options.push(entityId);
    }

    if (
      typeof selectedByCurrent === "string" &&
      selectedByCurrent.length > 0 &&
      !options.includes(selectedByCurrent)
    ) {
      options.push(selectedByCurrent);
    }

    return options.sort(naturalCompare);
  }

  private _getStringSensorEntityIdsByUnit(
    selectedEntityId: string | undefined,
    matcher: (normalizedUnit: string, entity: HassEntity) => boolean,
  ): string[] {
    if (!this.hass) {
      return [];
    }

    const options: string[] = [];
    for (const [stateEntityId, entity] of Object.entries(this.hass.states)) {
      const entityId = getStateEntityId(stateEntityId, entity);
      if (!entityId.startsWith("sensor.")) {
        continue;
      }

      const unitRaw = entity.attributes?.unit_of_measurement;
      const normalizedUnit = typeof unitRaw === "string" ? unitRaw.trim().toLowerCase() : "";
      if (!matcher(normalizedUnit, entity)) {
        continue;
      }

      options.push(entityId);
    }

    if (
      typeof selectedEntityId === "string" &&
      selectedEntityId.length > 0 &&
      !options.includes(selectedEntityId)
    ) {
      options.push(selectedEntityId);
    }

    return options.sort(naturalCompare);
  }

  private _getAdvancedSensorEntityIds(
    targetPanelIndex: number,
    key: AdvancedMetricKey,
    matcher: (entity: HassEntity) => boolean,
  ): string[] {
    if (!this.hass) {
      return [];
    }

    const selectedByCurrent = this._config.panels[targetPanelIndex]?.advanced_metrics?.[key];
    const options: string[] = [];
    for (const [stateEntityId, entity] of Object.entries(this.hass.states)) {
      const entityId = getStateEntityId(stateEntityId, entity);
      if (!entityId.startsWith("sensor.")) {
        continue;
      }
      if (!matcher(entity)) {
        continue;
      }
      options.push(entityId);
    }

    if (
      typeof selectedByCurrent === "string" &&
      selectedByCurrent.length > 0 &&
      !options.includes(selectedByCurrent)
    ) {
      options.push(selectedByCurrent);
    }

    return options.sort(naturalCompare);
  }

  private _getEntityFriendlyName(entityId: string | undefined): string | undefined {
    const normalizedEntityId = entityId?.trim();
    if (!this.hass || !normalizedEntityId) {
      return undefined;
    }
    const state = this.hass.states[normalizedEntityId];
    const friendlyName = state?.attributes?.friendly_name;
    if (typeof friendlyName !== "string") {
      return undefined;
    }
    const normalized = friendlyName.trim();
    return normalized.length > 0 ? normalized : undefined;
  }

  private _shouldAutoRenamePanel(
    currentName: string | undefined,
    panelId: string,
    previousPowerEntity: string | undefined,
  ): boolean {
    return shouldAutoRenamePanelName(
      currentName,
      panelId,
      previousPowerEntity,
      (entityId) => this._getEntityFriendlyName(entityId),
    );
  }

  protected _commit(config: SolarPanelVisualizerConfig): void {
    this._config = config;
    fireConfigChanged(this, config);
  }

  private _handleCardConfigSync = (event: Event): void => {
    const customEvent = event as CustomEvent<{ config?: unknown }>;
    const rawConfig = customEvent.detail?.config;
    if (!rawConfig || typeof rawConfig !== "object") {
      return;
    }

    const incoming = this._normalizeEditorConfig(
      rawConfig as Partial<SolarPanelVisualizerConfig>,
    );
    if (!this._isReorderOnlySync(incoming)) {
      return;
    }

    this._commit(incoming);
  };

  protected _isReorderOnlySync(incoming: SolarPanelVisualizerConfig): boolean {
    if (incoming.type !== this._getCardType()) {
      return false;
    }

    if (
      incoming.rows !== this._config.rows ||
      incoming.columns !== this._config.columns ||
      incoming.panels.length !== this._config.panels.length
    ) {
      return false;
    }

    const currentById = this._toPanelSignatureMap(this._config.panels);
    const incomingById = this._toPanelSignatureMap(incoming.panels);
    if (currentById.size !== incomingById.size) {
      return false;
    }

    for (const [panelId, signature] of currentById.entries()) {
      if (incomingById.get(panelId) !== signature) {
        return false;
      }
    }

    const currentOrder = this._config.panels.map((panel) => panel.id).join("|");
    const incomingOrder = incoming.panels.map((panel) => panel.id).join("|");
    return currentOrder !== incomingOrder;
  }

  protected _toPanelSignatureMap(panels: PanelConfig[]): Map<string, string> {
    const map = new Map<string, string>();
    for (const panel of panels) {
      map.set(
        panel.id,
        JSON.stringify({
          name: panel.name ?? "",
          power_entity: panel.power_entity ?? "",
          energy_entity: panel.energy_entity ?? "",
          inverter_status_entity: panel.inverter_status_entity ?? "",
          error_entity: panel.error_entity ?? "",
          show_energy: panel.show_energy ?? false,
          enabled: panel.enabled ?? true,
          rated_power_w: panel.rated_power_w ?? null,
          deviation_derate_percent: panel.deviation_derate_percent ?? 100,
          advanced_metrics: panel.advanced_metrics ?? {},
        }),
      );
    }
    return map;
  }
}

export class SolarPanelVisualizerCardEditor extends SolarPanelVisualizerBaseCardEditor {}

if (!customElements.get("solar-panel-visualizer-card-editor")) {
  customElements.define(
    "solar-panel-visualizer-card-editor",
    SolarPanelVisualizerCardEditor,
  );
}

declare global {
  interface HTMLElementTagNameMap {
    "solar-panel-visualizer-base-card-editor": SolarPanelVisualizerBaseCardEditor;
    "solar-panel-visualizer-card-editor": SolarPanelVisualizerCardEditor;
  }
}
