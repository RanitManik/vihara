import "./global.css";
import { AppProvider } from "@/contexts/AppContext";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Vihara - Hotel Bookings",
  description: "Your journey starts here.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <AppProvider>
          <Header />
          <div className="flex flex-1 flex-col">{children}</div>
          <Footer />
          <Toaster position="top-center" richColors />
        </AppProvider>
      </body>
    </html>
  );
}
