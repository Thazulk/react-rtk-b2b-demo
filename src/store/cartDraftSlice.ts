import { clearSession } from "@/store/authSlice";
import type { RootState } from "@/store/store";
import type { CartProduct } from "@/types/dummyjson";
import {
  createSelector,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

interface CartDraftLine {
  id: number;
  title: string;
  price: number;
  quantity: number;
  thumbnail: string;
  discountPercentage: number;
  minimumOrderQuantity: number;
}

interface UserCartDraft {
  cartId: number | null;
  lines: CartDraftLine[];
  /** After first API seed or any local edit, do not replace draft from getCart again. */
  suppressApiHydrate?: boolean;
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

      if (existing?.suppressApiHydrate) {
        return;
      }

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
          minimumOrderQuantity: 1,
        })),
        suppressApiHydrate: true,
      };
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
          minimumOrderQuantity?: number;
        };
      }>,
    ) => {
      const userKey = String(action.payload.userId);
      const current = state.byUserId[userKey] ?? {
        cartId: null,
        lines: [],
      };
      const moq = action.payload.product.minimumOrderQuantity ?? 1;
      const line = current.lines.find(
        (entry) => entry.id === action.payload.product.id,
      );

      if (!line) {
        current.lines.push({
          id: action.payload.product.id,
          title: action.payload.product.title,
          price: action.payload.product.price,
          quantity: Math.max(1, moq),
          thumbnail: action.payload.product.thumbnail,
          discountPercentage: action.payload.product.discountPercentage,
          minimumOrderQuantity: moq,
        });
      } else {
        line.quantity += 1;
      }

      current.suppressApiHydrate = true;
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
      const current = state.byUserId[userKey] ?? {
        cartId: null,
        lines: [],
      };
      current.lines = current.lines
        .map((line) =>
          line.id === action.payload.productId
            ? { ...line, quantity: action.payload.quantity }
            : line,
        )
        .filter((line) => line.quantity > 0);
      current.suppressApiHydrate = true;
      state.byUserId[userKey] = current;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(clearSession, () => initialState);
  },
});

export const {
  hydrateUserCartFromApi,
  addOrIncrementDraftLine,
  setDraftLineQuantity,
} = cartDraftSlice.actions;

export const cartDraftReducer = cartDraftSlice.reducer;

const selectCartDraftState = (state: RootState) => state.cartDraft;

const selectUserIdParam = (_state: RootState, userId?: number | null) => userId;

export const selectUserDraft = (
  state: RootState,
  userId?: number | null,
): UserCartDraft | null => {
  if (!userId) {
    return null;
  }
  return state.cartDraft.byUserId[String(userId)] ?? null;
};

/** Memoized: product id → quantity for catalog badges / quantity controls. */
export const selectCartQuantitiesMap = createSelector(
  [selectCartDraftState, selectUserIdParam],
  (cartDraft, userId): Partial<Record<number, number>> => {
    if (userId == null) {
      return {};
    }
    const lines = cartDraft.byUserId[String(userId)]?.lines ?? [];
    const map: Partial<Record<number, number>> = {};
    for (const line of lines) {
      map[line.id] = line.quantity;
    }
    return map;
  },
);

/** Memoized: discounted line totals summed (matches B2B cart subtotal intent). */
export const selectUserDraftSubtotal = createSelector(
  [selectCartDraftState, selectUserIdParam],
  (cartDraft, userId): number => {
    if (userId == null) {
      return 0;
    }
    const lines = cartDraft.byUserId[String(userId)]?.lines ?? [];
    return Number(
      lines
        .reduce(
          (sum, line) =>
            sum +
            line.price * line.quantity * (1 - line.discountPercentage / 100),
          0,
        )
        .toFixed(2),
    );
  },
);

export const selectUserDraftItemTypesCount = (
  state: RootState,
  userId?: number | null,
): number => {
  return selectUserDraft(state, userId)?.lines.length ?? 0;
};
