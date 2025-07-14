// src/components/ServicesDemo.jsx
"use client";

import React, { useState, useRef, useEffect } from "react";

// 1) Define your services and descriptions
const SERVICES = [
  {
    id: 1,
    title: "Property Maintenance & Lawn Cutting/Trimming",
    desc: "Regular lawn mowing, precise trimming, and complete property upkeep.",
  },
  {
    id: 2,
    title: "Litter Pick-Up",
    desc: "Removal of all debris, leaves, and general litter.",
  },
  {
    id: 3,
    title: "Fertilization & Weed Control",
    desc: "Targeted fertilization and effective weed management.",
  },
  {
    id: 4,
    title: "Pruning / Removal of Trees, Bushes & Shrubs",
    desc: "Safe pruning or removal of overgrown vegetation.",
  },
  {
    id: 5,
    title: "Planting",
    desc: "Seasonal planting of flowers, shrubs, and greenery.",
  },
  {
    id: 6,
    title: "Fall / Spring Clean-Up",
    desc: "Thorough seasonal cleanup of leaves and debris.",
  },
  {
    id: 7,
    title: "Excavation",
    desc: "Site preparation, grading, and small-scale excavation.",
  },
  {
    id: 8,
    title: "Interlock Installation",
    desc: "Professional interlocking pavers for drives and walkways.",
  },
  {
    id: 9,
    title: "Retaining Walls",
    desc: "Constructing and repairing garden or landscape walls.",
  },
  {
    id: 10,
    title: "Curbs & Garden Edging",
    desc: "Clean edging for beds, walkways, and driveways.",
  },
  {
    id: 11,
    title: "Sod Removal / Installation",
    desc: "Old turf removal and fresh sod installation.",
  },
];

export default function ServicesDemo() {
  // 2) Plain JS useState + refs
  const [openId, setOpenId] = useState(null);
  const containerRef = useRef(null);
  const [popoverStyle, setPopoverStyle] = useState({});

  // 3) When openId changes, recalc popover position
  useEffect(() => {
    if (openId !== null && containerRef.current) {
      const el = containerRef.current.querySelector(`#card-${openId}`);
      if (el) {
        const rect = el.getBoundingClientRect();
        setPopoverStyle({
          position: "absolute",
          top: rect.bottom + window.scrollY + 8,
          left: rect.left + window.scrollX,
          width: rect.width,
          zIndex: 50,
        });
      }
    }
  }, [openId]);

  return (
    <section
      ref={containerRef}
      className="flex flex-col md:flex-row items-start p-6 md:p-12 gap-8 font-anton relative"
    >
      {/* LEFT: fixed image */}
      <img
        src="/what_we_do.png"
        alt="What We Do"
        className="hidden md:block object-contain max-w-xs"
      />

      {/* RIGHT: the list */}
      <div className="flex-1">
        <h2 className="text-5xl md:text-5xl lg:text-8xl  mb-8 text-center md:text-left heading-font">
          What We Do
        </h2>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((svc) => (
            <li
              key={svc.id}
              id={`card-${svc.id}`}
              onClick={() => setOpenId(openId === svc.id ? null : svc.id)}
              className={`
                relative flex items-center space-x-3
                cursor-pointer rounded-xl
                bg-white py-4 px-6
                transition-transform duration-300 ease-out
                hover:scale-105
                ${openId === svc.id ? "ring-2 ring-green-500" : ""}
              `}
            >
              <span className="text-green-600 text-2xl">✔️</span>
              <span className="text-lg md:text-xl">{svc.title}</span>
            </li>
          ))}
        </ul>

        {/* POPOVER */}
        {openId !== null && (
          <div style={popoverStyle}>
            <div className="bg-white p-4 rounded-lg shadow-lg text-gray-800 text-base">
              {SERVICES.find((s) => s.id === openId)?.desc}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
