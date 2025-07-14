// src/components/HeroBackground.jsx
"use client";

import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";

import HeroSection1 from "./HeroSection1";
export default function HeroBackground({ className = "" }) {
  const { RiveComponent } = useRive({
    src: "/hero-scene.riv",
    autoplay: true,
    animations: ["stars"], // ← exactly as shown in Rive
    layout: new Layout({
      fit: Fit.Cover, // cover the container
      alignment: Alignment.Center,
    }),
  });

  return (
    <div className={`w-screen h-screen overflow-hidden ${className}`}>
      <HeroSection1 />
    </div>
  );
}
