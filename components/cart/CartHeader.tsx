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
import { ShoppingCart, Coffee } from "lucide-react";

export default function CartHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg">
      <div className="mx-auto max-w-screen-xl flex items-center justify-between h-20 px-6">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/images/Logo/Coffeemium.png"
              alt="Coffeemium"
              width={48}
              height={48}
              className="object-contain"
            />
            <Coffee className="w-6 h-6 text-[#6c47ff] hidden group-hover:block animate-pulse" />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link className="nav-link" href="/">
              Home
            </Link>
            <Link className="nav-link" href="/shop">
              Shop
            </Link>
            <Link className="nav-link text-primary font-semibold" href="/cart">
              Cart
            </Link>
          </nav>
        </div>

        {/* Right: Cart + User */}
        <div className="flex items-center gap-4">
          <Link
            href="/cart"
            className="relative hover:opacity-70 transition group"
          >
            <ShoppingCart className="w-6 h-6 text-foreground hover-scale group-hover:text-[#6c47ff] transition-colors" />
          </Link>

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>

          <SignedOut>
            <SignInButton />
            <SignUpButton>
              <button className="btn-brand hidden sm:flex">Sign Up</button>
            </SignUpButton>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}
