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
  const [progress, setProgress] = useState(0);
  const [openQuote, setOpenQuote] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      setScrolled(y > 8);
      const h =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      setProgress(h > 0 ? Math.min(1, y / h) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
  }, [isOpen]);

  const isActive = (href) => pathname === href;

  const SegLink = ({ href, children }) => (
    <Link
      href={href}
      aria-current={isActive(href) ? "page" : undefined}
      className={[
        "relative rounded-xl px-4 py-2 transition-all",
        "text-emerald-50/85 hover:text-emerald-100",
        "before:absolute before:inset-0 before:rounded-xl before:border before:border-white/10 before:opacity-80",
        isActive(href)
          ? "bg-[radial-gradient(120%_120%_at_50%_-10%,rgba(16,185,129,.35),rgba(0,0,0,0))] text-emerald-100 shadow-[0_10px_30px_-12px_rgba(16,185,129,.55)]"
          : "hover:bg-white/6",
      ].join(" ")}
    >
      {children}
      {isActive(href) && (
        <>
          <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 -bottom-1 h-[3px] w-10 rounded-full bg-emerald-300/90 blur-[1px]" />
          <span className="pointer-events-none absolute -top-[1px] left-3 h-[2px] w-3 bg-emerald-300/70 rounded-full" />
          <span className="pointer-events-none absolute -top-[1px] right-3 h-[2px] w-3 bg-emerald-300/70 rounded-full" />
        </>
      )}
    </Link>
  );

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[60] ${className}`}
        role="navigation"
        aria-label="Primary"
      >
        <div
          className={[
            "relative mx-auto mt-3 w-[92%] max-w-7xl rounded-2xl border backdrop-blur-xl transition-all duration-300",
            "p-1 lg:p-3",
            scrolled
              ? "bg-[#0b1713]/80 border-white/15 shadow-[0_12px_28px_-14px_rgba(0,0,0,.55)]"
              : "bg-[#0b1713]/55 border-white/10",
          ].join(" ")}
        >
          {/* aurora accents */}
          <span className="pointer-events-none absolute -top-6 left-12 h-24 w-24 rounded-full bg-emerald-400/15 blur-2xl" />
          <span className="pointer-events-none absolute -top-4 right-10 h-16 w-40 rounded-full bg-cyan-300/10 blur-2xl" />

          {/* bottom progress line */}
          <span
            className="pointer-events-none absolute bottom-0 left-0 h-[2px] rounded-r-full bg-gradient-to-r from-emerald-300/80 to-cyan-300/80"
            style={{ width: `${Math.max(6, progress * 100)}%` }}
          />

          {/* Logo (left) */}
          <Link
            href="/"
            aria-label="Home"
            className="absolute -left-8 sm:-left-9 md:-left-10 top-1/2 -translate-y-1/2"
          >
            <Logo />
            <span className="sr-only">The Outdoor Living</span>
          </Link>

          {/* Center segmented links */}
          <div className="hidden sm:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center">
            <div className="flex items-center gap-2 rounded-2xl p-1 ">
              <SegLink href="/">Home</SegLink>
              <SegLink href="/services">Services</SegLink>
              <SegLink href="/contact">Contact</SegLink>
            </div>
          </div>

          {/* Right: CTA only */}
          <div className="hidden sm:flex items-center gap-3 absolute right-3 top-1/2 -translate-y-1/2">
            <button
              type="button"
              onClick={() => setOpenQuote(true)}
              className="relative rounded-full border border-emerald-300/40 bg-gradient-to-br from-emerald-400/20 via-teal-300/20 to-cyan-300/20 px-4 py-2 text-emerald-100 shadow-[inset_0_0_0_2px_rgba(255,255,255,0.06)] hover:bg-white/12 hover:text-emerald-50 transition will-change-transform hover:-translate-y-[1px]"
              title="Get a quote"
            >
              <span className="relative z-10">Get a Quote</span>
              <span className="pointer-events-none absolute inset-0 rounded-full bg-[linear-gradient(110deg,transparent,rgba(255,255,255,.25),transparent)] animate-shine" />
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
            isOpen ? "max-h-[36rem] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col items-stretch p-3 gap-3">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className={`rounded-xl px-4 py-2 ${
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
              className={`rounded-xl px-4 py-2 ${
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
              className={`rounded-xl px-4 py-2 ${
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
              className="mt-1 rounded-xl border border-emerald-300/40 bg-gradient-to-r from-emerald-400/20 via-teal-300/20 to-cyan-300/20 px-4 py-2 text-emerald-200 hover:bg-white/10 hover:text-emerald-100"
            >
              Get a Quote
            </button>
          </div>
        </div>
      </nav>

      {/* Modal mount */}
      <GetQuoteModal open={openQuote} onClose={() => setOpenQuote(false)} />

      {/* local styles for shimmer */}
      <style jsx global>{`
        .animate-shine {
          background-size: 200% 100%;
          animation: shine-move 2.5s linear infinite;
          opacity: 0.35;
        }
        @keyframes shine-move {
          0% {
            background-position: -150% 0;
          }
          100% {
            background-position: 150% 0;
          }
        }
        .bg-white\\/6 {
          background-color: rgba(255, 255, 255, 0.06);
        }
        .border-white\\/12 {
          border-color: rgba(255, 255, 255, 0.12);
        }
      `}</style>
    </>
  );
}
