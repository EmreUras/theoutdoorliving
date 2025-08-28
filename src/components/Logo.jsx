// src/components/Logo.jsx
"use client";
import React from "react";
import Image from "next/image";

export default function Logo({ className = "" }) {
  return (
    <Image
      src="/logo.svg"
      alt="Outdoor Living logo"
      width={150} // adjust as needed
      height={150} // adjust as needed
      priority
      draggable={false}
      className={`h-26 sm:h-26 md:h-28 lg:h-34 w-auto select-none  ${className}`}
    />
  );
}
