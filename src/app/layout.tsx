import "./globals.css";
import React from "react";
import type { Metadata } from "next";
import { Inter, Jura, Koulen } from "next/font/google";

const jura = Jura({
  variable: "--font-jura",
  subsets: ["latin"],
});

const koulen = Koulen({
  variable: "--font-koulen",
  weight: "400",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

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
    <html
      lang="en"
      className={`${jura.variable} ${koulen.variable} ${inter.variable}`}
    >
      <body className="">{children}</body>
    </html>
  );
}
