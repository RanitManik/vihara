import Link from "next/link";
import { ArrowUpRight, Instagram, MapPinned, Twitter } from "lucide-react";

const footerColumns = [
  {
    title: "Explore",
    links: [
      { href: "/search", label: "Luxury escapes" },
      { href: "/search", label: "Weekend retreats" },
      { href: "/search", label: "Family-friendly stays" },
    ],
  },
  {
    title: "Hosting",
    links: [
      { href: "/add-hotel", label: "List your hotel" },
      { href: "/my-hotels", label: "Manage properties" },
      { href: "/auth", label: "Owner sign in" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/auth", label: "Account help" },
      { href: "/my-bookings", label: "Manage bookings" },
      { href: "/search", label: "Travel inspiration" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="px-4 pt-12 pb-4 sm:px-6 lg:px-8">
      <div className="container-shell surface-panel overflow-hidden px-6 py-8 sm:px-8 sm:py-10">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-6">
            <div className="space-y-3">
              <p className="section-kicker">Journey with intention</p>
              <h2 className="font-heading text-4xl leading-none font-semibold sm:text-5xl">
                Vihara curates stays that feel as memorable as the destination.
              </h2>
              <p className="text-muted-foreground max-w-2xl text-base leading-7">
                Boutique hotels, calmer booking flows, and travel decisions that
                feel considered instead of chaotic.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/search"
                className="bg-primary text-primary-foreground inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold"
              >
                Explore stays
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="/add-hotel"
                className="bg-secondary text-secondary-foreground inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold"
              >
                Host with Vihara
              </Link>
            </div>

            <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <MapPinned className="text-primary h-4 w-4" />
                Curated across modern cities and slow-travel destinations
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  <Instagram className="h-4 w-4" />
                </Link>
                <Link
                  href="#"
                  className="hover:text-foreground transition-colors"
                >
                  <Twitter className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3 lg:grid-cols-3">
            {footerColumns.map((column) => (
              <div key={column.title} className="space-y-4">
                <h3 className="text-sm font-semibold tracking-[0.18em] uppercase">
                  {column.title}
                </h3>
                <div className="space-y-3">
                  {column.links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground block text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-border/70 text-muted-foreground mt-10 flex flex-col gap-3 border-t pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} Vihara. Designed for calmer
            travel.
          </p>
          <div className="flex gap-5">
            <Link href="#" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
