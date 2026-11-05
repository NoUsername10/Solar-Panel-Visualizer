import { DEFAULT_COLORS } from "./config";
import { translateByLocale } from "./i18n";
import type {
  DerivedArrayState,
  DerivedPanelState,
  HassEntity,
  HomeAssistant,
  PanelConfig,
  PanelStatus,
  PowerSample,
  SolarPanelVisualizerConfig,
} from "./types";

const UTILIZATION_MAX = 1.2;

const INVALID_STATES = new Set(["unknown", "unavailable", "none", "null", ""]);

const clamp = (value: number, min = 0, max = 1): number =>
  Math.min(Math.max(value, min), max);

const parseNumericState = (entity?: HassEntity): number | null => {
  if (!entity) {
    return null;
  }
  const raw = entity.state?.toString().trim().toLowerCase();
  if (INVALID_STATES.has(raw)) {
    return null;
  }
  const numeric = Number(entity.state);
  return Number.isFinite(numeric) ? numeric : null;
};

const normalizeStatusText = (value: unknown): string | undefined => {
  if (value === undefined || value === null) {
    return undefined;
  }
  const asString = value
    .toString()
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return asString.length > 0 ? asString : undefined;
};

const tokenizeStatus = (value: string): string[] =>
  value.toLowerCase().match(/[a-z0-9]+/g) ?? [];

const statusMatchesTerms = (statusText: string, terms: string[]): boolean => {
  const statusTokens = tokenizeStatus(statusText);
  if (statusTokens.length === 0) {
    return false;
  }

  return terms.some((term) => {
    const termTokens = tokenizeStatus(term);
    if (termTokens.length === 0 || termTokens.length > statusTokens.length) {
      return false;
    }

    for (let startIndex = 0; startIndex <= statusTokens.length - termTokens.length; startIndex += 1) {
      let matches = true;
      for (let offset = 0; offset < termTokens.length; offset += 1) {
        if (statusTokens[startIndex + offset] !== termTokens[offset]) {
          matches = false;
          break;
        }
      }
      if (matches) {
        return true;
      }
    }

    return false;
  });
};

const entityLabel = (entity?: HassEntity, fallback?: string): string | undefined => {
  const friendlyName = entity?.attributes?.friendly_name;
  if (typeof friendlyName === "string" && friendlyName.trim().length > 0) {
    return friendlyName;
  }
  return fallback;
};

const formatValue = (
  value: number | null,
  unit: string | undefined,
  decimals: number,
  unavailableText: string,
  locale = "en",
): string => {
  if (value === null) {
    return unavailableText;
  }

  const safeValue = Object.is(value, -0) ? 0 : value;

  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(safeValue);

  return unit ? `${formatted} ${unit}` : formatted;
};

const toRgb = (value: string): [number, number, number] => {
  const clean = value.replace("#", "");
  const normalized =
    clean.length === 3
      ? clean
          .split("")
          .map((part) => `${part}${part}`)
          .join("")
      : clean;

  return [
    parseInt(normalized.slice(0, 2), 16),
    parseInt(normalized.slice(2, 4), 16),
    parseInt(normalized.slice(4, 6), 16),
  ];
};

const blendColor = (start: string, end: string, ratio: number): string => {
  const normalizedRatio = clamp(ratio);
  const [sr, sg, sb] = toRgb(start);
  const [er, eg, eb] = toRgb(end);
  const blend = (from: number, to: number): number =>
    Math.round(from + (to - from) * normalizedRatio);

  return `rgb(${blend(sr, er)}, ${blend(sg, eg)}, ${blend(sb, eb)})`;
};

const mixThreeColor = (
  start: string,
  mid: string,
  end: string,
  ratio: number,
): string => {
  const normalizedRatio = clamp(ratio);
  if (normalizedRatio <= 0.5) {
    return blendColor(start, mid, normalizedRatio * 2);
  }
  return blendColor(mid, end, (normalizedRatio - 0.5) * 2);
};

const computeTrimmedUtilization = (ratios: number[]): number => {
  if (ratios.length === 0) {
    return 0;
  }
  const sorted = [...ratios].sort((a, b) => a - b);
  const keepFrom = Math.floor(sorted.length * 0.4);
  const highBand = sorted.slice(keepFrom);
  const average =
    highBand.reduce((sum, value) => sum + value, 0) / Math.max(highBand.length, 1);
  return clamp(average, 0, UTILIZATION_MAX);
};

