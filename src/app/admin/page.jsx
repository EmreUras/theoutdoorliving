"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/browser";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff, FiLogIn } from "react-icons/fi";

export default function AdminLogin() {
  const router = useRouter();
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || ""; // e.g. andrew.nf.smith@gmail.com

  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState(adminEmail); // prefill with admin email (editable if you want)
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // already signed in? go straight to dashboard
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) router.replace("/admin/dashboard");
      setLoading(false);
    })();
  }, [router]);

  async function onSubmit(e) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Enter email and password");
      return;
    }

    // Optional hard gate: only allow the configured admin email
    if (adminEmail && email.trim().toLowerCase() !== adminEmail.toLowerCase()) {
      toast.error("Only the admin account can sign in.");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      toast.error(error.message || "Sign in failed");
      setSubmitting(false);
      return;
    }

    toast.success("Signed in");
    router.replace("/admin/dashboard");
  }

  if (loading) return null;

  return (
    <section className="py-24 px-6 md:px-16">
      <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-[#0b1713]/70 backdrop-blur-xl p-6">
        <h1 className="text-3xl font-anton bg-gradient-to-br from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
          Admin Sign In
        </h1>
        <p className="text-emerald-50/70 mt-1">
          Sign in with your admin email and password.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm text-emerald-50/80">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-emerald-50 outline-none focus:border-emerald-400/60"
              placeholder="you@domain.com"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm text-emerald-50/80">Password</span>
            <div className="mt-1 relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 pr-10 text-emerald-50 outline-none focus:border-emerald-400/60"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-white/10 text-emerald-50/80"
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </label>

          <button
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 bg-gradient-to-br from-emerald-400 to-cyan-400 text-black font-medium hover:brightness-110 disabled:opacity-60"
          >
            <FiLogIn /> {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </section>
  );
}
