"use client";
import Link from "next/link";
import Image from "next/image";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

export default function CartHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-14 items-center justify-between relative">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-18 w-20 overflow-hidden">
              <Image
                src="/images/Logo/Coffeemium.png"
                alt="Coffeemium"
                fill
                className="object-contain"
              />
            </div>
            <span className="sr-only">Coffeemium home</span>
          </Link>

          <nav className="flex items-center space-x-4 lg:space-x-6">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground hover:text-primary"
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="text-sm font-medium text-muted-foreground hover:text-primary"
            >
              Shop
            </Link>
            <Link
              href="/cart"
              className="text-sm font-medium text-primary hover:text-primary"
            >
              Cart
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <SignedIn>
            <UserButton />
          </SignedIn>

          <SignedOut>
            <SignInButton />
            <SignUpButton>
              <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}
