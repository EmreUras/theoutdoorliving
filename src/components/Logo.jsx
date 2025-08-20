// src/components/Logo.jsx
"use client";
import React from "react";

export default function Logo({ className = "" }) {
  return (
    <img
      src="/logo1.png"
      alt="Outdoor Living logo"
      draggable="false"
      className={`h-26 sm:h-26 md:h-28 lg:h-34 w-auto select-none drop-shadow-[0_8px_28px_rgba(16,185,129,0.32)] ${className}`}
    />
  );
}
