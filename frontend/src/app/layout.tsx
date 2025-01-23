'use client';  // Marking the component as client-side

import { Inter } from "next/font/google";
import "./globals.css";
import { ReactQueryClientProvider } from "@/components/ReactQueryClientProvider";
import StoreProvider from "./storeProvider";
import useModulePermission from '../components/hooks/useModulePermission';

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Correctly using the hook inside the client-side component
  // useModulePermission();

  return (
    <StoreProvider>
      <ReactQueryClientProvider>
        <html lang="en">
          <body className={inter.className}>
            {children}
          </body>
        </html>
      </ReactQueryClientProvider>
    </StoreProvider>
  );
}
