import { useEffect } from "react";
import { Navigate, Outlet } from "react-router";
import {
  selectAccessToken,
  selectActiveCartId,
  selectIsAuthenticated,
  selectUser,
  setSession,
} from "@/store/authSlice";
import { useGetAuthMeQuery } from "@/store/dummyJsonApi";
import { useAppDispatch, useAppSelector } from "@/store";

/** Route guard: validates session via `/auth/me`. 401 handling lives in `baseQueryWithAuthHandling`. */
export function ProtectedLayout() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const accessToken = useAppSelector(selectAccessToken);
  const activeCartId = useAppSelector(selectActiveCartId);
  const user = useAppSelector(selectUser);
  const { data: authMe, isFetching } = useGetAuthMeQuery(undefined, {
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

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (accessToken && isFetching) {
    return null;
  }

  return <Outlet />;
}
