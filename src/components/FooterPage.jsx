// src/components/Footer.jsx
"use client";

import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-gradient-to-b from-[#0b1713] via-[#0c1a15] to-[#091310] text-slate-300">
      <div className="mx-auto max-w-6xl px-6 py-14">
        {/* Top row: Brand • Nav • Hours/Social */}
        <div className="grid gap-8 md:grid-cols-3 md:items-center">
          {/* Brand + tagline */}
          <div className="text-center md:text-left space-y-2">
            <h2 className="text-2xl md:text-[26px] font-anton bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
              The Outdoor Living
            </h2>
            <p className="text-sm text-slate-400">
              Crafting dream landscapes across Ontario, one backyard at a time.
            </p>
          </div>

          {/* Horizontal nav */}
          <nav
            aria-label="Footer navigation"
            className="flex justify-center md:justify-center"
          >
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
              <li>
                <FooterLink href="/">Home</FooterLink>
              </li>
              <li>
                <FooterLink href="/services">Services</FooterLink>
              </li>
              <li>
                <FooterLink href="/#portfolio">Portfolio</FooterLink>
              </li>
              <li>
                <FooterLink href="/contact">Contact</FooterLink>
              </li>
            </ul>
          </nav>

          {/* Hours + Social */}
          <div className="space-y-3 text-center md:text-right">
            <div className="flex items-center justify-center md:justify-end gap-3">
              <Social href="#" label="Facebook">
                <FaFacebookF />
              </Social>
              <Social href="#" label="Instagram">
                <FaInstagram />
              </Social>
              <Social href="#" label="Twitter">
                <FaTwitter />
              </Social>
            </div>
            <div className="text-sm text-slate-400">
              <p className="font-medium text-slate-200">Hours</p>
              <p className="mt-0.5">Mon–Sat: 8am–6pm</p>
              <p>Sun: Closed</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-10 h-px bg-white/10" />

        {/* Bottom bar */}
        <div className="py-6 text-center text-xs text-slate-500">
          © {year} The Outdoor Living. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }) {
  return (
    <Link
      href={href}
      className="rounded-md px-2 py-1 text-slate-300 hover:text-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50"
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
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-slate-300 transition hover:border-emerald-300/40 hover:text-emerald-300 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50"
    >
      {children}
    </Link>
  );
}
