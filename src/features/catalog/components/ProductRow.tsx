import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { CartLineQuantityControls } from "@/features/cart/components/CartLineQuantityControls";
import { AvailabilityBadge } from "@/features/catalog/components/AvailabilityBadge";
import { getDiscountedPrice } from "@/features/catalog/utils/price";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/dummyjson";

interface ProductRowProps {
  product: Product;
  canManageCart: boolean;
  inCartQty: number;
  isLoading: boolean;
  onAddToCart?: (product: Product) => void;
  onChangeCartQuantity?: (productId: number, nextQuantity: number) => void;
  onProductNavigate?: (product: Product) => void;
}

export function ProductRow({
  product,
  canManageCart,
  inCartQty,
  isLoading,
  onAddToCart,
  onChangeCartQuantity,
  onProductNavigate,
}: ProductRowProps) {
  const { t } = useTranslation();
  const hasDiscount = product.discountPercentage > 0;
  const discountedPrice = getDiscountedPrice(product.price, product.discountPercentage);

  return (
    <div
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
              <span className="text-[11px] text-muted-foreground">{product.brand}</span>
            ) : null}
            {product.availabilityStatus ? (
              <AvailabilityBadge status={product.availabilityStatus} />
            ) : null}
          </div>

          <p className="line-clamp-1 text-xs text-muted-foreground">{product.description}</p>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs">
            <span className="flex items-center gap-1 font-semibold">
              {hasDiscount ? (
                <>
                  <span className="text-foreground">{discountedPrice.toFixed(2)} EUR</span>
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
              })
                .split("|")[0]
                .trim()}
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
}
