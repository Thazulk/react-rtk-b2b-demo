import { cn } from "@/lib/utils";
import { getAvailabilityColorClass } from "@/features/catalog/utils/availability";

interface AvailabilityBadgeProps {
  status: string;
  className?: string;
}

export function AvailabilityBadge({ status, className }: AvailabilityBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-1.5 py-0.5 text-[10px] font-medium leading-none",
        getAvailabilityColorClass(status),
        className,
      )}
    >
      {status}
    </span>
  );
}
