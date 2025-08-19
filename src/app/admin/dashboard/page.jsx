"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/browser";
import toast from "react-hot-toast";
import {
  FiLogOut,
  FiBell,
  FiInbox,
  FiCheckCircle,
  FiX,
  FiEye,
  FiTrash2,
  FiEdit3,
  FiPlusCircle,
  FiStar,
} from "react-icons/fi";

// Panels
import Inbox from "./Inbox";
import TabAddBA from "../beforeafter/TabAddBA";
import BAEditor from "../beforeafter/BAEditor";
import TabTestimonials from "../testimonials/TabTestimonials";

const snip = (s, n = 90) => (!s ? "" : s.length <= n ? s : s.slice(0, n) + "…");

// throttle duplicate notices to the bell
const seen = new Map();
const guard = (key, ms = 1500) => {
  const now = Date.now();
  const last = seen.get(key) || 0;
  if (now - last < ms) return false;
  seen.set(key, now);
  return true;
};

export default function AdminDashboard() {
  const router = useRouter();

  const [session, setSession] = useState(null);
  const [activeTab, setActiveTab] = useState("see"); // see | add | inbox | testimonials

  // bell / notifications
  const [notices, setNotices] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [deleteAllOpen, setDeleteAllOpen] = useState(false);
  const [focusMessageId, setFocusMessageId] = useState(null);
  const notifRef = useRef(null);

  // ---- auth gate ----
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      if (!data.session) {
        toast.error("Admin access only");
        router.replace("/admin");
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, s) => {
      setSession(s);
      if (!s) router.replace("/admin");
    });
    return () => sub?.subscription?.unsubscribe();
  }, [router]);

  // ---- realtime bell (contact messages + BA projects + testimonials) ----
  useEffect(() => {
    const ch = supabase
      .channel("admin-bell")
      // contact messages
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        ({ new: m }) => {
          const key = `msg-ins:${m.id}`;
          if (!guard(key)) return;
          pushNotice({
            type: "info",
            title: `New message from ${m.name || m.email || "Visitor"}`,
            body: m.subject ? `${m.subject} — ${snip(m.body)}` : snip(m.body),
            meta: { kind: "message", action: "insert", id: m.id },
          });
          toast.success("New message received");
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages" },
        ({ new: m }) => {
          if (m.read) {
            setNotices((prev) =>
              prev.map((n) =>
                n.meta?.kind === "message" && n.meta?.id === m.id
                  ? { ...n, read: true }
                  : n
              )
            );
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "messages" },
        ({ old: m }) => {
          const key = `msg-del:${m.id}`;
          if (!guard(key)) return;
          pushNotice({
            type: "success",
            title: `Message deleted (${m.name || m.email || "Visitor"})`,
            body: m.subject ? `${m.subject} — ${snip(m.body)}` : snip(m.body),
            meta: { kind: "message", action: "delete", id: m.id },
          });
        }
      )

      // BA projects (projects table)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "before_after_projects" },
        ({ new: p }) => {
          const key = `proj-ins:${p.id}`;
          if (!guard(key)) return;
          pushNotice({
            type: "info",
            title: "New Before & After project created",
            body: p.title || "Untitled project",
            meta: { kind: "project", action: "insert", id: p.id },
          });
          toast.success("Project created");
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "before_after_projects" },
        ({ new: p }) => {
          const key = `proj-upd:${p.id}`;
          if (!guard(key)) return;
          pushNotice({
            type: "info",
            title: "Project updated",
            body: p.title || "Untitled project",
            meta: { kind: "project", action: "update", id: p.id },
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "before_after_projects" },
        ({ old: p }) => {
          const key = `proj-del:${p.id}`;
          if (!guard(key)) return;
          pushNotice({
            type: "success",
            title: "Project deleted",
            body: p.title || "Untitled project",
            meta: { kind: "project", action: "delete", id: p.id },
          });
          toast.success("Project deleted");
        }
      )

      // Testimonials (reviews)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "testimonials" },
        ({ new: t }) => {
          const key = `testi-ins:${t.id}`;
          if (!guard(key)) return;
          pushNotice({
            type: "info",
            title: "New review submitted",
            body: `${t.name || "Anonymous"} — ${snip(t.text, 60)}`,
            meta: { kind: "testimonial", action: "insert", id: t.id },
          });
          toast.success("New review submitted");
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "testimonials" },
        ({ new: t }) => {
          const key = `testi-upd:${t.id}`;
          if (!guard(key)) return;
          pushNotice({
            type: "success",
            title: t.approved ? "Review approved" : "Review updated",
            body: t.name || "Anonymous",
            meta: { kind: "testimonial", action: "update", id: t.id },
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "testimonials" },
        ({ old: t }) => {
          const key = `testi-del:${t.id}`;
          if (!guard(key)) return;
          pushNotice({
            type: "success",
            title: "Review deleted",
            body: t?.name || "Anonymous",
            meta: { kind: "testimonial", action: "delete", id: t?.id },
          });
        }
      )
      .subscribe();

    return () => supabase.removeChannel(ch);
  }, []);

  // popover close on outside/ESC
  useEffect(() => {
    const onDown = (e) => {
      if (
        notifOpen &&
        notifRef.current &&
        !notifRef.current.contains(e.target)
      ) {
        setNotifOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        setNotifOpen(false);
        setDeleteAllOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [notifOpen]);

  // bell helpers
  const pushNotice = (n) =>
    setNotices((prev) => [
      {
        id: crypto.randomUUID(),
        ts: new Date().toISOString(),
        read: false,
        meta: {},
        ...n,
      },
      ...prev,
    ]);

  const markOneRead = (id) =>
    setNotices((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  const markAllRead = () =>
    setNotices((prev) => prev.map((n) => ({ ...n, read: true })));
  const deleteAll = () => setNotices([]);

  // called by Inbox when a message is marked read
  const onMessageRead = (id) =>
    setNotices((prev) =>
      prev.map((n) =>
        n.meta?.kind === "message" && n.meta?.id === id
          ? { ...n, read: true }
          : n
      )
    );

  const unreadCount = useMemo(
    () => notices.filter((n) => !n.read).length,
    [notices]
  );

  if (!session) return null;

  return (
    <section className="py-20 px-6 md:px-16">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-anton bg-gradient-to-br from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-emerald-50/80">
              Manage before/after projects, reviews, and messages.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen((v) => !v)}
                className="relative rounded-xl border border-white/15 px-3 py-2 text-emerald-50/90 hover:bg-white/5 flex items-center gap-2"
                title="Notifications"
              >
                <FiBell />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 text-xs bg-emerald-400 text-black rounded-full px-1.5 py-0.5">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 z-50 rounded-2xl border border-white/10 bg-[#0b1713]/95 backdrop-blur-xl shadow-xl">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                    <div className="text-emerald-100 font-semibold">
                      Notifications
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={markAllRead}
                        className="flex items-center gap-1 text-emerald-50/80 hover:text-emerald-200 text-sm"
                        title="Mark all read"
                      >
                        <FiCheckCircle className="h-4 w-4" /> Read all
                      </button>
                      <button
                        onClick={() => setDeleteAllOpen(true)}
                        className="flex items-center gap-1 text-emerald-50/70 hover:text-red-300 text-sm"
                        title="Delete all notifications"
                      >
                        <FiTrash2 className="h-4 w-4" /> Delete all
                      </button>
                    </div>
                  </div>

                  <ul className="max-h-80 overflow-y-auto divide-y divide-white/5">
                    {notices.length === 0 ? (
                      <li className="px-4 py-6 text-sm text-emerald-50/70">
                        No notifications.
                      </li>
                    ) : (
                      notices.map((n) => (
                        <li key={n.id} className="px-4 py-3">
                          <div className="flex items-start gap-3">
                            <div className="flex-1">
                              <p
                                className={`text-sm font-medium ${
                                  n.read
                                    ? "text-emerald-50/70"
                                    : "text-emerald-100"
                                }`}
                              >
                                {n.title || "Notification"}
                              </p>
                              {n.body ? (
                                <p
                                  className={`text-xs mt-0.5 ${
                                    n.read
                                      ? "text-emerald-50/50"
                                      : "text-emerald-50/80"
                                  }`}
                                >
                                  {n.body}
                                </p>
                              ) : null}
                              <p className="text-[11px] text-emerald-50/50 mt-1">
                                {new Date(n.ts).toLocaleString()}
                              </p>
                            </div>

                            <div className="flex items-center gap-2 mt-0.5">
                              {n.meta?.kind === "message" && n.meta?.id && (
                                <button
                                  onClick={() => {
                                    setActiveTab("inbox");
                                    setFocusMessageId(n.meta.id);
                                    setNotifOpen(false);
                                  }}
                                  className="rounded-md border border-white/15 p-1.5 hover:bg-white/10 text-emerald-200"
                                  title="See message"
                                  aria-label="See message"
                                >
                                  <FiEye className="h-4 w-4" />
                                </button>
                              )}
                              {!n.read && (
                                <button
                                  onClick={() => markOneRead(n.id)}
                                  className="rounded-md border border-white/15 p-1.5 hover:bg-white/10 text-emerald-200"
                                  title="Mark as read"
                                  aria-label="Mark as read"
                                >
                                  <FiCheckCircle className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              )}
            </div>

            <button
              onClick={async () => {
                await supabase.auth.signOut();
                toast.success("Signed out");
                router.replace("/admin");
              }}
              className="rounded-xl border border-white/15 px-3 py-2 text-emerald-50/90 hover:bg-white/5 flex items-center gap-2"
              title="Sign out"
            >
              <FiLogOut /> <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex w-full flex-wrap gap-2">
          <button
            onClick={() => setActiveTab("see")}
            className={`flex items-center gap-2 rounded-xl border px-3 py-2 transition ${
              activeTab === "see"
                ? "border-emerald-300/40 bg-white/5 text-emerald-200"
                : "border-white/10 text-emerald-50/80 hover:bg-white/5"
            }`}
          >
            <FiEdit3 className="h-4 w-4" /> See / Edit / Delete
          </button>

          <button
            onClick={() => setActiveTab("add")}
            className={`flex items-center gap-2 rounded-xl border px-3 py-2 transition ${
              activeTab === "add"
                ? "border-emerald-300/40 bg-white/5 text-emerald-200"
                : "border-white/10 text-emerald-50/80 hover:bg-white/5"
            }`}
          >
            <FiPlusCircle className="h-4 w-4" /> Add Before & After
          </button>

          <button
            onClick={() => setActiveTab("inbox")}
            className={`flex items-center gap-2 rounded-xl border px-3 py-2 transition ${
              activeTab === "inbox"
                ? "border-emerald-300/40 bg-white/5 text-emerald-200"
                : "border-white/10 text-emerald-50/80 hover:bg-white/5"
            }`}
          >
            <FiInbox className="h-4 w-4" /> Inbox
          </button>

          <button
            onClick={() => setActiveTab("testimonials")}
            className={`flex items-center gap-2 rounded-xl border px-3 py-2 transition ${
              activeTab === "testimonials"
                ? "border-emerald-300/40 bg-white/5 text-emerald-200"
                : "border-white/10 text-emerald-50/80 hover:bg-white/5"
            }`}
          >
            <FiStar className="h-4 w-4" /> Testimonials
          </button>
        </div>

        {/* Panels */}
        <div className="rounded-2xl border border-white/10 bg-[#0b1713]/60 backdrop-blur-xl p-6">
          {activeTab === "see" && <BAEditor pushNotice={pushNotice} />}
          {activeTab === "add" && <TabAddBA pushNotice={pushNotice} />}
          {activeTab === "inbox" && (
            <Inbox
              pushNotice={pushNotice}
              onMessageRead={onMessageRead}
              focusMessageId={focusMessageId}
            />
          )}
          {activeTab === "testimonials" && (
            <TabTestimonials pushNotice={pushNotice} />
          )}
        </div>
      </div>

      {/* Delete all confirm modal */}
      {deleteAllOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0b1713]/95 p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-emerald-100">
                Delete all notifications?
              </h3>
              <button
                onClick={() => setDeleteAllOpen(false)}
                className="p-2 rounded-lg hover:bg-white/5 text-emerald-50/80"
                aria-label="Close"
              >
                <FiX />
              </button>
            </div>
            <p className="mt-3 text-emerald-50/80 text-sm">
              This will permanently remove{" "}
              <span className="font-medium">all</span> notifications. You can’t
              undo this action.
            </p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                onClick={() => setDeleteAllOpen(false)}
                className="rounded-lg border border-white/15 px-3 py-2 text-emerald-50/90 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteAll();
                  setDeleteAllOpen(false);
                  toast.success("All notifications deleted");
                }}
                className="rounded-lg px-4 py-2 bg-red-500/90 hover:bg-red-500 text-white font-medium"
              >
                Delete all
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
