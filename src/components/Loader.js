"use client";

import { useEffect } from "react";
import Image from "next/image";

export default function Loader({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 3000); // match your animation duration
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="relative w-full h-screen bg-green-50 overflow-hidden">
      {/* ground under the grass */}
      <div className="absolute bottom-0 left-0 w-full h-8 bg-green-700" />

      {/* moving grass layer */}
      <div className="absolute bottom-0 left-0 w-full h-8 overflow-hidden">
        <div className="h-full bg-green-500 w-[200vw] animate-grass-cut" />
      </div>

      {/* your mower SVG driving across */}
      <div className="absolute bottom-8 left-0 w-12 h-12 animate-mower-move">
        <Image
          src="/mower.svg"
          alt="Mower cutting grass"
          width={48}
          height={48}
          className="object-contain"
        />
      </div>
    </div>
  );
}
