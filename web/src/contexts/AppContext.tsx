"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

type ToastMessage = {
  message: string;
  type: "SUCCESS" | "ERROR";
};

type AppContext = {
  isLoggedIn: boolean;
  stripePromise: null;
  showToast: (toastMessage: ToastMessage) => void;
  validateToken: () => Promise<void>;
};

const AppContext = createContext<AppContext | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [toastMessage, setToastMessage] = useState<ToastMessage | undefined>(
    undefined,
  );

  const showToast = (toastMessage: ToastMessage) => {
    setToastMessage(toastMessage);
  };

  const validateToken = async () => {
    try {
      await apiClient.get("/api/auth/validate-token");
      setIsLoggedIn(true);
    } catch {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    validateToken();
  }, []);

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        stripePromise: null,
        showToast,
        validateToken,
      }}
    >
      {toastMessage && (
        <div className="hidden">
          {/* Toast logic handled by sonner usage directly in components mostly, but keeping structure for future */}
          {toast[toastMessage.type === "SUCCESS" ? "success" : "error"](
            toastMessage.message,
          )}
          {/* Reset after render? Toast lib handles it usually. */}
        </div>
      )}
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
