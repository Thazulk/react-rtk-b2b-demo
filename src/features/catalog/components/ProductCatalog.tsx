import { Star } from "lucide-react";
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
        <Skeleton className="size-16 shrink-0 rounded-md" />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-3/5 max-w-xs" />
            <Skeleton className="h-4 w-16 rounded-full" />
          </div>
          <Skeleton className="h-3 w-full max-w-md" />
          <div className="flex gap-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
          <div className="flex gap-1">
            <Skeleton className="h-4 w-12 rounded-full" />
            <Skeleton className="h-4 w-14 rounded-full" />
          </div>
        </div>
      </div>
      <Skeleton className="h-8 w-24 shrink-0" />
    </div>
  );
}

function AvailabilityBadge({ status }: { status: string }) {
  const colorClass =
    status === "In Stock"
      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      : status === "Low Stock"
        ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";

  return (
    <span className={cn("inline-flex rounded-full px-1.5 py-0.5 text-[10px] font-medium leading-none", colorClass)}>
      {status}
    </span>
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
                      className="size-16 shrink-0 rounded-md border object-cover"
                      loading="lazy"
                    />
                    <div className="flex min-w-0 flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        <p className="font-medium">{product.title}</p>
                        {product.brand ? (
                          <span className="text-[11px] text-muted-foreground">
                            {product.brand}
                          </span>
                        ) : null}
                        {product.availabilityStatus ? (
                          <AvailabilityBadge status={product.availabilityStatus} />
                        ) : null}
                      </div>

                      <p className="line-clamp-1 text-xs text-muted-foreground">
                        {product.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs">
                        <span className="flex items-center gap-1 font-semibold">
                          {product.discountPercentage > 0 ? (
                            <>
                              <span className="text-foreground">
                                {(product.price * (1 - product.discountPercentage / 100)).toFixed(2)} EUR
                              </span>
                              <span className="font-normal text-muted-foreground line-through">
                                {product.price.toFixed(2)}
                              </span>
                              <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-medium leading-none text-red-700 dark:bg-red-900/30 dark:text-red-400">
                                {t("catalog.discountBadge", { percent: String(product.discountPercentage) })}
                              </span>
                            </>
                          ) : (
                            <span className="text-foreground">{product.price.toFixed(2)} EUR</span>
                          )}
                        </span>

                        <span className="flex items-center gap-0.5 text-muted-foreground">
                          <Star className="size-3 fill-amber-400 text-amber-400" aria-hidden="true" />
                          {t("catalog.ratingLabel", { rating: String(product.rating) })}
                        </span>

                        <span className="text-muted-foreground">
                          {t("catalog.stockAndPrice", {
                            stock: String(product.stock),
                            price: product.price.toFixed(2),
                          }).split("|")[0].trim()}
                        </span>

                        {product.minimumOrderQuantity && product.minimumOrderQuantity > 1 ? (
                          <span className="text-muted-foreground">
                            {t("catalog.minOrder", { qty: String(product.minimumOrderQuantity) })}
                          </span>
                        ) : null}
                      </div>

                      {product.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {product.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] leading-none text-muted-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : null}
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
                        minQuantity={product.minimumOrderQuantity ?? 1}
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
