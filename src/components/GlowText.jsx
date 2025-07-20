// src/components/GlowText.jsx
"use client";

import React from "react";
import { motion } from "framer-motion";

export default function GlowText({ children }) {
  const lines = React.Children.toArray(children);

  const charVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        type: "spring",
        stiffness: 500,
        damping: 30,
      },
    }),
    hover: {
      scale: 1.05,
      textShadow: "0 0 8px rgba(255,255,255,0.8)",
      transition: { yoyo: Infinity, duration: 1 },
    },
  };

  return (
    <div className="inline-block text-center">
      {lines.map((line, lineIndex) => {
        const text = typeof line === "string" ? line : "";
        return (
          <div key={lineIndex} className="block leading-[0.9]">
            {text.split("").map((char, charIndex) => {
              const key = `${lineIndex}-${charIndex}`;
              const custom = lineIndex * text.length + charIndex;

              // If it's a space, render a non-breaking space with width
              if (char === " ") {
                return (
                  <motion.span
                    key={key}
                    style={{ display: "inline-block", width: "0.25em" }}
                    variants={charVariants}
                    initial="hidden"
                    animate="visible"
                    custom={custom}
                  >
                    {"\u00A0"}
                  </motion.span>
                );
              }

              // Otherwise render the real character
              return (
                <motion.span
                  key={key}
                  className="inline-block"
                  variants={charVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  custom={custom}
                >
                  {char}
                </motion.span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
