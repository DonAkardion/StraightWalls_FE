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
      if (!user || !user.is_active) {
        router.replace("/login");
      } else if (user.role === "admin") {
        router.replace("/admin");
      } else if (user.role === "accountant") {
        router.replace("/accountant");
      } else {
        router.replace("/driver");
      }
    }
  }, [isLoading, user, router]);

  return null;
}
