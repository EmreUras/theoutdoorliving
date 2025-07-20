"use client";

import React, { useState, useRef, useEffect } from "react";

export default function BeforeAfterVideo({
  src = "/before-after-video.mp4",
  switchTime = 27,
  playbackRate = 1.5,
}) {
  const videoRef = useRef(null);
  const [label, setLabel] = useState("Before");

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.playbackRate = playbackRate;
    const onTimeUpdate = () => {
      setLabel(vid.currentTime >= switchTime ? "After" : "Before");
    };
    vid.addEventListener("timeupdate", onTimeUpdate);
    return () => vid.removeEventListener("timeupdate", onTimeUpdate);
  }, [playbackRate, switchTime]);

  return (
    <div
      className="w-full flex flex-col md:flex-row items-center md:items-center 
      justify-center gap-28 max-w-5xl mx-auto"
    >
      {/* Video */}
      <div className="relative w-full md:w-1/2 max-w-[275px]">
        <video
          ref={videoRef}
          src={src}
          controls
          className="w-full h-auto rounded-lg shadow-md"
        />
        <span className="absolute top-2 left-2 bg-black bg-opacity-60 text-white px-3 py-1 text-sm font-semibold rounded">
          {label}
        </span>
      </div>

      {/* Text */}
      <div
        className="w-full md:w-1/2 max-w-xl px-2 text-gray-800 
      text-sm sm:text-base leading-relaxed text-center md:text-left font-mono"
      >
        <h3 className="text-xl font-semibold mb-3 font-anton">
          Lawn Transformation: From Neglected to Polished
        </h3>
        <p>
          This project showcases a complete yard overhaul where we revitalized
          an overgrown and uneven lawn into a clean, vibrant, and well-manicured
          space. Our team trimmed and leveled the grass, shaped the edges with
          precision, and eliminated clutter to reveal the yard’s full potential.
        </p>
        <p className="mt-4">
          The result is a healthier, neater, and more inviting outdoor area —
          the kind of space that adds value to the property and peace of mind to
          the homeowner. Every cut, every detail, was handled with care to
          deliver a professional finish that lasts.
        </p>
      </div>
    </div>
  );
}
