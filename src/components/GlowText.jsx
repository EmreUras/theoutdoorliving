"use client";

import React from "react";
import { motion } from "framer-motion";

export default function GlowText({ children }) {
  const lines = React.Children.toArray(children);

  const wordVariants = {
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
      transition: { repeat: Infinity, duration: 1 },
    },
  };

  return (
    <div className="w-full flex flex-col items-center justify-center text-center px-4">
      {lines.map((line, lineIndex) => {
        const text = typeof line === "string" ? line : "";
        const words = text.split(" ");

        return (
          <div
            key={lineIndex}
            className="flex justify-center flex-wrap w-full"
            style={{
              lineHeight: "1.2",
            }}
          >
            {words.map((word, wordIndex) => {
              const custom = lineIndex * words.length + wordIndex;

              return (
                <motion.span
                  key={`${lineIndex}-${wordIndex}`}
                  className="inline-block mx-1 whitespace-nowrap
                    text-[2rem] sm:text-[2rem] md:text-[4rem] lg:text-[5rem] xl:text-[5.5rem]"
                  variants={wordVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  custom={custom}
                >
                  {word}
                </motion.span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
