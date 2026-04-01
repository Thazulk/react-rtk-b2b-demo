import { useEffect } from "react";
import { CartManager } from "@/features/cart/components/CartManager";
import { useActiveCart } from "@/features/cart/hooks/use-active-cart";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectActiveCartId, selectUser } from "@/store/authSlice";
import {
  hydrateUserCartFromApi,
  selectUserDraft,
  setDraftLineQuantity,
} from "@/store/cartDraftSlice";
import { useUpdateCartMutation } from "@/store/dummyJsonApi";

export function CartPage() {
  const dispatch = useAppDispatch();

  const user = useAppSelector(selectUser);
  const activeCartId = useAppSelector(selectActiveCartId);
  const draft = useAppSelector((state) => selectUserDraft(state, user?.id));
  const { activeCart } = useActiveCart({
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
        userId: user.id,
        body: {
          merge: true,
          products: nextProducts,
        },
        optimisticProducts: sourceLines.map((line) => ({
          id: line.id,
          title: line.title,
          price: line.price,
          discountPercentage: line.discountPercentage,
          thumbnail: line.thumbnail,
        })),
      }).unwrap();
    } catch {
      /* Draft is already updated; DummyJSON may not persist — keep local state. */
    }
  };

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col">
      <CartManager
      activeCartId={activeCartId}
      lines={cartLines}
      onChangeQuantity={(productId, nextQuantity) => void handleChangeQuantity(productId, nextQuantity)}
    />
    </div>
  );
}
