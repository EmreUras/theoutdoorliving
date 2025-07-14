// src/components/HeroSection.jsx
"use client";

import React from "react";
import { useRive, Layout, Fit, Alignment } from "rive-react";

export default function HeroSection() {
  const { RiveComponent: LongMower } = useRive({
    src: "/long_mower_latest.riv",
    autoplay: true,
    layout: new Layout({ fit: Fit.Contain, align: Alignment.Center }),
  });
  const { RiveComponent: Trimmer } = useRive({
    src: "/trimmerlatest.riv",
    autoplay: true,
    layout: new Layout({ fit: Fit.Contain, align: Alignment.Center }),
  });
  const { RiveComponent: HandMower } = useRive({
    src: "/handmower.riv",
    autoplay: true,
    layout: new Layout({ fit: Fit.Contain, align: Alignment.Center }),
  });

  return (
    <section
      className="
        relative w-full
        h-screen                /* always full‑height */
        md:h-screen             /* same on md+ */
        overflow-x-hidden       /* clip horizontal overflow */
        overflow-y-visible      /* allow vertical overflow */
      "
    >
      {/* Headline */}
      <h1
        className="
          absolute inset-x-0
          top-26 sm:top-20 md:top-24 lg:top-28
          text-[4rem] sm:text-[5rem] md:text-[6rem] lg:text-[7rem]
          font-anton font-extrabold text-gray-700
          text-center -z-10
        "
      >
        Elevate Your Yard
        <br />
        to a Masterpiece
      </h1>

      {/* Animations */}
      <div
        className="
          absolute inset-x-0
          top-[75%] sm:top-[50%] md:top-[40%] lg:top-[50%]
          flex flex-col md:flex-row
          items-center justify-center
          gap-4 sm:gap-6 md:gap-8 lg:gap-12
          z-0
        "
      >
        {[LongMower, Trimmer, HandMower].map((Comp, i) => (
          <div
            key={i}
            className="
              w-4/5 h-[25vh]           /* mobile: narrow & short */
              sm:w-3/5 sm:h-[30vh]     /* sm: a bit bigger */
              md:w-1/3 md:h-[40vh]     /* md+: desktop sizes */
              lg:w-1/4 lg:h-[50vh]     /* lg+: largest */
            "
          >
            <Comp className="w-full h-full" />
          </div>
        ))}
      </div>
    </section>
  );
}
