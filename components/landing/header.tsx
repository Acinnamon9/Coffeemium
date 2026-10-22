"use client";

import React, { useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  SignedOut,
  SignInButton,
  SignUpButton,
  SignedIn,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { Menu, ShoppingBag, X } from "lucide-react";
import { getCartItemCount as getLocalStorageCartItemCount } from "@/lib/localStorageCart"; // Import for localStorage count
import { useCart } from "@/hooks/useCart";

export default function Header() {
  const pathname = usePathname() || "/";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isSignedIn } = useUser();
  const { totalItems } = useCart();
  const guestCartItemCount = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("storage", onStoreChange);
      window.addEventListener("cart-updated", onStoreChange);
      return () => {
        window.removeEventListener("storage", onStoreChange);
        window.removeEventListener("cart-updated", onStoreChange);
      };
    },
    getLocalStorageCartItemCount,
    () => 0
  );

  const cartItemCount = isSignedIn ? totalItems : guestCartItemCount;

  const routeActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(href + "/");

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#eadfd3] bg-[#fbf7f2]/95 shadow-[0_4px_18px_rgb(59_40_30/6%)] backdrop-blur supports-backdrop-filter:bg-[#fbf7f2]/85">
      <div className="mx-auto flex min-h-[4.5rem] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-3" onClick={closeMobileMenu}>
            <div className="relative h-16 w-20 overflow-hidden sm:h-[4.5rem] sm:w-24">
              <Image
                src="/images/Logo/Coffeemium.png"
                alt="Coffeemium"
                fill
                sizes="80px"
                quality={70}
                className="object-contain"
              />
            </div>
            <span className="sr-only">Coffeemium home</span>
          </Link>

          <nav className="ml-8 hidden items-center gap-7 md:flex" aria-label="Primary navigation">
            <Link
              href="/"
              className={`border-b-2 py-2 text-sm transition-colors ${routeActive("/") ? "border-[#8b5e3c] font-semibold text-[#3b281e]" : "border-transparent text-[#6f625b] hover:border-[#d4a373] hover:text-[#3b281e]"}`}
              aria-current={routeActive("/") ? "page" : undefined}
            >
              Home
            </Link>
            <Link
              href="/shop"
              className={`border-b-2 py-2 text-sm transition-colors ${routeActive("/shop") ? "border-[#8b5e3c] font-semibold text-[#3b281e]" : "border-transparent text-[#6f625b] hover:border-[#d4a373] hover:text-[#3b281e]"}`}
              aria-current={routeActive("/shop") ? "page" : undefined}
            >
              Shop
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3">
          <Link
            href="/cart"
            className={`relative flex items-center gap-2 rounded-full px-3 py-2 text-sm text-[#6f625b] transition-colors hover:bg-[#f2e8dc] hover:text-[#3b281e] ${routeActive("/cart") ? "font-semibold text-[#3b281e]" : ""}`}
            aria-label="Cart"
          >
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Cart</span>
            {cartItemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-[#8b5e3c] px-1 text-[10px] font-bold leading-none text-white">
                {cartItemCount > 99 ? "99+" : cartItemCount}
              </span>
            )}
          </Link>
          <SignedOut>
            <SignInButton>
              <button className="hidden rounded-full px-3 py-2 text-sm font-medium text-[#6f625b] transition hover:bg-[#f2e8dc] hover:text-[#3b281e] sm:inline-flex">
                Sign in
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="hidden h-10 cursor-pointer rounded-full border border-[#c8a98d] bg-transparent px-4 text-sm font-semibold text-[#3b281e] transition hover:border-[#3b281e] hover:bg-[#f2e8dc] sm:inline-flex sm:items-center">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
          <Link
            href="/demo"
            className="hidden rounded-full bg-[#3b281e] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#563b2b] hover:shadow-md sm:inline-flex"
            aria-current={routeActive("/demo") ? "page" : undefined}
          >
            Customize
          </Link>
          <button
            type="button"
            className="ml-1 inline-flex h-10 w-10 items-center justify-center rounded-full text-[#3b281e] transition hover:bg-[#f2e8dc] md:hidden"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav id="mobile-navigation" className="border-t border-[#eadfd3] bg-[#fbf7f2] px-4 py-3 md:hidden" aria-label="Mobile navigation">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            <Link
              href="/"
              onClick={closeMobileMenu}
              className={`rounded-xl px-4 py-3 text-sm transition-colors ${routeActive("/") ? "bg-[#f2e8dc] font-semibold text-[#3b281e]" : "text-[#6f625b] hover:bg-[#f7efe7] hover:text-[#3b281e]"}`}
              aria-current={routeActive("/") ? "page" : undefined}
            >
              Home
            </Link>
            <Link
              href="/shop"
              onClick={closeMobileMenu}
              className={`rounded-xl px-4 py-3 text-sm transition-colors ${routeActive("/shop") ? "bg-[#f2e8dc] font-semibold text-[#3b281e]" : "text-[#6f625b] hover:bg-[#f7efe7] hover:text-[#3b281e]"}`}
              aria-current={routeActive("/shop") ? "page" : undefined}
            >
              Shop
            </Link>
            <Link
              href="/demo"
              onClick={closeMobileMenu}
              className="mt-1 rounded-xl bg-[#3b281e] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#563b2b]"
              aria-current={routeActive("/demo") ? "page" : undefined}
            >
              Customize this demo
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
