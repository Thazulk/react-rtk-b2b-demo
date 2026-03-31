import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Product } from "@/types/dummyjson";

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
  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aktiv kosar</CardTitle>
        <CardDescription>Kosar ID: {activeCartId ?? "n/a"}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {lines.length === 0 ? (
          <p className="text-sm text-muted-foreground">A kosarad jelenleg ures.</p>
        ) : (
          lines.map((line) => (
            <div key={line.product.id} className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex flex-col gap-1">
                <p className="font-medium">{line.product.title}</p>
                <p className="text-xs text-muted-foreground">
                  {line.quantity} db x {line.product.price.toFixed(2)} EUR
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
          Osszesen: {subtotal.toFixed(2)} EUR
        </div>
      </CardContent>
    </Card>
  );
}
