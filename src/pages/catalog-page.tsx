import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { AppNavbar } from "@/components/shared/app-navbar";
import { ProductCatalog } from "@/features/catalog/components/product-catalog";
import { clearSession, selectUser, setActiveCartId, selectActiveCartId } from "@/store/authSlice";
import {
  useAddCartMutation,
  useGetCartByIdQuery,
  useGetCartsByUserQuery,
  useGetProductsQuery,
  useUpdateCartMutation,
} from "@/store/dummyJsonApi";
import { persistor, useAppDispatch, useAppSelector } from "@/store";

export function CatalogPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const user = useAppSelector(selectUser);
  const activeCartId = useAppSelector(selectActiveCartId);
  const [addCart, { isLoading: isAddingCart }] = useAddCartMutation();
  const [updateCart, { isLoading: isUpdatingCart }] = useUpdateCartMutation();

  const { data: productsData, isLoading: isProductsLoading } = useGetProductsQuery({ limit: 20 });
  const { data: userCarts, isFetching: isCartsFetching } = useGetCartsByUserQuery(user?.id ?? 0, {
    skip: !user,
  });
  const { data: activeCart } = useGetCartByIdQuery(activeCartId ?? 0, {
    skip: !activeCartId,
  });

  const cartItemTypesCount = activeCart?.products.length ?? 0;

  useEffect(() => {
    if (activeCartId || !user || !userCarts) {
      return;
    }

    if (userCarts.carts.length > 0) {
      dispatch(setActiveCartId(userCarts.carts[0].id));
      return;
    }

    const bootstrapCart = async () => {
      const createdCart = await addCart({
        userId: user.id,
        products: [{ id: 1, quantity: 1 }],
      }).unwrap();
      dispatch(setActiveCartId(createdCart.id));
    };

    void bootstrapCart();
  }, [activeCartId, addCart, dispatch, user, userCarts]);

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
        isLoading={isProductsLoading || isCartsFetching || isAddingCart || isUpdatingCart}
        products={productsData?.products ?? []}
        onAddToCart={(product) => void handleAddToCart(product.id)}
      />
    </main>
  );
}