interface BasePanelState {
  config: PanelConfig;
  slotIndex: number;
  label: string;
  power: number | null;
  energy: number | null;
  powerShareFactor: number;
  energyShareFactor: number;
  stringGroupLabel?: string;
  stringPowerSourceEntityId?: string;
  stringPowerSharePercent?: number;
  powerEntityName?: string;
  inverterStatusEntityName?: string;
  inverterStatusDisplay?: string;
  inverterFaultMatched: boolean;
  inverterWorkingMatched: boolean;
  reason: string;
  status: PanelStatus;
  enabled: boolean;
  hiddenSlot: boolean;
}

interface SharedSensorInfo {
  entityId: string;
  factor: number;
  groupLabel?: string;
}

interface SharedSensorShares {
  powerByPanelId: Map<string, SharedSensorInfo>;
  energyByPanelId: Map<string, SharedSensorInfo>;
}

const applyShareFactor = (value: number | null, factor: number): number | null =>
  value === null ? null : value * factor;

const scaleSamples = (
  samples: PowerSample[] | undefined,
  factor: number,
): PowerSample[] | undefined => {
  if (!samples || factor === 1) {
    return samples;
  }
  return samples.map((sample) => ({
    ts: sample.ts,
    value: sample.value * factor,
  }));
};

const resolvePanelRatedPower = (
  panel: PanelConfig,
  config: SolarPanelVisualizerConfig,
): number | null => {
  const rated = panel.rated_power_w ?? config.default_panel_rated_power_w ?? null;
  return rated !== null && Number.isFinite(rated) && rated > 0 ? rated : null;
};

const buildSharedEntityShares = (
  config: SolarPanelVisualizerConfig,
  key: "power_entity" | "energy_entity",
  labelPowerGroups: boolean,
): Map<string, SharedSensorInfo> => {
  if (!(config.enable_string_sensor_sharing ?? false)) {
    return new Map();
  }

  const groups = new Map<
    string,
    Array<{ panel: PanelConfig; slotIndex: number; ratedPower: number | null }>
  >();

  config.panels.forEach((panel, slotIndex) => {
    if (panel.enabled === false) {
      return;
    }
    const entityId = panel[key]?.trim();
    if (!entityId) {
      return;
    }
    const group = groups.get(entityId) ?? [];
    group.push({
      panel,
      slotIndex,
      ratedPower: resolvePanelRatedPower(panel, config),
    });
    groups.set(entityId, group);
  });

  const sortedGroups = [...groups.entries()]
    .filter(([, group]) => group.length > 1)
    .sort(([, a], [, b]) => a[0].slotIndex - b[0].slotIndex);

  const result = new Map<string, SharedSensorInfo>();
  sortedGroups.forEach(([entityId, group], index) => {
    const useEqualSplit = group.some(
      (entry) => entry.ratedPower === null || entry.ratedPower <= 0,
    );
    const totalRated = group.reduce(
      (sum, entry) => sum + (entry.ratedPower ?? 0),
      0,
    );
    const groupLabel = labelPowerGroups ? `String ${index + 1}` : undefined;
    const equalFactor = 1 / group.length;

    group.forEach((entry) => {
      const factor =
        useEqualSplit || totalRated <= 0
          ? equalFactor
          : (entry.ratedPower ?? 0) / totalRated;
      result.set(entry.panel.id, {
        entityId,
        factor,
        groupLabel,
      });
    });
  });

  return result;
};

const buildSharedSensorShares = (
  config: SolarPanelVisualizerConfig,
): SharedSensorShares => ({
  powerByPanelId: buildSharedEntityShares(config, "power_entity", true),
  energyByPanelId: buildSharedEntityShares(config, "energy_entity", false),
});

interface EligibleDeviationPanel {
  id: string;
  effectivePower: number;
  livePower: number;
  ratedPowerW: number;
  ratedForDeviationW: number;
  isDerated: boolean;
  sampleCount: number;
  firstSampleTs: number | null;
}

