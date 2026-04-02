import { cn } from "@/lib/utils";

const colorMap: Record<string, string> = {
  "In Stock": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  "Low Stock": "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
};
const fallbackColor = "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";

export function AvailabilityBadge({ status, className }: { status: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-1.5 py-0.5 text-[10px] font-medium leading-none",
        colorMap[status] ?? fallbackColor,
        className,
      )}
    >
      {status}
    </span>
  );
}
