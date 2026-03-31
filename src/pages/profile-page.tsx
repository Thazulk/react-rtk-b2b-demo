import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { AppNavbar } from "@/components/shared/app-navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { clearSession, selectUser } from "@/store/authSlice";
import { clearCartState, selectCartItemTypesCount } from "@/store/cartSlice";
import { persistor, useAppDispatch, useAppSelector } from "@/store";

export function ProfilePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const user = useAppSelector(selectUser);
  const cartItemTypesCount = useAppSelector(selectCartItemTypesCount);

  const handleLogout = () => {
    dispatch(clearSession());
    dispatch(clearCartState());
    void persistor.purge();
    navigate("/login", { replace: true });
  };

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-6xl flex-col gap-6 px-6 pb-6 pt-14">
      <AppNavbar
        title={t("profile.title")}
        userName={user ? `${user.firstName} ${user.lastName}` : t("navbar.guest")}
        cartItemCount={cartItemTypesCount}
        onTitleClick={() => navigate("/catalog")}
        onCartClick={() => navigate("/cart")}
        onProfile={() => navigate("/profile")}
        onLogout={handleLogout}
      />

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>{t("profile.title")}</CardTitle>
          <CardDescription>{t("profile.subtitle")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm">
          <p>
            <span className="font-medium">{t("profile.name")}:</span>{" "}
            {user ? `${user.firstName} ${user.lastName}` : t("storefront.notAvailable")}
          </p>
          <p>
            <span className="font-medium">{t("profile.email")}:</span>{" "}
            {user?.email ?? t("storefront.notAvailable")}
          </p>
          <p>
            <span className="font-medium">{t("profile.username")}:</span>{" "}
            {user?.username ?? t("storefront.notAvailable")}
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
