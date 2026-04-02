import type { CartLineView } from "@/features/cart/types/cart-line-view";
import type { CartProduct } from "@/types/dummyjson";

interface DraftLine {
  id: number;
  title: string;
  price: number;
  quantity: number;
  minimumOrderQuantity: number;
}

export function buildCartLines(
  draftLines: DraftLine[] | null | undefined,
  apiProducts: CartProduct[] | undefined,
): CartLineView[] {
  const sourceLines: DraftLine[] =
    draftLines ??
    apiProducts?.map((p) => ({
      id: p.id,
      title: p.title,
      price: p.price,
      quantity: p.quantity,
      minimumOrderQuantity: 1,
    })) ??
    [];

  return sourceLines.map((line) => ({
    product: {
      id: line.id,
      title: line.title,
      price: line.price,
    },
    quantity: line.quantity,
    minimumOrderQuantity: line.minimumOrderQuantity,
  }));
}
