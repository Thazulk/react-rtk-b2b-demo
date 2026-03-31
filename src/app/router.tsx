import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import { ProtectedLayout } from "@/app/layouts/protected-layout";
import { BrowsePage } from "@/pages/browse-page";
import { LoginPage } from "@/pages/login-page";
import { StorefrontPage } from "@/pages/storefront-page";

const router = createBrowserRouter([
  {
    path: "/browse",
    element: <BrowsePage />,
  },
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
        element: <StorefrontPage />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/browse" replace />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
