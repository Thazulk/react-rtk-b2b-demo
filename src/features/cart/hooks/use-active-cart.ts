import { useAppDispatch } from "@/store";
import { setActiveCartId } from "@/store/authSlice";
import { hydrateUserCartFromApi } from "@/store/cartDraftSlice";
import {
  useGetCartByIdQuery,
  useGetCartsByUserQuery,
} from "@/store/dummyJsonApi";
import { useEffect } from "react";

interface UseActiveCartParams {
  userId?: number;
  activeCartId: number | null;
}

export function useActiveCart({ userId, activeCartId }: UseActiveCartParams) {
  const dispatch = useAppDispatch();

  const { data: userCarts, isFetching: isCartsFetching } =
    useGetCartsByUserQuery(userId ?? 0, {
      skip: !userId,
    });

  const {
    data: activeCart,
    error: activeCartError,
    isFetching: isActiveCartFetching,
  } = useGetCartByIdQuery(activeCartId ?? 0, {
    skip: !activeCartId,
  });

  useEffect(() => {
    if (!userId || !userCarts) {
      return;
    }

    if (activeCartId) {
      return;
    }

    if (userCarts.carts.length > 0) {
      dispatch(setActiveCartId(userCarts.carts[0].id));
      return;
    }
    dispatch(setActiveCartId(null));
  }, [activeCartId, dispatch, userCarts, userId]);

  useEffect(() => {
    const isNotFound =
      typeof activeCartError === "object" &&
      activeCartError !== null &&
      "status" in activeCartError &&
      activeCartError.status === 404;

    if (isNotFound && userId) {
      dispatch(setActiveCartId(null));
    }
  }, [activeCartError, dispatch, userId]);

  useEffect(() => {
    if (!userId || !activeCart) {
      return;
    }
    dispatch(
      hydrateUserCartFromApi({
        userId,
        cartId: activeCart.id,
        products: activeCart.products,
      }),
    );
  }, [activeCart, dispatch, userId]);

  return {
    activeCartId,
    activeCart,
    cartItemTypesCount: activeCart?.products.length ?? 0,
    isBootstrappingCart: isCartsFetching || isActiveCartFetching,
  };
}
