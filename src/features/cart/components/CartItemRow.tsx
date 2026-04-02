import { useTranslation } from "react-i18next";
import { CartItemQuantityControls } from "@/features/cart/components/CartItemQuantityControls";
import type { CartItemView } from "@/features/cart/components/CartManager";

interface CartItemRowProps {
  item: CartItemView;
  onChangeQuantity: (productId: number, nextQuantity: number) => void;
}

export function CartItemRow({ item, onChangeQuantity }: CartItemRowProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between rounded-lg border p-3">
      <div className="flex flex-col gap-1">
        <p className="font-medium">{item.product.title}</p>
        <p className="text-xs text-muted-foreground">
          {t("cart.quantityAndPrice", {
            quantity: String(item.quantity),
            price: item.product.price.toFixed(2),
          })}
        </p>
      </div>
      <CartItemQuantityControls
        quantity={item.quantity}
        minQuantity={item.minimumOrderQuantity}
        onDecrement={() => onChangeQuantity(item.product.id, item.quantity - 1)}
        onIncrement={() => onChangeQuantity(item.product.id, item.quantity + 1)}
        onRemove={() => onChangeQuantity(item.product.id, 0)}
      />
    </div>
  );
}
