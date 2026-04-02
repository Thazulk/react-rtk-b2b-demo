import { authReducer } from "@/store/authSlice";
import { cartDraftReducer } from "@/store/cartDraftSlice";
import { dummyJsonApi } from "@/store/dummyJsonApi";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist";
import createWebStorage from "redux-persist/es/storage/createWebStorage";

const noopStorage = {
  getItem: () => Promise.resolve(null),
  setItem: (_key: string, value: string) => Promise.resolve(value),
  removeItem: () => Promise.resolve(),
};

const isServer = typeof window === "undefined";
const storage = isServer ? noopStorage : createWebStorage("local");
const authStorage = isServer ? noopStorage : createWebStorage("session");

const authPersistConfig = {
  key: "auth",
  storage: authStorage,
  whitelist: ["accessToken", "user", "activeCartId"],
};

const cartDraftPersistConfig = {
  key: "cartDraft",
  storage,
  whitelist: ["byUserId"],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  cartDraft: persistReducer(cartDraftPersistConfig, cartDraftReducer),
  [dummyJsonApi.reducerPath]: dummyJsonApi.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(dummyJsonApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
