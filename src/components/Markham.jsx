// src/components/Markham.jsx
import React from "react";

export default function Markham() {
  return (
    <section className="w-full flex flex-col md:flex-row items-center justify-center gap-20 max-w-5xl mx-auto px-4 py-20">
      {/* Text on the left */}
      <div className="w-full md:w-1/2 text-gray-800 text-sm sm:text-base leading-relaxed text-center md:text-left font-mono">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center font-anton">
          Markham Property Cleanup
        </h2>
        <p>
          This Markham property underwent a thorough landscape refresh focused
          on clearing overgrown plants, trimming unruly shrubs, and redefining
          the bed edges. The result is a clean, polished aesthetic that enhances
          curb appeal and sets the stage for future planting or design work. The
          improved visibility and neat presentation uplift the overall
          atmosphere of the space.
        </p>
      </div>

      {/* Video on the right */}
      <div className="relative w-full md:w-1/2 max-w-[275px]">
        <video
          src="/portfolio/markham.mp4"
          controls
          className="w-full h-auto rounded-lg shadow-md"
        />
      </div>
    </section>
  );
}
