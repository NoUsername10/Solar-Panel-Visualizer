import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("card metadata", () => {
  it("registers the bare custom element type for the Home Assistant card picker", () => {
    const source = readFileSync("src/index.ts", "utf8");

    expect(source).toContain("type: CARD_ELEMENT_NAME");
    expect(source).not.toContain("type: CARD_TYPE");
  });

  it("registers a Home Assistant card picker icon", () => {
    const source = readFileSync("src/index.ts", "utf8");

    expect(source).toContain('icon: "mdi:solar-panel"');
  });
});
