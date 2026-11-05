import type { PanelStatus } from "./types";

const SHIMMER_MS = 1_100;
const POWER_IMPACT_MS = 900;
const ALERT_RIPPLE_MS = 900;
const ALERT_RIPPLE_REPEAT_MS = 6_000;
const FLOW_PULSE_STEP_MS = 5_000;
const FLOW_PULSE_FAILSAFE_MS = 16_000;
const ALERT_STATUSES = new Set<PanelStatus>(["deviation", "inverter", "error"]);

export interface MotionFlags {
  enabled: boolean;
  powerFlow: boolean;
  updateShimmer: boolean;
  alertRipple: boolean;
}

export interface MotionSnapshot {
  totalPower: number;
  popupOpen: boolean;
  powerKpiValue: string;
  energyKpiValue: string;
  panelPowers: Record<string, number | null>;
  panelStatuses: Record<string, PanelStatus>;
}

export interface MotionState {
  panelShimmers: Set<string>;
  kpiShimmers: Set<"power" | "energy" | "custom">;
  alertRipples: Set<string>;
  powerFlowActive: boolean;
  flowPulsePanelId: string | null;
  reducedMotion: boolean;
}

type KpiKey = "power" | "energy" | "custom";

export class MotionEngine {
  private readonly _notify: () => void;
  private _snapshot?: MotionSnapshot;
  private _flags: MotionFlags = {
    enabled: false,
    powerFlow: false,
    updateShimmer: false,
    alertRipple: false,
  };
  private _panelShimmers = new Set<string>();
  private _kpiShimmers = new Set<KpiKey>();
  private _alertRipples = new Set<string>();
  private _timers = new Map<string, number>();
  private _flowPulsePanelId: string | null = null;
  private _flowPulseIndex = 0;
  private _flowPulsePanelOrder: string[] = [];
  private _reducedMotion = false;
  private _visibilityHandler = () => {
    if (this._snapshot) {
      this._refreshFlowPulseLoop(this._snapshot);
    }
  };
  private _mediaQuery?: MediaQueryList;
  private _mediaQueryHandler = (event: MediaQueryListEvent) => {
    this._reducedMotion = event.matches;
    this._clearAllMotion();
    this._notify();
  };

  public constructor(notify: () => void) {
    this._notify = notify;

    if (typeof window !== "undefined") {
      window.document.addEventListener("visibilitychange", this._visibilityHandler);
      if (typeof window.matchMedia === "function") {
        this._mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        this._reducedMotion = this._mediaQuery.matches;
        this._mediaQuery.addEventListener("change", this._mediaQueryHandler);
      }
    }
  }

  public destroy(): void {
    if (typeof window !== "undefined") {
      window.document.removeEventListener("visibilitychange", this._visibilityHandler);
    }
    this._mediaQuery?.removeEventListener("change", this._mediaQueryHandler);
    this._clearAllMotion();
    this._clearTimeoutByKey("flow-pulse-step");
    this._clearTimeoutByKey("flow-pulse-timeout");
  }

  public update(flags: MotionFlags, snapshot: MotionSnapshot): void {
    const previous = this._snapshot;
    this._flags = flags;
    this._snapshot = snapshot;

    if (!flags.enabled || this._reducedMotion) {
      this._clearAllMotion();
      this._refreshFlowPulseLoop(snapshot);
      return;
    }

    if (flags.updateShimmer && previous) {
      this._triggerKpiShimmers(previous, snapshot);
    }

    if (flags.alertRipple && previous) {
      this._triggerAlertRipples(previous, snapshot);
    }
    this._syncAlertRippleLoops(snapshot);
    this._refreshFlowPulseLoop(snapshot);
  }

  public getState(): MotionState {
    const snapshot = this._snapshot;
    return {
      panelShimmers: new Set(this._panelShimmers),
      kpiShimmers: new Set(this._kpiShimmers),
      alertRipples: new Set(this._alertRipples),
      powerFlowActive: Boolean(
        this._flags.enabled &&
          this._flags.powerFlow &&
          !this._reducedMotion &&
          snapshot &&
          snapshot.totalPower > 0 &&
          !snapshot.popupOpen,
      ),
      flowPulsePanelId: this._flowPulsePanelId,
      reducedMotion: this._reducedMotion,
    };
  }

