"use client";

import React from "react";
import { useRive, Layout, Fit, Alignment } from "rive-react";

const ANIMS = [
  { key: "long", src: "/long_mower_latest.riv" },
  { key: "trim", src: "/trimmerlatest.riv" },
  { key: "hand", src: "/handmower.riv" },
];

export default function AnimationGroup({ className = "" }) {
  // initialize all three animations
  const components = ANIMS.map(({ key, src }) => {
    const { RiveComponent } = useRive({
      src,
      autoplay: true,
      layout: new Layout({ fit: Fit.Contain, align: Alignment.Center }),
    });
    return { key, Comp: RiveComponent };
  });

  return (
    <div
      className={[
        "w-full flex flex-col md:flex-row items-center justify-center gap-6 lg:gap-12",
        className,
      ].join(" ")}
    >
      {components.map(({ key, Comp }) => (
        <div
          key={key}
          className="
            w-4/5 h-[25vh] 
            sm:w-3/5 sm:h-[30vh] 
            md:w-1/3 md:h-[40vh] 
            lg:w-1/4 lg:h-[50vh]
          "
        >
          <Comp className="w-full h-full" />
        </div>
      ))}
    </div>
  );
}
