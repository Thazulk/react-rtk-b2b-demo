import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { describe, expect, it } from "vitest";
import { authReducer, clearSession, setSession } from "@/store/authSlice";
import {
  addOrIncrementDraftLine,
  cartDraftReducer,
  hydrateUserCartFromApi,
  selectCartQuantitiesMap,
  selectUserDraftSubtotal,
  setDraftLineQuantity,
} from "@/store/cartDraftSlice";
const testUser = {
  id: 99,
  firstName: "A",
  lastName: "B",
  gender: "female" as const,
  email: "a@b.c",
  username: "ab",
  image: "",
};

function createStore() {
  return configureStore({
    reducer: combineReducers({
      auth: authReducer,
      cartDraft: cartDraftReducer,
    }),
  });
}

describe("cartDraftSlice", () => {
  it("hydrateUserCartFromApi seeds lines when user draft is empty", () => {
    const store = createStore();
    store.dispatch(
      hydrateUserCartFromApi({
        userId: testUser.id,
        cartId: 5,
        products: [
          {
            id: 10,
            title: "P",
            price: 100,
            quantity: 2,
            total: 200,
            thumbnail: "",
            discountPercentage: 10,
            discountedTotal: 180,
          },
        ],
      }),
    );
    const draft = store.getState().cartDraft.byUserId[String(testUser.id)];
    expect(draft?.lines).toHaveLength(1);
    expect(draft?.lines[0].quantity).toBe(2);
    expect(draft?.suppressApiHydrate).toBe(true);
  });

  it("selectCartQuantitiesMap returns id → quantity", () => {
    const store = createStore();
    store.dispatch(
      addOrIncrementDraftLine({
        userId: testUser.id,
        product: {
          id: 3,
          title: "X",
          price: 10,
          thumbnail: "",
          discountPercentage: 0,
        },
      }),
    );
    const state = store.getState();
    expect(selectCartQuantitiesMap(state as never, testUser.id)).toEqual({ 3: 1 });
  });

  it("selectUserDraftSubtotal applies discount percentage", () => {
    const store = createStore();
    store.dispatch(
      addOrIncrementDraftLine({
        userId: testUser.id,
        product: {
          id: 1,
          title: "Sale",
          price: 100,
          thumbnail: "",
          discountPercentage: 20,
        },
      }),
    );
    const state = store.getState();
    expect(selectUserDraftSubtotal(state as never, testUser.id)).toBe(80);
  });

  it("setDraftLineQuantity removes line when quantity is 0", () => {
    const store = createStore();
    store.dispatch(
      addOrIncrementDraftLine({
        userId: testUser.id,
        product: {
          id: 7,
          title: "Y",
          price: 5,
          thumbnail: "",
          discountPercentage: 0,
        },
      }),
    );
    store.dispatch(
      setDraftLineQuantity({
        userId: testUser.id,
        productId: 7,
        quantity: 0,
      }),
    );
    expect(store.getState().cartDraft.byUserId[String(testUser.id)]?.lines).toEqual([]);
  });

  it("clearSession resets cart draft state", () => {
    const store = createStore();
    store.dispatch(
      setSession({
        accessToken: "t",
        user: testUser,
      }),
    );
    store.dispatch(
      addOrIncrementDraftLine({
        userId: testUser.id,
        product: {
          id: 1,
          title: "Z",
          price: 1,
          thumbnail: "",
          discountPercentage: 0,
        },
      }),
    );
    expect(Object.keys(store.getState().cartDraft.byUserId).length).toBeGreaterThan(0);
    store.dispatch(clearSession());
    expect(store.getState().cartDraft.byUserId).toEqual({});
  });
});
