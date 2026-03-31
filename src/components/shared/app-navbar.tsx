import { ChevronDown, ShoppingCart, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";

interface AppNavbarProps {
  title: string;
  userName?: string;
  cartItemCount?: number;
  onTitleClick?: () => void;
  onCartClick?: () => void;
  onProfile?: () => void;
  onLogout?: () => void;
}

export function AppNavbar({
  title,
  userName,
  cartItemCount = 0,
  onTitleClick,
  onCartClick,
  onProfile,
  onLogout,
}: AppNavbarProps) {
  const { i18n, t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("mousedown", handleOutsideClick);
    return () => window.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleLanguageChange = (language: "en-US" | "hu-HU") => {
    void i18n.changeLanguage(language);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-14 border-b bg-background/95 backdrop-blur">
      <div className="flex h-full w-full items-center justify-between px-4 sm:px-6">
        {onTitleClick ? (
          <Button
            variant="ghost"
            className="h-auto px-0 text-lg font-semibold tracking-tight hover:bg-transparent"
            onClick={onTitleClick}
          >
            {title}
          </Button>
        ) : (
          <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
        )}
        <div className="flex items-center gap-2">
          <Button
            size="icon-sm"
            variant="outline"
            className="relative"
            onClick={onCartClick}
            disabled={!onCartClick}
          >
            <ShoppingCart aria-hidden="true" />
            <span className="sr-only">{t("navbar.cart")}</span>
            <span className="absolute -top-1 -right-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white">
              {cartItemCount}
            </span>
          </Button>

          <ThemeToggle />

          <div className="relative" ref={menuRef}>
            <Button variant="outline" size="sm" onClick={() => setIsMenuOpen((current) => !current)}>
              <UserRound data-icon="inline-start" />
              <span className="max-w-32 truncate">{userName ?? t("storefront.notAvailable")}</span>
              <ChevronDown data-icon="inline-end" />
            </Button>

            {isMenuOpen ? (
              <div className="absolute right-0 z-10 mt-2 flex w-64 flex-col gap-2 rounded-lg border bg-background p-2 shadow-lg">
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onProfile?.();
                  }}
                  disabled={!onProfile}
                >
                  {t("navbar.profile")}
                </Button>

                <div className="rounded-md border p-2">
                  <p className="mb-2 text-xs text-muted-foreground">{t("navbar.language")}</p>
                  <div className="flex items-center gap-2">
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
                </div>

                <Button
                  variant="ghost"
                  className="justify-start text-destructive hover:text-destructive"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onLogout?.();
                  }}
                  disabled={!onLogout}
                >
                  {t("navbar.logout")}
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
