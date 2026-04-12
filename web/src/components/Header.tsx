"use client";

import Image from "next/image";
import Link from "next/link";
import { Compass, LogOut, Menu } from "lucide-react";
import { usePathname } from "next/navigation";

import { useAppContext } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useLogout } from "@/hooks/use-auth";

const guestLinks = [
  { href: "/", label: "Explore" },
  { href: "/search", label: "Discover stays" },
  { href: "/auth", label: "Sign in" },
];

const memberLinks = [
  { href: "/search", label: "Discover stays" },
  { href: "/my-bookings", label: "My bookings" },
  { href: "/my-hotels", label: "My hotels" },
];

export function Header() {
  const pathname = usePathname();
  const { isLoggedIn } = useAppContext();
  const logout = useLogout();

  if (pathname === "/auth") {
    return null;
  }

  const links = isLoggedIn ? memberLinks : guestLinks;

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-4">
      <div className="surface-panel mx-auto flex h-18 w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="bg-primary/12 border-primary/20 flex h-11 w-11 items-center justify-center rounded-2xl border">
            <Image
              src="/logo/logo.svg"
              alt="Vihara logo"
              width={24}
              height={24}
              className="rounded-sm"
            />
          </div>
          <p className="font-heading text-3xl leading-none font-semibold">
            Vihara
          </p>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          {links.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "font-body rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {!isLoggedIn ? (
            <>
              <Button asChild className="rounded-full px-6">
                <Link href="/auth">Start booking</Link>
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              className="rounded-full px-5"
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
            >
              <LogOut className="h-4 w-4" />
              {logout.isPending ? "Signing out..." : "Sign out"}
            </Button>
          )}
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="px-4">
            <SheetHeader className="px-0">
              <SheetTitle className="font-heading text-3xl">Vihara</SheetTitle>
            </SheetHeader>
            <div className="mt-8 space-y-3">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center justify-between rounded-2xl border px-4 py-4 text-base font-semibold",
                    pathname === link.href ||
                      (link.href !== "/" && pathname.startsWith(link.href))
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card border-border text-foreground",
                  )}
                >
                  {link.label}
                  <Compass className="h-4 w-4" />
                </Link>
              ))}
            </div>
            <SheetFooter className="px-0">
              {!isLoggedIn ? (
                <Button
                  asChild
                  className="h-auto w-full rounded-full px-4 py-4"
                >
                  <Link href="/auth">Create account</Link>
                </Button>
              ) : (
                <Button
                  size="lg"
                  variant="destructive"
                  className="h-auto w-full rounded-full px-4 py-4"
                  onClick={() => logout.mutate()}
                  disabled={logout.isPending}
                >
                  {logout.isPending ? "Signing out..." : "Sign out"}
                </Button>
              )}
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
