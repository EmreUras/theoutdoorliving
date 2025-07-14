// src/components/NavBar.js
"use client";
import Link from "next/link";

export default function NavBar({ className = "" }) {
  return (
    <nav className={`fixed inset-x-0 top-5 z-40 px-6 py-4   ${className}`}>
      <div className="mx-auto max-w-5xl flex justify-end items-center space-x-8 text-gray-900">
        <div className="gap-8 bg-gray-800 flex px-10 py-2 text-[0.7rem] font-bevelier text-gray-100 rounded-md">
          <Link href="/" className="hover:text-green-400 transition">
            Home
          </Link>
          <Link href="/services" className="hover:text-green-400 transition">
            Services
          </Link>
          <Link href="/contact" className="hover:text-green-400 transition">
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}
