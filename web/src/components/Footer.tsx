import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-zinc-900 py-12 text-zinc-400">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Vihara</h3>
            <p className="text-sm">
              Discover your next great adventure. We provide the best hotels and
              destinations for your travel needs.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-white uppercase">
              Company
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-white uppercase">
              Support
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  Safety Information
                </Link>
              </li>
              <li>
                <Link href="#" className="transition-colors hover:text-white">
                  Cancellation Options
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-white uppercase">
              Follow Us
            </h3>
            <div className="flex space-x-4">
              <Link href="#" className="transition-colors hover:text-white">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="transition-colors hover:text-white">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="transition-colors hover:text-white">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-zinc-800 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Vihara. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
