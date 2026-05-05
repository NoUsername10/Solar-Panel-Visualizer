# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.2.0] - 2026-05-03

### Added
- Light theme support with `Auto`, `Dark`, and `Light` appearance modes.
- Theme-aware card, panel, popup, graph, and dev-motion styling for readable dark and light dashboards.
- Forecast.Solar support using Home Assistant default sensors:
  - `sensor.power_production_now`
  - `sensor.energy_production_today`
- Forecast overlays in Power and Energy popups with dashed reference lines up to the current time.
- Forecast enable/disable setting in the GUI editor.
- Power, Energy, and Custom KPI popups with lazy-loaded recorder graphs.
- Panel power and panel energy comparison graphs inside the KPI popups.
- Max, median, and min reference lines on history and comparison graphs.
- Advanced per-panel telemetry mappings for:
  - inverter AC power
  - inverter AC voltage
  - inverter AC current
  - inverter temperature
  - panel current
  - panel voltage
  - panel power
- Panel `INFO` affordance and popup telemetry section with configured/unconfigured grouping.
- Custom KPI heading, visibility, decimal precision, and invert-value support.
- Optional single system power sensor for the Power KPI with invert support.
- Optional single system daily energy sensor for the Energy KPI.
- Panel friendly-name auto-fill when selecting a power sensor.
- Light/dark-ready i18n catalog coverage for new UI surfaces.
- Experimental dev card: `custom:solar-panel-visualizer-dev`.
- Dev-card left-collector power rail animation with one-at-a-time panel pulses to the Power KPI.
- Dev-card Power/Energy KPI shimmer and repeating alert ripple for deviation, inverter, and error states.

### Changed
- Power KPI label changed from `Live Power` to `Power`.
- Array Health Check shared history window now defaults to `12h`.
- Array Health Check copy and behavior clarified around peer comparison, history, guardrails, and natural-shading derate.
- Panel width cap logic now preserves configured column counts when there is enough space.
- Panel tiles use thinner, more distinct borders and clearer production/fault accents.
- Panel tile energy is hidden when no energy sensor is configured.
- Popups now prioritize graphs before sensor detail blocks for Power and Energy.
- Forecast detail label shortened to `Forecast production`.
- Graph rendering avoids artificial overnight ramps by only correcting zero-to-value gaps around actual zero transitions.
- History fetching is lazy-loaded for popups and comparison graphs to avoid startup load on Home Assistant.
- Dev card now has one power-rail motion style only; the old classic curved trace option was removed.

### Fixed
- Empty YAML card creation now works cleanly so users can configure from the visual editor.
- Sensor selectors remain GUI-first and use Home Assistant selectors.
- Prefix auto-populate now respects exact entity ID prefixes.
- Disabled panels keep their grid space and are excluded from sensor auto-fill.
- Drag-and-drop panel ordering is persisted to card config so it syncs across devices.
- Missing, unknown, or unavailable entities no longer crash popups or tiles.
- Forecast.Solar absence is handled with non-blocking messages.
- Light theme text, panel, graph, forecast, and rail readability issues.
- Panel comparison graphs rendering blank despite valid recorder data.
- 24h graph fetch and time-axis behavior for panel/system graphs.
- Popup close button visibility and popup layout stability during graph loading.
- Inverter working/fault term matching now avoids single-letter partial false positives.
- Custom KPI text overflow and mobile formatting.
- HACS/readme documentation for release files and setup flow.


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

### Notes
- This is the first public release baseline for GitHub/HACS distribution.
