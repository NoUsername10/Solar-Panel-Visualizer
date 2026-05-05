# Solar Panel Visualizer

A GUI-first Home Assistant Lovelace card for visualizing solar panel arrays, panel health, production history, forecasts, and inverter status in one polished dashboard card.

[![HACS](https://img.shields.io/badge/HACS-Frontend-41BDF5.svg)](https://hacs.xyz/)
[![Home Assistant](https://img.shields.io/badge/Home%20Assistant-Custom%20Card-18BCF2.svg)](https://www.home-assistant.io/dashboards/)
[![License](https://img.shields.io/badge/license-MIT-lightgrey.svg)](LICENSE)

Overview of the card (GIF). Safari on macOS may require right-clicking and selecting **Play animation**:

<img src="https://github.com/NoUsername10/Solar-Panel-Visualizer/blob/main/assets/card-overview.gif" width="65%" height="65%">

## Why This Card

- **GUI-first setup**: add the card with empty YAML, then configure everything visually.
- **Beautiful solar array map**: panel tiles, KPI row, status chip, panel position, and responsive layout.
- **Light and dark theme support**: Auto follows the active Home Assistant theme, or force Light/Dark in the editor.
- **Scales from small arrays to 100+ panels**: responsive columns, optional tile width cap, hidden slots, and large-system friendly rendering.
- **Panel health intelligence**: Array Health Check compares panel performance against peers using history, thresholds, derating, and guardrails.
- **Forecast.Solar overlay**: optional comparison against Home Assistant’s default Forecast.Solar sensors.
- **Built-in graphs**: Power, Energy, Custom KPI, per-panel history, and panel comparison graphs with 1h/6h/24h ranges.
- **Advanced per-panel telemetry**: optional popup-only fields for inverter AC power, voltage, current, temperature, panel voltage/current, and panel power.
- **Fast setup tools**: tap unconfigured panels for Quick Setup, drag/drop panels, auto-populate by prefix, and bulk-remove sensors.
- **Experimental dev card**: optional second card with power-rail animations for testing future visual effects.

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
2. Add this repository as a **Custom repository**.
3. Use category **Dashboard**.
4. Install **Solar Panel Visualizer**.
5. Refresh the browser cache or restart Home Assistant.
6. Add a card with type `custom:solar-panel-visualizer`.

Repository URL:

```text
https://github.com/NoUsername10/Solar-Panel-Visualizer
```

If the resource is not added automatically:

```yaml
url: /hacsfiles/Solar-Panel-Visualizer/solar-panel-visualizer.js
type: module
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

</details>

## Experimental Dev Card

The repo also builds an optional development card:

```yaml
type: custom:solar-panel-visualizer-dev
```

The dev card shares the production card’s config, data model, layout, popups, and editor, but adds experimental motion controls:

- Left-collector power rail routing.
- One-at-a-time power pulse animation toward the Power KPI.
- Power KPI impact when a pulse arrives.
- Power/Energy KPI update shimmer.
- Repeating alert ripple for deviation, inverter, and error states.
- Reduced-motion aware behavior.

The HACS release points to the production file only. The dev file is meant for local/manual testing.

## Troubleshooting

<details>
<summary><b>Custom element not found</b></summary><br>

Check that the frontend resource exists:

```yaml
url: /hacsfiles/Solar-Panel-Visualizer/solar-panel-visualizer.js
type: module
```

Then clear browser cache or reload Home Assistant frontend.

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

Optional local testing file:

- `solar-panel-visualizer-dev.js`

## License

MIT License.