  public triggerPowerImpactFromPulse(): void {
    const snapshot = this._snapshot;
    if (!snapshot) {
      return;
    }
    if (!this._flags.enabled || !this._flags.powerFlow || this._reducedMotion) {
      return;
    }
    if (snapshot.popupOpen || snapshot.totalPower <= 0) {
      return;
    }
    this._armTransient("power", this._kpiShimmers, POWER_IMPACT_MS, "kpi-shimmer");
  }

  public completeFlowPulse(): void {
    const activePanelId = this._flowPulsePanelId;
    if (!activePanelId) {
      return;
    }
    this._finalizeActiveFlowPulse(activePanelId);
  }

  private _refreshFlowPulseLoop(snapshot: MotionSnapshot): void {
    const activePanelIds = Object.entries(snapshot.panelPowers)
      .filter(([, power]) => typeof power === "number" && power > 0)
      .map(([panelId]) => panelId);

    const canRun = this._canRunFlowPulse(snapshot, activePanelIds.length);
    if (!canRun) {
      this._clearFlowPulseLoop();
      return;
    }

    const nextSignature = activePanelIds.join("|");
    const previousSignature = this._flowPulsePanelOrder.join("|");
    if (nextSignature !== previousSignature) {
      this._flowPulsePanelOrder = activePanelIds;
      this._flowPulseIndex = 0;
      this._clearTimeoutByKey("flow-pulse-step");
      this._clearTimeoutByKey("flow-pulse-timeout");
      if (this._flowPulsePanelId !== null) {
        this._flowPulsePanelId = null;
        this._notify();
      }
    }

    if (
      this._timers.has("flow-pulse-step") ||
      this._timers.has("flow-pulse-timeout") ||
      this._flowPulsePanelId !== null
    ) {
      return;
    }

    this._triggerNextFlowPulse();
  }

  private _canRunFlowPulse(
    snapshot: MotionSnapshot | undefined,
    activeCount: number,
  ): boolean {
    const documentHidden = typeof document !== "undefined" ? document.hidden : false;
    return Boolean(
      this._flags.enabled &&
        this._flags.powerFlow &&
        !this._reducedMotion &&
        !documentHidden &&
        snapshot &&
        snapshot.totalPower > 0 &&
        !snapshot.popupOpen &&
        activeCount > 0,
    );
  }

  private _triggerNextFlowPulse(): void {
    if (!this._canRunFlowPulse(this._snapshot, this._flowPulsePanelOrder.length)) {
      this._clearFlowPulseLoop();
      return;
    }

    const activePanelId =
      this._flowPulsePanelOrder[this._flowPulseIndex % this._flowPulsePanelOrder.length];
    this._flowPulseIndex =
      (this._flowPulseIndex + 1) % Math.max(this._flowPulsePanelOrder.length, 1);

    this._flowPulsePanelId = activePanelId;
    this._notify();

    this._clearTimeoutByKey("flow-pulse-timeout");
    const timeout = window.setTimeout(() => {
      this._timers.delete("flow-pulse-timeout");
      this._finalizeActiveFlowPulse(activePanelId);
    }, FLOW_PULSE_FAILSAFE_MS);
    this._timers.set("flow-pulse-timeout", timeout);
  }

  private _scheduleNextFlowPulse(): void {
    this._clearTimeoutByKey("flow-pulse-step");
    const stepTimer = window.setTimeout(() => {
      this._timers.delete("flow-pulse-step");
      this._triggerNextFlowPulse();
    }, FLOW_PULSE_STEP_MS);
    this._timers.set("flow-pulse-step", stepTimer);
  }

  private _finalizeActiveFlowPulse(panelId: string): void {
    if (this._flowPulsePanelId !== panelId) {
      return;
    }

    this._clearTimeoutByKey("flow-pulse-timeout");
    this._flowPulsePanelId = null;
    this._notify();
    this.triggerPowerImpactFromPulse();
    this._scheduleNextFlowPulse();
  }

  private _clearFlowPulseLoop(): void {
    this._clearTimeoutByKey("flow-pulse-step");
    this._clearTimeoutByKey("flow-pulse-timeout");
    this._flowPulsePanelOrder = [];
    this._flowPulseIndex = 0;
    if (this._flowPulsePanelId !== null) {
      this._flowPulsePanelId = null;
      this._notify();
    }
  }

