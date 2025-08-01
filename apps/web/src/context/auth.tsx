"use client"

import { useApiMutation } from "@/hooks/use-api-mutation";
import { useApiQuery } from "@/hooks/use-api-query";
import { ApiUserSelfGet } from "@packages/common";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

type AuthContextType = {
  user: ApiUserSelfGet.Response200 | undefined;
  isLoading: boolean;
  state: "authenticated" | "unauthenticated" | "loading";
  logout: () => void;
}

export const AuthContext = React.createContext<AuthContextType>({
  user: {} as ApiUserSelfGet.Response200,
  isLoading: false,
  state: "loading",
  logout: () => {
    throw new Error("logout function must be provided");
  }
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = React.useState<"authenticated" | "unauthenticated" | "loading">("loading");
  const { data, isLoading, error } = useApiQuery("[GET] /api/user/self", { retry: false });
  const { mutate } = useApiMutation("[POST] /api/auth/logout");
  const router = useRouter();

  const logout = () => {
    mutate({}, { onSuccess: () => router.push("/auth/login") });
  }

  useEffect(() => {
    if (!isLoading) {
      setState(data && !error ? "authenticated" : "unauthenticated");
      if (error) {
        console.error("Error fetching user data:", error);
        logout();
      }
    }
  }, [error, data, isLoading]);

  return (
    <AuthContext.Provider value={{
      state,
      isLoading,
      user: data,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}