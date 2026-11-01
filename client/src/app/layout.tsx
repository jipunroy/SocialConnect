
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { Navbar } from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SocialConnect | Connect People. Create Impact.",
  description:
    "Connect people, create meaningful community events and make a positive impact.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider>
          <div
            id="top"
            className="flex min-h-screen flex-col"
          >
            <Navbar />

            <main className="flex-1">
              {children}
            </main>

            <Footer />
          </div>

          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
