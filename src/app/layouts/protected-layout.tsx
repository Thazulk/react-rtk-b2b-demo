import { useEffect } from "react";
import { Navigate, Outlet } from "react-router";
import { NavigationDrawer } from "@/components/shared/navigation-drawer";
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

export function ProtectedLayout() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const accessToken = useAppSelector(selectAccessToken);
  const activeCartId = useAppSelector(selectActiveCartId);
  const user = useAppSelector(selectUser);
  const { data: authMe, isFetching, isError } = useGetAuthMeQuery(undefined, {
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
    if (!accessToken || !isError) {
      return;
    }
    dispatch(clearSession());
    void persistor.purge();
  }, [accessToken, dispatch, isError]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (accessToken && isFetching) {
    return null;
  }

  return (
    <>
      <NavigationDrawer />
      <Outlet />
    </>
  );
}
