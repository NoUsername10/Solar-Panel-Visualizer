import { describe, expect, it } from "vitest";
import { naturalCompare } from "../src/natural-sort";

describe("naturalCompare", () => {
  it("sorts dotted optimizer names numerically", () => {
    const sorted = [
      "Optimizer 1.0.10 Power",
      "Optimizer 1.0.2 Power",
      "Optimizer 1.0.30 Power",
      "Optimizer 1.0.1 Power",
    ].sort(naturalCompare);

    expect(sorted).toEqual([
      "Optimizer 1.0.1 Power",
      "Optimizer 1.0.2 Power",
      "Optimizer 1.0.10 Power",
      "Optimizer 1.0.30 Power",
    ]);
  });

  it("sorts underscored sensor entity ids numerically", () => {
    const sorted = [
      "sensor.power_1_0_10",
      "sensor.power_1_0_2",
      "sensor.power_1_0_30",
      "sensor.power_1_0_1",
    ].sort(naturalCompare);

    expect(sorted).toEqual([
      "sensor.power_1_0_1",
      "sensor.power_1_0_2",
      "sensor.power_1_0_10",
      "sensor.power_1_0_30",
    ]);
  });
});
