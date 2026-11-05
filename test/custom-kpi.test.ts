import { describe, expect, it } from "vitest";
import { formatCustomKpiStateValue } from "../src/custom-kpi";

describe("formatCustomKpiStateValue", () => {
  it("formats numeric custom KPI values with configured decimals and unit", () => {
    const formatted = formatCustomKpiStateValue("12.3456", "en", 2, "kW");

    expect(formatted).toBe("12.35 kW");
  });

  it("normalizes negative zero and clamps decimals", () => {
    const formatted = formatCustomKpiStateValue("-0", "en", 9, "W");

    expect(formatted).toBe("0.0000 W");
  });

  it("returns null for non-numeric states", () => {
    const formatted = formatCustomKpiStateValue("unavailable", "en", 0, "W");

    expect(formatted).toBeNull();
  });
});
