// src/components/NavBar.js
"use client";
import Link from "next/link";

export default function NavBar({ className = "" }) {
  return (
    <nav className={`w-full px-6 py-4 ${className}`}>
      <div
        className="
        mx-auto max-w-5xl
        flex flex-col items-center space-y-4
        sm:flex-row sm:space-y-0 sm:space-x-8 sm:justify-end
      "
      >
        <Link href="/" className="px-4 py-2 hover:text-green-400 transition">
          Home
        </Link>
        <Link
          href="/services"
          className="px-4 py-2 hover:text-green-400 transition"
        >
          Services
        </Link>
        <Link
          href="/contact"
          className="px-4 py-2 hover:text-green-400 transition"
        >
          Contact
        </Link>
      </div>
    </nav>
  );
}
