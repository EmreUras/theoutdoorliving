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
  if (!projects.length)
    return <div className="text-emerald-50/70">No projects yet.</div>;

  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl space-y-14">
        {projects.map((p) => (
          <article
            key={p.id}
            className="
              relative rounded-3xl  bg-black/25
        
              p-6 md:p-10
            "
          >
            {/* TITLE */}
            {(p.title || p.featured) && (
              <header className="text-center mb-6 md:mb-8">
                {p.title && (
                  <h2
                    className="text-3xl md:text-4xl font-anton tracking-wide bg-gradient-to-br
                   from-emerald-200 via-teal-200 to-cyan-300 bg-clip-text text-transparent"
                  >
                    {p.title}
                  </h2>
                )}
                <div className="mx-auto mt-3 h-px w-24 bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />
              </header>
            )}

            {/* GRID — images first, then paragraph that spans all columns */}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {p.pairs.map((pair) => (
                <BeforeAfterCard
                  key={pair.id}
                  beforeUrl={pair.before_url}
                  afterUrl={pair.after_url}
                />
              ))}

              {/* PARAGRAPH spans full grid width so it's aligned with images */}
              {p.description && (
                <div className="sm:col-span-2 lg:col-span-3">
                  <div
                    className="
                      rounded-2xl border border-white/10 bg-[#0b1713]/40
                      p-5 md:p-7 relative
                      shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]
                      before:absolute before:inset-x-5 before:top-2 before:h-px
                      before:bg-gradient-to-r before:from-transparent before:via-emerald-300/20 before:to-transparent
                      after:absolute after:inset-x-5 after:bottom-2 after:h-px
                      after:bg-gradient-to-r after:from-transparent after:via-emerald-300/20 after:to-transparent
                    "
                  >
                    <p
                      className="
                        text-[16px] md:text-[17px] leading-8 text-emerald-50/90 antialiased
                        first-letter:text-5xl first-letter:font-anton first-letter:leading-[0.8]
                        first-letter:float-left first-letter:mr-3 first-letter:mt-1
                        first-letter:text-emerald-200
                      "
                    >
                      {p.description}
                    </p>
                  </div>
                </div>
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
