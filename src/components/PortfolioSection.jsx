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
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-sans text-amber-50 mb-12 text-center">
          Before Meets After
        </h2>
        <div className="space-y-20">
          {portfolioItems.map((item) => (
            <div key={item.id}>
              <BeforeAfterVideo {...item.videoProps} />
              <Fenton />
              {showMore && (
                <>
                  <GardenBedRestoration />
                  <Milton />
                  <Markham />
                  <Splendor />
                </>
              )}
              <div className="text-center mt-6">
                <button
                  onClick={() => setShowMore(!showMore)}
                  className="px-6 py-2 pb-5 text-sm sm:text-base font-anton text-black rounded-full cursor-pointer hover:text-amber-300 transition-all duration-300"
                >
                  {showMore ? "Hide Projects ▲" : "See More Projects ▼"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
