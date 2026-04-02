import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CartItemRow } from "@/features/cart/components/CartItemRow";
import { CartItemSkeleton } from "@/features/cart/components/CartItemSkeleton";
import type { CartItemView } from "@/features/cart/types/cart-item-view";

const CART_ITEM_SKELETON_COUNT = 4;

interface CartManagerProps {
  activeCartId: number | null;
  items: CartItemView[];
  subtotal?: number;
  showItemSkeletons?: boolean;
  onChangeQuantity: (productId: number, nextQuantity: number) => void;
}

export function CartManager({
  activeCartId,
  items,
  subtotal: subtotalProp,
  showItemSkeletons = false,
  onChangeQuantity,
}: CartManagerProps) {
  const { t } = useTranslation();
  const subtotal =
    subtotalProp ??
    items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <Card className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
      <CardHeader className="shrink-0">
        <CardTitle>{t("cart.title")}</CardTitle>
        <CardDescription>{t("cart.cartId", { id: String(activeCartId ?? "n/a") })}</CardDescription>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col gap-0 overflow-hidden p-0">
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-2">
          <div className="flex flex-col gap-3">
            {showItemSkeletons ? (
              Array.from({ length: CART_ITEM_SKELETON_COUNT }, (_, i) => (
                <CartItemSkeleton key={i} />
              ))
            ) : items.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t("cart.empty")}</p>
            ) : (
              items.map((item) => (
                <CartItemRow
                  key={item.product.id}
                  item={item}
                  onChangeQuantity={onChangeQuantity}
                />
              ))
            )}
          </div>
        </div>
        <div className="flex shrink-0 justify-end border-t px-4 py-3 text-sm font-medium">
          {t("cart.total", { total: subtotal.toFixed(2) })}
        </div>
      </CardContent>
    </Card>
  );
}
