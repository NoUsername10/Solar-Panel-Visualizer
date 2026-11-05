import type { HassEntity, PanelAdvancedMetrics, PanelConfig } from "./types";
import { naturalCompare } from "./natural-sort";

export interface SensorCandidate {
  entityId: string;
  friendlyName?: string;
}

export interface AutoPopulateResult {
  panels: PanelConfig[];
  matched: number;
  filled: number;
  skipped: number;
}

export interface AdvancedTelemetryAutoFillResult {
  panels: PanelConfig[];
  filled: number;
  skippedPanels: number;
}

export interface InverterStatusAutoFillResult {
  panels: PanelConfig[];
  filled: number;
  skippedPanels: number;
}

type FriendlyNameResolver = (entityId: string | undefined) => string | undefined;
export type AutoPopulateSortMode = "auto" | "entityId" | "friendlyName" | "grouped";

interface AutoPopulateEntityOptions {
  repeatEachCandidate?: number;
}

interface AutoPopulateEnergyOptions {
  shareSingleGroupEnergy?: boolean;
}
type SensorTextSortMode = "entityId" | "friendlyName";
type AdvancedMetricKey = keyof PanelAdvancedMetrics;

interface GroupSortPlan {
  sortBy: SensorTextSortMode;
  tokenIndex: number;
}

interface AdvancedTelemetryCandidate {
  entityId: string;
  entity: HassEntity;
  tokens: string[];
}

const SORT_TOKEN_SEPARATOR = /[._\-\s]+/;
const NUMERIC_TOKEN_REGEX = /^\d+$/;
const SERIAL_LIKE_TOKEN_REGEX = /^(?=.*[a-z])(?=.*\d)[a-z0-9]{6,}$/i;
const NUMERIC_PREFIX_SERIAL_TOKEN_REGEX = /^(?=.*[a-z])\d{3,}[a-z0-9]*$/i;
const SHORT_LOCAL_CHANNEL_TOKEN_REGEX = /^[a-z]+\d{1,2}$/i;
const GENERIC_TELEMETRY_TOKENS = new Set([
  "sensor",
  "power",
  "current",
  "voltage",
  "temperature",
  "temp",
  "device",
  "serial",
  "inverter",
  "panel",
  "map",
  "ac",
  "dc",
  "pv",
]);
const INVERTER_STATUS_TOKENS = new Set([
  "status",
  "state",
  "mode",
  "operation",
  "operating",
  "work",
  "working",
  "run",
  "running",
  "fault",
  "alarm",
  "error",
]);
const STATUS_ENTITY_DOMAINS = new Set(["sensor", "binary_sensor"]);
const LESS_SPECIFIC_STATUS_TOKENS = new Set([
  "battery",
  "bms",
  "cloud",
  "connection",
  "communication",
  "firmware",
  "grid",
  "meter",
  "network",
  "online",
  "update",
  "wifi",
]);

const getCandidateSortText = (
  candidate: SensorCandidate,
  sortBy: SensorTextSortMode,
): string => {
  if (sortBy === "friendlyName") {
    const friendlyName = candidate.friendlyName?.trim();
    if (friendlyName) {
      return friendlyName;
    }
  }

  return candidate.entityId;
};

const tokenizeSortText = (value: string): string[] =>
  value
    .split(SORT_TOKEN_SEPARATOR)
    .map((token) => token.trim())
    .filter((token) => token.length > 0);

const getGroupSortPlan = (
  candidates: SensorCandidate[],
  sortBy: SensorTextSortMode,
  options: { allowNumericGroup?: boolean; allowSingleGroup?: boolean; minCandidates?: number } = {},
): GroupSortPlan | null => {
  if (candidates.length < (options.minCandidates ?? 4)) {
    return null;
  }

  const tokenRows = candidates.map((candidate) =>
    tokenizeSortText(getCandidateSortText(candidate, sortBy)),
  );
  const minTokenCount = Math.min(...tokenRows.map((row) => row.length));
  if (minTokenCount < 3) {
    return null;
  }

  for (let index = minTokenCount - 1; index > 0; index -= 1) {
    const values = tokenRows.map((row) => row[index].toLowerCase());
    const distinctValues = new Set(values);
    if (
      (!options.allowSingleGroup && distinctValues.size <= 1) ||
      distinctValues.size >= candidates.length
    ) {
      continue;
    }
    if ([...distinctValues].every((value) => GENERIC_TELEMETRY_TOKENS.has(value))) {
      continue;
    }
    if (
      !options.allowNumericGroup &&
      [...distinctValues].every((value) => NUMERIC_TOKEN_REGEX.test(value))
    ) {
      continue;
    }

    const valueCounts = new Map<string, number>();
    for (const value of values) {
      valueCounts.set(value, (valueCounts.get(value) ?? 0) + 1);
    }
    if (![...valueCounts.values()].some((count) => count > 1)) {
      continue;
    }

    const previousValues = new Set(
      tokenRows.map((row) => row[index - 1].toLowerCase()),
    );
    if (previousValues.size !== 1) {
      continue;
    }

    return { sortBy, tokenIndex: index };
  }

  return null;
};

