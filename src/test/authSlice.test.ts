import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { describe, expect, it } from "vitest";
import { authReducer, clearSession, setSession } from "@/store/authSlice";
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
  it("setSession stores tokens and user", () => {
    const store = createStore();
    store.dispatch(
      setSession({
        accessToken: "tok",
        refreshToken: "ref",
        user: testUser,
      }),
    );
    expect(store.getState().auth).toMatchObject({
      accessToken: "tok",
      refreshToken: "ref",
      user: testUser,
    });
  });

  it("setSession without refreshToken keeps previous refresh token", () => {
    const store = createStore();
    store.dispatch(
      setSession({
        accessToken: "a",
        refreshToken: "r1",
        user: testUser,
      }),
    );
    store.dispatch(
      setSession({
        accessToken: "b",
        user: testUser,
      }),
    );
    expect(store.getState().auth.refreshToken).toBe("r1");
  });

  it("clearSession resets auth and cart draft", () => {
    const store = createStore();
    store.dispatch(
      setSession({
        accessToken: "tok",
        refreshToken: "ref",
        user: testUser,
      }),
    );
    store.dispatch(clearSession());
    expect(store.getState().auth).toEqual({
      accessToken: null,
      refreshToken: null,
      user: null,
    });
    expect(store.getState().cartDraft.byUserId).toEqual({});
  });
});
