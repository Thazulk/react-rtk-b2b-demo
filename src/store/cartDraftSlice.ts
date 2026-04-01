import type { RootState } from "@/store/store";
import type { CartProduct } from "@/types/dummyjson";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface CartDraftLine {
  id: number;
  title: string;
  price: number;
  quantity: number;
  thumbnail: string;
  discountPercentage: number;
}

interface UserCartDraft {
  cartId: number | null;
  lines: CartDraftLine[];
}

interface CartDraftState {
  byUserId: Record<string, UserCartDraft>;
}

const initialState: CartDraftState = {
  byUserId: {},
};

const cartDraftSlice = createSlice({
  name: "cartDraft",
  initialState,
  reducers: {
    hydrateUserCartFromApi: (
      state,
      action: PayloadAction<{
        userId: number;
        cartId: number | null;
        products: CartProduct[];
      }>,
    ) => {
      const userKey = String(action.payload.userId);
      const existing = state.byUserId[userKey];
      if (existing && existing.lines.length > 0) {
        return;
      }

      state.byUserId[userKey] = {
        cartId: action.payload.cartId,
        lines: action.payload.products.map((product) => ({
          id: product.id,
          title: product.title,
          price: product.price,
          quantity: product.quantity,
          thumbnail: product.thumbnail,
          discountPercentage: product.discountPercentage,
        })),
      };
    },
    setUserDraftCartId: (
      state,
      action: PayloadAction<{
        userId: number;
        cartId: number | null;
      }>,
    ) => {
      const userKey = String(action.payload.userId);
      const current = state.byUserId[userKey] ?? { cartId: null, lines: [] };
      current.cartId = action.payload.cartId;
      state.byUserId[userKey] = current;
    },
    addOrIncrementDraftLine: (
      state,
      action: PayloadAction<{
        userId: number;
        product: {
          id: number;
          title: string;
          price: number;
          thumbnail: string;
          discountPercentage: number;
        };
      }>,
    ) => {
      const userKey = String(action.payload.userId);
      const current = state.byUserId[userKey] ?? { cartId: null, lines: [] };
      const line = current.lines.find(
        (entry) => entry.id === action.payload.product.id,
      );

      if (!line) {
        current.lines.push({
          id: action.payload.product.id,
          title: action.payload.product.title,
          price: action.payload.product.price,
          quantity: 1,
          thumbnail: action.payload.product.thumbnail,
          discountPercentage: action.payload.product.discountPercentage,
        });
      } else {
        line.quantity += 1;
      }

      state.byUserId[userKey] = current;
    },
    setDraftLineQuantity: (
      state,
      action: PayloadAction<{
        userId: number;
        productId: number;
        quantity: number;
      }>,
    ) => {
      const userKey = String(action.payload.userId);
      const current = state.byUserId[userKey] ?? { cartId: null, lines: [] };
      current.lines = current.lines
        .map((line) =>
          line.id === action.payload.productId
            ? { ...line, quantity: action.payload.quantity }
            : line,
        )
        .filter((line) => line.quantity > 0);
      state.byUserId[userKey] = current;
    },
    clearUserDraft: (state, action: PayloadAction<{ userId: number }>) => {
      const userKey = String(action.payload.userId);
      delete state.byUserId[userKey];
    },
  },
});

export const {
  hydrateUserCartFromApi,
  setUserDraftCartId,
  addOrIncrementDraftLine,
  setDraftLineQuantity,
  clearUserDraft,
} = cartDraftSlice.actions;

export const cartDraftReducer = cartDraftSlice.reducer;

export const selectUserDraft = (
  state: RootState,
  userId?: number | null,
): UserCartDraft | null => {
  if (!userId) {
    return null;
  }
  return state.cartDraft.byUserId[String(userId)] ?? null;
};

export const selectUserDraftItemTypesCount = (
  state: RootState,
  userId?: number | null,
): number => {
  return selectUserDraft(state, userId)?.lines.length ?? 0;
};
