const NATURAL_COLLATOR = new Intl.Collator("en", {
  numeric: true,
  sensitivity: "base",
});

export const naturalCompare = (left: string, right: string): number => {
  const collatorResult = NATURAL_COLLATOR.compare(left, right);
  if (collatorResult !== 0) {
    return collatorResult;
  }

  if (left === right) {
    return 0;
  }

  return left < right ? -1 : 1;
};
