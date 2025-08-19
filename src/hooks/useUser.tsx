"use client";
import React, { useState, createContext, useContext, useEffect } from "react";
type Role = "admin" | "worker";
interface User {
  name: string;
  role: Role;
  isAuthenticated: boolean;
  setRole: (role: Role) => void;
}
const UserContext = createContext<User | null>(null);
export function UserProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>("admin");
  useEffect(() => {
    const saved = localStorage.getItem("userRole") as Role | null;
    if (saved) setRole(saved);
  }, []);
  const changeRole = (newRole: Role) => {
    localStorage.setItem("userRole", newRole);
    setRole(newRole);
  };
  const value: User = {
    name: "Олексій",
    role,
    isAuthenticated: true,
    setRole: changeRole,
  };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside <UserProvider>");
  return ctx;
}
