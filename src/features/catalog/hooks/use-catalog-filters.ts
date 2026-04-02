import { useEffect, useState } from "react";
import {
  useGetCategoriesQuery,
  useGetProductsByCategoryQuery,
  useGetProductsQuery,
  useSearchProductsQuery,
} from "@/store/dummyJsonApi";
import type { ProductListResponse } from "@/types/dummyjson";

const PAGE_SIZE = 12;

const listSelectFromResult = {
  selectFromResult: ({
    data,
    isLoading,
    isError,
  }: {
    data?: ProductListResponse;
    isLoading: boolean;
    isError: boolean;
  }) => ({
    products: data?.products ?? [],
    total: data?.total ?? 0,
    isLoading,
    isError,
  }),
};

export function useCatalogFilters() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(searchInput.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedCategory]);

  const { data: categories = [], isLoading: categoriesLoading } = useGetCategoriesQuery();

  const skipCategory = !selectedCategory;
  const skipSearch = Boolean(selectedCategory) || debouncedSearch.length === 0;
  const skipList = Boolean(selectedCategory) || debouncedSearch.length > 0;

  const categoryQuery = useGetProductsByCategoryQuery(
    { category: selectedCategory ?? "", limit: PAGE_SIZE, skip: (page - 1) * PAGE_SIZE },
    { skip: skipCategory, ...listSelectFromResult },
  );

  const searchQuery = useSearchProductsQuery(
    { q: debouncedSearch, limit: PAGE_SIZE, skip: (page - 1) * PAGE_SIZE },
    { skip: skipSearch, ...listSelectFromResult },
  );

  const listQuery = useGetProductsQuery(
    { limit: PAGE_SIZE, skip: (page - 1) * PAGE_SIZE },
    { skip: skipList, ...listSelectFromResult },
  );

  const active = selectedCategory
    ? categoryQuery
    : debouncedSearch.length > 0
      ? searchQuery
      : listQuery;

  const { products, total, isLoading: isProductsLoading, isError: isProductsError } = active;
  const totalPages = Math.max(1, Math.ceil((total || PAGE_SIZE) / PAGE_SIZE));
  const showListSkeleton = isProductsLoading || categoriesLoading;

  return {
    pageSize: PAGE_SIZE,
    page,
    setPage,
    searchInput,
    setSearchInput,
    selectedCategory,
    setSelectedCategory,
    categories,
    categoriesLoading,
    products,
    totalPages,
    isProductsLoading,
    isProductsError,
    showListSkeleton,
  };
}
