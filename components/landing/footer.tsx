import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#2b211b] px-4 py-10 text-white">
      <div className="container mx-auto text-center">
        <p className="text-sm text-white/70">&copy; {new Date().getFullYear()} Coffeemium. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-4">
          <a href="mailto:hello@coffeemium.com" className="text-sm text-white/80 hover:text-[#f4d9b8]">Contact Us</a>
          <Link href="/shop" className="text-sm text-white/80 hover:text-[#f4d9b8]">Shop coffee</Link>
        </div>
      </div>
    </footer>
  );
}