const isTrailingSerialGroupToken = (token: string): boolean => {
  const normalized = token.toLowerCase();
  if (
    GENERIC_TELEMETRY_TOKENS.has(normalized) ||
    NUMERIC_TOKEN_REGEX.test(normalized) ||
    SHORT_LOCAL_CHANNEL_TOKEN_REGEX.test(normalized)
  ) {
    return false;
  }

  return (
    SERIAL_LIKE_TOKEN_REGEX.test(normalized) ||
    NUMERIC_PREFIX_SERIAL_TOKEN_REGEX.test(normalized)
  );
};

const getTrailingSerialGroupSortPlan = (
  candidates: SensorCandidate[],
  sortBy: SensorTextSortMode,
  options: { allowSingleGroup?: boolean; minCandidates?: number } = {},
): GroupSortPlan | null => {
  if (candidates.length < (options.minCandidates ?? 4)) {
    return null;
  }

  const tokenRows = candidates.map((candidate) =>
    tokenizeSortText(getCandidateSortText(candidate, sortBy)),
  );
  const minTokenCount = Math.min(...tokenRows.map((row) => row.length));
  if (minTokenCount < 3) {
    return null;
  }

  const tokenIndex = minTokenCount - 1;
  const values = tokenRows.map((row) => row[tokenIndex].toLowerCase());
  const distinctValues = new Set(values);
  if (
    (!options.allowSingleGroup && distinctValues.size <= 1) ||
    distinctValues.size >= candidates.length
  ) {
    return null;
  }
  if (![...distinctValues].every(isTrailingSerialGroupToken)) {
    return null;
  }

  const valueCounts = new Map<string, number>();
  for (const value of values) {
    valueCounts.set(value, (valueCounts.get(value) ?? 0) + 1);
  }
  if (![...valueCounts.values()].some((count) => count > 1)) {
    return null;
  }

  return { sortBy, tokenIndex };
};

const getBestGroupSortPlan = (
  candidates: SensorCandidate[],
  options: { allowNumericGroup?: boolean; allowSingleGroup?: boolean; minCandidates?: number } = {},
): GroupSortPlan | null => {
  const sortSources: SensorTextSortMode[] = ["entityId", "friendlyName"];
  for (const sortBy of sortSources) {
    const trailingSerialPlan = getTrailingSerialGroupSortPlan(candidates, sortBy, options);
    if (trailingSerialPlan) {
      return trailingSerialPlan;
    }
    const plan = getGroupSortPlan(candidates, sortBy, options);
    if (plan) {
      return plan;
    }
  }

  return null;
};

const sortByText = (
  candidates: SensorCandidate[],
  sortBy: SensorTextSortMode,
): SensorCandidate[] =>
  [...candidates].sort((a, b) => {
    const primaryResult = naturalCompare(
      getCandidateSortText(a, sortBy),
      getCandidateSortText(b, sortBy),
    );
    if (primaryResult !== 0) {
      return primaryResult;
    }

    return naturalCompare(a.entityId, b.entityId);
  });

const sortByGroupedToken = (
  candidates: SensorCandidate[],
  fallbackSortBy: SensorTextSortMode,
  options: { allowNumericGroup?: boolean } = {},
): SensorCandidate[] => {
  const plan = getBestGroupSortPlan(candidates, options);
  if (!plan) {
    return sortByText(candidates, fallbackSortBy);
  }

  return [...candidates].sort((a, b) => {
    const aTokens = tokenizeSortText(getCandidateSortText(a, plan.sortBy));
    const bTokens = tokenizeSortText(getCandidateSortText(b, plan.sortBy));
    const aGroup = aTokens[plan.tokenIndex] ?? "";
    const bGroup = bTokens[plan.tokenIndex] ?? "";

    const groupResult = naturalCompare(aGroup, bGroup);
    if (groupResult !== 0) {
      return groupResult;
    }

    const aLocal = aTokens
      .filter((_, index) => index !== plan.tokenIndex)
      .join(" ");
    const bLocal = bTokens
      .filter((_, index) => index !== plan.tokenIndex)
      .join(" ");
    const localResult = naturalCompare(aLocal, bLocal);
    if (localResult !== 0) {
      return localResult;
    }

    return naturalCompare(a.entityId, b.entityId);
  });
};

export const sortSensorsForAutoPopulate = (
  candidates: SensorCandidate[],
  sortMode: AutoPopulateSortMode = "auto",
  defaultSortBy: SensorTextSortMode = "entityId",
): SensorCandidate[] => {
  const sorted =
    sortMode === "grouped"
      ? sortByGroupedToken(candidates, defaultSortBy, { allowNumericGroup: true })
      : sortMode === "auto" && getBestGroupSortPlan(candidates)
        ? sortByGroupedToken(candidates, defaultSortBy)
      : sortByText(
          candidates,
          sortMode === "friendlyName" || sortMode === "entityId"
            ? sortMode
            : defaultSortBy,
        );

  return sorted
    .map((candidate) => ({
      entityId: candidate.entityId,
      friendlyName: candidate.friendlyName,
    }));
};

