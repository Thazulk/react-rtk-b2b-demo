import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { ProductCatalog } from "@/features/catalog/components/product-catalog";
import { mockProducts } from "@/features/catalog/model/mock-products";

export function BrowsePage() {
  const { t } = useTranslation();

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-5xl flex-col gap-6 p-6">
      <LanguageSwitcher />
      <section className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">{t("browse.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("browse.description")}</p>
        <p className="text-sm">
          {t("browse.loginCtaPrefix")}{" "}
          <Link className="underline underline-offset-2" to="/login">
            {t("browse.loginCtaLink")}
          </Link>
          .
        </p>
      </section>
      <ProductCatalog canManageCart={false} products={mockProducts} />
    </main>
  );
}
