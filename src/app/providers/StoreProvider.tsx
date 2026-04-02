import type { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "@/components/ui/sonner";
import { persistor, store } from "@/store";

export function StoreProvider({ children }: PropsWithChildren) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
        <Toaster richColors position="top-center" />
      </PersistGate>
    </Provider>
  );
}
