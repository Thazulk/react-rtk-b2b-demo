import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { AppNavbar } from "@/components/shared/AppNavbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useActiveCart } from "@/features/cart/hooks/use-active-cart";
import { persistor, useAppDispatch, useAppSelector } from "@/store";
import { clearSession, selectActiveCartId, selectUser } from "@/store/authSlice";
import { selectUserDraftItemTypesCount } from "@/store/cartDraftSlice";

export function ProfilePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const user = useAppSelector(selectUser);
  const activeCartId = useAppSelector(selectActiveCartId);
  const draftItemTypesCount = useAppSelector((state) => selectUserDraftItemTypesCount(state, user?.id));
  const { cartItemTypesCount } = useActiveCart({
    userId: user?.id,
    activeCartId,
  });

  const handleLogout = () => {
    dispatch(clearSession());
    void persistor.purge();
    navigate("/login", { replace: true });
  };

  return (
    <main className="min-h-svh w-full lg:pl-56">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 pb-6 pt-14">
        <AppNavbar
          title={t("profile.title")}
          userName={user ? `${user.firstName} ${user.lastName}` : t("navbar.guest")}
          cartItemCount={draftItemTypesCount || cartItemTypesCount}
          onTitleClick={() => navigate("/")}
          onCartClick={() => navigate("/cart")}
          onProfile={() => navigate("/profile")}
          onLogout={handleLogout}
        />

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>{t("profile.title")}</CardTitle>
            <CardDescription>{t("profile.subtitle")}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-sm">
            {user?.image ? (
              <img
                src={user.image}
                alt={`${user.firstName} ${user.lastName}`}
                className="size-20 rounded-full border object-cover"
                loading="lazy"
              />
            ) : null}
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
      </div>
    </main>
  );
}
