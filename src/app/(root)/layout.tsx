import React from "react";
import { Header } from "@/components/Main/Header/Header";
import NavigationModul from "@/features/NavigationModul/Navigation";
import { AuthGate } from "@/context/AuthGate";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      <AuthGate>
        <Header />

        <NavigationModul>{children}</NavigationModul>
      </AuthGate>
    </div>
  );
}
