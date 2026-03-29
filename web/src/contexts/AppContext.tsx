"use client";

import React, { createContext, useContext } from "react";
import { toast } from "sonner";
import { useValidateToken } from "@/hooks/use-auth";

type ToastMessage = {
  message: string;
  type: "SUCCESS" | "ERROR";
};

type AppContext = {
  isLoggedIn: boolean;
  stripePromise: null;
  showToast: (toastMessage: ToastMessage) => void;
};

const AppContext = createContext<AppContext | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, isError, isLoading } = useValidateToken();

  const showToast = (toastMessage: ToastMessage) => {
    toast[toastMessage.type === "SUCCESS" ? "success" : "error"](
      toastMessage.message,
    );
  };

  return (
    <AppContext.Provider
      value={{
        isLoggedIn: !isError && !!data && !isLoading,
        stripePromise: null,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
