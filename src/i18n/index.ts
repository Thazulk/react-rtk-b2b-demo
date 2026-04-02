import { enUS } from "@/i18n/resources/en-US";
import { huHU } from "@/i18n/resources/hu-HU";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export const defaultNS = "common";

export const resources = {
  "en-US": enUS,
  "hu-HU": huHU,
} as const;

void i18n.use(initReactI18next).init({
  resources,
  lng: "en-US",
  fallbackLng: "en-US",
  supportedLngs: ["en-US", "hu-HU"],
  defaultNS,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
