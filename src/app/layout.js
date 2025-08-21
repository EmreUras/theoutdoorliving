// src/app/layout.jsx
import "../styles/globals.css";
import NavBar from "../components/NavBar";
import ScrollToTop from "../components/ScrollToTop.client";
import { Toaster } from "react-hot-toast";
import Script from "next/script";

const SITE_URL = "https://theoutdoorliving.ca";
const SITE_NAME = "Outdoor Living | Lawn Care & Landscaping";
const SITE_DESC =
  "Premium lawn care and landscaping in the GTA. Mowing, edging, trimming, seasonal cleanups, and more — fast quotes, insured crews, friendly service.";
const OG_IMAGE = "/og.jpg"; // put a 1200x630 image in /public
const THEME_COLOR = "#0b1713";
const BUSINESS_PHONE = "+1-647-937-7637"; // update when ready
const BUSINESS_CITY = "Greater Toronto Area";

// src/app/layout.js
export const metadata = {
  title: "Outdoor Living | Landscaping & Design in Toronto",
  description:
    "Transform your outdoor space with Outdoor Living. We provide professional landscaping, garden design, and outdoor renovations in Toronto and the GTA.",
  keywords: [
    "landscaping Toronto",
    "outdoor living",
    "garden design",
    "landscape contractor GTA",
  ],
  openGraph: {
    title: "Outdoor Living | Landscaping & Design in Toronto",
    description:
      "Professional landscaping and outdoor design services in Toronto. Create your dream outdoor space today.",
    url: "https://theoutdoorliving.ca",
    siteName: "Outdoor Living",
    images: [
      {
        url: "https://theoutdoorliving.ca/preview.png", // update with your banner/hero
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Outdoor Living | Landscaping & Design in Toronto",
    description:
      "Toronto-based landscaping and outdoor design services. Let’s bring your vision to life.",
    images: ["https://theoutdoorliving.ca/preview.png"], // update
  },
};

export default function RootLayout({ children }) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Outdoor Living",
    url: SITE_URL,
    description: SITE_DESC,
    areaServed: BUSINESS_CITY,
    telephone: BUSINESS_PHONE,
    image: `${SITE_URL}${OG_IMAGE}`,
    sameAs: [], // add socials later
  };

  return (
    <html lang="en">
      <body
        className="
          relative min-h-screen overflow-x-hidden
          text-emerald-50 antialiased selection:bg-emerald-400/30 selection:text-white
        "
      >
        {/* ==== Global Background (unchanged) ==== */}
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

        {/* ====== Site Content (unchanged) ====== */}
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

        {/* Toasts (unchanged) */}
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

        {/* JSON-LD */}
        {/* LocalBusiness JSON-LD */}
        <Script
          id="org-jsonld"
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Outdoor Living",
            url: "https://theoutdoorliving.ca/",
            description:
              "Premium lawn care and landscaping across the GTA. Mowing, edging, trimming, seasonal cleanups, and more — fast quotes, insured crews, friendly service.",
            areaServed: "Greater Toronto Area",
            image: "https://theoutdoorliving.ca/logo1.png",
            logo: "https://theoutdoorliving.ca/logo1.png",
            email: "mailto:andrew.nf.smith@gmail.com",
            telephone: "+1-647-937-7637",
            address: {
              "@type": "PostalAddress",
              streetAddress: "5755 Tenth Line W",
              addressLocality: "Mississauga",
              addressRegion: "ON",
              postalCode: "L5M 0P7",
              addressCountry: "CA",
            },
            contactPoint: [
              {
                "@type": "ContactPoint",
                contactType: "customer service",
                telephone: "+1-647-937-7637",
                email: "andrew.nf.smith@gmail.com",
                areaServed: "CA",
                availableLanguage: ["en"],
              },
            ],
            sameAs: [],
          })}
        </Script>

        {/* WebSite JSON-LD (helps brand + sitelinks) */}
        <Script
          id="website-jsonld"
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Outdoor Living",
            url: "https://theoutdoorliving.ca/",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://theoutdoorliving.ca/search?q={query}",
              "query-input": "required name=query",
            },
          })}
        </Script>
      </body>
    </html>
  );
}
