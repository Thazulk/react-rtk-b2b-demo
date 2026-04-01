import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { AppNavbar } from "@/components/shared/app-navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { clearSession, selectActiveCartId, selectUser } from "@/store/authSlice";
import { useActiveCart } from "@/features/cart/hooks/use-active-cart";
import { persistor, useAppDispatch, useAppSelector } from "@/store";

export function DashboardPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const user = useAppSelector(selectUser);
  const activeCartId = useAppSelector(selectActiveCartId);
  const { cartItemTypesCount } = useActiveCart({
    userId: user?.id,
    activeCartId,
  });

  const handleLogout = () => {
    dispatch(clearSession());
    void persistor.purge();
    navigate("/login", { replace: true });
  };

  const hasCartContent = cartItemTypesCount > 0;

  return (
    <main className="min-h-svh w-full lg:pl-56">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 pb-6 pt-14">
        <AppNavbar
          title={t("dashboard.routeTitle")}
          userName={user ? `${user.firstName} ${user.lastName}` : t("navbar.guest")}
          cartItemCount={cartItemTypesCount}
          onTitleClick={() => navigate("/dashboard")}
          onCartClick={() => navigate("/cart")}
          onProfile={() => navigate("/profile")}
          onLogout={handleLogout}
        />

        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.title")}</CardTitle>
            <CardDescription>
              {t("dashboard.welcome", {
                name: user ? `${user.firstName} ${user.lastName}` : t("navbar.guest"),
              })}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              {hasCartContent ? t("dashboard.hasCart") : t("dashboard.emptyCart")}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outline" onClick={() => navigate("/catalog")}>
                {t("dashboard.continueBrowsing")}
              </Button>
              <Button onClick={() => navigate("/cart")} disabled={!hasCartContent}>
                {t("dashboard.goToCart")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
