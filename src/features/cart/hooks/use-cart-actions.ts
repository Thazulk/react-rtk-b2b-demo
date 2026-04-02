import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useActiveCart } from "@/features/cart/hooks/use-active-cart";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectActiveCartId, selectUser } from "@/store/authSlice";
import {
  addOrIncrementDraftItem,
  selectCartQuantitiesMap,
  selectUserDraft,
  selectUserDraftSubtotal,
  setDraftItemQuantity,
} from "@/store/cartDraftSlice";
import { useUpdateCartMutation } from "@/store/dummyJsonApi";
import type { Product } from "@/types/dummyjson";

interface DraftItemLike {
  id: number;
  title: string;
  price: number;
  quantity: number;
  thumbnail: string;
  discountPercentage: number;
}

interface CartLike {
  products: DraftItemLike[];
}

function resolveSourceItems(
  draft: ReturnType<typeof selectUserDraft>,
  activeCart: CartLike | undefined,
): DraftItemLike[] {
  if (draft?.items) {
    return draft.items;
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
      addOrIncrementDraftItem({
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

    const previousItems = resolveSourceItems(draft, activeCart);
    const existingItem = previousItems.find((item) => item.id === product.id);
    const initialQty = Math.max(1, moq);
    const nextItems = existingItem
      ? previousItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      : [
          ...previousItems,
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
            products: nextItems.map((item) => ({ id: item.id, quantity: item.quantity })),
          },
          optimisticProducts: nextItems.map((item) => ({
            id: item.id,
            title: item.title,
            price: item.price,
            discountPercentage: item.discountPercentage,
            thumbnail: item.thumbnail,
          })),
        }).unwrap();
      } catch {
        toast.error(t("errors.updateCartFailed"));
      }
    }
  };

  const changeItemQuantity = async (productId: number, nextQuantity: number) => {
    if (!user) {
      return;
    }

    const safeQuantity = Math.max(0, nextQuantity);
    const sourceItems = resolveSourceItems(draft, activeCart);

    dispatch(
      setDraftItemQuantity({
        userId: user.id,
        productId,
        quantity: safeQuantity,
      }),
    );

    const nextProducts = sourceItems
      .map((item) =>
        item.id === productId
          ? { id: item.id, quantity: safeQuantity }
          : { id: item.id, quantity: item.quantity },
      )
      .filter((item) => item.quantity > 0);

    if (!activeCartId) {
      return;
    }

    try {
      await updateCart({
        cartId: activeCartId,
        body: { merge: true, products: nextProducts },
        optimisticProducts: sourceItems.map((item) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          discountPercentage: item.discountPercentage,
          thumbnail: item.thumbnail,
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
    changeItemQuantity,
  };
}