const collectSensorsByPrefix = (
  states: Record<string, HassEntity>,
  prefix: string,
  unitMatcher: (normalizedUnit: string, entity: HassEntity) => boolean,
  sortMode: AutoPopulateSortMode,
): SensorCandidate[] => {
  const normalizedPrefix = prefix.trim().replace(/\*+$/, "");
  if (normalizedPrefix.length === 0) {
    return [];
  }
  const searchByEntityId = normalizedPrefix.startsWith("sensor.");
  const normalizedFriendlySearch = normalizedPrefix.toLowerCase();

  const candidates: SensorCandidate[] = [];

  for (const [entityId, entity] of Object.entries(states)) {
    if (!entityId.startsWith("sensor.")) {
      continue;
    }

    const unitRaw = entity.attributes?.unit_of_measurement;
    const normalizedUnit = typeof unitRaw === "string" ? unitRaw.trim().toLowerCase() : "";
    if (!unitMatcher(normalizedUnit, entity)) {
      continue;
    }

    const friendlyName =
      typeof entity.attributes?.friendly_name === "string"
        ? entity.attributes.friendly_name
        : undefined;
    const normalizedFriendlyName = friendlyName?.trim().toLowerCase();
    const matchesSearch = searchByEntityId
      ? entityId.startsWith(normalizedPrefix)
      : Boolean(normalizedFriendlyName?.includes(normalizedFriendlySearch));
    if (!matchesSearch) {
      continue;
    }

    candidates.push({
      entityId,
      friendlyName,
    });
  }

  return sortSensorsForAutoPopulate(
    candidates,
    sortMode,
    searchByEntityId ? "entityId" : "friendlyName",
  );
};

export const autoPopulatePanelEntities = (
  panels: PanelConfig[],
  states: Record<string, HassEntity>,
  key: "power_entity" | "energy_entity",
  prefix: string,
  unitMatcher: (normalizedUnit: string, entity: HassEntity) => boolean,
  sortMode: AutoPopulateSortMode = "auto",
  options: AutoPopulateEntityOptions = {},
): AutoPopulateResult => {
  const normalizedPrefix = prefix.trim().replace(/\*+$/, "");
  if (normalizedPrefix.length === 0) {
    return {
      panels: [...panels],
      matched: 0,
      filled: 0,
      skipped: panels.length,
    };
  }

  const candidates = collectSensorsByPrefix(
    states,
    normalizedPrefix,
    unitMatcher,
    sortMode,
  );
  const usedByExisting = new Set(
    panels
      .map((panel) => panel[key])
      .filter((entityId): entityId is string => typeof entityId === "string" && entityId.length > 0),
  );

  const repeatEachCandidate = Math.max(
    1,
    Math.floor(options.repeatEachCandidate ?? 1),
  );
  const availableEntityIds = candidates
    .flatMap((candidate) =>
      Array.from({ length: repeatEachCandidate }, () => candidate.entityId),
    )
    .filter((entityId) => !usedByExisting.has(entityId));

  let candidateIndex = 0;
  let filled = 0;
  let skipped = 0;

  const nextPanels = panels.map((panel) => {
    const nextPanel = { ...panel };
    if (nextPanel.enabled === false) {
      skipped += 1;
      return nextPanel;
    }
    const existing = nextPanel[key];
    if (typeof existing === "string" && existing.trim().length > 0) {
      skipped += 1;
      return nextPanel;
    }

    const entityId = availableEntityIds[candidateIndex];
    if (!entityId) {
      skipped += 1;
      return nextPanel;
    }

    nextPanel[key] = entityId;
    candidateIndex += 1;
    filled += 1;
    return nextPanel;
  });

  return {
    panels: nextPanels,
    matched: candidates.length,
    filled,
    skipped,
  };
};

