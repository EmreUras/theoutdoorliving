"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const SERVICES = [
  {
    title: "Property Maintenance & Lawn Cutting/Trimming",
    content:
      "We provide regular, reliable property maintenance to keep your lawn and outdoor areas looking their best. Our lawn cutting and trimming services use professional-grade equipment to ensure an even, manicured finish. We tailor our approach based on the season, grass type, and your personal preferences to maintain healthy, lush green spaces all year round.",
  },
  {
    title: "Litter Pick-Up",
    content:
      "Clean outdoor spaces leave a lasting impression. Our litter pick-up service includes the removal of garbage, natural debris, and unwanted materials from lawns, curbs, and garden beds. Ideal for both residential and commercial properties, this service helps improve curb appeal and maintain cleanliness throughout the year.",
  },
  {
    title: "Fertilization & Weed Control",
    content:
      "Nurture your lawn with our fertilization plans designed to enrich soil health and boost turf growth. We apply industry-standard, eco-friendly fertilizers and perform targeted weed control to prevent invasive plants from taking over your landscape. This dual-action service is essential for maintaining strong, green grass.",
  },
  {
    title: "Pruning / Removal of Trees, Bushes & Shrubs",
    content:
      "Our team provides expert pruning for trees, shrubs, and bushes to improve growth, shape, and safety. If removal is needed due to overgrowth, disease, or redesign, we handle it with care and full debris cleanup. We prioritize plant health and safety while enhancing the visual appeal of your outdoor space.",
  },
  {
    title: "Planting",
    content:
      "We offer seasonal planting services for flowers, shrubs, trees, and greenery. Whether you're looking to brighten your garden beds or start a full landscape redesign, our knowledgeable staff selects and installs plants suited to your soil, sunlight, and vision. We can also assist with plant layout and maintenance tips.",
  },
  {
    title: "Fall / Spring Clean-Up",
    content:
      "Prepare your property for the changing seasons with our thorough clean-up services. We remove fallen leaves, branches, and debris, and prep soil and plants for winter or summer months. These seasonal services are crucial for protecting your lawn and landscape investment from weather damage and nutrient loss.",
  },
  {
    title: "Excavation",
    content:
      "Need groundwork for a new project? We provide small-scale excavation services, including site prep, trenching, grading, and drainage solutions. Our team uses precision equipment to dig safely and efficiently, whether you’re planning a new garden, walkway, or foundation structure.",
  },
  {
    title: "Interlock Installation",
    content:
      "Add structure and style to your landscape with our custom interlocking paver installations. We install driveways, walkways, patios, and garden borders using high-quality materials and proper base prep to prevent shifting and drainage issues. Our designs blend functionality with beauty.",
  },
  {
    title: "Retaining Walls",
    content:
      "Retaining walls provide both form and function — supporting soil structure and elevating landscape design. We build durable retaining walls from concrete, stone, or blocks, and offer repairs for aging or damaged structures. All work is done with attention to engineering and water control.",
  },
  {
    title: "Curbs & Garden Edging",
    content:
      "Define your outdoor space with crisp, clean borders. We install garden edging and concrete curbs to separate lawns from flower beds, driveways, and walkways. Edging reduces grass overgrowth and improves the look and organization of your property.",
  },
  {
    title: "Sod Removal / Installation",
    content:
      "Transform patchy, tired lawns into lush green carpets. We remove old, dead turf and install fresh sod for instant results. Our process includes soil prep, leveling, sod laying, and watering to ensure healthy rooting and quick growth.",
  },
];

export default function ServicesAccordion() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  const ease = [0.25, 0.1, 0.25, 1]; // smooth

  return (
    <section className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-5xl md:text-6xl font-anton text-center mb-16 text-gray-900">
        Our Services
      </h1>

      <div className="space-y-5">
        {SERVICES.map((item, i) => {
          const isOpen = openIndex === i;

          return (
            <div key={i} className="rounded-xl shadow-md overflow-hidden">
              {/* Toggle Button */}
              <motion.button
                onClick={() => toggle(i)}
                initial={false}
                animate={{
                  borderBottomLeftRadius: isOpen ? 0 : 12,
                  borderBottomRightRadius: isOpen ? 0 : 12,
                }}
                transition={{ duration: 0.4, ease }}
                className={`w-full flex items-center justify-between px-5 py-4 
                  text-left font-semibold
                   text-gray-900 bg-gradient-to-r from-green-200 via-blue-100 to-cyan-200 
                   rounded-t-xl ${
                     !isOpen ? "rounded-b-xl" : ""
                   } hover:brightness-105 transition-all duration-300`}
              >
                <span>{item.title}</span>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.4, ease }}
                  className="text-2xl font-bold"
                >
                  {isOpen ? "−" : "+"}
                </motion.span>
              </motion.button>

              {/* Content Panel */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{
                      maxHeight: 0,
                      opacity: 0,
                      paddingTop: 0,
                      paddingBottom: 0,
                    }}
                    animate={{
                      maxHeight: 1000,
                      opacity: 1,
                      paddingTop: 16,
                      paddingBottom: 16,
                    }}
                    exit={{
                      maxHeight: 0,
                      opacity: 0,
                      paddingTop: 0,
                      paddingBottom: 0,
                    }}
                    transition={{ duration: 0.5, ease }}
                    className="overflow-hidden px-5
                     bg-gray-700 text-gray-100 text-base leading-relaxed rounded-b-xl"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.3 }}
                    >
                      {item.content}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
