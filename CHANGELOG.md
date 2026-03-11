# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Planned updates]
- Support for string inverters setups with multiple panels / string.
  - The string power and string energy sensor values will be split on the panels selected in that string.
  - Smart way of visualising the string setup in the panel overview.
- Auto populate panel names from sensor names in setup
- Potential "save" button in the GUI when drag and dropping panels for clarity.
- Panel health data statistics on each panel
- Make the inverter evaluation information more clear.
- Home assistant notification on panel event, deviation or error.
- Add language support
  

## [Planned fixes]
- 6h time indications when we have 0w for long perionds.
  

## [Unreleased]
- Nothing here yet


## [0.1.1] - 2026-03-10
### Changed
- HACS test approved release.

## [0.1.0] - 2026-03-10

### Added
- Initial HACS-ready release of the Solar Panel Visualizer custom Lovelace card.
- GUI-first editor with YAML parity for all card options.
- Row/column-driven panel slot generation.
- Per-panel controls for power, energy, rated power, inverter status, enable/disable, and deviation derate.
- Drag-and-drop tile reordering in the card.
- Quick Setup mode for unconfigured panels.
- Status-aware tile rendering (`normal`, `deviation`, `inverter`, `error`, `offline`, `unconfigured`, `disabled`).
- Production color spectrum (`production_start`, `production_mid`, `production_end`) with intensity control.
- Array Health Check with configurable thresholds, runtime/sample gates, smoothing, dynamic floor, and shared history window.
- Inverter term matching (`fault` and `working` terms).
- Popup diagnostics with custom in-card history graph (1h/6h/24h) and overlays.
- KPI row for Power, Energy, Alerts, and Custom KPI with precision controls.
- Optional system power/energy sensor overrides for top KPIs.
- Prefix-based panel sensor auto-fill and bulk remove tools in editor.
- Scales to large systems, including 100+ panel slots when required.

### Changed
- Shared history window default set to `12h`.

### Notes
- This is the first public release baseline for GitHub/HACS distribution.
