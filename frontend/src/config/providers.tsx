"use client";

import { QueryClient, QueryClientProvider } from "react-query";
import React, { ReactNode } from "react";
import { ToastProvider } from "@/context/toast-context";
import ToastList from "@/components/toast-list";
import { AuthProvider } from "@/context/auth-context";
import NextTopLoader from "nextjs-toploader";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 0,
        },
    },
});

interface ProviderProps {
    children: ReactNode;
}

export default function Providers({ children }: ProviderProps) {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <ToastProvider>
                    <ToastList />
                    <NextTopLoader />
                    {children}
                </ToastProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}
