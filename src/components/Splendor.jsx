"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FiMaximize2 } from "react-icons/fi";

const imagePairs = [
  {
    before: "/portfolio/Splendor-rd/before1.jpg",
    after: "/portfolio/Splendor-rd/after1.jpg",
  },
  {
    before: "/portfolio/Splendor-rd/before2.jpg",
    after: "/portfolio/Splendor-rd/after2.jpg",
  },
];

const soloAfterImages = [
  "/portfolio/Splendor-rd/after3.jpg",
  "/portfolio/Splendor-rd/after4.jpg",
  "/portfolio/Splendor-rd/after5.jpg",
];

export default function Splendor() {
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
        <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-center font-anton">
          Splendor Road Landscape Transformation
        </h3>
        <p className="text-sm sm:text-base leading-relaxed max-w-3xl mx-auto text-center mb-12 font-sans">
          This project featured both complete before-and-after transformations
          and final results. For the first two sets, we carefully cleared and
          revitalized the outdoor space. The remaining images showcase stunning
          finished results designed for long-term visual impact and property
          enhancement.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {imagePairs.map((pair, index) => {
            const isFlipped = flipped[index];

            return (
              <div
                key={index}
                className="group perspective overflow-visible cursor-pointer relative"
                onClick={() => handleCardClick(index)}
              >
                {/* Zoom icon */}
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
                  className={`relative w-full h-64 transition-transform duration-700 transform-style-preserve-3d ${
                    isFlipped ? "rotate-y-180" : "md:group-hover:rotate-y-180"
                  }`}
                >
                  {/* Front - Before */}
                  <div className="absolute inset-0 backface-hidden">
                    <Image
                      src={pair.before}
                      alt={`Before ${index + 1}`}
                      fill
                      className="object-cover rounded-lg shadow-md"
                    />
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                      Before
                    </div>
                  </div>

                  {/* Back - After */}
                  <div className="absolute inset-0 rotate-y-180 backface-hidden">
                    <Image
                      src={pair.after}
                      alt={`After ${index + 1}`}
                      fill
                      className="object-cover rounded-lg shadow-md"
                    />
                    <div className="absolute bottom-2 left-2 bg-green-600 bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      After
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Solo After Images */}
          {soloAfterImages.map((src, index) => (
            <div
              key={`solo-${index}`}
              className="relative w-full h-64 rounded-lg overflow-hidden"
            >
              {/* Zoom icon */}
              <button
                className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-2 z-20 hover:scale-110 transition"
                onClick={() => {
                  setActiveImage(imagePairs.length + index); // offset index
                  setModalOpen(true);
                }}
              >
                <FiMaximize2 className="h-5 w-5 text-black" />
              </button>

              <Image
                src={src}
                alt={`Final Result ${index + 1}`}
                fill
                className="object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-green-700 bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                Final Result
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Lightbox */}
      {modalOpen && activeImage !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <button
            className="absolute top-4 right-4 text-white text-2xl"
            onClick={() => setModalOpen(false)}
          >
            ✕
          </button>

          {activeImage < imagePairs.length ? (
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
          ) : (
            <div className="relative w-full max-w-4xl h-[70vh]">
              <Image
                src={soloAfterImages[activeImage - imagePairs.length]}
                alt="Final Full"
                fill
                className="object-contain rounded-lg"
              />
              <div className="absolute bottom-2 left-2 bg-green-700 bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                Final Result
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
