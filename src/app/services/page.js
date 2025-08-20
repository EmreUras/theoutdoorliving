"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiChevronDown,
  FiScissors,
  FiTrash2,
  FiDroplet,
  FiCrop,
  FiFeather,
  FiRefreshCw,
  FiTool,
  FiGrid,
  FiLayers,
  FiMinus,
  FiCheckSquare,
} from "react-icons/fi";

/* ---------- DATA (unchanged) ---------- */
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

/* Nice visual icons to pair with each row */
const ICONS = [
  FiScissors,
  FiTrash2,
  FiDroplet,
  FiCrop,
  FiFeather,
  FiRefreshCw,
  FiTool,
  FiGrid,
  FiLayers,
  FiMinus,
  FiCheckSquare,
];

export default function ServicesAccordion() {
  const [openIndex, setOpenIndex] = useState(null);
  const toggle = (i) => setOpenIndex((prev) => (prev === i ? null : i));

  const ease = [0.22, 0.03, 0.26, 1];

  return (
    <section className="relative mx-auto max-w-6xl px-6 py-24 overflow-hidden isolate">
      {/* ambient glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-70">
        <div className="absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute -bottom-24 right-10 h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl" />
      </div>

      {/* Heading */}
      <div className="mb-14 text-center">
        <p className="text-xs tracking-[0.25em] text-emerald-300/80">
          WHAT WE DO
        </p>
        <h1 className="mt-2 bg-gradient-to-br from-emerald-200 via-teal-200 to-cyan-300 bg-clip-text text-4xl font-anton text-transparent md:text-6xl">
          Our Services
        </h1>
        <div className="mx-auto mt-4 h-px w-28 bg-gradient-to-r from-transparent via-emerald-300/50 to-transparent" />
        <p className="mx-auto mt-5 max-w-2xl text-sm text-emerald-50/70">
          Full-stack care for lawns and landscapes — crafted with precision,
          delivered with pride.
        </p>
      </div>

      {/* List */}
      <div className="space-y-4">
        {SERVICES.map((item, i) => {
          const isOpen = openIndex === i;
          const Icon = ICONS[i % ICONS.length];

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, ease }}
              className="relative"
            >
              {/* gradient frame */}
              <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-emerald-400/25 via-teal-400/25 to-cyan-400/25 opacity-70 blur-sm" />

              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b1713]/70 backdrop-blur-xl">
                {/* header */}
                <button
                  onClick={() => toggle(i)}
                  onKeyDown={(e) =>
                    (e.key === "Enter" || e.key === " ") && toggle(i)
                  }
                  aria-expanded={isOpen}
                  aria-controls={`svc-panel-${i}`}
                  className="group flex w-full items-center gap-4 px-5 py-4 text-left"
                >
                  {/* icon */}
                  <span className="relative grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/5 transition-all duration-300 group-hover:border-emerald-300/40 group-hover:bg-white/10">
                    <Icon className="h-5 w-5 text-emerald-300" />
                    <span className="pointer-events-none absolute inset-0 rounded-xl bg-emerald-400/10 blur-md opacity-0 transition group-hover:opacity-100" />
                  </span>

                  <span className="flex-1 text-[15.5px] font-semibold text-emerald-50">
                    {item.title}
                  </span>

                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.35, ease }}
                    className="rounded-md border border-white/10 p-2 text-emerald-200"
                    aria-hidden
                  >
                    <FiChevronDown className="h-5 w-5" />
                  </motion.span>
                </button>

                {/* content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`svc-panel-${i}`}
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-2">
                        <motion.p
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.08, duration: 0.35 }}
                          className="rounded-xl border border-white/5 bg-white/[0.03] p-4 leading-relaxed text-emerald-50/90"
                        >
                          {item.content}
                        </motion.p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
