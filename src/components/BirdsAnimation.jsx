// src/components/BirdsAnimation.jsx
"use client";

import React from "react";
import { useRive, Layout, Fit, Alignment } from "rive-react";

export default function BirdsAnimation() {
  const { RiveComponent } = useRive({
    src: "/birds2.riv",
    autoplay: true,
    // If your birds file is a looping background animation, you can use Cover:
    layout: new Layout({
      fit: Fit.Cover,
      align: Alignment.TopCenter,
    }),
  });

  return (
    <div
      className="
        pointer-events-none 
        absolute inset-0 
        z-10
      "
    >
      <RiveComponent style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
