"use client";

import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-800 opacity-90 text-gray-300 pt-14 pb-6 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-10 md:gap-0 text-center md:text-left">
        {/* Logo + Description */}
        <div className="flex flex-col items-center md:items-start">
          <h1 className="text-2xl font-bold text-white">The Outdoor Living</h1>
          <p className="text-sm mt-2 max-w-xs text-gray-400">
            Crafting dream landscapes across Ontario, one backyard at a time.
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex gap-8 text-sm font-medium">
          <Link href="/" className="hover:text-white transition duration-200">
            Home
          </Link>
          <Link
            href="/services"
            className="hover:text-white transition duration-200"
          >
            Services
          </Link>
          <Link
            href="/#portfolio"
            className="hover:text-white transition duration-200"
          >
            Portfolio
          </Link>
          <Link
            href="/contact"
            className="hover:text-white transition duration-200"
          >
            Contact
          </Link>
        </nav>

        {/* Social Icons */}
        <div className="flex gap-6 text-xl">
          <Link
            href="#"
            className="hover:text-white hover:scale-110 transition duration-200"
          >
            <FaFacebookF />
          </Link>
          <Link
            href="#"
            className="hover:text-white hover:scale-110 transition duration-200"
          >
            <FaInstagram />
          </Link>
          <Link
            href="#"
            className="hover:text-white hover:scale-110 transition duration-200"
          >
            <FaTwitter />
          </Link>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 my-6 w-full" />

      {/* Bottom Text */}
      <div className="text-center text-xs text-gray-500">
        © {new Date().getFullYear()} The Outdoor Living. All rights reserved.
      </div>
    </footer>
  );
}
