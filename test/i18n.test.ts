import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  getBuiltInCatalogs,
  getLocaleCandidates,
  translateByLocale,
  translateWithCatalogs,
  type TranslationCatalog,
} from "../src/i18n";

const flattenLeafKeys = (
  value: unknown,
  prefix = "",
): Map<string, string> => {
  const keys = new Map<string, string>();
  if (typeof value !== "object" || value === null) {
    return keys;
  }

  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    const nextPrefix = prefix ? `${prefix}.${key}` : key;
    if (typeof child === "string") {
      keys.set(nextPrefix, "string");
      continue;
    }
    if (typeof child === "object" && child !== null && !Array.isArray(child)) {
      for (const [leafKey, leafType] of flattenLeafKeys(child, nextPrefix)) {
        keys.set(leafKey, leafType);
      }
    }
  }

  return keys;
};

describe("i18n helper", () => {
  it("builds locale candidates in full->base->en order", () => {
    expect(getLocaleCandidates("sv-SE")).toEqual(["sv-se", "sv", "en"]);
    expect(getLocaleCandidates("en-US")).toEqual(["en-us", "en"]);
    expect(getLocaleCandidates(undefined)).toEqual(["en"]);
  });

  it("falls back from full locale to base locale and then english", () => {
    const catalogs = {
      en: {
        demo: {
          hello: "Hello {name}",
          fallback: "Fallback value",
        },
      },
      sv: {
        demo: {
          hello: "Hej {name}",
          fallback: "Reserv",
        },
      },
    } as unknown as Record<string, TranslationCatalog>;

    expect(
      translateWithCatalogs(catalogs, "sv-SE", "demo.hello", { name: "Martin" }),
    ).toBe("Hej Martin");
    expect(
      translateWithCatalogs(catalogs, "de-DE", "demo.fallback"),
    ).toBe("Fallback value");
  });

  it("returns english strings for built-in translations", () => {
    expect(translateByLocale("en", "card.summary.power")).toBe("Power");
    expect(translateByLocale("fr-FR", "card.summary.power")).toBe("Power");
  });
});

describe("translation catalog integrity", () => {
  it("ensures all non-english catalogs exactly match english leaf keys and value types", () => {
    const translationsDir = join(process.cwd(), "src", "translations");
    const files = readdirSync(translationsDir).filter((file) => file.endsWith(".json"));
    const englishFile = files.find((file) => file === "en.json");
    expect(englishFile).toBeDefined();

    const englishCatalog = JSON.parse(
      readFileSync(join(translationsDir, "en.json"), "utf-8"),
    ) as unknown;
    const englishKeys = flattenLeafKeys(englishCatalog);
    expect(englishKeys.size).toBeGreaterThan(0);

    for (const file of files) {
      if (file === "en.json") {
        continue;
      }

      const localeCatalog = JSON.parse(
        readFileSync(join(translationsDir, file), "utf-8"),
      ) as unknown;
      const localeKeys = flattenLeafKeys(localeCatalog);

      const missing = [...englishKeys.keys()].filter((key) => !localeKeys.has(key));
      const extras = [...localeKeys.keys()].filter((key) => !englishKeys.has(key));
      const wrongTypes = [...englishKeys.keys()].filter(
        (key) => localeKeys.get(key) !== englishKeys.get(key),
      );

      expect(
        { file, missing, extras, wrongTypes },
        `Translation schema mismatch in ${file}`,
      ).toEqual({
        file,
        missing: [],
        extras: [],
        wrongTypes: [],
      });
    }
  });

  it("contains runtime-required keys in english catalog", () => {
    const catalogs = getBuiltInCatalogs();
    const english = flattenLeafKeys(catalogs.en);
    expect(english.has("card.summary.power")).toBe(true);
    expect(english.has("editor.section.layout_title")).toBe(true);
    expect(english.has("editor.section.motion_title")).toBe(true);
    expect(english.has("state.reason.array_check_disabled")).toBe(true);
  });
});
