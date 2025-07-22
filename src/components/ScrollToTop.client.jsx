"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react"; // or any other icon lib

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 200);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-gradient-to-tr
       from-amber-700 to-gray-700 text-white shadow-xl hover:scale-110 transition-transform duration-300"
    >
      <ArrowUp size={24} />
    </button>
  );
}
