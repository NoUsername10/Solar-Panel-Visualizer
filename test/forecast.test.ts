import { describe, expect, it } from "vitest";
import {
  FORECAST_ENERGY_ENTITY_ID,
  FORECAST_POWER_ENTITY_ID,
  getForecastEntityId,
  resolveForecastEntityId,
} from "../src/forecast";

describe("forecast helpers", () => {
  it("returns fixed Forecast.Solar default entity ids", () => {
    expect(getForecastEntityId("power")).toBe("sensor.power_production_now");
    expect(getForecastEntityId("energy")).toBe("sensor.energy_production_today");
  });

  it("resolves power forecast only when exact default entity exists", () => {
    expect(
      resolveForecastEntityId(
        {
          states: {
            [FORECAST_POWER_ENTITY_ID]: {
              entity_id: FORECAST_POWER_ENTITY_ID,
              state: "123",
              attributes: { unit_of_measurement: "W" },
            },
            "sensor.some_other_forecast_power": {
              entity_id: "sensor.some_other_forecast_power",
              state: "120",
              attributes: { unit_of_measurement: "W" },
            },
          },
        },
        "power",
      ),
    ).toBe(FORECAST_POWER_ENTITY_ID);
  });

  it("resolves energy forecast only when exact default entity exists", () => {
    expect(
      resolveForecastEntityId(
        {
          states: {
            [FORECAST_ENERGY_ENTITY_ID]: {
              entity_id: FORECAST_ENERGY_ENTITY_ID,
              state: "8.4",
              attributes: { unit_of_measurement: "kWh" },
            },
            "sensor.energy_production_tomorrow": {
              entity_id: "sensor.energy_production_tomorrow",
              state: "7.2",
              attributes: { unit_of_measurement: "kWh" },
            },
          },
        },
        "energy",
      ),
    ).toBe(FORECAST_ENERGY_ENTITY_ID);
  });

  it("returns null when default forecast entities are missing", () => {
    expect(resolveForecastEntityId({ states: {} }, "power")).toBeNull();
    expect(resolveForecastEntityId({ states: {} }, "energy")).toBeNull();
  });
});

