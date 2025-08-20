"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export default function BeforeAfterVideo({
  beforeSrc,
  afterSrc,
  switchTime = 27,
  playbackRate = 1.0,
  className = "",
  title,
  description,
}) {
  const beforeRef = useRef(null);
  const afterRef = useRef(null);

  const [active, setActive] = useState("before"); // "before" | "after"
  const [playing, setPlaying] = useState(false);
  const [durA, setDurA] = useState(0);
  const [durB, setDurB] = useState(0);
  const [t, setT] = useState(0); // unified time

  const total = useMemo(() => durA + durB, [durA, durB]);
  const label = t >= switchTime ? "After" : "Before";

  // wire up durations & playback rate
  useEffect(() => {
    const a = beforeRef.current,
      b = afterRef.current;
    if (!a || !b) return;

    const metaA = () => setDurA(a.duration || 0);
    const metaB = () => setDurB(b.duration || 0);
    a.addEventListener("loadedmetadata", metaA);
    b.addEventListener("loadedmetadata", metaB);
    a.playbackRate = playbackRate;
    b.playbackRate = playbackRate;

    return () => {
      a.removeEventListener("loadedmetadata", metaA);
      b.removeEventListener("loadedmetadata", metaB);
    };
  }, [playbackRate]);

  // sync timeupdate → unified timeline
  useEffect(() => {
    const a = beforeRef.current,
      b = afterRef.current;
    if (!a || !b) return;

    const onA = () => setT(Math.min(a.currentTime, durA) + 0);
    const onB = () => setT(durA + Math.min(b.currentTime, durB));

    a.addEventListener("timeupdate", onA);
    b.addEventListener("timeupdate", onB);
    const onEndA = () => {
      setActive("after");
      if (playing) b.play();
    };
    a.addEventListener("ended", onEndA);

    return () => {
      a.removeEventListener("timeupdate", onA);
      b.removeEventListener("timeupdate", onB);
      a.removeEventListener("ended", onEndA);
    };
  }, [durA, durB, playing]);

  // ensure only one element is visible/playing
  useEffect(() => {
    const a = beforeRef.current,
      b = afterRef.current;
    if (!a || !b) return;
    if (active === "before") {
      b.pause();
      b.currentTime = Math.max(0, t - durA);
      if (playing) a.play();
    } else {
      a.pause();
      if (t < durA) setT(durA); // guard
      if (playing) b.play();
    }
  }, [active]); // eslint-disable-line

  const togglePlay = () => {
    const a = beforeRef.current,
      b = afterRef.current;
    if (!a || !b) return;
    if (playing) {
      a.pause();
      b.pause();
      setPlaying(false);
    } else {
      (active === "before" ? a : b).play();
      setPlaying(true);
    }
  };

  const onSeek = (val) => {
    const a = beforeRef.current,
      b = afterRef.current;
    if (!a || !b) return;
    const newT = Number(val);
    setT(newT);
    if (newT < durA) {
      setActive("before");
      a.currentTime = newT;
      b.currentTime = 0;
      if (playing) a.play();
    } else {
      setActive("after");
      b.currentTime = Math.min(newT - durA, durB);
      if (playing) b.play();
    }
  };

  return (
    <div className={`w-full max-w-5xl mx-auto ${className}`}>
      <div className="flex flex-col md:flex-row items-center gap-10">
        {/* VIDEO FRAME (now capped to a smaller width) */}
        <div className="relative w-full md:w-1/2 max-w-[320px] sm:max-w-[360px] md:max-w-[380px] lg:max-w-[280px]">
          {/* before element */}
          <video
            ref={beforeRef}
            src={beforeSrc}
            className={`w-full h-auto rounded-xl shadow ${
              active === "before" ? "block" : "hidden"
            }`}
            playsInline
            controls={false}
          />
          {/* after element */}
          <video
            ref={afterRef}
            src={afterSrc}
            className={`w-full h-auto rounded-xl shadow ${
              active === "after" ? "block" : "hidden"
            }`}
            playsInline
            controls={false}
          />

          {/* label */}
          <span className="absolute top-2 left-2 bg-black/60 text-white text-xs font-semibold px-2.5 py-1 rounded">
            {label}
          </span>

          {/* controls */}
          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="rounded-md border border-white/15 px-3 py-1.5 text-emerald-100 hover:bg-white/5"
            >
              {playing ? "Pause" : "Play"}
            </button>
            <input
              type="range"
              min={0}
              max={Math.max(total, 0.01)}
              step="0.01"
              value={Math.min(t, total || 0)}
              onChange={(e) => onSeek(e.target.value)}
              className="flex-1 accent-emerald-400"
            />
            <span className="text-emerald-50/70 text-xs w-[90px] text-right tabular-nums">
              {Math.floor(t).toString().padStart(2, "0")}s /{" "}
              {Math.floor(total).toString().padStart(2, "0")}s
            </span>
          </div>
        </div>

        {/* TEXT */}
        <div className="w-full md:w-1/2">
          {title && (
            <h3 className="text-2xl p-5 lg:p-0 font-anton mb-2 bg-gradient-to-br from-emerald-200 to-cyan-300 bg-clip-text text-transparent">
              {title}
            </h3>
          )}
          {description && (
            <div className="rounded-2xl border border-white/10 bg-[#0b1713]/40 p-4">
              <p className="text-[15.5px] leading-relaxed text-emerald-50/90">
                {description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
