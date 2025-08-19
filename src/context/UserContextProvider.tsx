"use client";
import React, { useState, createContext, useContext, useEffect } from "react";

interface User {
  id: number;
  login: string;
  full_name: string;
  role: string;
  isAuthenticated: boolean;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem("user");
        setUser(null);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (user: User) => {
    setUser({ ...user, isAuthenticated: true });
    localStorage.setItem(
      "user",
      JSON.stringify({ ...user, isAuthenticated: true })
    );
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside <UserProvider>");
  return ctx;
}
