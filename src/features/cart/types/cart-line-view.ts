export interface CartLineView {
  product: {
    id: number;
    title: string;
    price: number;
  };
  quantity: number;
  minimumOrderQuantity: number;
}
