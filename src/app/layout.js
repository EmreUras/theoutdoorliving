// src/app/layout.js
"use client";

import "../styles/globals.css";
import Logo from "../components/Logo";
import NavBar from "../components/NavBar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="relative bg-fixed bg-gradient-to-b from-white to-green-100 min-h-screen">
        {/* 1) Fixed header */}
        <header
          className="
            fixed inset-x-0 top-0 z-10
            bg-white/80 backdrop-blur
            flex flex-col items-center
            sm:flex-row sm:justify-between sm:items-center
            p-4
          "
        >
          {/* Logo always first */}
          <div>
            <Logo />
          </div>

          {/* Nav under logo on mobile, inline on sm+ */}
          <NavBar
            className="
              ml-30
              sm:mt-0
              flex flex-col space-y-2
              sm:flex-row sm:space-y-0 sm:space-x-6
            "
          />
        </header>

        {/* 2) Main content — no extra top padding, HeroSection will sit under header */}
        <main>{children}</main>
      </body>
    </html>
  );
}
