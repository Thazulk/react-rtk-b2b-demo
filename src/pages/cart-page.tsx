import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { AppNavbar } from "@/components/shared/app-navbar";
import { CartManager } from "@/features/cart/components/cart-manager";
import { clearSession, selectActiveCartId, selectUser, setActiveCartId } from "@/store/authSlice";
import {
  useAddCartMutation,
  useGetCartByIdQuery,
  useGetCartsByUserQuery,
  useUpdateCartMutation,
} from "@/store/dummyJsonApi";
import { persistor, useAppDispatch, useAppSelector } from "@/store";

export function CartPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const user = useAppSelector(selectUser);
  const activeCartId = useAppSelector(selectActiveCartId);
  const [addCart] = useAddCartMutation();
  const [updateCart] = useUpdateCartMutation();
  const { data: userCarts } = useGetCartsByUserQuery(user?.id ?? 0, {
    skip: !user,
  });
  const { data: activeCart } = useGetCartByIdQuery(activeCartId ?? 0, {
    skip: !activeCartId,
  });

  const cartItemTypesCount = activeCart?.products.length ?? 0;
  const cartLines =
    activeCart?.products.map((product) => ({
      product: {
        id: product.id,
        title: product.title,
        price: product.price,
      },
      quantity: product.quantity,
    })) ?? [];

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

  const handleChangeQuantity = async (productId: number, nextQuantity: number) => {
    if (!activeCartId || !activeCart) {
      return;
    }

    const nextProducts = activeCart.products
      .map((item) => ({ id: item.id, quantity: item.quantity }))
      .map((item) =>
        item.id === productId
          ? {
              id: item.id,
              quantity: nextQuantity,
            }
          : item,
      )
      .filter((item) => item.quantity > 0);

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
        onChangeQuantity={(productId, nextQuantity) => void handleChangeQuantity(productId, nextQuantity)}
      />
    </main>
  );
}
