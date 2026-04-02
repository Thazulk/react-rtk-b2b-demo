import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useActiveCart } from "@/features/cart/hooks/use-active-cart";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectUser } from "@/store/authSlice";
import {
  addOrIncrementDraftItem,
  selectCartQuantitiesMap,
  selectUserDraft,
  selectUserDraftSubtotal,
  setDraftItemQuantity,
} from "@/store/cartDraftSlice";
import { useUpdateCartMutation } from "@/store/dummyJsonApi";
import type { Product } from "@/types/dummyjson";

function getSourceItems(
  draft: ReturnType<typeof selectUserDraft>,
  cart: { products: Array<{ id: number; title: string; price: number; quantity: number; thumbnail: string; discountPercentage: number }> } | null,
) {
  return draft?.items ?? cart?.products.map((p) => ({
    id: p.id, title: p.title, price: p.price, quantity: p.quantity,
    thumbnail: p.thumbnail, discountPercentage: p.discountPercentage,
  })) ?? [];
}

export function useCartActions() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const draft = useAppSelector((state) => selectUserDraft(state, user?.id));
  const cartQuantities = useAppSelector((state) => selectCartQuantitiesMap(state, user?.id));
  const draftSubtotal = useAppSelector((state) => selectUserDraftSubtotal(state, user?.id));
  const [updateCart, { isLoading: isUpdatingCart }] = useUpdateCartMutation();
  const { cartId, cart, isBootstrappingCart } = useActiveCart(user?.id);

  const syncCart = async (items: Array<{ id: number; title: string; price: number; quantity: number; thumbnail: string; discountPercentage: number }>) => {
    if (!cartId || !cart) return;
    try {
      await updateCart({
        cartId,
        body: {
          merge: true,
          products: items.map((i) => ({ id: i.id, quantity: i.quantity })),
        },
        optimisticProducts: items.map((i) => ({
          id: i.id, title: i.title, price: i.price,
          discountPercentage: i.discountPercentage, thumbnail: i.thumbnail,
        })),
      }).unwrap();
    } catch {
      toast.error(t("errors.updateCartFailed"));
    }
  };

  const addToCart = async (product: Product) => {
    if (!user) return;

    const moq = product.minimumOrderQuantity ?? 1;
    dispatch(addOrIncrementDraftItem({
      userId: user.id,
      product: {
        id: product.id, title: product.title, price: product.price,
        thumbnail: product.thumbnail, discountPercentage: product.discountPercentage,
        minimumOrderQuantity: moq,
      },
    }));

    const prev = getSourceItems(draft, cart);
    const existing = prev.find((i) => i.id === product.id);
    const nextItems = existing
      ? prev.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      : [...prev, {
          id: product.id, title: product.title, price: product.price,
          quantity: Math.max(1, moq), thumbnail: product.thumbnail,
          discountPercentage: product.discountPercentage,
        }];

    await syncCart(nextItems);
  };

  const changeItemQuantity = async (productId: number, nextQuantity: number) => {
    if (!user) return;

    const safeQty = Math.max(0, nextQuantity);
    dispatch(setDraftItemQuantity({ userId: user.id, productId, quantity: safeQty }));

    const source = getSourceItems(draft, cart);
    const nextItems = source
      .map((i) => i.id === productId ? { ...i, quantity: safeQty } : i)
      .filter((i) => i.quantity > 0);

    await syncCart(nextItems);
  };

  return {
    user, cartId, draft, cart,
    cartQuantities, draftSubtotal,
    isUpdatingCart, isBootstrappingCart,
    addToCart, changeItemQuantity,
  };
}
