import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

interface CartLineQuantityControlsProps {
  quantity: number;
  /** Minimum allowed quantity; decrement is disabled at this floor. Defaults to 1. */
  minQuantity?: number;
  disabled?: boolean;
  onDecrement: () => void;
  onIncrement: () => void;
  onRemove: () => void;
}

export function CartLineQuantityControls({
  quantity,
  minQuantity = 1,
  disabled = false,
  onDecrement,
  onIncrement,
  onRemove,
}: CartLineQuantityControlsProps) {
  const { t } = useTranslation();
  const atFloor = quantity <= minQuantity;

  return (
    <div className="flex items-center gap-2">
      <Button size="icon-sm" variant="outline" disabled={disabled || atFloor} onClick={onDecrement}>
        -
      </Button>
      <span className="w-7 text-center text-sm">{quantity}</span>
      <Button size="icon-sm" variant="outline" disabled={disabled} onClick={onIncrement}>
        +
      </Button>
      <Button
        size="icon-sm"
        variant="ghost"
        className="text-destructive hover:text-destructive"
        disabled={disabled}
        onClick={onRemove}
        aria-label={t("cart.removeLine")}
      >
        <Trash2 className="size-4" aria-hidden="true" />
      </Button>
    </div>
  );
}
