import "./global.css";
import { Toaster } from "@/components/ui/sonner";

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
      <body>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
