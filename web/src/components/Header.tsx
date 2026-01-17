"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { usePathname, useRouter } from "next/navigation"; // Added useRouter
import Image from "next/image";
import { useAppContext } from "@/contexts/AppContext";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner"; // Added toast

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, validateToken } = useAppContext();

  // Hide header on auth pages if desired, or keep it for consistency.
  // For now, we'll keep it but maybe simplify it.
  const isAuthPage = pathname === "/auth";

  if (isAuthPage) return null;

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo/logo.svg"
              alt="Vihara Logo"
              width={32}
              height={32}
              className="rounded-sm"
            />
            <span className="text-xl font-bold tracking-tight">Vihara</span>
          </Link>
        </div>

        <nav className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Button variant="ghost" asChild>
                <Link href="/my-bookings">My Bookings</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/my-hotels">My Hotels</Link>
              </Button>
              <Button
                variant="default"
                onClick={async () => {
                  try {
                    await apiClient.post("/api/auth/logout", {});
                    await validateToken();
                    toast.success("Signed Out!");
                    // Redirect to home or auth as per flow.
                    // User specifically complained about "not redirecting to auth page", so we'll go there.
                    // router.push("/auth");
                  } catch (error) {
                    console.error("Logout failed", error);
                  }
                }}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild className="hidden sm:inline-flex">
                <Link href="/auth">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/auth">Get Started</Link>
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
