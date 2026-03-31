import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AppRouter } from "@/app/router";
import { StoreProvider } from "@/app/providers/store-provider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StoreProvider>
      <AppRouter />
    </StoreProvider>
  </StrictMode>,
);
