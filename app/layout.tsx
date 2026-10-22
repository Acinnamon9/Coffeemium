import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/hooks/useCart";

import {
  ClerkProvider,
} from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Coffeemiun - Resume Project",
  description: "A resume project showcasing various skills and technologies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link
            rel="icon"
            href="/icon?<generated>"
            type="image/<generated>"
            sizes="341x249"
          />
        </head>
        <body><CartProvider>{children}</CartProvider></body>
      </html>
    </ClerkProvider>
  );
}
