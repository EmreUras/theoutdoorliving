"use client";

import { motion } from "framer-motion";
import React from "react";

const SERVICES = [
  {
    id: 1,
    title: "Property Maintenance & Lawn Cutting/Trimming",
    desc: "Keep your lawn neat, healthy, and perfectly trimmed.",
  },
  {
    id: 2,
    title: "Litter Pick-Up",
    desc: "Removal of debris, litter, and general waste.",
  },
  {
    id: 3,
    title: "Fertilization & Weed Control",
    desc: "Boost plant health and eliminate unwanted weeds.",
  },
  {
    id: 4,
    title: "Pruning / Removal of Trees, Bushes & Shrubs",
    desc: "Safely remove or trim overgrown greenery.",
  },
  {
    id: 5,
    title: "Planting",
    desc: "Seasonal planting of flowers, shrubs, and trees.",
  },
  {
    id: 6,
    title: "Fall / Spring Clean-Up",
    desc: "Clean and prep your yard for new seasons.",
  },
  {
    id: 7,
    title: "Excavation",
    desc: "Site prep, grading, trenching & more.",
  },
  {
    id: 8,
    title: "Interlock Installation",
    desc: "Pavers for paths, patios, and driveways.",
  },
  {
    id: 9,
    title: "Retaining Walls",
    desc: "Durable walls to shape and support your yard.",
  },
  {
    id: 10,
    title: "Curbs & Garden Edging",
    desc: "Sharp, clean lines for tidy landscaping.",
  },
  {
    id: 11,
    title: "Sod Removal / Installation",
    desc: "Out with the old, in with the lush green sod.",
  },
];

export default function ServicesDemo() {
  return (
    <section className="w-full px-6 md:px-16 py-24 relative z-10">
      <h2 className="text-5xl md:text-7xl font-anton text-center mb-16 text-gray-800 drop-shadow-lg">
        What We Do
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {SERVICES.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: index * 0.05,
              ease: "easeOut",
            }}
            viewport={{ once: true }}
            className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl 
            p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 
            cursor-pointer group"
          >
            <h3 className="text-lg font-semibold text-black flex items-start gap-2">
              <span>✅</span> <span>{service.title}</span>
            </h3>
            <p className="text-sm text-black/80 mt-2 group-hover:text-white transition-colors">
              {service.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
