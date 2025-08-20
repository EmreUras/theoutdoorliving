// src/components/Testimonials.jsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/browser";
import toast from "react-hot-toast";
import { HiStar } from "react-icons/hi";
import { FiStar } from "react-icons/fi";

const seed = [
  {
    text: "They transformed my messy lawn into something I’m proud of.",
    author: "Aisha K.",
    rating: 5,
  },
  {
    text: "Professional, friendly, and efficient. Backyard looks new.",
    author: "Sandra L.",
    rating: 4,
  },
  {
    text: "Great communication and beautiful results.",
    author: "Raj P.",
    rating: 5,
  },
  {
    text: "Fast turnaround and great quality. Will hire again.",
    author: "Jason T.",
    rating: 4,
  },
  {
    text: "Listened to what we wanted and totally delivered!",
    author: "Tina R.",
    rating: 5,
  },
];

function Stars({ value, size = "h-5 w-5" }) {
  return (
    <div className="flex items-center justify-center gap-[2px]">
      {Array.from({ length: 5 }).map((_, i) =>
        i < value ? (
          <HiStar key={i} className={`${size} text-amber-300/90`} />
        ) : (
          <FiStar key={i} className={`${size} text-amber-300/60`} />
        )
      )}
    </div>
  );
}

function StarInput({ value, onChange }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const v = i + 1;
        const filled = v <= value;
        return (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className="p-1 rounded hover:bg-white/5"
            aria-label={`Rate ${v} star${v > 1 ? "s" : ""}`}
          >
            {filled ? (
              <HiStar className="h-6 w-6 text-amber-300/90" />
            ) : (
              <FiStar className="h-6 w-6 text-amber-300/60" />
            )}
          </button>
        );
      })}
    </div>
  );
}

export default function Testimonials() {
  const [tab, setTab] = useState("read"); // read | write
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);

  // form
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("testimonials")
      .select("id,name,text,rating,created_at")
      .eq("approved", true)
      .order("created_at", { ascending: false });
    setLoading(false);
    if (error) return toast.error(error.message);
    setRows(data || []);
  };

  useEffect(() => {
    load();
    const ch = supabase
      .channel("ba-public-testimonials")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "testimonials" },
        () => load()
      )
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, []);

  const display = useMemo(() => {
    const mapped = rows.map((r) => ({
      text: r.text,
      author: r.name,
      rating: r.rating,
    }));
    if (mapped.length >= 5) return mapped;
    const need = 5 - mapped.length;
    return [...mapped, ...seed.slice(0, need)];
  }, [rows]);

  async function submitReview(e) {
    e.preventDefault();
    if (!name.trim() || !text.trim())
      return toast.error("Please add your name and a short review.");
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("testimonials")
        .insert([
          { name: name.trim(), text: text.trim(), rating, approved: false },
        ]);
      if (error) throw error;
      toast.success(
        "Thanks! After admin confirmation your review will appear."
      );
      setName("");
      setText("");
      setRating(5);
      setTab("read");
    } catch (err) {
      toast.error(err.message || "Could not submit review");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="py-16 text-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Tabs – neutral, no glow */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <button
            onClick={() => setTab("read")}
            className={`px-4 py-2 rounded-lg border text-sm md:text-base ${
              tab === "read"
                ? "border-white/15 bg-white/[0.04] text-slate-200"
                : "border-white/10 text-slate-300 hover:bg-white/[0.04]"
            }`}
          >
            What Our Clients Say
          </button>
          <button
            onClick={() => setTab("write")}
            className={`px-4 py-2 rounded-lg border text-sm md:text-base ${
              tab === "write"
                ? "border-white/15 bg-white/[0.04] text-slate-200"
                : "border-white/10 text-slate-300 hover:bg-white/[0.04]"
            }`}
          >
            Share Your Review
          </button>
        </div>

        {/* Title – plain, no gradient/shadow */}
        <h2 className="text-3xl md:text-4xl font-anton text-center text-slate-200 mb-10">
          What Our Clients Say
        </h2>

        {tab === "read" ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {display.map((t, i) => (
              <div
                key={i}
                className="rounded-lg border border-white/10 bg-white/[0.035] p-5"
              >
                <div className="flex items-center justify-center mb-3">
                  <Stars value={t.rating ?? 5} />
                </div>
                <p className="text-slate-200/90 text-center leading-relaxed">
                  “{t.text}”
                </p>
                <p className="mt-3 text-center text-sm font-semibold text-slate-300">
                  {t.author}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-xl mx-auto rounded-lg border border-white/10 bg-white/[0.035] p-6">
            <h3 className="text-xl md:text-2xl font-medium text-slate-200 text-center mb-4">
              Share your experience
            </h3>
            <form onSubmit={submitReview} className="space-y-4">
              <div className="flex items-center justify-center">
                <StarInput value={rating} onChange={setRating} />
              </div>

              <label className="block">
                <span className="text-sm text-slate-300">Your name</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-md bg-black/30 border border-white/10 px-3 py-2 text-slate-200 outline-none"
                  placeholder="John D."
                />
              </label>

              <label className="block">
                <span className="text-sm text-slate-300">Your review</span>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={4}
                  className="mt-1 w-full rounded-md bg-black/30 border border-white/10 px-3 py-2 text-slate-200 outline-none"
                  placeholder="Tell others what you liked!"
                />
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-md px-4 py-2 bg-slate-200 text-black font-semibold disabled:opacity-60"
              >
                {submitting ? "Sending…" : "Send review"}
              </button>
              <p className="text-xs text-center text-slate-400">
                Your review will appear after admin confirmation.
              </p>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
