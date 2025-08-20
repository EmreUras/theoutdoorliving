"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FiX,
  FiChevronRight,
  FiChevronLeft,
  FiUpload,
  FiTrash2,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase/browser";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  service: "",
  description: "",
  contact_pref: "email",
};

export default function GetQuoteModal({ open, onClose }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [dirty, setDirty] = useState(false);

  const [media, setMedia] = useState([]); // {file,url,kind}
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  /* ------ BODY LOCK (mobile-safe) ------ */
  useEffect(() => {
    if (!open) return;
    const scrollY = window.scrollY || 0;
    const { style } = document.body;
    style.position = "fixed";
    style.top = `-${scrollY}px`;
    style.left = "0";
    style.right = "0";
    style.width = "100%";
    return () => {
      style.position = "";
      style.top = "";
      style.left = "";
      style.right = "";
      style.width = "";
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  // ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && attemptClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, dirty]);

  // Cleanup object URLs
  useEffect(() => {
    return () => media.forEach((m) => m.url && URL.revokeObjectURL(m.url));
  }, [media]);

  const setField = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setDirty(true);
  };

  const validateStep1 = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Valid email is required";
    if (form.phone && !/^[\d\-+\s().]{7,20}$/.test(form.phone))
      e.phone = "Invalid phone";
    if (!form.service.trim()) e.service = "Please choose a service";
    if (!form.description.trim() || form.description.trim().length < 15)
      e.description = "Please add at least 15 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const canNext = useMemo(
    () => (step === 1 ? validateStep1() : true),
    [step, form]
  );

  const onPick = (files, kind) => {
    const list = Array.from(files || []);
    const mapped = list.map((f) => ({
      file: f,
      url: URL.createObjectURL(f),
      kind,
    }));
    if (mapped.length) setDirty(true);
    setMedia((prev) => [...prev, ...mapped]);
  };

  const removeMedia = (idx) => {
    setMedia((prev) => {
      const m = prev[idx];
      if (m?.url) URL.revokeObjectURL(m.url);
      const cp = [...prev];
      cp.splice(idx, 1);
      return cp;
    });
    setDirty(true);
  };

  const resetAll = () => {
    setStep(1);
    setForm(initialForm);
    setErrors({});
    media.forEach((m) => m.url && URL.revokeObjectURL(m.url));
    setMedia([]);
    setDirty(false);
  };

  const hardClose = () => {
    resetAll();
    onClose?.();
  };

  const attemptClose = () => {
    if (dirty) setShowConfirmClose(true);
    else hardClose();
  };

  // ---- submit to Supabase (quotes + storage + quote_media) ----
  const submitToSupabase = async () => {
    if (submitting) return;
    if (!validateStep1()) {
      toast.error("Please fix the highlighted fields.");
      return;
    }
    try {
      setSubmitting(true);

      // 1) create the quote
      const { data: quote, error: qErr } = await supabase
        .from("quotes")
        .insert({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone?.trim() || null,
          address: form.address?.trim() || null,
          city: form.city?.trim() || null,
          service: form.service.trim(),
          description: form.description.trim(),
          contact_pref: form.contact_pref,
          status: "new",
        })
        .select("*")
        .single();

      if (qErr) throw qErr;

      // 2) upload media (optional)
      const bucket = supabase.storage.from("quote-media");
      const mediaRows = [];
      for (let i = 0; i < media.length; i++) {
        const m = media[i];
        const cleanName = m.file.name.replace(/[^\w.\-]+/g, "_");
        const path = `quotes/${quote.id}/${Date.now()}_${i}_${cleanName}`;
        const { error: uErr } = await bucket.upload(path, m.file, {
          upsert: false,
          cacheControl: "3600",
        });
        if (uErr) throw uErr;
        mediaRows.push({
          quote_id: quote.id,
          kind: m.kind,
          path,
          sort_order: i,
        });
      }

      if (mediaRows.length) {
        const { error: mErr } = await supabase
          .from("quote_media")
          .insert(mediaRows);
        if (mErr) throw mErr;
      }

      toast.success("Quote request sent. We’ll get back to you soon!");
      hardClose();
    } catch (err) {
      console.error(err);
      toast.error("Could not send your quote. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
        onClick={attemptClose}
      />

      {/* Modal (centered) */}
      <div className="fixed inset-0 z-[90] flex items-center justify-center p-2 sm:p-4">
        <div
          role="dialog"
          aria-modal="true"
          className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-white/10 bg-[#0b1713]/95 shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <h3 className="text-emerald-100 font-semibold text-lg">
                Get a Quote
              </h3>
              <Stepper step={step} />
            </div>
            <button
              onClick={attemptClose}
              aria-label="Close"
              className="rounded-lg p-2 text-emerald-50/80 hover:bg-white/5"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>

          {/* Scrollable content */}
          <div
            className="flex-1 overflow-y-auto overscroll-contain px-5 py-5"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            {step === 1 && (
              <StepDetails
                form={form}
                errors={errors}
                setField={setField}
                validate={validateStep1}
              />
            )}
            {step === 2 && (
              <StepMedia
                media={media}
                onPick={onPick}
                removeMedia={removeMedia}
              />
            )}
            {step === 3 && <StepReview form={form} media={media} />}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-white/10 shrink-0">
            <div className="text-xs text-emerald-50/60">
              Press <kbd className="rounded bg-white/10 px-1">Esc</kbd> to close
            </div>

            <div className="flex items-center gap-2">
              {step > 1 && (
                <button
                  onClick={() => setStep((s) => Math.max(1, s - 1))}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-emerald-50/90 hover:bg-white/5"
                >
                  <FiChevronLeft /> Back
                </button>
              )}
              {step < 3 ? (
                <button
                  onClick={() => {
                    if (step === 1 && !validateStep1()) {
                      toast.error("Please fix the highlighted fields.");
                      return;
                    }
                    setStep((s) => s + 1);
                  }}
                  disabled={step === 1 && !canNext}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 ${
                    step === 1 && !canNext
                      ? "border border-white/10 text-emerald-50/40 cursor-not-allowed"
                      : "bg-emerald-500/90 hover:bg-emerald-500 text-black"
                  }`}
                >
                  Next <FiChevronRight />
                </button>
              ) : (
                <button
                  onClick={submitToSupabase}
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/90 hover:bg-emerald-500 px-4 py-2 text-black disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? "Sending…" : "Send Request"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirm close */}
      {showConfirmClose && (
        <ConfirmClose
          onCancel={() => setShowConfirmClose(false)}
          onDiscard={() => {
            setShowConfirmClose(false);
            hardClose();
          }}
        />
      )}
    </>
  );
}

/* --- subcomponents (unchanged visuals) --- */
function Stepper({ step }) {
  const items = [
    { id: 1, label: "Details" },
    { id: 2, label: "Media (optional)" },
    { id: 3, label: "Review" },
  ];
  return (
    <div className="hidden md:flex items-center gap-2 text-xs">
      {items.map((it, i) => (
        <div key={it.id} className="flex items-center gap-2">
          <div
            className={`h-6 rounded-full px-2.5 grid place-items-center ${
              step >= it.id
                ? "bg-emerald-400/20 text-emerald-200 border border-emerald-300/40"
                : "bg-white/5 text-emerald-50/70 border border-white/10"
            }`}
          >
            {it.label}
          </div>
          {i < items.length - 1 && <div className="w-6 h-px bg-white/15" />}
        </div>
      ))}
    </div>
  );
}

function StepDetails({ form, errors, setField, validate }) {
  useEffect(() => {
    validate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  const input =
    "w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-emerald-50/90 placeholder:text-emerald-50/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/40";
  const err = (k) =>
    errors[k] ? <p className="mt-1 text-xs text-red-300">{errors[k]}</p> : null;

  return (
    <div className="quote-modal">
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-emerald-50/80 mb-1">
              Name *
            </label>
            <input
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              className={input}
              placeholder="Jane Doe"
              autoComplete="name"
            />
            {err("name")}
          </div>
          <div>
            <label className="block text-sm text-emerald-50/80 mb-1">
              Email *
            </label>
            <input
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              className={input}
              placeholder="jane@example.com"
              autoComplete="email"
            />
            {err("email")}
          </div>
          <div>
            <label className="block text-sm text-emerald-50/80 mb-1">
              Phone
            </label>
            <input
              value={form.phone}
              onChange={(e) => setField("phone", e.target.value)}
              className={input}
              placeholder="+1 (555) 555-5555"
              autoComplete="tel"
            />
            {err("phone")}
          </div>
          <div>
            <label className="block text-sm text-emerald-50/80 mb-1">
              City
            </label>
            <input
              value={form.city}
              onChange={(e) => setField("city", e.target.value)}
              className={input}
              placeholder="Burlington"
              autoComplete="address-level2"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-emerald-50/80 mb-1">
              Address
            </label>
            <input
              value={form.address}
              onChange={(e) => setField("address", e.target.value)}
              className={input}
              placeholder="123 Garden Ave."
              autoComplete="street-address"
            />
          </div>
          <div>
            <label className="block text-sm text-emerald-50/80 mb-1 ">
              Service *
            </label>
            <select
              value={form.service}
              onChange={(e) => setField("service", e.target.value)}
              className={input}
            >
              <option value="">Choose…</option>
              <option>Property Maintenance</option>
              <option>Lawn Cutting / Trimming</option>
              <option>Interlock Installation</option>
              <option>Retaining Walls</option>
              <option>Planting</option>
              <option>Fall / Spring Clean-Up</option>
              <option>Excavation</option>
              <option>Other</option>
            </select>
            {err("service")}
          </div>
        </div>

        <div>
          <label className="block text-sm text-emerald-50/80 mb-1">
            Best way to contact
          </label>
          <div className="flex gap-3">
            {["email", "phone"].map((opt) => (
              <label
                key={opt}
                className="inline-flex items-center gap-2 text-emerald-50/80"
              >
                <input
                  type="radio"
                  name="contact_pref"
                  checked={form.contact_pref === opt}
                  onChange={() => setField("contact_pref", opt)}
                />
                <span className="capitalize">{opt}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm text-emerald-50/80 mb-1">
            Describe your project *
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
            className={`${input} min-h-[120px]`}
            placeholder="Tell us what you need, timeline, rough size, etc."
          />
          {err("description")}
        </div>
      </div>
      <style jsx global>{`
        .quote-modal select,
        .quote-modal select option {
          background-color: #0b1713;
          color: #dcfce7;
        }
      `}</style>
    </div>
  );
}

function StepMedia({ media, onPick, removeMedia }) {
  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="group relative grid place-items-center rounded-xl border border-dashed border-emerald-300/40 bg-white/5 p-6 text-emerald-50/80 hover:bg-white/10 cursor-pointer">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => onPick(e.target.files, "image")}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <div className="flex items-center gap-2">
            <FiUpload /> Add Images
          </div>
        </label>
        <label className="group relative grid place-items-center rounded-xl border border-dashed border-emerald-300/40 bg-white/5 p-6 text-emerald-50/80 hover:bg-white/10 cursor-pointer">
          <input
            type="file"
            accept="video/*"
            multiple
            onChange={(e) => onPick(e.target.files, "video")}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <div className="flex items-center gap-2">
            <FiUpload /> Add Videos
          </div>
        </label>
      </div>

      {media.length === 0 ? (
        <p className="text-sm text-emerald-50/70">
          You can skip this step—media is optional. Add photos or short videos
          if it helps explain the job.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {media.map((m, i) => (
            <div
              key={i}
              className="relative rounded-xl border border-white/10 bg-[#0b1713]/70 p-2 shadow"
            >
              <button
                onClick={() => removeMedia(i)}
                className="absolute -right-2 -top-2 rounded-full bg-red-500 text-white p-1 shadow"
                title="Remove"
                aria-label="Remove media"
              >
                <FiTrash2 className="h-4 w-4" />
              </button>
              {m.kind === "image" ? (
                <img
                  src={m.url}
                  alt=""
                  className="h-40 w-full object-cover rounded-lg"
                />
              ) : (
                <video
                  src={m.url}
                  className="h-40 w-full object-cover rounded-lg"
                  controls
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StepReview({ form, media }) {
  const row = "text-sm text-emerald-50/90";
  const label = "w-36 text-emerald-50/50";
  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-white/10 bg-[#0b1713]/60 p-4">
        <div className="flex flex-wrap gap-y-2">
          {[
            ["Name", form.name],
            ["Email", form.email],
            ["Phone", form.phone || "—"],
            ["City", form.city || "—"],
            ["Address", form.address || "—"],
            ["Service", form.service],
            ["Contact via", form.contact_pref],
          ].map(([k, v]) => (
            <div key={k} className={`flex w-full md:w-1/2 ${row}`}>
              <span className={label}>{k}</span>
              <span className="capitalize">{v}</span>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <p className="text-emerald-50/60 text-sm mb-1">Description</p>
          <p className="rounded-lg border border-white/10 bg-white/5 p-3 text-emerald-50/90">
            {form.description}
          </p>
        </div>
      </div>

      {media.length > 0 && (
        <div>
          <p className="text-emerald-50/60 text-sm mb-2">Attached media</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {media.map((m, i) => (
              <div
                key={i}
                className="rounded-xl overflow-hidden border border-white/10"
              >
                {m.kind === "image" ? (
                  <img
                    src={m.url}
                    alt=""
                    className="h-40 w-full object-cover"
                  />
                ) : (
                  <video
                    src={m.url}
                    className="h-40 w-full object-cover"
                    controls
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ConfirmClose({ onCancel, onDiscard }) {
  return (
    <>
      <div className="fixed inset-0 z-[95] bg-black/60" />
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0b1713]/95 p-5">
          <h4 className="text-emerald-100 font-semibold text-lg">
            Discard changes?
          </h4>
          <p className="mt-2 text-emerald-50/80 text-sm">
            You’ve entered some information. Are you sure you want to close this
            quote request?
          </p>
          <div className="mt-5 flex items-center justify-end gap-2">
            <button
              onClick={onCancel}
              className="rounded-lg border border-white/15 px-3 py-2 text-emerald-50/90 hover:bg-white/5"
            >
              Keep editing
            </button>
            <button
              onClick={onDiscard}
              className="rounded-lg bg-red-500/90 hover:bg-red-500 px-4 py-2 text-white"
            >
              Discard
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
