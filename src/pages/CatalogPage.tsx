import { useEffect, useMemo, useState } from "react";
import { useActiveCart } from "@/features/cart/hooks/use-active-cart";
import { ProductCatalog } from "@/features/catalog/components/ProductCatalog";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectActiveCartId, selectUser } from "@/store/authSlice";
import {
  addOrIncrementDraftLine,
  hydrateUserCartFromApi,
  selectUserDraft,
  setDraftLineQuantity,
} from "@/store/cartDraftSlice";
import { useGetProductsQuery, useUpdateCartMutation } from "@/store/dummyJsonApi";

export function CatalogPage() {
  const pageSize = 12;
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);

  const user = useAppSelector(selectUser);
  const activeCartId = useAppSelector(selectActiveCartId);
  const draft = useAppSelector((state) => selectUserDraft(state, user?.id));
  const [updateCart, { isLoading: isUpdatingCart }] = useUpdateCartMutation();
  const { activeCart, isBootstrappingCart } = useActiveCart({
    userId: user?.id,
    activeCartId,
  });

  const { data: productsData, isLoading: isProductsLoading } = useGetProductsQuery({
    limit: pageSize,
    skip: (page - 1) * pageSize,
  });
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil((productsData?.total ?? pageSize) / pageSize)),
    [pageSize, productsData?.total],
  );

  const cartQuantities = useMemo(() => {
    const map: Partial<Record<number, number>> = {};
    for (const line of draft?.lines ?? []) {
      map[line.id] = line.quantity;
    }
    return map;
  }, [draft?.lines]);

  useEffect(() => {
    if (!user || !activeCart) {
      return;
    }
    dispatch(
      hydrateUserCartFromApi({
        userId: user.id,
        cartId: activeCart.id,
        products: activeCart.products,
      }),
    );
  }, [activeCart, dispatch, user]);

  const handleAddToCart = async (productId: number) => {
    if (!user || !productsData) {
      return;
    }

    const selectedProduct = productsData.products.find((product) => product.id === productId);
    if (!selectedProduct) {
      return;
    }

    dispatch(
      addOrIncrementDraftLine({
        userId: user.id,
        product: {
          id: selectedProduct.id,
          title: selectedProduct.title,
          price: selectedProduct.price,
          thumbnail: selectedProduct.thumbnail,
          discountPercentage: selectedProduct.discountPercentage,
        },
      }),
    );

    const previousLines =
      draft?.lines ??
      activeCart?.products.map((entry) => ({
        id: entry.id,
        title: entry.title,
        price: entry.price,
        quantity: entry.quantity,
        thumbnail: entry.thumbnail,
        discountPercentage: entry.discountPercentage,
      })) ??
      [];

    const existingLine = previousLines.find((line) => line.id === productId);
    const nextLines = existingLine
      ? previousLines.map((line) =>
          line.id === productId ? { ...line, quantity: line.quantity + 1 } : line,
        )
      : [
          ...previousLines,
          {
            id: selectedProduct.id,
            title: selectedProduct.title,
            price: selectedProduct.price,
            quantity: 1,
            thumbnail: selectedProduct.thumbnail,
            discountPercentage: selectedProduct.discountPercentage,
          },
        ];

    if (activeCartId && activeCart) {
      try {
        await updateCart({
          cartId: activeCartId,
          userId: user.id,
          body: {
            merge: true,
            products: nextLines.map((line) => ({
              id: line.id,
              quantity: line.quantity,
            })),
          },
          optimisticProducts: nextLines.map((line) => ({
            id: line.id,
            title: line.title,
            price: line.price,
            discountPercentage: line.discountPercentage,
            thumbnail: line.thumbnail,
          })),
        }).unwrap();
      } catch {
        /* keep draft; API may not persist */
      }
    }
  };

  const handleChangeLineQuantity = async (productId: number, nextQuantity: number) => {
    if (!user) {
      return;
    }

    const safeQuantity = Math.max(0, nextQuantity);
    const sourceLines =
      draft?.lines ??
      activeCart?.products.map((entry) => ({
        id: entry.id,
        title: entry.title,
        price: entry.price,
        quantity: entry.quantity,
        thumbnail: entry.thumbnail,
        discountPercentage: entry.discountPercentage,
      })) ??
      [];

    dispatch(
      setDraftLineQuantity({
        userId: user.id,
        productId,
        quantity: safeQuantity,
      }),
    );

    const nextProducts = sourceLines
      .map((line) =>
        line.id === productId
          ? { id: line.id, quantity: safeQuantity }
          : { id: line.id, quantity: line.quantity },
      )
      .filter((line) => line.quantity > 0);

    if (!activeCartId) {
      return;
    }

    try {
      await updateCart({
        cartId: activeCartId,
        userId: user.id,
        body: {
          merge: true,
          products: nextProducts,
        },
        optimisticProducts: sourceLines.map((line) => ({
          id: line.id,
          title: line.title,
          price: line.price,
          discountPercentage: line.discountPercentage,
          thumbnail: line.thumbnail,
        })),
      }).unwrap();
    } catch {
      /* keep draft */
    }
  };

  return (
    <div className="flex h-full max-h-full min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden">
      <ProductCatalog
        canManageCart={Boolean(user)}
        isLoading={isProductsLoading || isBootstrappingCart || isUpdatingCart}
        currentPage={page}
        totalPages={totalPages}
        onPrevPage={page > 1 ? () => setPage((prev) => prev - 1) : undefined}
        onNextPage={page < totalPages ? () => setPage((prev) => prev + 1) : undefined}
        products={productsData?.products ?? []}
        cartQuantities={user ? cartQuantities : undefined}
        onChangeCartQuantity={
          user ? (productId, next) => void handleChangeLineQuantity(productId, next) : undefined
        }
        onAddToCart={(product) => void handleAddToCart(product.id)}
      />
    </div>
  );
}
