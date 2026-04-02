export interface CartItemView {
  product: {
    id: number;
    title: string;
    price: number;
  };
  quantity: number;
  minimumOrderQuantity: number;
}
