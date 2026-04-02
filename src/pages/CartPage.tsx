import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { CartManager } from "@/features/cart/components/CartManager";
import { useActiveCart } from "@/features/cart/hooks/use-active-cart";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectActiveCartId, selectUser } from "@/store/authSlice";
import {
  selectUserDraft,
  selectUserDraftSubtotal,
  setDraftLineQuantity,
} from "@/store/cartDraftSlice";
import { useUpdateCartMutation } from "@/store/dummyJsonApi";

export function CartPage() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const user = useAppSelector(selectUser);
  const activeCartId = useAppSelector(selectActiveCartId);
  const draft = useAppSelector((state) => selectUserDraft(state, user?.id));
  const draftSubtotal = useAppSelector((state) => selectUserDraftSubtotal(state, user?.id));
  const { activeCart, isBootstrappingCart } = useActiveCart({
    userId: user?.id,
    activeCartId,
  });
  const [updateCart] = useUpdateCartMutation();

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
        optimisticProducts: sourceLines.map((line) => ({
          id: line.id,
          title: line.title,
          price: line.price,
          discountPercentage: line.discountPercentage,
          thumbnail: line.thumbnail,
        })),
      }).unwrap();
    } catch {
      toast.error(t("errors.updateCartFailed"));
    }
  };

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col">
      <CartManager
        activeCartId={activeCartId}
        lines={cartLines}
        subtotal={draftSubtotal}
        showLineSkeletons={Boolean(user) && isBootstrappingCart && cartLines.length === 0}
        onChangeQuantity={(productId, nextQuantity) =>
          void handleChangeQuantity(productId, nextQuantity)
        }
      />
    </div>
  );
}
