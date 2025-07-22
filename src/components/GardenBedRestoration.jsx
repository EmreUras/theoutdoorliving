// src/components/GardenBedRestoration.jsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FiMaximize2 } from "react-icons/fi";

const imagePairs = [
  {
    before: "/portfolio/garden_bed_restoration/before1.jpg",
    after: "/portfolio/garden_bed_restoration/after1.jpg",
  },
  {
    before: "/portfolio/garden_bed_restoration/before2.jpg",
    after: "/portfolio/garden_bed_restoration/after2.jpg",
  },
];

export default function GardenBedRestoration() {
  const [flipped, setFlipped] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(null);

  const handleCardClick = (index) => {
    if (window.innerWidth < 768) {
      setFlipped((prev) => ({ ...prev, [index]: !prev[index] }));
    }
  };

  return (
    <section className="pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto text-gray-800 ">
        <h3 className="text-3xl sm:text-4xl font-anton mb-6 text-center">
          Garden Bed Restoration
        </h3>
        <p
          className="font-sans 
        text-sm sm:text-base leading-relaxed max-w-3xl mx-auto text-center mb-12"
        >
          Our garden bed restoration service involves a complete transformation
          of your existing flower beds. This includes the removal of overgrown
          or unhealthy shrubs, outdated mulch, and compacted soil. We refresh
          the area with rich new soil, premium mulch, and vibrant plant
          selections tailored to the space and sunlight exposure. The final
          result brings structure, beauty, and renewed health to the landscape,
          restoring curb appeal and providing long-term vitality.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {imagePairs.map((pair, index) => {
            const isFlipped = flipped[index];

            return (
              <div
                key={index}
                className="group perspective overflow-visible cursor-pointer relative"
                onClick={() => handleCardClick(index)}
              >
                <button
                  className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-2 z-20 hover:scale-110 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImage(index);
                    setModalOpen(true);
                  }}
                >
                  <FiMaximize2 className="h-5 w-5 text-black" />
                </button>

                <div
                  className={`
                    relative w-full h-94  transition-transform duration-700
                    transform-style-preserve-3d
                    ${
                      isFlipped ? "rotate-y-180" : "md:group-hover:rotate-y-180"
                    }
                  `}
                >
                  <div className="absolute inset-0  backface-hidden">
                    <Image
                      src={pair.before}
                      alt={`Before ${index + 1}`}
                      fill
                      className="object-cover object-center rounded-lg shadow-lg"
                    />
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                      Before
                    </div>
                  </div>

                  <div className="absolute inset-0 rotate-y-180 backface-hidden">
                    <Image
                      src={pair.after}
                      alt={`After ${index + 1}`}
                      fill
                      className="object-cover  rounded-lg shadow-lg"
                    />
                    <div className="absolute bottom-2 left-2 bg-green-600 bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      After
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {modalOpen && activeImage !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <button
            className="absolute top-4 right-4 text-white text-2xl"
            onClick={() => setModalOpen(false)}
          >
            ✕
          </button>

          <div className="flex flex-col sm:flex-row gap-4 w-[95vw] sm:w-[90vw] max-w-6xl max-h-[90vh] p-4">
            <div className="relative flex-1 aspect-[4/3]">
              <Image
                src={imagePairs[activeImage].before}
                alt="Before Full"
                fill
                className="object-contain rounded-lg"
              />
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                Before
              </div>
            </div>
            <div className="relative flex-1 aspect-[4/3]">
              <Image
                src={imagePairs[activeImage].after}
                alt="After Full"
                fill
                className="object-contain rounded-lg"
              />
              <div className="absolute bottom-2 left-2 bg-green-600 bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                After
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
