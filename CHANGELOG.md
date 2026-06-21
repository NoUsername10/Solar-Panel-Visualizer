# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.2.4] - 2026-06-21

### Added
- Added an editor-only **Status search** field so status auto-fill can be narrowed by entity ID prefix or friendly-name text without adding a YAML option.
- Added optional **String of panels / share duplicate sensors** mode for string-inverter setups where one power or energy sensor represents multiple physical panels.
- Added a saved **String of panels** setup tree where users choose the number of strings, each string's panel count, and each string's power/energy sensors.

### Changed
- Auto-populate Auto detect now also recognizes serial-like trailing suffixes after changing input tokens, so names like `powerdc1_SERIAL` and `powerdc2_SERIAL` fill inverter-by-inverter instead of all string 1 sensors first.
- String setup is now grouped into its own Panels editor section instead of a loose switch.
- When saved string groups are enabled, the card derives layout from the tree: one row per string, columns from the longest string, and disabled filler slots for shorter strings.
- Layout rows and columns now support values up to `30`.
- When string sensor sharing is enabled, duplicate power and energy sensors are split by rated W across the panels sharing that sensor, with equal split when rated W is incomplete.
- Shared string values now flow through panel tiles, top totals, panel popups, virtual total graphs, panel comparison graphs, and Forecast.Solar comparisons.
- Status UI copy now describes the existing per-panel status field as **Inverter / panel status sensor** instead of inverter-only.
- Panel rated power and default rated power now allow values up to `10000 W`, supporting string-level sensors as well as individual panel sensors.
- README setup documentation now explains the safer auto-fill behavior for power, energy, inverter/panel status, and advanced telemetry.

### Fixed
- Energy auto-fill and energy selectors now accept Home Assistant `device_class: energy`, so friendly-name searches such as `Yield Today` can find inverter daily yield sensors even when the unit is missing or unusual.
- Status auto-fill now tries clear one-to-one panel status matches before falling back to shared inverter/string status, fixing panels named like `sensor.power_1_0_#` with matching `sensor.status_1_0_#`.
- String setup now regenerates old automatic names such as `String 2 Panel 3` after layout changes, preventing duplicate stale panel names while preserving custom names.
- Converting a default panel grid to string setup now treats default names such as `Panel 1` as generated names and preserves existing metadata by old row/column position where possible.
- Popup click handling is now more stable after scrolling or changing graph ranges by anchoring the popup layer outside the card scroll area and cancelling stale graph scroll restoration on the next popup interaction.
- Energy auto-fill can intentionally assign one same-serial daily energy sensor to multiple panels only when string sensor sharing is enabled, so the split avoids duplicated totals.

## [0.2.3] - 2026-05-31

### Added
- Auto-populate now includes editor-only options to fill inverter status sensors and advanced telemetry from already configured panel power sensors.
- Advanced telemetry auto-fill can reuse shared inverter-level sensors, such as inverter temperature, across panels that belong to the same detected serial/device group.

### Changed
- Auto-populate sort detection now handles natural numeric names and repeated serial/device suffixes more reliably for multi-inverter systems.
- Auto-populate search controls for inverter status and advanced telemetry now use native checkbox rows so they remain visible in the Home Assistant editor.

### Fixed
- Energy auto-fill no longer assigns one shared inverter daily energy sensor to multiple panels in the same serial group, preventing doubled virtual total energy.
- Per-panel daily energy sensors still map by matching local/input tokens when distinct same-serial energy sensors are available.
- Inverter status auto-fill now prefers `Device Status` over less specific same-serial sensors such as `Online Status`, Wi-Fi status, or battery status.
- Inverter status auto-fill can match serial-like tokens directly when repeated group detection would otherwise choose an input token such as `mppt1`.
- Inverter status and advanced telemetry selector lists now tolerate Home Assistant state objects that rely on the `hass.states` key rather than an `entity_id` field.

## [0.2.2] - 2026-05-30

### Added
- Panel advanced telemetry cards can now expand into inline recorder graphs inside the same telemetry pill, with independent `1h`, `6h`, and `24h` ranges.

### Fixed
- Energy KPI popups now use a virtual total panel energy history when no system energy sensor is selected, so Forecast.Solar production can be compared against the summed configured panel energy sensors.
- Virtual total KPI graph handling is now shared for Power and Energy, keeping individual panel comparison as an optional secondary graph.
- Forecast history loading now follows the virtual total graph range for Power and Energy when no primary system sensor is configured.
- Home Assistant card picker metadata now uses the bare custom element type and includes the `mdi:solar-panel` icon, allowing the card to appear correctly in the picker.
- Power and Energy popup detail cards now place Current and Forecast production on the same row, with Source shown below as a full-width row.
- Motion overlay sizing no longer creates a vertical scrollbar when the visible card content fits.
- Panel comparison graphs now open expanded automatically when a virtual total Power or Energy graph already loaded the required panel history.

## [0.2.1] - 2026-05-30

### Fixed
- Editor text and number fields now use native inputs so Layout row/column fields and Auto-populate search fields remain visible even when Home Assistant has not registered `ha-textfield` in the custom-card editor context.
- Motion overlay sizing no longer creates card scrollbars when the visible card content fits.
- The Power KPI popup now builds a virtual total panel power history from configured panel sensors when no system power sensor is selected, so Forecast.Solar production can still be compared against total live panel output.

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
