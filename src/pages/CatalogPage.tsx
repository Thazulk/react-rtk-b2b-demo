import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useActiveCart } from "@/features/cart/hooks/use-active-cart";
import { ProductCatalog } from "@/features/catalog/components/ProductCatalog";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectActiveCartId, selectUser } from "@/store/authSlice";
import {
  addOrIncrementDraftLine,
  selectCartQuantitiesMap,
  selectUserDraft,
  setDraftLineQuantity,
} from "@/store/cartDraftSlice";
import {
  useGetCategoriesQuery,
  useGetProductsByCategoryQuery,
  useGetProductsQuery,
  useSearchProductsQuery,
  useUpdateCartMutation,
} from "@/store/dummyJsonApi";
import type { ProductListResponse } from "@/types/dummyjson";

const listSelectFromResult = {
  selectFromResult: ({
    data,
    isLoading,
    isError,
  }: {
    data?: ProductListResponse;
    isLoading: boolean;
    isError: boolean;
  }) => ({
    products: data?.products ?? [],
    total: data?.total ?? 0,
    isLoading,
    isError,
  }),
};

export function CatalogPage() {
  const pageSize = 12;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedSearch(searchInput.trim()), 300);
    return () => window.clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedCategory]);

  const user = useAppSelector(selectUser);
  const activeCartId = useAppSelector(selectActiveCartId);
  const draft = useAppSelector((state) => selectUserDraft(state, user?.id));
  const cartQuantities = useAppSelector((state) => selectCartQuantitiesMap(state, user?.id));
  const [updateCart, { isLoading: isUpdatingCart }] = useUpdateCartMutation();
  const { activeCart, isBootstrappingCart } = useActiveCart({
    userId: user?.id,
    activeCartId,
  });

  const { data: categories = [], isLoading: categoriesLoading } = useGetCategoriesQuery();

  const skipCategory = !selectedCategory;
  const skipSearch = Boolean(selectedCategory) || debouncedSearch.length === 0;
  const skipList = Boolean(selectedCategory) || debouncedSearch.length > 0;

  const categoryQuery = useGetProductsByCategoryQuery(
    {
      category: selectedCategory ?? "",
      limit: pageSize,
      skip: (page - 1) * pageSize,
    },
    { skip: skipCategory, ...listSelectFromResult },
  );

  const searchQuery = useSearchProductsQuery(
    {
      q: debouncedSearch,
      limit: pageSize,
      skip: (page - 1) * pageSize,
    },
    { skip: skipSearch, ...listSelectFromResult },
  );

  const listQuery = useGetProductsQuery(
    { limit: pageSize, skip: (page - 1) * pageSize },
    { skip: skipList, ...listSelectFromResult },
  );

  const active = selectedCategory
    ? categoryQuery
    : debouncedSearch.length > 0
      ? searchQuery
      : listQuery;

  const { products, total, isLoading: isProductsLoading, isError: isProductsError } = active;

  const totalPages = Math.max(1, Math.ceil((total || pageSize) / pageSize));

  const handleAddToCart = async (productId: number) => {
    if (!user) {
      return;
    }

    const selectedProduct = products.find((product) => product.id === productId);
    if (!selectedProduct) {
      return;
    }

    const moq = selectedProduct.minimumOrderQuantity ?? 1;

    dispatch(
      addOrIncrementDraftLine({
        userId: user.id,
        product: {
          id: selectedProduct.id,
          title: selectedProduct.title,
          price: selectedProduct.price,
          thumbnail: selectedProduct.thumbnail,
          discountPercentage: selectedProduct.discountPercentage,
          minimumOrderQuantity: moq,
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
    const initialQty = Math.max(1, moq);
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
            quantity: initialQty,
            thumbnail: selectedProduct.thumbnail,
            discountPercentage: selectedProduct.discountPercentage,
          },
        ];

    if (activeCartId && activeCart) {
      try {
        await updateCart({
          cartId: activeCartId,
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
        toast.error(t("errors.updateCartFailed"));
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
      toast.error(t("errors.updateCartFailed"));
    }
  };

  const showListSkeleton = isProductsLoading || categoriesLoading;

  return (
    <div className="flex h-full max-h-full min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden">
      <ProductCatalog
        canManageCart={Boolean(user)}
        isLoading={isProductsLoading || isBootstrappingCart || isUpdatingCart || categoriesLoading}
        showListSkeleton={showListSkeleton}
        skeletonRowCount={pageSize}
        isError={isProductsError}
        searchInput={searchInput}
        onSearchChange={setSearchInput}
        categories={categories}
        categoriesLoading={categoriesLoading}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        currentPage={page}
        totalPages={totalPages}
        onPrevPage={page > 1 ? () => setPage((prev) => prev - 1) : undefined}
        onNextPage={page < totalPages ? () => setPage((prev) => prev + 1) : undefined}
        products={products}
        cartQuantities={user ? cartQuantities : undefined}
        onChangeCartQuantity={
          user ? (productId, next) => void handleChangeLineQuantity(productId, next) : undefined
        }
        onAddToCart={(product) => void handleAddToCart(product.id)}
        onProductNavigate={(product) => navigate(`/catalog/${product.id}`)}
      />
    </div>
  );
}
