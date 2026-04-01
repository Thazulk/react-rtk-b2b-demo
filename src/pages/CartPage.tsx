import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { AppNavbar } from "@/components/shared/AppNavbar";
import { CartManager } from "@/features/cart/components/CartManager";
import { useActiveCart } from "@/features/cart/hooks/use-active-cart";
import { persistor, useAppDispatch, useAppSelector } from "@/store";
import { clearSession, selectActiveCartId, selectUser } from "@/store/authSlice";
import {
  hydrateUserCartFromApi,
  selectUserDraft,
  selectUserDraftItemTypesCount,
  setDraftLineQuantity,
} from "@/store/cartDraftSlice";
import { useUpdateCartMutation } from "@/store/dummyJsonApi";

export function CartPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const user = useAppSelector(selectUser);
  const activeCartId = useAppSelector(selectActiveCartId);
  const draft = useAppSelector((state) => selectUserDraft(state, user?.id));
  const draftItemTypesCount = useAppSelector((state) => selectUserDraftItemTypesCount(state, user?.id));
  const { activeCart, cartItemTypesCount } = useActiveCart({
    userId: user?.id,
    activeCartId,
  });
  const [updateCart] = useUpdateCartMutation();

  useEffect(() => {
    if (!user || !activeCart) {
      return;
    }
    dispatch(
      hydrateUserCartFromApi({
        userId: user.id,
        cartId: activeCart.id,
        products: activeCart.products,
      }),
    );
  }, [activeCart, dispatch, user]);

  const sourceLines =
    draft?.lines ??
    activeCart?.products.map((product) => ({
      id: product.id,
      title: product.title,
      price: product.price,
      quantity: product.quantity,
      thumbnail: product.thumbnail,
      discountPercentage: product.discountPercentage,
    })) ??
    [];

  const cartLines = sourceLines.map((line) => ({
    product: {
      id: line.id,
      title: line.title,
      price: line.price,
    },
    quantity: line.quantity,
  }));

  const handleChangeQuantity = async (productId: number, nextQuantity: number) => {
    if (!user) {
      return;
    }

    const safeQuantity = Math.max(0, nextQuantity);

    dispatch(
      setDraftLineQuantity({
        userId: user.id,
        productId,
        quantity: safeQuantity,
      }),
    );

    const nextProducts = sourceLines
      .map((line) =>
        line.id === productId
          ? {
              id: line.id,
              quantity: safeQuantity,
            }
          : {
              id: line.id,
              quantity: line.quantity,
            },
      )
      .filter((line) => line.quantity > 0);

    if (!activeCartId) {
      return;
    }

    try {
      await updateCart({
        cartId: activeCartId,
        body: {
          merge: true,
          products: nextProducts,
        },
      }).unwrap();
    } catch {
      /* Draft is already updated; DummyJSON may not persist — keep local state. */
    }
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
          title={t("cart.routeTitle")}
          userName={user ? `${user.firstName} ${user.lastName}` : t("navbar.guest")}
          cartItemCount={draftItemTypesCount || cartItemTypesCount}
          onTitleClick={() => navigate("/")}
          onCartClick={() => navigate("/cart")}
          onProfile={() => navigate("/profile")}
          onLogout={handleLogout}
        />

        <CartManager
          activeCartId={activeCartId}
          lines={cartLines}
          onChangeQuantity={(productId, nextQuantity) => void handleChangeQuantity(productId, nextQuantity)}
        />
      </div>
    </main>
  );
}
