"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase/browser";
import toast from "react-hot-toast";
import {
  FiUpload,
  FiSave,
  FiTrash2,
  FiX,
  FiImage,
  FiVideo,
} from "react-icons/fi";

const uid = () =>
  (
    globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`
  ).replace(/[^a-zA-Z0-9-]/g, "");

const publicUrl = (path) =>
  supabase.storage.from("gp-media").getPublicUrl(path).data.publicUrl;

export default function TabGeneralProjects({ pushNotice }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState(null);

  // create-form state
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [imgs, setImgs] = useState([]);
  const [vids, setVids] = useState([]);
  const [creating, setCreating] = useState(false);

  const imgRef = useRef(null);
  const vidRef = useRef(null);

  // fetch projects + media
  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("general_projects")
        .select(
          `
          id, title, description, featured, created_at,
          media:general_project_media ( id, kind, path, sort_order, created_at )
        `
        )
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });
      setLoading(false);
      if (error) return toast.error(error.message);

      setRows(
        (data || []).map((r) => ({
          ...r,
          media: (r.media || []).sort(
            (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
          ),
        }))
      );
    })();
  }, []);

  // ---- helpers ----
  async function uploadAndInsert(projectId, files, kind) {
    if (!files?.length) return [];
    const inserts = [];

    for (const file of files) {
      const folder = kind === "image" ? "images" : "videos";
      const key = `${folder}/${projectId}/${uid()}-${file.name}`;
      const up = await supabase.storage.from("gp-media").upload(key, file, {
        cacheControl: "3600",
        upsert: false,
        contentType:
          file.type || (kind === "image" ? "image/jpeg" : "video/mp4"),
      });
      if (up.error) throw up.error;

      const { data, error } = await supabase
        .from("general_project_media")
        .insert({
          project_id: projectId,
          kind,
          path: key,
          sort_order: 999, // will be normalized by UI order
        })
        .select()
        .single();

      if (error) throw error;
      inserts.push(data);
    }
    return inserts;
  }

  // ---- create project ----
  async function handleCreate() {
    try {
      if (!title.trim()) return toast.error("Title is required");
      setCreating(true);

      // 1) insert project
      const { data: p, error } = await supabase
        .from("general_projects")
        .insert({ title, description: desc || null })
        .select()
        .single();
      if (error) throw error;

      // 2) upload media
      const addedImgs = await uploadAndInsert(p.id, imgs, "image");
      const addedVids = await uploadAndInsert(p.id, vids, "video");

      // 3) update list
      const row = {
        ...p,
        media: [...addedImgs, ...addedVids].sort(
          (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
        ),
      };
      setRows((prev) => [row, ...prev]);

      // 4) reset
      setTitle("");
      setDesc("");
      setImgs([]);
      setVids([]);
      if (imgRef.current) imgRef.current.value = "";
      if (vidRef.current) vidRef.current.value = "";

      toast.success("Project created");
      pushNotice?.({
        type: "info",
        title: "General project created",
        body: row.title,
        meta: { kind: "gp_project", action: "insert", id: row.id },
      });
    } catch (e) {
      console.error(e);
      toast.error(e.message || "Failed to create project");
    } finally {
      setCreating(false);
    }
  }

  async function handleSave(row) {
    const { id, title, description, featured } = row;
    const { data, error } = await supabase
      .from("general_projects")
      .update({ title, description, featured })
      .eq("id", id)
      .select()
      .single();
    if (error) return toast.error(error.message);

    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r)));
    toast.success("Saved");
    pushNotice?.({
      type: "info",
      title: "General project updated",
      body: data.title,
      meta: { kind: "gp_project", action: "update", id },
    });
  }

  async function handleDeleteProject(id) {
    try {
      const row = rows.find((r) => r.id === id);
      if (!row) return setConfirmId(null);

      // collect all storage keys
      const keys = (row.media || []).map((m) => m.path);

      // 1) delete media rows
      await supabase
        .from("general_project_media")
        .delete()
        .eq("project_id", id);

      // 2) delete project
      const { error } = await supabase
        .from("general_projects")
        .delete()
        .eq("id", id);
      if (error) throw error;

      // 3) remove storage (best-effort)
      if (keys.length) await supabase.storage.from("gp-media").remove(keys);

      setRows((prev) => prev.filter((r) => r.id !== id));
      toast.success("Project deleted");
      pushNotice?.({
        type: "success",
        title: "General project deleted",
        body: row.title,
        meta: { kind: "gp_project", action: "delete", id },
      });
    } catch (e) {
      toast.error(e.message || "Failed to delete");
    } finally {
      setConfirmId(null);
    }
  }

  async function addMedia(projectId, files, kind) {
    try {
      const newItems = await uploadAndInsert(projectId, files, kind);
      if (!newItems.length) return;

      setRows((prev) =>
        prev.map((r) =>
          r.id === projectId
            ? { ...r, media: [...(r.media || []), ...newItems] }
            : r
        )
      );

      toast.success(`${kind === "image" ? "Images" : "Videos"} added`);
      pushNotice?.({
        type: "info",
        title: "Project media added",
        body:
          newItems.length === 1 ? newItems[0].kind : `${newItems.length} files`,
        meta: { kind: "gp_media", action: "insert", id: projectId },
      });
    } catch (e) {
      toast.error(e.message || "Failed to add media");
    }
  }

  async function deleteMedia(projectId, mediaId, path) {
    try {
      const { error } = await supabase
        .from("general_project_media")
        .delete()
        .eq("id", mediaId);
      if (error) throw error;

      await supabase.storage.from("gp-media").remove([path]); // best-effort

      setRows((prev) =>
        prev.map((r) =>
          r.id === projectId
            ? { ...r, media: (r.media || []).filter((m) => m.id !== mediaId) }
            : r
        )
      );

      toast.success("Removed");
      pushNotice?.({
        type: "success",
        title: "Project media removed",
        body: "File deleted",
        meta: { kind: "gp_media", action: "delete", id: projectId },
      });
    } catch (e) {
      toast.error(e.message || "Failed to remove media");
    }
  }

  return (
    <div className="space-y-8">
      {/* CREATE */}
      <div className="rounded-2xl border border-white/10 bg-[#0b1713]/50 p-5 md:p-6">
        <h3 className="text-emerald-100 font-semibold mb-4 flex items-center gap-2">
          <FiUpload /> Add General Project
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="block text-sm text-emerald-50/80">
              Title
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-emerald-50"
                placeholder="Milton Property Maintenance"
              />
            </label>
            <label className="block text-sm text-emerald-50/80">
              Description
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={5}
                className="mt-1 w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-emerald-50"
                placeholder="Write a short story about the project…"
              />
            </label>
          </div>

          <div className="space-y-3">
            <label className="block text-sm text-emerald-50/80">
              Images (multiple)
              <input
                ref={imgRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setImgs([...e.target.files])}
                className="mt-1 w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-emerald-50"
              />
            </label>
            <label className="block text-sm text-emerald-50/80">
              Videos (multiple)
              <input
                ref={vidRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                multiple
                onChange={(e) => setVids([...e.target.files])}
                className="mt-1 w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-emerald-50"
              />
            </label>

            <button
              onClick={handleCreate}
              disabled={creating}
              className="mt-2 inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2 text-emerald-100 hover:bg-white/5 disabled:opacity-60"
            >
              <FiUpload /> {creating ? "Uploading…" : "Create"}
            </button>
          </div>
        </div>
      </div>

      {/* LIST */}
      {loading ? null : rows.length === 0 ? (
        <div className="text-emerald-50/70">No general projects yet.</div>
      ) : (
        rows.map((r) => (
          <div
            key={r.id}
            className="rounded-2xl border border-white/10 bg-[#0b1713]/40 p-5"
          >
            <div className="grid md:grid-cols-2 gap-5">
              {/* Left: meta */}
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

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSave(r)}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-emerald-100 hover:bg-white/5"
                  >
                    <FiSave /> Save
                  </button>
                  <button
                    onClick={() => setConfirmId(r.id)}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-red-300 hover:bg-white/5"
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>

              {/* Right: media */}
              <div>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block text-sm text-emerald-50/80">
                    Add images
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = [...(e.target.files || [])];
                        e.target.value = "";
                        addMedia(r.id, files, "image");
                      }}
                      className="mt-1 w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-emerald-50"
                    />
                  </label>
                  <label className="block text-sm text-emerald-50/80">
                    Add videos
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime"
                      multiple
                      onChange={(e) => {
                        const files = [...(e.target.files || [])];
                        e.target.value = "";
                        addMedia(r.id, files, "video");
                      }}
                      className="mt-1 w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-emerald-50"
                    />
                  </label>
                </div>

                {/* Thumbs */}
                <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {(r.media || []).map((m) => (
                    <div
                      key={m.id}
                      className="relative group rounded-xl overflow-hidden border border-white/10"
                    >
                      {m.kind === "image" ? (
                        <img
                          src={publicUrl(m.path)}
                          alt=""
                          className="w-full h-24 object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <video
                          src={publicUrl(m.path)}
                          className="w-full h-24 object-cover"
                          muted
                          controls={false}
                        />
                      )}
                      <span className="absolute top-1 left-1 flex items-center gap-1 rounded bg-black/60 text-white text-[10px] px-1.5 py-0.5">
                        {m.kind === "image" ? <FiImage /> : <FiVideo />}{" "}
                        {m.kind}
                      </span>
                      <button
                        onClick={() => deleteMedia(r.id, m.id, m.path)}
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition rounded bg-black/60 text-white p-1"
                        title="Remove"
                      >
                        <FiX className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* subtle divider */}
            <div className="pointer-events-none mt-5 h-px bg-white/10 rounded" />
          </div>
        ))
      )}

      {/* Delete project confirm */}
      {confirmId && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0b1713]/95 p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-emerald-100">
                Delete this project?
              </h3>
              <button
                onClick={() => setConfirmId(null)}
                className="p-2 rounded-lg hover:bg-white/5 text-emerald-50/80"
                aria-label="Close"
              >
                <FiX />
              </button>
            </div>
            <p className="mt-3 text-emerald-50/80 text-sm">
              This will remove the project, its media rows, and try to delete
              all files from storage.
            </p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                onClick={() => setConfirmId(null)}
                className="rounded-lg border border-white/15 px-3 py-2 text-emerald-50/90 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProject(confirmId)}
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
