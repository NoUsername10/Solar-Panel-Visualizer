import { CARD_ELEMENT_NAME } from "./config";
import { translateByLocale } from "./i18n";
import "./solar-panel-visualizer-card";
import "./solar-panel-visualizer-editor";

const locale =
  typeof navigator !== "undefined" ? navigator.language : "en";

window.customCards = window.customCards || [];
window.customCards.push({
  type: CARD_ELEMENT_NAME,
  name: translateByLocale(locale, "meta.card_name"),
  description: translateByLocale(locale, "meta.card_description"),
  icon: "mdi:solar-panel",
  preview: true,
});
