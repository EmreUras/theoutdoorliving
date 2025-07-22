import Image from "next/image";
import React, { useState } from "react";
import { FiMaximize2 } from "react-icons/fi";

export default function Milton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <section className="py-30 px-4">
      <div className="max-w-6xl mx-auto text-center text-gray-800">
        <h2 className="text-3xl sm:text-4xl font-anton mb-6 text-center">
          Milton Property Maintenance
        </h2>
        <p
          className=" font-sans 
        text-sm sm:text-base leading-relaxed max-w-3xl mx-auto text-center mb-12"
        >
          Our team is responsible for maintaining all garden beds and green
          areas at the Milton property. This ongoing maintenance contract
          includes seasonal care, mulching, trimming, weeding, and overall
          landscape health — ensuring the entire property stays pristine,
          vibrant, and professionally groomed year-round.
        </p>

        <div
          className="relative w-full max-w-4xl mx-auto h-[400px] sm:h-[500px] 
        rounded-xl overflow-hidden shadow-2xl group"
        >
          <Image
            src="/portfolio/Milton/Maintenance.jpg"
            alt="Milton Maintenance"
            width={1920}
            height={1080}
            className="w-full h-full object-cover object-center"
          />
          <button
            className="absolute top-4 right-4 bg-white p-2 rounded-full text-black text-xl hover:scale-110 transition"
            onClick={handleImageClick}
          >
            <FiMaximize2 />
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
          <div className="relative max-w-5xl w-full p-4">
            <button
              className="absolute top-4 right-4 text-white text-3xl"
              onClick={closeModal}
            >
              &times;
            </button>
            <img
              src="/portfolio/Milton/Maintenance.jpg"
              alt="Milton Full"
              className="w-full h-auto max-h-[80vh] mx-auto object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}
