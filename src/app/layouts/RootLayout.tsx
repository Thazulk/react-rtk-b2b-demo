import { useTranslation } from "react-i18next";
import { Outlet, useLocation, useNavigate } from "react-router";
import { AppNavbar } from "@/components/shared/AppNavbar";
import { NavigationDrawer } from "@/components/shared/NavigationDrawer";
import { useActiveCart } from "@/features/cart/hooks/use-active-cart";
import { persistor, useAppDispatch, useAppSelector } from "@/store";
import { clearSession, selectActiveCartId, selectUser } from "@/store/authSlice";
import { selectUserDraftItemTypesCount } from "@/store/cartDraftSlice";

/** App shell: navbar, drawer, and main content area (`Outlet`). */
export function RootLayout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const user = useAppSelector(selectUser);
  const activeCartId = useAppSelector(selectActiveCartId);
  const draftItemTypesCount = useAppSelector((state) =>
    selectUserDraftItemTypesCount(state, user?.id),
  );
  const { cartItemTypesCount } = useActiveCart({
    userId: user?.id,
    activeCartId,
  });

  const isLoginRoute = location.pathname === "/login";
  const cartBadgeCount = draftItemTypesCount || cartItemTypesCount;

  const handleLogout = () => {
    dispatch(clearSession());
    void persistor.purge();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <AppNavbar
        title={t("app.name")}
        userName={user ? `${user.firstName} ${user.lastName}` : t("navbar.guest")}
        cartItemCount={isLoginRoute ? 0 : cartBadgeCount}
        onTitleClick={() => navigate("/")}
        onCartClick={user ? () => navigate("/cart") : undefined}
        onProfile={user ? () => navigate("/profile") : undefined}
        onLogout={user ? handleLogout : undefined}
        onLogin={!user && !isLoginRoute ? () => navigate("/login") : undefined}
      />
      <NavigationDrawer />
      <main className="flex h-svh min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden lg:pl-56">
        <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col gap-6 overflow-hidden px-6 pb-6 pt-14 [&>*]:min-h-0">
          <div className="flex h-full max-h-full min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden">
            <Outlet />
          </div>
        </div>
      </main>
    </>
  );
}
