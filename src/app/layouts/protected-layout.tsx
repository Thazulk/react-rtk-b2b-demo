import { Navigate, Outlet } from "react-router";
import { NavigationDrawer } from "@/components/shared/navigation-drawer";
import { selectIsAuthenticated } from "@/store/authSlice";
import { useAppSelector } from "@/store";

export function ProtectedLayout() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <NavigationDrawer />
      <Outlet />
    </>
  );
}
