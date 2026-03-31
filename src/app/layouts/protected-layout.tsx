import { Navigate, Outlet } from "react-router";
import { selectIsAuthenticated } from "@/store/authSlice";
import { useAppSelector } from "@/store";

export function ProtectedLayout() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
