// src/components/ServicesDemo.jsx  (or ServicesShowcase.jsx)
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaLeaf } from "react-icons/fa";

const SERVICES = [
  {
    id: 1,
    title: "Property Maintenance & Lawn Cutting/Trimming",
    desc: "Consistent mowing, edging, and cleanup that keeps your lawn crisp week after week. We manage clippings, trim borders, and shape edges so your yard looks freshly detailed—not just cut.",
  },
  {
    id: 2,
    title: "Litter Pick-Up",
    desc: "Routine grounds policing for a spotless property. We collect and remove litter, wind-blown debris, and small dumping so your site stays welcoming and professional every single day.",
  },
  {
    id: 3,
    title: "Fertilization & Weed Control",
    desc: "Balanced nutrients and targeted treatments that grow thicker turf while pushing out broadleaf weeds. Fewer bare spots, deeper color, and healthier roots throughout the season.",
  },
  {
    id: 4,
    title: "Pruning / Removal of Trees, Bushes & Shrubs",
    desc: "Safety-focused removals and smart pruning to improve plant health and sightlines. We thin, shape, and clear deadwood so your greenery thrives and your property feels open and clean.",
  },
  {
    id: 5,
    title: "Planting",
    desc: "Seasonal flowers, shrubs, and trees installed with proper soil prep and spacing. We pick hardy, low-maintenance varieties that match your light conditions and design style.",
  },
  {
    id: 6,
    title: "Fall / Spring Clean-Up",
    desc: "Leaf removal, bed cleaning, and first-cut/last-cut services to reset the property at the start and end of each season. Ready for snow… and ready for summer.",
  },
  {
    id: 7,
    title: "Excavation",
    desc: "Precise dig work for grading, trenching, and base prep. We create stable subgrades, improve drainage, and set the stage for patios, pathways, and structures.",
  },
  {
    id: 8,
    title: "Interlock Installation",
    desc: "Durable, level, and perfectly aligned pavers for driveways, patios, and walkways. Proper base depth and compaction means your surface stays flat and beautiful for years.",
  },
  {
    id: 9,
    title: "Retaining Walls",
    desc: "Engineered walls that hold grade, tame slopes, and frame garden beds. Quality block and drainage ensure long-term stability with a clean, modern look.",
  },
  {
    id: 10,
    title: "Curbs & Garden Edging",
    desc: "Crisp concrete or stone borders that keep mulch in place and grass out of beds. Cleaner lines, easier mowing, and a sharper overall presentation.",
  },
  {
    id: 11,
    title: "Sod Removal / Installation",
    desc: "Out with the tired turf, in with lush new sod. Fresh soil prep, rolling, and watering guidance deliver an instant lawn that roots fast and stays vibrant.",
  },
];

// filenames in /public/services (from your screenshots)
const FILE_BY_ID = {
  1: "Property Maintenance & Lawn CuttingTrimming.jpg",
  2: "Litter Pick-Up.jpg",
  3: "Fertilization & Weed Control.jpg",
  4: "Pruning  Removal of Trees, Bushes & Shrubs.jpg",
  5: "Planting.jpg",
  6: "Fall  Spring Clean-Up.jpg",
  7: "Excavation.jpg",
  8: "Interlock Installation.jpg",
  9: "Retaining Walls.jpg",
  10: "Curbs & Garden Edging.jpg",
  11: "Sod Removal  Installation.jpg",
};

export default function ServicesDemo() {
  // desktop vs mobile (hover vs tap)
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  const [activeId, setActiveId] = useState(null);
  const onCardClick = (id) => {
    if (isDesktop) return; // desktop = hover only
    setActiveId((cur) => (cur === id ? null : id)); // tap toggle on mobile
  };

  return (
    <section className="relative w-full py-24 md:py-28">
      {/* Heading */}
      <div className="px-6 md:px-16">
        <h2 className="text-center font-anton text-5xl md:text-7xl tracking-tight">
          <span className="bg-gradient-to-br from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_2px_20px_rgba(16,185,129,.25)]">
            What We Do
          </span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-emerald-50/80">
          Premium landscaping & hardscaping, crafted with precision.
        </p>
      </div>

      {/* Grid */}
      <div className="mt-14 grid grid-cols-1 gap-6 px-6 sm:grid-cols-2 lg:grid-cols-3 md:px-16 items-stretch">
        {SERVICES.map((s, i) => {
          const isActive = !isDesktop && activeId === s.id;
          const file = FILE_BY_ID[s.id];

          return (
            <motion.article
              key={s.id}
              initial={{ opacity: 0, y: 32, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: "easeOut" }}
              className="group relative h-full"
            >
              {/* SOLID BORDER CARD */}
              <div
                onClick={() => onCardClick(s.id)}
                className={[
                  "relative flex h-full flex-col rounded-2xl",
                  "border border-white/12 bg-[#0b1713]/70 backdrop-blur-xl",
                  "transition-all duration-300",
                  isActive
                    ? "-translate-y-[2px] shadow-[0_10px_40px_rgba(16,185,129,.25)] border-emerald-300/30"
                    : "md:group-hover:-translate-y-[2px] md:group-hover:shadow-[0_10px_40px_rgba(16,185,129,.25)] md:group-hover:border-emerald-300/30",
                ].join(" ")}
              >
                {/* IMAGE — rounded ONLY on top, no padding, fits area */}
                <div className="relative w-full h-[230px] md:h-[260px] lg:h-[300px] overflow-hidden rounded-t-2xl">
                  {file && (
                    <Image
                      src={`/services/${file}`}
                      alt={s.title}
                      fill
                      sizes="(min-width:1280px) 33vw, (min-width:768px) 50vw, 100vw"
                      className="object-cover" // fills area edge-to-edge
                      priority={i < 3}
                    />
                  )}
                </div>

                {/* TEXT PANEL — fills to the bottom */}
                <div className="flex-1 rounded-b-2xl bg-gradient-to-b from-black/35 to-[#0d1b16]/65 p-6 md:p-7">
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 text-black shadow-lg shadow-emerald-500/20">
                    <FaLeaf className="h-5 w-5" />
                  </div>
                  <h3 className="text-[18px] font-semibold leading-snug text-white/85">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-white/65">
                    {s.desc}
                  </p>
                </div>

                {/* shine overlay (desktop hover / mobile tap) */}
                <div
                  className={[
                    "pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300",
                    isActive
                      ? "opacity-100"
                      : "opacity-0 md:group-hover:opacity-100",
                  ].join(" ")}
                  style={{
                    background:
                      "radial-gradient(140px 70px at 50% -10%, rgba(255,255,255,.14), transparent 60%)",
                  }}
                />
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
