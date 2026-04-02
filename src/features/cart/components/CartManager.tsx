import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CartLineRow } from "@/features/cart/components/CartLineRow";
import { CartLineSkeleton } from "@/features/cart/components/CartLineSkeleton";
import type { CartLineView } from "@/features/cart/types/cart-line-view";

const CART_LINE_SKELETON_COUNT = 4;

interface CartManagerProps {
  activeCartId: number | null;
  lines: CartLineView[];
  subtotal?: number;
  showLineSkeletons?: boolean;
  onChangeQuantity: (productId: number, nextQuantity: number) => void;
}

export function CartManager({
  activeCartId,
  lines,
  subtotal: subtotalProp,
  showLineSkeletons = false,
  onChangeQuantity,
}: CartManagerProps) {
  const { t } = useTranslation();
  const subtotal =
    subtotalProp ??
    lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);

  return (
    <Card className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
      <CardHeader className="shrink-0">
        <CardTitle>{t("cart.title")}</CardTitle>
        <CardDescription>{t("cart.cartId", { id: String(activeCartId ?? "n/a") })}</CardDescription>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col gap-0 overflow-hidden p-0">
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-2">
          <div className="flex flex-col gap-3">
            {showLineSkeletons ? (
              Array.from({ length: CART_LINE_SKELETON_COUNT }, (_, i) => (
                <CartLineSkeleton key={i} />
              ))
            ) : lines.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t("cart.empty")}</p>
            ) : (
              lines.map((line) => (
                <CartLineRow
                  key={line.product.id}
                  line={line}
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
