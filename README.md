# Solar Panel Visualizer

A GUI-first Home Assistant Lovelace card that turns panel-level sensors into a polished solar dashboard with live production, health checks, forecasts, history graphs, inverter telemetry, and animated power flow.

[![HACS Default](https://img.shields.io/badge/HACS-Default%20Store-41BDF5.svg)](https://hacs.xyz/)
[![Home Assistant](https://img.shields.io/badge/Home%20Assistant-Custom%20Card-18BCF2.svg)](https://www.home-assistant.io/dashboards/)
[![GUI First](https://img.shields.io/badge/config-GUI%20first-7ED957.svg)](#gui-setup-guide)
[![License](https://img.shields.io/badge/license-MIT-lightgrey.svg)](LICENSE)

> **Now available directly in HACS.** Search for **Solar Panel Visualizer** in HACS and install it from the default store. No custom repository is required for normal installations.

Overview of the card (GIF). Safari on macOS may require right-clicking and selecting **Play animation**:

<img src="https://github.com/NoUsername10/Solar-Panel-Visualizer/blob/main/assets/card-overview.gif" width="65%" height="65%">

## Why This Card

- **Install from HACS**: the card is available in the default HACS store.
- **GUI-first setup**: add the card with empty YAML, then configure rows, panels, sensors, colors, checks, forecasts, and motion visually.
- **Beautiful solar array map**: panel tiles, KPI row, status chip, panel positions, production accents, and responsive layout.
- **Light and dark theme support**: Auto follows the active Home Assistant theme, or force Light/Dark in the editor.
- **Scales from small arrays to 100+ panels**: responsive columns, optional tile width cap, hidden slots, and large-system friendly rendering.
- **Panel health intelligence**: Array Health Check compares panel performance against peers using history, thresholds, derating, and guardrails.
- **Forecast.Solar overlay**: optional comparison against Home Assistant’s default Forecast.Solar sensors.
- **Built-in graphs**: Power, Energy, Custom KPI, per-panel history, and panel comparison graphs with 1h/6h/24h ranges.
- **Animated power rails**: optional left-collector rail animation with one-at-a-time panel pulses into the Power KPI.
- **Advanced per-panel telemetry**: optional popup-only fields for inverter AC power, voltage, current, temperature, panel voltage/current, and panel power.
- **Fast setup tools**: tap unconfigured panels for Quick Setup, drag/drop panels, auto-populate by prefix, and bulk-remove sensors.

## 0.2.0 Release Highlights

- **HACS default-store availability** for simple installs and updates.
- **Production-ready light and dark themes** with readable text, panels, popups, graphs, rails, and forecast overlays.
- **Animated power rail system** built into the main card, with one-at-a-time panel pulses flowing into the Power KPI.
- **Cleaner responsive layout** with a stable top-right system health chip and smarter KPI spacing on wide cards.
- **Smarter panel labels** that use `45% of 505W Panel`, `45% of 505W`, or `45%` depending on available space.
- **Cleaner panel detail text** where optional details stay readable and scroll affordances appear only when they are actually needed.
- **Forecast.Solar integration** using Home Assistant’s default forecast sensors without manual entity setup.
- **Advanced telemetry popups** for inverter and panel electrical details without cluttering the array view.

## Feature Set

<details open>
<summary><b>Dashboard Experience</b></summary><br>

- Responsive panel array with configurable rows and columns.
- Hidden/disabled slots keep physical spacing for real-world array layouts.
- Live Power, Energy, Alerts, and optional Custom KPI cards.
- Top-right system status chip with grouped issue popup.
- Tap any panel for a dedicated detail popup.
- Drag and drop panels directly on the card and save the order to config.
- Light, Dark, and Auto appearance modes.
- Optional animated power rails and KPI impact effects.

</details>

<details>
<summary><b>Solar Intelligence</b></summary><br>

- Array Health Check compares panels against peer panels instead of unrealistic rated-output expectations.
- Startup/runtime guardrails reduce false positives from slow inverter/API updates.
- Shared history window improves checks across browser reloads and different devices.
- Per-panel derating helps naturally shaded panels avoid false deviation alerts.
- Complete-term inverter matching separates working, deviation, and fault states.
- Fault colors override production colors so important issues stay visible.

</details>

<details>
<summary><b>Graphs and Forecasts</b></summary><br>

- Lazy-loaded recorder history graphs for Power, Energy, Custom KPI, and individual panels.
- Panel comparison graphs for power and energy.
- `1h`, `6h`, and `24h` graph ranges.
- Max, median, and min reference lines.
- Forecast.Solar dashed overlays for power and energy when Home Assistant’s default forecast sensors exist.
- Forecast overlays stop at the current time so historical graphs are not distorted by future predictions.

</details>

<details>
<summary><b>Setup and Configuration</b></summary><br>

- Add the card with only `type: custom:solar-panel-visualizer`, then configure visually.
- Filtered Home Assistant entity selectors for power, energy, voltage, current, temperature, and telemetry fields.
- Prefix-based auto-populate for panel power and energy sensors.
- Bulk remove sensors when rebuilding a layout.
- Quick Setup from unconfigured panel tiles.
- GUI settings for every supported card feature.

</details>

## Screenshots

Overview:

<img src="https://github.com/NoUsername10/Solar-Panel-Visualizer/blob/main/assets/spv-overview.png" width="60%" height="60%">

Full GUI setup:

<img src="https://github.com/NoUsername10/Solar-Panel-Visualizer/blob/main/assets/card-configuration-setup.png" width="60%" height="60%">

<details>
<summary><b>Panel detail and history</b></summary><br>

<img src="https://github.com/NoUsername10/Solar-Panel-Visualizer/blob/main/assets/panel-detail1.png" width="40%" height="40%">
<img src="https://github.com/NoUsername10/Solar-Panel-Visualizer/blob/main/assets/panel-detail2.png" width="40%" height="40%">

</details>

<details>
<summary><b>Tap-to-configure panels</b></summary><br>

<img src="https://github.com/NoUsername10/Solar-Panel-Visualizer/blob/main/assets/tap-to-configure.png" width="40%" height="40%">

</details>

<details>
<summary><b>System status popup</b></summary><br>

<img src="https://github.com/NoUsername10/Solar-Panel-Visualizer/blob/main/assets/system-health-error.png" width="40%" height="40%">
<img src="https://github.com/NoUsername10/Solar-Panel-Visualizer/blob/main/assets/system-health-error-message.png" width="40%" height="40%">

</details>

<details>
<summary><b>KPI popups</b></summary><br>

<img src="https://github.com/NoUsername10/Solar-Panel-Visualizer/blob/main/assets/kpi-energy.png" width="40%" height="40%">
<img src="https://github.com/NoUsername10/Solar-Panel-Visualizer/blob/main/assets/kpi-custom.png" width="40%" height="40%">

</details>

## Installation

### HACS

1. Open HACS.
2. Search for **Solar Panel Visualizer**.
3. Select **Download** / **Install**.
4. Reload the Home Assistant frontend if HACS asks you to.
5. Add the card from the dashboard card picker.

The card is included in the default HACS store, so a custom repository is not required for normal installs.

If Home Assistant does not add the frontend resource automatically, add it manually:

```yaml
url: /hacsfiles/Solar-Panel-Visualizer/solar-panel-visualizer.js
type: module
```

### HACS Custom Repository Fallback

Use this only if you are testing a pre-release branch, local fork, or a HACS index cache has not updated yet.

1. Open HACS.
2. Select the three-dot menu.
3. Select **Custom repositories**.
4. Add this repository URL.
5. Use category **Dashboard**.
6. Install **Solar Panel Visualizer**.

Repository URL:

```text
https://github.com/NoUsername10/Solar-Panel-Visualizer
```

### Manual

Place `solar-panel-visualizer.js` in your Home Assistant `www` folder and add:

```yaml
url: /local/solar-panel-visualizer.js
type: module
```

## Add The Card

1. Open your dashboard.
2. Select **Edit dashboard**.
3. Select **Add card**.
4. Choose **Solar Panel Visualizer**.
5. Start with rows and columns in the visual editor.

If the card is not visible in the picker, use a manual card:

```yaml
type: custom:solar-panel-visualizer
```

## Minimal YAML

The card is intended to be configured in the GUI. This is enough to add it:

```yaml
type: custom:solar-panel-visualizer
```

Minimal one-row YAML example:

```yaml
type: custom:solar-panel-visualizer
title: My Array
rows: 1
columns: 3
panels:
  - id: panel-1
    name: Panel 1
    power_entity: sensor.panel_1_power
  - id: panel-2
    name: Panel 2
    power_entity: sensor.panel_2_power
  - id: panel-3
    name: Panel 3
    power_entity: sensor.panel_3_power
```

## GUI Setup Guide

<details>
<summary><b>Layout</b></summary><br>

- **Title**: Main card title.
- **Rows / Columns**: Defines the physical solar array grid and creates panel slots automatically.
- **Max card width / height**: Optional dashboard sizing limits.
- **Limit panel tile max width**: Prevents wide dashboards from stretching panels too far.
- **Max panel tile width**: Tile cap used when width limiting is enabled.

</details>

<details>
<summary><b>Appearance</b></summary><br>

- **Theme mode: Auto** follows the active Home Assistant theme when available.
- **Theme mode: Dark** forces the dark glass look.
- **Theme mode: Light** uses a soft light background with dark readable text.
- Production, deviation, error, and unavailable colors remain user-configurable.

</details>

<details>
<summary><b>Display and KPIs</b></summary><br>

- **Power decimals / Energy decimals / Custom KPI decimals** control numeric precision.
- **Power KPI** can use either summed panel sensors or one selected system power sensor.
- **Invert system power value** supports reversed power meters.
- **Energy KPI** can use panel energy sensors or one selected system daily energy sensor.
- **Custom KPI** adds a fourth KPI with a custom heading, sensor, decimal limit, and optional value inversion.
- Tapping Power, Energy, or Custom KPI opens a popup with graph history and source details.
- If no system power sensor is selected, the Power popup can open directly into panel comparison mode.

</details>

<details>
<summary><b>Forecast.Solar</b></summary><br>

- Uses Home Assistant’s default Forecast.Solar sensors only:
- `sensor.power_production_now`
- `sensor.energy_production_today`
- Forecast overlays are optional and can be enabled/disabled in the editor.
- Power and Energy popups show current forecast values when available.
- Graphs show forecast as a thin dashed reference line up to the current time.
- If Forecast.Solar is not configured, the card stays functional and shows a clear non-blocking message.

</details>

<details>
<summary><b>Array Health Check</b></summary><br>

- Compares panels against peer panels instead of expecting perfect rated-panel output.
- Uses current power, shared history, minimum sample count, minimum active panels, smoothing, and thresholds.
- **Deviation check time** prevents false alarms during startup or slow API updates.
- **Shared history window** defaults to 12 hours.
- **Deviation derate (%)** can be set per panel for natural shading.
- Derated panels are evaluated against their own derated target and excluded from the baseline cohort.
- Low-light and idle periods are suppressed to avoid noisy false positives.

</details>

<details>
<summary><b>Inverter Status</b></summary><br>

- Select an optional inverter status sensor per panel.
- Configure **working terms** such as `normal`, `ok`, `running`, or `waiting for operation`.
- Configure **fault terms** such as `fault`, `alarm`, `error`, `failed`, or `trip`.
- Matching uses complete configured terms, not single-letter partial matches.
- Inverter status is always available in the panel popup and can optionally be shown on tiles.

</details>

<details>
<summary><b>Status Colors</b></summary><br>

- **Production base / mid / peak** define the production gradient.
- **Production color intensity** adjusts how strong the production accent appears.
- **Deviation / Error / Unavailable** override production colors so faults remain obvious.
- Panel borders also reflect production or fault status for clear visibility.

</details>

<details>
<summary><b>Motion</b></summary><br>

- **Enable motion** turns all card animation on/off.
- **Power-rail flow to Power KPI** shows producing panels sending one pulse at a time into the Power KPI.
- Rails use a left-collector layout that scales across different row/column counts.
- **Power/Energy KPI update effect** gives KPI value changes a subtle impact animation.
- **Alert ripple** repeats gently while deviation, inverter, or error states remain active.
- Motion respects reduced-motion preferences automatically.

</details>

<details>
<summary><b>Panels</b></summary><br>

Each panel slot supports:

- Display name.
- Power sensor `W`.
- Optional energy sensor `kWh` or `Wh`.
- Show/hide panel energy on tile.
- Rated panel power in `W`.
- Deviation derate for natural shading.
- Optional inverter status sensor.
- Show/hide tile while preserving grid space.
- Advanced telemetry in a collapsed section.

Panel names can auto-fill from selected power sensor friendly names.

</details>

<details>
<summary><b>Advanced Telemetry</b></summary><br>

Advanced telemetry is intentionally popup-only so the panel grid stays clean.

Available manual mappings:

- Inverter AC power.
- Inverter AC voltage.
- Inverter AC current.
- Inverter temperature.
- Panel current.
- Panel voltage.
- Panel power.

The panel tile shows a compact **INFO** affordance. The popup shows configured telemetry first and lists missing optional fields separately.

</details>

<details>
<summary><b>Auto-Populate Sensors</b></summary><br>

- Enter a power prefix, for example `sensor.slx_powerdc`.
- Optional energy prefix can also be entered.
- Matching is prefix-based against entity IDs.
- Sensors are filled in panel slot order.
- Existing panel layout is preserved.
- A bulk **Remove all sensors** button clears power, energy, inverter, and advanced telemetry mappings.

</details>

<details>
<summary><b>Card Interactions</b></summary><br>

- **Tap unconfigured panel**: opens Quick Setup with a filtered power sensor selector and disable toggle.
- **Tap configured panel**: opens detail popup with graph, metrics, inverter status, advanced telemetry, and explanation.
- **Drag and drop panels**: swaps panel positions and saves the new order into the card config.
- **Tap system status chip**: opens a status summary. If all is OK, it says everything is working well; otherwise it groups issues by type.

</details>

<details>
<summary><b>Graphs</b></summary><br>

- Graph ranges: `1h`, `6h`, `24h`.
- Default range: `6h`.
- Graphs are lazy-loaded when a popup opens.
- Recorder history is used for popup graphs.
- Max, median, and min reference lines are shown.
- Panel comparison graphs show multiple panel traces with a legend.
- Forecast overlays are dashed and independent from panel health calculations.
- Zero-to-production graph transitions are corrected visually without changing recorded history.

</details>

## Troubleshooting

<details>
<summary><b>Custom element not found</b></summary><br>

Check that the frontend resource exists:

```yaml
url: /hacsfiles/Solar-Panel-Visualizer/solar-panel-visualizer.js
type: module
```

Then clear browser cache or reload Home Assistant frontend.

After updating from HACS, a hard browser refresh may be required because Home Assistant aggressively caches frontend resources.

</details>

<details>
<summary><b>Forecast.Solar not configured</b></summary><br>

Forecast overlay requires Home Assistant’s Forecast.Solar integration with the default sensors:

- `sensor.power_production_now`
- `sensor.energy_production_today`

If those sensors do not exist, forecast overlays are skipped gracefully.

</details>

<details>
<summary><b>No graph history</b></summary><br>

Graphs use Home Assistant recorder history. Confirm the selected entities are recorded and have state history for the selected range.

</details>

<details>
<summary><b>Light theme readability</b></summary><br>

Set **Appearance > Theme mode** to **Light** or **Auto**. If a custom Home Assistant theme exposes unusual colors, force Light or Dark for predictable readability.

</details>

## Release Files

For HACS, the important root files are:

- `hacs.json`
- `README.md`
- `CHANGELOG.md`
- `LICENSE`
- `solar-panel-visualizer.js`

## License

MIT License.
