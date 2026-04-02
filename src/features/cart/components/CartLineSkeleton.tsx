import { Skeleton } from "@/components/ui/skeleton";

export function CartLineSkeleton() {
  return (
    <div className="flex items-center justify-between rounded-lg border p-3">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="h-8 w-24 shrink-0" />
    </div>
  );
}
