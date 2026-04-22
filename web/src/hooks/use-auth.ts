"use client";

import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, clearCsrfToken } from "@/lib/api-client";
import { toast } from "sonner";
import { useRouter } from "nextjs-toploader/app";
import { UserType } from "@/shared-types";

export const useValidateToken = () => {
  return useQuery({
    queryKey: ["validate-token"],
    queryFn: () => apiClient.get("/api/auth/validate-token"),
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useGetMe = () => {
  return useQuery<UserType>({
    queryKey: ["fetch-me"],
    queryFn: () => apiClient.get<UserType>("/api/users/me"),
    retry: false,
  });
};

type RegisterData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (values: RegisterData) =>
      apiClient.post("/api/users/register", values),
    onSuccess: () => {
      toast.success("Registration Successful!");
      clearCsrfToken();
      queryClient.invalidateQueries({ queryKey: ["validate-token"] });
      router.push("/");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

type LoginData = {
  email: string;
  password: string;
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (values: LoginData) =>
      apiClient.post("/api/auth/login", values),
    onSuccess: () => {
      toast.success("Logged in successfully!");
      clearCsrfToken();
      queryClient.invalidateQueries({ queryKey: ["validate-token"] });
      router.push("/");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

// Exchanges the short-lived oauth_code (set in the URL by the backend after
// Google OAuth) for the actual auth_token cookie. This fetch is a first-party
// CORS request from the frontend domain, which bypasses Safari's ITP that
// would otherwise block cookies set during cross-site redirect chains.
//
// The hook deliberately does NOT handle toasts or navigation — the caller
// (auth/callback/page.tsx) owns the success/error UX.
export const useGoogleOAuthExchange = () => {
  const queryClient = useQueryClient();

  const exchange = useCallback(
    async (oauthCode: string): Promise<void> => {
      await apiClient.get(
        `/api/auth/oauth-complete?oauth_code=${encodeURIComponent(oauthCode)}`,
      );
      clearCsrfToken();
      await queryClient.invalidateQueries({ queryKey: ["validate-token"] });
    },
    [queryClient],
  );

  return { exchange };
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => apiClient.post("/api/auth/logout", {}),
    onSuccess: async () => {
      toast.success("Signed out successfully!");
      clearCsrfToken();
      // Explicitly set to null AND invalidate to ensure all subscribers update
      queryClient.setQueryData(["validate-token"], null);
      await queryClient.invalidateQueries({ queryKey: ["validate-token"] });
      queryClient.removeQueries();
      router.push("/");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
