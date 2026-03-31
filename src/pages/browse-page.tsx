import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { AppNavbar } from "@/components/shared/app-navbar";
import { ProductCatalog } from "@/features/catalog/components/product-catalog";
import { mockProducts } from "@/features/catalog/model/mock-products";

export function BrowsePage() {
  const { t } = useTranslation();

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-6xl flex-col gap-6 px-6 pb-6 pt-14">
      <AppNavbar title={t("browse.title")} userName={t("navbar.guest")} cartItemCount={0} />
      <section className="flex flex-col gap-2">
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
