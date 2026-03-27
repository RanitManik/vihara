import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import NextTopLoader from "nextjs-toploader";

import "./global.css";
import { AppProvider } from "@/contexts/AppContext";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const headingFont = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "600", "700"],
});

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Vihara | Boutique Stays and Beautiful Journeys",
  description:
    "Discover thoughtful stays, seamless booking, and elevated travel planning with Vihara.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${headingFont.variable} ${bodyFont.variable}`}
      suppressHydrationWarning
    >
      <body className="font-body flex min-h-screen flex-col antialiased">
        <AppProvider>
          <Header />
          <div className="flex flex-1 flex-col">{children}</div>
          <Footer />
          <Toaster position="top-center" richColors />
          <NextTopLoader color="#dd8f66" showSpinner={false} />
        </AppProvider>
      </body>
    </html>
  );
}
