import type { HomeAssistant } from "./types";

export type ForecastMetricKind = "power" | "energy";

export const FORECAST_POWER_ENTITY_ID = "sensor.power_production_now";
export const FORECAST_ENERGY_ENTITY_ID = "sensor.energy_production_today";

const forecastEntityByKind: Record<ForecastMetricKind, string> = {
  power: FORECAST_POWER_ENTITY_ID,
  energy: FORECAST_ENERGY_ENTITY_ID,
};

export const getForecastEntityId = (kind: ForecastMetricKind): string =>
  forecastEntityByKind[kind];

export const resolveForecastEntityId = (
  hass: HomeAssistant | undefined,
  kind: ForecastMetricKind,
): string | null => {
  const entityId = getForecastEntityId(kind);
  if (!hass?.states?.[entityId]) {
    return null;
  }
  return entityId;
};