export const autoPopulateEnergyEntitiesByPowerAnchor = (
  panels: PanelConfig[],
  states: Record<string, HassEntity>,
  prefix: string,
  unitMatcher: (normalizedUnit: string, entity: HassEntity) => boolean,
  sortMode: AutoPopulateSortMode = "auto",
  options: AutoPopulateEnergyOptions = {},
): AutoPopulateResult => {
  const normalizedPrefix = prefix.trim().replace(/\*+$/, "");
  if (normalizedPrefix.length === 0) {
    return {
      panels: [...panels],
      matched: 0,
      filled: 0,
      skipped: panels.length,
    };
  }

  const candidates = collectSensorsByPrefix(
    states,
    normalizedPrefix,
    unitMatcher,
    sortMode,
  );
  const powerAnchorCandidates = panels
    .filter((panel) => panel.power_entity?.trim())
    .map((panel) => {
      const powerEntity = panel.power_entity ? states[panel.power_entity] : undefined;
      return {
        entityId: panel.power_entity ?? "",
        friendlyName: getEntityFriendlyName(powerEntity),
      };
    });
  const groupPlan = getBestGroupSortPlan(powerAnchorCandidates, {
    allowNumericGroup: true,
    allowSingleGroup: true,
    minCandidates: 2,
  });

  if (!groupPlan) {
    return autoPopulatePanelEntities(
      panels,
      states,
      "energy_entity",
      normalizedPrefix,
      unitMatcher,
      sortMode,
    );
  }

  let filled = 0;
  let skipped = 0;
  const usedSharedEnergyGroups = new Set<string>();
  const energyCandidates: AdvancedTelemetryCandidate[] = candidates.flatMap((candidate) => {
    const entity = states[candidate.entityId];
    if (!entity) {
      return [];
    }
    return [{
      entityId: candidate.entityId,
      entity,
      tokens: getEntityTokens(candidate.entityId, entity),
    }];
  });

  const nextPanels = panels.map((panel) => {
    const nextPanel = { ...panel };
    if (nextPanel.enabled === false) {
      skipped += 1;
      return nextPanel;
    }
    const groupValue = getAnchorGroupValue(nextPanel, states, groupPlan);
    const existing = nextPanel.energy_entity;
    if (typeof existing === "string" && existing.trim().length > 0) {
      if (groupValue && !options.shareSingleGroupEnergy) {
        usedSharedEnergyGroups.add(groupValue);
      }
      skipped += 1;
      return nextPanel;
    }

    const localTokens = getDistinctiveAnchorLocalTokens(
      nextPanel,
      panels,
      states,
      groupPlan,
      groupValue,
    );
    const sameGroup = findSameGroupCandidates(energyCandidates, groupValue);

    if (sameGroup.length === 1) {
      const groupKey = groupValue ?? sameGroup[0].entityId;
      if (!options.shareSingleGroupEnergy && usedSharedEnergyGroups.has(groupKey)) {
        skipped += 1;
        return nextPanel;
      }
      nextPanel.energy_entity = sameGroup[0].entityId;
      if (!options.shareSingleGroupEnergy) {
        usedSharedEnergyGroups.add(groupKey);
      }
      filled += 1;
      return nextPanel;
    }

    const selected = pickUniqueCandidate(sameGroup, (item) => {
      const usefulTokens = getUsefulTokens(item.tokens, groupValue ?? undefined);
      return countSharedTokens(localTokens, usefulTokens);
    });
    if (!selected) {
      skipped += 1;
      return nextPanel;
    }

    nextPanel.energy_entity = selected.entityId;
    filled += 1;
    return nextPanel;
  });

  return {
    panels: nextPanels,
    matched: candidates.length,
    filled,
    skipped,
  };
};

const normalizeUnit = (entity: HassEntity): string =>
  typeof entity.attributes?.unit_of_measurement === "string"
    ? entity.attributes.unit_of_measurement.trim().toLowerCase()
    : "";

const normalizeDeviceClass = (entity: HassEntity): string =>
  typeof entity.attributes?.device_class === "string"
    ? entity.attributes.device_class.trim().toLowerCase()
    : "";

const entityMatchesPower = (entity: HassEntity): boolean =>
  ["w", "kw"].includes(normalizeUnit(entity)) ||
  normalizeDeviceClass(entity) === "power";

const entityMatchesVoltage = (entity: HassEntity): boolean =>
  ["v", "kv", "mv"].includes(normalizeUnit(entity)) ||
  normalizeDeviceClass(entity) === "voltage";

const entityMatchesCurrent = (entity: HassEntity): boolean =>
  ["a", "ma"].includes(normalizeUnit(entity)) ||
  normalizeDeviceClass(entity) === "current";

const entityMatchesTemperature = (entity: HassEntity): boolean =>
  ["\u00b0c", "\u00b0f", "\u2103", "\u2109", "c", "f"].includes(normalizeUnit(entity)) ||
  normalizeDeviceClass(entity) === "temperature";

const getEntityFriendlyName = (entity: HassEntity | undefined): string | undefined => {
  const friendlyName = entity?.attributes?.friendly_name;
  if (typeof friendlyName !== "string") {
    return undefined;
  }
  const normalized = friendlyName.trim();
  return normalized.length > 0 ? normalized : undefined;
};

const getStateEntityId = (entityId: string, entity: HassEntity): string =>
  typeof entity.entity_id === "string" && entity.entity_id.trim().length > 0
    ? entity.entity_id
    : entityId;

const getEntityDomain = (entityId: string): string => entityId.split(".")[0] ?? "";

const getEntityTokens = (entityId: string, entity?: HassEntity): string[] =>
  tokenizeSortText(`${entityId} ${getEntityFriendlyName(entity) ?? ""}`)
    .map((token) => token.toLowerCase());

const getUsefulTokens = (tokens: string[], groupValue?: string): string[] =>
  tokens.filter((token) => {
    if (groupValue && token === groupValue.toLowerCase()) {
      return false;
    }
    if (GENERIC_TELEMETRY_TOKENS.has(token)) {
      return false;
    }
    return token.length > 0;
  });

const countSharedTokens = (left: string[], right: string[]): number => {
  const rightSet = new Set(right);
  return left.filter((token) => rightSet.has(token)).length;
};

const countTokens = (tokens: string[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const token of tokens) {
    counts.set(token, (counts.get(token) ?? 0) + 1);
  }
  return counts;
};

