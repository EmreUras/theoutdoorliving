"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/browser";
import toast from "react-hot-toast";
import { FiCheck, FiTrash2, FiX } from "react-icons/fi";

function Confirm({ open, title, body, onCancel, onConfirm }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0b1713]/95 p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-emerald-100">{title}</h3>
        {body && <p className="mt-2 text-emerald-50/80">{body}</p>}
        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-lg border border-white/15 px-3 py-2 text-emerald-50/90 hover:bg-white/5 flex items-center gap-2"
          >
            <FiX /> Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg px-4 py-2 bg-red-500/90 hover:bg-red-500 text-white font-medium flex items-center gap-2"
          >
            <FiTrash2 /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TabTestimonials({ pushNotice }) {
  const [rows, setRows] = useState([]);
  const [confirm, setConfirm] = useState({ open: false, id: null });

  const load = async () => {
    const { data, error } = await supabase
      .from("testimonials")
      .select("id,name,text,rating,approved,created_at")
      .order("approved", { ascending: true }) // pending first
      .order("created_at", { ascending: false });
    if (error) return toast.error(error.message);
    setRows(data || []);
  };

  useEffect(() => {
    load();
    const ch = supabase
      .channel("rt:adm-testimonials")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "testimonials" },
        () => load()
      )
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, []);

  async function approve(id) {
    const { error } = await supabase
      .from("testimonials")
      .update({ approved: true })
      .eq("id", id);
    if (error) {
      toast.error(error.message);
      pushNotice?.({
        type: "error",
        title: "Approve failed",
        body: error.message,
      });
    } else {
      toast.success("Review approved");
      pushNotice?.({ type: "success", title: "Review approved" });
    }
  }

  async function doDelete(id) {
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      pushNotice?.({
        type: "error",
        title: "Delete failed",
        body: error.message,
      });
    } else {
      toast.success("Review deleted");
      pushNotice?.({ type: "success", title: "Review deleted" });
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl text-emerald-100 font-semibold">Testimonials</h2>

      {!rows.length ? (
        <p className="text-emerald-50/70">Nothing here yet.</p>
      ) : (
        <ul className="space-y-3">
          {rows.map((r) => (
            <li
              key={r.id}
              className="rounded-xl border border-white/10 p-4 bg-black/25"
            >
              <div className="flex items-start flex-col gap-4">
                <div className="flex-shrink-0">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={`h-4 w-4 mr-0.5 ${
                          i < r.rating
                            ? "text-yellow-400"
                            : "text-yellow-400/30"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-emerald-50/80 mt-1">
                    {new Date(r.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex-1">
                  <p className="text-emerald-50/90">“{r.text}”</p>
                  <p className="text-sm font-semibold text-cyan-300 mt-1">
                    {r.name}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {!r.approved && (
                    <button
                      onClick={() => approve(r.id)}
                      className="rounded-lg border border-emerald-400/30 px-3 py-2 text-emerald-200 hover:bg-emerald-400/10 flex items-center gap-2"
                    >
                      <FiCheck /> Approve
                    </button>
                  )}
                  <button
                    onClick={() => setConfirm({ open: true, id: r.id })}
                    className="rounded-lg border border-red-400/25 px-3 py-2 text-red-300 hover:bg-red-500/10 flex items-center gap-2"
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Confirm
        open={confirm.open}
        title="Delete this review?"
        body="This cannot be undone."
        onCancel={() => setConfirm({ open: false, id: null })}
        onConfirm={() => {
          const id = confirm.id;
          setConfirm({ open: false, id: null });
          doDelete(id);
        }}
      />
    </div>
  );
}
