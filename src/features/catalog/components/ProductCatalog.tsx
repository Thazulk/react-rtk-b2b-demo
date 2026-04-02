import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CatalogFilters } from "@/features/catalog/components/CatalogFilters";
import { CatalogPagination } from "@/features/catalog/components/CatalogPagination";
import { ProductRow } from "@/features/catalog/components/ProductRow";
import { ProductRowSkeleton } from "@/features/catalog/components/ProductRowSkeleton";
import type { Product, ProductCategory } from "@/types/dummyjson";

interface ProductCatalogProps {
  products: Product[];
  canManageCart: boolean;
  isLoading?: boolean;
  showListSkeleton?: boolean;
  skeletonRowCount?: number;
  isError?: boolean;
  errorMessage?: string;
  currentPage?: number;
  totalPages?: number;
  onPrevPage?: () => void;
  onNextPage?: () => void;
  cartQuantities?: Partial<Record<number, number>>;
  onChangeCartQuantity?: (productId: number, nextQuantity: number) => void;
  onAddToCart?: (product: Product) => void;
  onProductNavigate?: (product: Product) => void;
  searchInput: string;
  onSearchChange: (value: string) => void;
  categories: ProductCategory[];
  categoriesLoading?: boolean;
  selectedCategory: string | null;
  onCategoryChange: (slug: string | null) => void;
}

export function ProductCatalog({
  products,
  canManageCart,
  isLoading = false,
  showListSkeleton = false,
  skeletonRowCount = 12,
  isError = false,
  errorMessage,
  currentPage = 1,
  totalPages = 1,
  onPrevPage,
  onNextPage,
  cartQuantities,
  onChangeCartQuantity,
  onAddToCart,
  onProductNavigate,
  searchInput,
  onSearchChange,
  categories,
  categoriesLoading = false,
  selectedCategory,
  onCategoryChange,
}: ProductCatalogProps) {
  const { t } = useTranslation();

  return (
    <Card className="flex min-h-0 w-full min-w-0 max-w-full flex-1 flex-col overflow-hidden max-h-[calc(100svh-6.5rem)]">
      <CardHeader className="shrink-0 space-y-4">
        <div>
          <CardTitle>{t("catalog.title")}</CardTitle>
          <CardDescription>{t("catalog.description")}</CardDescription>
        </div>
        <CatalogFilters
          searchInput={searchInput}
          onSearchChange={onSearchChange}
          categories={categories}
          categoriesLoading={categoriesLoading}
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
        />
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col gap-0 overflow-hidden p-0">
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-2">
          <div className="flex flex-col gap-3">
            {isError ? (
              <p className="text-sm text-destructive" role="alert">
                {errorMessage ?? t("catalog.loadError")}
              </p>
            ) : null}

            {showListSkeleton && !isError
              ? Array.from({ length: skeletonRowCount }, (_, i) => <ProductRowSkeleton key={i} />)
              : null}

            {!showListSkeleton && !isError && products.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t("catalog.noResults")}</p>
            ) : null}

            {!showListSkeleton && !isError
              ? products.map((product) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    canManageCart={canManageCart}
                    inCartQty={cartQuantities?.[product.id] ?? 0}
                    isLoading={isLoading}
                    onAddToCart={onAddToCart}
                    onChangeCartQuantity={onChangeCartQuantity}
                    onProductNavigate={onProductNavigate}
                  />
                ))
              : null}
          </div>
        </div>
        <CatalogPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevPage={onPrevPage}
          onNextPage={onNextPage}
        />
      </CardContent>
    </Card>
  );
}
