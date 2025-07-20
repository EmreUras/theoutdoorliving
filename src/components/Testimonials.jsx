// src/components/Testimonials.jsx
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    text: "Their landscaping work helped us raise the property value significantly. Highly recommended.",
    author: "Carlos M.",
  },
  {
    text: "They transformed my messy lawn into something I’m proud to show off. Amazing work!",
    author: "Aisha K.",
  },
  {
    text: "I needed a quick cleanup before an open house. They delivered beyond expectations. Big thanks!",
    author: "Mike D.",
  },
  {
    text: "Professional, friendly, and efficient. My backyard looks completely new.",
    author: "Sandra L.",
  },
  {
    text: "Great communication, reliable team, and beautiful results. Couldn’t ask for more.",
    author: "Raj P.",
  },
  {
    text: "The team was punctual and detail-oriented. Loved the attention to every little plant!",
    author: "Lena G.",
  },
  {
    text: "The transformation was like night and day. My neighbors even asked for your contact info.",
    author: "Derrick S.",
  },
  {
    text: "Fantastic experience from start to finish. Easy to work with and very professional.",
    author: "Marie V.",
  },
  {
    text: "Really appreciated their fast turnaround and great quality. Will hire again.",
    author: "Jason T.",
  },
  {
    text: "They listened to what we wanted and totally delivered. Amazing outdoor vibe now!",
    author: "Tina R.",
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 3000); // slower auto-advance
    return () => clearInterval(interval);
  }, []);

  const getStyle = (index) => {
    const position =
      (index - currentIndex + testimonials.length) % testimonials.length;
    const center = Math.floor(testimonials.length / 2);
    const distance = Math.min(
      Math.abs(position - center),
      Math.abs(position + testimonials.length - center),
      Math.abs(position - testimonials.length - center)
    );
    const scale = 1 - distance * 0.1;
    const opacity = 1 - distance * 0.25;
    const translateX = (position - center) * 140;

    return {
      transform: `translateX(${translateX}%) scale(${scale})`,
      opacity,
      zIndex: 10 - distance,
    };
  };

  return (
    <section className="py-20  text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-center text-3xl sm:text-4xl md:text-5xl font-bold mb-16 font-anton text-white">
          What Our Clients Say
        </h2>
        <div className="relative w-full flex justify-center items-center">
          <div className="relative h-64 w-full flex items-center justify-center font-mono">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="absolute w-60 md:w-72 h-auto p-4 bg-white text-black rounded-xl shadow-md transition-all duration-700 ease-in-out text-center font-mono"
                style={getStyle(index)}
              >
                <p className="text-sm md:text-base mb-4">
                  “{testimonial.text}”
                </p>
                <p className="text-xs md:text-sm font-bold text-cyan-700">
                  {testimonial.author}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
