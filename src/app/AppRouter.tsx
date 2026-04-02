import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import { ProtectedLayout, RootLayout } from "@/app/layouts";
import {
  CartPage,
  CatalogPage,
  DashboardPage,
  LoginPage,
  ProductDetailPage,
  ProfilePage,
} from "@/pages";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },
      {
        path: "catalog/:productId",
        element: <ProductDetailPage />,
      },
      {
        path: "catalog",
        element: <CatalogPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        element: <ProtectedLayout />,
        children: [
          {
            path: "dashboard",
            element: <DashboardPage />,
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
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
