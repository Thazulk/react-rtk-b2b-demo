import { useActiveCart } from "@/features/cart/hooks/use-active-cart";
import { persistor, useAppDispatch, useAppSelector } from "@/store";
import { clearSession, selectUser } from "@/store/authSlice";
import { selectUserDraftItemTypesCount } from "@/store/cartDraftSlice";
import { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router";

export function useRootLayout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const user = useAppSelector(selectUser);
  const draftItemTypesCount = useAppSelector((state) =>
    selectUserDraftItemTypesCount(state, user?.id),
  );
  const { cartItemTypesCount } = useActiveCart(user?.id);

  const isLoginRoute = location.pathname === "/login";
  const cartBadgeCount = draftItemTypesCount || cartItemTypesCount;

  const handleLogout = useCallback(() => {
    dispatch(clearSession());
    void persistor.purge();
    navigate("/login", { replace: true });
  }, [dispatch, navigate]);

  const closeMobileDrawer = useCallback(() => setMobileDrawerOpen(false), []);
  const toggleMobileDrawer = useCallback(
    () => setMobileDrawerOpen((prev) => !prev),
    [],
  );

  return {
    user,
    isLoginRoute,
    cartBadgeCount,
    mobileDrawerOpen,
    setMobileDrawerOpen,
    closeMobileDrawer,
    toggleMobileDrawer,
    handleLogout,
    navigate,
  };
}
