import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { AppNavbar } from "@/components/shared/AppNavbar";
import { useActiveCart } from "@/features/cart/hooks/use-active-cart";
import { ProductCatalog } from "@/features/catalog/components/ProductCatalog";
import { persistor, useAppDispatch, useAppSelector } from "@/store";
import { clearSession, selectActiveCartId, selectUser } from "@/store/authSlice";
import {
  addOrIncrementDraftLine,
  hydrateUserCartFromApi,
  selectUserDraft,
  selectUserDraftItemTypesCount,
} from "@/store/cartDraftSlice";
import { useGetProductsQuery, useUpdateCartMutation } from "@/store/dummyJsonApi";

export function CatalogPage() {
  const pageSize = 12;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);

  const user = useAppSelector(selectUser);
  const activeCartId = useAppSelector(selectActiveCartId);
  const draft = useAppSelector((state) => selectUserDraft(state, user?.id));
  const draftItemTypesCount = useAppSelector((state) => selectUserDraftItemTypesCount(state, user?.id));
  const [updateCart, { isLoading: isUpdatingCart }] = useUpdateCartMutation();
  const { activeCart, cartItemTypesCount, isBootstrappingCart } = useActiveCart({
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
      await updateCart({
        cartId: activeCartId,
        body: {
          merge: true,
          products: nextLines.map((line) => ({
            id: line.id,
            quantity: line.quantity,
          })),
        },
      }).unwrap();
    }
  };

  const handleLogout = () => {
    dispatch(clearSession());
    void persistor.purge();
    navigate("/login", { replace: true });
  };

  return (
    <main className="min-h-svh w-full lg:pl-56">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 pb-6 pt-14">
        <AppNavbar
          title={t("catalog.routeTitle")}
          userName={user ? `${user.firstName} ${user.lastName}` : t("navbar.guest")}
          cartItemCount={draftItemTypesCount || cartItemTypesCount}
          onTitleClick={() => navigate("/")}
          onCartClick={user ? () => navigate("/cart") : undefined}
          onProfile={user ? () => navigate("/profile") : undefined}
          onLogout={user ? handleLogout : undefined}
          onLogin={!user ? () => navigate("/login") : undefined}
        />

        <ProductCatalog
          canManageCart={Boolean(user)}
          isLoading={isProductsLoading || isBootstrappingCart || isUpdatingCart}
          currentPage={page}
          totalPages={totalPages}
          onPrevPage={page > 1 ? () => setPage((prev) => prev - 1) : undefined}
          onNextPage={page < totalPages ? () => setPage((prev) => prev + 1) : undefined}
          products={productsData?.products ?? []}
          onAddToCart={(product) => void handleAddToCart(product.id)}
        />
      </div>
    </main>
  );
}
