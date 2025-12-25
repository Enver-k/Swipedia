import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { BottomNav, TopBar } from "@/components/layout";
import { Toast } from "@/components/ui";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Swipedia - Discover Wikipedia",
  description: "A swipe-first Wikipedia discovery experience. Explore random articles, save your favorites, and dive deep into topics that interest you.",
  keywords: ["wikipedia", "discovery", "learning", "articles", "swipe"],
  authors: [{ name: "Swipedia" }],
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-gray-50 dark:bg-gray-950`}>
        <Providers>
          <TopBar />
          <main className="pt-14 pb-20 min-h-screen">
            {children}
          </main>
          <BottomNav />
          <Toast />
        </Providers>
      </body>
    </html>
  );
}
