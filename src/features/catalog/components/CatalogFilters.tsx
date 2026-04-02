import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { ProductCategory } from "@/types/dummyjson";

interface CatalogFiltersProps {
  searchInput: string;
  onSearchChange: (value: string) => void;
  categories: ProductCategory[];
  categoriesLoading: boolean;
  selectedCategory: string | null;
  onCategoryChange: (slug: string | null) => void;
}

export function CatalogFilters({
  searchInput,
  onSearchChange,
  categories,
  categoriesLoading,
  selectedCategory,
  onCategoryChange,
}: CatalogFiltersProps) {
  const { t } = useTranslation();

  return (
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
  );
}
