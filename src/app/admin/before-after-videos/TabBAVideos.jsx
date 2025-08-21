"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/browser";
import toast from "react-hot-toast";
import {
  FiUpload,
  FiSave,
  FiTrash2,
  FiEdit3,
  FiX,
  FiVideo,
  FiEye,
} from "react-icons/fi";

function uid() {
  return (
    globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`
  ).replace(/[^a-zA-Z0-9-]/g, "");
}

export default function TabBAVideos({ pushNotice }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState(null); // id to delete

  // form state
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [switchTime, setSwitchTime] = useState(27);
  const [rate, setRate] = useState(1.5);
  const [beforeFile, setBeforeFile] = useState(null);
  const [afterFile, setAfterFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("before_after_videos")
        .select("*")
        .order("created_at", { ascending: false });
      setLoading(false);
      if (error) {
        toast.error(error.message);
      } else {
        setRows(data || []);
      }
    })();
  }, []);

  async function handleCreate() {
    try {
      if (!title.trim()) return toast.error("Title is required");
      if (!beforeFile || !afterFile) return toast.error("Select both videos");

      setSaving(true);

      const beforeKey = `before/${uid()}-${beforeFile.name}`;
      const afterKey = `after/${uid()}-${afterFile.name}`;

      const up1 = await supabase.storage
        .from("ba-videos")
        .upload(beforeKey, beforeFile, {
          cacheControl: "3600",
          upsert: false,
          contentType: beforeFile.type || "video/mp4",
        });
      if (up1.error) throw up1.error;

      const up2 = await supabase.storage
        .from("ba-videos")
        .upload(afterKey, afterFile, {
          cacheControl: "3600",
          upsert: false,
          contentType: afterFile.type || "video/mp4",
        });
      if (up2.error) throw up2.error;

      const { data, error } = await supabase
        .from("before_after_videos")
        .insert({
          title,
          description: desc || null,
          before_path: beforeKey,
          after_path: afterKey,
          switch_time_seconds: Number(switchTime) || 0,
          playback_rate: Number(rate) || 1.0,
        })
        .select()
        .single();

      if (error) throw error;

      setRows((prev) => [data, ...prev]);
      setTitle("");
      setDesc("");
      setSwitchTime(27);
      setRate(1.5);
      setBeforeFile(null);
      setAfterFile(null);

      toast.success("Before/After video created");
      pushNotice?.({
        type: "info",
        title: "Before/After video created",
        body: data.title,
        meta: { kind: "ba_video", action: "insert", id: data.id },
      });
    } catch (e) {
      console.error(e);
      toast.error(e.message || "Failed to create video");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(row) {
    const { id, title, description, switch_time_seconds, playback_rate } = row;
    const { error, data } = await supabase
      .from("before_after_videos")
      .update({
        title,
        description,
        switch_time_seconds: Number(switch_time_seconds) || 0,
        playback_rate: Number(playback_rate) || 1.0,
      })
      .eq("id", id)
      .select()
      .single();
    if (error) return toast.error(error.message);
    setRows((prev) => prev.map((r) => (r.id === id ? data : r)));
    toast.success("Saved");
    pushNotice?.({
      type: "info",
      title: "Before/After video updated",
      body: data.title,
      meta: { kind: "ba_video", action: "update", id },
    });
  }

  async function handleDelete(id) {
    try {
      const row = rows.find((r) => r.id === id);
      if (!row) return setConfirm(null);
      // Delete DB row first (keeps storage keys in hand if this fails)
      const { error } = await supabase
        .from("before_after_videos")
        .delete()
        .eq("id", id);
      if (error) throw error;
      setRows((prev) => prev.filter((r) => r.id !== id));

      // Delete storage objects (best-effort)
      await supabase.storage
        .from("ba-videos")
        .remove([row.before_path, row.after_path]);

      toast.success("Deleted");
      pushNotice?.({
        type: "success",
        title: "Before/After video deleted",
        body: row.title,
        meta: { kind: "ba_video", action: "delete", id },
      });
    } catch (e) {
      toast.error(e.message || "Failed to delete");
    } finally {
      setConfirm(null);
    }
  }

  return (
    <div>
      {/* CREATE FORM */}
      <div className="rounded-2xl border border-white/10 bg-[#0b1713]/50 p-5 md:p-6 mb-8">
        <h3 className="flex items-center gap-2 text-emerald-100 font-semibold mb-4">
          <FiVideo /> Add Before & After Video
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="block text-sm text-emerald-50/80">
              Title
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-emerald-50"
                placeholder="Lawn Transformation"
              />
            </label>
            <label className="block text-sm text-emerald-50/80">
              Description
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={5}
                className="mt-1 w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-emerald-50"
                placeholder="Write a short story about the transformation…"
              />
            </label>
          </div>

          <div className="space-y-3">
            <label className="block text-sm text-emerald-50/80">
              Before video (.mp4)
              <input
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                onChange={(e) => setBeforeFile(e.target.files?.[0] || null)}
                className="mt-1 w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-emerald-50"
              />
            </label>
            <label className="block text-sm text-emerald-50/80">
              After video (.mp4)
              <input
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                onChange={(e) => setAfterFile(e.target.files?.[0] || null)}
                className="mt-1 w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-emerald-50"
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm text-emerald-50/80">
                Switch second
                <input
                  type="number"
                  min={0}
                  value={switchTime}
                  onChange={(e) => setSwitchTime(e.target.value)}
                  className="mt-1 w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-emerald-50"
                />
              </label>
              <label className="block text-sm text-emerald-50/80">
                Playback rate
                <input
                  type="number"
                  step="0.1"
                  min="0.25"
                  max="3"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  className="mt-1 w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-emerald-50"
                />
              </label>
            </div>

            <button
              onClick={handleCreate}
              disabled={saving}
              className="mt-2 inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2 text-emerald-100 hover:bg-white/5 disabled:opacity-60"
            >
              <FiUpload /> {saving ? "Uploading…" : "Create"}
            </button>
          </div>
        </div>
      </div>

      {/* LIST / EDIT */}
      <div className="space-y-5">
        {loading ? null : rows.length === 0 ? (
          <div className="text-emerald-50/70">No before/after videos yet.</div>
        ) : (
          rows.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl border border-white/10 bg-[#0b1713]/40 p-4 md:p-5"
            >
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="block text-sm text-emerald-50/80">
                    Title
                    <input
                      value={r.title}
                      onChange={(e) =>
                        setRows((prev) =>
                          prev.map((x) =>
                            x.id === r.id ? { ...x, title: e.target.value } : x
                          )
                        )
                      }
                      className="mt-1 w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-emerald-50"
                    />
                  </label>
                  <label className="block text-sm text-emerald-50/80">
                    Description
                    <textarea
                      rows={5}
                      value={r.description || ""}
                      onChange={(e) =>
                        setRows((prev) =>
                          prev.map((x) =>
                            x.id === r.id
                              ? { ...x, description: e.target.value }
                              : x
                          )
                        )
                      }
                      className="mt-1 w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-emerald-50"
                    />
                  </label>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block text-sm text-emerald-50/80">
                      Switch second
                      <input
                        type="number"
                        min={0}
                        value={r.switch_time_seconds}
                        onChange={(e) =>
                          setRows((prev) =>
                            prev.map((x) =>
                              x.id === r.id
                                ? { ...x, switch_time_seconds: e.target.value }
                                : x
                            )
                          )
                        }
                        className="mt-1 w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-emerald-50"
                      />
                    </label>
                    <label className="block text-sm text-emerald-50/80">
                      Playback rate
                      <input
                        type="number"
                        step="0.1"
                        min="0.25"
                        max="3"
                        value={r.playback_rate}
                        onChange={(e) =>
                          setRows((prev) =>
                            prev.map((x) =>
                              x.id === r.id
                                ? { ...x, playback_rate: e.target.value }
                                : x
                            )
                          )
                        }
                        className="mt-1 w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-emerald-50"
                      />
                    </label>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleUpdate(r)}
                      className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-emerald-100 hover:bg-white/5"
                    >
                      <FiSave /> Save
                    </button>
                    <button
                      onClick={() => setConfirm(r.id)}
                      className="inline-flex items-center gap-1 rounded-lg border
                       border-white/15 px-1 py-2 text-red-300 hover:bg-white/5"
                    >
                      <FiTrash2 /> Delete
                    </button>
                    <a
                      href={
                        supabase.storage
                          .from("ba-videos")
                          .getPublicUrl(r.before_path).data.publicUrl
                      }
                      target="_blank"
                      className="inline-flex items-center gap-2 text-emerald-200 underline"
                    >
                      <FiEye /> Before
                    </a>
                    <a
                      href={
                        supabase.storage
                          .from("ba-videos")
                          .getPublicUrl(r.after_path).data.publicUrl
                      }
                      target="_blank"
                      className="inline-flex items-center gap-2 text-emerald-200 underline"
                    >
                      <FiEye /> After
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete confirm modal */}
      {confirm && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0b1713]/95 p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-emerald-100">
                Delete this before/after video?
              </h3>
              <button
                onClick={() => setConfirm(null)}
                className="p-2 rounded-lg hover:bg-white/5 text-emerald-50/80"
                aria-label="Close"
              >
                <FiX />
              </button>
            </div>
            <p className="mt-3 text-emerald-50/80 text-sm">
              This removes the database row and its two files from storage.
            </p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                onClick={() => setConfirm(null)}
                className="rounded-lg border border-white/15 px-3 py-2 text-emerald-50/90 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirm)}
                className="rounded-lg px-4 py-2 bg-red-500/90 hover:bg-red-500 text-white font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
