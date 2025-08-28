// src/components/Footer.jsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import { FiClock, FiMail, FiPhone } from "react-icons/fi";
import GetQuoteModal from "./quote/GetQuoteModal";

export default function Footer() {
  const year = new Date().getFullYear();
  const [openQuote, setOpenQuote] = useState(false);

  // S M T W T F S  -> highlight today
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  const todayIndex = useMemo(() => new Date().getDay(), []);

  const onBackToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  return (
    <>
      <footer
        className="relative border-t border-white/10 bg-gradient-to-b from-[#0b1713] via-[#0c1a15] to-[#091310] text-emerald-50/85"
        aria-label="Footer"
      >
        {/* aurora accents */}
        <span className="pointer-events-none absolute -top-12 left-8 h-24 w-24 rounded-full bg-emerald-400/15 blur-2xl" />
        <span className="pointer-events-none absolute -top-8 right-10 h-16 w-40 rounded-full bg-cyan-300/10 blur-2xl" />

        {/* top glow line */}
        <span className="pointer-events-none absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-emerald-300/70 via-teal-300/70 to-cyan-300/70" />

        <div className="mx-auto max-w-7xl px-6 py-14">
          {/* TOP GRID */}
          <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr_1fr]">
            {/* Brand + quick actions */}
            <div className="rounded-2xl border border-white/10 bg-[#0b1713]/60 p-6 backdrop-blur-xl">
              <h2 className="text-[26px] font-anton bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                The Outdoor Living
              </h2>
              <p className="mt-2 text-sm text-emerald-50/75">
                Premium landscaping, hardscaping, and clean-ups across Ontario.
              </p>

              <div className="mt-6 space-y-3">
                <a
                  href="tel:+16479377637"
                  className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 transition hover:bg-white/10"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-400/90 text-black">
                    <FiPhone />
                  </span>
                  <span className="text-emerald-50/90 tracking-wide">
                    647-937-7637
                  </span>
                </a>

                <a
                  href="mailto:andrew.nf.smith@gmail.com"
                  className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 transition hover:bg-white/10"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-cyan-400/90 text-black">
                    <FiMail />
                  </span>
                  <span className="truncate text-emerald-50/90">
                    andrew.nf.smith@gmail.com
                  </span>
                </a>
              </div>
            </div>

            {/* Quick links + social */}
            <nav className="rounded-2xl border border-white/10 bg-[#0b1713]/60 p-6 backdrop-blur-xl">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-emerald-200">
                Quick Links
              </h3>

              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-2">
                <FooterLink href="#what-we-do">What We Do</FooterLink>
                <FooterLink href="#contact">Contact</FooterLink>
                <FooterLink href="#contact">Get a Quote</FooterLink>
                <FooterLink href="#" onClick={onBackToTop}>
                  Back to Top
                </FooterLink>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <Social href="#" label="Facebook">
                  <FaFacebookF />
                </Social>
                <Social href="#" label="Instagram">
                  <FaInstagram />
                </Social>
                <Social href="#" label="Twitter (X)">
                  <FaTwitter />
                </Social>
              </div>
            </nav>

            {/* Hours + CTA */}
            <div className="rounded-2xl border border-emerald-300/20 bg-gradient-to-b from-emerald-400/5 to-cyan-400/5 p-6 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-emerald-400/85 to-cyan-400/85 text-[#0b1713] shadow">
                  <FiClock />
                </div>
                <div>
                  <p className="text-lg font-semibold text-emerald-100">
                    Open 7 Days
                  </p>
                  <p className="text-xs text-emerald-50/75">
                    Book whenever it suits you.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                {days.map((d, i) => (
                  <span
                    key={i}
                    className={[
                      "grid h-8 w-8 place-items-center rounded-full border text-sm",
                      i === todayIndex
                        ? "border-emerald-300/70 bg-emerald-400/20 text-emerald-100 shadow-[0_0_0_3px_rgba(16,185,129,.12)]"
                        : "border-emerald-300/35 bg-emerald-400/10 text-emerald-100/80",
                    ].join(" ")}
                    title="Open"
                  >
                    {d}
                  </span>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setOpenQuote(true)}
                className="mt-6 inline-flex items-center justify-center rounded-xl border border-emerald-300/40 bg-gradient-to-r from-emerald-400/25 via-teal-300/25 to-cyan-300/25 px-4 py-2.5 text-emerald-100 transition hover:bg-white/10 hover:-translate-y-[1px] will-change-transform"
              >
                Book a Free Quote
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="mt-10 h-px bg-white/10" />

          {/* Bottom bar */}
          <div className="py-6 text-center text-xs text-emerald-50/60">
            © {year} The Outdoor Living. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Quote modal mount */}
      <GetQuoteModal open={openQuote} onClose={() => setOpenQuote(false)} />

      {/* Local styles: subtle shine utility */}
      <style jsx global>{`
        .bg-white\\/10:hover .shine {
          opacity: 1;
        }
      `}</style>
    </>
  );
}

function FooterLink({ href, children, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-sm text-emerald-50/90 transition hover:border-emerald-300/40 hover:text-emerald-100 hover:bg-white/10"
    >
      {children}
    </Link>
  );
}

function Social({ href, label, children }) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-emerald-50/85 transition hover:border-emerald-300/40 hover:text-emerald-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50"
    >
      {children}
    </Link>
  );
}
