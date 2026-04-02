import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useActiveCart } from "@/features/cart/hooks/use-active-cart";
import { cn } from "@/lib/utils";
import { CartLineQuantityControls } from "@/features/cart/components/CartLineQuantityControls";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectActiveCartId, selectUser } from "@/store/authSlice";
import {
  addOrIncrementDraftLine,
  selectCartQuantitiesMap,
  selectUserDraft,
  setDraftLineQuantity,
} from "@/store/cartDraftSlice";
import { useGetProductByIdQuery, useUpdateCartMutation } from "@/store/dummyJsonApi";

export function ProductDetailPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { productId: productIdParam } = useParams<{ productId: string }>();
  const productId = productIdParam ? Number(productIdParam) : NaN;
  const isValidId = Number.isFinite(productId) && productId > 0;

  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const activeCartId = useAppSelector(selectActiveCartId);
  const draft = useAppSelector((state) => selectUserDraft(state, user?.id));
  const quantitiesMap = useAppSelector((state) => selectCartQuantitiesMap(state, user?.id));
  const cartQty = quantitiesMap[productId] ?? 0;

  const { data: product, isLoading, isError } = useGetProductByIdQuery(productId, {
    skip: !isValidId,
  });

  const [updateCart, { isLoading: isUpdatingCart }] = useUpdateCartMutation();
  const { activeCart, isBootstrappingCart } = useActiveCart({
    userId: user?.id,
    activeCartId,
  });

  const moq = product?.minimumOrderQuantity ?? 1;

  const handleAddToCart = async () => {
    if (!user || !product) {
      return;
    }

    dispatch(
      addOrIncrementDraftLine({
        userId: user.id,
        product: {
          id: product.id,
          title: product.title,
          price: product.price,
          thumbnail: product.thumbnail,
          discountPercentage: product.discountPercentage,
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

    const initialQty = Math.max(1, moq);
    const existingLine = previousLines.find((line) => line.id === product.id);
    const nextLines = existingLine
      ? previousLines.map((line) =>
          line.id === product.id ? { ...line, quantity: line.quantity + 1 } : line,
        )
      : [
          ...previousLines,
          {
            id: product.id,
            title: product.title,
            price: product.price,
            quantity: initialQty,
            thumbnail: product.thumbnail,
            discountPercentage: product.discountPercentage,
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

  const handleChangeQty = async (nextQuantity: number) => {
    if (!user || !product) {
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
        productId: product.id,
        quantity: safeQuantity,
      }),
    );

    const nextProducts = sourceLines
      .map((line) =>
        line.id === product.id
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
        body: { merge: true, products: nextProducts },
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
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-medium",
                    product.availabilityStatus === "In Stock"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : product.availabilityStatus === "Low Stock"
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
                  )}
                >
                  {product.availabilityStatus}
                </span>
              ) : null}
            </CardTitle>
            <CardDescription className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>{product.category}</span>
              {product.brand ? (
                <span>{product.brand}</span>
              ) : null}
              <span className="inline-flex items-center gap-0.5">
                <Star className="size-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                {t("catalog.ratingLabel", { rating: String(product.rating) })}
              </span>
              <span>
                {t("catalog.stockAndPrice", {
                  stock: String(product.stock),
                  price: product.price.toFixed(2),
                }).split("|")[0].trim()}
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
                {product.discountPercentage > 0 ? (
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
                  <span className="text-lg font-semibold">
                    {product.price.toFixed(2)} EUR
                  </span>
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
                    <dd>{t("productDetail.unitPcs", { value: String(product.minimumOrderQuantity) })}</dd>
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
                  <CartLineQuantityControls
                    quantity={cartQty}
                    minQuantity={moq}
                    disabled={isUpdatingCart || isBootstrappingCart}
                    onDecrement={() => void handleChangeQty(cartQty - 1)}
                    onIncrement={() => void handleChangeQty(cartQty + 1)}
                    onRemove={() => void handleChangeQty(0)}
                  />
                ) : (
                  <Button
                    disabled={isUpdatingCart || isBootstrappingCart}
                    onClick={() => void handleAddToCart()}
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
