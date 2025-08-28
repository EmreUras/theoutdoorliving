// src/components/NavBar.js
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import GetQuoteModal from "./quote/GetQuoteModal";

export default function NavBar({ className = "" }) {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [openQuote, setOpenQuote] = useState(false);

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
              : "bg-[#0b1713]/0 border-white/0",
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

          {/* Right: CTA only */}
          <div className="flex items-center gap-3 absolute right-3 top-1/2 -translate-y-1/2">
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

          {/* Row padding (keeps nav height consistent) */}
          <div className="py-3 sm:py-4 pl-24 sm:pl-28 md:pl-32 pr-3" />
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
