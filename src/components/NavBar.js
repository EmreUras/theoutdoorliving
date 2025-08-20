// src/components/NavBar.js
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoClose } from "react-icons/io5";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import GetQuoteModal from "./quote/GetQuoteModal";

export default function NavBar({ className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openQuote, setOpenQuote] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
  }, [isOpen]);

  const linkBase =
    "px-3 py-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60";
  const isActive = (href) => pathname === href;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[60] ${className}`}
        role="navigation"
        aria-label="Primary"
      >
        <div
          className={[
            "relative mx-auto p-1 lg:p-3  mt-3 w-[92%] max-w-6xl rounded-2xl border backdrop-blur-xl transition-all duration-300",
            scrolled
              ? "bg-[#0b1713]/70 border-white/15 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.5)]"
              : "bg-[#0b1713]/50 border-white/10",
          ].join(" ")}
        >
          {/* Left: Logo */}
          <Link
            href="/"
            aria-label="Home"
            className="absolute -left-8 sm:-left-9 md:-left-10 top-1/2 -translate-y-1/2"
          >
            <Logo />
            <span className="sr-only">The Outdoor Living</span>
          </Link>

          {/* Center: desktop links */}
          <div className="hidden  sm:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-2 md:gap-4">
            <Link
              href="/"
              className={`${linkBase} ${
                isActive("/")
                  ? "text-emerald-300"
                  : "text-emerald-50/85 hover:text-emerald-200"
              }`}
            >
              Home
            </Link>
            <Link
              href="/services"
              className={`${linkBase} ${
                isActive("/services")
                  ? "text-emerald-300"
                  : "text-emerald-50/85 hover:text-emerald-200"
              }`}
            >
              Services
            </Link>
            <Link
              href="/contact"
              className={`${linkBase} ${
                isActive("/contact")
                  ? "text-emerald-300"
                  : "text-emerald-50/85 hover:text-emerald-200"
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Right: CTA (desktop) */}
          <div className="hidden sm:block absolute right-3 top-1/2 -translate-y-1/2">
            <button
              type="button"
              onClick={() => setOpenQuote(true)}
              className="rounded-full border border-emerald-300/40 bg-gradient-to-br from-emerald-400/20 via-teal-300/20 to-cyan-300/20 px-4 py-2 text-emerald-200 shadow-[0_0_0_2px_rgba(255,255,255,0.06)_inset] hover:bg-white/10 hover:text-emerald-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70"
              title="Get a quote"
            >
              Get a Quote
            </button>
          </div>

          {/* Row padding + mobile burger */}
          <div className="flex items-center justify-end pl-24 sm:pl-28 md:pl-32 pr-3 py-3 sm:py-4">
            <button
              onClick={() => setIsOpen((v) => !v)}
              aria-expanded={isOpen}
              aria-label="Toggle menu"
              className="sm:hidden grid place-items-center text-2xl text-emerald-100 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
            >
              {isOpen ? <IoClose /> : <RxHamburgerMenu />}
            </button>
          </div>
        </div>

        {/* Mobile overlay */}
        <div
          className={`sm:hidden fixed inset-0 z-[-1] transition ${
            isOpen
              ? "pointer-events-auto bg-black/50"
              : "pointer-events-none bg-transparent"
          }`}
          onClick={() => setIsOpen(false)}
        />

        {/* Mobile sheet */}
        <div
          className={`sm:hidden mx-auto mt-2 w-[92%] max-w-6xl overflow-hidden rounded-2xl border border-white/10 bg-[#08120f]/95 backdrop-blur-xl transition-[max-height,opacity] duration-300 ${
            isOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col items-stretch p-3">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className={`${linkBase} ${
                isActive("/")
                  ? "text-emerald-300"
                  : "text-emerald-50/90 hover:text-emerald-200"
              }`}
            >
              Home
            </Link>
            <Link
              href="/services"
              onClick={() => setIsOpen(false)}
              className={`${linkBase} ${
                isActive("/services")
                  ? "text-emerald-300"
                  : "text-emerald-50/90 hover:text-emerald-200"
              }`}
            >
              Services
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className={`${linkBase} ${
                isActive("/contact")
                  ? "text-emerald-300"
                  : "text-emerald-50/90 hover:text-emerald-200"
              }`}
            >
              Contact
            </Link>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setOpenQuote(true);
              }}
              className="mt-2 rounded-xl border border-emerald-300/40 bg-gradient-to-r from-emerald-400/20 via-teal-300/20 to-cyan-300/20 px-4 py-2 text-emerald-200 hover:bg-white/10 hover:text-emerald-100"
            >
              Get a Quote
            </button>
          </div>
        </div>
      </nav>

      {/* Modal mount */}
      <GetQuoteModal open={openQuote} onClose={() => setOpenQuote(false)} />
    </>
  );
}
