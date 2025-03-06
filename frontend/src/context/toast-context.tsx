"use client";

import React from "react";
import { v4 as uuidv4 } from "uuid";

/**
 * Represents a toast notification.
 */
export interface Toast {
    id: string;
    message: string;
    description?: string;
    type?: "success" | "error" | "info" | "warning";
    removing?: boolean;
    timeout?: NodeJS.Timeout;
}

/**
 * Context type for managing toast notifications.
 */
interface ToastContextType {
    toasts: Toast[];
    addToast: (
        message: string,
        type?: Toast["type"],
        description?: string,
        duration?: number,
    ) => void;
    removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(
    undefined,
);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [toasts, setToasts] = React.useState<Toast[]>([]);

    const addToast = (
        message: string,
        type: Toast["type"] = "info",
        description?: string,
        duration: number = 3000,
    ) => {
        if (
            toasts.some(
                (toast) => toast.message === message && toast.type === type,
            )
        ) {
            return; // Prevent duplicate toasts
        }

        const newToast: Toast = { id: uuidv4(), message, description, type };
        setToasts((prevToasts) => [...prevToasts, newToast]);

        // Set auto-remove timeout
        newToast.timeout = setTimeout(() => removeToast(newToast.id), duration);
    };

    const removeToast = (id: string) => {
        setToasts((prevToasts) =>
            prevToasts.map((toast) =>
                toast.id === id ? { ...toast, removing: true } : toast,
            ),
        );

        setTimeout(() => {
            setToasts((prevToasts) =>
                prevToasts.filter((toast) => toast.id !== id),
            );
        }, 300);
    };

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
        </ToastContext.Provider>
    );
};

export const useToast = (): ToastContextType => {
    const context = React.useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};
