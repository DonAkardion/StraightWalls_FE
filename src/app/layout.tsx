import "./globals.css";
import type { Metadata } from "next";
import { Inter, Jura } from "next/font/google";

const jura = Jura({
  variable: "--font-jura",
  subsets: ["latin"],
});

// const inter = Inter({
//   variable: "--font-inter",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "StraightWalls",
  description: "",
  keywords: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jura.variable}`}>
      <body>{children}</body>
    </html>
  );
}
