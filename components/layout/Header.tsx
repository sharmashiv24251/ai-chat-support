"use client";

import Link from "next/link";
import { useState } from "react";

interface HeaderProps {
  onChatOpen?: () => void;
}

export default function Header({ onChatOpen }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount] = useState(0);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/70 border-b border-neutral-200/60">
      <div className="max-w-screen-2xl mx-auto flex items-center justify-between py-4 px-6 lg:px-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <div className="text-xl tracking-tight font-serif italic text-neutral-900">
            BuyHard
            <span className="text-neutral-400 not-italic text-sm">™</span>
          </div>
        </Link>

        {/* Center Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-500">
          <Link
            href="/"
            className="hover:text-black transition-colors duration-300"
          >
            Home
          </Link>
          <Link
            href="/#products"
            className="hover:text-black transition-colors duration-300"
          >
            Shop
          </Link>
          <button className="hover:text-black transition-colors duration-300">
            Stories
          </button>
        </nav>

        {/* Right Icons */}
        <div className="flex items-center gap-4">
          <button className="group relative p-2 text-neutral-600 hover:text-black transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>
          <button className="group relative p-2 text-neutral-600 hover:text-black transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 10a4 4 0 0 1-8 0M3.103 6.034h17.794" />
              <path d="M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center rounded-full bg-black text-[10px] font-medium h-4 w-4 text-white">
                {cartCount}
              </span>
            )}
          </button>
          <button
            className="md:hidden p-2 text-neutral-600 hover:text-black"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 border-b border-neutral-100 backdrop-blur-xl absolute w-full left-0 top-full">
          <div className="px-6 py-6 flex flex-col gap-4">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-left text-sm font-medium text-neutral-600"
            >
              Home
            </Link>
            <Link
              href="/#products"
              onClick={() => setMobileMenuOpen(false)}
              className="text-left text-sm font-medium text-neutral-600"
            >
              Shop
            </Link>
            <button className="text-left text-sm font-medium text-neutral-600">
              Support
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
