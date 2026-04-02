import { useTranslation } from "react-i18next";
import { CartLineQuantityControls } from "@/features/cart/components/CartLineQuantityControls";
import type { CartLineView } from "@/features/cart/types/cart-line-view";

interface CartLineRowProps {
  line: CartLineView;
  onChangeQuantity: (productId: number, nextQuantity: number) => void;
}

export function CartLineRow({ line, onChangeQuantity }: CartLineRowProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between rounded-lg border p-3">
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
  );
}
