import type { CartItemView } from "@/features/cart/types/cart-item-view";
import type { CartProduct } from "@/types/dummyjson";

interface DraftItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  minimumOrderQuantity: number;
}

export function buildCartItems(
  draftItems: DraftItem[] | null | undefined,
  apiProducts: CartProduct[] | undefined,
): CartItemView[] {
  const sourceItems: DraftItem[] =
    draftItems ??
    apiProducts?.map((p) => ({
      id: p.id,
      title: p.title,
      price: p.price,
      quantity: p.quantity,
      minimumOrderQuantity: 1,
    })) ??
    [];

  return sourceItems.map((item) => ({
    product: {
      id: item.id,
      title: item.title,
      price: item.price,
    },
    quantity: item.quantity,
    minimumOrderQuantity: item.minimumOrderQuantity,
  }));
}