interface DeriveStateOptions {
  deviationEnabled?: boolean;
  historyByEntityId?: Record<string, PowerSample[]>;
  nowMs?: number;
}

const getWindowedSamples = (
  samples: PowerSample[],
  nowMs: number,
  smoothingMinutes: number,
): PowerSample[] => {
  if (smoothingMinutes <= 0) {
    return samples;
  }
  const threshold = nowMs - smoothingMinutes * 60 * 1000;
  return samples.filter((sample) => sample.ts >= threshold);
};

const getMedianIntervalMinutes = (samples: PowerSample[]): number => {
  if (samples.length < 2) {
    return 1;
  }

  const intervals: number[] = [];
  for (let index = 1; index < samples.length; index += 1) {
    const diffMinutes = (samples[index].ts - samples[index - 1].ts) / 60_000;
    if (Number.isFinite(diffMinutes) && diffMinutes > 0) {
      intervals.push(diffMinutes);
    }
  }

  if (intervals.length === 0) {
    return 1;
  }

  intervals.sort((a, b) => a - b);
  const mid = Math.floor(intervals.length / 2);
  if (intervals.length % 2 === 0) {
    return (intervals[mid - 1] + intervals[mid]) / 2;
  }
  return intervals[mid];
};

const getEffectivePower = (
  livePower: number,
  samples: PowerSample[] | undefined,
  nowMs: number,
  smoothingMinutes: number,
): { value: number; sampleCount: number; firstSampleTs: number | null } => {
  if (!samples || samples.length === 0) {
    return {
      value: livePower,
      sampleCount: 1,
      firstSampleTs: nowMs,
    };
  }

  const normalizedSamples = samples
    .filter((sample) => Number.isFinite(sample.value))
    .sort((a, b) => a.ts - b.ts);
  if (normalizedSamples.length === 0) {
    return {
      value: livePower,
      sampleCount: 1,
      firstSampleTs: nowMs,
    };
  }

  const windowed = getWindowedSamples(normalizedSamples, nowMs, smoothingMinutes);
  const medianIntervalMinutes = getMedianIntervalMinutes(normalizedSamples);
  const targetSampleCount =
    smoothingMinutes > 0
      ? Math.max(2, Math.ceil(smoothingMinutes / Math.max(medianIntervalMinutes, 0.1)) + 1)
      : 1;

  let effectiveSet = windowed.length > 0 ? windowed : normalizedSamples;
  if (
    smoothingMinutes > 0 &&
    effectiveSet.length < targetSampleCount &&
    normalizedSamples.length > effectiveSet.length
  ) {
    effectiveSet = normalizedSamples.slice(-targetSampleCount);
  }

  const average =
    effectiveSet.reduce((sum, sample) => sum + sample.value, 0) /
    Math.max(effectiveSet.length, 1);

  return {
    value: average,
    sampleCount: effectiveSet.length,
    firstSampleTs: normalizedSamples[0].ts ?? null,
  };
};

