"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/supabase/browser";
import toast from "react-hot-toast";
import {
  FiRefreshCw,
  FiCheckCircle,
  FiXCircle,
  FiTrash2,
  FiSend,
  FiEye,
  FiEdit3,
} from "react-icons/fi";

export default function AdminQuotesPage() {
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("new"); // new | sent | all
  const [rows, setRows] = useState([]);
  const [deleting, setDeleting] = useState(null); // quote to delete
  const [confirmName, setConfirmName] = useState("");
  const [reallySure, setReallySure] = useState(false); // second confirmation

  // fetch
  const fetchRows = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("quotes")
        .select("*")
        .order("created_at", { ascending: false });
      if (tab === "new") query = query.eq("status", "new");
      if (tab === "sent") query = query.eq("status", "sent");
      const { data, error } = await query;
      if (error) throw error;

      // attach media lists
      const ids = data.map((d) => d.id);
      let mediaByQuote = {};
      if (ids.length) {
        const { data: media } = await supabase
          .from("quote_media")
          .select("*")
          .in("quote_id", ids)
          .order("sort_order", { ascending: true });

        // sign URLs (private bucket)
        if (media?.length) {
          const signed = await Promise.all(
            media.map(async (m) => {
              const { data: urlData } = await supabase.storage
                .from("quote-media")
                .createSignedUrl(m.path, 60 * 15); // 15 min
              return { ...m, signedUrl: urlData?.signedUrl || null };
            })
          );
          for (const m of signed) {
            (mediaByQuote[m.quote_id] ||= []).push(m);
          }
        }
      }

      setRows(
        data.map((q) => ({
          ...q,
          media: mediaByQuote[q.id] || [],
          open: false,
        }))
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to load quotes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
    // realtime
    const ch = supabase
      .channel("quotes-admin")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "quotes" },
        async ({ new: q }) => {
          toast.success(`New quote from ${q.name || "Client"}`);
          if (tab !== "sent") fetchRows();
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "quotes" },
        () => fetchRows()
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "quotes" },
        () => fetchRows()
      )
      .subscribe();

    return () => supabase.removeChannel(ch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const filtered = rows; // already filtered in query

  // actions
  const markSent = async (q, sent) => {
    const { error } = await supabase
      .from("quotes")
      .update({
        status: sent ? "sent" : "new",
        quote_sent: sent,
        quote_sent_at: sent ? new Date().toISOString() : null,
      })
      .eq("id", q.id);
    if (error) return toast.error("Could not update");
    toast.success(sent ? "Marked as sent" : "Moved back to New");
  };

  const toggleReviewed = async (q) => {
    const { error } = await supabase
      .from("quotes")
      .update({ reviewed: !q.reviewed })
      .eq("id", q.id);
    if (error) return toast.error("Could not update");
    toast.success(!q.reviewed ? "Marked as reviewed" : "Review undone");
  };

  const reallyDelete = async (q) => {
    const { error } = await supabase.from("quotes").delete().eq("id", q.id);
    if (error) return toast.error("Delete failed");
    toast.success("Quote deleted");
    setDeleting(null);
    setConfirmName("");
    setReallySure(false);
  };

  return (
    <section className="py-16 px-6 md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-anton bg-gradient-to-br from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
              Quotes
            </h1>
            <p className="text-emerald-50/80">
              Manage incoming quote requests.
            </p>
          </div>
          <button
            onClick={fetchRows}
            className="rounded-xl border border-white/15 px-3 py-2 text-emerald-50/90 hover:bg-white/5 flex items-center gap-2"
            title="Refresh"
          >
            <FiRefreshCw /> Refresh
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-5 flex gap-2">
          {[
            ["new", "New"],
            ["sent", "Quote Sent"],
            ["all", "All"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`rounded-xl border px-3 py-2 ${
                tab === key
                  ? "border-emerald-300/40 bg-white/5 text-emerald-200"
                  : "border-white/10 text-emerald-50/80 hover:bg-white/5"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="rounded-2xl border border-white/10 bg-[#0b1713]/60 backdrop-blur-xl">
          {loading ? (
            <div className="p-8 text-emerald-50/80">Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-emerald-50/80">No quotes.</div>
          ) : (
            <ul className="divide-y divide-white/5">
              {filtered.map((q) => (
                <li key={q.id} className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-emerald-100 font-semibold">
                        {q.name}{" "}
                        <span className="text-emerald-50/60 font-normal">
                          • {q.email}
                        </span>
                      </div>
                      <div className="text-sm text-emerald-50/70">
                        {q.service} — {new Date(q.created_at).toLocaleString()}
                        {q.city ? ` • ${q.city}` : ""}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => markSent(q, !q.quote_sent)}
                        className={`rounded-lg px-3 py-2 border ${
                          q.quote_sent
                            ? "border-emerald-300/40 text-emerald-200 hover:bg-white/5"
                            : "border-white/15 text-emerald-50/90 hover:bg-white/5"
                        }`}
                        title={
                          q.quote_sent ? "Undo quote sent" : "Mark quote sent"
                        }
                      >
                        <FiSend className="inline-block mr-1" />
                        {q.quote_sent ? "Undo Sent" : "Quote Sent"}
                      </button>
                      <button
                        onClick={() =>
                          setRows((prev) =>
                            prev.map((r) =>
                              r.id === q.id ? { ...r, open: !r.open } : r
                            )
                          )
                        }
                        className="rounded-lg px-3 py-2 border border-white/15 text-emerald-50/90 hover:bg-white/5"
                      >
                        <FiEye className="inline-block mr-1" />
                        {q.open ? "Hide" : "View"}
                      </button>
                      <button
                        onClick={() => toggleReviewed(q)}
                        className={`rounded-lg px-3 py-2 border ${
                          q.reviewed
                            ? "border-emerald-300/40 text-emerald-200 hover:bg-white/5"
                            : "border-white/15 text-emerald-50/90 hover:bg-white/5"
                        }`}
                        title="Toggle review"
                      >
                        <FiEdit3 className="inline-block mr-1" />
                        {q.reviewed ? "Reviewed" : "Mark Reviewed"}
                      </button>
                      <button
                        onClick={() => setDeleting(q)}
                        className="rounded-lg px-3 py-2 border border-red-400/30 text-red-300 hover:bg-red-500/10"
                        title="Delete"
                      >
                        <FiTrash2 className="inline-block mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>

                  {q.open && (
                    <div className="mt-4 rounded-xl border border-white/10 bg-[#0b1713]/60 p-4">
                      <div className="grid md:grid-cols-2 gap-4 text-sm text-emerald-50/90">
                        <Field k="Phone" v={q.phone || "—"} />
                        <Field k="City" v={q.city || "—"} />
                        <Field k="Address" v={q.address || "—"} />
                        <Field k="Contact via" v={q.contact_pref} />
                      </div>
                      <div className="mt-3">
                        <p className="text-emerald-50/60 text-sm mb-1">
                          Description
                        </p>
                        <p className="rounded-lg border border-white/10 bg-white/5 p-3 text-emerald-50/90">
                          {q.description}
                        </p>
                      </div>

                      {q.media?.length ? (
                        <div className="mt-4">
                          <p className="text-emerald-50/60 text-sm mb-2">
                            Attached media
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {q.media.map((m) => (
                              <div
                                key={m.id}
                                className="rounded-xl overflow-hidden border border-white/10"
                              >
                                {m.kind === "image" ? (
                                  <img
                                    src={m.signedUrl}
                                    alt=""
                                    className="h-40 w-full object-cover"
                                  />
                                ) : (
                                  <video
                                    src={m.signedUrl}
                                    className="h-40 w-full object-cover"
                                    controls
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Delete flow modal */}
      {deleting && (
        <>
          <div className="fixed inset-0 z-[95] bg-black/60" />
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0b1713]/95 p-5">
              <h4 className="text-emerald-100 font-semibold text-lg">
                Confirm delete
              </h4>
              <p className="mt-2 text-emerald-50/80 text-sm">
                Type the client’s name{" "}
                <span className="font-medium text-emerald-200">exactly</span> to
                enable delete.
              </p>
              <input
                value={confirmName}
                onChange={(e) => setConfirmName(e.target.value)}
                className="mt-3 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-emerald-50/90"
                placeholder="Client name"
              />
              <div className="mt-4 flex items-center justify-between">
                <button
                  onClick={() => {
                    setDeleting(null);
                    setConfirmName("");
                    setReallySure(false);
                  }}
                  className="rounded-lg border border-white/15 px-3 py-2 text-emerald-50/90 hover:bg-white/5"
                >
                  Cancel
                </button>

                {!reallySure ? (
                  <button
                    disabled={confirmName.trim() !== deleting.name.trim()}
                    onClick={() => setReallySure(true)}
                    className="rounded-lg px-4 py-2 bg-red-500/90 hover:bg-red-500 text-white disabled:opacity-50"
                  >
                    Enable Delete
                  </button>
                ) : (
                  <button
                    onClick={() => reallyDelete(deleting)}
                    className="rounded-lg px-4 py-2 bg-red-600 hover:bg-red-500 text-white"
                  >
                    Confirm Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

function Field({ k, v }) {
  return (
    <div className="flex">
      <span className="w-36 text-emerald-50/50">{k}</span>
      <span className="capitalize text-emerald-50/90">{v}</span>
    </div>
  );
}
