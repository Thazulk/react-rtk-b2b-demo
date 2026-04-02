import { CartManager } from "@/features/cart/components/CartManager";
import { useCartActions } from "@/features/cart/hooks/use-cart-actions";
import { buildCartItems } from "@/features/cart/utils/build-cart-items";

export function CartPage() {
  const {
    user,
    activeCartId,
    draft,
    activeCart,
    draftSubtotal,
    isBootstrappingCart,
    changeItemQuantity,
  } = useCartActions();

  const cartItems = buildCartItems(draft?.items, activeCart?.products);

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col">
      <CartManager
        activeCartId={activeCartId}
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
