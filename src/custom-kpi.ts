const normalizeNegativeZero = (value: number): number =>
  Object.is(value, -0) ? 0 : value;

const clampDecimals = (value: number): number =>
  Math.min(Math.max(Math.round(value), 0), 4);

export const formatCustomKpiStateValue = (
  state: string,
  locale: string,
  decimals: number,
  unit?: string,
): string | null => {
  const numeric = Number(state);
  if (!Number.isFinite(numeric)) {
    return null;
  }

  const safeDecimals = clampDecimals(decimals);
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: safeDecimals,
    maximumFractionDigits: safeDecimals,
  }).format(normalizeNegativeZero(numeric));

  const safeUnit = unit?.trim();
  return safeUnit ? `${formatted} ${safeUnit}` : formatted;
};
