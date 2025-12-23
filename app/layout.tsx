import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { ShellLayout } from "@/components/layout/shell-layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Midas Cercle",
  description: "A unified web application for managing Forge OS and Orunmila systems.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <ShellLayout>
            {children}
          </ShellLayout>
        </Providers>
      </body>
    </html>
  );
}
