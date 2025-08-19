// src/components/Footer.jsx
"use client";

import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-gradient-to-b from-[#0b1713] via-[#0c1a15] to-[#091310] text-slate-300">
      <div className="mx-auto max-w-5xl px-4 py-14">
        <div className="flex flex-col items-center text-center gap-5">
          {/* Brand */}
          <h2 className="text-xl font-semibold text-slate-100">
            The Outdoor Living
          </h2>
          <p className="max-w-xl text-sm text-slate-400">
            Crafting dream landscapes across Ontario, one backyard at a time.
          </p>

          {/* Social */}
          <div className="mt-2 flex gap-3">
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

          {/* Nav (vertical) */}
          <nav className="mt-4 flex flex-col items-center gap-2 text-sm">
            <FooterLink href="/">Home</FooterLink>
            <FooterLink href="/services">Services</FooterLink>
            <FooterLink href="/#portfolio">Portfolio</FooterLink>
            <FooterLink href="/contact">Contact</FooterLink>
          </nav>

          {/* Hours */}
          <div className="mt-4 text-sm text-slate-400">
            <p className="font-medium text-slate-200">Hours</p>
            <p className="mt-1">Mon–Sat: 8am–6pm</p>
            <p>Sun: Closed</p>
            <p className="mt-3 text-xs text-slate-500">
              Serving the GTA &amp; surrounding areas.
            </p>
          </div>
        </div>

        <div className="mt-10 h-px bg-white/10" />

        <div className="py-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} The Outdoor Living. All rights reserved.
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
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-slate-300 transition hover:border-emerald-300/40 hover:text-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50"
    >
      {children}
    </Link>
  );
}
