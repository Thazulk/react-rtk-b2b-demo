import { useEffect } from "react";
import { Navigate, Outlet } from "react-router";
import {
  clearSession,
  selectAccessToken,
  selectActiveCartId,
  selectIsAuthenticated,
  selectUser,
  setSession,
} from "@/store/authSlice";
import { useGetAuthMeQuery } from "@/store/dummyJsonApi";
import { persistor, useAppDispatch, useAppSelector } from "@/store";

/** Route guard: session + `/auth/me` validation. UI shell lives in `RootLayout`. */
export function ProtectedLayout() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const accessToken = useAppSelector(selectAccessToken);
  const activeCartId = useAppSelector(selectActiveCartId);
  const user = useAppSelector(selectUser);
  const { data: authMe, error, isFetching, isError } = useGetAuthMeQuery(undefined, {
    skip: !accessToken,
  });

  useEffect(() => {
    if (!accessToken || !authMe) {
      return;
    }

    if (!user || user.id !== authMe.id) {
      dispatch(
        setSession({
          accessToken,
          user: authMe,
          activeCartId,
        }),
      );
    }
  }, [accessToken, activeCartId, authMe, dispatch, user]);

  useEffect(() => {
    const status =
      typeof error === "object" && error !== null && "status" in error
        ? error.status
        : undefined;

    if (!accessToken || !isError || status !== 401) {
      return;
    }
    dispatch(clearSession());
    void persistor.purge();
  }, [accessToken, dispatch, error, isError]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (accessToken && isFetching) {
    return null;
  }

  return <Outlet />;
}
