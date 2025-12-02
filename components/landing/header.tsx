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
      <div className="container flex h-14 items-center justify-between relative">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3">
            <div
              className="relative h-18 w-20
             overflow-hidden"
            >
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
                    className={`px-2 py-1 rounded ${routeActive("/") ? "font-semibold text-foreground" : "text-muted-foreground hover:text-foreground"}`}
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
                    className={`px-2 py-1 rounded ${routeActive("/shop") ? "font-semibold text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    Shop
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-4 mr-4">
          {/* Cart link with count */}
          <Link
            href="/cart"
            className={`flex items-center gap-2 px-3 py-1 rounded hover:bg-muted/50 ${routeActive("/cart") ? "font-semibold" : ""}`}
            aria-label="Cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" strokeWidth="0" />
              <path d="M7 13l-1.2 6.4A1 1 0 0 0 6.8 21H19" strokeWidth="0" />
              <circle cx="10" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
            </svg>
            <span className="hidden sm:inline">Cart</span>
            {/* Cart count badge */}
            {cartItemCount > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                {cartItemCount}
              </span>
            )}
          </Link>
          {/* Authentication buttons */}
          <SignedOut>
            <SignInButton />
            <SignUpButton>
              <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
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
