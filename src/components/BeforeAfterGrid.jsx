"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/browser";
import BeforeAfterCard from "@/components/BeforeAfterCard";
import toast from "react-hot-toast";

export default function BeforeAfterGrid() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("before_after_projects")
        .select(
          `
          id, title, description, featured, created_at,
          pairs:before_after_pairs ( id, before_url, after_url, sort_order )
        `
        )
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });
      setLoading(false);
      if (error) return toast.error(error.message);

      setProjects(
        (data || []).map((p) => ({
          ...p,
          pairs: (p.pairs || []).sort(
            (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
          ),
        }))
      );
    })();

    // realtime refresh
    const ch = supabase
      .channel("ba-public")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "before_after_projects" },
        () => location.reload()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "before_after_pairs" },
        () => location.reload()
      )
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, []);

  if (loading) return null;

  if (!projects.length) {
    return <div className="text-emerald-50/70">No projects yet.</div>;
  }

  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl space-y-12">
        {projects.map((p) => (
          <article
            key={p.id}
            className="
              relative rounded-3xl border border-white/10 bg-white/5
              ring-1 ring-emerald-400/20 shadow-[0_0_60px_rgba(16,185,129,0.18)]
              hover:shadow-[0_0_90px_rgba(16,185,129,0.28)] transition-shadow
              p-6 md:p-8
            "
          >
            {/* IMAGES ON TOP */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {p.pairs.map((pair) => (
                <BeforeAfterCard
                  key={pair.id}
                  beforeUrl={pair.before_url}
                  afterUrl={pair.after_url}
                />
              ))}
            </div>

            {/* TEXT UNDER — CENTERED */}
            <div className="mt-8 text-center bg-black/20 p-5 rounded-2xl">
              {p.title && (
                <h2 className="text-3xl font-anton mb-2 bg-gradient-to-br from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                  {p.title}
                </h2>
              )}
              {p.description && (
                <p className="mx-auto max-w-3xl text-emerald-50/80 ">
                  {p.description}
                </p>
              )}
            </div>

            {/* subtle inner glow edge */}
            <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/5" />
          </article>
        ))}
      </div>
    </section>
  );
}
