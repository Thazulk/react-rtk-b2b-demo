import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { describe, expect, it } from "vitest";
import { authReducer, clearSession, setActiveCartId, setSession } from "@/store/authSlice";
import { cartDraftReducer } from "@/store/cartDraftSlice";

const testUser = {
  id: 1,
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

describe("authSlice", () => {
  it("setSession stores token, user, and optional cart id", () => {
    const store = createStore();
    store.dispatch(
      setSession({
        accessToken: "tok",
        user: testUser,
        activeCartId: 42,
      }),
    );
    expect(store.getState().auth).toMatchObject({
      accessToken: "tok",
      user: testUser,
      activeCartId: 42,
    });
  });

  it("setActiveCartId updates only the active cart", () => {
    const store = createStore();
    store.dispatch(
      setSession({
        accessToken: "tok",
        user: testUser,
      }),
    );
    store.dispatch(setActiveCartId(7));
    expect(store.getState().auth.activeCartId).toBe(7);
    expect(store.getState().auth.accessToken).toBe("tok");
  });

  it("clearSession resets auth and cart draft", () => {
    const store = createStore();
    store.dispatch(
      setSession({
        accessToken: "tok",
        user: testUser,
        activeCartId: 1,
      }),
    );
    store.dispatch(clearSession());
    expect(store.getState().auth).toEqual({
      accessToken: null,
      user: null,
      activeCartId: null,
    });
    expect(store.getState().cartDraft.byUserId).toEqual({});
  });
});
