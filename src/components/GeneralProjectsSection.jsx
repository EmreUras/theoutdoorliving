"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase/browser";
import GeneralProjectCard from "./GeneralProjectCard";

export default function GeneralProjectsSection() {
  const [rows, setRows] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("general_projects")
        .select(
          `
          id, title, description, featured, created_at,
          media:general_project_media ( id, kind, path, sort_order, created_at )
        `
        )
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });
      setRows(
        (data || []).map((r) => ({
          ...r,
          media: (r.media || []).sort(
            (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
          ),
        }))
      );
    })();
  }, []);

  const visible = useMemo(() => {
    if (rows.length <= 3) return rows;
    return showMore ? rows.slice(0, 4) : rows.slice(0, 3);
  }, [rows, showMore]);

  if (!rows.length) return null;

  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl space-y-12">
        {visible.map((p) => (
          <GeneralProjectCard key={p.id} project={p} />
        ))}

        {rows.length > 3 && (
          <div className="pt-2 flex justify-center">
            <button
              onClick={() => setShowMore((v) => !v)}
              className="rounded-xl border border-white/15 px-4 py-2 text-emerald-100 hover:bg-white/5"
            >
              {showMore ? "Hide projects" : "See more projects"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
