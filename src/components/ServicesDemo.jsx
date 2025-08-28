// src/components/ServicesShowcase.jsx
"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  FiMaximize2,
  FiX,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

/* =========================== CONTENT =========================== */
const SERVICES = [
  {
    id: "cwr",
    title: "Construction Waste Removal",
    blurb:
      "Selective demo or full tear-downs—done safely. We use dust control, protect anything you want to keep, and remove all debris. For contractors & DIY: stack leftovers and we’ll pick them up—often cheaper than renting a bin.",
    type: "beforeAfter",
    imgs: {
      before: "/what_we_do/construction_waste_removal/before.jpg",
      after: "/what_we_do/construction_waste_removal/after.jpg",
    },
  },
  {
    id: "deck",
    title: "Deck Removal",
    blurb:
      "Clean dismantle and removal. Want to keep certain boards or hardware? Say the word—we’ll save them neatly.",
    type: "gallery",
    imgs: ["/what_we_do/deck_removal/1.jpg", "/what_we_do/deck_removal/2.jpg"],
  },
  {
    id: "sod",
    title: "Grass Removal & New Sod",
    blurb:
      "Out with the tired turf—new soil, fertilizer, and sod installed the right way. Includes a simple 2-week watering plan and a 1-year warranty: if it dies under normal care, we replace it.",
    type: "gallery",
    imgs: [
      "/what_we_do/grass_install/1.jpg",
      "/what_we_do/grass_install/2.jpg",
      "/what_we_do/grass_install/3.jpg",
    ],
  },
  {
    id: "sideyard",
    title: "Side-Yard Makeovers",
    blurb:
      "Turn narrow side paths into welcoming walkways with colourful stone and a clean stepping-stone rhythm to the backyard.",
    type: "hero",
    imgs: ["/what_we_do/house_view/1.jpg"],
  },
  {
    id: "household",
    title: "Single Items & Household Goods",
    blurb:
      "One bulky item or a few small goods—we’ll remove them. Reusable items are donated to the local Salvation Army so nothing goes to waste.",
    type: "masonry",
    imgs: [
      "/what_we_do/household_items/1.jpg",
      "/what_we_do/household_items/2.jpg",
      "/what_we_do/household_items/3.jpg",
      "/what_we_do/household_items/4.jpg",
      "/what_we_do/household_items/5.jpg",
    ],
  },
  {
    id: "overgrown",
    title: "Overgrown Area Reclaim",
    blurb:
      "Brush, weeds, seedlings, high grass, stumps, and ground debris—cleared and prepped for new sod or beds. Example: a full rebalance along Erin Mills Parkway.",
    type: "gallery",
    imgs: [
      "/what_we_do/overgrown_area/weed1.jpg",
      "/what_we_do/overgrown_area/weed2.jpg",
      "/what_we_do/overgrown_area/clean-up.jpg",
    ],
  },
  {
    id: "stone",
    title: "Simple Stone Work",
    blurb:
      "Budget-friendly patio-stone walkways with better base prep and cleaner layouts—so they look sharp and last.",
    type: "spotlight",
    imgs: ["/what_we_do/simple_stone_work/stone.jpg"],
  },
  {
    id: "trees",
    title: "Tree Removal",
    blurb:
      "Any size, any season. Safe takedown, clean site. Example shown: winter removal in Mississauga.",
    type: "grid",
    imgs: [
      "/what_we_do/tree_removal/1.jpg",
      "/what_we_do/tree_removal/2.jpg",
      "/what_we_do/tree_removal/3.jpg",
      "/what_we_do/tree_removal/4.jpg",
    ],
  },
];

