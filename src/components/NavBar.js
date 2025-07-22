// src/components/NavBar.js
"use client";
import Link from "next/link";
import { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoClose } from "react-icons/io5";

export default function NavBar({ className = "" }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className={`w-full px-6 py-4 relative z-[50] ${className}`}>
      {/* Mobile Nav Top Section */}
      <div className="sm:hidden flex justify-between items-center">
        {/* Logo */}
        <Link href="/"></Link>

        {/* Toggle Button - on the right */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-3xl text-white"
        >
          {isOpen ? <IoClose /> : <RxHamburgerMenu />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div
          className="sm:hidden w-full bg-black/60 font-medium
         text-white flex flex-col items-center py-4 gap-4 mt-2 rounded-md"
        >
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="hover:text-green-400 transition"
          >
            Home
          </Link>
          <Link
            href="/services"
            onClick={() => setIsOpen(false)}
            className="hover:text-green-400 transition"
          >
            Services
          </Link>
          <Link
            href="/contact"
            onClick={() => setIsOpen(false)}
            className="hover:text-green-400 transition"
          >
            Contact
          </Link>
        </div>
      )}

      {/* Desktop Nav */}
      <div className="hidden sm:flex mx-auto max-w-5xl items-center space-x-8 justify-end">
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
