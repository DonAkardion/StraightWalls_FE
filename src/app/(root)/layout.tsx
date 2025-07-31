import { Header } from "@/components/Main/Header/Header";
import { Footer } from "@/components/Main/Footer/Footer";
import NavigationModul from "@/features/NavigationModul/Navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      <Header />

      <NavigationModul>{children}</NavigationModul>
    </div>
  );
}
