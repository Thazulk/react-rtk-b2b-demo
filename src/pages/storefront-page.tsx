import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { AppNavbar } from "@/components/shared/app-navbar";
import { CartManager, type CartLine } from "@/features/cart/components/cart-manager";
import { ProductCatalog } from "@/features/catalog/components/product-catalog";
import { mockProducts } from "@/features/catalog/model/mock-products";
import { clearSession, selectActiveCartId, selectUser, setActiveCartId } from "@/store/authSlice";
import { persistor, useAppDispatch, useAppSelector } from "@/store";
import type { Product } from "@/types/dummyjson";

export function StorefrontPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const user = useAppSelector(selectUser);
  const activeCartId = useAppSelector(selectActiveCartId);
  const [cartLines, setCartLines] = useState<CartLine[]>([]);

  useEffect(() => {
    if (!activeCartId) {
      dispatch(setActiveCartId(1001));
    }
  }, [activeCartId, dispatch]);

  const handleAddToCart = (product: Product) => {
    setCartLines((current) => {
      const line = current.find((entry) => entry.product.id === product.id);
      if (!line) {
        return [...current, { product, quantity: 1 }];
      }
      return current.map((entry) =>
        entry.product.id === product.id ? { ...entry, quantity: entry.quantity + 1 } : entry,
      );
    });
  };

  const handleChangeQuantity = (productId: number, nextQuantity: number) => {
    setCartLines((current) => {
      if (nextQuantity <= 0) {
        return current.filter((entry) => entry.product.id !== productId);
      }
      return current.map((entry) =>
        entry.product.id === productId ? { ...entry, quantity: nextQuantity } : entry,
      );
    });
  };

  const handleLogout = () => {
    dispatch(clearSession());
    void persistor.purge();
    navigate("/login", { replace: true });
  };

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-6xl flex-col gap-6 p-6">
      <AppNavbar
        title={t("storefront.title")}
        userName={user ? `${user.firstName} ${user.lastName}` : t("navbar.guest")}
        onProfile={() => navigate("/profile")}
        onLogout={handleLogout}
      />
      <div className="grid gap-6 md:grid-cols-2">
        <ProductCatalog canManageCart onAddToCart={handleAddToCart} products={mockProducts} />
        <CartManager activeCartId={activeCartId} lines={cartLines} onChangeQuantity={handleChangeQuantity} />
      </div>
    </main>
  );
}
