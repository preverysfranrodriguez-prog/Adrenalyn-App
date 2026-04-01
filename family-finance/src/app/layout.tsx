import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FamilyProvider } from "@/context/FamilyContext";
import { AuthProvider } from "@/context/AuthContext";
import BottomNav from "@/components/layout/BottomNav";
import LoginOverlay from "@/components/auth/LoginOverlay";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Family Finance",
  description: "Gestión financiera y familiar premium para familias modernas",
  manifest: "/manifest.json",
  themeColor: "#2563eb",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-50 pb-20 md:pb-0 transition-colors duration-300">
        <AuthProvider>
          <LoginOverlay />
          <FamilyProvider>
            <main className="flex-1 w-full max-w-md mx-auto md:max-w-4xl p-4">
              {children}
            </main>
            <BottomNav />
          </FamilyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
