import { CartManager, type CartItemView } from "@/features/cart/components/CartManager";
import { useCartActions } from "@/features/cart/hooks/use-cart-actions";

export function CartPage() {
  const {
    user, cartId, draft, cart,
    draftSubtotal, isBootstrappingCart, changeItemQuantity,
  } = useCartActions();

  const sourceItems = draft?.items ?? cart?.products ?? [];
  const cartItems: CartItemView[] = sourceItems.map((item) => ({
    product: { id: item.id, title: item.title, price: item.price },
    quantity: item.quantity,
    minimumOrderQuantity: "minimumOrderQuantity" in item ? (item.minimumOrderQuantity as number) : 1,
  }));

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col">
      <CartManager
        cartId={cartId}
        items={cartItems}
        subtotal={draftSubtotal}
        showItemSkeletons={Boolean(user) && isBootstrappingCart && cartItems.length === 0}
        onChangeQuantity={(productId, nextQuantity) =>
          void changeItemQuantity(productId, nextQuantity)
        }
      />
    </div>
  );
}
