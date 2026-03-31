import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "@/types/dummyjson";
import type { RootState } from "@/store/store";

export interface CartLine {
  product: Product;
  quantity: number;
}

interface CartState {
  lines: CartLine[];
}

const initialState: CartState = {
  lines: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addProductToCart: (state, action: PayloadAction<Product>) => {
      const line = state.lines.find((entry) => entry.product.id === action.payload.id);
      if (!line) {
        state.lines.push({ product: action.payload, quantity: 1 });
        return;
      }
      line.quantity += 1;
    },
    setProductQuantity: (
      state,
      action: PayloadAction<{ productId: number; nextQuantity: number }>,
    ) => {
      const { productId, nextQuantity } = action.payload;
      if (nextQuantity <= 0) {
        state.lines = state.lines.filter((entry) => entry.product.id !== productId);
        return;
      }
      const line = state.lines.find((entry) => entry.product.id === productId);
      if (line) {
        line.quantity = nextQuantity;
      }
    },
    clearCartState: (state) => {
      state.lines = [];
    },
  },
});

export const { addProductToCart, setProductQuantity, clearCartState } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;

export const selectCartLines = (state: RootState) => state.cart.lines;
export const selectCartItemTypesCount = (state: RootState) => state.cart.lines.length;
