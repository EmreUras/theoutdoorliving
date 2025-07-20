"use client";

import "../styles/globals.css";
import Logo from "../components/Logo";
import NavBar from "../components/NavBar";
import ScrollToTop from "../components/ScrollToTop.client";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className="
          relative
          min-h-screen
          bg-gradient-to-b from-transparent via-white to-emerald-600
          text-black
        "
        style={{
          backgroundImage: "url('/bg_image.svg')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "top center",
          backgroundSize: "cover",
        }}
      >
        {/* header and hero are visually over the image */}
        <header className="w-full py-4 px-6 flex flex-col items-center sm:flex-row sm:justify-between sm:items-center gap-4 bg-transparent z-10 relative">
          <Logo />
          <NavBar className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-6 mt-4 sm:mt-0" />
        </header>

        {/* everything below hero should fade off or sit cleanly on bg */}
        <main className="relative z-10">{children}</main>

        <ScrollToTop />
      </body>
    </html>
  );
}
