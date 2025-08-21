"use client";
import { useUser } from "@/context/UserContextProvider";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export const AuthGate = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user || !user.is_active) {
        router.replace("/login"); // client-side redirect
      }
    }
  }, [isLoading, user, router]);

  if (isLoading) return null; // user aweit
  if (!user || !user.is_active) return null;

  return <>{children}</>;
};
