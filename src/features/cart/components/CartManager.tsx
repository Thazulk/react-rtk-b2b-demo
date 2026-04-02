import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CartLineQuantityControls } from "@/features/cart/components/CartLineQuantityControls";

const CART_LINE_SKELETON_COUNT = 4;

function CartLineSkeleton() {
  return (
    <div className="flex items-center justify-between rounded-lg border p-3">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="h-8 w-24 shrink-0" />
    </div>
  );
}

export interface CartLineView {
  product: {
    id: number;
    title: string;
    price: number;
  };
  quantity: number;
  minimumOrderQuantity: number;
}

interface CartManagerProps {
  activeCartId: number | null;
  lines: CartLineView[];
  /** From memoized selector (discounted subtotal); falls back to sum of line price × qty. */
  subtotal?: number;
  /** Placeholder rows while the active cart is loading and lines are not yet known. */
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
              Array.from({ length: CART_LINE_SKELETON_COUNT }, (_, i) => <CartLineSkeleton key={i} />)
            ) : lines.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t("cart.empty")}</p>
            ) : (
              lines.map((line) => (
                <div key={line.product.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex flex-col gap-1">
                    <p className="font-medium">{line.product.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {t("cart.quantityAndPrice", {
                        quantity: String(line.quantity),
                        price: line.product.price.toFixed(2),
                      })}
                    </p>
                  </div>
                  <CartLineQuantityControls
                    quantity={line.quantity}
                    minQuantity={line.minimumOrderQuantity}
                    onDecrement={() => onChangeQuantity(line.product.id, line.quantity - 1)}
                    onIncrement={() => onChangeQuantity(line.product.id, line.quantity + 1)}
                    onRemove={() => onChangeQuantity(line.product.id, 0)}
                  />
                </div>
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
