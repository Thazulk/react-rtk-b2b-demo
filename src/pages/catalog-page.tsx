import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { AppNavbar } from "@/components/shared/app-navbar";
import { ProductCatalog } from "@/features/catalog/components/product-catalog";
import { mockProducts } from "@/features/catalog/model/mock-products";
import {
  clearSession,
  selectUser,
  setActiveCartId,
  selectActiveCartId,
} from "@/store/authSlice";
import { addProductToCart, clearCartState, selectCartItemTypesCount } from "@/store/cartSlice";
import { persistor, useAppDispatch, useAppSelector } from "@/store";

export function CatalogPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const user = useAppSelector(selectUser);
  const activeCartId = useAppSelector(selectActiveCartId);
  const cartItemTypesCount = useAppSelector(selectCartItemTypesCount);

  useEffect(() => {
    if (!activeCartId) {
      dispatch(setActiveCartId(1001));
    }
  }, [activeCartId, dispatch]);

  const handleLogout = () => {
    dispatch(clearSession());
    dispatch(clearCartState());
    void persistor.purge();
    navigate("/login", { replace: true });
  };

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-6xl flex-col gap-6 px-6 pb-6 pt-14">
      <AppNavbar
        title={t("catalog.routeTitle")}
        userName={user ? `${user.firstName} ${user.lastName}` : t("navbar.guest")}
        cartItemCount={cartItemTypesCount}
        onTitleClick={() => navigate("/catalog")}
        onCartClick={() => navigate("/cart")}
        onProfile={() => navigate("/profile")}
        onLogout={handleLogout}
      />

      <ProductCatalog
        canManageCart
        products={mockProducts}
        onAddToCart={(product) => dispatch(addProductToCart(product))}
      />
    </main>
  );
}
