import { useNavigate } from "react-router";
import { useCartActions } from "@/features/cart/hooks/use-cart-actions";
import { ProductCatalog } from "@/features/catalog/components/ProductCatalog";
import { useCatalogFilters } from "@/features/catalog/hooks/use-catalog-filters";

export function CatalogPage() {
  const navigate = useNavigate();

  const {
    pageSize,
    page,
    setPage,
    searchInput,
    setSearchInput,
    selectedCategory,
    setSelectedCategory,
    categories,
    categoriesLoading,
    products,
    totalPages,
    isProductsLoading,
    isProductsError,
    showListSkeleton,
  } = useCatalogFilters();

  const {
    user,
    cartQuantities,
    isUpdatingCart,
    isBootstrappingCart,
    addToCart,
    changeLineQuantity,
  } = useCartActions();

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
          user ? (productId, next) => void changeLineQuantity(productId, next) : undefined
        }
        onAddToCart={(product) => void addToCart(product)}
        onProductNavigate={(product) => navigate(`/catalog/${product.id}`)}
      />
    </div>
  );
}
