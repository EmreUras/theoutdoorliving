"use client";

import React, { useState } from "react";
import BeforeAfterVideo from "./BeforeAfterVideo";
import Fenton from "./Fenton";
import GardenBedRestoration from "./GardenBedRestoration";
import Milton from "./Milton";
import Markham from "./Markham";
import Splendor from "./Splendor";

const portfolioItems = [
  {
    id: 1,
    type: "beforeAfterVideo",
    videoProps: {
      src: "/before-after-video.mp4",
      switchTime: 27,
      playbackRate: 1.5,
    },
  },
  // Add more jobs here later
];

export default function PortfolioSection() {
  const [showMore, setShowMore] = useState(false);

  return (
    <section id="portfolio" className="py-2">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-5xl md:text-7xl font-anton text-center mb-16 text-gray-800 drop-shadow-lg">
          Before Meets After
        </h2>

        <div className="space-y-1">
          {portfolioItems.map((item) => (
            <div key={item.id}>
              <BeforeAfterVideo {...item.videoProps} />

              {/* Separator */}
              <div className="mt-16 mb-16 h-[2px] w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />

              <Fenton />

              {/* Toggle button appears here */}
              <div className="text-center mt-6">
                <button
                  onClick={() => setShowMore(!showMore)}
                  className="px-6 py-2 pb-0 text-sm sm:text-base font-anton
                  text-black rounded-full cursor-pointer
                  hover:text-amber-300 transition-all duration-300"
                >
                  {showMore ? "Hide Projects ▲" : "See More Projects ▼"}
                </button>
              </div>
            </div>
          ))}

          {/* Conditionally render more projects */}
          {showMore && (
            <>
              <div className="my-12 h-[2px] w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
              <GardenBedRestoration />

              <div className="my-12 h-[2px] w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
              <Milton />

              <div className="my-12 h-[2px] w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
              <Markham />

              <div className="my-12 h-[2px] w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
              <Splendor />
            </>
          )}
        </div>
      </div>
    </section>
  );
}
