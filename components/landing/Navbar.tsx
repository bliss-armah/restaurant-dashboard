"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface NavbarProps {
  isLoggedIn: boolean;
}

const NAV_LINKS = [
  { label: "How It Works", id: "how-it-works" },
  { label: "Features", id: "features" },
  { label: "Pricing", id: "pricing" },
  { label: "Contact", id: "contact" },
];

export default function Navbar({ isLoggedIn }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#080808]/95 backdrop-blur-md border-b border-white/10 shadow-xl"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-[#25D366] to-[#128C7E] rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-base leading-none">
                C
              </span>
            </div>
            <span className="text-xl font-black tracking-tight text-white">
              Choppa
            </span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map(({ label, id }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                {label}
              </button>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="bg-[#25D366] hover:bg-[#128C7E] text-white text-sm px-5 py-2.5 rounded-lg font-semibold transition-all hover:scale-105"
              >
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Sign in
                </Link>
                <button
                  onClick={() => scrollTo("contact")}
                  className="bg-[#25D366] hover:bg-[#128C7E] text-white text-sm px-5 py-2.5 rounded-lg font-semibold transition-all hover:scale-105"
                >
                  Get Started Free
                </button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-gray-400 hover:text-white p-2"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <div className="w-5 space-y-1.5">
              <span
                className={`block h-0.5 bg-current transition-all duration-200 ${
                  mobileOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`block h-0.5 bg-current transition-all duration-200 ${
                  mobileOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 bg-current transition-all duration-200 ${
                  mobileOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/10 py-4 space-y-1 animate-fade-in">
            {NAV_LINKS.map(({ label, id }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="block w-full text-left px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg text-sm transition-colors"
              >
                {label}
              </button>
            ))}
            <div className="pt-3 px-4 flex flex-col gap-2">
              <Link
                href="/login"
                className="text-center py-2.5 border border-white/20 rounded-lg text-sm text-gray-300 hover:text-white transition-colors"
              >
                Sign in
              </Link>
              <button
                onClick={() => scrollTo("contact")}
                className="text-center py-2.5 bg-[#25D366] rounded-lg text-sm text-white font-semibold hover:bg-[#128C7E] transition-colors"
              >
                Get Started Free
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
