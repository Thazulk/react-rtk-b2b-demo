import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useActiveCart } from "@/features/cart/hooks/use-active-cart";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectActiveCartId, selectUser } from "@/store/authSlice";
import {
  addOrIncrementDraftLine,
  selectCartQuantitiesMap,
  selectUserDraft,
  selectUserDraftSubtotal,
  setDraftLineQuantity,
} from "@/store/cartDraftSlice";
import { useUpdateCartMutation } from "@/store/dummyJsonApi";
import type { Product } from "@/types/dummyjson";

interface DraftLineLike {
  id: number;
  title: string;
  price: number;
  quantity: number;
  thumbnail: string;
  discountPercentage: number;
}

interface CartLike {
  products: DraftLineLike[];
}

function resolveSourceLines(
  draft: ReturnType<typeof selectUserDraft>,
  activeCart: CartLike | undefined,
): DraftLineLike[] {
  if (draft?.lines) {
    return draft.lines;
  }
  if (!activeCart) {
    return [];
  }
  return activeCart.products.map((entry) => ({
    id: entry.id,
    title: entry.title,
    price: entry.price,
    quantity: entry.quantity,
    thumbnail: entry.thumbnail,
    discountPercentage: entry.discountPercentage,
  }));
}

export function useCartActions() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const activeCartId = useAppSelector(selectActiveCartId);
  const draft = useAppSelector((state) => selectUserDraft(state, user?.id));
  const cartQuantities = useAppSelector((state) => selectCartQuantitiesMap(state, user?.id));
  const draftSubtotal = useAppSelector((state) => selectUserDraftSubtotal(state, user?.id));
  const [updateCart, { isLoading: isUpdatingCart }] = useUpdateCartMutation();
  const { activeCart, isBootstrappingCart } = useActiveCart({
    userId: user?.id,
    activeCartId,
  });

  const addToCart = async (product: Product) => {
    if (!user) {
      return;
    }

    const moq = product.minimumOrderQuantity ?? 1;

    dispatch(
      addOrIncrementDraftLine({
        userId: user.id,
        product: {
          id: product.id,
          title: product.title,
          price: product.price,
          thumbnail: product.thumbnail,
          discountPercentage: product.discountPercentage,
          minimumOrderQuantity: moq,
        },
      }),
    );

    const previousLines = resolveSourceLines(draft, activeCart);
    const existingLine = previousLines.find((line) => line.id === product.id);
    const initialQty = Math.max(1, moq);
    const nextLines = existingLine
      ? previousLines.map((line) =>
          line.id === product.id ? { ...line, quantity: line.quantity + 1 } : line,
        )
      : [
          ...previousLines,
          {
            id: product.id,
            title: product.title,
            price: product.price,
            quantity: initialQty,
            thumbnail: product.thumbnail,
            discountPercentage: product.discountPercentage,
          },
        ];

    if (activeCartId && activeCart) {
      try {
        await updateCart({
          cartId: activeCartId,
          body: {
            merge: true,
            products: nextLines.map((line) => ({ id: line.id, quantity: line.quantity })),
          },
          optimisticProducts: nextLines.map((line) => ({
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
    }
  };

  const changeLineQuantity = async (productId: number, nextQuantity: number) => {
    if (!user) {
      return;
    }

    const safeQuantity = Math.max(0, nextQuantity);
    const sourceLines = resolveSourceLines(draft, activeCart);

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
          ? { id: line.id, quantity: safeQuantity }
          : { id: line.id, quantity: line.quantity },
      )
      .filter((line) => line.quantity > 0);

    if (!activeCartId) {
      return;
    }

    try {
      await updateCart({
        cartId: activeCartId,
        body: { merge: true, products: nextProducts },
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

  return {
    user,
    activeCartId,
    draft,
    activeCart,
    cartQuantities,
    draftSubtotal,
    isUpdatingCart,
    isBootstrappingCart,
    addToCart,
    changeLineQuantity,
  };
}
