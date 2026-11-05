export type PanelPerformanceLabelVariant = "full" | "medium" | "compact";

export interface PanelPerformanceLabelCandidate {
  variant: PanelPerformanceLabelVariant;
  text: string;
}

interface ChoosePanelPerformanceLabelOptions {
  candidates: PanelPerformanceLabelCandidate[];
  panelWidthPx: number;
  panelHeightPx: number;
  fontPx: number;
  reservedRightPx?: number;
  measureTextWidthPx: (text: string, fontPx: number) => number;
}

export const getPanelPerformanceTextWidth = (
  panelWidthPx: number,
  reservedRightPx = 0,
): number => Math.max(36, panelWidthPx - 36 - Math.max(0, reservedRightPx));

export const choosePanelPerformanceLabel = ({
  candidates,
  panelWidthPx,
  panelHeightPx,
  fontPx,
  reservedRightPx = 0,
  measureTextWidthPx,
}: ChoosePanelPerformanceLabelOptions): PanelPerformanceLabelCandidate => {
  const compact = candidates.find((candidate) => candidate.variant === "compact");
  if (!compact) {
    throw new Error("Panel performance label requires a compact candidate.");
  }

  if (panelHeightPx < 96 || panelWidthPx < 112) {
    return compact;
  }

  const full = candidates.find((candidate) => candidate.variant === "full");
  const slotSafeWidth = getPanelPerformanceTextWidth(panelWidthPx, reservedRightPx);
  if (full && measureTextWidthPx(full.text, fontPx) <= slotSafeWidth) {
    return full;
  }

  const normalWidth = getPanelPerformanceTextWidth(panelWidthPx);
  const medium = candidates.find((candidate) => candidate.variant === "medium");
  if (medium && measureTextWidthPx(medium.text, fontPx) <= normalWidth) {
    return medium;
  }

  return compact;
};