export const deriveArrayState = (
  config: SolarPanelVisualizerConfig,
  hass?: HomeAssistant,
  options?: DeriveStateOptions,
): DerivedArrayState => {
  const locale = hass?.locale?.language ?? "en";
  const t = (
    key: Parameters<typeof translateByLocale>[1],
    params?: Parameters<typeof translateByLocale>[2],
  ): string => translateByLocale(locale, key, params);
  const unavailableText = t("common.unavailable");
  const nowMs = options?.nowMs ?? Date.now();
  const colors = { ...DEFAULT_COLORS, ...(config.colors ?? {}) };
  const inverterStatusEnabled = config.enable_inverter_status ?? false;
  const inverterFaultTerms = (config.inverter_fault_terms ?? [])
    .map((term) => term.trim().toLowerCase())
    .filter((term) => term.length > 0);
  const inverterWorkingTerms = (config.inverter_working_terms ?? [])
    .map((term) => term.trim().toLowerCase())
    .filter((term) => term.length > 0);
  const productionColorIntensity = config.production_color_intensity ?? 1;
  const deviationEnabled = options?.deviationEnabled ?? true;
  const minActivePanels = config.deviation_min_active_panels ?? 3;
  const minSamples = config.deviation_min_samples ?? 3;
  const minRuntimeMinutes = config.deviation_min_runtime_minutes ?? 15;
  const smoothingMinutes = config.deviation_smoothing_minutes ?? 0;
  const dynamicFloorW = config.deviation_dynamic_floor_w ?? 20;
  const deviationThresholdPercent = config.deviation_threshold_percent ?? 15;
  const deviationAbsoluteThresholdW = config.deviation_absolute_w_threshold ?? 50;
  const historyByEntityId = options?.historyByEntityId ?? {};
  const sharedSensorShares = buildSharedSensorShares(config);

  const baseStates: BasePanelState[] = config.panels.map((panel, index) => {
    const enabled = panel.enabled ?? true;
    const label = panel.name ?? `Panel ${index + 1}`;
    const powerShare = sharedSensorShares.powerByPanelId.get(panel.id);
    const energyShare = sharedSensorShares.energyByPanelId.get(panel.id);
    const powerShareFactor = powerShare?.factor ?? 1;
    const energyShareFactor = energyShare?.factor ?? 1;
    const sharedFields = {
      powerShareFactor,
      energyShareFactor,
      stringGroupLabel: powerShare?.groupLabel,
      stringPowerSourceEntityId: powerShare?.entityId,
      stringPowerSharePercent: powerShare ? powerShare.factor * 100 : undefined,
    };
    const inverterStatusEntityId =
      panel.inverter_status_entity ?? panel.error_entity;
    const inverterStatusEntity = inverterStatusEntityId
      ? hass?.states?.[inverterStatusEntityId]
      : undefined;
    const inverterStatusDisplay = inverterStatusEntityId
      ? normalizeStatusText(inverterStatusEntity?.state) ?? unavailableText
      : undefined;
    const inverterStatusEntityName = entityLabel(
      inverterStatusEntity,
      inverterStatusEntityId,
    );
    const inverterFaultMatched =
      inverterStatusDisplay !== undefined &&
      inverterStatusDisplay !== unavailableText &&
      statusMatchesTerms(inverterStatusDisplay, inverterFaultTerms);
    const inverterWorkingMatched =
      inverterStatusDisplay !== undefined &&
      inverterStatusDisplay !== unavailableText &&
      statusMatchesTerms(inverterStatusDisplay, inverterWorkingTerms);

    if (!enabled) {
      return {
        config: panel,
        slotIndex: index,
        label,
        power: null,
        energy: null,
        ...sharedFields,
        inverterStatusEntityName,
        inverterStatusDisplay,
        inverterFaultMatched,
        inverterWorkingMatched,
        reason: t("state.reason.slot_hidden"),
        status: "disabled",
        enabled: false,
        hiddenSlot: true,
      };
    }

    if (!panel.power_entity) {
      return {
        config: panel,
        slotIndex: index,
        label,
        power: null,
        energy: null,
        ...sharedFields,
        inverterStatusEntityName,
        inverterStatusDisplay,
        inverterFaultMatched,
        inverterWorkingMatched,
        reason: t("state.reason.select_power_sensor"),
        status: "unconfigured",
        enabled: true,
        hiddenSlot: false,
      };
    }

    const powerEntity = hass?.states?.[panel.power_entity];
    const energyEntity = panel.energy_entity
      ? hass?.states?.[panel.energy_entity]
      : undefined;

    if (!powerEntity) {
      return {
        config: panel,
        slotIndex: index,
        label,
        power: null,
        energy: null,
        ...sharedFields,
        inverterStatusEntityName,
        inverterStatusDisplay,
        inverterFaultMatched,
        inverterWorkingMatched,
        reason: t("state.reason.power_entity_missing", {
          entity: panel.power_entity,
        }),
        status: "offline",
        enabled: true,
        hiddenSlot: false,
      };
    }

    if (
      inverterStatusEnabled &&
      inverterStatusDisplay &&
      inverterStatusDisplay !== unavailableText &&
      inverterFaultMatched
    ) {
      return {
        config: panel,
        slotIndex: index,
        label,
        power: applyShareFactor(parseNumericState(powerEntity), powerShareFactor),
        energy: applyShareFactor(parseNumericState(energyEntity), energyShareFactor),
        ...sharedFields,
        powerEntityName: entityLabel(powerEntity, panel.power_entity),
        inverterStatusEntityName,
        inverterStatusDisplay,
        inverterFaultMatched,
        inverterWorkingMatched,
        reason: t("state.reason.inverter_fault_match", {
          status: inverterStatusDisplay,
        }),
        status: "error",
        enabled: true,
        hiddenSlot: false,
      };
    }

    if (
      inverterStatusEnabled &&
      inverterStatusDisplay &&
      inverterStatusDisplay !== unavailableText &&
      inverterWorkingTerms.length > 0 &&
      !inverterWorkingMatched
    ) {
      return {
        config: panel,
        slotIndex: index,
        label,
        power: applyShareFactor(parseNumericState(powerEntity), powerShareFactor),
        energy: applyShareFactor(parseNumericState(energyEntity), energyShareFactor),
        ...sharedFields,
        powerEntityName: entityLabel(powerEntity, panel.power_entity),
        inverterStatusEntityName,
        inverterStatusDisplay,
        inverterFaultMatched,
        inverterWorkingMatched,
        reason: t("state.reason.inverter_working_mismatch", {
          status: inverterStatusDisplay,
        }),
        status: "inverter",
        enabled: true,
        hiddenSlot: false,
      };
    }

    const power = applyShareFactor(parseNumericState(powerEntity), powerShareFactor);
    const energy = applyShareFactor(parseNumericState(energyEntity), energyShareFactor);
    if (power === null) {
      return {
        config: panel,
        slotIndex: index,
        label,
        power: null,
        energy,
        ...sharedFields,
        powerEntityName: entityLabel(powerEntity, panel.power_entity),
        inverterStatusEntityName,
        inverterStatusDisplay,
        inverterFaultMatched,
        inverterWorkingMatched,
        reason: t("state.reason.power_entity_unavailable", {
          entity: panel.power_entity,
        }),
        status: "offline",
        enabled: true,
        hiddenSlot: false,
      };
    }

    return {
      config: panel,
      slotIndex: index,
      label,
      power,
      energy,
      ...sharedFields,
      powerEntityName: entityLabel(powerEntity, panel.power_entity),
      inverterStatusEntityName,
      inverterStatusDisplay,
      inverterFaultMatched,
      inverterWorkingMatched,
      reason: t("state.reason.producing_expected"),
      status: "normal",
      enabled: true,
      hiddenSlot: false,
    };
  });

  const productionCandidates = baseStates.filter(
    (panel) => panel.status === "normal" && panel.power !== null,
  );
  const activePowers = productionCandidates.map((panel) => panel.power ?? 0);
  const maxPower = activePowers.length > 0 ? Math.max(...activePowers) : 0;

  let deviationCount = 0;
  let inverterCount = 0;
  let errorCount = 0;
  let offlineCount = 0;
  let normalCount = 0;
  let unconfiguredCount = 0;
  let disabledCount = 0;
  let deviationSuppressedReason: string | undefined;
  let deviationReady = false;

  const eligibleDeviationPanels: EligibleDeviationPanel[] = baseStates.flatMap((panel) => {
    if (panel.status !== "normal" || panel.power === null) {
      return [];
    }
    const ratedPowerW =
      panel.config.rated_power_w ?? config.default_panel_rated_power_w ?? null;
    if (ratedPowerW === null || ratedPowerW <= 0 || !panel.config.power_entity) {
      return [];
    }
    const deratePercent = Math.min(
      Math.max(panel.config.deviation_derate_percent ?? 100, 1),
      100,
    );
    const ratedForDeviationW = ratedPowerW * (deratePercent / 100);
    if (ratedForDeviationW <= 0) {
      return [];
    }

    const effective = getEffectivePower(
      panel.power,
      scaleSamples(
        historyByEntityId[panel.config.power_entity],
        panel.powerShareFactor,
      ),
      nowMs,
      smoothingMinutes,
    );

    return [
      {
        id: panel.config.id,
        effectivePower: effective.value,
        livePower: panel.power,
        ratedPowerW,
        ratedForDeviationW,
        isDerated: deratePercent < 100,
        sampleCount: effective.sampleCount,
        firstSampleTs: effective.firstSampleTs,
      },
    ];
  });

  const baselinePanels = eligibleDeviationPanels.filter((panel) => !panel.isDerated);

  const minSampleCount =
    baselinePanels.length > 0
      ? Math.min(...baselinePanels.map((panel) => panel.sampleCount))
      : 0;
  const minRuntimeAgeMinutes =
    baselinePanels.length > 0
      ? Math.min(
          ...baselinePanels.map((panel) =>
            panel.firstSampleTs === null
              ? 0
              : (nowMs - panel.firstSampleTs) / 60000,
          ),
        )
      : 0;

  if (!deviationEnabled) {
    deviationSuppressedReason = t("state.reason.array_check_disabled");
  } else if (baselinePanels.length < minActivePanels) {
    deviationSuppressedReason = t("state.reason.need_non_derated_panels", {
      count: minActivePanels,
    });
  } else if (minSampleCount < minSamples) {
    deviationSuppressedReason = t("state.reason.collecting_samples", {
      current: minSampleCount,
      required: minSamples,
    });
  } else if (minRuntimeAgeMinutes < minRuntimeMinutes) {
    deviationSuppressedReason = t("state.reason.warmup_progress", {
      current: Math.floor(minRuntimeAgeMinutes),
      required: minRuntimeMinutes,
    });
  } else {
    deviationReady = true;
  }

  const utilizationRatios = baselinePanels.map((panel) =>
    clamp(panel.effectivePower / panel.ratedForDeviationW, 0, UTILIZATION_MAX),
  );
  const arrayUtilizationFactor = computeTrimmedUtilization(utilizationRatios);

  if (deviationReady) {
    const representativeTarget = Math.max(
      ...baselinePanels.map(
        (panel) => panel.ratedForDeviationW * arrayUtilizationFactor,
      ),
      0,
    );
    if (representativeTarget < dynamicFloorW) {
      deviationReady = false;
      deviationSuppressedReason = t("state.reason.low_light_pause", {
        floor: dynamicFloorW.toFixed(0),
      });
    }
  }

  const panels: DerivedPanelState[] = baseStates.map((panel) => {
    const powerUnit =
      (panel.config.power_entity
        ? (hass?.states?.[panel.config.power_entity]?.attributes
            ?.unit_of_measurement as string | undefined)
        : undefined) ??
      t("state.power.default_unit");

    const energyUnit =
      (panel.config.energy_entity
        ? (hass?.states?.[panel.config.energy_entity]?.attributes
            ?.unit_of_measurement as string | undefined)
        : undefined);
    const hasEnergySensor = Boolean(panel.config.energy_entity);
    const showPanelEnergy = panel.config.show_energy ?? false;
    const stringPowerSourceName = panel.stringPowerSourceEntityId
      ? entityLabel(
          hass?.states?.[panel.stringPowerSourceEntityId],
          panel.stringPowerSourceEntityId,
        )
      : undefined;

    let status = panel.status;
    let deviationPercent: number | null = null;
    const ratedPowerW =
      panel.config.rated_power_w ?? config.default_panel_rated_power_w ?? null;
    const performancePercent =
      ratedPowerW !== null && panel.power !== null && ratedPowerW > 0
        ? clamp((panel.power / ratedPowerW) * 100, 0, 999)
        : null;

    if (status === "normal" && ratedPowerW === null) {
      panel.reason = t("state.reason.rated_not_configured");
    }

    if (deviationReady && status === "normal" && ratedPowerW !== null && panel.power !== null) {
      const matching = eligibleDeviationPanels.find(
        (eligiblePanel) => eligiblePanel.id === panel.config.id,
      );
      if (matching) {
        const targetPower = matching.ratedForDeviationW * arrayUtilizationFactor;
        const shortfallW = Math.max(targetPower - matching.effectivePower, 0);
        const shortfallPercent =
          targetPower > 0 ? (shortfallW / targetPower) * 100 : 0;
        if (
          shortfallPercent >= deviationThresholdPercent &&
          shortfallW >= deviationAbsoluteThresholdW
        ) {
          status = "deviation";
          deviationPercent = clamp(shortfallPercent, 0, 100);
          panel.reason = t("state.reason.output_below_target", {
            percent: deviationPercent.toFixed(0),
            shortfall: shortfallW.toFixed(0),
          });
        } else {
          panel.reason = t("state.reason.producing_adjusted");
        }
      }
    } else if (status === "normal" && deviationSuppressedReason) {
      panel.reason = deviationSuppressedReason;
    }

    if (status === "error") {
      errorCount += 1;
    }

    if (status === "inverter") {
      inverterCount += 1;
    }

    if (status === "deviation") {
      deviationCount += 1;
    }

    if (status === "offline") {
      offlineCount += 1;
    }

    if (status === "normal") {
      normalCount += 1;
    }

    if (status === "unconfigured") {
      unconfiguredCount += 1;
    }

    if (status === "disabled") {
      disabledCount += 1;
    }

    const ratedScale =
      ratedPowerW !== null && ratedPowerW > 0 && panel.power !== null
        ? panel.power / ratedPowerW
        : null;
    const fallbackScale =
      panel.power !== null && maxPower > 0 ? panel.power / maxPower : 0;
    const productionRatio = clamp(ratedScale ?? fallbackScale, 0, 1);
    const normalizedStrength = clamp((productionColorIntensity - 0.2) / 1.4, 0, 1);
    const productionIntensity = clamp(
      (0.1 + normalizedStrength * 0.9) * (0.15 + productionRatio * 0.85),
      0.06,
      1,
    );
    const intensity =
      status === "deviation" || status === "error" || status === "inverter"
        ? 1
        : productionIntensity;
    const isZeroProduction =
      status === "normal" && panel.power !== null && panel.power <= 0;
    const accentColor =
      status === "error"
        ? colors.error
        : status === "inverter"
        ? colors.error
        : isZeroProduction
          ? colors.unavailable
        : status === "offline" || status === "unconfigured" || status === "disabled"
          ? colors.unavailable
          : status === "deviation"
            ? colors.deviation
            : mixThreeColor(
                colors.production_start,
                colors.production_mid,
                colors.production_end,
                productionRatio,
              );

    return {
      id: panel.config.id,
      slotIndex: panel.slotIndex,
      label: panel.label,
      status,
      power: panel.power,
      powerDisplay:
        status === "disabled"
          ? t("state.status_display.disabled")
          : status === "unconfigured"
            ? t("state.status_display.not_configured")
            : formatValue(
                panel.power,
                powerUnit,
                config.power_decimals ?? 0,
                unavailableText,
                locale,
              ),
      energy: panel.energy,
      energyDisplay:
        panel.hiddenSlot
          ? undefined
          : !hasEnergySensor || !showPanelEnergy
            ? undefined
          : panel.energy !== null
          ? formatValue(
              panel.energy,
              energyUnit ?? t("state.energy.default_unit"),
              config.energy_decimals ?? 2,
              unavailableText,
              locale,
            )
          : unavailableText,
      powerEntityName: panel.powerEntityName,
      inverterStatusEntityName: panel.inverterStatusEntityName,
      inverterStatusDisplay: panel.inverterStatusDisplay,
      inverterFaultMatched: panel.inverterFaultMatched,
      inverterWorkingMatched: panel.inverterWorkingMatched,
      deviationPercent,
      reason: panel.reason,
      accentColor,
      intensity,
      enabled: panel.enabled,
      hiddenSlot: panel.hiddenSlot,
      ratedPowerW,
      performancePercent,
      powerShareFactor: panel.powerShareFactor,
      energyShareFactor: panel.energyShareFactor,
      stringGroupLabel: panel.stringGroupLabel,
      stringPowerSourceName,
      stringPowerSharePercent: panel.stringPowerSharePercent,
    };
  });

  const totalPower = panels.reduce((sum, panel) => sum + (panel.power ?? 0), 0);
  const energyValues = panels
    .map((panel) => panel.energy)
    .filter((value): value is number => value !== null);
  const totalEnergy =
    energyValues.length > 0
      ? energyValues.reduce((sum, value) => sum + value, 0)
      : null;

  return {
    panels,
    totalPower,
    totalEnergy,
    maxPower,
    deviationCount,
    inverterCount,
    errorCount,
    offlineCount,
    normalCount,
    unconfiguredCount,
    disabledCount,
    deviationReady,
    deviationSuppressedReason,
  };
};