  private _triggerKpiShimmers(
    previous: MotionSnapshot,
    current: MotionSnapshot,
  ): void {
    if (previous.energyKpiValue !== current.energyKpiValue) {
      this._armTransient("energy", this._kpiShimmers, SHIMMER_MS, "kpi-shimmer");
    }
  }

  private _triggerAlertRipples(
    previous: MotionSnapshot,
    current: MotionSnapshot,
  ): void {
    for (const [panelId, status] of Object.entries(current.panelStatuses)) {
      const previousStatus = previous.panelStatuses[panelId];
      if (status === previousStatus) {
        continue;
      }
      if (ALERT_STATUSES.has(status)) {
        this._armTransient(panelId, this._alertRipples, ALERT_RIPPLE_MS, "alert-ripple");
      }
    }
  }

  private _syncAlertRippleLoops(current: MotionSnapshot): void {
    if (!this._flags.alertRipple) {
      for (const key of [...this._timers.keys()]) {
        if (key.startsWith("alert-ripple-loop:")) {
          this._clearTimeoutByKey(key);
        }
      }
      return;
    }

    const activeAlertPanels = new Set(
      Object.entries(current.panelStatuses)
        .filter(([, status]) => ALERT_STATUSES.has(status))
        .map(([panelId]) => panelId),
    );

    for (const panelId of activeAlertPanels) {
      const timerKey = this._alertRippleLoopKey(panelId);
      if (this._timers.has(timerKey)) {
        continue;
      }
      this._armAlertRippleLoop(panelId);
    }

    for (const key of [...this._timers.keys()]) {
      if (!key.startsWith("alert-ripple-loop:")) {
        continue;
      }
      const panelId = key.slice("alert-ripple-loop:".length);
      if (!activeAlertPanels.has(panelId)) {
        this._clearTimeoutByKey(key);
      }
    }
  }

  private _armAlertRippleLoop(panelId: string): void {
    const timerKey = this._alertRippleLoopKey(panelId);
    this._clearTimeoutByKey(timerKey);
    const timeout = window.setTimeout(() => {
      if (!this._canRepeatAlertRipple(panelId)) {
        this._clearTimeoutByKey(timerKey);
        return;
      }
      this._armTransient(panelId, this._alertRipples, ALERT_RIPPLE_MS, "alert-ripple");
      this._armAlertRippleLoop(panelId);
    }, ALERT_RIPPLE_REPEAT_MS);
    this._timers.set(timerKey, timeout);
  }

  private _canRepeatAlertRipple(panelId: string): boolean {
    const snapshot = this._snapshot;
    if (!snapshot) {
      return false;
    }
    if (!this._flags.enabled || !this._flags.alertRipple || this._reducedMotion) {
      return false;
    }
    const status = snapshot.panelStatuses[panelId];
    return ALERT_STATUSES.has(status);
  }

  private _alertRippleLoopKey(panelId: string): string {
    return `alert-ripple-loop:${panelId}`;
  }

  private _armTransient<T extends string>(
    key: T,
    target: Set<T>,
    durationMs: number,
    timerPrefix: string,
  ): void {
    target.add(key);
    this._notify();

    const timerKey = `${timerPrefix}:${key}`;
    this._clearTimeoutByKey(timerKey);
    const timeout = window.setTimeout(() => {
      target.delete(key);
      this._timers.delete(timerKey);
      this._notify();
    }, durationMs);
    this._timers.set(timerKey, timeout);
  }

  private _clearAllMotion(): void {
    this._panelShimmers.clear();
    this._kpiShimmers.clear();
    this._alertRipples.clear();
    this._flowPulsePanelOrder = [];
    this._flowPulseIndex = 0;
    this._flowPulsePanelId = null;

    for (const key of [...this._timers.keys()]) {
      if (
        key.startsWith("panel-shimmer:") ||
        key.startsWith("kpi-shimmer:") ||
        key.startsWith("alert-ripple:") ||
        key.startsWith("alert-ripple-loop:") ||
        key.startsWith("flow-pulse-")
      ) {
        this._clearTimeoutByKey(key);
      }
    }
  }

  private _clearTimeoutByKey(key: string): void {
    const timeout = this._timers.get(key);
    if (timeout !== undefined) {
      window.clearTimeout(timeout);
      this._timers.delete(key);
    }
  }
}
