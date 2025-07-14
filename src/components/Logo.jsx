// src/components/Logo.jsx
"use client";
import React from "react";

export default function Logo() {
  return (
    <img
      src="/logo1.png"
      alt="OutdoorLiving logo"
      className="
        absolute top-4 left-4 z-50
        h-20       /* 2.5rem on mobile */
        sm:h-14    /* 3.5rem on small (≥640px) */
        md:h-20    /* 5rem on medium (≥768px) */
        lg:h-24    /* 6rem on large (≥1024px) */
        w-auto
      "
    />
  );
}
