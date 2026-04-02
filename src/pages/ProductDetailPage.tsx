import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CartItemQuantityControls } from "@/features/cart/components/CartItemQuantityControls";
import { useCartActions } from "@/features/cart/hooks/use-cart-actions";
import { AvailabilityBadge } from "@/features/catalog/components/AvailabilityBadge";
import { useGetProductByIdQuery } from "@/store/dummyJsonApi";

export function ProductDetailPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { productId: productIdParam } = useParams<{ productId: string }>();
  const productId = productIdParam ? Number(productIdParam) : NaN;
  const isValidId = Number.isFinite(productId) && productId > 0;

  const { data: product, isLoading, isError } = useGetProductByIdQuery(productId, {
    skip: !isValidId,
  });

  const {
    user,
    cartQuantities,
    isUpdatingCart,
    isBootstrappingCart,
    addToCart,
    changeItemQuantity,
  } = useCartActions();

  const cartQty = cartQuantities[productId] ?? 0;
  const moq = product?.minimumOrderQuantity ?? 1;
  const hasDiscount = (product?.discountPercentage ?? 0) > 0;

  if (!isValidId) {
    return (
      <div className="flex min-h-0 flex-1 flex-col items-start gap-4 p-4">
        <p className="text-sm text-destructive">{t("productDetail.invalidId")}</p>
        <Button variant="outline" onClick={() => navigate("/catalog")}>
          {t("productDetail.backToCatalog")}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col gap-4 overflow-y-auto p-1">
      <Button variant="ghost" size="sm" className="w-fit" onClick={() => navigate("/catalog")}>
        {t("productDetail.backToCatalog")}
      </Button>

      {isLoading ? (
        <Card className="w-full max-w-3xl">
          <CardHeader className="space-y-2">
            <Skeleton className="h-8 w-2/3 max-w-md" />
            <Skeleton className="h-4 w-full max-w-lg" />
          </CardHeader>
          <CardContent className="flex flex-col gap-6 sm:flex-row">
            <Skeleton className="size-48 shrink-0 rounded-lg" />
            <div className="flex flex-1 flex-col gap-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-9 w-40" />
            </div>
          </CardContent>
        </Card>
      ) : null}

      {isError ? (
        <p className="text-sm text-destructive">{t("productDetail.loadError")}</p>
      ) : null}

      {product && !isLoading ? (
        <Card className="w-full max-w-3xl">
          <CardHeader>
            <CardTitle className="flex flex-wrap items-center gap-2">
              <span>{product.title}</span>
              {product.availabilityStatus ? (
                <AvailabilityBadge status={product.availabilityStatus} className="px-2 py-0.5 text-xs" />
              ) : null}
            </CardTitle>
            <CardDescription className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>{product.category}</span>
              {product.brand ? <span>{product.brand}</span> : null}
              <span className="inline-flex items-center gap-0.5">
                <Star className="size-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                {t("catalog.ratingLabel", { rating: String(product.rating) })}
              </span>
              <span>
                {t("catalog.stockAndPrice", {
                  stock: String(product.stock),
                  price: product.price.toFixed(2),
                })
                  .split("|")[0]
                  .trim()}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6 sm:flex-row">
            <img
              src={product.thumbnail}
              alt=""
              className="size-48 shrink-0 rounded-lg border object-cover"
            />
            <div className="flex flex-1 flex-col gap-4">
              <p className="text-sm text-muted-foreground">{product.description}</p>

              <div className="flex flex-wrap items-baseline gap-2">
                {hasDiscount ? (
                  <>
                    <span className="text-lg font-semibold">
                      {(product.price * (1 - product.discountPercentage / 100)).toFixed(2)} EUR
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      {product.price.toFixed(2)} EUR
                    </span>
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
                      {t("catalog.discountBadge", { percent: String(product.discountPercentage) })}
                    </span>
                  </>
                ) : (
                  <span className="text-lg font-semibold">{product.price.toFixed(2)} EUR</span>
                )}
              </div>

              {product.tags.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}

              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
                {product.brand ? (
                  <>
                    <dt className="text-muted-foreground">{t("productDetail.brand")}</dt>
                    <dd>{product.brand}</dd>
                  </>
                ) : null}
                {product.sku ? (
                  <>
                    <dt className="text-muted-foreground">{t("productDetail.sku")}</dt>
                    <dd className="font-mono text-xs">{product.sku}</dd>
                  </>
                ) : null}
                {product.weight != null ? (
                  <>
                    <dt className="text-muted-foreground">{t("productDetail.weight")}</dt>
                    <dd>{t("productDetail.unitKg", { value: String(product.weight) })}</dd>
                  </>
                ) : null}
                {product.dimensions ? (
                  <>
                    <dt className="text-muted-foreground">{t("productDetail.dimensions")}</dt>
                    <dd>
                      {t("productDetail.dimensionFormat", {
                        w: String(product.dimensions.width),
                        h: String(product.dimensions.height),
                        d: String(product.dimensions.depth),
                      })}
                    </dd>
                  </>
                ) : null}
                {product.minimumOrderQuantity && product.minimumOrderQuantity > 1 ? (
                  <>
                    <dt className="text-muted-foreground">{t("productDetail.minOrder")}</dt>
                    <dd>
                      {t("productDetail.unitPcs", {
                        value: String(product.minimumOrderQuantity),
                      })}
                    </dd>
                  </>
                ) : null}
                {product.warrantyInformation ? (
                  <>
                    <dt className="text-muted-foreground">{t("productDetail.warranty")}</dt>
                    <dd>{product.warrantyInformation}</dd>
                  </>
                ) : null}
                {product.shippingInformation ? (
                  <>
                    <dt className="text-muted-foreground">{t("productDetail.shipping")}</dt>
                    <dd>{product.shippingInformation}</dd>
                  </>
                ) : null}
                {product.returnPolicy ? (
                  <>
                    <dt className="text-muted-foreground">{t("productDetail.returnPolicy")}</dt>
                    <dd>{product.returnPolicy}</dd>
                  </>
                ) : null}
              </dl>

              {user ? (
                cartQty > 0 ? (
                  <CartItemQuantityControls
                    quantity={cartQty}
                    minQuantity={moq}
                    disabled={isUpdatingCart || isBootstrappingCart}
                    onDecrement={() => void changeItemQuantity(productId, cartQty - 1)}
                    onIncrement={() => void changeItemQuantity(productId, cartQty + 1)}
                    onRemove={() => void changeItemQuantity(productId, 0)}
                  />
                ) : (
                  <Button
                    disabled={isUpdatingCart || isBootstrappingCart}
                    onClick={() => void addToCart(product)}
                  >
                    {t("productDetail.addToCart")}
                  </Button>
                )
              ) : (
                <Button variant="outline" disabled>
                  {t("catalog.loginRequired")}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
