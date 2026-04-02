import type { RootState } from "@/store/store";
import type { User } from "@/types/dummyjson";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  activeCartId: number | null;
}

interface SessionPayload {
  accessToken: string;
  user: User;
  activeCartId?: number | null;
}

const initialState: AuthState = {
  accessToken: null,
  user: null,
  activeCartId: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<SessionPayload>) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      state.activeCartId = action.payload.activeCartId ?? null;
    },
    clearSession: (state) => {
      state.accessToken = null;
      state.user = null;
      state.activeCartId = null;
    },
    setActiveCartId: (state, action: PayloadAction<number | null>) => {
      state.activeCartId = action.payload;
    },
  },
});

export const { setSession, clearSession, setActiveCartId } = authSlice.actions;
export const authReducer = authSlice.reducer;

export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectUser = (state: RootState) => state.auth.user;
export const selectActiveCartId = (state: RootState) => state.auth.activeCartId;
export const selectIsAuthenticated = (state: RootState) =>
  Boolean(state.auth.accessToken && state.auth.user);
