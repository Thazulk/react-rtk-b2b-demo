import type { RootState } from "@/store/store";
import type { User } from "@/types/dummyjson";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
}

interface SessionPayload {
  accessToken: string;
  user: User;
  /** When omitted (e.g. syncing user from `/auth/me`), the stored refresh token is kept. */
  refreshToken?: string | null;
}

interface AuthTokensPayload {
  accessToken: string;
  refreshToken: string;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<SessionPayload>) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      if (action.payload.refreshToken !== undefined) {
        state.refreshToken = action.payload.refreshToken;
      }
    },
    setAuthTokens: (state, action: PayloadAction<AuthTokensPayload>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    clearSession: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
    },
  },
});

export const { setSession, setAuthTokens, clearSession } = authSlice.actions;
export const authReducer = authSlice.reducer;

export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectUser = (state: RootState) => state.auth.user;
export const selectRefreshToken = (state: RootState) => state.auth.refreshToken;
export const selectIsAuthenticated = (state: RootState) =>
  Boolean(state.auth.accessToken && state.auth.user);
