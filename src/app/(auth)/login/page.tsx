"use client";
import React, { useState } from "react";
import { useUser } from "@/context/UserContextProvider";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/Login/LoginForm";
import { loginUser } from "@/api/auth";

export default function LoginPage() {
  const { login } = useUser();
  const router = useRouter();
  const [error, setError] = useState("");

  const handleLogin = async (username: string, password: string) => {
    setError("");
    try {
      const data = await loginUser(username, password);

      login({ ...data.user, isAuthenticated: true });
      localStorage.setItem("token", data.token);

      if (data.user.role === "admin" || data.user.role === "accountant") {
        router.replace("/admin");
      } else if (data.user.role === "driver") {
        router.replace("/driver");
      } else {
        router.replace("/login");
      }
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Сталася невідома помилка");
    }
  };

  return (
    <>
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      <LoginForm onLogin={handleLogin} />
    </>
  );
}
