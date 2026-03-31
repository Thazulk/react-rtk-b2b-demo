import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Product } from "@/types/dummyjson";

interface ProductCatalogProps {
  products: Product[];
  canManageCart: boolean;
  onAddToCart?: (product: Product) => void;
}

export function ProductCatalog({ products, canManageCart, onAddToCart }: ProductCatalogProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Termekkatalogus</CardTitle>
        <CardDescription>
          A katalogus publikus, de kosar muveletekhez bejelentkezes szukseges.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {products.map((product) => (
          <div key={product.id} className="flex items-center justify-between rounded-lg border p-3">
            <div className="flex flex-col gap-1">
              <p className="font-medium">{product.title}</p>
              <p className="text-xs text-muted-foreground">{product.description}</p>
              <p className="text-xs text-muted-foreground">
                {product.stock} keszlet | {product.price.toFixed(2)} EUR
              </p>
            </div>
            {canManageCart && onAddToCart ? (
              <Button size="sm" onClick={() => onAddToCart(product)}>
                Kosarba
              </Button>
            ) : (
              <Button size="sm" variant="outline" disabled>
                Login szukseges
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
