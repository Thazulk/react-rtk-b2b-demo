import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { AppNavbar } from "@/components/shared/app-navbar";
import { CartManager } from "@/features/cart/components/cart-manager";
import { clearSession, selectActiveCartId, selectUser } from "@/store/authSlice";
import {
  clearCartState,
  selectCartItemTypesCount,
  selectCartLines,
  setProductQuantity,
} from "@/store/cartSlice";
import { persistor, useAppDispatch, useAppSelector } from "@/store";

export function CartPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const user = useAppSelector(selectUser);
  const activeCartId = useAppSelector(selectActiveCartId);
  const cartLines = useAppSelector(selectCartLines);
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
        title={t("cart.routeTitle")}
        userName={user ? `${user.firstName} ${user.lastName}` : t("navbar.guest")}
        cartItemCount={cartItemTypesCount}
        onTitleClick={() => navigate("/catalog")}
        onCartClick={() => navigate("/cart")}
        onProfile={() => navigate("/profile")}
        onLogout={handleLogout}
      />

      <CartManager
        activeCartId={activeCartId}
        lines={cartLines}
        onChangeQuantity={(productId, nextQuantity) =>
          dispatch(setProductQuantity({ productId, nextQuantity }))
        }
      />
    </main>
  );
}
