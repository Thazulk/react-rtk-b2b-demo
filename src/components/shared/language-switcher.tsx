import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const handleLanguageChange = (language: "en-US" | "hu-HU") => {
    void i18n.changeLanguage(language);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground">{t("language.switchLabel")}:</span>
      <Button
        size="sm"
        variant={i18n.language === "hu-HU" ? "default" : "outline"}
        onClick={() => handleLanguageChange("hu-HU")}
      >
        {t("language.hungarian")}
      </Button>
      <Button
        size="sm"
        variant={i18n.language === "en-US" ? "default" : "outline"}
        onClick={() => handleLanguageChange("en-US")}
      >
        {t("language.english")}
      </Button>
    </div>
  );
}
