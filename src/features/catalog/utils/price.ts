export function getDiscountedPrice(price: number, discountPercentage: number): number {
  if (discountPercentage <= 0) {
    return price;
  }
  return Number((price * (1 - discountPercentage / 100)).toFixed(2));
}
