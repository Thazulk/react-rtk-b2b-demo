import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { AppNavbar } from "@/components/shared/app-navbar";
import { ProductCatalog } from "@/features/catalog/components/product-catalog";
import { clearSession, selectUser, selectActiveCartId } from "@/store/authSlice";
import { useActiveCart } from "@/features/cart/hooks/use-active-cart";
import { useGetProductsQuery, useUpdateCartMutation } from "@/store/dummyJsonApi";
import { persistor, useAppDispatch, useAppSelector } from "@/store";

export function CatalogPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const user = useAppSelector(selectUser);
  const activeCartId = useAppSelector(selectActiveCartId);
  const [updateCart, { isLoading: isUpdatingCart }] = useUpdateCartMutation();
  const { activeCart, cartItemTypesCount, isBootstrappingCart } = useActiveCart({
    userId: user?.id,
    activeCartId,
  });

  const { data: productsData, isLoading: isProductsLoading } = useGetProductsQuery({ limit: 20 });

  const handleAddToCart = async (productId: number) => {
    if (!activeCartId || !activeCart) {
      return;
    }

    const existing = activeCart.products.find((item) => item.id === productId);
    const nextProducts = activeCart.products.map((item) => ({
      id: item.id,
      quantity: item.quantity,
    }));

    if (existing) {
      const existingIndex = nextProducts.findIndex((item) => item.id === productId);
      nextProducts[existingIndex] = {
        id: productId,
        quantity: existing.quantity + 1,
      };
    } else {
      nextProducts.push({ id: productId, quantity: 1 });
    }

    await updateCart({
      cartId: activeCartId,
      body: {
        merge: true,
        products: nextProducts,
      },
    }).unwrap();
  };

  const handleLogout = () => {
    dispatch(clearSession());
    void persistor.purge();
    navigate("/login", { replace: true });
  };

  return (
    <main className="min-h-svh w-full lg:pl-56">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 pb-6 pt-14">
        <AppNavbar
          title={t("catalog.routeTitle")}
          userName={user ? `${user.firstName} ${user.lastName}` : t("navbar.guest")}
          cartItemCount={cartItemTypesCount}
          onTitleClick={() => navigate("/dashboard")}
          onCartClick={() => navigate("/cart")}
          onProfile={() => navigate("/profile")}
          onLogout={handleLogout}
        />

        <ProductCatalog
          canManageCart={Boolean(activeCartId)}
          isLoading={isProductsLoading || isBootstrappingCart || isUpdatingCart}
          products={productsData?.products ?? []}
          onAddToCart={(product) => void handleAddToCart(product.id)}
        />
      </div>
    </main>
  );
}
