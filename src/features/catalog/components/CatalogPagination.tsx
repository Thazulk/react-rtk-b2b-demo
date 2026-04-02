import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

interface CatalogPaginationProps {
  currentPage: number;
  totalPages: number;
  onPrevPage?: () => void;
  onNextPage?: () => void;
}

export function CatalogPagination({
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
}: CatalogPaginationProps) {
  const { t } = useTranslation();

  return (
    <div className="flex shrink-0 items-center justify-between border-t px-4 py-3">
      <p className="text-xs text-muted-foreground">
        {t("catalog.pagination", { current: String(currentPage), total: String(totalPages) })}
      </p>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={onPrevPage}
          disabled={!onPrevPage || currentPage <= 1}
        >
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
  );
}
