"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import {
  SignedOut,
  SignInButton,
  SignUpButton,
  SignedIn,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { ShoppingBag } from "lucide-react";
import { getCartItemCount as getLocalStorageCartItemCount } from "@/lib/localStorageCart"; // Import for localStorage count

// Function to fetch cart count from the database API
const getDatabaseCartItemCount = async (): Promise<number> => {
  try {
    const response = await fetch("/api/cart"); // Assuming GET /api/cart returns cart data
    if (!response.ok) {
      console.error("Failed to fetch cart count from DB:", response.statusText);
      return 0;
    }
    const data = await response.json();
    if (data.cart && data.cart.items) {
      return data.cart.items.reduce(
        (total: number, item: any) => total + item.quantity,
        0
      );
    }
    return 0; // No cart or items found
  } catch (error) {
    console.error("Error fetching cart count from DB:", error);
    return 0;
  }
};

export default function Header() {
  const pathname = usePathname() || "/";
  const { isLoaded, isSignedIn, user } = useUser();
  const [cartItemCount, setCartItemCount] = useState(0);

  // Effect to fetch cart count when auth status or user changes
  useEffect(() => {
    const fetchCartCount = async () => {
      if (!isLoaded) return; // Wait for auth status to load

      if (isSignedIn) {
        const count = await getDatabaseCartItemCount();
        setCartItemCount(count);
      } else {
        // For guests, use localStorage
        setCartItemCount(getLocalStorageCartItemCount());
      }
    };

    fetchCartCount();
  }, [isLoaded, isSignedIn, user]); // Re-run when auth status or user changes

  const routeActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-14 w-16 overflow-hidden sm:h-16 sm:w-20">
              <Image
                src="/images/Logo/Coffeemium.png"
                alt="Coffeemium"
                fill
                className="object-contain"
              />
            </div>
            <span className="sr-only">Coffeemium home</span>
          </Link>

          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink href="/" asChild>
                  <Link
                    href="/"
                    className={`rounded-full px-3 py-2 text-sm transition-colors ${routeActive("/") ? "bg-[#f2e8dc] font-semibold text-[#3b281e]" : "text-muted-foreground hover:bg-[#f7efe7] hover:text-foreground"}`}
                    aria-current={routeActive("/") ? "page" : undefined}
                  >
                    Home
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink href="/shop" asChild>
                  <Link
                    href="/shop"
                    className={`rounded-full px-3 py-2 text-sm transition-colors ${routeActive("/shop") ? "bg-[#f2e8dc] font-semibold text-[#3b281e]" : "text-muted-foreground hover:bg-[#f7efe7] hover:text-foreground"}`}
                    aria-current={routeActive("/shop") ? "page" : undefined}
                  >
                    Shop
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="mr-0 flex items-center gap-2 sm:gap-4">
          {/* Cart link with count */}
          <Link
            href="/cart"
            className={`relative flex items-center gap-2 rounded-full px-3 py-2 text-sm transition-colors hover:bg-[#f7efe7] ${routeActive("/cart") ? "font-semibold text-[#3b281e]" : ""}`}
            aria-label="Cart"
          >
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Cart</span>
            {/* Cart count badge */}
            {cartItemCount > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                {cartItemCount > 99 ? "99+" : cartItemCount}
              </span>
            )}
          </Link>
          {/* Authentication buttons */}
          <SignedOut>
            <SignInButton>
              <button className="hidden rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-[#f7efe7] hover:text-foreground sm:inline-flex">
                Sign in
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="h-10 cursor-pointer rounded-full bg-[#3b281e] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#563b2b] sm:h-11 sm:px-5">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
