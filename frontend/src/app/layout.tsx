import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReactQueryClientProvider } from "@/components/ReactQueryClientProvider";

import StoreProvider from "./storeProvider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
// const poppins = Poppins({
//   subsets: ["latin"],
//   weight: ["100", "200", "300", "400", "500"],
// });

export const metadata: Metadata = {
  title: "Juidco Assets",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreProvider>
      <ReactQueryClientProvider>
        <html lang="en">
          <body className={inter.className}>{children}</body>
        </html>
      </ReactQueryClientProvider>
    </StoreProvider>
  );
}
