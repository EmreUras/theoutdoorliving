"use client";

import { useState } from "react";
import { FiMail, FiPhone } from "react-icons/fi";
import { supabase } from "@/lib/supabase/browser";
import toast from "react-hot-toast";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    body: "",
  });
  const [loading, setLoading] = useState(false);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.body) {
      toast.error("Name, email, and message are required.");
      return;
    }
    setLoading(true);

    const { error } = await supabase.from("messages").insert({
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      subject: form.subject || null,
      body: form.body,
      // read defaults to false; created_at defaults to now()
    });

    setLoading(false);

    if (error) {
      toast.error("Could not send your message. Please try again.");
      return;
    }

    toast.success("Message sent! We’ll get back to you soon.");
    setForm({ name: "", email: "", phone: "", subject: "", body: "" });
  }

  return (
    <section className="relative w-full py-24 px-6 md:px-16">
      {/* title */}
      <h1 className="text-center font-anton text-5xl md:text-7xl tracking-tight mb-12">
        <span className="bg-gradient-to-br from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_2px_20px_rgba(16,185,129,.25)]">
          Let’s Get in Touch
        </span>
      </h1>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-2">
        {/* === Left info card === */}
        <div className="rounded-2xl bg-[#0b1713]/60 backdrop-blur-xl ring-1 ring-white/10 p-6 md:p-8">
          <p className="text-emerald-50/75">
            Have a project in mind? Tell us a bit about it and we’ll reply
            quickly. Prefer a direct line? Reach us here:
          </p>

          <div className="mt-8 space-y-6">
            <a
              href="mailto:andrew.nf.smith@gmail.com"
              className="group flex items-center gap-4 rounded-xl border border-white/10 p-4 hover:bg-white/5 transition"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-400/90 text-black shadow">
                <FiMail />
              </span>
              <div className="min-w-0">
                <p className="font-medium text-emerald-100">Email</p>
                <p className="truncate text-emerald-50/80">
                  andrew.nf.smith@gmail.com
                </p>
              </div>
            </a>

            <a
              href="tel:+16479377637"
              className="group flex items-center gap-4 rounded-xl border border-white/10 p-4 hover:bg-white/5 transition"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-400/90 text-black shadow">
                <FiPhone />
              </span>
              <div>
                <p className="font-medium text-emerald-100">Phone</p>
                <p className="text-emerald-50/80">647-937-7637</p>
              </div>
            </a>
          </div>
        </div>

        {/* === Right form card === */}
        <form
          onSubmit={onSubmit}
          className="rounded-2xl bg-[#0b1713]/60 backdrop-blur-xl ring-1 ring-white/10 p-6 md:p-8 space-y-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <label className="block">
              <span className="text-sm text-emerald-50/80">Name*</span>
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                required
                className="mt-1 w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-emerald-50 outline-none focus:border-emerald-400/60"
                placeholder="John Doe"
              />
            </label>

            <label className="block">
              <span className="text-sm text-emerald-50/80">Email*</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                required
                className="mt-1 w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-emerald-50 outline-none focus:border-emerald-400/60"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </label>

            <label className="block">
              <span className="text-sm text-emerald-50/80">Phone</span>
              <input
                name="phone"
                value={form.phone}
                onChange={onChange}
                className="mt-1 w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-emerald-50 outline-none focus:border-emerald-400/60"
                placeholder="Optional"
              />
            </label>

            <label className="block">
              <span className="text-sm text-emerald-50/80">Subject</span>
              <input
                name="subject"
                value={form.subject}
                onChange={onChange}
                className="mt-1 w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-emerald-50 outline-none focus:border-emerald-400/60"
                placeholder="Project type, location, etc."
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm text-emerald-50/80">Message*</span>
            <textarea
              name="body"
              rows={5}
              required
              value={form.body}
              onChange={onChange}
              className="mt-1 w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-emerald-50 outline-none focus:border-emerald-400/60 resize-y"
              placeholder="Tell us what you need help with…"
            />
          </label>

          <button
            disabled={loading}
            className="w-full rounded-xl py-2.5 font-medium bg-gradient-to-br from-emerald-400 to-cyan-400 text-black hover:brightness-110 transition disabled:opacity-60"
          >
            {loading ? "Sending…" : "Send Message"}
          </button>

          <p className="text-xs text-emerald-50/60">
            * Required fields. Your info goes straight to our secure inbox.
          </p>
        </form>
      </div>
    </section>
  );
}
