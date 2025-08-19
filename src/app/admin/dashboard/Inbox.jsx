"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { supabase } from "@/lib/supabase/browser";
import toast from "react-hot-toast";
import {
  FiRefreshCcw,
  FiEye,
  FiTrash2,
  FiCheckCircle,
  FiX,
} from "react-icons/fi";

/* Light portal for modals */
function Portal({ children }) {
  const [mount, setMount] = useState(null);
  useEffect(() => {
    const el = document.createElement("div");
    document.body.appendChild(el);
    setMount(el);
    return () => document.body.removeChild(el);
  }, []);
  if (!mount) return null;
  return createPortal(children, mount);
}

const snip = (s, n = 90) => (!s ? "" : s.length <= n ? s : s.slice(0, n) + "…");

export default function Inbox({
  pushNotice,
  onMessageRead,
  focusMessageId,
  clearFocus, // <-- called to clear bell focus so modal can close
}) {
  const [msgs, setMsgs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openMsg, setOpenMsg] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  const unreadCount = useMemo(() => msgs.filter((m) => !m.read).length, [msgs]);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });
    setLoading(false);
    if (error) return toast.error(error.message);
    setMsgs(data || []);
  }, []);

  useEffect(() => {
    load();

    /* realtime stream */
    const channel = supabase
      .channel("realtime:messages:inbox")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (p) => {
          setMsgs((cur) => [p.new, ...cur]);
          // toast + bell notice on new message
          pushNotice?.({
            type: "info",
            title: `New message from ${p.new.name || p.new.email || "Visitor"}`,
            body: p.new.subject
              ? `${p.new.subject} — ${snip(p.new.body)}`
              : snip(p.new.body),
            meta: { kind: "message", action: "insert", id: p.new.id },
          });
          toast.success("New message received");
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages" },
        (p) => setMsgs((cur) => cur.map((m) => (m.id === p.new.id ? p.new : m)))
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "messages" },
        (p) => setMsgs((cur) => cur.filter((m) => m.id !== p.old.id))
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [load, pushNotice]);

  /* Open a specific message requested by the bell, then clear focus */
  useEffect(() => {
    if (!focusMessageId) return;
    const m = msgs.find((x) => x.id === focusMessageId);
    if (m) {
      setOpenMsg(m);
      clearFocus?.();
    }
  }, [focusMessageId, msgs, clearFocus]);

  /* Esc closes topmost modal */
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") {
        if (pendingDelete) setPendingDelete(null);
        else if (openMsg) setOpenMsg(null);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openMsg, pendingDelete]);

  async function markRead(id) {
    const { error } = await supabase
      .from("messages")
      .update({ read: true })
      .eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Marked as read");
      onMessageRead?.(id); // sync bell
      setMsgs((cur) =>
        cur.map((x) => (x.id === id ? { ...x, read: true } : x))
      );
    }
  }

  async function markAllRead() {
    const ids = msgs.filter((m) => !m.read).map((m) => m.id);
    if (!ids.length) return;
    const { error } = await supabase
      .from("messages")
      .update({ read: true })
      .in("id", ids);
    if (error) toast.error(error.message);
    else {
      toast.success("All marked read");
      onMessageRead?.("__ALL__");
      setMsgs((cur) => cur.map((x) => ({ ...x, read: true })));
    }
  }

  async function confirmDelete(id) {
    const { error, count } = await supabase
      .from("messages")
      .delete({ count: "exact" })
      .eq("id", id);
    if (error) {
      toast.error(error.message);
      pushNotice?.({
        type: "error",
        title: "Delete failed",
        body: error.message,
      });
      return false;
    }
    if (!count) {
      toast.error("Delete was blocked.");
      pushNotice?.({
        type: "error",
        title: "Delete blocked",
        body: "No rows deleted (RLS?).",
      });
      return false;
    }
    toast.success("Message deleted");
    pushNotice?.({
      type: "success",
      title: "Message deleted",
      meta: { kind: "message", action: "delete", id },
    });
    return true;
  }

  return (
    <div className="space-y-4">
      {/* header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold text-emerald-100">Inbox</h2>
          {unreadCount > 0 && (
            <span className="text-xs rounded-full bg-emerald-400/90 text-black px-2 py-0.5">
              {unreadCount} new
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={markAllRead}
            className="rounded-lg border border-white/15 px-3 py-2 text-emerald-50/90 hover:bg-white/5 flex items-center gap-2"
            title="Mark all read"
          >
            <FiCheckCircle /> Mark all read
          </button>
          <button
            onClick={load}
            disabled={loading}
            className="rounded-lg border border-white/15 px-3 py-2 text-emerald-50/90 hover:bg-white/5 flex items-center gap-2 disabled:opacity-60"
            title="Refresh"
          >
            <FiRefreshCcw className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* list */}
      {!msgs.length ? (
        <p className="text-emerald-50/70">No messages yet.</p>
      ) : (
        <ul className="space-y-4">
          {msgs.map((m) => (
            <li
              key={m.id}
              className="rounded-xl border border-white/10 p-4 bg-black/25"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-emerald-50/70">
                    <span className="font-medium text-emerald-100">
                      {m.name || "Message"}
                    </span>{" "}
                    • {m.email?.toLowerCase()} {m.phone ? `• ${m.phone}` : ""} •{" "}
                    {new Date(m.created_at).toLocaleString()}
                  </p>
                  <p className="mt-2 text-emerald-50/90">
                    {m.subject ? (
                      <span className="font-medium">{m.subject}: </span>
                    ) : null}
                    {m.body}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {!m.read && (
                    <span className="text-[10px] uppercase tracking-wide bg-emerald-500/90 text-black px-2 py-1 rounded">
                      New
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => setOpenMsg(m)}
                  className="rounded-lg border border-white/15 px-3 py-2 text-emerald-50/90 hover:bg-white/5 flex items-center gap-2"
                >
                  <FiEye /> Review
                </button>

                <button
                  onClick={() => markRead(m.id)}
                  className="rounded-lg border border-white/15 px-3 py-2 text-emerald-50/90 hover:bg-white/5"
                >
                  Mark read
                </button>

                <button
                  onClick={() => setPendingDelete(m)}
                  className="rounded-lg border border-red-400/25 px-3 py-2 text-red-300 hover:bg-red-500/10 flex items-center gap-2"
                >
                  <FiTrash2 /> Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Review Modal */}
      {openMsg && (
        <Portal>
          <div
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setOpenMsg(null)}
          >
            <div
              className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0b1713]/90 p-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-emerald-100">
                  Message
                </h3>
                <button
                  onClick={() => setOpenMsg(null)}
                  className="p-2 rounded-lg hover:bg-white/5 text-emerald-50/80"
                  aria-label="Close"
                >
                  <FiX />
                </button>
              </div>

              <div className="mt-3 space-y-1 text-sm text-emerald-50/80">
                <p>
                  <span className="font-medium">{openMsg.name}</span> •{" "}
                  {openMsg.email?.toLowerCase()}{" "}
                  {openMsg.phone ? `• ${openMsg.phone}` : ""}
                </p>
                <p>{new Date(openMsg.created_at).toLocaleString()}</p>
                {openMsg.subject && (
                  <p className="mt-2 text-emerald-50/90">
                    <span className="font-medium">Subject:</span>{" "}
                    {openMsg.subject}
                  </p>
                )}
                <p className="mt-3 whitespace-pre-wrap text-emerald-50/95">
                  {openMsg.body}
                </p>
              </div>

              <div className="mt-5 flex items-center justify-end gap-2">
                {!openMsg.read && (
                  <button
                    onClick={async () => {
                      await markRead(openMsg.id);
                      setOpenMsg({ ...openMsg, read: true });
                    }}
                    className="rounded-lg border border-white/15 px-3 py-2 text-emerald-50/90 hover:bg-white/5"
                  >
                    Mark read
                  </button>
                )}
                <button
                  onClick={() => setPendingDelete(openMsg)}
                  className="rounded-lg border border-red-400/25 px-3 py-2 text-red-300 hover:bg-red-500/10 flex items-center gap-2"
                >
                  <FiTrash2 /> Delete
                </button>
                <button
                  onClick={() => setOpenMsg(null)}
                  className="rounded-lg border border-white/15 px-3 py-2 text-emerald-50/90 hover:bg-white/5"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}

      {/* Delete Confirm Modal */}
      {pendingDelete && (
        <Portal>
          <div
            className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setPendingDelete(null)}
          >
            <div
              className="w/full max-w-md rounded-2xl border border-white/10 bg-[#0b1713]/90 p-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-emerald-100">
                  Delete message?
                </h3>
                <button
                  onClick={() => setPendingDelete(null)}
                  className="p-2 rounded-lg hover:bg-white/5 text-emerald-50/80"
                  aria-label="Close"
                >
                  <FiX />
                </button>
              </div>

              <p className="mt-3 text-emerald-50/80 text-sm">
                This action cannot be undone. Are you sure you want to
                permanently delete this message from{" "}
                <span className="font-medium">
                  {pendingDelete.email?.toLowerCase()}
                </span>
                ?
              </p>

              <div className="mt-5 flex items-center justify-end gap-2">
                <button
                  onClick={() => setPendingDelete(null)}
                  className="rounded-lg border border-white/15 px-3 py-2 text-emerald-50/90 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    const id = pendingDelete.id;
                    setPendingDelete(null);
                    const ok = await confirmDelete(id);
                    if (ok && openMsg?.id === id) setOpenMsg(null);
                  }}
                  className="rounded-lg px-4 py-2 bg-red-500/90 hover:bg-red-500 text-white font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
