# Solar Panel Visualizer

[![coffee_badge](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-donate-orange.svg)](https://www.buymeacoffee.com/DefaultLogin)
[![HACS Default](https://img.shields.io/badge/HACS-Default-orange.svg)](https://github.com/hacs/default)

[<img src="https://my.home-assistant.io/badges/hacs_repository.svg" alt="Open your Home Assistant instance and open Solar Panel Visualizer in HACS." />](https://my.home-assistant.io/redirect/hacs_repository/?owner=NoUsername10&repository=Solar-Panel-Visualizer&category=frontend)

Solar Panel Visualizer is a Home Assistant Lovelace card for building a live, panel-level solar array overview. It is available in the default HACS store, is configured fully from the Home Assistant GUI, and is designed for arrays from a few panels to large 100+ panel systems.

It gives you a clear visual map of each panel slot, live power and energy KPIs, health coloring, popup graphs, inverter status checks, Forecast.Solar overlays, and practical setup tools without requiring YAML.

## ✨ Top highlights

- **Default HACS install, no YAML required**: install from the normal HACS store and configure everything in the Home Assistant GUI editor.
- **Live panel-level array overview**: see each panel slot with power, energy, status color, row/column labels, and system KPIs in one card.
- **Fast setup tools**: tap unconfigured panels, auto-populate sensors by entity ID or friendly name, and drag panels into the right slots.
- **Array Health Check**: compare panels against peers to spot underperformance, deviation, inverter faults, and unavailable sensors.
- **Useful diagnostics popups**: open panel, Power, Energy, and Custom KPI popups with recorder graphs, virtual total graphs, comparison graphs, and `1h`, `6h`, and `24h` ranges.
- **Forecast.Solar, themes, and motion**: add forecast overlays, inverter status checks, light/dark modes, power-flow animation, and alert effects.

## 🎬 Animated tour

Right-click and select "Play animation" on Safari macOS if a GIF does not start automatically.

### Tap-to-configure, drag-and-drop, and panel diagnostics

<img src="https://github.com/NoUsername10/Solar-Panel-Visualizer/blob/main/assets/gif/drag-and-drop-panel-info.gif" width=65% height=65%>

### GUI auto-populate setup

<img src="https://github.com/NoUsername10/Solar-Panel-Visualizer/blob/main/assets/gif/auto-populate.gif" width=65% height=65%>

### KPI popups and graph ranges

<img src="https://github.com/NoUsername10/Solar-Panel-Visualizer/blob/main/assets/gif/KPI-info.gif" width=65% height=65%>

### Panel fault detection

<img src="https://github.com/NoUsername10/Solar-Panel-Visualizer/blob/main/assets/gif/panel-fault.gif" width=65% height=65%>

### Panel deviation detection

<img src="https://github.com/NoUsername10/Solar-Panel-Visualizer/blob/main/assets/gif/panel-deviation.gif" width=65% height=65%>

## ✨ All features

- Available directly in the default HACS store, no custom repository needed for normal installs.
- 100% GUI configuration in the Home Assistant card editor.
- Visual solar array layout with rows, columns, fixed slots, status chips, and row/column labels.
- Live Power, Energy, Alerts, and optional Custom KPI summary cards.
- Panel tiles with production coloring, rated-power percentage, optional energy, and optional inverter status text.
- Live tile values update directly from Home Assistant entity states; recorder data is used only for graphs and health history.
- Array Health Check for peer comparison, underperformance detection, warm-up handling, smoothing, and low-light guardrails.
- Panel, Power, Energy, and Custom KPI popups with recorder history graphs.
- Virtual total Power and Energy histories from panel sensors when no system KPI sensor is configured.
- Panel comparison graphs inside Power and Energy KPI popups.
- `1h`, `6h`, and `24h` graph ranges with max, median, and min reference lines.
- Forecast.Solar overlay support for Home Assistant's default forecast sensors.
- Inverter working/fault term matching with clear panel and system health feedback.
- Light, dark, and automatic theme modes.
- Built-in motion effects for power flow, KPI updates, and alerts.
- Tap-to-configure unconfigured panel slots.
- Drag-and-drop panel reordering directly on the card.
- Entity ID or friendly-name sensor auto-fill, friendly-name panel naming, and bulk sensor removal tools.
- Advanced per-panel telemetry fields for inverter and panel diagnostics.
- Scales to large arrays, including 100+ panel slots.

## 🖼️ Static screenshots

<details>
<summary><b>Open screenshot gallery</b></summary><br>

Overview of the card:<br>
<img src="https://github.com/NoUsername10/Solar-Panel-Visualizer/blob/main/assets/spv-overview.png" width=40% height=40%>

Full GUI setup, no YAML needed:<br>
<img src="https://github.com/NoUsername10/Solar-Panel-Visualizer/blob/main/assets/card-configuration-setup.png" width=40% height=40%>

Panel health overview:<br>
<img src="https://github.com/NoUsername10/Solar-Panel-Visualizer/blob/main/assets/panel-detail1.png" width=40% height=40%>
<img src="https://github.com/NoUsername10/Solar-Panel-Visualizer/blob/main/assets/panel-detail2.png" width=40% height=40%>

Tap-to-configure panels:<br>
<img src="https://github.com/NoUsername10/Solar-Panel-Visualizer/blob/main/assets/tap-to-configure.png" width=40% height=40%>

Array health overview:<br>
<img src="https://github.com/NoUsername10/Solar-Panel-Visualizer/blob/main/assets/system-health-error.png" width=40% height=40%>
<img src="https://github.com/NoUsername10/Solar-Panel-Visualizer/blob/main/assets/system-health-error-message.png" width=40% height=40%>

KPI sensors and popups:<br>
<img src="https://github.com/NoUsername10/Solar-Panel-Visualizer/blob/main/assets/kpi-energy.png" width=40% height=40%>
<img src="https://github.com/NoUsername10/Solar-Panel-Visualizer/blob/main/assets/kpi-custom.png" width=40% height=40%>

</details>

## 📦 Installation with HACS

Solar Panel Visualizer is included in the default HACS store.

1. Open Home Assistant.
2. Go to **HACS**.
3. Search for **Solar Panel Visualizer** in the Frontend/Dashboard section.
4. Open the repository and click **Download**.
5. Reload the Home Assistant frontend, or restart Home Assistant if HACS asks you to.
6. Add the card to a dashboard from the Home Assistant card picker. It appears as **Solar Panel Visualizer** with a solar panel icon after the frontend reloads.

## ➕ Add and configure the card

1. Open the dashboard where you want the solar array.
2. Click **Edit dashboard**.
3. Click **+ Add card**.
4. Search for **Solar Panel Visualizer**.
5. Add the card and configure it in the visual editor.

The editor covers the full card setup:

- **Layout**: title, rows, columns, max card width, and optional max card height.
- **Appearance**: automatic, dark, or light theme mode.
- **Display**: decimals, panel tap behavior, system KPI sensors, custom KPI, and panel width limits.
- **Forecast**: enable Forecast.Solar overlays when default Home Assistant forecast sensors are available.
- **Array Health Check**: peer comparison thresholds, sample gates, smoothing, dynamic floor, and history window.
- **Inverter Status**: status entity matching, fault terms, working terms, and optional tile text.
- **Status Colors**: production gradient, deviation/error/unavailable colors, and intensity.
- **Motion**: power flow, update shimmer, and alert ripple controls.
- **Panels**: per-slot sensor selectors, names, rated power, energy display, derate, inverter status, advanced telemetry, and visibility.

## 🔍 Feature details

<details>
<summary><b>Array Health Check</b></summary><br>

Array Health Check compares panels against the rest of the active array so weak panels are easier to spot.

- Uses panel power sensors and configured rated power.
- Supports relative deviation threshold and absolute watt shortfall threshold.
- Avoids noisy alerts with minimum active panel count, minimum sample count, runtime gating, smoothing, and dynamic low-power floor.
- Supports per-panel derate for naturally shaded or differently oriented panels.
- Uses a shared recorder history window when available, then falls back gracefully to live warm-up data.
- Shows deviation status on panel tiles and in the System Health popup.

</details>

<details>
<summary><b>Panel and KPI popups</b></summary><br>

Popups turn the card from a simple overview into a diagnostic surface.

- Panel popups show power, energy, status, reason text, inverter evaluation, and optional telemetry.
- Power and Energy KPI popups can show system sensor history, or automatically build virtual total histories from configured panel sensors when no system sensor is selected.
- Panel comparison graphs are available in the KPI popups and open automatically when the same panel history has already been loaded for a virtual total graph.
- Custom KPI popup shows the configured custom sensor and graph.
- Graphs are lazy-loaded from Home Assistant recorder data.
- Range chips switch between `1h`, `6h`, and `24h`.
- Graphs include max, median, and min reference lines when data is available.

</details>

<details>
<summary><b>Forecast.Solar overlays</b></summary><br>

Forecast overlays can add a dashed reference line to Power and Energy popup graphs.

- Uses Home Assistant's default Forecast.Solar sensors:
  - `sensor.power_production_now`
  - `sensor.energy_production_today`
- Overlay is optional and controlled from the GUI editor.
- Overlays work with real system Power/Energy sensors and with virtual totals summed from configured panel sensors.
- If the forecast sensors are missing, the card shows a non-blocking message instead of failing.
- Forecast lines are shown only over the selected history range up to the current time.

</details>

<details>
<summary><b>Inverter status checks</b></summary><br>

Inverter status checks help catch panel or micro-inverter issues that raw power values may not explain.

- Configure an inverter status sensor per panel.
- Enable global inverter status checks from the GUI.
- Add working terms and fault terms as comma-separated text.
- Matching fault terms can mark the panel as inverter/error state.
- Matching working terms help distinguish normal inverter status from unknown text.
- Optional tile text can show a compact inverter summary directly on each panel.

</details>

<details>
<summary><b>Theme, motion, and visual behavior</b></summary><br>

The card is designed to be readable and active without requiring extra dashboard cards.

- Theme modes: `Auto`, `Dark`, and `Light`.
- Production colors use a configurable gradient from base to peak.
- Deviation, error, and unavailable states have separate configurable colors.
- Power flow animation draws a left-side collector rail and panel pulses toward the Power KPI.
- KPI shimmer highlights updates.
- Alert ripple highlights deviation, inverter, and error states.
- Motion effects can be enabled or disabled from the GUI.

</details>

<details>
<summary><b>Advanced telemetry</b></summary><br>

Advanced telemetry fields are optional. They are useful when your solar integration exposes extra diagnostic sensors.

Per panel, the GUI can map:

- Inverter AC power
- Inverter AC voltage
- Inverter AC current
- Inverter temperature
- Panel current
- Panel voltage
- Panel power

Configured telemetry is grouped in the panel popup, and missing optional telemetry is handled cleanly.

</details>

<details>
<summary><b>Large arrays and setup tools</b></summary><br>

The card is built for both small residential arrays and large panel layouts.

- Rows and columns define fixed panel slots.
- Disabled panels keep their visual slot but are excluded from active sensor behavior.
- Drag-and-drop swaps panel slots and saves the order to the card config.
- Tap-to-configure opens a quick setup popup for unconfigured panels.
- Auto-fill can fill power and energy sensors in slot order by `sensor.` entity ID prefix or friendly-name search.
- Power sensor auto-fill also refreshes panel display names from the selected sensors' friendly names.
- Bulk remove clears panel sensors when rebuilding the layout.
- Panel width limits help keep large dashboards readable.

</details>

## 🛟 Backup and manual setup

Most users should install from the default HACS store and configure the card in the GUI. The sections below are kept for recovery, debugging, or advanced setups.

<details>
<summary><b>Custom repository fallback</b></summary><br>

Use this only if Solar Panel Visualizer does not appear in your HACS search yet.

1. In HACS, open the menu and choose **Custom repositories**.
2. Add this repository:
   - URL: `https://github.com/NoUsername10/Solar-Panel-Visualizer`
   - Category: **Dashboard**
3. Search for **Solar Panel Visualizer** in HACS and download it.
4. Reload the frontend or restart Home Assistant if HACS asks you to.

</details>

<details>
<summary><b>Resource fallback</b></summary><br>

HACS normally adds the resource automatically. If the card is installed but Home Assistant cannot find it, add this dashboard resource manually:

```yaml
url: /hacsfiles/Solar-Panel-Visualizer/solar-panel-visualizer.js
type: module
```

</details>

<details>
<summary><b>Minimal YAML fallback</b></summary><br>

Use a manual card only if the card picker does not show Solar Panel Visualizer.

```yaml
type: custom:solar-panel-visualizer
```

After adding the card, open the visual editor and finish setup in the GUI.

</details>

<details>
<summary><b>YAML reference for advanced users</b></summary><br>

YAML is optional. The GUI editor supports the full card configuration.

```yaml
type: custom:solar-panel-visualizer
title: My Array
theme_mode: auto
rows: 2
columns: 3
enable_array_checks: true
enable_inverter_status: true
enable_forecast_overlay: true
motion_enabled: true
use_system_power_entity: true
system_power_entity: sensor.solar_power
use_system_energy_entity: true
system_energy_entity: sensor.solar_energy_today
show_custom_kpi: true
custom_kpi_title: Grid
custom_kpi_entity: sensor.grid_power
panels:
  - id: panel-1
    name: Panel 1
    power_entity: sensor.panel_1_power
    energy_entity: sensor.panel_1_energy
    rated_power_w: 505
    inverter_status_entity: sensor.panel_1_inverter_status
  - id: panel-2
    name: Panel 2
    power_entity: sensor.panel_2_power
    energy_entity: sensor.panel_2_energy
    rated_power_w: 505
  - id: panel-3
    name: Panel 3
    power_entity: sensor.panel_3_power
    energy_entity: sensor.panel_3_energy
    rated_power_w: 505
  - id: panel-4
    name: Panel 4
    power_entity: sensor.panel_4_power
    energy_entity: sensor.panel_4_energy
    rated_power_w: 505
  - id: panel-5
    name: Panel 5
    power_entity: sensor.panel_5_power
    energy_entity: sensor.panel_5_energy
    rated_power_w: 505
  - id: panel-6
    name: Panel 6
    power_entity: sensor.panel_6_power
    energy_entity: sensor.panel_6_energy
    rated_power_w: 505
```

</details>

## 📄 License

MIT License.
