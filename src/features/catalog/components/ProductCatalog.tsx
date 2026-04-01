import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CartLineQuantityControls } from "@/features/cart/components/CartLineQuantityControls";
import type { Product } from "@/types/dummyjson";

interface ProductCatalogProps {
  products: Product[];
  canManageCart: boolean;
  isLoading?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPrevPage?: () => void;
  onNextPage?: () => void;
  /** Quantity per product id already in the cart (draft). */
  cartQuantities?: Partial<Record<number, number>>;
  onChangeCartQuantity?: (productId: number, nextQuantity: number) => void;
  onAddToCart?: (product: Product) => void;
}

export function ProductCatalog({
  products,
  canManageCart,
  isLoading = false,
  currentPage = 1,
  totalPages = 1,
  onPrevPage,
  onNextPage,
  cartQuantities,
  onChangeCartQuantity,
  onAddToCart,
}: ProductCatalogProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("catalog.title")}</CardTitle>
        <CardDescription>{t("catalog.description")}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {isLoading ? <p className="text-sm text-muted-foreground">{t("catalog.loading")}</p> : null}
        {products.map((product) => {
          const inCartQty = cartQuantities?.[product.id] ?? 0;

          return (
            <div key={product.id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="size-14 rounded-md border object-cover"
                  loading="lazy"
                />
                <div className="flex flex-col gap-1">
                  <p className="font-medium">{product.title}</p>
                  <p className="text-xs text-muted-foreground">{product.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {t("catalog.stockAndPrice", {
                      stock: String(product.stock),
                      price: product.price.toFixed(2),
                    })}
                  </p>
                </div>
              </div>
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
          );
        })}
        <div className="flex items-center justify-between border-t pt-3">
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