/* ========================== LIGHTBOX =========================== */
function useKey(fn) {
  useEffect(() => {
    const h = (e) => fn(e);
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [fn]);
}

function Lightbox({ open, images, index, onClose, setIndex }) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useKey((e) => {
    if (!open) return;
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowLeft") setIndex((i) => Math.max(0, i - 1));
    if (e.key === "ArrowRight")
      setIndex((i) => Math.min(images.length - 1, i + 1));
  });

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="lb"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className="absolute left-1/2 top-1/2 z-[95] w-[92vw] max-w-6xl -translate-x-1/2 -translate-y-1/2"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative h-[78vh] w-full overflow-hidden rounded-2xl border border-white/15 bg-[#0b1713]">
            <Image
              src={images[index]}
              alt="Preview"
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute right-3 top-3 rounded-full border border-white/20 bg-black/40 p-2 text-white/90 backdrop-blur hover:bg-black/60"
              aria-label="Close"
            >
              <FiX className="text-xl" />
            </button>
            {/* Nav */}
            {index > 0 && (
              <button
                onClick={() => setIndex((i) => Math.max(0, i - 1))}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 p-3 text-white/90 backdrop-blur hover:bg-black/60"
                aria-label="Previous image"
              >
                <FiChevronLeft className="text-2xl" />
              </button>
            )}
            {index < images.length - 1 && (
              <button
                onClick={() =>
                  setIndex((i) => Math.min(images.length - 1, i + 1))
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 p-3 text-white/90 backdrop-blur hover:bg-black/60"
                aria-label="Next image"
              >
                <FiChevronRight className="text-2xl" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ======================== IMAGE TILE (ZOOM) ======================== */
function ImageTile({
  src,
  alt,
  onOpen,
  h = "h-[300px] md:h-[340px] lg:h-[380px]",
}) {
  return (
    <div
      className={`group relative w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0d1a16] ${h}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain"
        sizes="100vw"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(240px 120px at 50% -10%, rgba(255,255,255,.10), transparent 60%)",
        }}
      />
      <button
        onClick={onOpen}
        className="absolute right-3 top-3 rounded-xl border border-white/25 bg-black/40 p-2 text-white/90 backdrop-blur transition hover:bg-black/60"
        aria-label="View larger"
      >
        <FiMaximize2 className="text-lg" />
      </button>
    </div>
  );
}

/* ======================== BEFORE/AFTER (zoom) ======================== */
function BeforeAfter({ beforeSrc, afterSrc, onOpen }) {
  const ref = useRef(null);
  const [x, setX] = useState(55);
  const down = useRef(false);

  const setFrom = (clientX) => {
    const rect = ref.current.getBoundingClientRect();
    setX(
      Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100))
    );
  };

  return (
    <div
      ref={ref}
      className="relative h-[320px] md:h-[360px] lg:h-[400px] w-full overflow-hidden rounded-2xl border border-white/12 bg-[#0d1a16]"
      onMouseDown={(e) => {
        down.current = true;
        setFrom(e.clientX);
      }}
      onMouseMove={(e) => down.current && setFrom(e.clientX)}
      onMouseUp={() => (down.current = false)}
      onMouseLeave={() => (down.current = false)}
      onTouchStart={(e) => setFrom(e.touches[0].clientX)}
      onTouchMove={(e) => setFrom(e.touches[0].clientX)}
    >
      {/* After base */}
      <Image
        src={afterSrc}
        alt="After"
        fill
        className="object-contain"
        sizes="100vw"
        priority
      />
      {/* Before clipped */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${x}%` }}
      >
        <Image
          src={beforeSrc}
          alt="Before"
          fill
          className="object-contain"
          sizes="100vw"
          priority
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
      </div>
      {/* Handle */}
      <div
        className="absolute top-0 h-full w-[2px] bg-white/70"
        style={{ left: `calc(${x}% - 1px)` }}
      />
      <div
        className="absolute top-1/2 -translate-y-1/2"
        style={{ left: `calc(${x}% - 20px)` }}
      >
        <div className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/80 backdrop-blur">
          Drag
        </div>
      </div>
      {/* Labels */}
      <span className="absolute left-3 top-3 rounded bg-black/60 px-2 py-1 text-xs text-emerald-200">
        Before
      </span>
      <span className="absolute right-3 top-3 rounded bg-black/60 px-2 py-1 text-xs text-emerald-200">
        After
      </span>
      {/* Zoom */}
      <button
        onClick={onOpen}
        className="absolute right-3 bottom-3 rounded-xl border border-white/25 bg-black/40 p-2 text-white/90 backdrop-blur transition hover:bg-black/60"
        aria-label="View larger"
      >
        <FiMaximize2 className="text-lg" />
      </button>
    </div>
  );
}

/* ========================== TYPOGRAPHY PIECES ========================== */
const Title = ({ children }) => (
  <h3 className="text-[22px] sm:text-2xl md:text-3xl font-extrabold tracking-tight">
    <span className="bg-gradient-to-br from-emerald-200 via-teal-200 to-cyan-200 bg-clip-text text-transparent">
      {children}
    </span>
  </h3>
);
const Body = ({ children }) => (
  <p className="text-[15px] md:text-base leading-relaxed text-emerald-50/90">
    {children}
  </p>
);

/* =============================== MAIN =============================== */
export default function ServicesShowcase() {
  const [active, setActive] = useState(SERVICES[0].id);
  const current = useMemo(
    () => SERVICES.find((s) => s.id === active),
    [active]
  );

  // Lightbox state
  const [lbOpen, setLbOpen] = useState(false);
  const [lbImages, setLbImages] = useState([]);
  const [lbIndex, setLbIndex] = useState(0);

  const openLightbox = (images, index = 0) => {
    setLbImages(images);
    setLbIndex(index);
    setLbOpen(true);
  };

  return (
    <section id="what-we-do" className="relative w-full py-18 md:py-24">
      {/* Heading */}
      <div className="px-6 md:px-10 text-center">
        <h2 className="text-5xl md:text-7xl font-black tracking-tight">
          <span className="bg-gradient-to-br from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_2px_18px_rgba(16,185,129,.25)]">
            What We Do
          </span>
        </h2>
        <p className="mt-3 text-emerald-50/80">
          Browse our services—tap to zoom any photo.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-7xl grid-cols-1 gap-6 px-6 md:grid-cols-[320px_1fr] md:px-10">
        {/* Tabs */}
        <div className="md:sticky md:top-24">
          <div className="no-scrollbar flex gap-2 overflow-x-auto md:block">
            {SERVICES.map((s) => {
              const selected = s.id === active;
              return (
                <button
                  key={s.id}
                  onClick={() => setActive(s.id)}
                  className={[
                    "shrink-0 rounded-2xl border px-4 py-3 text-left transition md:w-full",
                    selected
                      ? "border-emerald-400/60 bg-emerald-400/10 text-emerald-100 shadow-[0_8px_30px_-12px_rgba(16,185,129,.6)]"
                      : "border-white/10 bg-[#0b1713]/70 text-emerald-50/85 hover:border-emerald-400/40 hover:text-emerald-100",
                  ].join(" ")}
                >
                  <div className="text-base font-semibold">{s.title}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Panel */}
        <div className="min-h-[420px] rounded-3xl border border-white/10 bg-[#0b1713]/70 p-5 md:p-7 backdrop-blur-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <Title>{current.title}</Title>
                <Body>{current.blurb}</Body>
              </div>

              {/* Layouts */}
              {current.type === "beforeAfter" && (
                <BeforeAfter
                  beforeSrc={current.imgs.before}
                  afterSrc={current.imgs.after}
                  onOpen={() =>
                    openLightbox([current.imgs.before, current.imgs.after], 0)
                  }
                />
              )}

              {current.type === "gallery" && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {current.imgs.map((src, i) => (
                    <ImageTile
                      key={src}
                      src={src}
                      alt={`${current.title} ${i + 1}`}
                      onOpen={() => openLightbox(current.imgs, i)}
                    />
                  ))}
                </div>
              )}

              {current.type === "hero" && (
                <ImageTile
                  src={current.imgs[0]}
                  alt={current.title}
                  onOpen={() => openLightbox(current.imgs, 0)}
                  h="h-[340px] md:h-[420px] lg:h-[460px]"
                />
              )}

              {current.type === "masonry" && (
                <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [column-fill:_balance]">
                  {current.imgs.map((src, i) => (
                    <div key={src} className="mb-4 break-inside-avoid">
                      <ImageTile
                        src={src}
                        alt={`${current.title} ${i + 1}`}
                        onOpen={() => openLightbox(current.imgs, i)}
                        h="h-[260px] md:h-[300px]"
                      />
                    </div>
                  ))}
                </div>
              )}

              {current.type === "spotlight" && (
                <div className="grid grid-cols-1 items-center gap-5 md:grid-cols-[1.2fr_1fr]">
                  <ImageTile
                    src={current.imgs[0]}
                    alt={current.title}
                    onOpen={() => openLightbox(current.imgs, 0)}
                    h="h-[320px] md:h-[380px]"
                  />
                  <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-emerald-50/90">
                    <span className="text-sm uppercase tracking-wide text-emerald-200">
                      Featured
                    </span>
                    <p className="mt-1">
                      Clean lines, solid base prep, and better layout patterns
                      keep simple stone work looking premium.
                    </p>
                  </div>
                </div>
              )}

              {current.type === "grid" && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {current.imgs.map((src, i) => (
                    <ImageTile
                      key={src}
                      src={src}
                      alt={`${current.title} ${i + 1}`}
                      onOpen={() => openLightbox(current.imgs, i)}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Utilities */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Lightbox mount */}
      <Lightbox
        open={lbOpen}
        images={lbImages}
        index={lbIndex}
        onClose={() => setLbOpen(false)}
        setIndex={setLbIndex}
      />
    </section>
  );
}
