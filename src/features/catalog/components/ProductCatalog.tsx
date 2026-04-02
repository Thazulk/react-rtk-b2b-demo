import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { CartLineQuantityControls } from "@/features/cart/components/CartLineQuantityControls";
import { cn } from "@/lib/utils";
import type { Product, ProductCategory } from "@/types/dummyjson";

const DEFAULT_SKELETON_ROWS = 12;

function ProductRowSkeleton() {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
      <div className="flex min-w-0 items-center gap-3">
        <Skeleton className="size-14 shrink-0 rounded-md" />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <Skeleton className="h-4 w-3/5 max-w-xs" />
          <Skeleton className="h-3 w-full max-w-md" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
      <Skeleton className="h-8 w-24 shrink-0" />
    </div>
  );
}

interface ProductCatalogProps {
  products: Product[];
  canManageCart: boolean;
  isLoading?: boolean;
  /** When true, show skeleton rows instead of the product list (list + categories fetch). */
  showListSkeleton?: boolean;
  skeletonRowCount?: number;
  isError?: boolean;
  /** Shown when isError (e.g. RTK Query failure). */
  errorMessage?: string;
  currentPage?: number;
  totalPages?: number;
  onPrevPage?: () => void;
  onNextPage?: () => void;
  /** Quantity per product id already in the cart (draft). */
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
  skeletonRowCount = DEFAULT_SKELETON_ROWS,
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
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <Label htmlFor="catalog-search">{t("catalog.searchLabel")}</Label>
            <Input
              id="catalog-search"
              type="search"
              placeholder={t("catalog.searchPlaceholder")}
              value={searchInput}
              onChange={(e) => onSearchChange(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div className="flex min-w-[12rem] flex-col gap-2">
            <Label htmlFor="catalog-category">{t("catalog.categoryLabel")}</Label>
            <select
              id="catalog-category"
              className={cn(
                "border-input bg-background ring-offset-background",
                "focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs",
                "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                "disabled:cursor-not-allowed disabled:opacity-50",
              )}
              disabled={categoriesLoading}
              value={selectedCategory ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                onCategoryChange(v === "" ? null : v);
              }}
            >
              <option value="">{t("catalog.categoryAll")}</option>
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
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
              ? products.map((product) => {
              const inCartQty = cartQuantities?.[product.id] ?? 0;

              return (
                <div
                  key={product.id}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-lg border p-3",
                    onProductNavigate && "cursor-pointer transition-colors hover:bg-muted/50",
                  )}
                  onClick={onProductNavigate ? () => onProductNavigate(product) : undefined}
                  onKeyDown={
                    onProductNavigate
                      ? (e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            onProductNavigate(product);
                          }
                        }
                      : undefined
                  }
                  role={onProductNavigate ? "link" : undefined}
                  tabIndex={onProductNavigate ? 0 : undefined}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="size-14 shrink-0 rounded-md border object-cover"
                      loading="lazy"
                    />
                    <div className="flex min-w-0 flex-col gap-1">
                      <p className="font-medium">{product.title}</p>
                      <p className="line-clamp-2 text-xs text-muted-foreground">{product.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {t("catalog.stockAndPrice", {
                          stock: String(product.stock),
                          price: product.price.toFixed(2),
                        })}
                      </p>
                    </div>
                  </div>
                  <div
                    className="shrink-0"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                  >
                    {canManageCart && inCartQty > 0 && onChangeCartQuantity ? (
                      <CartLineQuantityControls
                        quantity={inCartQty}
                        disabled={isLoading}
                        onDecrement={() => onChangeCartQuantity(product.id, inCartQty - 1)}
                        onIncrement={() => onChangeCartQuantity(product.id, inCartQty + 1)}
                        onRemove={() => onChangeCartQuantity(product.id, 0)}
                      />
                    ) : canManageCart && onAddToCart ? (
                      <Button size="sm" disabled={isLoading} onClick={() => onAddToCart(product)}>
                        {t("catalog.addToCart")}
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" disabled>
                        {t("catalog.loginRequired")}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
              : null}
          </div>
        </div>
        <div className="flex shrink-0 items-center justify-between border-t px-4 py-3">
          <p className="text-xs text-muted-foreground">
            {t("catalog.pagination", { current: String(currentPage), total: String(totalPages) })}
          </p>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={onPrevPage} disabled={!onPrevPage || currentPage <= 1}>
              {t("catalog.prev")}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onNextPage}
              disabled={!onNextPage || currentPage >= totalPages}
            >
              {t("catalog.next")}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
