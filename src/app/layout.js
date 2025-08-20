// src/app/layout.jsx (or layout.js)
"use client";

import "../styles/globals.css";
import Logo from "../components/Logo";
import NavBar from "../components/NavBar";
import ScrollToTop from "../components/ScrollToTop.client";
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className="
          relative min-h-screen overflow-x-hidden
          text-emerald-50 antialiased selection:bg-emerald-400/30 selection:text-white
        "
      >
        {/* ==== Global Background (Da Vinci mode) ==== */}
        <div className="absolute inset-0 -z-50 bg-[linear-gradient(180deg,#07140f_0%,#0a1114_45%,#0b0f12_100%)]" />
        <div className="absolute inset-0 -z-40 opacity-70 bg-[radial-gradient(60%_60%_at_20%_10%,rgba(16,185,129,.35),transparent_60%),radial-gradient(60%_60%_at_85%_20%,rgba(59,130,246,.30),transparent_60%),radial-gradient(70%_70%_at_50%_100%,rgba(34,197,94,.25),transparent_70%)]" />
        <div
          className="absolute inset-0 -z-30 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 -z-20 bg-gradient-to-t from-[#0b0f12] to-transparent" />

        {/* ====== Site Content ====== */}
        <div className="relative z-10">
          <header className="w-full py-4 px-6 flex flex-col items-center sm:flex-row sm:justify-between sm:items-center gap-4 bg-transparent">
            <NavBar
              className="flex flex-col space-y-2 sm:flex-row 
            sm:space-y-0 sm:space-x-6 mt-4 sm:mt-0 lg:mt-5 text-emerald-50"
            />
          </header>

          <main className="relative">{children}</main>

          <ScrollToTop />
        </div>

        {/* Toasts */}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#0b1713",
              color: "#e6fffb",
              border: "1px solid rgba(255,255,255,.08)",
            },
            success: {
              iconTheme: { primary: "#34d399", secondary: "#0b1713" },
            },
            error: { iconTheme: { primary: "#ef4444", secondary: "#0b1713" } },
          }}
        />
      </body>
    </html>
  );
}
