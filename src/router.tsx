import { createBrowserRouter, RouterProvider } from "react-router";
import App from "@/App";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
