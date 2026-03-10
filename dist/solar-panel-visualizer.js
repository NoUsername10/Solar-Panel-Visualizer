const pe = "custom:solar-panel-visualizer", ke = {
  production_start: "#8dcf72",
  production_mid: "#bfe36a",
  production_end: "#ffd35a",
  deviation: "#ff9667",
  error: "#ff627f",
  unavailable: "#586779"
}, mt = 2, ft = 3, gt = 15, yt = 50, vt = 3, bt = 3, wt = 20, xt = 0, $t = 30, Pt = 12, St = 0, Ct = 2, Et = 0, Nt = !1, kt = 220, At = 980, Ft = 1, Tt = ["fault", "alarm", "error", "failed", "failure", "trip"], It = [
  "normal",
  "ok",
  "running",
  "waiting for operation",
  "producing"
], I = (r, e, t = 1, s = 12) => {
  const i = Number(r);
  return Number.isFinite(i) ? Math.min(Math.max(Math.round(i), t), s) : e;
}, oe = (r, e, t = 0, s = 100) => {
  const i = Number(r);
  return Number.isFinite(i) ? Math.min(Math.max(i, t), s) : e;
}, E = (r) => {
  if (typeof r != "string")
    return;
  const e = r.trim();
  return e.length > 0 ? e : void 0;
}, Yt = (r) => {
  if (typeof r == "string")
    return r.trim();
}, L = (r, e) => typeof r == "boolean" ? r : e, je = (r, e) => {
  const s = (Array.isArray(r) ? r : typeof r == "string" ? r.split(",") : []).map((i) => typeof i == "string" ? i.trim().toLowerCase() : "").filter((i) => i.length > 0);
  return s.length === 0 ? [...e] : [...new Set(s)];
}, Ke = (r, e, t) => {
  if (r == null || r === "")
    return;
  const s = Number(r);
  if (Number.isFinite(s))
    return Math.min(Math.max(s, e), t);
}, Rt = (r, e, t) => {
  if (r == null || r === "")
    return;
  const s = Number(r);
  if (!(!Number.isFinite(s) || s < e))
    return Math.min(s, t);
}, qt = (r) => `panel-${r + 1}`, Zt = (r) => r === "none" ? "none" : "details", Xt = (r) => {
  if (typeof r != "object" || r === null)
    return;
  const e = r, t = e.columns === "full" || typeof e.columns == "number" ? e.columns : void 0, s = e.rows === "auto" || typeof e.rows == "number" ? e.rows : void 0;
  if (!(t === void 0 && s === void 0))
    return {
      columns: t,
      rows: s
    };
}, Jt = (r, e) => {
  const t = L(r?.enabled, !0);
  return {
    id: E(r?.id) ?? qt(e),
    name: E(r?.name),
    power_entity: t ? E(r?.power_entity) : void 0,
    energy_entity: t ? E(r?.energy_entity) : void 0,
    show_energy: L(r?.show_energy, !1),
    inverter_status_entity: t ? E(r?.inverter_status_entity) ?? E(r?.error_entity) : void 0,
    error_entity: t ? E(r?.error_entity) : void 0,
    enabled: t,
    rated_power_w: Rt(r?.rated_power_w, 1, 2e3),
    deviation_derate_percent: oe(r?.deviation_derate_percent, 100, 1, 100)
  };
}, Mt = (r, e, t = []) => {
  const s = r * e;
  return Array.from(
    { length: s },
    (i, n) => Jt(t[n], n)
  );
}, Qt = (r = mt, e = ft) => ({
  type: pe,
  title: "Solar Array",
  rows: r,
  columns: e,
  panels: Mt(r, e),
  enable_inverter_status: !1,
  inverter_fault_terms: [...Tt],
  inverter_working_terms: [...It],
  show_inverter_status_on_tiles: !1,
  enable_array_checks: !1,
  deviation_threshold_percent: gt,
  deviation_absolute_w_threshold: yt,
  deviation_min_active_panels: vt,
  deviation_min_samples: bt,
  deviation_min_runtime_minutes: wt,
  deviation_smoothing_minutes: xt,
  deviation_dynamic_floor_w: $t,
  deviation_history_hours: Pt,
  colors: ke,
  production_color_intensity: Ft,
  show_energy: !0,
  use_system_power_entity: !1,
  system_power_entity: void 0,
  invert_system_power: !1,
  use_system_energy_entity: !1,
  system_energy_entity: void 0,
  show_custom_kpi: !0,
  custom_kpi_title: "Custom KPI",
  custom_kpi_entity: void 0,
  custom_kpi_decimals: Et,
  panel_tap_action: "details",
  power_decimals: St,
  energy_decimals: Ct,
  limit_panel_width: Nt,
  panel_max_width_px: kt,
  max_card_width_px: At
}), F = (r = {}) => {
  const e = I(r.rows, mt), t = I(r.columns, ft), s = {
    ...ke,
    ...r.colors ?? {}
  };
  return {
    type: E(r.type) ?? pe,
    title: E(r.title),
    rows: e,
    columns: t,
    panels: Mt(e, t, r.panels ?? []),
    enable_inverter_status: L(r.enable_inverter_status, !1),
    inverter_fault_terms: je(
      r.inverter_fault_terms,
      Tt
    ),
    inverter_working_terms: je(
      r.inverter_working_terms,
      It
    ),
    show_inverter_status_on_tiles: L(
      r.show_inverter_status_on_tiles,
      !1
    ),
    enable_array_checks: L(r.enable_array_checks, !1),
    deviation_threshold_percent: oe(
      r.deviation_threshold_percent,
      gt,
      1,
      100
    ),
    deviation_absolute_w_threshold: oe(
      r.deviation_absolute_w_threshold,
      yt,
      0,
      5e3
    ),
    deviation_min_active_panels: I(
      r.deviation_min_active_panels,
      vt,
      2,
      30
    ),
    deviation_min_samples: I(
      r.deviation_min_samples,
      bt,
      1,
      120
    ),
    deviation_min_runtime_minutes: I(
      r.deviation_min_runtime_minutes,
      wt,
      0,
      1440
    ),
    deviation_smoothing_minutes: I(
      r.deviation_smoothing_minutes,
      xt,
      0,
      1440
    ),
    deviation_dynamic_floor_w: oe(
      r.deviation_dynamic_floor_w,
      $t,
      0,
      5e3
    ),
    deviation_restart_entity: E(r.deviation_restart_entity),
    deviation_history_hours: I(
      r.deviation_history_hours,
      Pt,
      1,
      168
    ),
    colors: s,
    production_color_intensity: oe(
      r.production_color_intensity,
      Ft,
      0.2,
      1.6
    ),
    show_energy: !0,
    use_system_power_entity: L(r.use_system_power_entity, !1),
    system_power_entity: E(r.system_power_entity),
    invert_system_power: L(r.invert_system_power, !1),
    use_system_energy_entity: L(r.use_system_energy_entity, !1),
    system_energy_entity: E(r.system_energy_entity),
    show_custom_kpi: L(r.show_custom_kpi, !0),
    custom_kpi_title: Yt(r.custom_kpi_title) ?? "Custom KPI",
    custom_kpi_entity: E(r.custom_kpi_entity),
    custom_kpi_decimals: I(
      r.custom_kpi_decimals,
      Et,
      0,
      4
    ),
    panel_tap_action: Zt(r.panel_tap_action),
    power_decimals: I(
      r.power_decimals,
      St,
      0,
      4
    ),
    energy_decimals: I(
      r.energy_decimals,
      Ct,
      0,
      4
    ),
    limit_panel_width: L(
      r.limit_panel_width,
      Nt
    ),
    panel_max_width_px: I(
      r.panel_max_width_px,
      kt,
      120,
      320
    ),
    default_panel_rated_power_w: Rt(
      r.default_panel_rated_power_w,
      1,
      2e3
    ),
    max_card_width_px: Ke(r.max_card_width_px, 300, 2400) ?? At,
    max_card_height_px: Ke(r.max_card_height_px, 300, 2600),
    grid_options: Xt(r.grid_options)
  };
}, es = (r) => {
  const e = [];
  return typeof r != "object" || r === null ? ["Configuration must be an object."] : (r.rows !== void 0 && (!Number.isFinite(Number(r.rows)) || Number(r.rows) < 1) && e.push("`rows` must be a positive number."), r.columns !== void 0 && (!Number.isFinite(Number(r.columns)) || Number(r.columns) < 1) && e.push("`columns` must be a positive number."), r.max_card_width_px !== void 0 && !Number.isFinite(Number(r.max_card_width_px)) && e.push("`max_card_width_px` must be a number if set."), r.panel_max_width_px !== void 0 && (!Number.isFinite(Number(r.panel_max_width_px)) || Number(r.panel_max_width_px) < 120 || Number(r.panel_max_width_px) > 320) && e.push("`panel_max_width_px` must be between 120 and 320."), r.max_card_height_px !== void 0 && !Number.isFinite(Number(r.max_card_height_px)) && e.push("`max_card_height_px` must be a number if set."), r.custom_kpi_decimals !== void 0 && (!Number.isFinite(Number(r.custom_kpi_decimals)) || Number(r.custom_kpi_decimals) < 0 || Number(r.custom_kpi_decimals) > 4) && e.push("`custom_kpi_decimals` must be between 0 and 4."), r.production_color_intensity !== void 0 && (!Number.isFinite(Number(r.production_color_intensity)) || Number(r.production_color_intensity) < 0.2 || Number(r.production_color_intensity) > 1.6) && e.push("`production_color_intensity` must be between 0.2 and 1.6."), r.deviation_absolute_w_threshold !== void 0 && (!Number.isFinite(Number(r.deviation_absolute_w_threshold)) || Number(r.deviation_absolute_w_threshold) < 0) && e.push("`deviation_absolute_w_threshold` must be 0 or higher."), r.deviation_min_active_panels !== void 0 && (!Number.isFinite(Number(r.deviation_min_active_panels)) || Number(r.deviation_min_active_panels) < 2) && e.push("`deviation_min_active_panels` must be 2 or higher."), r.deviation_min_samples !== void 0 && (!Number.isFinite(Number(r.deviation_min_samples)) || Number(r.deviation_min_samples) < 1) && e.push("`deviation_min_samples` must be 1 or higher."), r.deviation_min_runtime_minutes !== void 0 && (!Number.isFinite(Number(r.deviation_min_runtime_minutes)) || Number(r.deviation_min_runtime_minutes) < 0) && e.push("`deviation_min_runtime_minutes` must be 0 or higher."), r.deviation_smoothing_minutes !== void 0 && (!Number.isFinite(Number(r.deviation_smoothing_minutes)) || Number(r.deviation_smoothing_minutes) < 0) && e.push("`deviation_smoothing_minutes` must be 0 or higher."), r.deviation_dynamic_floor_w !== void 0 && (!Number.isFinite(Number(r.deviation_dynamic_floor_w)) || Number(r.deviation_dynamic_floor_w) < 0) && e.push("`deviation_dynamic_floor_w` must be 0 or higher."), r.deviation_history_hours !== void 0 && (!Number.isFinite(Number(r.deviation_history_hours)) || Number(r.deviation_history_hours) < 1) && e.push("`deviation_history_hours` must be 1 or higher."), Array.isArray(r.panels) && r.panels.forEach((t, s) => {
    const i = t?.deviation_derate_percent;
    i !== void 0 && (!Number.isFinite(Number(i)) || Number(i) < 1 || Number(i) > 100) && e.push(
      `\`panels[${s}].deviation_derate_percent\` must be between 1 and 100.`
    );
  }), e);
};
const ge = globalThis, Ae = ge.ShadowRoot && (ge.ShadyCSS === void 0 || ge.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Fe = /* @__PURE__ */ Symbol(), Ye = /* @__PURE__ */ new WeakMap();
let Dt = class {
  constructor(e, t, s) {
    if (this._$cssResult$ = !0, s !== Fe) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (Ae && e === void 0) {
      const s = t !== void 0 && t.length === 1;
      s && (e = Ye.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), s && Ye.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const ts = (r) => new Dt(typeof r == "string" ? r : r + "", void 0, Fe), Ht = (r, ...e) => {
  const t = r.length === 1 ? r[0] : e.reduce((s, i, n) => s + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + r[n + 1], r[0]);
  return new Dt(t, r, Fe);
}, ss = (r, e) => {
  if (Ae) r.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const s = document.createElement("style"), i = ge.litNonce;
    i !== void 0 && s.setAttribute("nonce", i), s.textContent = t.cssText, r.appendChild(s);
  }
}, qe = Ae ? (r) => r : (r) => r instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const s of e.cssRules) t += s.cssText;
  return ts(t);
})(r) : r;
const { is, defineProperty: rs, getOwnPropertyDescriptor: ns, getOwnPropertyNames: os, getOwnPropertySymbols: as, getPrototypeOf: ls } = Object, z = globalThis, Ze = z.trustedTypes, cs = Ze ? Ze.emptyScript : "", ps = z.reactiveElementPolyfillSupport, ae = (r, e) => r, Ne = { toAttribute(r, e) {
  switch (e) {
    case Boolean:
      r = r ? cs : null;
      break;
    case Object:
    case Array:
      r = r == null ? r : JSON.stringify(r);
  }
  return r;
}, fromAttribute(r, e) {
  let t = r;
  switch (e) {
    case Boolean:
      t = r !== null;
      break;
    case Number:
      t = r === null ? null : Number(r);
      break;
    case Object:
    case Array:
      try {
        t = JSON.parse(r);
      } catch {
        t = null;
      }
  }
  return t;
} }, Lt = (r, e) => !is(r, e), Xe = { attribute: !0, type: String, converter: Ne, reflect: !1, useDefault: !1, hasChanged: Lt };
Symbol.metadata ?? (Symbol.metadata = /* @__PURE__ */ Symbol("metadata")), z.litPropertyMetadata ?? (z.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let q = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = Xe) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const s = /* @__PURE__ */ Symbol(), i = this.getPropertyDescriptor(e, s, t);
      i !== void 0 && rs(this.prototype, e, i);
    }
  }
  static getPropertyDescriptor(e, t, s) {
    const { get: i, set: n } = ns(this.prototype, e) ?? { get() {
      return this[t];
    }, set(o) {
      this[t] = o;
    } };
    return { get: i, set(o) {
      const l = i?.call(this);
      n?.call(this, o), this.requestUpdate(e, l, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Xe;
  }
  static _$Ei() {
    if (this.hasOwnProperty(ae("elementProperties"))) return;
    const e = ls(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(ae("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(ae("properties"))) {
      const t = this.properties, s = [...os(t), ...as(t)];
      for (const i of s) this.createProperty(i, t[i]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [s, i] of t) this.elementProperties.set(s, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, s] of this.elementProperties) {
      const i = this._$Eu(t, s);
      i !== void 0 && this._$Eh.set(i, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const s = new Set(e.flat(1 / 0).reverse());
      for (const i of s) t.unshift(qe(i));
    } else e !== void 0 && t.push(qe(e));
    return t;
  }
  static _$Eu(e, t) {
    const s = t.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
  }
  addController(e) {
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
  }
  removeController(e) {
    this._$EO?.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
    for (const s of t.keys()) this.hasOwnProperty(s) && (e.set(s, this[s]), delete this[s]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return ss(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((e) => e.hostDisconnected?.());
  }
  attributeChangedCallback(e, t, s) {
    this._$AK(e, s);
  }
  _$ET(e, t) {
    const s = this.constructor.elementProperties.get(e), i = this.constructor._$Eu(e, s);
    if (i !== void 0 && s.reflect === !0) {
      const n = (s.converter?.toAttribute !== void 0 ? s.converter : Ne).toAttribute(t, s.type);
      this._$Em = e, n == null ? this.removeAttribute(i) : this.setAttribute(i, n), this._$Em = null;
    }
  }
  _$AK(e, t) {
    const s = this.constructor, i = s._$Eh.get(e);
    if (i !== void 0 && this._$Em !== i) {
      const n = s.getPropertyOptions(i), o = typeof n.converter == "function" ? { fromAttribute: n.converter } : n.converter?.fromAttribute !== void 0 ? n.converter : Ne;
      this._$Em = i;
      const l = o.fromAttribute(t, n.type);
      this[i] = l ?? this._$Ej?.get(i) ?? l, this._$Em = null;
    }
  }
  requestUpdate(e, t, s, i = !1, n) {
    if (e !== void 0) {
      const o = this.constructor;
      if (i === !1 && (n = this[e]), s ?? (s = o.getPropertyOptions(e)), !((s.hasChanged ?? Lt)(n, t) || s.useDefault && s.reflect && n === this._$Ej?.get(e) && !this.hasAttribute(o._$Eu(e, s)))) return;
      this.C(e, t, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: s, reflect: i, wrapped: n }, o) {
    s && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, o ?? t ?? this[e]), n !== !0 || o !== void 0) || (this._$AL.has(e) || (this.hasUpdated || s || (t = void 0), this._$AL.set(e, t)), i === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (t) {
      Promise.reject(t);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [i, n] of this._$Ep) this[i] = n;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [i, n] of s) {
        const { wrapped: o } = n, l = this[i];
        o !== !0 || this._$AL.has(i) || l === void 0 || this.C(i, void 0, n, l);
      }
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((s) => s.hostUpdate?.()), this.update(t)) : this._$EM();
    } catch (s) {
      throw e = !1, this._$EM(), s;
    }
    e && this._$AE(t);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    this._$EO?.forEach((t) => t.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((t) => this._$ET(t, this[t]))), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
q.elementStyles = [], q.shadowRootOptions = { mode: "open" }, q[ae("elementProperties")] = /* @__PURE__ */ new Map(), q[ae("finalized")] = /* @__PURE__ */ new Map(), ps?.({ ReactiveElement: q }), (z.reactiveElementVersions ?? (z.reactiveElementVersions = [])).push("2.1.2");
const le = globalThis, Je = (r) => r, ye = le.trustedTypes, Qe = ye ? ye.createPolicy("lit-html", { createHTML: (r) => r }) : void 0, Ot = "$lit$", U = `lit$${Math.random().toFixed(9).slice(2)}$`, Ut = "?" + U, hs = `<${Ut}>`, j = document, he = () => j.createComment(""), de = (r) => r === null || typeof r != "object" && typeof r != "function", Te = Array.isArray, ds = (r) => Te(r) || typeof r?.[Symbol.iterator] == "function", Ee = `[ 	
\f\r]`, ie = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, et = /-->/g, tt = />/g, G = RegExp(`>|${Ee}(?:([^\\s"'>=/]+)(${Ee}*=${Ee}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), st = /'/g, it = /"/g, zt = /^(?:script|style|textarea|title)$/i, us = (r) => (e, ...t) => ({ _$litType$: r, strings: e, values: t }), m = us(1), X = /* @__PURE__ */ Symbol.for("lit-noChange"), g = /* @__PURE__ */ Symbol.for("lit-nothing"), rt = /* @__PURE__ */ new WeakMap(), B = j.createTreeWalker(j, 129);
function Wt(r, e) {
  if (!Te(r) || !r.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Qe !== void 0 ? Qe.createHTML(e) : e;
}
const _s = (r, e) => {
  const t = r.length - 1, s = [];
  let i, n = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", o = ie;
  for (let l = 0; l < t; l++) {
    const a = r[l];
    let d, h, p = -1, u = 0;
    for (; u < a.length && (o.lastIndex = u, h = o.exec(a), h !== null); ) u = o.lastIndex, o === ie ? h[1] === "!--" ? o = et : h[1] !== void 0 ? o = tt : h[2] !== void 0 ? (zt.test(h[2]) && (i = RegExp("</" + h[2], "g")), o = G) : h[3] !== void 0 && (o = G) : o === G ? h[0] === ">" ? (o = i ?? ie, p = -1) : h[1] === void 0 ? p = -2 : (p = o.lastIndex - h[2].length, d = h[1], o = h[3] === void 0 ? G : h[3] === '"' ? it : st) : o === it || o === st ? o = G : o === et || o === tt ? o = ie : (o = G, i = void 0);
    const _ = o === G && r[l + 1].startsWith("/>") ? " " : "";
    n += o === ie ? a + hs : p >= 0 ? (s.push(d), a.slice(0, p) + Ot + a.slice(p) + U + _) : a + U + (p === -2 ? l : _);
  }
  return [Wt(r, n + (r[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), s];
};
class ue {
  constructor({ strings: e, _$litType$: t }, s) {
    let i;
    this.parts = [];
    let n = 0, o = 0;
    const l = e.length - 1, a = this.parts, [d, h] = _s(e, t);
    if (this.el = ue.createElement(d, s), B.currentNode = this.el.content, t === 2 || t === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (i = B.nextNode()) !== null && a.length < l; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const p of i.getAttributeNames()) if (p.endsWith(Ot)) {
          const u = h[o++], _ = i.getAttribute(p).split(U), f = /([.?@])?(.*)/.exec(u);
          a.push({ type: 1, index: n, name: f[2], strings: _, ctor: f[1] === "." ? fs : f[1] === "?" ? gs : f[1] === "@" ? ys : $e }), i.removeAttribute(p);
        } else p.startsWith(U) && (a.push({ type: 6, index: n }), i.removeAttribute(p));
        if (zt.test(i.tagName)) {
          const p = i.textContent.split(U), u = p.length - 1;
          if (u > 0) {
            i.textContent = ye ? ye.emptyScript : "";
            for (let _ = 0; _ < u; _++) i.append(p[_], he()), B.nextNode(), a.push({ type: 2, index: ++n });
            i.append(p[u], he());
          }
        }
      } else if (i.nodeType === 8) if (i.data === Ut) a.push({ type: 2, index: n });
      else {
        let p = -1;
        for (; (p = i.data.indexOf(U, p + 1)) !== -1; ) a.push({ type: 7, index: n }), p += U.length - 1;
      }
      n++;
    }
  }
  static createElement(e, t) {
    const s = j.createElement("template");
    return s.innerHTML = e, s;
  }
}
function J(r, e, t = r, s) {
  if (e === X) return e;
  let i = s !== void 0 ? t._$Co?.[s] : t._$Cl;
  const n = de(e) ? void 0 : e._$litDirective$;
  return i?.constructor !== n && (i?._$AO?.(!1), n === void 0 ? i = void 0 : (i = new n(r), i._$AT(r, t, s)), s !== void 0 ? (t._$Co ?? (t._$Co = []))[s] = i : t._$Cl = i), i !== void 0 && (e = J(r, i._$AS(r, e.values), i, s)), e;
}
class ms {
  constructor(e, t) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: t }, parts: s } = this._$AD, i = (e?.creationScope ?? j).importNode(t, !0);
    B.currentNode = i;
    let n = B.nextNode(), o = 0, l = 0, a = s[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let d;
        a.type === 2 ? d = new _e(n, n.nextSibling, this, e) : a.type === 1 ? d = new a.ctor(n, a.name, a.strings, this, e) : a.type === 6 && (d = new vs(n, this, e)), this._$AV.push(d), a = s[++l];
      }
      o !== a?.index && (n = B.nextNode(), o++);
    }
    return B.currentNode = j, i;
  }
  p(e) {
    let t = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(e, s, t), t += s.strings.length - 2) : s._$AI(e[t])), t++;
  }
}
class _e {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, t, s, i) {
    this.type = 2, this._$AH = g, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = s, this.options = i, this._$Cv = i?.isConnected ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const t = this._$AM;
    return t !== void 0 && e?.nodeType === 11 && (e = t.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, t = this) {
    e = J(this, e, t), de(e) ? e === g || e == null || e === "" ? (this._$AH !== g && this._$AR(), this._$AH = g) : e !== this._$AH && e !== X && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : ds(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== g && de(this._$AH) ? this._$AA.nextSibling.data = e : this.T(j.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: t, _$litType$: s } = e, i = typeof s == "number" ? this._$AC(e) : (s.el === void 0 && (s.el = ue.createElement(Wt(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === i) this._$AH.p(t);
    else {
      const n = new ms(i, this), o = n.u(this.options);
      n.p(t), this.T(o), this._$AH = n;
    }
  }
  _$AC(e) {
    let t = rt.get(e.strings);
    return t === void 0 && rt.set(e.strings, t = new ue(e)), t;
  }
  k(e) {
    Te(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let s, i = 0;
    for (const n of e) i === t.length ? t.push(s = new _e(this.O(he()), this.O(he()), this, this.options)) : s = t[i], s._$AI(n), i++;
    i < t.length && (this._$AR(s && s._$AB.nextSibling, i), t.length = i);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    for (this._$AP?.(!1, !0, t); e !== this._$AB; ) {
      const s = Je(e).nextSibling;
      Je(e).remove(), e = s;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class $e {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, s, i, n) {
    this.type = 1, this._$AH = g, this._$AN = void 0, this.element = e, this.name = t, this._$AM = i, this.options = n, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = g;
  }
  _$AI(e, t = this, s, i) {
    const n = this.strings;
    let o = !1;
    if (n === void 0) e = J(this, e, t, 0), o = !de(e) || e !== this._$AH && e !== X, o && (this._$AH = e);
    else {
      const l = e;
      let a, d;
      for (e = n[0], a = 0; a < n.length - 1; a++) d = J(this, l[s + a], t, a), d === X && (d = this._$AH[a]), o || (o = !de(d) || d !== this._$AH[a]), d === g ? e = g : e !== g && (e += (d ?? "") + n[a + 1]), this._$AH[a] = d;
    }
    o && !i && this.j(e);
  }
  j(e) {
    e === g ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class fs extends $e {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === g ? void 0 : e;
  }
}
class gs extends $e {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== g);
  }
}
class ys extends $e {
  constructor(e, t, s, i, n) {
    super(e, t, s, i, n), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = J(this, e, t, 0) ?? g) === X) return;
    const s = this._$AH, i = e === g && s !== g || e.capture !== s.capture || e.once !== s.once || e.passive !== s.passive, n = e !== g && (s === g || i);
    i && this.element.removeEventListener(this.name, this, s), n && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class vs {
  constructor(e, t, s) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    J(this, e);
  }
}
const bs = le.litHtmlPolyfillSupport;
bs?.(ue, _e), (le.litHtmlVersions ?? (le.litHtmlVersions = [])).push("3.3.2");
const ws = (r, e, t) => {
  const s = t?.renderBefore ?? e;
  let i = s._$litPart$;
  if (i === void 0) {
    const n = t?.renderBefore ?? null;
    s._$litPart$ = i = new _e(e.insertBefore(he(), n), n, void 0, t ?? {});
  }
  return i._$AI(r), i;
};
const ce = globalThis;
class Z extends q {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var t;
    const e = super.createRenderRoot();
    return (t = this.renderOptions).renderBefore ?? (t.renderBefore = e.firstChild), e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = ws(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return X;
  }
}
Z._$litElement$ = !0, Z.finalized = !0, ce.litElementHydrateSupport?.({ LitElement: Z });
const xs = ce.litElementPolyfillSupport;
xs?.({ LitElement: Z });
(ce.litElementVersions ?? (ce.litElementVersions = [])).push("4.2.2");
const $s = (r) => Object.is(r, -0) ? 0 : r, Ps = (r) => Math.min(Math.max(Math.round(r), 0), 4), Ss = (r, e, t, s) => {
  const i = Number(r);
  if (!Number.isFinite(i))
    return null;
  const n = Ps(t), o = new Intl.NumberFormat(e, {
    minimumFractionDigits: n,
    maximumFractionDigits: n
  }).format($s(i)), l = s?.trim();
  return l ? `${o} ${l}` : o;
}, Gt = 1.2, Cs = /* @__PURE__ */ new Set(["unknown", "unavailable", "none", "null", ""]), V = (r, e = 0, t = 1) => Math.min(Math.max(r, e), t), Y = (r) => {
  if (!r)
    return null;
  const e = r.state?.toString().trim().toLowerCase();
  if (Cs.has(e))
    return null;
  const t = Number(r.state);
  return Number.isFinite(t) ? t : null;
}, Es = (r) => {
  if (r == null)
    return;
  const e = r.toString().trim();
  return e.length > 0 ? e : void 0;
}, nt = (r) => r.toLowerCase().match(/[a-z0-9]+/g) ?? [], ot = (r, e) => {
  const t = nt(r);
  return t.length === 0 ? !1 : e.some((s) => {
    const i = nt(s);
    if (i.length === 0 || i.length > t.length)
      return !1;
    for (let n = 0; n <= t.length - i.length; n += 1) {
      let o = !0;
      for (let l = 0; l < i.length; l += 1)
        if (t[n + l] !== i[l]) {
          o = !1;
          break;
        }
      if (o)
        return !0;
    }
    return !1;
  });
}, re = (r, e) => {
  const t = r?.attributes?.friendly_name;
  return typeof t == "string" && t.trim().length > 0 ? t : e;
}, at = (r, e, t, s = "en") => {
  if (r === null)
    return "Unavailable";
  const i = Object.is(r, -0) ? 0 : r, n = new Intl.NumberFormat(s, {
    minimumFractionDigits: t,
    maximumFractionDigits: t
  }).format(i);
  return e ? `${n} ${e}` : n;
}, lt = (r) => {
  const e = r.replace("#", ""), t = e.length === 3 ? e.split("").map((s) => `${s}${s}`).join("") : e;
  return [
    parseInt(t.slice(0, 2), 16),
    parseInt(t.slice(2, 4), 16),
    parseInt(t.slice(4, 6), 16)
  ];
}, ct = (r, e, t) => {
  const s = V(t), [i, n, o] = lt(r), [l, a, d] = lt(e), h = (p, u) => Math.round(p + (u - p) * s);
  return `rgb(${h(i, l)}, ${h(n, a)}, ${h(o, d)})`;
}, Ns = (r, e, t, s) => {
  const i = V(s);
  return i <= 0.5 ? ct(r, e, i * 2) : ct(e, t, (i - 0.5) * 2);
}, ks = (r) => {
  if (r.length === 0)
    return 0;
  const e = [...r].sort((n, o) => n - o), t = Math.floor(e.length * 0.4), s = e.slice(t), i = s.reduce((n, o) => n + o, 0) / Math.max(s.length, 1);
  return V(i, 0, Gt);
}, As = (r, e, t) => {
  if (t <= 0)
    return r;
  const s = e - t * 60 * 1e3;
  return r.filter((i) => i.ts >= s);
}, Fs = (r) => {
  if (r.length < 2)
    return 1;
  const e = [];
  for (let s = 1; s < r.length; s += 1) {
    const i = (r[s].ts - r[s - 1].ts) / 6e4;
    Number.isFinite(i) && i > 0 && e.push(i);
  }
  if (e.length === 0)
    return 1;
  e.sort((s, i) => s - i);
  const t = Math.floor(e.length / 2);
  return e.length % 2 === 0 ? (e[t - 1] + e[t]) / 2 : e[t];
}, Ts = (r, e, t, s) => {
  if (!e || e.length === 0)
    return {
      value: r,
      sampleCount: 1,
      firstSampleTs: t
    };
  const i = e.filter((h) => Number.isFinite(h.value)).sort((h, p) => h.ts - p.ts);
  if (i.length === 0)
    return {
      value: r,
      sampleCount: 1,
      firstSampleTs: t
    };
  const n = As(i, t, s), o = Fs(i), l = s > 0 ? Math.max(2, Math.ceil(s / Math.max(o, 0.1)) + 1) : 1;
  let a = n.length > 0 ? n : i;
  return s > 0 && a.length < l && i.length > a.length && (a = i.slice(-l)), {
    value: a.reduce((h, p) => h + p.value, 0) / Math.max(a.length, 1),
    sampleCount: a.length,
    firstSampleTs: i[0].ts ?? null
  };
}, pt = (r, e, t) => {
  const s = e?.locale?.language ?? "en", i = t?.nowMs ?? Date.now(), n = { ...ke, ...r.colors ?? {} }, o = r.enable_inverter_status ?? !1, l = (r.inverter_fault_terms ?? []).map((c) => c.trim().toLowerCase()).filter((c) => c.length > 0), a = (r.inverter_working_terms ?? []).map((c) => c.trim().toLowerCase()).filter((c) => c.length > 0), d = r.production_color_intensity ?? 1, h = t?.deviationEnabled ?? !0, p = r.deviation_min_active_panels ?? 3, u = r.deviation_min_samples ?? 3, _ = r.deviation_min_runtime_minutes ?? 15, f = r.deviation_smoothing_minutes ?? 0, v = r.deviation_dynamic_floor_w ?? 20, $ = r.deviation_threshold_percent ?? 15, T = r.deviation_absolute_w_threshold ?? 50, N = t?.historyByEntityId ?? {}, k = r.panels.map((c, w) => {
    const K = c.enabled ?? !0, A = c.name ?? `Panel ${w + 1}`, R = c.inverter_status_entity ?? c.error_entity, y = R ? e?.states?.[R] : void 0, b = R ? Es(y?.state) ?? "Unavailable" : void 0, C = re(
      y,
      R
    ), M = b !== void 0 && b !== "Unavailable" && ot(b, l), D = b !== void 0 && b !== "Unavailable" && ot(b, a);
    if (!K)
      return {
        config: c,
        slotIndex: w,
        label: A,
        power: null,
        energy: null,
        inverterStatusEntityName: C,
        inverterStatusDisplay: b,
        inverterFaultMatched: M,
        inverterWorkingMatched: D,
        reason: "Panel slot is hidden in the card configuration.",
        status: "disabled",
        enabled: !1,
        hiddenSlot: !0
      };
    if (!c.power_entity)
      return {
        config: c,
        slotIndex: w,
        label: A,
        power: null,
        energy: null,
        inverterStatusEntityName: C,
        inverterStatusDisplay: b,
        inverterFaultMatched: M,
        inverterWorkingMatched: D,
        reason: "Select a power sensor to activate this panel slot.",
        status: "unconfigured",
        enabled: !0,
        hiddenSlot: !1
      };
    const H = e?.states?.[c.power_entity], ee = c.energy_entity ? e?.states?.[c.energy_entity] : void 0;
    if (!H)
      return {
        config: c,
        slotIndex: w,
        label: A,
        power: null,
        energy: null,
        inverterStatusEntityName: C,
        inverterStatusDisplay: b,
        inverterFaultMatched: M,
        inverterWorkingMatched: D,
        reason: `Power entity ${c.power_entity} was not found.`,
        status: "offline",
        enabled: !0,
        hiddenSlot: !1
      };
    if (o && b && b !== "Unavailable" && M)
      return {
        config: c,
        slotIndex: w,
        label: A,
        power: Y(H),
        energy: Y(ee),
        powerEntityName: re(H, c.power_entity),
        inverterStatusEntityName: C,
        inverterStatusDisplay: b,
        inverterFaultMatched: M,
        inverterWorkingMatched: D,
        reason: `Current inverter status: "${b}" matches configured fault terms.`,
        status: "error",
        enabled: !0,
        hiddenSlot: !1
      };
    if (o && b && b !== "Unavailable" && a.length > 0 && !D)
      return {
        config: c,
        slotIndex: w,
        label: A,
        power: Y(H),
        energy: Y(ee),
        powerEntityName: re(H, c.power_entity),
        inverterStatusEntityName: C,
        inverterStatusDisplay: b,
        inverterFaultMatched: M,
        inverterWorkingMatched: D,
        reason: `Current inverter status: "${b}" does not match configured working terms.`,
        status: "inverter",
        enabled: !0,
        hiddenSlot: !1
      };
    const te = Y(H), me = Y(ee);
    return te === null ? {
      config: c,
      slotIndex: w,
      label: A,
      power: null,
      energy: me,
      powerEntityName: re(H, c.power_entity),
      inverterStatusEntityName: C,
      inverterStatusDisplay: b,
      inverterFaultMatched: M,
      inverterWorkingMatched: D,
      reason: `${c.power_entity} is unavailable.`,
      status: "offline",
      enabled: !0,
      hiddenSlot: !1
    } : {
      config: c,
      slotIndex: w,
      label: A,
      power: te,
      energy: me,
      powerEntityName: re(H, c.power_entity),
      inverterStatusEntityName: C,
      inverterStatusDisplay: b,
      inverterFaultMatched: M,
      inverterWorkingMatched: D,
      reason: "Producing within the expected array range.",
      status: "normal",
      enabled: !0,
      hiddenSlot: !1
    };
  }), P = k.filter(
    (c) => c.status === "normal" && c.power !== null
  ).map((c) => c.power ?? 0), x = P.length > 0 ? Math.max(...P) : 0;
  let Ie = 0, Re = 0, Me = 0, De = 0, He = 0, Le = 0, Oe = 0, O, Q = !1;
  const Ue = k.filter((c) => c.status === "normal" && c.power !== null).flatMap((c) => {
    const w = c.config.rated_power_w ?? r.default_panel_rated_power_w ?? null;
    if (w === null || w <= 0 || !c.config.power_entity)
      return [];
    const K = Math.min(
      Math.max(c.config.deviation_derate_percent ?? 100, 1),
      100
    ), A = w * (K / 100);
    if (A <= 0)
      return [];
    const R = Ts(
      c.power,
      N[c.config.power_entity],
      i,
      f
    );
    return [
      {
        id: c.config.id,
        effectivePower: R.value,
        livePower: c.power,
        ratedPowerW: w,
        ratedForDeviationW: A,
        isDerated: K < 100,
        sampleCount: R.sampleCount,
        firstSampleTs: R.firstSampleTs
      }
    ];
  }), W = Ue.filter((c) => !c.isDerated), ze = W.length > 0 ? Math.min(...W.map((c) => c.sampleCount)) : 0, We = W.length > 0 ? Math.min(
    ...W.map(
      (c) => c.firstSampleTs === null ? 0 : (i - c.firstSampleTs) / 6e4
    )
  ) : 0;
  h ? W.length < p ? O = `Need at least ${p} non-derated active rated panels for deviation checks.` : ze < u ? O = `Collecting samples (${ze}/${u}).` : We < _ ? O = `Warm-up in progress (${Math.floor(
    We
  )}/${_} min).` : Q = !0 : O = "Array Health Check is disabled.";
  const Bt = W.map(
    (c) => V(c.effectivePower / c.ratedForDeviationW, 0, Gt)
  ), Ge = ks(Bt);
  Q && Math.max(
    ...W.map(
      (w) => w.ratedForDeviationW * Ge
    ),
    0
  ) < v && (Q = !1, O = `Low-light pause: waiting above ${v.toFixed(
    0
  )} W target floor.`);
  const Pe = k.map((c) => {
    const w = (c.config.power_entity ? e?.states?.[c.config.power_entity]?.attributes?.unit_of_measurement : void 0) ?? "W", K = c.config.energy_entity ? e?.states?.[c.config.energy_entity]?.attributes?.unit_of_measurement : void 0, A = !!c.config.energy_entity, R = c.config.show_energy ?? !1;
    let y = c.status, b = null;
    const C = c.config.rated_power_w ?? r.default_panel_rated_power_w ?? null, M = C !== null && c.power !== null && C > 0 ? V(c.power / C * 100, 0, 999) : null;
    if (y === "normal" && C === null && (c.reason = "Rated power not configured; excluded from deviation checks."), Q && y === "normal" && C !== null && c.power !== null) {
      const Se = Ue.find(
        (se) => se.id === c.config.id
      );
      if (Se) {
        const se = Se.ratedForDeviationW * Ge, Ce = Math.max(se - Se.effectivePower, 0), Ve = se > 0 ? Ce / se * 100 : 0;
        Ve >= $ && Ce >= T ? (y = "deviation", b = V(Ve, 0, 100), c.reason = `Output is ${b.toFixed(
          0
        )}% and ${Ce.toFixed(0)} W below array target.`) : c.reason = "Producing within array-adjusted target range.";
      }
    } else y === "normal" && O && (c.reason = O);
    y === "error" && (Me += 1), y === "inverter" && (Re += 1), y === "deviation" && (Ie += 1), y === "offline" && (De += 1), y === "normal" && (He += 1), y === "unconfigured" && (Le += 1), y === "disabled" && (Oe += 1);
    const D = C !== null && C > 0 && c.power !== null ? c.power / C : null, H = c.power !== null && x > 0 ? c.power / x : 0, ee = V(
      (D ?? H) * d,
      0.08,
      1
    ), te = y === "deviation" || y === "error" || y === "inverter" ? 1 : ee, me = y === "normal" && c.power !== null && c.power <= 0, Kt = y === "error" || y === "inverter" ? n.error : me || y === "offline" || y === "unconfigured" || y === "disabled" ? n.unavailable : y === "deviation" ? n.deviation : Ns(
      n.production_start,
      n.production_mid,
      n.production_end,
      te
    );
    return {
      id: c.config.id,
      slotIndex: c.slotIndex,
      label: c.label,
      status: y,
      power: c.power,
      powerDisplay: y === "disabled" ? "Disabled" : y === "unconfigured" ? "Not configured" : at(
        c.power,
        w,
        r.power_decimals ?? 0,
        s
      ),
      energy: c.energy,
      energyDisplay: c.hiddenSlot || !A || !R ? void 0 : c.energy !== null ? at(
        c.energy,
        K ?? "kWh",
        r.energy_decimals ?? 2,
        s
      ) : "Unavailable",
      powerEntityName: c.powerEntityName,
      inverterStatusEntityName: c.inverterStatusEntityName,
      inverterStatusDisplay: c.inverterStatusDisplay,
      inverterFaultMatched: c.inverterFaultMatched,
      inverterWorkingMatched: c.inverterWorkingMatched,
      deviationPercent: b,
      reason: c.reason,
      accentColor: Kt,
      intensity: te,
      enabled: c.enabled,
      hiddenSlot: c.hiddenSlot,
      ratedPowerW: C,
      performancePercent: M
    };
  }), Vt = Pe.reduce((c, w) => c + (w.power ?? 0), 0), Be = Pe.map((c) => c.energy).filter((c) => c !== null), jt = Be.length > 0 ? Be.reduce((c, w) => c + w, 0) : null;
  return {
    panels: Pe,
    totalPower: Vt,
    totalEnergy: jt,
    maxPower: x,
    deviationCount: Ie,
    inverterCount: Re,
    errorCount: Me,
    offlineCount: De,
    normalCount: He,
    unconfiguredCount: Le,
    disabledCount: Oe,
    deviationReady: Q,
    deviationSuppressedReason: O
  };
}, Is = (r) => Number.isFinite(r.ts) && Number.isFinite(r.value), Rs = (r, e, t) => {
  const s = e - t * 60 * 60 * 1e3;
  return r.filter(Is).filter((i) => i.ts >= s && i.ts <= e).sort((i, n) => i.ts - n.ts);
}, Ms = (r, e) => {
  if (r.length <= e || e <= 2)
    return [...r];
  const t = r[0], s = r[r.length - 1], i = r.slice(1, r.length - 1), n = e - 2, o = i.length / n, l = [t];
  let a = -1;
  for (let d = 0; d < n; d += 1) {
    const h = Math.min(
      i.length - 1,
      Math.floor(d * o)
    );
    h !== a && (a = h, l.push(i[h]));
  }
  return l.push(s), l.sort((d, h) => d.ts - h.ts).filter(
    (d, h, p) => h === 0 ? !0 : d.ts !== p[h - 1].ts || d.value !== p[h - 1].value
  ).slice(0, e);
}, Ds = (r, e, t, s = 10) => {
  if (r.length === 0)
    return {
      pointCount: 0,
      linePath: "",
      areaPath: "",
      minValue: null,
      maxValue: null,
      startTs: null,
      endTs: null
    };
  const i = [...r].sort((S, P) => S.ts - P.ts), n = i.map((S) => S.value);
  let o = Math.min(...n), l = Math.max(...n);
  o === l && (o -= 1, l += 1);
  const a = i[0].ts, d = i[i.length - 1].ts, h = Math.max(d - a, 1), p = Math.max(l - o, 1), u = Math.max(e - s * 2, 1), _ = Math.max(t - s * 2, 1), f = i.map((S) => {
    const P = s + (S.ts - a) / h * u, x = t - s - (S.value - o) / p * _;
    return { x: P, y: x };
  }), v = f.map(
    (S, P) => `${P === 0 ? "M" : "L"}${S.x.toFixed(2)},${S.y.toFixed(2)}`
  ).join(" "), $ = f[0], T = f[f.length - 1], N = t - s, k = `${v} L${T.x.toFixed(2)},${N.toFixed(2)} L${$.x.toFixed(
    2
  )},${N.toFixed(2)} Z`;
  return {
    pointCount: f.length,
    linePath: v,
    areaPath: k,
    minValue: o,
    maxValue: l,
    startTs: a,
    endTs: d
  };
}, fe = (r, e, t, s = "en") => {
  if (r === null)
    return "Unavailable";
  const i = Object.is(r, -0) ? 0 : r;
  return `${new Intl.NumberFormat(s, {
    minimumFractionDigits: e,
    maximumFractionDigits: e
  }).format(i)} ${t}`;
}, ne = (r) => Object.is(r, -0) ? 0 : r, ht = 1, Hs = "spv:history:", Ls = "spv-card-config-updated", Os = [1, 6, 24], Us = 150, zs = (r) => {
  if (r instanceof Error && r.message.trim().length > 0)
    return r.message.trim();
  if (typeof r == "string" && r.trim().length > 0)
    return r.trim();
  if (typeof r == "object" && r !== null) {
    const e = r;
    if (typeof e.message == "string" && e.message.trim().length > 0)
      return e.message.trim();
    if (typeof e.error == "string" && e.error.trim().length > 0)
      return e.error.trim();
    if (typeof e.body?.message == "string" && e.body.message.trim().length > 0)
      return e.body.message.trim();
  }
  return "Unknown recorder error";
}, Ws = (r, e = 120) => r.length <= e ? r : `${r.slice(0, e - 1)}…`, we = class we extends Z {
  constructor() {
    super(...arguments), this._cardWidth = 0, this._selectedPanelId = null, this._showLivePowerPopup = !1, this._showEnergyPopup = !1, this._showCustomKpiPopup = !1, this._showSystemHealthPopup = !1, this._dragSourceSlotIndex = null, this._historyByEntityId = {}, this._historyState = "idle", this._historySignature = "", this._popupGraphRangeHours = 6, this._popupGraphCache = {}, this._popupGraphRequestToken = 0, this._popupGraphLatestTokenByKey = {}, this._persistConfigToken = 0, this._cardScrollRestoreTop = null, this._popupScrollRestoreTop = null, this._scrollRestoreFrames = 0, this._closeDialog = () => {
      this._selectedPanelId = null;
    }, this._openLivePowerPopup = () => {
      this._selectedPanelId = null, this._showLivePowerPopup = !0, this._showEnergyPopup = !1, this._showCustomKpiPopup = !1, this._showSystemHealthPopup = !1, this._popupGraphRangeHours = 6;
      const e = this._getSystemPowerEntityId();
      e && this._ensurePopupGraphLoadedByEntity(e, 6);
    }, this._closeLivePowerPopup = () => {
      this._showLivePowerPopup = !1;
    }, this._openEnergyPopup = () => {
      this._selectedPanelId = null, this._showEnergyPopup = !0, this._showLivePowerPopup = !1, this._showCustomKpiPopup = !1, this._showSystemHealthPopup = !1, this._popupGraphRangeHours = 6;
      const e = this._getSystemEnergyEntityId();
      e && this._ensurePopupGraphLoadedByEntity(e, 6);
    }, this._closeEnergyPopup = () => {
      this._showEnergyPopup = !1;
    }, this._openCustomKpiPopup = () => {
      this._selectedPanelId = null, this._showCustomKpiPopup = !0, this._showLivePowerPopup = !1, this._showEnergyPopup = !1, this._showSystemHealthPopup = !1, this._popupGraphRangeHours = 6;
      const e = this._getCustomKpiEntityId();
      e && this._ensurePopupGraphLoadedByEntity(e, 6);
    }, this._closeCustomKpiPopup = () => {
      this._showCustomKpiPopup = !1;
    }, this._openSystemHealthPopup = () => {
      this._showSystemHealthPopup = !0, this._showLivePowerPopup = !1, this._showEnergyPopup = !1, this._showCustomKpiPopup = !1, this._selectedPanelId = null;
    }, this._closeSystemHealthPopup = () => {
      this._showSystemHealthPopup = !1;
    }, this._preventRangeChipFocusScroll = (e) => {
      e.preventDefault();
    }, this._handleDragOver = (e) => {
      e.preventDefault(), e.dataTransfer && (e.dataTransfer.dropEffect = "move");
    }, this._handleDragEnd = () => {
      this._dragSourceSlotIndex = null;
    };
  }
  static async getConfigElement() {
    return await Promise.resolve().then(() => qs), document.createElement("solar-panel-visualizer-card-editor");
  }
  static getStubConfig() {
    return Qt();
  }
  connectedCallback() {
    super.connectedCallback(), this._startResizeObserver();
  }
  disconnectedCallback() {
    this._resizeObserver?.disconnect(), this._resizeObserver = void 0, super.disconnectedCallback();
  }
  setConfig(e) {
    const t = es(e);
    if (t.length > 0)
      throw new Error(t.join(" "));
    this._sourceConfigRef = e, this._config = F(e), this._historySignature = "", this._popupGraphRangeHours = 6, this._popupGraphCache = {}, this._popupGraphLatestTokenByKey = {}, this._showLivePowerPopup = !1, this._showEnergyPopup = !1, this._showCustomKpiPopup = !1, this._showSystemHealthPopup = !1, this._selectedPanelId = null, this._refreshDerived(), this._ensureHistoryLoaded();
  }
  getCardSize() {
    const e = this._config?.panels.length ?? 6, t = this._config?.columns ?? 3, s = this._computeRenderedColumns(
      t,
      this._config?.max_card_width_px
    ), i = this._computeRenderedRows(e, s), n = this._computePanelHeightPx(
      i,
      this._config?.max_card_height_px,
      s,
      this._config?.max_card_width_px
    ), o = 220 + i * n + Math.max(0, i - 1) * 10, l = this._config?.max_card_height_px ? Math.min(o, this._config.max_card_height_px) : o;
    return Math.max(5, Math.ceil(l / 50));
  }
  updated(e) {
    e.has("hass") && (this._syncLiveSamplesFromHass(), this._ensureHistoryLoaded(), this._refreshDerived()), this._restoreCapturedScrollPositions();
  }
  render() {
    if (!this._config)
      return g;
    const e = this._derived ?? pt(this._config, this.hass), t = this.hass?.locale?.language ?? "en", s = this._config.title ?? "Solar Array", i = this._resolveSummaryPower(e), n = this._resolveSummaryEnergy(e), o = this._resolveCustomKpi(), l = this._isSummaryEnergyConfigured(), a = this._config.show_custom_kpi ?? !0, d = this._computeRenderedColumns(
      this._config.columns,
      this._config.max_card_width_px
    ), h = this._computeRenderedRows(
      this._config.panels.length,
      d
    ), p = this._computePanelHeightPx(
      h,
      this._config.max_card_height_px,
      d,
      this._config.max_card_width_px
    ), u = this._computePanelWidthPx(
      d,
      this._config.max_card_width_px
    ), _ = this._computePanelScale(p), f = this._getPanelWidthCapPx(), v = f !== null ? `grid-template-columns: repeat(${d}, minmax(0, ${f}px)); justify-content: center;` : `grid-template-columns: repeat(${d}, minmax(0, 1fr));`, $ = this._config.deviation_history_hours ?? 12, T = `--spv-max-width:${this._config.max_card_width_px ?? 980}px; ${this._config.max_card_height_px ? `--spv-max-height:${this._config.max_card_height_px}px;` : "--spv-max-height:none;"} --spv-panel-height:${p}px; --spv-panel-scale:${_}; --spv-panel-max-width:${f ? `${f}px` : "100%"};`, N = this._buildSystemHealthState(e), k = e.inverterCount + e.errorCount + e.offlineCount + e.deviationCount, S = (this._config.enable_array_checks ?? !1) && this._historyState === "loading" ? `Loading shared ${$}h solar panel history...` : e.deviationReady ? e.deviationCount > 0 ? `${e.deviationCount} panel${e.deviationCount === 1 ? "" : "s"} below expected output` : "Tap a panel for detailed diagnostics" : this._historyStateReason ?? e.deviationSuppressedReason ?? "Deviation checks are warming up.", P = e.panels.find(
      (x) => x.id === this._selectedPanelId
    );
    return m`
      <ha-card style=${T}>
        <div class="chrome"></div>
        <div class="header">
          <div class="header-copy">
            <div class="topline">
              <span class="eyebrow">Solar Panel Visualizer</span>
              <button
                class="system-health"
                type="button"
                style=${`--health-color:${N.color};`}
                @click=${this._openSystemHealthPopup}
              >
                ${N.label}
              </button>
            </div>
            <h1 class="title">${s}</h1>
            <p class="subtitle">${S}</p>
            <p class="subtitle subtitle-hint">Drag and drop panel tiles to swap positions.</p>
          </div>
          <div class="summary ${a ? "with-custom" : "without-custom"}">
            <button
              class="summary-chip summary-button"
              type="button"
              @click=${this._openLivePowerPopup}
            >
              <span class="summary-label">Power</span>
              <span class="summary-value">
                ${fe(
      i.value,
      this._config.power_decimals ?? 0,
      i.unit,
      t
    )}
              </span>
            </button>
            <button
              class="summary-chip summary-button"
              type="button"
              @click=${this._openEnergyPopup}
            >
              <span class="summary-label">Energy</span>
              <span class="summary-value">
                ${l ? fe(
      n.value,
      this._config.energy_decimals ?? 2,
      n.unit,
      t
    ) : "Not configured"}
              </span>
            </button>
            <div class="summary-chip alerts-chip">
              <span class="summary-label">Alerts</span>
              <span class="summary-value">
                ${k}
              </span>
            </div>
            ${a ? m`
                  <button
                    class="summary-chip summary-button"
                    type="button"
                    @click=${this._openCustomKpiPopup}
                  >
                    <span class="summary-label">${o.title}</span>
                    <span class="summary-value custom-kpi-value">${o.value}</span>
                  </button>
                ` : g}
          </div>
        </div>

        <div
          class="grid"
          style=${v}
        >
          ${e.panels.map((x) => this._renderPanel(x, p, u))}
        </div>

        ${this._showLivePowerPopup ? this._renderLivePowerDialog(e) : g}
        ${this._showEnergyPopup ? this._renderEnergyDialog(e) : g}
        ${this._showCustomKpiPopup ? this._renderCustomKpiDialog() : g}
        ${this._showSystemHealthPopup ? this._renderSystemHealthDialog(e) : g}
        ${P ? this._renderPanelDialog(P) : g}
      </ha-card>
    `;
  }
  _refreshDerived() {
    if (!this._config) {
      this._derived = void 0;
      return;
    }
    this._derived = pt(this._config, this.hass, {
      deviationEnabled: this._config.enable_array_checks ?? !1,
      historyByEntityId: this._historyByEntityId,
      nowMs: Date.now()
    });
  }
  _formatSlotLabel(e) {
    const t = this._config?.columns ?? 1, s = Math.floor(e / t) + 1, i = e % t + 1;
    return `R${s}C${i}`;
  }
  _renderPanel(e, t, s) {
    const i = this._shouldShowPerformance(e, t, s);
    return e.hiddenSlot ? m`
        <button
          class="panel hidden-slot"
          type="button"
          draggable="true"
          @dragstart=${(n) => this._handleDragStart(n, e.slotIndex)}
          @dragover=${this._handleDragOver}
          @drop=${(n) => this._handleDrop(n, e.slotIndex)}
          @dragend=${this._handleDragEnd}
        >
          <span class="status">hidden</span>
          <p class="panel-name">Hidden Panel</p>
          <p class="power">0 W</p>
          <p class="performance">Hidden</p>
          <p class="energy">Hidden</p>
          <span class="slot">${this._formatSlotLabel(e.slotIndex)}</span>
        </button>
      ` : m`
      <button
        class="panel ${e.status} ${i ? "has-performance" : ""}"
        type="button"
        style=${`--panel-accent:${e.accentColor}; --panel-intensity:${e.intensity}; border-color:${e.accentColor}55;`}
        draggable="true"
        @dragstart=${(n) => this._handleDragStart(n, e.slotIndex)}
        @dragover=${this._handleDragOver}
        @drop=${(n) => this._handleDrop(n, e.slotIndex)}
        @dragend=${this._handleDragEnd}
        @click=${() => this._handlePanelClick(e)}
      >
        <span class="status">${e.status}</span>
        <p class="panel-name">${e.label}</p>
        <p class="power">${e.powerDisplay}</p>
        ${i ? m`<p class="performance">
              ${this._formatPanelPerformanceText(e, s, t)}
            </p>` : g}
        ${e.energyDisplay ? m`<p class="energy">${e.energyDisplay}</p>` : g}
        ${(this._config?.show_inverter_status_on_tiles ?? !1) && e.inverterStatusDisplay ? m`<p class="inverter-status">Inverter: ${e.inverterStatusDisplay}</p>` : g}
        <span class="slot">${this._formatSlotLabel(e.slotIndex)}</span>
      </button>
    `;
  }
  _renderPopupCloseButton(e, t) {
    return m`
      <div class="spv-popup-close-anchor">
        <button class="spv-popup-close" @click=${e} aria-label=${t}>
          ×
        </button>
      </div>
    `;
  }
  _renderPanelDialog(e) {
    const s = this._getPanelConfig(e.id)?.energy_entity ? e.energyDisplay ?? "Unavailable" : "Not configured";
    return e.status === "unconfigured" ? m`
        <div class="spv-popup-backdrop" @click=${this._closeDialog}>
          <div class="spv-popup" @click=${(i) => i.stopPropagation()}>
            ${this._renderPopupCloseButton(this._closeDialog, "Close detail")}
            <div class="spv-popup-header">
              <div>
                <div class="eyebrow">Panel Detail ${this._formatSlotLabel(e.slotIndex)}</div>
                <h2 class="spv-popup-title">${e.label}</h2>
              </div>
            </div>
            ${this._renderInlinePanelConfig(e)}
          </div>
        </div>
      ` : m`
      <div class="spv-popup-backdrop" @click=${this._closeDialog}>
        <div class="spv-popup" @click=${(i) => i.stopPropagation()}>
          ${this._renderPopupCloseButton(this._closeDialog, "Close detail")}
          <div class="spv-popup-header">
            <div>
              <div class="eyebrow">Panel Detail ${this._formatSlotLabel(e.slotIndex)}</div>
              <h2 class="spv-popup-title">${e.label}</h2>
            </div>
          </div>

          ${this._renderPopupGraph(e)}

          <div class="detail-grid">
            <div class="detail-card">
              <span class="detail-label">Status</span>
              <span class="detail-value">${e.status}</span>
            </div>
            <div class="detail-card">
              <span class="detail-label">Power</span>
              <span class="detail-value">${e.powerDisplay}</span>
            </div>
            <div class="detail-card">
              <span class="detail-label">Energy</span>
              <span class="detail-value">
                ${s}
              </span>
            </div>
            <div class="detail-card">
              <span class="detail-label">Deviation</span>
              <span class="detail-value">
                ${e.status === "inverter" ? "Inverter status mismatch" : e.deviationPercent !== null ? `${e.deviationPercent.toFixed(0)}% below peers` : "Within range"}
              </span>
            </div>
            <div class="detail-card">
              <span class="detail-label">Rated / Performance</span>
              <span class="detail-value">
                ${e.ratedPowerW !== null ? `${e.ratedPowerW.toFixed(0)} W / ${e.performancePercent !== null ? `${e.performancePercent.toFixed(0)}%` : "n/a"}` : "Not configured"}
              </span>
            </div>
          </div>

          <div class="detail-card detail-information">
            <span class="detail-label">Information</span>
            <div class="info-lines">
              <p class="info-line">${e.reason}</p>
              ${e.powerEntityName ? m`<p class="info-line">Power source: ${e.powerEntityName}</p>` : g}
              <p class="info-line">
                Current inverter status: "${e.inverterStatusDisplay ?? "Not configured"}"
              </p>
              <p class="info-line">
                Inverter evaluation: ${this._renderInverterEvaluation(e)}
              </p>
              <p class="info-line">
                Inverter source: ${e.inverterStatusEntityName ?? "Not configured"}
              </p>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  _renderInverterEvaluation(e) {
    return !e.inverterStatusDisplay || e.inverterStatusDisplay === "Unavailable" ? "No status available" : e.inverterFaultMatched ? "Fault term matched" : e.inverterWorkingMatched ? "Working term matched" : "No configured term matched";
  }
  _renderLivePowerDialog(e) {
    const t = this._getSystemPowerEntityId(), s = this._resolveSummaryPower(e), i = this.hass?.locale?.language ?? "en";
    return m`
      <div class="spv-popup-backdrop" @click=${this._closeLivePowerPopup}>
        <div class="spv-popup" @click=${(n) => n.stopPropagation()}>
          ${this._renderPopupCloseButton(
      this._closeLivePowerPopup,
      "Close live power detail"
    )}
          <div class="spv-popup-header">
            <div>
              <div class="eyebrow">Power Detail</div>
              <h2 class="spv-popup-title">Live Power</h2>
            </div>
          </div>

          <div class="detail-grid">
            <div class="detail-card">
              <span class="detail-label">Current</span>
              <span class="detail-value">
                ${fe(
      s.value,
      this._config?.power_decimals ?? 0,
      s.unit,
      i
    )}
              </span>
            </div>
            <div class="detail-card">
              <span class="detail-label">Source</span>
              <span class="detail-value">
                ${t ? "System sensor" : "Sum of panel sensors"}
              </span>
            </div>
          </div>

          ${t ? this._renderPopupGraphForEntity(t, "System Power History") : this._renderMetricList(
      "Panel Power Values",
      e.panels.filter((n) => !n.hiddenSlot).map((n) => ({
        label: n.label,
        value: n.powerDisplay
      }))
    )}
        </div>
      </div>
    `;
  }
  _renderEnergyDialog(e) {
    const t = this._getSystemEnergyEntityId(), s = this._resolveSummaryEnergy(e), i = this.hass?.locale?.language ?? "en";
    return m`
      <div class="spv-popup-backdrop" @click=${this._closeEnergyPopup}>
        <div class="spv-popup" @click=${(n) => n.stopPropagation()}>
          ${this._renderPopupCloseButton(this._closeEnergyPopup, "Close energy detail")}
          <div class="spv-popup-header">
            <div>
              <div class="eyebrow">Energy Detail</div>
              <h2 class="spv-popup-title">Energy</h2>
            </div>
          </div>

          <div class="detail-grid">
            <div class="detail-card">
              <span class="detail-label">Current</span>
              <span class="detail-value">
                ${fe(
      s.value,
      this._config?.energy_decimals ?? 2,
      s.unit,
      i
    )}
              </span>
            </div>
            <div class="detail-card">
              <span class="detail-label">Source</span>
              <span class="detail-value">
                ${t ? "System sensor" : "Sum of panel sensors"}
              </span>
            </div>
          </div>

          ${t ? this._renderPopupGraphForEntity(t, "System Energy History") : this._renderMetricList(
      "Panel Energy Values",
      e.panels.filter((n) => !n.hiddenSlot).map((n) => ({
        label: n.label,
        value: n.energyDisplay ?? "Not configured"
      }))
    )}
        </div>
      </div>
    `;
  }
  _renderCustomKpiDialog() {
    const e = this._resolveCustomKpi(), t = e.title.length > 0 ? e.title : "Custom KPI", s = this._getCustomKpiEntityId();
    return m`
      <div class="spv-popup-backdrop" @click=${this._closeCustomKpiPopup}>
        <div class="spv-popup" @click=${(i) => i.stopPropagation()}>
          ${this._renderPopupCloseButton(
      this._closeCustomKpiPopup,
      "Close custom KPI detail"
    )}
          <div class="spv-popup-header">
            <div>
              <div class="eyebrow">Custom KPI Detail</div>
              <h2 class="spv-popup-title">${t}</h2>
            </div>
          </div>

          <div class="detail-grid">
            <div class="detail-card">
              <span class="detail-label">Current</span>
              <span class="detail-value">${e.value}</span>
            </div>
            <div class="detail-card">
              <span class="detail-label">Source</span>
              <span class="detail-value">
                ${s ? "Custom KPI sensor" : "Not configured"}
              </span>
            </div>
          </div>

          ${s ? this._renderPopupGraphForEntity(s, `${t} History`) : m`<p class="graph-state">No sensor configured for Custom KPI.</p>`}
        </div>
      </div>
    `;
  }
  _renderSystemHealthDialog(e) {
    const t = this._buildSystemHealthSections(e), s = t.length > 0;
    return m`
      <div class="spv-popup-backdrop" @click=${this._closeSystemHealthPopup}>
        <div class="spv-popup" @click=${(i) => i.stopPropagation()}>
          ${this._renderPopupCloseButton(this._closeSystemHealthPopup, "Close system health")}
          <div class="spv-popup-header">
            <div>
              <div class="eyebrow">System Health</div>
              <h2 class="spv-popup-title">Overview</h2>
            </div>
          </div>

          ${s ? t.map(
      (i) => m`
                  <div class="graph-section">
                    <div class="graph-header">
                      <span class="graph-title">${i.title}</span>
                    </div>
                    ${i.items.map(
        (n) => m`<p class="system-health-item">${n}</p>`
      )}
                  </div>
                `
    ) : m`<p class="system-health-item">Everything is working well.</p>`}
        </div>
      </div>
    `;
  }
  _renderMetricList(e, t) {
    return m`
      <div class="graph-section">
        <div class="graph-header">
          <span class="graph-title">${e}</span>
        </div>
        ${t.map(
      (s) => m`
            <p class="subtitle">
              ${s.label}: ${s.value}
            </p>
          `
    )}
      </div>
    `;
  }
  _renderPopupGraph(e) {
    const t = this._getPanelConfig(e.id);
    return this._renderPopupGraphForEntity(t?.power_entity, "Power History");
  }
  _renderPopupGraphForEntity(e, t) {
    return m`
      <div class="graph-section">
        <div class="graph-header">
          <span class="graph-title">${t}</span>
          <div class="range-chips">
            ${Os.map(
      (s) => m`
                <button
                  class="range-chip ${this._popupGraphRangeHours === s ? "active" : ""}"
                  type="button"
                  @mousedown=${this._preventRangeChipFocusScroll}
                  @click=${(i) => this._handlePopupGraphRangeChangeForEntity(i, e, s)}
                >
                  ${s}h
                </button>
              `
    )}
          </div>
        </div>
        ${e ? this._renderPopupGraphBody(e) : m`<p class="graph-state">No sensor configured for graph.</p>`}
      </div>
    `;
  }
  _renderPopupGraphBody(e) {
    const t = this._getPopupGraphCacheKey(e, this._popupGraphRangeHours), s = this._popupGraphCache[t], i = s?.loading ?? !1, n = s?.error, o = s?.samples ?? [], l = this._adjustGraphSamplesForEntity(e, o);
    if (i)
      return m`<p class="graph-state">Loading sensor history...</p>`;
    if (n)
      return m`<p class="graph-state">${n}</p>`;
    if (l.length === 0)
      return m`<p class="graph-state">No history data for selected range.</p>`;
    const a = this._getUnitForEntity(e, "W"), d = Ms(l, Us), h = Ds(d, 320, 132, 10), p = this._computeGraphStats(l), u = this._buildGraphHourTicks(h, this._popupGraphRangeHours), _ = this._buildGraphAxisTicks(u), f = h.minValue, v = h.maxValue, $ = p.max !== null && f !== null && v !== null ? this._toGraphY(p.max, f, v, 132, 10) : null, T = p.median !== null && f !== null && v !== null ? this._toGraphY(p.median, f, v, 132, 10) : null, N = `spv-graph-${t.replace(/[^a-zA-Z0-9_-]/g, "-")}`, k = p.max !== null ? `Max ${this._formatGraphPower(p.max, a)}` : null, S = p.median !== null ? `Median ${this._formatGraphPower(p.median, a)}` : null, P = p.min !== null ? `Min ${this._formatGraphPower(p.min, a)}` : null;
    return m`
      <div class="graph-box">
        ${k ? m`<span class="graph-overlay graph-overlay-max">${k}</span>` : g}
        ${S ? m`
              <span class="graph-overlay graph-overlay-median">
                ${S}
              </span>
            ` : g}
        ${P ? m`<span class="graph-overlay graph-overlay-min">${P}</span>` : g}
        <svg class="graph-svg" viewBox="0 0 320 132" preserveAspectRatio="none">
          <defs>
            <linearGradient id=${N} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="rgba(142, 208, 114, 0.48)"></stop>
              <stop offset="100%" stop-color="rgba(142, 208, 114, 0.04)"></stop>
            </linearGradient>
          </defs>
          <path
            d=${h.areaPath}
            fill=${`url(#${N})`}
          ></path>
          ${u.map(
      (x) => m`
              <line
                class="graph-hour-line"
                x1=${x.x.toFixed(2)}
                x2=${x.x.toFixed(2)}
                y1="10"
                y2="122"
              ></line>
            `
    )}
          <path
            d=${h.linePath}
            fill="none"
            stroke="rgba(186, 226, 106, 0.95)"
            stroke-width="2.2"
            stroke-linejoin="round"
            stroke-linecap="round"
          ></path>
          ${$ !== null ? m`
                <line
                  class="graph-stat-line graph-stat-max"
                  x1="10"
                  x2="310"
                  y1=${$.toFixed(2)}
                  y2=${$.toFixed(2)}
                ></line>
              ` : g}
          ${T !== null ? m`
                <line
                  class="graph-stat-line graph-stat-median"
                  x1="10"
                  x2="310"
                  y1=${T.toFixed(2)}
                  y2=${T.toFixed(2)}
                ></line>
              ` : g}
        </svg>
      </div>
      <div class="graph-axis">
        ${_.map(
      (x) => m`
            <span class="graph-axis-label" style=${`left:${x.leftPercent.toFixed(2)}%;`}>
              ${x.label}
            </span>
          `
    )}
      </div>
      <div class="graph-meta">
        <span>
          ${this._formatGraphTime(h.startTs)} - ${this._formatGraphTime(
      h.endTs
    )}
        </span>
      </div>
    `;
  }
  _handlePopupGraphRangeChangeForEntity(e, t, s) {
    e.preventDefault(), e.stopPropagation(), this._captureScrollPositionsForPopupGraph(), this._popupGraphRangeHours = s, t && this._ensurePopupGraphLoadedByEntity(t, s);
  }
  _getPopupGraphCacheKey(e, t) {
    return `${e}|${t}`;
  }
  _getPanelConfig(e) {
    return this._config?.panels.find((t) => t.id === e);
  }
  async _ensurePopupGraphLoaded(e, t) {
    if (!this._config || !this.hass)
      return;
    const i = this._getPanelConfig(e)?.power_entity;
    i && await this._ensurePopupGraphLoadedByEntity(i, t);
  }
  async _ensurePopupGraphLoadedByEntity(e, t) {
    if (!this._config || !this.hass)
      return;
    const s = this._getPopupGraphCacheKey(e, t), i = this._popupGraphCache[s];
    if (i && (i.loading || !i.error))
      return;
    const n = ++this._popupGraphRequestToken;
    if (this._popupGraphLatestTokenByKey[s] = n, this._popupGraphCache = {
      ...this._popupGraphCache,
      [s]: {
        loading: !0,
        samples: i?.samples ?? []
      }
    }, !this.hass.callApi && !this.hass.callWS) {
      if (this._popupGraphLatestTokenByKey[s] !== n)
        return;
      this._popupGraphCache = {
        ...this._popupGraphCache,
        [s]: {
          loading: !1,
          samples: [],
          error: "Unable to load panel history"
        }
      };
      return;
    }
    try {
      if (this._popupGraphLatestTokenByKey[s] !== n)
        return;
      const o = await this._loadPopupGraphRecorderSamples(e, t);
      if (this._popupGraphLatestTokenByKey[s] !== n)
        return;
      this._popupGraphCache = {
        ...this._popupGraphCache,
        [s]: {
          loading: !1,
          samples: o
        }
      };
    } catch (o) {
      if (this._popupGraphLatestTokenByKey[s] !== n)
        return;
      this._popupGraphCache = {
        ...this._popupGraphCache,
        [s]: {
          loading: !1,
          samples: [],
          error: `Unable to load panel history (${Ws(zs(o))})`
        }
      };
    }
  }
  async _loadPopupGraphRecorderSamples(e, t) {
    if (!this.hass || !this.hass.callApi && !this.hass.callWS)
      throw new Error("Recorder API unavailable");
    const s = Date.now(), i = new Date(s - t * 60 * 60 * 1e3).toISOString(), n = new Date(s).toISOString(), o = await this._fetchRecorderHistoryRaw(i, n, [e]), l = this._parseRecorderResponse(o, t, [e])[e] ?? [], a = Rs(l, s, t);
    return this._stabilizePopupRangeSamples(e, l, a, s, t);
  }
  _stabilizePopupRangeSamples(e, t, s, i, n) {
    const o = i - n * 60 * 60 * 1e3, l = [...t].sort((u, _) => u.ts - _.ts), a = [...s].sort((u, _) => u.ts - _.ts), d = l.filter((u) => u.ts < o).at(-1) ?? null, h = Number(this.hass?.states?.[e]?.state);
    a.length === 0 ? d ? a.push({ ts: o, value: d.value }) : Number.isFinite(h) && a.push({ ts: o, value: h }) : d && a[0].ts > o && a.unshift({ ts: o, value: d.value });
    const p = a[a.length - 1];
    return Number.isFinite(h) && (p ? Math.abs(i - p.ts) > 6e4 && a.push({ ts: i, value: h }) : a.push({ ts: i, value: h })), a.filter((u) => Number.isFinite(u.ts) && Number.isFinite(u.value)).sort((u, _) => u.ts - _.ts);
  }
  _getUnitForEntity(e, t) {
    const s = this.hass?.states?.[e]?.attributes?.unit_of_measurement;
    return typeof s == "string" && s.trim().length > 0 ? s : t;
  }
  _formatGraphPower(e, t) {
    if (e === null)
      return `0 ${t}`;
    const s = this.hass?.locale?.language ?? "en", i = ne(e), n = t.trim().toLowerCase(), o = n.includes("wh") || n.includes("kwh") ? this._config?.energy_decimals ?? 2 : this._config?.power_decimals ?? 0;
    return `${new Intl.NumberFormat(s, {
      minimumFractionDigits: o,
      maximumFractionDigits: o
    }).format(i)} ${t}`;
  }
  _computeGraphStats(e) {
    const t = e.map((l) => l.value).filter((l) => Number.isFinite(l)).sort((l, a) => l - a);
    if (t.length === 0)
      return { min: null, max: null, median: null };
    const s = t[0] ?? null, i = t[t.length - 1] ?? null, n = Math.floor(t.length / 2), o = t.length % 2 === 0 ? (t[n - 1] + t[n]) / 2 : t[n];
    return { min: s, max: i, median: o };
  }
  _buildGraphHourTicks(e, t) {
    if (e.startTs === null || e.endTs === null)
      return [];
    const s = e.startTs, i = e.endTs, n = Math.max(i - s, 1), o = 320, l = 10, a = o - l * 2, d = t === 1 ? 900 * 1e3 : t === 6 ? 3600 * 1e3 : 14400 * 1e3, h = [], p = (_) => {
      const f = new Date(_), v = `${f.getHours()}`.padStart(2, "0"), $ = `${f.getMinutes()}`.padStart(2, "0");
      return t === 1 ? `${v}:${$}` : `${v}h`;
    };
    let u = Math.ceil(s / d) * d;
    for (; u < i; ) {
      const _ = l + (u - s) / n * a;
      h.push({
        x: _,
        label: p(u)
      }), u += d;
    }
    if (t === 6 && h.length < 3) {
      const _ = [0.25, 0.5, 0.75];
      for (const f of _) {
        const v = s + n * f, $ = l + (v - s) / n * a;
        h.push({
          x: $,
          label: p(v)
        });
      }
    }
    return h.sort((_, f) => _.x - f.x), h;
  }
  _buildGraphAxisTicks(e) {
    if (e.length === 0)
      return [];
    const t = 10, i = 320 - t * 2;
    return e.map((n) => ({
      label: n.label,
      leftPercent: (n.x - t) / i * 100
    }));
  }
  _toGraphY(e, t, s, i, n) {
    const o = Math.max(s - t, 1), l = Math.max(i - n * 2, 1);
    return i - n - (e - t) / o * l;
  }
  _formatGraphTime(e) {
    if (e === null)
      return "--:--";
    const t = this.hass?.locale?.language ?? "en";
    return new Intl.DateTimeFormat(t, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: !1,
      hourCycle: "h23"
    }).format(e);
  }
  _buildSystemHealthState(e) {
    const t = {
      error: this._config?.colors?.error ?? "#ff627f",
      offline: this._config?.colors?.unavailable ?? "#586779",
      deviation: this._config?.colors?.deviation ?? "#ff9667",
      setup: "#41c9d8",
      ok: "#8ed072"
    }, s = e.inverterCount + e.errorCount;
    return s > 0 ? {
      label: `${s} Fault${s === 1 ? "" : "s"}`,
      color: t.error
    } : e.offlineCount > 0 ? {
      label: `${e.offlineCount} Unavailable`,
      color: t.offline
    } : e.deviationCount > 0 ? {
      label: `${e.deviationCount} Deviation`,
      color: t.deviation
    } : e.unconfiguredCount > 0 ? {
      label: `${e.unconfiguredCount} Needs Setup`,
      color: t.setup
    } : { label: "System OK", color: t.ok };
  }
  _buildSystemHealthSections(e) {
    const t = e.panels.filter((h) => !h.hiddenSlot), s = (h) => t.filter((p) => p.status === h).map((p) => `Panel on ${this._formatSlotLabel(p.slotIndex)} (${p.label}): ${p.reason}`), i = [], n = s("inverter");
    n.length > 0 && i.push({ title: "Inverter", items: n });
    const o = s("error");
    o.length > 0 && i.push({ title: "Error", items: o });
    const l = s("deviation");
    l.length > 0 && i.push({ title: "Deviation", items: l });
    const a = s("offline");
    a.length > 0 && i.push({ title: "Unavailable", items: a });
    const d = s("unconfigured");
    return d.length > 0 && i.push({ title: "Needs setup", items: d }), i;
  }
  _computeRenderedColumns(e, t) {
    const s = Math.max(1, Math.floor(e)), i = this._cardWidth > 0 ? this._cardWidth : t ?? 980, n = t ? Math.min(i, t) : i;
    if (!Number.isFinite(n) || n <= 0)
      return s;
    const o = Math.max(120, n - 40), l = n <= 560 ? 8 : 10, a = n <= 760, d = a ? Math.min(s, 3) : s, h = this._getPanelWidthCapPx(), p = h !== null ? h : a ? 100 : Math.max(130, Math.min(220, o * 0.32)), u = Math.floor((o + l) / (p + l));
    return Math.max(1, Math.min(d, u || 1));
  }
  _computeRenderedRows(e, t) {
    const s = Math.max(1, e), i = Math.max(1, t);
    return Math.max(1, Math.ceil(s / i));
  }
  _computeWidthBasedPanelHeight(e, t) {
    const i = this._computeTileWidthPx(e, t) * 0.62;
    return Math.round(Math.min(220, Math.max(100, i)));
  }
  _computePanelWidthPx(e, t) {
    const s = this._computeTileWidthPx(e, t);
    return Math.max(96, Math.round(s));
  }
  _computeTileWidthPx(e, t) {
    const s = this._cardWidth > 0 ? this._cardWidth : t ?? 980, i = t ? Math.min(s, t) : s, n = i <= 560 ? 8 : 10, o = Math.max(120, i - 40), l = Math.max(1, e), a = (o - Math.max(0, l - 1) * n) / l;
    return this._applyPanelWidthCapPx(a);
  }
  _getPanelWidthCapPx() {
    if (!(this._config?.limit_panel_width ?? !1))
      return null;
    const e = this._config?.panel_max_width_px ?? 220;
    return Math.min(Math.max(e, 120), 320);
  }
  _applyPanelWidthCapPx(e) {
    const t = this._getPanelWidthCapPx();
    return t ? Math.min(e, t) : e;
  }
  _computePanelHeightPx(e, t, s = this._config?.columns ?? 3, i) {
    const n = this._computeWidthBasedPanelHeight(s, i);
    if (!t || !Number.isFinite(t))
      return n;
    const o = Math.max(1, e), l = 250, a = 36, d = Math.max(o - 1, 0) * 10, p = (t - l - a - d) / o;
    if (!Number.isFinite(p))
      return n;
    const u = Math.min(240, Math.max(96, p)), _ = Math.min(u, n * 1.6);
    return Math.round(Math.min(220, Math.max(100, _)));
  }
  _computePanelScale(e) {
    const s = e / 128, i = Math.min(1.32, Math.max(0.9, s));
    return Number(i.toFixed(3));
  }
  _startResizeObserver() {
    if (typeof ResizeObserver > "u" || this._resizeObserver)
      return;
    const e = () => {
      const t = Math.round(this.getBoundingClientRect().width);
      !Number.isFinite(t) || t <= 0 || t !== this._cardWidth && (this._cardWidth = t);
    };
    this._resizeObserver = new ResizeObserver(() => {
      e();
    }), this._resizeObserver.observe(this), e();
  }
  _shouldShowPerformance(e, t, s) {
    if (e.performancePercent === null || e.ratedPowerW === null)
      return !1;
    const i = !!e.energyDisplay, n = (this._config?.show_inverter_status_on_tiles ?? !1) && !!e.inverterStatusDisplay, o = Number(i) + Number(n);
    return t >= 126 && s >= 148 ? !0 : t >= 112 && s >= 132 ? o <= 1 : o === 0;
  }
  _formatPanelPerformanceText(e, t, s) {
    if (e.performancePercent === null || e.ratedPowerW === null)
      return "";
    const i = !!e.energyDisplay, n = (this._config?.show_inverter_status_on_tiles ?? !1) && !!e.inverterStatusDisplay;
    return t < 192 || s < 124 || (i || n) && s < 142 ? `${e.performancePercent.toFixed(0)}%` : `${e.performancePercent.toFixed(0)}% of ${e.ratedPowerW.toFixed(0)}W Panel`;
  }
  _handlePanelClick(e) {
    e.hiddenSlot || (this._config?.panel_tap_action ?? "details") === "details" && (this._showLivePowerPopup = !1, this._showEnergyPopup = !1, this._showCustomKpiPopup = !1, this._showSystemHealthPopup = !1, this._selectedPanelId = e.id, this._popupGraphRangeHours = 6, this._ensurePopupGraphLoaded(e.id, 6));
  }
  _resolveUnit(e, t) {
    if (!this._config)
      return t;
    for (const s of this._config.panels) {
      const i = s[e];
      if (!i)
        continue;
      const n = this.hass?.states?.[i]?.attributes?.unit_of_measurement;
      if (typeof n == "string" && n.trim().length > 0)
        return n;
    }
    return t;
  }
  _getSystemPowerEntityId() {
    if (!this._config || !(this._config.use_system_power_entity ?? !1))
      return null;
    const e = this._config.system_power_entity?.trim();
    return e && e.length > 0 ? e : null;
  }
  _getSystemEnergyEntityId() {
    if (!this._config || !(this._config.use_system_energy_entity ?? !1))
      return null;
    const e = this._config.system_energy_entity?.trim();
    return e && e.length > 0 ? e : null;
  }
  _resolveSummaryPower(e) {
    const t = this._getSystemPowerEntityId();
    if (t) {
      const s = this.hass?.states?.[t], i = Number(s?.state), n = Number.isFinite(i) ? i : null;
      return {
        value: n === null ? null : this._config?.invert_system_power ? ne(n * -1) : ne(n),
        unit: this._getUnitForEntity(t, "W")
      };
    }
    return {
      value: e.totalPower,
      unit: this._resolveUnit("power_entity", "W")
    };
  }
  _resolveSummaryEnergy(e) {
    const t = this._getSystemEnergyEntityId();
    if (!this._config)
      return { value: null, unit: "kWh" };
    if (t) {
      const s = this.hass?.states?.[t], i = Number(s?.state);
      return {
        value: Number.isFinite(i) ? i : null,
        unit: this._getUnitForEntity(t, "kWh")
      };
    }
    return {
      value: e.totalEnergy,
      unit: this._resolveUnit("energy_entity", "kWh")
    };
  }
  _isSummaryEnergyConfigured() {
    return this._config ? this._config.use_system_energy_entity ?? !1 ? !!this._config.system_energy_entity?.trim() : this._config.panels.some((e) => !!e.energy_entity) : !1;
  }
  _resolveCustomKpi() {
    const e = this._config?.custom_kpi_title, t = e !== void 0 ? e : "Custom KPI", s = this._getCustomKpiEntityId();
    if (!s)
      return { title: t, value: "Not configured" };
    const i = this.hass?.states?.[s];
    if (!i)
      return { title: t, value: "Unavailable" };
    const n = i.state?.toString().trim().toLowerCase();
    if (!n || n === "unknown" || n === "unavailable")
      return { title: t, value: "Unavailable" };
    const o = Number(i.state);
    if (Number.isFinite(o)) {
      const l = this.hass?.locale?.language ?? "en", a = this._getUnitForEntity(s, ""), d = Ss(
        i.state,
        l,
        this._config?.custom_kpi_decimals ?? 0,
        a
      );
      return {
        title: t,
        value: d ?? i.state
      };
    }
    return { title: t, value: i.state };
  }
  _getCustomKpiEntityId() {
    const e = this._config?.custom_kpi_entity?.trim();
    return e && e.length > 0 ? e : null;
  }
  _captureScrollPositionsForPopupGraph() {
    const e = this.renderRoot.querySelector("ha-card"), t = this.renderRoot.querySelector(".spv-popup");
    this._cardScrollRestoreTop = e?.scrollTop ?? null, this._popupScrollRestoreTop = t?.scrollTop ?? null, this._scrollRestoreFrames = 4;
  }
  _restoreCapturedScrollPositions() {
    if (this._scrollRestoreFrames <= 0)
      return;
    const e = this._cardScrollRestoreTop, t = this._popupScrollRestoreTop;
    requestAnimationFrame(() => {
      const s = this.renderRoot.querySelector("ha-card"), i = this.renderRoot.querySelector(".spv-popup");
      s && e !== null && (s.scrollTop = e), i && t !== null && (i.scrollTop = t), this._scrollRestoreFrames = Math.max(0, this._scrollRestoreFrames - 1), this._scrollRestoreFrames === 0 && (this._cardScrollRestoreTop = null, this._popupScrollRestoreTop = null);
    });
  }
  _renderInlinePanelConfig(e) {
    const t = this._config?.panels.find((n) => n.id === e.id);
    if (!t)
      return g;
    const s = this._getAvailableQuickSetupPowerEntities(e.id), i = !(t.enabled ?? !0);
    return m`
      <div class="inline-config">
        <p class="subtitle">Quick Setup:</p>
        <p class="subtitle">Select panel power sensor:</p>
        <ha-selector
          .hass=${this.hass}
          .value=${t.power_entity ?? ""}
          .selector=${{
      entity: {
        domain: "sensor",
        include_entities: s
      }
    }}
          .label=${"Select panel power sensor"}
          @value-changed=${(n) => this._updatePanelConfigFromCard(e.id, "power_entity", n.detail.value)}
        ></ha-selector>
        ${s.length === 0 ? m`<p class="subtitle">No available W sensors found.</p>` : g}
        <div class="toggle">
          <ha-formfield label="Disable Panel (hide but keep slot when off)">
            <ha-switch
              .checked=${i}
              @change=${(n) => this._updatePanelConfigFromCard(
      e.id,
      "enabled",
      !n.currentTarget.checked
    )}
            ></ha-switch>
          </ha-formfield>
        </div>
      </div>
    `;
  }
  _getAvailableQuickSetupPowerEntities(e) {
    if (!this._config || !this.hass)
      return [];
    const s = this._config.panels.find((o) => o.id === e)?.power_entity, i = new Set(
      this._config.panels.filter((o) => o.id !== e).map((o) => o.power_entity).filter((o) => !!o)
    ), n = [];
    for (const o of Object.values(this.hass.states)) {
      if (!o.entity_id.startsWith("sensor."))
        continue;
      const l = o.attributes?.unit_of_measurement;
      typeof l != "string" || l.trim().toLowerCase() !== "w" || i.has(o.entity_id) && o.entity_id !== s || n.push(o.entity_id);
    }
    return typeof s == "string" && s.length > 0 && !n.includes(s) && n.push(s), n.sort((o, l) => o.localeCompare(l));
  }
  _updatePanelConfigFromCard(e, t, s) {
    if (!this._config)
      return;
    const i = this._config.panels.findIndex((l) => l.id === e);
    if (i < 0)
      return;
    const n = this._config.panels.map(
      (l, a) => a === i ? { ...l, [t]: s } : l
    ), o = F({
      ...this._config,
      panels: n
    });
    this._commitConfigFromCard(o), t === "power_entity" && typeof s == "string" && s.trim().length > 0 && (this._popupGraphRangeHours = 6, this._ensurePopupGraphLoadedByEntity(s.trim(), 6));
  }
  _handleDragStart(e, t) {
    this._dragSourceSlotIndex = t, e.dataTransfer && (e.dataTransfer.effectAllowed = "move", e.dataTransfer.setData("text/plain", String(t)));
  }
  _handleDrop(e, t) {
    if (e.preventDefault(), !this._config)
      return;
    const s = this._dragSourceSlotIndex ?? Number(e.dataTransfer?.getData("text/plain") ?? Number.NaN);
    if (!Number.isFinite(s) || s === t)
      return;
    const i = [...this._config.panels], n = i[s], o = i[t];
    !n || !o || (i[s] = o, i[t] = n, this._commitConfigFromCard(
      F({
        ...this._config,
        panels: i
      })
    ));
  }
  _commitConfigFromCard(e) {
    this._config = e, this._historySignature = "", this._popupGraphCache = {}, this._popupGraphLatestTokenByKey = {}, this._ensureHistoryLoaded(), this._refreshDerived(), this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: e },
        bubbles: !0,
        composed: !0
      })
    ), typeof window < "u" && window.dispatchEvent(
      new CustomEvent(Ls, {
        detail: { config: e }
      })
    ), this._persistConfigToLovelace(e);
  }
  async _persistConfigToLovelace(e) {
    if (!this.hass?.callWS)
      return;
    const t = ++this._persistConfigToken, s = this._findLovelaceContext(), i = this._resolveDashboardUrlPath(s);
    try {
      const n = s && typeof s.config == "object" ? s.config : await this.hass.callWS({
        type: "lovelace/config",
        ...i ? { url_path: i } : {}
      });
      if (t !== this._persistConfigToken)
        return;
      const { config: o, replaced: l } = this._replaceCardConfigInDashboardConfig(
        n,
        e
      );
      if (!l) {
        console.warn("Solar Panel Visualizer: Could not locate card config to persist changes.");
        return;
      }
      if (await this.hass.callWS({
        type: "lovelace/config/save",
        ...i ? { url_path: i } : {},
        config: o
      }), t !== this._persistConfigToken)
        return;
      s && (s.config = o), this._sourceConfigRef = void 0;
    } catch (n) {
      console.warn("Solar Panel Visualizer: Failed to persist dashboard config.", n);
    }
  }
  _findLovelaceContext() {
    const e = /* @__PURE__ */ new Set();
    let t = this;
    for (; t && !e.has(t); ) {
      if (e.add(t), typeof t == "object" && t !== null && "lovelace" in t && t.lovelace && typeof t.lovelace == "object")
        return t.lovelace;
      const s = t, i = typeof s.getRootNode == "function" ? s.getRootNode() : null, n = i && "host" in i ? i.host : null;
      if (n && n !== t) {
        t = n;
        continue;
      }
      t = s.parentElement ?? null;
    }
    return null;
  }
  _resolveDashboardUrlPath(e) {
    const t = e?.urlPath?.trim();
    if (t)
      return t;
    if (typeof window > "u")
      return;
    const s = window.location.pathname.replace(/^\/+/, "").split("/")[0]?.trim();
    return s && s.length > 0 ? s : void 0;
  }
  _replaceCardConfigInDashboardConfig(e, t) {
    const s = this._replaceFirstMatch(
      e,
      (n) => !!this._sourceConfigRef && n === this._sourceConfigRef,
      t
    );
    if (s.replaced)
      return {
        config: s.value,
        replaced: !0
      };
    const i = this._replaceFirstMatch(
      e,
      (n) => this._matchesCurrentCardSignature(n),
      t
    );
    return {
      config: i.value,
      replaced: i.replaced
    };
  }
  _replaceFirstMatch(e, t, s) {
    let i = !1;
    const n = (o) => {
      if (i)
        return o;
      if (t(o))
        return i = !0, s;
      if (Array.isArray(o)) {
        let d = !1;
        const h = o.map((p) => {
          const u = n(p);
          return u !== p && (d = !0), u;
        });
        return d ? h : o;
      }
      if (typeof o != "object" || o === null)
        return o;
      let l = !1;
      const a = {};
      for (const [d, h] of Object.entries(o)) {
        const p = n(h);
        a[d] = p, p !== h && (l = !0);
      }
      return l ? a : o;
    };
    return { value: n(e), replaced: i };
  }
  _matchesCurrentCardSignature(e) {
    if (!this._config || typeof e != "object" || e === null)
      return !1;
    const t = e;
    if (t.type !== this._config.type)
      return !1;
    const s = Number(t.rows), i = Number(t.columns);
    if (s !== this._config.rows || i !== this._config.columns)
      return !1;
    const o = (Array.isArray(t.panels) ? t.panels : []).map(
      (a) => typeof a == "object" && a !== null && typeof a.id == "string" ? a.id : ""
    ).sort().join("|"), l = this._config.panels.map((a) => a.id).sort().join("|");
    return o.length > 0 && o === l;
  }
  _adjustGraphSamplesForEntity(e, t) {
    const s = this._getSystemPowerEntityId(), i = (this._config?.invert_system_power ?? !1) && !!s && e === s;
    return t.map((n) => ({
      ts: n.ts,
      value: ne(i ? n.value * -1 : n.value)
    }));
  }
  _getPowerEntities() {
    if (!this._config)
      return [];
    const e = this._config.panels.map((t) => t.power_entity).filter((t) => !!t);
    return [...new Set(e)];
  }
  _getHistoryHours() {
    return this._config?.deviation_history_hours ?? 12;
  }
  _getHistorySignature() {
    if (!this._config || !this.hass)
      return "";
    const e = this._getPowerEntities().sort().join("|"), t = this._getRestartToken();
    return `${this._getHistoryHours()}:${e}:${t ?? ""}`;
  }
  _getRestartToken() {
    const e = this._config?.deviation_restart_entity;
    return e ? this.hass?.states?.[e]?.state : void 0;
  }
  _historyCacheKey() {
    return `${Hs}${this._getHistorySignature()}`;
  }
  _pruneSamples(e, t = this._getHistoryHours()) {
    const i = Date.now() - t * 60 * 60 * 1e3;
    return e.filter((n) => n.ts >= i && Number.isFinite(n.value)).sort((n, o) => n.ts - o.ts);
  }
  _syncLiveSamplesFromHass() {
    if (!this.hass || !this._config)
      return;
    let e = !1;
    const t = Date.now();
    for (const s of this._config.panels) {
      const i = s.power_entity;
      if (!i)
        continue;
      const n = this.hass.states[i], o = Number(n?.state);
      if (!Number.isFinite(o))
        continue;
      const a = [...this._historyByEntityId[i] ?? []], d = a[a.length - 1];
      (!d || Math.abs(t - d.ts) > 6e4 || Math.abs(d.value - o) > 0.01) && (a.push({ ts: t, value: o }), this._historyByEntityId[i] = this._pruneSamples(a), e = !0);
    }
    e && this._saveHistoryCache();
  }
  _saveHistoryCache() {
    if (typeof window > "u" || !this._config)
      return;
    const e = {
      v: ht,
      savedAt: Date.now(),
      samples: this._historyByEntityId,
      reason: this._historyStateReason
    };
    try {
      window.localStorage.setItem(this._historyCacheKey(), JSON.stringify(e));
    } catch {
    }
  }
  _loadHistoryCache() {
    if (!(typeof window > "u"))
      try {
        const e = window.localStorage.getItem(this._historyCacheKey());
        if (!e)
          return;
        const t = JSON.parse(e);
        if (t.v !== ht || !t.samples)
          return;
        const s = {};
        for (const [i, n] of Object.entries(t.samples))
          s[i] = this._pruneSamples(n);
        this._historyByEntityId = s;
      } catch {
      }
  }
  _ensureHistoryLoaded() {
    if (!this.hass || !this._config)
      return;
    if (!(this._config.enable_array_checks ?? !1)) {
      this._historyState = "idle", this._historyStateReason = void 0, this._historySignature = "", this._historyByEntityId = {};
      return;
    }
    const e = this._getHistorySignature();
    e && (e === this._historySignature && this._historyState !== "idle" || (this._historySignature = e, this._historyByEntityId = {}, this._loadHistoryCache(), this._loadHistoryFromRecorder()));
  }
  async _loadHistoryFromRecorder() {
    if (!this.hass || !this._config)
      return;
    const e = this._getPowerEntities();
    if (e.length === 0) {
      this._historyState = "ready", this._historyStateReason = "No panel sensors configured.", this._refreshDerived(), this.requestUpdate();
      return;
    }
    if (!this.hass.callApi && !this.hass.callWS) {
      this._historyState = "unavailable", this._historyStateReason = "Solar panel history API unavailable in this Home Assistant build.", this._refreshDerived(), this.requestUpdate();
      return;
    }
    const t = Date.now(), s = new Date(t - this._getHistoryHours() * 60 * 60 * 1e3).toISOString(), i = new Date(t).toISOString();
    this._historyState = "loading", this._historyStateReason = void 0, this.requestUpdate();
    try {
      const n = await this._fetchRecorderHistoryRaw(s, i, e), o = this._parseRecorderResponse(n, this._getHistoryHours(), e);
      Object.keys(o).length === 0 ? (this._historyState = "fallback", this._historyStateReason = "Solar panel history returned no samples, using live warm-up only.") : (this._historyByEntityId = {
        ...this._historyByEntityId,
        ...o
      }, this._historyState = "ready", this._historyStateReason = void 0);
    } catch {
      this._historyState = "fallback", this._historyStateReason = "Failed to read solar panel history, using live warm-up only.";
    }
    this._syncLiveSamplesFromHass(), this._saveHistoryCache(), this._refreshDerived(), this.requestUpdate();
  }
  async _fetchRecorderHistoryRaw(e, t, s) {
    if (!this.hass)
      throw new Error("Home Assistant context unavailable");
    const i = [], n = s.join(","), o = `history/period/${e}`, l = `history/period/${encodeURIComponent(e)}`, a = [], d = {
      end_time: t,
      filter_entity_id: n,
      no_attributes: !0,
      significant_changes_only: !1,
      minimal_response: !0
    }, h = {
      end_time: t,
      filter_entity_id: n
    };
    if (a.push({ path: o, params: h }), a.push({ path: o, params: d }), l !== o && (a.push({ path: l, params: h }), a.push({ path: l, params: d })), this.hass.callApi)
      for (const p of a)
        try {
          return await this.hass.callApi("GET", p.path, p.params);
        } catch (u) {
          i.push(u);
        }
    if (this.hass.callWS) {
      const p = [
        {
          type: "history/history_during_period",
          start_time: e,
          end_time: t,
          entity_ids: s,
          no_attributes: !0,
          significant_changes_only: !1,
          minimal_response: !0
        },
        {
          type: "history/history_during_period",
          start_time: e,
          end_time: t,
          entity_ids: s
        }
      ];
      for (const u of p)
        try {
          return await this.hass.callWS(u);
        } catch (_) {
          i.push(_);
        }
    }
    throw i.length > 0 ? i[i.length - 1] : new Error("Recorder API unavailable");
  }
  _parseRecorderResponse(e, t = this._getHistoryHours(), s = []) {
    const i = {}, n = (a) => {
      if (typeof a == "number" && Number.isFinite(a))
        return a > 1e11 ? a : a * 1e3;
      if (typeof a == "string" && a.trim().length > 0) {
        const d = a.trim(), h = Number(d);
        if (Number.isFinite(h) && /^\d+(\.\d+)?$/.test(d))
          return h > 1e11 ? h : h * 1e3;
        const p = Date.parse(d);
        if (Number.isFinite(p))
          return p;
      }
      return Number.NaN;
    }, o = (a, d) => {
      if (!Array.isArray(a) || a.length === 0)
        return;
      let h = d;
      for (const p of a) {
        if (Array.isArray(p)) {
          if (!h || p.length < 2)
            continue;
          const T = n(p[0]), N = Number(p[1]), k = n(p[1]), S = Number(p[0]);
          let P = T, x = N;
          if ((!Number.isFinite(P) || !Number.isFinite(x)) && (P = k, x = S), !Number.isFinite(P) || !Number.isFinite(x))
            continue;
          i[h] || (i[h] = []), i[h].push({ ts: P, value: x });
          continue;
        }
        if (typeof p != "object" || p === null)
          continue;
        const u = p, _ = typeof u.entity_id == "string" && u.entity_id.length > 0 ? u.entity_id : typeof u.e == "string" && u.e.length > 0 ? u.e : h;
        if (!_)
          continue;
        h = _;
        const f = Number(u.state ?? u.s);
        if (!Number.isFinite(f))
          continue;
        const v = typeof u.last_changed == "string" ? u.last_changed : typeof u.last_updated == "string" ? u.last_updated : u.lc ?? u.lu ?? u.last_changed_ts ?? u.last_updated_ts ?? u.ts, $ = n(v);
        Number.isFinite($) && (i[_] || (i[_] = []), i[_].push({ ts: $, value: f }));
      }
    }, l = typeof e == "object" && e !== null && "result" in e ? e.result : e;
    if (Array.isArray(l))
      for (const [a, d] of l.entries())
        o(d, s[a]);
    else if (typeof l == "object" && l !== null)
      for (const [a, d] of Object.entries(
        l
      ))
        o(d, a);
    else
      return i;
    for (const [a, d] of Object.entries(i))
      i[a] = this._pruneSamples(d, t);
    return i;
  }
};
we.properties = {
  hass: { attribute: !1 },
  _config: { state: !0 },
  _derived: { state: !0 },
  _cardWidth: { state: !0 },
  _selectedPanelId: { state: !0 },
  _showLivePowerPopup: { state: !0 },
  _showEnergyPopup: { state: !0 },
  _showCustomKpiPopup: { state: !0 },
  _showSystemHealthPopup: { state: !0 },
  _popupGraphRangeHours: { state: !0 },
  _popupGraphCache: { state: !0 }
}, we.styles = Ht`
    :host {
      display: block;
      width: 100%;
    }

    ha-card {
      position: relative;
      container-type: inline-size;
      overflow: auto;
      padding: 20px;
      width: min(100%, var(--spv-max-width, 980px));
      max-height: var(--spv-max-height, none);
      margin-inline: auto;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background:
        radial-gradient(circle at top left, rgba(255, 214, 92, 0.18), transparent 38%),
        radial-gradient(circle at top right, rgba(111, 201, 255, 0.16), transparent 35%),
        linear-gradient(150deg, rgba(15, 33, 53, 0.98), rgba(11, 19, 34, 0.96));
      color: var(--primary-text-color);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.05),
        0 12px 30px rgba(0, 0, 0, 0.28);
      backdrop-filter: blur(18px);
    }

    .chrome {
      position: absolute;
      inset: 0;
      pointer-events: none;
      background:
        linear-gradient(120deg, rgba(255, 255, 255, 0.02), transparent 30%),
        repeating-linear-gradient(
          125deg,
          rgba(255, 255, 255, 0.02) 0,
          rgba(255, 255, 255, 0.02) 2px,
          transparent 2px,
          transparent 16px
        );
      opacity: 0.45;
    }

    .header {
      position: relative;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 18px;
    }

    .header-copy {
      display: grid;
      gap: 6px;
      min-width: 0;
    }

    .topline {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }

    .eyebrow {
      flex: 1;
      font-size: 0.72rem;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.56);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .system-health {
      appearance: none;
      font: inherit;
      display: inline-flex;
      align-items: center;
      padding: 3px 10px;
      border-radius: 999px;
      border: 1px solid var(--health-color, rgba(142, 208, 114, 0.5));
      background: color-mix(in srgb, var(--health-color, #8ed072) 18%, transparent);
      color: var(--health-color, #8ed072);
      font-size: 0.68rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      white-space: nowrap;
      line-height: 1.35;
      cursor: pointer;
      transition: filter 160ms ease, transform 160ms ease;
    }

    .system-health:hover {
      filter: brightness(1.08);
      transform: translateY(-1px);
    }

    .title {
      margin: 0;
      font-size: 1.45rem;
      line-height: 1.1;
      letter-spacing: 0.01em;
      font-weight: 700;
    }

    .subtitle {
      margin: 0;
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.92rem;
    }

    .subtitle-hint {
      color: rgba(255, 255, 255, 0.55);
      font-size: 0.84rem;
    }

    .summary {
      display: grid;
      gap: 10px;
      min-width: min(100%, 360px);
    }

    .summary.with-custom {
      grid-template-columns:
        minmax(84px, 1fr)
        minmax(84px, 1fr)
        minmax(62px, 0.62fr)
        minmax(84px, 1fr);
    }

    .summary.without-custom {
      grid-template-columns:
        minmax(84px, 1fr)
        minmax(84px, 1fr)
        minmax(62px, 0.62fr);
    }

    .summary-chip {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      text-align: left;
      border-radius: 16px;
      padding: 10px 10px 10px 12px;
      background: rgba(255, 255, 255, 0.055);
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
    }

    .summary-chip.summary-button {
      appearance: none;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      font: inherit;
      color: inherit;
      text-align: left;
      margin: 0;
      width: 100%;
      padding: 10px 10px 10px 12px;
      cursor: pointer;
      transition: border-color 160ms ease, background 160ms ease;
    }

    .summary-chip.summary-button:hover {
      border-color: rgba(255, 255, 255, 0.18);
      background: rgba(255, 255, 255, 0.08);
    }

    .summary-chip.alerts-chip {
      padding: 10px 8px 10px 12px;
    }

    .summary-chip.alerts-chip .summary-value {
      font-size: 0.96rem;
    }

    .summary-label {
      display: block;
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: rgba(255, 255, 255, 0.55);
      margin-bottom: 4px;
    }

    .summary-value {
      display: block;
      font-size: 1rem;
      font-weight: 700;
      max-width: 100%;
    }

    .summary-value.custom-kpi-value {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .grid {
      position: relative;
      display: grid;
      gap: 10px;
      margin-top: 14px;
      align-items: stretch;
    }

    .panel {
      position: relative;
      container-type: inline-size;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      width: min(100%, var(--spv-panel-max-width, 100%));
      justify-self: center;
      height: var(--spv-panel-height, clamp(96px, 14vw, 136px));
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 18px;
      padding: 10px 10px 10px;
      text-align: left;
      color: inherit;
      background:
        linear-gradient(160deg, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0.02)),
        linear-gradient(180deg, rgba(10, 17, 29, 0.86), rgba(7, 12, 21, 0.92));
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.08),
        0 10px 24px rgba(0, 0, 0, 0.18);
      cursor: pointer;
      transition:
        transform 180ms ease,
        border-color 180ms ease,
        box-shadow 180ms ease;
    }

    .panel:hover {
      transform: translateY(-2px);
      border-color: rgba(255, 255, 255, 0.16);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.09),
        0 14px 28px rgba(0, 0, 0, 0.24);
    }

    .panel::before {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.1), transparent 30%),
        linear-gradient(135deg, rgba(255, 255, 255, 0.05), transparent 48%);
      pointer-events: none;
    }

    .panel::after {
      content: "";
      position: absolute;
      inset: auto -22% -56% auto;
      width: 188px;
      height: 188px;
      border-radius: 50%;
      background: radial-gradient(circle, var(--panel-accent) 0%, transparent 72%);
      opacity: calc(0.3 + var(--panel-intensity) * 0.62);
      filter: blur(14px);
      pointer-events: none;
    }

    .panel.error,
    .panel.inverter,
    .panel.deviation,
    .panel.offline,
    .panel.unconfigured,
    .panel.disabled {
      cursor: pointer;
    }

    .panel.hidden-slot {
      background:
        linear-gradient(160deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01)),
        linear-gradient(180deg, rgba(10, 17, 29, 0.6), rgba(7, 12, 21, 0.68));
      border-style: dashed;
      border-color: rgba(255, 255, 255, 0.18);
      cursor: default;
    }

    .panel.hidden-slot:hover {
      transform: none;
    }

    .panel.hidden-slot .panel-name,
    .panel.hidden-slot .power,
    .panel.hidden-slot .performance,
    .panel.hidden-slot .energy,
    .panel.hidden-slot .inverter-status {
      visibility: hidden;
    }

    .slot {
      position: absolute;
      right: 10px;
      bottom: 10px;
      z-index: 2;
      font-size: clamp(0.66rem, calc(0.68rem * var(--spv-panel-scale, 1)), 0.84rem);
      text-transform: uppercase;
      letter-spacing: 0.12em;
      text-align: right;
      color: rgba(255, 255, 255, 0.56);
    }

    .status {
      position: absolute;
      top: 8px;
      left: 8px;
      z-index: 2;
      padding: 4px 8px;
      border-radius: 999px;
      font-size: clamp(0.64rem, calc(0.66rem * var(--spv-panel-scale, 1)), 0.82rem);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .panel-name {
      position: relative;
      z-index: 1;
      margin: 30px 0 5px;
      font-size: clamp(0.8rem, calc(0.94rem * var(--spv-panel-scale, 1)), 1.26rem);
      line-height: 1.15;
      font-weight: 600;
      text-wrap: balance;
    }

    .power {
      position: relative;
      z-index: 1;
      font-size: clamp(0.96rem, calc(1.18rem * var(--spv-panel-scale, 1)), 1.76rem);
      line-height: 1.05;
      font-weight: 750;
      margin: 0;
      text-wrap: pretty;
    }

    .panel.has-performance .power {
      font-size: clamp(0.92rem, calc(1.08rem * var(--spv-panel-scale, 1)), 1.64rem);
    }

    .energy {
      position: relative;
      z-index: 1;
      margin: 3px 0 0;
      color: rgba(255, 255, 255, 0.72);
      font-size: clamp(0.66rem, calc(0.78rem * var(--spv-panel-scale, 1)), 1rem);
    }

    .performance {
      position: relative;
      z-index: 1;
      margin: 3px 0 0;
      color: rgba(255, 255, 255, 0.78);
      font-size: clamp(0.62rem, calc(0.72rem * var(--spv-panel-scale, 1)), 0.96rem);
      line-height: 1.2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .inverter-status {
      position: relative;
      z-index: 1;
      margin: 4px 0 0;
      color: rgba(255, 255, 255, 0.74);
      font-size: clamp(0.62rem, calc(0.72rem * var(--spv-panel-scale, 1)), 0.92rem);
      line-height: 1.2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .reason {
      font-size: 0.78rem;
      color: rgba(255, 255, 255, 0.7);
    }

    .spv-popup-backdrop {
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      padding: clamp(8px, 2vw, 16px);
      overflow: hidden;
      background: rgba(4, 8, 16, 0.72);
      backdrop-filter: blur(10px);
      z-index: 20;
    }

    .spv-popup {
      box-sizing: border-box;
      inline-size: min(560px, calc(100% - 8px));
      max-block-size: min(760px, calc(100% - 8px));
      overflow: auto;
      overscroll-behavior: contain;
      border-radius: 24px;
      border: 1px solid rgba(255, 255, 255, 0.09);
      background:
        radial-gradient(circle at top right, rgba(255, 212, 84, 0.18), transparent 34%),
        linear-gradient(180deg, rgba(16, 26, 42, 0.98), rgba(10, 18, 30, 0.98));
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.06),
        0 20px 34px rgba(0, 0, 0, 0.36);
      padding: 16px;
    }

    .spv-popup-close-anchor {
      position: sticky;
      top: 8px;
      z-index: 8;
      height: 0;
      display: flex;
      justify-content: flex-end;
      pointer-events: none;
    }

    .spv-popup-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 14px;
      margin-bottom: 14px;
      padding-right: 48px;
    }

    .spv-popup-title {
      margin: 0;
      font-size: 1.2rem;
    }

    .spv-popup-close {
      flex: 0 0 auto;
      border: 0;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.08);
      color: inherit;
      width: 36px;
      height: 36px;
      margin-left: auto;
      cursor: pointer;
    }

    .spv-popup-close-anchor .spv-popup-close {
      pointer-events: auto;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
      margin-top: 2px;
      margin-bottom: 12px;
    }

    .detail-card {
      padding: 12px;
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .detail-label {
      display: block;
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: rgba(255, 255, 255, 0.6);
      margin-bottom: 4px;
    }

    .detail-value {
      display: block;
      font-size: 1rem;
      font-weight: 700;
    }

    .detail-information {
      margin-top: 12px;
    }

    .info-lines {
      display: grid;
      gap: 6px;
    }

    .info-line {
      margin: 0;
      font-size: 0.82rem;
      line-height: 1.35;
      color: rgba(255, 255, 255, 0.76);
      white-space: normal;
      overflow-wrap: anywhere;
    }

    .system-health-item {
      margin: 0;
      font-size: 0.86rem;
      line-height: 1.4;
      color: rgba(255, 255, 255, 0.8);
      white-space: normal;
      overflow-wrap: anywhere;
    }

    .graph-section {
      margin: 0 0 14px;
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.03);
      padding: 10px;
      display: grid;
      gap: 8px;
    }

    .graph-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }

    .graph-title {
      font-size: 0.76rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: rgba(255, 255, 255, 0.62);
    }

    .range-chips {
      display: inline-flex;
      gap: 6px;
      flex-wrap: wrap;
    }

    .range-chip {
      border: 1px solid rgba(255, 255, 255, 0.14);
      background: rgba(255, 255, 255, 0.05);
      color: rgba(255, 255, 255, 0.82);
      border-radius: 999px;
      padding: 4px 8px;
      font-size: 0.72rem;
      line-height: 1;
      cursor: pointer;
    }

    .range-chip.active {
      border-color: rgba(255, 255, 255, 0.3);
      background: rgba(255, 255, 255, 0.14);
      color: rgba(255, 255, 255, 0.96);
    }

    .graph-box {
      position: relative;
      border-radius: 12px;
      overflow: hidden;
      background: rgba(8, 14, 25, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .graph-hour-line {
      stroke: rgba(255, 255, 255, 0.18);
      stroke-width: 1;
      stroke-dasharray: 3 3;
      opacity: 0.35;
    }

    .graph-svg {
      width: 100%;
      height: clamp(96px, 18vh, 132px);
      display: block;
    }

    .graph-meta {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      font-size: 0.74rem;
      color: rgba(255, 255, 255, 0.7);
    }

    .graph-stat-line {
      stroke-width: 1.2;
      stroke-dasharray: 4 3;
      opacity: 0.5;
    }

    .graph-stat-max {
      stroke: rgba(255, 150, 103, 0.95);
    }

    .graph-stat-median {
      stroke: rgba(120, 205, 255, 0.95);
    }

    .graph-overlay {
      position: absolute;
      left: 10px;
      display: inline-flex;
      align-items: center;
      min-height: 16px;
      padding: 0 6px;
      border-radius: 999px;
      font-size: 0.66rem;
      letter-spacing: 0.02em;
      color: rgba(255, 255, 255, 0.92);
      background: rgba(8, 16, 28, 0.62);
      border: 1px solid rgba(255, 255, 255, 0.14);
      backdrop-filter: blur(2px);
      pointer-events: none;
      z-index: 3;
    }

    .graph-overlay-max {
      top: 8px;
    }

    .graph-overlay-median {
      top: 50%;
      transform: translateY(-50%);
      background: rgba(8, 16, 28, 0.55);
    }

    .graph-overlay-min {
      bottom: 8px;
    }

    .graph-axis {
      position: relative;
      height: 14px;
      margin-top: 2px;
    }

    .graph-axis-label {
      position: absolute;
      transform: translateX(-50%);
      font-size: 0.66rem;
      letter-spacing: 0.03em;
      color: rgba(255, 255, 255, 0.62);
      white-space: nowrap;
      line-height: 1;
      user-select: none;
    }

    .graph-state {
      font-size: 0.82rem;
      color: rgba(255, 255, 255, 0.72);
      padding: 8px 2px;
    }

    .inline-config {
      display: grid;
      gap: 10px;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid rgba(255, 255, 255, 0.12);
    }

    @container (max-width: 260px) {
      .detail-grid {
        grid-template-columns: 1fr;
      }
    }

    @container (max-width: 860px) {
      .grid {
        gap: 8px;
      }

      .panel {
        height: max(104px, min(var(--spv-panel-height, 124px), 172px));
      }
    }

    @container (max-width: 560px) {
      .header {
        display: grid;
        grid-template-columns: 1fr;
        gap: 10px;
      }

      .summary {
        min-width: 0;
      }

      .summary.with-custom {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }

      .summary.without-custom {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }

      .summary-chip {
        padding: 8px 8px 8px 10px;
      }

      .summary-chip.summary-button {
        padding: 8px 8px 8px 10px;
      }

      .summary-chip.alerts-chip {
        padding: 8px 6px 8px 10px;
      }

      .summary-value.custom-kpi-value {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        white-space: normal;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 1.2;
      }

      .header-copy > .subtitle,
      .subtitle-hint {
        display: none;
      }

      .eyebrow {
        font-size: 0.66rem;
        letter-spacing: 0.09em;
      }

      .grid {
        gap: 10px;
        margin-top: 12px;
      }

      .panel {
        height: max(100px, min(var(--spv-panel-height, 120px), 156px));
        border-radius: 16px;
        padding: 9px 9px 9px;
      }
    }

  `;
let ve = we;
customElements.get("solar-panel-visualizer") || customElements.define("solar-panel-visualizer", ve);
if (!customElements.get("solar-panel-visualizer-card")) {
  class r extends ve {
  }
  customElements.define("solar-panel-visualizer-card", r);
}
const Gs = /(\d+)/, dt = (r) => {
  const e = Gs.exec(r);
  if (!e)
    return null;
  const t = Number(e[1]);
  return Number.isFinite(t) ? t : null;
}, Bs = (r) => {
  const e = dt(r.entityId);
  return e !== null ? e : r.friendlyName ? dt(r.friendlyName) : null;
}, Vs = (r) => {
  const e = r.map((s) => ({
    ...s,
    sortNumber: Bs(s)
  }));
  return e.some((s) => s.sortNumber !== null) ? [...e].sort((s, i) => s.sortNumber === null && i.sortNumber === null ? s.entityId.localeCompare(i.entityId) : s.sortNumber === null ? 1 : i.sortNumber === null ? -1 : s.sortNumber !== i.sortNumber ? s.sortNumber - i.sortNumber : s.entityId.localeCompare(i.entityId)).map(({ entityId: s, friendlyName: i }) => ({ entityId: s, friendlyName: i })) : [...e].sort((s, i) => s.entityId.localeCompare(i.entityId)).map(({ entityId: s, friendlyName: i }) => ({ entityId: s, friendlyName: i }));
}, js = (r, e, t) => {
  const s = e.trim().replace(/\*+$/, "");
  if (s.length === 0)
    return [];
  const i = [];
  for (const [n, o] of Object.entries(r)) {
    if (!n.startsWith("sensor.") || !n.startsWith(s))
      continue;
    const l = o.attributes?.unit_of_measurement;
    if (typeof l != "string")
      continue;
    const a = l.trim().toLowerCase();
    if (!t(a))
      continue;
    const d = typeof o.attributes?.friendly_name == "string" ? o.attributes.friendly_name : void 0;
    i.push({
      entityId: n,
      friendlyName: d
    });
  }
  return Vs(i);
}, ut = (r, e, t, s, i) => {
  const n = s.trim().replace(/\*+$/, "");
  if (n.length === 0)
    return {
      panels: [...r],
      matched: 0,
      filled: 0,
      skipped: r.length
    };
  const o = js(e, n, i), l = new Set(
    r.map((_) => _[t]).filter((_) => typeof _ == "string" && _.length > 0)
  ), a = o.map((_) => _.entityId).filter((_) => !l.has(_));
  let d = 0, h = 0, p = 0;
  return {
    panels: r.map((_) => {
      const f = { ..._ };
      if (f.enabled === !1)
        return p += 1, f;
      const v = f[t];
      if (typeof v == "string" && v.trim().length > 0)
        return p += 1, f;
      const $ = a[d];
      return $ ? (f[t] = $, d += 1, h += 1, f) : (p += 1, f);
    }),
    matched: o.length,
    filled: h,
    skipped: p
  };
}, _t = "spv-card-config-updated", Ks = (r, e) => {
  r.dispatchEvent(
    new CustomEvent("config-changed", {
      detail: { config: e },
      bubbles: !0,
      composed: !0
    })
  );
}, Ys = (r, e) => {
  const t = Math.floor(r / e) + 1, s = r % e + 1;
  return `Row ${t}, Column ${s}`;
}, xe = class xe extends Z {
  constructor() {
    super(...arguments), this._config = F({ type: pe }), this._autoFillPowerPrefix = "", this._autoFillEnergyPrefix = "", this._autoFillResultMessage = "", this._applyDefaultRatedPowerToAllPanels = () => {
      const e = this._config.default_panel_rated_power_w;
      if (!e)
        return;
      const t = this._config.panels.map((s) => ({
        ...s,
        rated_power_w: e
      }));
      this._commit(
        F({
          ...this._config,
          panels: t
        })
      );
    }, this._handleAutoPopulateSensors = () => {
      if (!this.hass)
        return;
      const e = this._autoFillPowerPrefix.trim(), t = this._autoFillEnergyPrefix.trim();
      if (!e && !t) {
        this._autoFillResultMessage = "Enter at least one prefix to run auto-fill.";
        return;
      }
      let s = [...this._config.panels];
      const i = [];
      if (e) {
        s = s.map((o) => ({ ...o, power_entity: void 0 }));
        const n = ut(
          s,
          this.hass.states,
          "power_entity",
          e,
          (o) => o === "w"
        );
        s = n.panels, i.push(
          `Power matched ${n.matched}, filled ${n.filled}, skipped ${n.skipped}.`
        );
      }
      if (t) {
        s = s.map((o) => ({ ...o, energy_entity: void 0 }));
        const n = ut(
          s,
          this.hass.states,
          "energy_entity",
          t,
          (o) => o === "kwh" || o === "wh"
        );
        s = n.panels, i.push(
          `Energy matched ${n.matched}, filled ${n.filled}, skipped ${n.skipped}.`
        );
      }
      this._autoFillResultMessage = i.join(" "), this._commit(
        F({
          ...this._config,
          panels: s
        })
      );
    }, this._handleRemoveAllPanelSensors = () => {
      const e = this._config.panels.map((t) => ({
        ...t,
        power_entity: void 0,
        energy_entity: void 0,
        show_energy: !1,
        inverter_status_entity: void 0,
        error_entity: void 0
      }));
      this._autoFillResultMessage = "Cleared power, energy, and inverter sensors on all panels.", this._commit(
        F({
          ...this._config,
          panels: e
        })
      );
    }, this._handleCardConfigSync = (e) => {
      const s = e.detail?.config;
      if (!s || typeof s != "object")
        return;
      const i = F(s);
      this._isReorderOnlySync(i) && this._commit(i);
    };
  }
  connectedCallback() {
    super.connectedCallback(), window.addEventListener(_t, this._handleCardConfigSync);
  }
  disconnectedCallback() {
    window.removeEventListener(_t, this._handleCardConfigSync), super.disconnectedCallback();
  }
  setConfig(e) {
    this._config = F(e ?? {});
  }
  render() {
    return this.hass ? m`
      <div class="editor">
        <section class="section">
          <div class="section-header">
            <h3 class="section-title">Layout</h3>
            <p class="section-copy">
              Set the array size first. Panel slots expand automatically from the row and
              column values.
            </p>
          </div>

          <div class="grid">
            ${this._renderTextField("title", "Title", this._config.title ?? "")}
            ${this._renderNumberField("rows", "Rows", this._config.rows, 1, 12)}
            ${this._renderNumberField(
      "columns",
      "Columns",
      this._config.columns,
      1,
      12
    )}
            ${this._renderNumberField(
      "max_card_width_px",
      "Max card width (px)",
      this._config.max_card_width_px ?? 980,
      300,
      2400
    )}
            ${this._renderOptionalNumberField(
      "max_card_height_px",
      "Max card height (px)",
      this._config.max_card_height_px,
      300,
      2600
    )}
          </div>
        </section>

        <section class="section">
          <div class="section-header">
            <h3 class="section-title">Display</h3>
            <p class="section-copy">
              Tune precision and panel detail behavior.
            </p>
          </div>
          <div class="grid">
            ${this._renderNumberField(
      "power_decimals",
      "Power decimals",
      this._config.power_decimals ?? 0,
      0,
      4
    )}
            ${this._renderNumberField(
      "energy_decimals",
      "Energy decimals",
      this._config.energy_decimals ?? 2,
      0,
      4
    )}
            ${this._renderNumberField(
      "custom_kpi_decimals",
      "Custom KPI decimals",
      this._config.custom_kpi_decimals ?? 0,
      0,
      4
    )}
            ${this._renderSelectField(
      "panel_tap_action",
      "Panel tap action",
      this._config.panel_tap_action ?? "details",
      [
        { value: "details", label: "Open detail popover" },
        { value: "none", label: "No action" }
      ]
    )}
          </div>
          <div class="toggle">
            <ha-formfield label="Use one system power sensor for top KPI">
              <ha-switch
                .checked=${this._config.use_system_power_entity ?? !1}
                @change=${(e) => this._updateRootValue(
      "use_system_power_entity",
      e.currentTarget.checked
    )}
              ></ha-switch>
            </ha-formfield>
          </div>
          <ha-selector
            .hass=${this.hass}
            .value=${this._config.system_power_entity ?? ""}
            .selector=${{
      entity: {
        domain: "sensor"
      }
    }}
            .label=${"System power sensor (W)"}
            @value-changed=${(e) => this._updateRootValue("system_power_entity", e.detail.value)}
          ></ha-selector>
          <div class="toggle">
            <ha-formfield label="Invert system power value">
              <ha-switch
                .checked=${this._config.invert_system_power ?? !1}
                @change=${(e) => this._updateRootValue(
      "invert_system_power",
      e.currentTarget.checked
    )}
              ></ha-switch>
            </ha-formfield>
          </div>
          <div class="toggle">
            <ha-formfield label="Use one system daily energy sensor for top KPI">
              <ha-switch
                .checked=${this._config.use_system_energy_entity ?? !1}
                @change=${(e) => this._updateRootValue(
      "use_system_energy_entity",
      e.currentTarget.checked
    )}
              ></ha-switch>
            </ha-formfield>
          </div>
          <ha-selector
            .hass=${this.hass}
            .value=${this._config.system_energy_entity ?? ""}
            .selector=${{
      entity: {
        domain: "sensor"
      }
    }}
            .label=${"System daily energy sensor"}
            @value-changed=${(e) => this._updateRootValue("system_energy_entity", e.detail.value)}
          ></ha-selector>
          <ha-selector
            .hass=${this.hass}
            .value=${this._config.custom_kpi_entity ?? ""}
            .selector=${{
      entity: {
        domain: "sensor"
      }
    }}
            .label=${"Custom KPI sensor"}
            @value-changed=${(e) => this._updateRootValue("custom_kpi_entity", e.detail.value)}
          ></ha-selector>
          ${this._renderTextField(
      "custom_kpi_title",
      "Custom KPI heading",
      this._config.custom_kpi_title ?? ""
    )}
          <div class="toggle">
            <ha-formfield label="Show Custom KPI box">
              <ha-switch
                .checked=${this._config.show_custom_kpi ?? !0}
                @change=${(e) => this._updateRootValue(
      "show_custom_kpi",
      e.currentTarget.checked
    )}
              ></ha-switch>
            </ha-formfield>
          </div>
          <div class="toggle">
            <ha-formfield label="Limit panel tile max width">
              <ha-switch
                .checked=${this._config.limit_panel_width ?? !1}
                @change=${(e) => this._updateRootValue(
      "limit_panel_width",
      e.currentTarget.checked
    )}
              ></ha-switch>
            </ha-formfield>
          </div>
          <ha-textfield
            .label=${"Max panel tile width (px)"}
            .value=${String(this._config.panel_max_width_px ?? 220)}
            type="number"
            .min=${"120"}
            .max=${"320"}
            .disabled=${!(this._config.limit_panel_width ?? !1)}
            @change=${(e) => this._updateRootValue(
      "panel_max_width_px",
      this._parseNumberWithClamp(
        e.currentTarget.value,
        this._config.panel_max_width_px ?? 220,
        120,
        320
      )
    )}
          ></ha-textfield>
        </section>

        <section class="section">
          <div class="section-header">
            <h3 class="section-title">Array Health Check</h3>
            <p class="section-copy">
              Automatically checks panel health by comparing each panel against expected
              array performance from rated power and shared solar panel history.
            </p>
          </div>
          <div class="toggle">
            <ha-formfield label="Enable Array Health Check">
              <ha-switch
                .checked=${this._config.enable_array_checks ?? !1}
                @change=${(e) => this._updateRootValue(
      "enable_array_checks",
      e.currentTarget.checked
    )}
              ></ha-switch>
            </ha-formfield>
          </div>
          <p class="section-copy">
            Smoothing window averages recent samples before checks; 0 means no smoothing.
          </p>
          <div class="grid">
            ${this._renderNumberField(
      "deviation_threshold_percent",
      "Deviation threshold (%)",
      this._config.deviation_threshold_percent ?? 15,
      1,
      100
    )}
            ${this._renderNumberField(
      "deviation_absolute_w_threshold",
      "Absolute shortfall threshold (W)",
      this._config.deviation_absolute_w_threshold ?? 50,
      0,
      5e3
    )}
            ${this._renderNumberField(
      "deviation_min_runtime_minutes",
      "Deviation check time (minutes)",
      this._config.deviation_min_runtime_minutes ?? 15,
      0,
      1440
    )}
            ${this._renderNumberField(
      "deviation_min_active_panels",
      "Minimum active panels",
      this._config.deviation_min_active_panels ?? 3,
      2,
      30
    )}
            ${this._renderNumberField(
      "deviation_min_samples",
      "Minimum samples per panel",
      this._config.deviation_min_samples ?? 3,
      1,
      120
    )}
            ${this._renderNumberField(
      "deviation_smoothing_minutes",
      "Smoothing window (minutes)",
      this._config.deviation_smoothing_minutes ?? 0,
      0,
      1440
    )}
            ${this._renderNumberField(
      "deviation_dynamic_floor_w",
      "Dynamic floor start (W)",
      this._config.deviation_dynamic_floor_w ?? 20,
      0,
      5e3
    )}
            ${this._renderNumberField(
      "deviation_history_hours",
      "Shared history window (hours)",
      this._config.deviation_history_hours ?? 12,
      1,
      168
    )}
          </div>
        </section>

        <section class="section">
          <div class="section-header">
            <h3 class="section-title">Inverter Status</h3>
            <p class="section-copy">
              Track textual status from each panel’s inverter status sensor. A panel turns
              red only when status text contains one of the configured fault terms. The
              current inverter status is shown in the panel popup.
            </p>
          </div>
          <div class="toggle">
            <ha-formfield label="Enable inverter status checks">
              <ha-switch
                .checked=${this._config.enable_inverter_status ?? !1}
                @change=${(e) => this._updateRootValue(
      "enable_inverter_status",
      e.currentTarget.checked
    )}
              ></ha-switch>
            </ha-formfield>
            <ha-formfield label="Show inverter status on panel tiles">
              <ha-switch
                .checked=${this._config.show_inverter_status_on_tiles ?? !1}
                @change=${(e) => this._updateRootValue(
      "show_inverter_status_on_tiles",
      e.currentTarget.checked
    )}
              ></ha-switch>
            </ha-formfield>
          </div>
          <ha-textfield
            .label=${"Fault terms (comma-separated)"}
            .value=${(this._config.inverter_fault_terms ?? []).join(", ")}
            @input=${(e) => this._updateRootValue(
      "inverter_fault_terms",
      e.currentTarget.value
    )}
          ></ha-textfield>
          <ha-textfield
            .label=${"Working terms (comma-separated)"}
            .value=${(this._config.inverter_working_terms ?? []).join(", ")}
            @input=${(e) => this._updateRootValue(
      "inverter_working_terms",
      e.currentTarget.value
    )}
          ></ha-textfield>
          <p class="section-copy">
            Example: ${"fault, alarm, error, failed, failure, trip"}
          </p>
          <p class="section-copy">
            Working example: ${"normal, ok, running, waiting for operation, producing"}
          </p>
        </section>

        <section class="section">
          <div class="section-header">
            <h3 class="section-title">Status Colors</h3>
            <p class="section-copy">
              Production colors blend based on panel output. Alert colors override the
              production scale.
            </p>
          </div>
          <div class="color-grid">
            ${this._renderColorField("production_start", "Production base")}
            ${this._renderColorField("production_mid", "Production mid")}
            ${this._renderColorField("production_end", "Production peak")}
            ${this._renderColorField("deviation", "Deviation")}
            ${this._renderColorField("error", "Error")}
            ${this._renderColorField("unavailable", "Unavailable")}
          </div>
          <label class="color-field">
            <span>
              Production color intensity (${(this._config.production_color_intensity ?? 1).toFixed(
      2
    )})
            </span>
            <input
              type="range"
              min="0.2"
              max="1.6"
              step="0.05"
              .value=${String(this._config.production_color_intensity ?? 1)}
              @input=${(e) => this._updateRootValue(
      "production_color_intensity",
      Number(e.currentTarget.value)
    )}
            />
          </label>
        </section>

        <section class="section">
          <div class="section-header">
            <h3 class="section-title">Panels</h3>
            <p class="section-copy">
              Each generated slot can be configured with its own power, energy, and optional
              inverter status sensor. Disable a slot to hide that panel while keeping grid spacing.
            </p>
            <p class="section-copy">
              In the card view, drag and drop panel tiles to swap their positions.
            </p>
          </div>

          <div class="section">
            <div class="section-header">
              <h4 class="section-title">Panel default rated power</h4>
              <p class="section-copy">
                Set a common default panel power and apply it to all panel slots.
              </p>
            </div>
            <div class="grid">
              ${this._renderOptionalNumberField(
      "default_panel_rated_power_w",
      "Default panel rated power (W)",
      this._config.default_panel_rated_power_w,
      1,
      2e3
    )}
            </div>
            <div class="button-row">
              <button class="secondary-button" type="button" @click=${this._applyDefaultRatedPowerToAllPanels}>
                Apply default rated W to all panels
              </button>
            </div>
          </div>

          <div class="section">
            <div class="section-header">
              <h4 class="section-title">Auto-populate sensors</h4>
              <p class="section-copy">
                Fill empty panel sensors by entity prefix in slot order. Existing selections are preserved.
              </p>
            </div>
            <div class="grid">
              <ha-textfield
                .label=${"Power prefix"}
                .value=${this._autoFillPowerPrefix}
                @input=${(e) => {
      this._autoFillPowerPrefix = e.currentTarget.value;
    }}
              ></ha-textfield>
              <ha-textfield
                .label=${"Energy prefix (optional)"}
                .value=${this._autoFillEnergyPrefix}
                @input=${(e) => {
      this._autoFillEnergyPrefix = e.currentTarget.value;
    }}
              ></ha-textfield>
            </div>
            <div class="button-row">
              <button class="secondary-button" type="button" @click=${this._handleAutoPopulateSensors}>
                Auto-fill panel sensors
              </button>
              <button class="secondary-button" type="button" @click=${this._handleRemoveAllPanelSensors}>
                Remove all sensors
              </button>
            </div>
            ${this._autoFillResultMessage ? m`<p class="section-copy">${this._autoFillResultMessage}</p>` : g}
          </div>

          <div class="panel-list">
            ${this._config.panels.map(
      (e, t) => this._renderPanelEditor(e, t)
    )}
          </div>
        </section>
      </div>
    ` : g;
  }
  _renderPanelEditor(e, t) {
    const s = this._getAvailableSensorEntityIdsByUnit(
      t,
      "power_entity",
      (n) => n === "w"
    ), i = this._getAvailableSensorEntityIdsByUnit(
      t,
      "energy_entity",
      (n) => n === "kwh" || n === "wh"
    );
    return m`
      <details ?open=${t === 0}>
        <summary>
          <span>${Ys(t, this._config.columns)}</span>
          <span class="chip">${e.name ?? e.id}</span>
        </summary>
        <div class="panel-form">
          ${this._renderPanelTextField(t, "name", "Display name", e.name ?? "")}
          ${this._renderPanelSensorSelector(
      t,
      "power_entity",
      "Power sensor P(W)",
      e.power_entity,
      s
    )}
          ${this._renderPanelSensorSelector(
      t,
      "energy_entity",
      "Energy sensor (kWh/Wh)",
      e.energy_entity,
      i
    )}
          <div class="toggle">
            <ha-formfield label="Show panel energy">
              <ha-switch
                .checked=${e.show_energy ?? !1}
                @change=${(n) => this._updatePanelValue(
      t,
      "show_energy",
      n.currentTarget.checked
    )}
              ></ha-switch>
            </ha-formfield>
          </div>
          ${this._renderPanelOptionalNumberField(
      t,
      "rated_power_w",
      "Panel rated power (W)",
      e.rated_power_w,
      1,
      2e3
    )}
          ${this._renderPanelNumberField(
      t,
      "deviation_derate_percent",
      "Deviation derate (%)",
      e.deviation_derate_percent ?? 100,
      1,
      100
    )}
          <p class="section-copy">
            Used only by Array Health Check for naturally shaded panels.
          </p>
          ${this._renderPanelEntityPicker(
      t,
      "inverter_status_entity",
      "Inverter status sensor (optional)",
      e.inverter_status_entity,
      ["sensor", "binary_sensor"]
    )}
          <div class="toggle">
            <ha-formfield label="Show panel tile (hide but keep slot when off)">
              <ha-switch
                .checked=${e.enabled ?? !0}
                @change=${(n) => this._updatePanelValue(
      t,
      "enabled",
      n.currentTarget.checked
    )}
              ></ha-switch>
            </ha-formfield>
          </div>
        </div>
      </details>
    `;
  }
  _renderPanelEntityPicker(e, t, s, i, n) {
    return m`
      <ha-selector
        .hass=${this.hass}
        .value=${i ?? ""}
        .selector=${{
      entity: {
        domain: n
      }
    }}
        .label=${s}
        @value-changed=${(o) => this._updatePanelValue(e, t, o.detail.value)}
      ></ha-selector>
    `;
  }
  _renderTextField(e, t, s) {
    return m`
      <ha-textfield
        .label=${t}
        .value=${s}
        @input=${(i) => this._updateRootValue(e, i.currentTarget.value)}
      ></ha-textfield>
    `;
  }
  _renderPanelSensorSelector(e, t, s, i, n) {
    return m`
      <ha-selector
        .hass=${this.hass}
        .value=${i ?? ""}
        .selector=${{
      entity: {
        domain: "sensor",
        include_entities: n
      }
    }}
        .label=${s}
        @value-changed=${(o) => this._updatePanelValue(e, t, o.detail.value)}
      ></ha-selector>
    `;
  }
  _renderNumberField(e, t, s, i, n) {
    return m`
      <ha-textfield
        .label=${t}
        .value=${String(s)}
        type="number"
        .min=${String(i)}
        .max=${String(n)}
        @change=${(o) => this._updateRootValue(
      e,
      this._parseNumberWithClamp(
        o.currentTarget.value,
        s,
        i,
        n
      )
    )}
      ></ha-textfield>
    `;
  }
  _renderOptionalNumberField(e, t, s, i, n) {
    return m`
      <ha-textfield
        .label=${t}
        .value=${s !== void 0 ? String(s) : ""}
        type="number"
        .min=${String(i)}
        .max=${String(n)}
        @change=${(o) => this._updateRootValue(
      e,
      this._parseOptionalNumber(
        o.currentTarget.value,
        i,
        n
      )
    )}
      ></ha-textfield>
    `;
  }
  _renderPanelTextField(e, t, s, i) {
    return m`
      <ha-textfield
        .label=${s}
        .value=${i}
        @input=${(n) => this._updatePanelValue(e, t, n.currentTarget.value)}
      ></ha-textfield>
    `;
  }
  _renderPanelOptionalNumberField(e, t, s, i, n, o) {
    return m`
      <ha-textfield
        .label=${s}
        .value=${i !== void 0 ? String(i) : ""}
        type="number"
        .min=${String(n)}
        .max=${String(o)}
        @change=${(l) => this._updatePanelValue(
      e,
      t,
      this._parseOptionalNumber(
        l.currentTarget.value,
        n,
        o
      )
    )}
      ></ha-textfield>
    `;
  }
  _renderPanelNumberField(e, t, s, i, n, o) {
    return m`
      <ha-textfield
        .label=${s}
        .value=${String(i)}
        type="number"
        .min=${String(n)}
        .max=${String(o)}
        @change=${(l) => this._updatePanelValue(
      e,
      t,
      this._parseNumberWithClamp(
        l.currentTarget.value,
        i,
        n,
        o
      )
    )}
      ></ha-textfield>
    `;
  }
  _renderSelectField(e, t, s, i) {
    return m`
      <label class="color-field">
        <span>${t}</span>
        <select
          .value=${s}
          @change=${(n) => this._updateRootValue(e, n.currentTarget.value)}
        >
          ${i.map(
      (n) => m`<option value=${n.value}>${n.label}</option>`
    )}
        </select>
      </label>
    `;
  }
  _renderColorField(e, t) {
    const s = this._config.colors?.[e] ?? "";
    return m`
      <label class="color-field">
        <span>${t}</span>
        <input
          type="color"
          .value=${s}
          @input=${(i) => this._updateColor(e, i.currentTarget.value)}
        />
      </label>
    `;
  }
  _updateRootValue(e, t) {
    const s = F({
      ...this._config,
      [e]: t
    });
    this._commit(s);
  }
  _updateColor(e, t) {
    const s = F({
      ...this._config,
      colors: {
        ...this._config.colors ?? {},
        [e]: t
      }
    });
    this._commit(s);
  }
  _updatePanelValue(e, t, s) {
    const i = this._config.panels.map((o, l) => {
      if (l !== e)
        return o;
      const a = { ...o, [t]: s };
      return t === "enabled" && s === !1 && (a.power_entity = void 0, a.energy_entity = void 0, a.show_energy = !1, a.inverter_status_entity = void 0, a.error_entity = void 0), a;
    }), n = F({
      ...this._config,
      panels: i
    });
    this._commit(n);
  }
  _parseOptionalNumber(e, t, s) {
    if (e.trim() === "")
      return;
    const i = Number(e);
    if (Number.isFinite(i))
      return Math.min(Math.max(i, t), s);
  }
  _parseNumberWithClamp(e, t, s, i) {
    const n = Number(e);
    return Number.isFinite(n) ? Math.min(Math.max(n, s), i) : t;
  }
  _getAvailableSensorEntityIdsByUnit(e, t, s) {
    if (!this.hass)
      return [];
    const i = new Set(
      this._config.panels.map((l, a) => a === e ? void 0 : l[t]).filter((l) => typeof l == "string" && l.length > 0)
    ), n = this._config.panels[e]?.[t], o = [];
    for (const l of Object.values(this.hass.states)) {
      if (!l.entity_id.startsWith("sensor."))
        continue;
      const a = l.attributes?.unit_of_measurement;
      if (typeof a != "string")
        continue;
      const d = a.trim().toLowerCase();
      s(d) && (i.has(l.entity_id) && l.entity_id !== n || o.push(l.entity_id));
    }
    return typeof n == "string" && n.length > 0 && !o.includes(n) && o.push(n), o.sort((l, a) => l.localeCompare(a));
  }
  _commit(e) {
    this._config = e, Ks(this, e);
  }
  _isReorderOnlySync(e) {
    if (e.type !== pe || e.rows !== this._config.rows || e.columns !== this._config.columns || e.panels.length !== this._config.panels.length)
      return !1;
    const t = this._toPanelSignatureMap(this._config.panels), s = this._toPanelSignatureMap(e.panels);
    if (t.size !== s.size)
      return !1;
    for (const [o, l] of t.entries())
      if (s.get(o) !== l)
        return !1;
    const i = this._config.panels.map((o) => o.id).join("|"), n = e.panels.map((o) => o.id).join("|");
    return i !== n;
  }
  _toPanelSignatureMap(e) {
    const t = /* @__PURE__ */ new Map();
    for (const s of e)
      t.set(
        s.id,
        JSON.stringify({
          name: s.name ?? "",
          power_entity: s.power_entity ?? "",
          energy_entity: s.energy_entity ?? "",
          inverter_status_entity: s.inverter_status_entity ?? "",
          error_entity: s.error_entity ?? "",
          show_energy: s.show_energy ?? !1,
          enabled: s.enabled ?? !0,
          rated_power_w: s.rated_power_w ?? null,
          deviation_derate_percent: s.deviation_derate_percent ?? 100
        })
      );
    return t;
  }
};
xe.properties = {
  hass: { attribute: !1 },
  _config: { state: !0 },
  _autoFillPowerPrefix: { state: !0 },
  _autoFillEnergyPrefix: { state: !0 },
  _autoFillResultMessage: { state: !0 }
}, xe.styles = Ht`
    :host {
      display: block;
    }

    .editor {
      display: grid;
      gap: 20px;
    }

    .section {
      display: grid;
      gap: 12px;
      padding: 16px;
      border-radius: 18px;
      border: 1px solid var(--divider-color);
      background: rgba(127, 146, 171, 0.06);
    }

    .section-header {
      display: grid;
      gap: 4px;
    }

    .section-title {
      margin: 0;
      font-size: 1rem;
      font-weight: 700;
    }

    .section-copy {
      margin: 0;
      color: var(--secondary-text-color);
      font-size: 0.92rem;
    }

    .grid {
      display: grid;
      gap: 12px;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    }

    .panel-list {
      display: grid;
      gap: 12px;
    }

    details {
      border-radius: 16px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      overflow: hidden;
    }

    summary {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 14px 16px;
      cursor: pointer;
      font-weight: 600;
      list-style: none;
    }

    summary::-webkit-details-marker {
      display: none;
    }

    .panel-form {
      display: grid;
      gap: 12px;
      padding: 0 16px 16px;
    }

    .toggle {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .button-row {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .secondary-button {
      border: 1px solid var(--divider-color);
      background: rgba(127, 146, 171, 0.08);
      color: var(--primary-text-color);
      border-radius: 12px;
      min-height: 38px;
      padding: 0 12px;
      cursor: pointer;
      font: inherit;
    }

    .color-grid {
      display: grid;
      gap: 12px;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    }

    label.color-field {
      display: grid;
      gap: 8px;
      font-size: 0.88rem;
      color: var(--secondary-text-color);
    }

    input[type="color"] {
      width: 100%;
      height: 42px;
      border-radius: 12px;
      border: 1px solid var(--divider-color);
      background: transparent;
      padding: 4px;
      cursor: pointer;
    }

    input[type="range"] {
      width: 100%;
    }

    select {
      width: 100%;
      min-height: 42px;
      border-radius: 12px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color);
      color: var(--primary-text-color);
      padding: 0 12px;
      font: inherit;
    }

    .chip {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 10px;
      border-radius: 999px;
      font-size: 0.78rem;
      background: rgba(127, 146, 171, 0.12);
      color: var(--secondary-text-color);
    }
  `;
let be = xe;
customElements.get("solar-panel-visualizer-card-editor") || customElements.define(
  "solar-panel-visualizer-card-editor",
  be
);
const qs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SolarPanelVisualizerCardEditor: be
}, Symbol.toStringTag, { value: "Module" }));
window.customCards = window.customCards || [];
window.customCards.push({
  type: pe,
  name: "Solar Panel Visualizer",
  description: "Visually striking solar array card with per-panel power and deviation alerts.",
  preview: !0
});
