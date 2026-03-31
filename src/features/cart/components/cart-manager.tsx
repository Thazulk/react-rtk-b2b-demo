import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Product } from "@/types/dummyjson";
import { useTranslation } from "react-i18next";

export interface CartLine {
  product: Product;
  quantity: number;
}

interface CartManagerProps {
  activeCartId: number | null;
  lines: CartLine[];
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
              <div className="flex items-center gap-2">
                <Button
                  size="icon-sm"
                  variant="outline"
                  onClick={() => onChangeQuantity(line.product.id, line.quantity - 1)}
                >
                  -
                </Button>
                <span className="w-7 text-center text-sm">{line.quantity}</span>
                <Button
                  size="icon-sm"
                  variant="outline"
                  onClick={() => onChangeQuantity(line.product.id, line.quantity + 1)}
                >
                  +
                </Button>
              </div>
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