const buildCommonAnchorLocalTokenCounts = (
  panels: PanelConfig[],
  states: Record<string, HassEntity>,
  groupPlan: GroupSortPlan | null,
  groupValue: string | null,
): Map<string, number> => {
  const anchorPanels = panels.filter((panel) => {
    if (panel.enabled === false || !panel.power_entity?.trim()) {
      return false;
    }
    if (!groupPlan || !groupValue) {
      return true;
    }
    return getAnchorGroupValue(panel, states, groupPlan) === groupValue;
  });
  if (anchorPanels.length === 0) {
    return new Map();
  }

  const commonCounts = countTokens(
    getAnchorLocalTokens(anchorPanels[0], states, groupValue),
  );
  for (const panel of anchorPanels.slice(1)) {
    const panelCounts = countTokens(getAnchorLocalTokens(panel, states, groupValue));
    for (const [token, count] of [...commonCounts.entries()]) {
      const nextCount = Math.min(count, panelCounts.get(token) ?? 0);
      if (nextCount <= 0) {
        commonCounts.delete(token);
      } else {
        commonCounts.set(token, nextCount);
      }
    }
  }

  return commonCounts;
};

const hasAnyToken = (candidate: AdvancedTelemetryCandidate, tokens: string[]): boolean => {
  const tokenSet = new Set(candidate.tokens);
  return tokens.some((token) => tokenSet.has(token));
};

const buildAdvancedTelemetryCandidates = (
  states: Record<string, HassEntity>,
  matcher: (entity: HassEntity) => boolean,
): AdvancedTelemetryCandidate[] =>
  Object.entries(states)
    .map(([entityId, entity]) => ({
      entityId: getStateEntityId(entityId, entity),
      entity,
    }))
    .filter(({ entityId, entity }) => entityId.startsWith("sensor.") && matcher(entity))
    .map(({ entityId, entity }) => ({
      entityId,
      entity,
      tokens: getEntityTokens(entityId, entity),
    }))
    .sort((a, b) => naturalCompare(a.entityId, b.entityId));

const candidateHasStatusToken = (candidate: AdvancedTelemetryCandidate): boolean =>
  candidate.tokens.some((token) => INVERTER_STATUS_TOKENS.has(token));

const buildInverterStatusCandidates = (
  states: Record<string, HassEntity>,
  searchText = "",
): AdvancedTelemetryCandidate[] =>
  Object.entries(states)
    .map(([entityId, entity]) => {
      const resolvedEntityId = getStateEntityId(entityId, entity);
      return {
        entityId: resolvedEntityId,
        entity,
        tokens: getEntityTokens(resolvedEntityId, entity),
      };
    })
    .filter((candidate) => STATUS_ENTITY_DOMAINS.has(getEntityDomain(candidate.entityId)))
    .filter(candidateHasStatusToken)
    .filter((candidate) => {
      const normalizedSearch = searchText.trim().replace(/\*+$/, "").toLowerCase();
      if (!normalizedSearch) {
        return true;
      }
      const searchByEntityId =
        normalizedSearch.startsWith("sensor.") ||
        normalizedSearch.startsWith("binary_sensor.");
      if (searchByEntityId) {
        return candidate.entityId.toLowerCase().startsWith(normalizedSearch);
      }
      return Boolean(
        getEntityFriendlyName(candidate.entity)
          ?.trim()
          .toLowerCase()
          .includes(normalizedSearch),
      );
    })
    .sort((a, b) => naturalCompare(a.entityId, b.entityId));

