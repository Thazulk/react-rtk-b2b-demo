import { CartManager } from "@/features/cart/components/CartManager";
import { useCartActions } from "@/features/cart/hooks/use-cart-actions";
import { buildCartLines } from "@/features/cart/utils/build-cart-lines";

export function CartPage() {
  const {
    user,
    activeCartId,
    draft,
    activeCart,
    draftSubtotal,
    isBootstrappingCart,
    changeLineQuantity,
  } = useCartActions();

  const cartLines = buildCartLines(draft?.lines, activeCart?.products);

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col">
      <CartManager
        activeCartId={activeCartId}
        lines={cartLines}
        subtotal={draftSubtotal}
        showLineSkeletons={Boolean(user) && isBootstrappingCart && cartLines.length === 0}
        onChangeQuantity={(productId, nextQuantity) =>
          void changeLineQuantity(productId, nextQuantity)
        }
      />
    </div>
  );
}
