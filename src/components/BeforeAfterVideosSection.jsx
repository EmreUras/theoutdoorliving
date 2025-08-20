"use client";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase/browser";
import BeforeAfterVideo from "./BeforeAfterVideo";

export default function BeforeAfterVideosSection() {
  const [rows, setRows] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("before_after_videos")
        .select("*")
        .order("created_at", { ascending: false });
      setRows(data || []);
    })();
  }, []);

  if (!rows.length) return null;

  const visibleRows = expanded ? rows : rows.slice(0, 3);
  const hiddenCount = Math.max(rows.length - 3, 0);

  const toggle = () => {
    if (expanded) {
      setExpanded(false);
      // Smoothly bring the section back to the top when collapsing
      requestAnimationFrame(() => {
        sectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    } else {
      setExpanded(true);
    }
  };

  return (
    <section ref={sectionRef} className="py-16">
      <div className="mx-auto max-w-6xl space-y-16">
        {visibleRows.map((r) => {
          const { data: pubA } = supabase.storage
            .from("ba-videos")
            .getPublicUrl(r.before_path);
          const { data: pubB } = supabase.storage
            .from("ba-videos")
            .getPublicUrl(r.after_path);

          return (
            <BeforeAfterVideo
              key={r.id}
              beforeSrc={pubA.publicUrl}
              afterSrc={pubB.publicUrl}
              switchTime={r.switch_time_seconds}
              playbackRate={r.playback_rate}
              title={r.title}
              description={r.description}
            />
          );
        })}

        {rows.length > 3 && (
          <div className="pt-4 flex justify-center">
            <button
              onClick={toggle}
              className="rounded-xl border border-white/15 px-4 py-2 text-emerald-100 hover:bg-white/5"
            >
              {expanded
                ? "Hide projects"
                : `See more projects${
                    hiddenCount > 0 ? ` (${hiddenCount})` : ""
                  }`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
