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
import { authReducer } from "@/store/authSlice";
import { dummyJsonApi } from "@/store/dummyJsonApi";

const createNoopStorage = () => ({
  getItem: (_key: string) => Promise.resolve(null),
  setItem: (_key: string, value: string) => Promise.resolve(value),
  removeItem: (_key: string) => Promise.resolve(),
});

const storage =
  typeof window === "undefined" ? createNoopStorage() : createWebStorage("local");

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["accessToken", "user", "activeCartId"],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
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
