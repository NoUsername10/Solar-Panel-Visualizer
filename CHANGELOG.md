# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.2.0] - 2026-05-29

### Release status
- Released as 0.2.0 in HACS official

### Added
- HACS default-store availability; normal installs no longer require adding a custom repository.
- Light theme support with `Auto`, `Dark`, and `Light` appearance modes.
- Theme-aware card, panel, popup, graph, and motion styling for readable dark and light dashboards.
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
- Built-in left-collector power rail animation with one-at-a-time panel pulses to the Power KPI.
- Built-in Power/Energy KPI impact effects and repeating alert ripple for deviation, inverter, and error states.
- Motion controls in the main GUI editor.

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
- Power rail animation is now part of the main card; the former separate animation test card and extra build artifact were removed.
- System health chip now stays anchored in the top-right corner on wide and compact layouts.
- Wide layouts move the KPI row down so the system health chip does not collide with the card heading.
- Panel performance text now uses three display lengths: full text, medium text without `Panel`, and compact percent-only text.
- Panel detail text now uses more of the available tile width before truncating.
- Panel detail scrollbars now appear only when the optional text content actually overflows.
- README installation flow now reflects default HACS availability, with custom repository instructions kept only as a fallback.
- README now leads with six headline features, shows the uploaded animated feature GIFs directly, and keeps static screenshots collapsed below.

### Fixed
- Empty YAML card creation now works cleanly so users can configure from the visual editor.
- Sensor selectors remain GUI-first and use Home Assistant selectors.
- Prefix auto-populate now respects exact entity ID prefixes.
- Sensor auto-populate can search power and energy sensors by friendly name when the search text does not start with `sensor.`.
- Auto-populated power sensors now refresh panel display names from the selected sensors' friendly names, preventing stale names from previous sensor assignments.
- Auto-populate help text now explains the difference between `sensor.` entity ID prefix matching and friendly-name search.
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
- Header eyebrow text no longer truncates unnecessarily on wide cards.
- False panel tile scrollbars caused by reserved internal padding.
- System health chip placement drifting between small and large cards.
- Small-card performance labels falling back to percent-only too aggressively.
- Popup graph range changes no longer jump the popup scroll position after async graph loads or power-pulse animation updates.
- Panel performance/detail text no longer collides with row/column labels, and optional detail scroll areas are protected from the slot label.
- HACS/readme documentation for release files, default-store install flow, and full feature coverage.
- Panel popup setup now keeps the selected panel open and loads the graph after choosing a power sensor during first setup.
- Popup close buttons remain clickable after graph range navigation and async graph loading.
- Power rail/grid lines now align correctly with rendered panel rows when arrays have more than two rows.
- Power rail/grid lines now keep their content coordinates stable while the card scrolls vertically.
- Hidden slots and large arrays now keep rail/grid visuals aligned with the visible slot layout.


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
