import { clearSession } from "@/store/authSlice";
import type { RootState } from "@/store/store";
import type { CartProduct } from "@/types/dummyjson";
import {
  createSelector,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

interface CartDraftItem {
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
  items: CartDraftItem[];
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

      if (existing && existing.items.length > 0) {
        return;
      }

      state.byUserId[userKey] = {
        cartId: action.payload.cartId,
        items: action.payload.products.map((product) => ({
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
    addOrIncrementDraftItem: (
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
        items: [],
      };
      const moq = action.payload.product.minimumOrderQuantity ?? 1;
      const item = current.items.find(
        (entry) => entry.id === action.payload.product.id,
      );

      if (!item) {
        current.items.push({
          id: action.payload.product.id,
          title: action.payload.product.title,
          price: action.payload.product.price,
          quantity: Math.max(1, moq),
          thumbnail: action.payload.product.thumbnail,
          discountPercentage: action.payload.product.discountPercentage,
          minimumOrderQuantity: moq,
        });
      } else {
        item.quantity += 1;
      }

      current.suppressApiHydrate = true;
      state.byUserId[userKey] = current;
    },
    setDraftItemQuantity: (
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
        items: [],
      };
      current.items = current.items
        .map((item) =>
          item.id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item,
        )
        .filter((item) => item.quantity > 0);
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
  addOrIncrementDraftItem,
  setDraftItemQuantity,
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
    const items = cartDraft.byUserId[String(userId)]?.items ?? [];
    const map: Partial<Record<number, number>> = {};
    for (const item of items) {
      map[item.id] = item.quantity;
    }
    return map;
  },
);

/** Memoized: discounted item totals summed (matches B2B cart subtotal intent). */
export const selectUserDraftSubtotal = createSelector(
  [selectCartDraftState, selectUserIdParam],
  (cartDraft, userId): number => {
    if (userId == null) {
      return 0;
    }
    const items = cartDraft.byUserId[String(userId)]?.items ?? [];
    return Number(
      items
        .reduce(
          (sum, item) =>
            sum +
            item.price * item.quantity * (1 - item.discountPercentage / 100),
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
  return selectUserDraft(state, userId)?.items.length ?? 0;
};
