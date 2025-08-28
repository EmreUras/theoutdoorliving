// src/components/HeroSection.jsx
"use client";

import React from "react";

import GlowText from "./GlowText";

export default function HeroSection() {
  return (
    <section className="px-6 py-12 md:py-24 lg:py-0">
      {/* Headline */}
      <h1
        className="
          text-[1.6rem] sm:text-[3.7rem] md:text-[3rem] lg:text-[4.6rem]
         font-earwig
          text-center mb-10
          text-gray-50
        "
      >
        <GlowText>
          Our Lawns Are the Only Thing
          <br />
          Greener Than Your Budget
        </GlowText>
      </h1>
    </section>
  );
}
