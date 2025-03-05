"use client";

import { QueryClient, QueryClientProvider } from "react-query";
import { ReactNode } from "react";

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
            {children}
        </QueryClientProvider>
    );
}
