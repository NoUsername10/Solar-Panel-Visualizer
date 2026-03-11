# Solar Panel Visualizer

GUI-first Lovelace card for building a visual solar array map with live panel diagnostics, smart status coloring, and in-card configuration workflows.

[![hacs_badge](https://img.shields.io/badge/HACS-Frontend-41BDF5.svg)](https://hacs.xyz/)
[![ha_badge](https://img.shields.io/badge/Home%20Assistant-Custom%20Card-18BCF2.svg)](https://www.home-assistant.io/lovelace/)
[![coffee_badge](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-donate-orange.svg)](https://www.buymeacoffee.com/DefaultLogin)


Overview of the card (GIF). Right-click and select "Play animation" on Safari macOS: <br>
<img src="https://github.com/NoUsername10/Solar-Panel-Visualizer/blob/main/assets/card-overview.gif" width=65% height=65%>


## ✨ Quick Facts

- Built for visual clarity: panel tiles, KPI row, status labeling, and popup diagnostics, for small and big screens.
- GUI-first setup: start with rows/columns, then configure each panel slot.
- Supports large systems: scales to **100+ panels** when needed.
- Drag-and-drop panel reordering directly on the card.
- Quick setup by tapping unconfigured panels.
- Array Health Check for peer comparison and underperformance detection.
- Inverter status matching with configurable working/fault terms.
- In-card history graphs in panel and KPI popups (`1h`, `6h`, `24h`).
- Auto-populate sensors by prefix (fill empty slots in order) during setup.
- Full YAML parity for advanced users.

<br>


## 🖼️ Pictures from the GUI
Overview of the card: <br>
<img src="https://github.com/NoUsername10/Solar-Panel-Visualizer/blob/main/assets/spv-overview.png" width=40% height=40%>


Full GUI setup, no YAML needed: <br>
<img src="https://github.com/NoUsername10/Solar-Panel-Visualizer/blob/main/assets/card-configuration-setup.png" width=40% height=40%>

<details>
<summary><b>Panel health overview</b></summary><br>
<img src="https://github.com/NoUsername10/Solar-Panel-Visualizer/blob/main/assets/panel-detail1.png" width=40% height=40%> 
<img src="https://github.com/NoUsername10/Solar-Panel-Visualizer/blob/main/assets/panel-detail2.png" width=40% height=40%>
</details>


<details>
<summary><b>TTC (Tap-To-Configure) panels (Quick Setup)</b></summary><br>
<img src="https://github.com/NoUsername10/Solar-Panel-Visualizer/blob/main/assets/tap-to-configure.png" width=40% height=40%> 
</details>


<details>
<summary><b>Array health overview</b></summary><br>
<img src="https://github.com/NoUsername10/Solar-Panel-Visualizer/blob/main/assets/system-health-error.png" width=40% height=40%> 
<img src="https://github.com/NoUsername10/Solar-Panel-Visualizer/blob/main/assets/system-health-error-message.png" width=40% height=40%>
</details>


<details>
<summary><b>KPI sensors (Key Performance Indicators)</b></summary><br>
<img src="https://github.com/NoUsername10/Solar-Panel-Visualizer/blob/main/assets/kpi-energy.png" width=40% height=40%> 
<img src="https://github.com/NoUsername10/Solar-Panel-Visualizer/blob/main/assets/kpi-custom.png" width=40% height=40%>
</details>

<br>

## 🖱️ Card Interactions

<details>
<summary><b>Drag and Drop Panels</b></summary><br>

- Press and drag any panel tile onto another tile.
- The two panel slots swap positions.
- Order is saved to card config so layout remains consistent.

</details>

<details>
<summary><b>Tap-To-Config (Quick Setup)</b></summary><br>

- Tap an unconfigured panel tile.
- Quick Setup popup opens with:
  - **Select panel power sensor**
  - **Disable Panel (hide but keep slot when off)**
- After selecting power sensor, normal panel detail popup behavior is used.

</details>

<details>
<summary><b>Panel and KPI Popups</b></summary><br>

- Panel popup shows status, power, energy, deviation context, inverter status, and history graph.
- Power, Energy, and Custom KPI cards open their own popup views.
- History range chips (`1h`, `6h`, `24h`) switch graph window.

</details>

<br>

## ⚙️ Setup (GUI Sections)

<details>
<summary><b>Layout</b></summary><br>

- **Title**: Card title text.
- **Rows / Columns**: Defines array shape and total panel slots.
- **Max card width (px)**: Limits full card width on large screens.
- **Max card height (px)**: Optional height cap with internal scroll.

</details>

<details>
<summary><b>Display</b></summary><br>

- **Power decimals**: Precision for power values.
- **Energy decimals**: Precision for energy values.
- **Custom KPI decimals**: Precision for numeric custom KPI.
- **Panel tap action**: Open detail popup or no action.
- **Use one system power sensor for top KPI**:
  - Select a single power entity for top KPI power.
  - Optional **Invert system power value** for negative-source sensors.
- **Use one system daily energy sensor for top KPI**:
  - Select a single energy entity for top KPI energy.
- **Custom KPI sensor / heading / show toggle**:
  - Add a fourth KPI with custom title + sensor.
- **Limit panel tile max width**:
  - Prevents tiles from stretching too wide on large screens.
  - **Max panel tile width (px)** controls the cap.

</details>

<details>
<summary><b>Array Health Check</b></summary><br>

- **Enable Array Health Check**: Turns deviation engine on/off.
- **Deviation threshold (%)**: Relative shortfall trigger.
- **Absolute shortfall threshold (W)**: Minimum shortfall in watts.
- **Deviation check time (minutes)**: Runtime gate before checks.
- **Minimum active panels**: Required active panel count.
- **Minimum samples per panel**: Data quality gate.
- **Smoothing window (minutes)**: Averages recent power values.
- **Dynamic floor start (W)**: Suppresses low-power false positives.
- **Shared history window (hours)**: Recorder-backed baseline period.

</details>

<details>
<summary><b>Inverter Status</b></summary><br>

- **Enable inverter status checks**: Uses inverter status entity text.
- **Show inverter status on panel tiles**: Optional on-tile status text.
- **Fault terms (comma-separated)**:
  - If status matches these terms, panel is flagged inverter/error state.
- **Working terms (comma-separated)**:
  - Terms that indicate expected operation.

</details>

<details>
<summary><b>Status Colors</b></summary><br>

- **Production base / mid / peak**: Gradient colors by panel production level.
- **Deviation / Error / Unavailable**: Override state colors.
- **Production color intensity**: Controls production glow strength.

</details>

<details>
<summary><b>Panels</b></summary><br>

Each slot contains:

- **Display name**
- **Power sensor P(W)** (primary panel source)
- **Energy sensor (kWh/Wh)** (optional)
- **Show panel energy** (toggle)
- **Panel rated power (W)** (used for performance percentage)
- **Deviation derate (%)** (for naturally shaded panels in health checks)
- **Inverter status sensor (optional)**
- **Show panel tile (hide but keep slot when off)**

Tools:

- **Default panel rated power** + **Apply default rated W to all panels**
- **Auto-populate sensors by prefix** (fill empty slots in order)
- **Remove all sensors**

</details>

<br>

## 📦 Installation (HACS Recommended)

1. In HACS, add this repository as a **Custom repository**:
   - URL: `https://github.com/NoUsername10/Solar-Panel-Visualizer`
   - Category: **Dashboard**
2. Install **Solar Panel Visualizer**.
3. Reload Home Assistant frontend (or restart Home Assistant).
4. Add card type: `custom:solar-panel-visualizer`.

If the resource is not auto-added:

```yaml
url: /hacsfiles/Solar-Panel-Visualizer/solar-panel-visualizer.js
type: module
```

## 🧩 Add The Card In GUI

1. Open dashboard.
2. Click **Edit dashboard**.
3. Click **+ Add card**.
4. Select **Solar Panel Visualizer**.
5. Save.

If not listed in picker, use **Manual card**:

```yaml
type: custom:solar-panel-visualizer
```

## ⚡ Minimal YAML (GUI-first baseline)

GUI-only config:
```yaml
type: custom:solar-panel-visualizer
```

Minimal YAML-only config:
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



## 📄 License

MIT License.
