import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import { ProtectedLayout } from "@/app/layouts/protected-layout";
import { BrowsePage } from "@/pages/browse-page";
import { LoginPage } from "@/pages/login-page";
import { ProfilePage } from "@/pages/profile-page";
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
      {
        path: "profile",
        element: <ProfilePage />,
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
