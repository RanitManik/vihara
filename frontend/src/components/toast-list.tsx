"use client";

import React from "react";
import { Toast, useToast } from "@/context/toast-context";
import { CheckCircle, Info, AlertTriangle, XCircle, X } from "lucide-react";

const ToastList: React.FC = () => {
    const { toasts, removeToast } = useToast();

    return (
        <div className="fixed right-5 top-5 z-50 flex flex-col gap-4">
            {toasts.map((toast: Toast) => (
                <ToastItem
                    key={toast.id}
                    toast={toast}
                    removeToast={removeToast}
                />
            ))}
        </div>
    );
};

const ToastItem: React.FC<{
    toast: Toast;
    removeToast: (id: string) => void;
}> = ({ toast, removeToast }) => {
    return (
        <div
            className={`flex w-96 items-start gap-3 rounded-lg p-4 text-white shadow-lg transition-all duration-300 will-change-transform animate-in fade-in slide-in-from-top-3 ${toast.removing ? "animate-out fade-out slide-out-to-top-3" : ""} ${getToastStyle(toast.type)}`}
        >
            {/* Icon */}
            <div className="mt-1">{getToastIcon(toast.type)}</div>

            {/* Message Content */}
            <div className="flex-1">
                <p className="font-semibold">{toast.message}</p>
                {toast.description && (
                    <p className="text-sm opacity-80">{toast.description}</p>
                )}
            </div>

            {/* Close Button */}
            <button onClick={() => removeToast(toast.id)}>
                <X className="h-5 w-5 opacity-80 transition-opacity hover:opacity-100" />
            </button>
        </div>
    );
};

// Function to get Tailwind color styles based on toast type
const getToastStyle = (type?: string) => {
    switch (type) {
        case "success":
            return "bg-green-600";
        case "error":
            return "bg-red-600";
        case "warning":
            return "bg-yellow-600";
        case "info":
        default:
            return "bg-blue-600";
    }
};

// Function to get the correct icon based on toast type
const getToastIcon = (type?: string) => {
    switch (type) {
        case "success":
            return <CheckCircle className="h-5 w-5 text-white" />;
        case "error":
            return <XCircle className="h-5 w-5 text-white" />;
        case "warning":
            return <AlertTriangle className="h-5 w-5 text-white" />;
        case "info":
        default:
            return <Info className="h-5 w-5 text-white" />;
    }
};

export default ToastList;
