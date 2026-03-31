import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { CartManager, type CartLine } from "@/features/cart/components/cart-manager";
import { ProductCatalog } from "@/features/catalog/components/product-catalog";
import { mockProducts } from "@/features/catalog/model/mock-products";
import { clearSession, selectActiveCartId, selectUser, setActiveCartId } from "@/store/authSlice";
import { persistor, useAppDispatch, useAppSelector } from "@/store";
import type { Product } from "@/types/dummyjson";

export function StorefrontPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold tracking-tight">B2B storefront</h1>
          <p className="text-sm text-muted-foreground">
            Bejelentkezett user: {user ? `${user.firstName} ${user.lastName}` : "n/a"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate("/browse")}>
            Public browse
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        <ProductCatalog canManageCart onAddToCart={handleAddToCart} products={mockProducts} />
        <CartManager activeCartId={activeCartId} lines={cartLines} onChangeQuantity={handleChangeQuantity} />
      </div>
    </main>
  );
}
