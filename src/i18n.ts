import enCatalog from "./translations/en.json";
import type { HomeAssistant } from "./types";

type Primitive = string | number | boolean | null;
type AnyObject = Record<string, unknown>;

type LeafKeyPaths<T, Prefix extends string = ""> = T extends Primitive
  ? never
  : {
      [K in keyof T & string]: T[K] extends string
        ? `${Prefix}${K}`
        : T[K] extends AnyObject
          ? LeafKeyPaths<T[K], `${Prefix}${K}.`>
          : never;
    }[keyof T & string];

export type TranslationCatalog = typeof enCatalog;
export type TranslationKey = LeafKeyPaths<TranslationCatalog>;
export type TranslationParams = Record<string, string | number>;

const BUILTIN_CATALOGS: Record<string, TranslationCatalog> = {
  en: enCatalog,
};

const warnedMissingKeys = new Set<string>();

const isDevelopmentEnvironment = (): boolean => {
  if (typeof import.meta !== "undefined") {
    const env = (import.meta as { env?: { DEV?: unknown } }).env;
    if (typeof env?.DEV === "boolean") {
      return env.DEV;
    }
  }
  if (typeof process !== "undefined") {
    return process.env.NODE_ENV !== "production";
  }
  return false;
};

const warnMissingKey = (key: string, locale?: string): void => {
  if (!isDevelopmentEnvironment()) {
    return;
  }
  const warningKey = `${locale ?? "unknown"}:${key}`;
  if (warnedMissingKeys.has(warningKey)) {
    return;
  }
  warnedMissingKeys.add(warningKey);
  // eslint-disable-next-line no-console
  console.warn(
    `[Solar Panel Visualizer i18n] Missing translation key "${key}" for locale "${locale ?? "unknown"}".`,
  );
};

const readPath = (catalog: TranslationCatalog | undefined, key: string): unknown => {
  if (!catalog) {
    return undefined;
  }
  return key
    .split(".")
    .reduce<unknown>(
      (current, segment) =>
        typeof current === "object" && current !== null
          ? (current as Record<string, unknown>)[segment]
          : undefined,
      catalog,
    );
};

const interpolate = (
  template: string,
  params?: TranslationParams,
): string => {
  if (!params) {
    return template;
  }
  return template.replace(/\{([a-zA-Z0-9_]+)\}/g, (_match, token: string) => {
    const value = params[token];
    return value === undefined ? `{${token}}` : String(value);
  });
};

export const getLocaleCandidates = (locale?: string): string[] => {
  if (!locale) {
    return ["en"];
  }

  const normalized = locale.trim().toLowerCase();
  if (normalized.length === 0) {
    return ["en"];
  }

  const base = normalized.split("-")[0];
  const candidates = [normalized, base, "en"];
  return [...new Set(candidates)];
};

export const getBuiltInCatalogs = (): Record<string, TranslationCatalog> => ({
  ...BUILTIN_CATALOGS,
});

export const translateWithCatalogs = (
  catalogs: Record<string, TranslationCatalog | undefined>,
  locale: string | undefined,
  key: string,
  params?: TranslationParams,
): string => {
  for (const candidate of getLocaleCandidates(locale)) {
    const resolved = readPath(catalogs[candidate], key);
    if (typeof resolved === "string") {
      return interpolate(resolved, params);
    }
  }

  const englishFallback = readPath(catalogs.en ?? enCatalog, key);
  if (typeof englishFallback === "string") {
    return interpolate(englishFallback, params);
  }

  warnMissingKey(key, locale);
  return "";
};

export const translateByLocale = (
  locale: string | undefined,
  key: TranslationKey,
  params?: TranslationParams,
): string =>
  translateWithCatalogs(
    BUILTIN_CATALOGS,
    locale,
    key,
    params,
  );

export const translate = (
  hass: HomeAssistant | undefined,
  key: TranslationKey,
  params?: TranslationParams,
): string => translateByLocale(hass?.locale?.language, key, params);

