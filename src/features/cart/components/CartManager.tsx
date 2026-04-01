import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CartLineQuantityControls } from "@/features/cart/components/CartLineQuantityControls";

export interface CartLineView {
  product: {
    id: number;
    title: string;
    price: number;
  };
  quantity: number;
}

interface CartManagerProps {
  activeCartId: number | null;
  lines: CartLineView[];
  onChangeQuantity: (productId: number, nextQuantity: number) => void;
}

export function CartManager({ activeCartId, lines, onChangeQuantity }: CartManagerProps) {
  const { t } = useTranslation();
  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("cart.title")}</CardTitle>
        <CardDescription>{t("cart.cartId", { id: String(activeCartId ?? "n/a") })}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {lines.length === 0 ? (
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
                onDecrement={() => onChangeQuantity(line.product.id, line.quantity - 1)}
                onIncrement={() => onChangeQuantity(line.product.id, line.quantity + 1)}
                onRemove={() => onChangeQuantity(line.product.id, 0)}
              />
            </div>
          ))
        )}
        <div className="flex justify-end border-t pt-3 text-sm font-medium">
          {t("cart.total", { total: subtotal.toFixed(2) })}
        </div>
      </CardContent>
    </Card>
  );
}
