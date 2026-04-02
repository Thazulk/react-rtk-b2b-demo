import { useAppDispatch } from "@/store";
import { hydrateUserCartFromApi } from "@/store/cartDraftSlice";
import { useGetCartsByUserQuery } from "@/store/dummyJsonApi";
import { useEffect } from "react";

export function useActiveCart(userId?: number) {
  const dispatch = useAppDispatch();

  const { data: userCarts, isFetching } = useGetCartsByUserQuery(userId ?? 0, {
    skip: !userId,
  });

  const cart = userCarts?.carts[0] ?? null;
  const cartId = cart?.id ?? null;

  useEffect(() => {
    if (!userId || !cart) return;
    dispatch(
      hydrateUserCartFromApi({
        userId,
        cartId: cart.id,
        products: cart.products,
      }),
    );
  }, [cart, dispatch, userId]);

  return {
    cartId,
    cart,
    cartItemTypesCount: cart?.products.length ?? 0,
    isBootstrappingCart: isFetching,
  };
}
