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
  FiChevronDown,
  FiVideo,
  FiImage,
  FiSend, // ← NEW (quotes tab + actions)
  FiRefreshCw, // ← NEW (quotes refresh)
} from "react-icons/fi";

// Panels
import Inbox from "./Inbox";
import TabAddBA from "../beforeafter/TabAddBA";
import BAEditor from "../beforeafter/BAEditor";
import TabTestimonials from "../testimonials/TabTestimonials";
import TabBAVideos from "../before-after-videos/TabBAVideos";
import TabGeneralProjects from "../general-projects/TabGeneralProjects";

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
  const [activeTab, setActiveTab] = useState("see"); // see | add | videos | gprojects | inbox | testimonials | quotes

  // bell / notifications
  const [notices, setNotices] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [deleteAllOpen, setDeleteAllOpen] = useState(false);
  const [focusMessageId, setFocusMessageId] = useState(null);
  const notifRef = useRef(null);

  // ▼ split-button dropdown for Add
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const addRef = useRef(null);
  const addGroupActive = activeTab === "add" || activeTab === "see";
  // ▲

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

  // ---- realtime bell (existing) + QUOTES (added) ----
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

      // BA projects
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

      // Testimonials
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

      // Before/After Videos
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "before_after_videos" },
        ({ new: v }) => {
          const key = `bav-ins:${v.id}`;
          if (!guard(key)) return;
          pushNotice({
            type: "info",
            title: "Before/After video created",
            body: v.title || "Untitled",
            meta: { kind: "ba_video", action: "insert", id: v.id },
          });
          toast.success("Before/After video created");
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "before_after_videos" },
        ({ new: v }) => {
          const key = `bav-upd:${v.id}`;
          if (!guard(key)) return;
          pushNotice({
            type: "info",
            title: "Before/After video updated",
            body: v.title || "Untitled",
            meta: { kind: "ba_video", action: "update", id: v.id },
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "before_after_videos" },
        ({ old: v }) => {
          const key = `bav-del:${v.id}`;
          if (!guard(key)) return;
          pushNotice({
            type: "success",
            title: "Before/After video deleted",
            body: v?.title || "Untitled",
            meta: { kind: "ba_video", action: "delete", id: v?.id },
          });
          toast.success("Before/After video deleted");
        }
      )

      // ===== General Projects =====
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "general_projects" },
        ({ new: g }) => {
          const key = `gproj-ins:${g.id}`;
          if (!guard(key)) return;
          pushNotice({
            type: "info",
            title: "General project created",
            body: g.title || "Untitled",
            meta: { kind: "gproj", action: "insert", id: g.id },
          });
          toast.success("General project created");
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "general_projects" },
        ({ new: g }) => {
          const key = `gproj-upd:${g.id}`;
          if (!guard(key)) return;
          pushNotice({
            type: "info",
            title: "General project updated",
            body: g.title || "Untitled",
            meta: { kind: "gproj", action: "update", id: g.id },
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "general_projects" },
        ({ old: g }) => {
          const key = `gproj-del:${g.id}`;
          if (!guard(key)) return;
          pushNotice({
            type: "success",
            title: "General project deleted",
            body: g?.title || "Untitled",
            meta: { kind: "gproj", action: "delete", id: g?.id },
          });
          toast.success("General project deleted");
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "general_project_media" },
        ({ new: m }) => {
          const key = `gpm-ins:${m.id}`;
          if (!guard(key)) return;
          pushNotice({
            type: "info",
            title: "Project media added",
            body: m.kind?.toUpperCase?.() || "Media",
            meta: {
              kind: "gproj_media",
              action: "insert",
              id: m.id,
              project_id: m.project_id,
            },
          });
          toast.success("Project media added");
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "general_project_media" },
        ({ new: m }) => {
          const key = `gpm-upd:${m.id}`;
          if (!guard(key)) return;
          pushNotice({
            type: "info",
            title: "Project media updated",
            body: m.kind?.toUpperCase?.() || "Media",
            meta: {
              kind: "gproj_media",
              action: "update",
              id: m.id,
              project_id: m.project_id,
            },
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "general_project_media" },
        ({ old: m }) => {
          const key = `gpm-del:${m.id}`;
          if (!guard(key)) return;
          pushNotice({
            type: "success",
            title: "Project media deleted",
            body: m?.kind?.toUpperCase?.() || "Media",
            meta: {
              kind: "gproj_media",
              action: "delete",
              id: m?.id,
              project_id: m?.project_id,
            },
          });
          toast.success("Project media deleted");
        }
      )

      // ===== QUOTES (NEW) =====
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "quotes" },
        ({ new: q }) => {
          const key = `quote-ins:${q.id}`;
          if (!guard(key)) return;
          pushNotice({
            type: "info",
            title: `New quote from ${q.name || q.email || "Client"}`,
            body: `${q.service} — ${q.city || "Unknown city"}`,
            meta: { kind: "quote", action: "insert", id: q.id },
          });
          toast.success("New quote submitted");
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "quotes" },
        ({ new: q, old }) => {
          const key = `quote-upd:${q.id}`;
          if (!guard(key)) return;
          if (old?.quote_sent !== q.quote_sent) {
            pushNotice({
              type: "success",
              title: q.quote_sent
                ? "Quote marked as sent"
                : "Quote moved back to New",
              body: `${q.name} — ${q.service}`,
              meta: { kind: "quote", action: "update", id: q.id },
            });
            toast.success(
              q.quote_sent ? "Quote marked as sent" : "Quote moved back to New"
            );
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "quotes" },
        ({ old: q }) => {
          const key = `quote-del:${q?.id}`;
          if (!guard(key)) return;
          pushNotice({
            type: "success",
            title: "Quote deleted",
            body: `${q?.name || "Client"} — ${q?.service || ""}`,
            meta: { kind: "quote", action: "delete", id: q?.id },
          });
        }
      )
      // ===== end QUOTES =====

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
      if (addMenuOpen && addRef.current && !addRef.current.contains(e.target)) {
        setAddMenuOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        setNotifOpen(false);
        setDeleteAllOpen(false);
        setAddMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [notifOpen, addMenuOpen]);

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
    <section className="py-20 px-4 sm:px-6 md:px-16 mt-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-anton bg-gradient-to-br from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-emerald-50/80">
              Manage before/after projects, reviews, messages, and quotes.
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
          {/* “See / Edit / Delete” is inside Add */}
          <div className="relative" ref={addRef}>
            <div className="inline-flex">
              <button
                onClick={() => {
                  setActiveTab("add");
                  setAddMenuOpen(false);
                }}
                className={`flex items-center gap-2 rounded-l-xl border px-3 py-2 transition ${
                  addGroupActive
                    ? "border-emerald-300/40 bg-white/5 text-emerald-200"
                    : "border-white/10 text-emerald-50/80 hover:bg-white/5"
                }`}
              >
                <FiPlusCircle className="h-4 w-4" /> Add Before & After
              </button>
              <button
                onClick={() => setAddMenuOpen((v) => !v)}
                aria-label="More options"
                className={`rounded-r-xl border px-2 py-2 transition ${
                  addGroupActive
                    ? "border-emerald-300/40 bg-white/5 text-emerald-200"
                    : "border-white/10 text-emerald-50/80 hover:bg-white/5"
                }`}
              >
                <FiChevronDown className="h-4 w-4" />
              </button>
            </div>

            {addMenuOpen && (
              <div className="absolute left-0 mt-2 w-64 z-40 rounded-2xl border border-white/10 bg-[#0b1713]/95 backdrop-blur-xl shadow-xl">
                <button
                  onClick={() => {
                    setActiveTab("see");
                    setAddMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-white/5 flex items-center gap-2 text-emerald-50/90"
                >
                  <FiEdit3 className="h-4 w-4" /> See / Edit / Delete
                </button>
              </div>
            )}
          </div>

          {/* Videos tab */}
          <button
            onClick={() => setActiveTab("videos")}
            className={`flex items-center gap-2 rounded-xl border px-3 py-2 transition ${
              activeTab === "videos"
                ? "border-emerald-300/40 bg-white/5 text-emerald-200"
                : "border-white/10 text-emerald-50/80 hover:bg-white/5"
            }`}
          >
            <FiVideo className="h-4 w-4" /> Videos
          </button>

          {/* General Projects tab */}
          <button
            onClick={() => setActiveTab("gprojects")}
            className={`flex items-center gap-2 rounded-xl border px-3 py-2 transition ${
              activeTab === "gprojects"
                ? "border-emerald-300/40 bg-white/5 text-emerald-200"
                : "border-white/10 text-emerald-50/80 hover:bg-white/5"
            }`}
          >
            <FiImage className="h-4 w-4" /> General Projects
          </button>

          {/* Quotes tab (NEW) */}
          <button
            onClick={() => setActiveTab("quotes")}
            className={`flex items-center gap-2 rounded-xl border px-3 py-2 transition ${
              activeTab === "quotes"
                ? "border-emerald-300/40 bg-white/5 text-emerald-200"
                : "border-white/10 text-emerald-50/80 hover:bg-white/5"
            }`}
          >
            <FiSend className="h-4 w-4" /> Get Quotes
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
        <div className="rounded-2xl border border-white/10 bg-[#0b1713]/60 backdrop-blur-xl p-4 sm:p-6">
          {activeTab === "see" && <BAEditor pushNotice={pushNotice} />}
          {activeTab === "add" && <TabAddBA pushNotice={pushNotice} />}
          {activeTab === "videos" && <TabBAVideos pushNotice={pushNotice} />}
          {activeTab === "gprojects" && (
            <TabGeneralProjects pushNotice={pushNotice} />
          )}
          {activeTab === "quotes" && <TabQuotes />}
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

/* -----------------------------
   Quotes Tab (inline component)
   ----------------------------- */
function TabQuotes() {
  const [tab, setTab] = useState("new"); // new | sent | all
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [deleting, setDeleting] = useState(null); // quote row
  const [confirmName, setConfirmName] = useState("");
  const [reallySure, setReallySure] = useState(false);

  const fetchRows = async () => {
    setLoading(true);
    try {
      let q = supabase
        .from("quotes")
        .select("*")
        .order("created_at", { ascending: false });
      if (tab === "new") q = q.eq("status", "new");
      if (tab === "sent") q = q.eq("status", "sent");

      const { data, error } = await q;
      if (error) throw error;

      const ids = data.map((d) => d.id);
      let mediaByQuote = {};
      if (ids.length) {
        const { data: media } = await supabase
          .from("quote_media")
          .select("*")
          .in("quote_id", ids)
          .order("sort_order", { ascending: true });

        if (media?.length) {
          const signed = await Promise.all(
            media.map(async (m) => {
              const { data: urlData } = await supabase.storage
                .from("quote-media")
                .createSignedUrl(m.path, 60 * 15);
              return { ...m, signedUrl: urlData?.signedUrl || null };
            })
          );
          for (const m of signed) (mediaByQuote[m.quote_id] ||= []).push(m);
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
    const ch = supabase
      .channel("quotes-admin-inline")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "quotes" },
        () => fetchRows()
      )
      .subscribe();
    return () => supabase.removeChannel(ch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

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
    <section>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex gap-2">
          {[
            ["new", "New"],
            ["sent", "Quote Sent"],
            ["all", "All"],
          ].map(([k, label]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`rounded-xl border px-3 py-2 ${
                tab === k
                  ? "border-emerald-300/40 bg-white/5 text-emerald-200"
                  : "border-white/10 text-emerald-50/80 hover:bg-white/5"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          onClick={fetchRows}
          className="rounded-xl border border-white/15 px-3 py-2 text-emerald-50/90 hover:bg-white/5 flex items-center gap-2"
          title="Refresh"
        >
          <FiRefreshCw /> Refresh
        </button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0b1713]/60">
        {loading ? (
          <div className="p-6 text-emerald-50/80">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="p-6 text-emerald-50/80">No quotes.</div>
        ) : (
          <ul className="divide-y divide-white/5">
            {rows.map((q) => (
              <li key={q.id} className="p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-emerald-100 font-semibold break-words">
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

                  <div className="flex flex-wrap items-center gap-2">
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