const pickUniqueCandidate = (
  candidates: AdvancedTelemetryCandidate[],
  scoreCandidate: (candidate: AdvancedTelemetryCandidate) => number,
): AdvancedTelemetryCandidate | null => {
  const scored = candidates
    .map((candidate) => ({
      candidate,
      score: scoreCandidate(candidate),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || naturalCompare(a.candidate.entityId, b.candidate.entityId));

  if (scored.length === 0) {
    return null;
  }
  if (scored.length > 1 && scored[0].score === scored[1].score) {
    return null;
  }
  return scored[0].candidate;
};

const findSameGroupCandidates = (
  candidates: AdvancedTelemetryCandidate[],
  groupValue: string | null,
): AdvancedTelemetryCandidate[] => {
  if (!groupValue) {
    return [];
  }
  const normalizedGroup = groupValue.toLowerCase();
  return candidates.filter((candidate) => candidate.tokens.includes(normalizedGroup));
};

const findSameGroupCandidatesByValues = (
  candidates: AdvancedTelemetryCandidate[],
  groupValues: string[],
): AdvancedTelemetryCandidate[] => {
  const normalizedGroups = new Set(
    groupValues.map((groupValue) => groupValue.toLowerCase()),
  );
  if (normalizedGroups.size === 0) {
    return [];
  }
  return candidates.filter((candidate) =>
    candidate.tokens.some((token) => normalizedGroups.has(token)),
  );
};

const getAnchorGroupValue = (
  panel: PanelConfig,
  states: Record<string, HassEntity>,
  groupPlan: GroupSortPlan | null,
): string | null => {
  if (!groupPlan || !panel.power_entity) {
    return null;
  }
  const entity = states[panel.power_entity];
  const tokens = tokenizeSortText(
    getCandidateSortText(
      {
        entityId: panel.power_entity,
        friendlyName: getEntityFriendlyName(entity),
      },
      groupPlan.sortBy,
    ),
  );
  return tokens[groupPlan.tokenIndex]?.toLowerCase() ?? null;
};

const getAnchorLocalTokens = (
  panel: PanelConfig,
  states: Record<string, HassEntity>,
  groupValue: string | null,
): string[] => {
  if (!panel.power_entity) {
    return [];
  }
  return getUsefulTokens(
    getEntityTokens(panel.power_entity, states[panel.power_entity]),
    groupValue ?? undefined,
  );
};

const getAnchorSerialLikeTokens = (
  panel: PanelConfig,
  states: Record<string, HassEntity>,
): string[] => {
  if (!panel.power_entity) {
    return [];
  }
  return getUsefulTokens(
    getEntityTokens(panel.power_entity, states[panel.power_entity]),
  ).filter((token) => SERIAL_LIKE_TOKEN_REGEX.test(token));
};

const getAnchorGroupValues = (
  panel: PanelConfig,
  states: Record<string, HassEntity>,
  groupPlan: GroupSortPlan | null,
): string[] => {
  const groupValue = getAnchorGroupValue(panel, states, groupPlan);
  const serialLikeTokens = getAnchorSerialLikeTokens(panel, states);
  const values =
    groupValue && SERIAL_LIKE_TOKEN_REGEX.test(groupValue)
      ? [groupValue, ...serialLikeTokens]
      : [...serialLikeTokens, groupValue];
  return [
    ...new Set(
      values
        .filter((value): value is string => Boolean(value))
        .map((value) => value.toLowerCase()),
    ),
  ];
};

const getDistinctiveAnchorLocalTokens = (
  panel: PanelConfig,
  panels: PanelConfig[],
  states: Record<string, HassEntity>,
  groupPlan: GroupSortPlan,
  groupValue: string | null,
): string[] => {
  const localTokens = getAnchorLocalTokens(panel, states, groupValue);
  if (!groupValue) {
    return localTokens;
  }

  const tokenCounts = new Map<string, number>();
  for (const groupPanel of panels) {
    if (groupPanel.enabled === false || !groupPanel.power_entity?.trim()) {
      continue;
    }
    if (getAnchorGroupValue(groupPanel, states, groupPlan) !== groupValue) {
      continue;
    }
    const uniqueTokens = new Set(
      getAnchorLocalTokens(groupPanel, states, groupValue),
    );
    for (const token of uniqueTokens) {
      tokenCounts.set(token, (tokenCounts.get(token) ?? 0) + 1);
    }
  }

  return localTokens.filter((token) => tokenCounts.get(token) === 1);
};

const resolveAdvancedTelemetryValue = (
  key: AdvancedMetricKey,
  panel: PanelConfig,
  candidatesByKey: Record<AdvancedMetricKey, AdvancedTelemetryCandidate[]>,
  groupValue: string | null,
  localTokens: string[],
): string | null => {
  if (key === "panel_power_entity") {
    return panel.power_entity?.trim() || null;
  }

  const sameGroup = findSameGroupCandidates(candidatesByKey[key], groupValue);
  if (sameGroup.length === 0) {
    return null;
  }

  if (key === "inverter_temp_entity") {
    const temperatureCandidates = sameGroup.filter((candidate) =>
      hasAnyToken(candidate, ["temp", "temperature", "inverter"]),
    );
    if (temperatureCandidates.length === 1) {
      return temperatureCandidates[0].entityId;
    }
    if (sameGroup.length === 1) {
      return sameGroup[0].entityId;
    }
    return null;
  }

  if (
    key === "inverter_ac_power_entity" ||
    key === "inverter_ac_voltage_entity" ||
    key === "inverter_ac_current_entity"
  ) {
    const candidate = pickUniqueCandidate(sameGroup, (item) => {
      const hasAcOrInverter = hasAnyToken(item, ["ac", "inverter"]);
      return hasAcOrInverter ? 2 : 0;
    });
    return candidate?.entityId ?? null;
  }

  if (key === "panel_current_entity" || key === "panel_voltage_entity") {
    const candidate = pickUniqueCandidate(sameGroup, (item) => {
      const usefulTokens = getUsefulTokens(item.tokens, groupValue ?? undefined);
      const overlap = countSharedTokens(localTokens, usefulTokens);
      if (overlap === 0) {
        return 0;
      }
      const inverterPenalty = hasAnyToken(item, ["ac", "inverter"]) ? 1 : 0;
      return overlap * 2 - inverterPenalty;
    });
    return candidate?.entityId ?? null;
  }

  return null;
};

const scoreInverterStatusCandidate = (
  candidate: AdvancedTelemetryCandidate,
): number => {
  let score = 0;
  const statusText = `${candidate.entityId} ${getEntityFriendlyName(candidate.entity) ?? ""}`.toLowerCase();
  if (/device[._\-\s]+status/.test(statusText)) {
    score += 120;
  }
  if (/inverter[._\-\s]+status/.test(statusText)) {
    score += 100;
  }
  if (getEntityFriendlyName(candidate.entity)?.trim().toLowerCase() === "device status") {
    score += 80;
  }
  for (const token of candidate.tokens) {
    if (token === "status") {
      score += 20;
    } else if (token === "state") {
      score += 12;
    } else if (["fault", "alarm", "error"].includes(token)) {
      score += 10;
    } else if (["mode", "operation", "operating"].includes(token)) {
      score += 5;
    } else if (["work", "working", "run", "running"].includes(token)) {
      score += 3;
    }
  }
  if (hasAnyToken(candidate, ["inverter"])) {
    score += 2;
  }
  for (const token of candidate.tokens) {
    if (LESS_SPECIFIC_STATUS_TOKENS.has(token)) {
      score -= 8;
    }
  }
  return score;
};

const selectOneToOneStatusCandidate = (
  panel: PanelConfig,
  panels: PanelConfig[],
  states: Record<string, HassEntity>,
  statusCandidates: AdvancedTelemetryCandidate[],
  groupPlan: GroupSortPlan | null,
  usedStatusEntityIds: Set<string>,
): AdvancedTelemetryCandidate | null => {
  const groupValue = getAnchorGroupValue(panel, states, groupPlan);
  const groupValues = getAnchorGroupValues(panel, states, groupPlan);
  const candidatePool =
    groupValues.length > 0
      ? findSameGroupCandidatesByValues(statusCandidates, groupValues)
      : statusCandidates;
  const availableCandidates = candidatePool.filter(
    (candidate) => !usedStatusEntityIds.has(candidate.entityId),
  );
  if (availableCandidates.length === 0) {
    return null;
  }

  const localCounts = countTokens(getAnchorLocalTokens(panel, states, groupValue));
  const commonCounts = buildCommonAnchorLocalTokenCounts(
    panels,
    states,
    groupPlan,
    groupValue,
  );
  const distinctiveCounts = new Map<string, number>();
  for (const [token, count] of localCounts.entries()) {
    const distinctiveCount = count - (commonCounts.get(token) ?? 0);
    if (distinctiveCount > 0) {
      distinctiveCounts.set(token, distinctiveCount);
    }
  }
  if (distinctiveCounts.size === 0) {
    return null;
  }

  return pickUniqueCandidate(availableCandidates, (candidate) => {
    const usefulCounts = countTokens(
      getUsefulTokens(candidate.tokens, groupValue ?? undefined),
    );
    let overlap = 0;
    for (const [token, count] of distinctiveCounts.entries()) {
      const candidateDistinctiveCount = Math.max(
        0,
        (usefulCounts.get(token) ?? 0) - (commonCounts.get(token) ?? 0),
      );
      overlap += Math.min(count, candidateDistinctiveCount);
    }
    return overlap > 0 ? overlap * 10 : 0;
  });
};

const tryOneToOneStatusAutoFill = (
  panels: PanelConfig[],
  states: Record<string, HassEntity>,
  statusCandidates: AdvancedTelemetryCandidate[],
  groupPlan: GroupSortPlan | null,
): InverterStatusAutoFillResult => {
  const usedStatusEntityIds = new Set(
    panels
      .map((panel) => panel.inverter_status_entity)
      .filter((entityId): entityId is string => typeof entityId === "string" && entityId.trim().length > 0),
  );
  let filled = 0;
  let skippedPanels = 0;

  const nextPanels = panels.map((panel) => {
    if (panel.enabled === false || !panel.power_entity?.trim()) {
      skippedPanels += 1;
      return panel;
    }
    if (typeof panel.inverter_status_entity === "string" && panel.inverter_status_entity.trim().length > 0) {
      return panel;
    }

    const selected = selectOneToOneStatusCandidate(
      panel,
      panels,
      states,
      statusCandidates,
      groupPlan,
      usedStatusEntityIds,
    );
    if (!selected) {
      skippedPanels += 1;
      return panel;
    }

    usedStatusEntityIds.add(selected.entityId);
    filled += 1;
    return {
      ...panel,
      inverter_status_entity: selected.entityId,
    };
  });

  return {
    panels: nextPanels,
    filled,
    skippedPanels,
  };
};

export const autoPopulateInverterStatusEntities = (
  panels: PanelConfig[],
  states: Record<string, HassEntity>,
  searchText = "",
): InverterStatusAutoFillResult => {
  const powerPanels = panels.filter(
    (panel) => typeof panel.power_entity === "string" && panel.power_entity.trim().length > 0,
  );
  const anchorCandidates = powerPanels.map((panel) => {
    const entity = panel.power_entity ? states[panel.power_entity] : undefined;
    return {
      entityId: panel.power_entity ?? "",
      friendlyName: getEntityFriendlyName(entity),
    };
  });
  const groupPlan = getBestGroupSortPlan(anchorCandidates, {
    allowNumericGroup: true,
    allowSingleGroup: true,
    minCandidates: 2,
  });

  const statusCandidates = buildInverterStatusCandidates(states, searchText);
  const oneToOneResult = tryOneToOneStatusAutoFill(
    panels,
    states,
    statusCandidates,
    groupPlan,
  );
  if (oneToOneResult.filled > 0) {
    return oneToOneResult;
  }

  const selectedByGroup = new Map<string, string | null>();
  let filled = 0;
  let skippedPanels = 0;

  const nextPanels = panels.map((panel) => {
    if (panel.enabled === false || !panel.power_entity?.trim()) {
      skippedPanels += 1;
      return panel;
    }
    if (typeof panel.inverter_status_entity === "string" && panel.inverter_status_entity.trim().length > 0) {
      return panel;
    }

    const groupValues = getAnchorGroupValues(panel, states, groupPlan);
    if (groupValues.length === 0) {
      skippedPanels += 1;
      return panel;
    }
    const groupKey = groupValues[0];

    if (!selectedByGroup.has(groupKey)) {
      const sameGroup = findSameGroupCandidatesByValues(
        statusCandidates,
        groupValues,
      );
      const selected =
        sameGroup.length === 1
          ? sameGroup[0]
          : pickUniqueCandidate(sameGroup, scoreInverterStatusCandidate);
      selectedByGroup.set(groupKey, selected?.entityId ?? null);
    }

    const selectedEntityId = selectedByGroup.get(groupKey);
    if (!selectedEntityId) {
      skippedPanels += 1;
      return panel;
    }

    filled += 1;
    return {
      ...panel,
      inverter_status_entity: selectedEntityId,
    };
  });

  return {
    panels: nextPanels,
    filled,
    skippedPanels,
  };
};

export const autoPopulateAdvancedTelemetry = (
  panels: PanelConfig[],
  states: Record<string, HassEntity>,
): AdvancedTelemetryAutoFillResult => {
  const enabledPowerPanels = panels.filter(
    (panel) => panel.enabled !== false && typeof panel.power_entity === "string" && panel.power_entity.trim().length > 0,
  );
  const anchorCandidates = enabledPowerPanels.map((panel) => {
    const entity = panel.power_entity ? states[panel.power_entity] : undefined;
    return {
      entityId: panel.power_entity ?? "",
      friendlyName: getEntityFriendlyName(entity),
    };
  });
  const groupPlan = getBestGroupSortPlan(anchorCandidates, {
    allowNumericGroup: true,
    allowSingleGroup: true,
    minCandidates: 2,
  });

  const candidatesByKey: Record<AdvancedMetricKey, AdvancedTelemetryCandidate[]> = {
    inverter_ac_power_entity: buildAdvancedTelemetryCandidates(states, entityMatchesPower),
    inverter_ac_voltage_entity: buildAdvancedTelemetryCandidates(states, entityMatchesVoltage),
    inverter_ac_current_entity: buildAdvancedTelemetryCandidates(states, entityMatchesCurrent),
    inverter_temp_entity: buildAdvancedTelemetryCandidates(states, entityMatchesTemperature),
    panel_current_entity: buildAdvancedTelemetryCandidates(states, entityMatchesCurrent),
    panel_voltage_entity: buildAdvancedTelemetryCandidates(states, entityMatchesVoltage),
    panel_power_entity: buildAdvancedTelemetryCandidates(states, entityMatchesPower),
  };

  let filled = 0;
  let skippedPanels = 0;

  const nextPanels = panels.map((panel) => {
    if (panel.enabled === false || !panel.power_entity?.trim()) {
      skippedPanels += 1;
      return panel;
    }

    const groupValue = getAnchorGroupValue(panel, states, groupPlan);
    const localTokens = getAnchorLocalTokens(panel, states, groupValue);
    const nextAdvanced: PanelAdvancedMetrics = {
      ...(panel.advanced_metrics ?? {}),
    };
    let changed = false;

    const keys: AdvancedMetricKey[] = [
      "inverter_ac_power_entity",
      "inverter_ac_voltage_entity",
      "inverter_ac_current_entity",
      "inverter_temp_entity",
      "panel_current_entity",
      "panel_voltage_entity",
      "panel_power_entity",
    ];

    for (const key of keys) {
      if (typeof nextAdvanced[key] === "string" && nextAdvanced[key]?.trim()) {
        continue;
      }

      const entityId = resolveAdvancedTelemetryValue(
        key,
        panel,
        candidatesByKey,
        groupValue,
        localTokens,
      );
      if (!entityId) {
        continue;
      }

      nextAdvanced[key] = entityId;
      filled += 1;
      changed = true;
    }

    return changed
      ? {
          ...panel,
          advanced_metrics: nextAdvanced,
        }
      : panel;
  });

  return {
    panels: nextPanels,
    filled,
    skippedPanels,
  };
};

export const shouldAutoRenamePanelName = (
  currentName: string | undefined,
  panelId: string,
  previousPowerEntity: string | undefined,
  getEntityFriendlyName: FriendlyNameResolver,
): boolean => {
  const normalizedName = currentName?.trim() ?? "";
  if (!normalizedName) {
    return true;
  }
  if (normalizedName === panelId) {
    return true;
  }
  if (/^panel\s+\d+$/i.test(normalizedName)) {
    return true;
  }

  const previousFriendlyName = getEntityFriendlyName(previousPowerEntity);
  return Boolean(previousFriendlyName && normalizedName === previousFriendlyName);
};

export const applyAutoPopulateFriendlyNames = (
  panels: PanelConfig[],
  getEntityFriendlyName: FriendlyNameResolver,
): PanelConfig[] => {
  return panels.map((panel) => {
    const powerEntityId = panel.power_entity?.trim();
    if (!powerEntityId) {
      return panel;
    }

    const friendlyName = getEntityFriendlyName(powerEntityId);
    if (!friendlyName) {
      return panel;
    }

    return {
      ...panel,
      name: friendlyName,
    };
  });
};
