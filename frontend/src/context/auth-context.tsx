"use client";

import React, { createContext, useContext } from "react";
import { useQuery } from "react-query";
import * as apiClient from "@/actions";

/**
 * Context type for managing auth state.
 */
interface AuthContextType {
    isAuthenticated: boolean;
    isCheckingAuth: boolean;
    authError: unknown;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const {
        data: user,
        isLoading: isCheckingAuth,
        error: authError,
    } = useQuery("validateToken", apiClient.validateToken, { retry: false });

    return (
        <AuthContext.Provider
            value={{ isAuthenticated: !!user, isCheckingAuth, authError }}
        >
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Hook to access auth state.
 */
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
