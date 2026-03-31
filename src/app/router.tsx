import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import { ProtectedLayout } from "@/app/layouts/protected-layout";
import { CartPage } from "@/pages/cart-page";
import { CatalogPage } from "@/pages/catalog-page";
import { LoginPage } from "@/pages/login-page";
import { ProfilePage } from "@/pages/profile-page";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <ProtectedLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/catalog" replace />,
      },
      {
        path: "catalog",
        element: <CatalogPage />,
      },
      {
        path: "cart",
        element: <CartPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
