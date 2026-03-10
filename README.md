# Solar Panel Visualizer

Visually striking, GUI-first Lovelace card for mapping and monitoring a full solar panel array in Home Assistant.

[![hacs_badge](https://img.shields.io/badge/HACS-Frontend-41BDF5.svg)](https://hacs.xyz/)
[![ha_badge](https://img.shields.io/badge/Home%20Assistant-Custom%20Card-18BCF2.svg)](https://www.home-assistant.io/lovelace/)

## Why this card

If you want a card that is both practical and premium-looking, this is built for that:

- Grid-based panel visualization with strong visual hierarchy and adaptive sizing
- Scales to large arrays and supports 100+ panel slots when needed
- GUI-first setup: rows/columns first, then one expandable slot per panel
- Full YAML parity for advanced users
- Drag-and-drop panel tile reordering directly in the card
- Quick Setup popup for unconfigured panels (fast one-sensor assignment)
- Panel states with clear color language: producing, deviation, inverter, error, unavailable, unconfigured, hidden
- Production intensity gradient (`base` / `mid` / `peak`) scaled by panel rated power
- Per-panel rated power and performance display (`X% of YW Panel`)
- Optional per-panel energy display switch
- Inverter status matching with configurable working/fault term lists
- Array Health Check with warm-up/history controls and per-panel derate for naturally shaded panels
- Popup diagnostics with custom in-card history graphs (1h / 6h / 24h, max/median overlays)
- KPI row with Power, Energy, Alerts, and Custom KPI (including precision control)
- Optional system-level power/energy sensors for top KPI override
- HACS-ready packaging

## Installation (HACS Recommended)

1. In HACS, add this repository as a **Custom repository**:
   - URL: `https://github.com/NoUsername10/Solar-Panel-Visualizer`
   - Category: **Dashboard**
2. Install **Solar Panel Visualizer** from HACS.
3. Reload Home Assistant frontend (or restart Home Assistant).
4. Add card to dashboard:
   - Card type: `custom:solar-panel-visualizer`

If resource is not auto-added, add it manually:

```yaml
url: /hacsfiles/Solar-Panel-Visualizer/solar-panel-visualizer.js
type: module
```

## Minimal YAML example

```yaml
type: custom:solar-panel-visualizer
title: My Array
rows: 1
columns: 4
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
  - id: panel-4
    name: Panel 4
    power_entity: sensor.panel_4_power
```

## Key configuration groups

- Layout
  - Title, rows, columns
  - Max card width/height
  - Optional per-panel max tile width cap
- Display
  - Power/Energy/Custom KPI decimals
  - System power sensor override (+ invert option)
  - System daily energy sensor override
  - Custom KPI entity + heading + visibility
- Array Health Check
  - Enable/disable
  - Deviation threshold and absolute shortfall
  - Runtime and sample requirements
  - Dynamic floor, smoothing, shared history window
- Inverter Status
  - Enable checks
  - Working terms and fault terms
  - Optional tile-level status visibility
- Panel slots
  - Power sensor (required for output)
  - Energy sensor (optional)
  - Show panel energy toggle
  - Rated power
  - Deviation derate (for natural shading)
  - Inverter status sensor
  - Show/hide tile while keeping grid slot
  - Prefix auto-fill and remove-all sensors tools

## Publish checklist (HACS)

Before creating a GitHub release, ensure these files exist in repo root:

- `hacs.json`
- `README.md`
- `CHANGELOG.md`
- `LICENSE`
- `solar-panel-visualizer.js` (built card artifact referenced by `hacs.json`)

## License

MIT License.
