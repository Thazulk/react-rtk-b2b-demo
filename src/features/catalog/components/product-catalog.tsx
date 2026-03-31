import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Product } from "@/types/dummyjson";
import { useTranslation } from "react-i18next";

interface ProductCatalogProps {
  products: Product[];
  canManageCart: boolean;
  isLoading?: boolean;
  onAddToCart?: (product: Product) => void;
}

export function ProductCatalog({
  products,
  canManageCart,
  isLoading = false,
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
        {isLoading ? (
          <p className="text-sm text-muted-foreground">{t("catalog.loading")}</p>
        ) : null}
        {products.map((product) => (
          <div key={product.id} className="flex items-center justify-between rounded-lg border p-3">
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
            {canManageCart && onAddToCart ? (
              <Button size="sm" disabled={isLoading} onClick={() => onAddToCart(product)}>
                {t("catalog.addToCart")}
              </Button>
            ) : (
              <Button size="sm" variant="outline" disabled>
                {t("catalog.loginRequired")}
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
