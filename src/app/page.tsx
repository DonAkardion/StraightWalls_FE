"use client";
import { useEffect } from "react";
import { useUser } from "@/context/UserContextProvider";
import { useRouter, usePathname } from "next/navigation";

export default function Home() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/login") return;

    if (!isLoading) {
      if (!user || !user.isAuthenticated) {
        router.replace("/login");
      } else if (user.role === "admin") {
        router.replace("/admin");
      } else {
        router.replace("/driver");
      }
    }
  }, [isLoading, user, router]);

  return null;
}
