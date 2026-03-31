import { Link } from "react-router";
import { ProductCatalog } from "@/features/catalog/components/product-catalog";
import { mockProducts } from "@/features/catalog/model/mock-products";

export function BrowsePage() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-5xl flex-col gap-6 p-6">
      <section className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">B2B storefront (public browse)</h1>
        <p className="text-sm text-muted-foreground">
          A katalogus nyilvanos, de a kosar kezeleshez hitelesitett session kell.
        </p>
        <p className="text-sm">
          Ha kosarat is kezelnel, menj a{" "}
          <Link className="underline underline-offset-2" to="/login">
            login oldalra
          </Link>
          .
        </p>
      </section>
      <ProductCatalog canManageCart={false} products={mockProducts} />
    </main>
  );
}
