"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { supabase } from "@/lib/supabase/browser";
import toast from "react-hot-toast";
import { FiTrash2, FiSave, FiImage } from "react-icons/fi";

// utils
const uid = () => crypto.randomUUID();
const nowKey = () => new Date().toISOString().replaceAll(":", "-");
const cn = (...a) => a.filter(Boolean).join(" ");

// anchored confirm beside clicked Delete
function ConfirmPopover({
  open,
  anchorRect,
  title,
  body,
  onCancel,
  onConfirm,
}) {
  const ref = useRef(null);
  const [style, setStyle] = useState({}); // computed positioning

  const compute = () => {
    if (!open || !anchorRect || !ref.current) return;

    const margin = 12; // viewport padding
    const gap = 8; // distance from button
    const w = ref.current.offsetWidth || 320;
    const h = ref.current.offsetHeight || 160;

    // Base: below the button
    let top = anchorRect.bottom + gap;
    let placeAbove = false;

    // Flip above if bottom overflows
    if (top + h + margin > window.innerHeight) {
      top = anchorRect.top - h - gap;
      placeAbove = true;
    }
    // Clamp vertically
    top = Math.max(margin, Math.min(top, window.innerHeight - h - margin));

    // Horizontal: decide left OR right to keep it in view
    const spaceRight = window.innerWidth - anchorRect.left;
    const spaceLeft = anchorRect.right;

    let css = { position: "fixed", top, zIndex: 130 };

    // Prefer left-aligned if it fits, otherwise right-align to the button
    if (anchorRect.left + w + margin <= window.innerWidth) {
      let left = anchorRect.left;
      // if left-aligned still overflows, clamp
      if (left + w + margin > window.innerWidth) {
        left = window.innerWidth - w - margin;
      }
      css.left = Math.max(margin, left);
    } else {
      // anchor from the right side of the viewport
      let right = window.innerWidth - anchorRect.right;
      // clamp
      right = Math.max(margin, Math.min(right, window.innerWidth - w - margin));
      css.right = right;
    }

    setStyle(css);
  };

  useLayoutEffect(() => {
    if (!open) return;
    // wait a frame so the node exists and has dimensions
    const id = requestAnimationFrame(compute);
    return () => cancelAnimationFrame(id);
  }, [open, anchorRect]);

  useEffect(() => {
    if (!open) return;
    const onChange = () => compute();
    window.addEventListener("resize", onChange);
    window.addEventListener("scroll", onChange, true);
    return () => {
      window.removeEventListener("resize", onChange);
      window.removeEventListener("scroll", onChange, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, anchorRect]);

  if (!open || !anchorRect) return null;

  const node = (
    <div
      ref={ref}
      style={style}
      className="max-w-[360px] w-[320px] rounded-2xl border border-white/10 bg-[#0b1713]/95 p-4 shadow-xl"
    >
      <div className="text-emerald-100 font-semibold">
        {title || "Delete this post?"}
      </div>
      {body ? <p className="mt-2 text-emerald-50/80 text-sm">{body}</p> : null}
      <div className="mt-4 flex items-center justify-end gap-2">
        <button
          onClick={onCancel}
          className="rounded-lg border border-white/15 px-3 py-1.5 text-emerald-50/90 hover:bg-white/5"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="rounded-lg px-3 py-1.5 bg-red-500/90 hover:bg-red-500 text-white font-medium"
        >
          Delete
        </button>
      </div>
    </div>
  );

  // render at document.body to avoid any ancestor overflow/transform issues
  return createPortal(node, document.body);
}

export default function BAEditor({ pushNotice }) {
  // project shape:
  // { id,title,description,featured,pairs:[{id,before_url,after_url,sort_order}],
  //   _dirty,_saving,_staged:{pairs:{[pairId]:{beforeFile?:File,afterFile?:File}}} }
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // delete popover
  const [confirm, setConfirm] = useState({
    open: false,
    projectId: null,
    anchorRect: null,
  });

  // ----- load -----
  const load = async () => {
    setLoading(true);
    const [{ data: projs, error: e1 }, { data: pairs, error: e2 }] =
      await Promise.all([
        supabase
          .from("before_after_projects")
          .select("*")
          .order("created_at", { ascending: true }),
        supabase
          .from("before_after_pairs")
          .select("*")
          .order("sort_order", { ascending: true }),
      ]);
    setLoading(false);
    if (e1 || e2) return toast.error((e1 || e2).message);

    const grouped = (projs || []).map((p) => ({
      ...p,
      _dirty: false,
      _saving: false,
      _staged: { pairs: {} },
      pairs: (pairs || []).filter((x) => x.project_id === p.id),
    }));
    setProjects(grouped);
  };

  useEffect(() => {
    load();

    const ch1 = supabase
      .channel("ba:projects")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "before_after_projects" },
        () => load()
      )
      .subscribe();

    const ch2 = supabase
      .channel("ba:pairs")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "before_after_pairs" },
        () => load()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ch1);
      supabase.removeChannel(ch2);
    };
  }, []);

  // mark dirty helper
  const markDirty = (id, mutate) =>
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...mutate({ ...p }), _dirty: true } : p))
    );

  // stage an image (wait for Save)
  const stageImage = (projectId, pairId, side, file) => {
    markDirty(projectId, (p) => {
      const staged = { ...(p._staged || { pairs: {} }) };
      staged.pairs = { ...staged.pairs };
      const curr = staged.pairs[pairId] || {};
      staged.pairs[pairId] = {
        ...curr,
        [side === "before" ? "beforeFile" : "afterFile"]: file,
      };
      return { ...p, _staged: staged };
    });
  };

  // upload helper
  const uploadAndGetUrl = async (file, folder = "projects") => {
    const path = `${folder}/${crypto.randomUUID()}_${nowKey()}_${file.name}`;
    const { error: upErr } = await supabase.storage
      .from("ba")
      .upload(path, file, { cacheControl: "3600", upsert: false });
    if (upErr) throw upErr;
    const { data } = supabase.storage.from("ba").getPublicUrl(path);
    return data.publicUrl;
  };

  // SAVE: push text/checkbox + any staged images
  const onSave = async (proj) => {
    if (!proj._dirty) return;
    setProjects((cur) =>
      cur.map((x) => (x.id === proj.id ? { ...x, _saving: true } : x))
    );

    try {
      // upload staged images & update pairs
      const stagedPairs = proj._staged?.pairs || {};
      for (const [pairId, files] of Object.entries(stagedPairs)) {
        const updates = {};
        if (files.beforeFile)
          updates.before_url = await uploadAndGetUrl(files.beforeFile, proj.id);
        if (files.afterFile)
          updates.after_url = await uploadAndGetUrl(files.afterFile, proj.id);
        if (Object.keys(updates).length) {
          const { error } = await supabase
            .from("before_after_pairs")
            .update(updates)
            .eq("id", pairId);
          if (error) throw error;

          setProjects((prev) =>
            prev.map((p) =>
              p.id !== proj.id
                ? p
                : {
                    ...p,
                    pairs: p.pairs.map((pr) =>
                      pr.id === pairId ? { ...pr, ...updates } : pr
                    ),
                  }
            )
          );
        }
      }

      // update project core fields
      const { error: pe } = await supabase
        .from("before_after_projects")
        .update({
          title: proj.title,
          description: proj.description,
          featured: !!proj.featured,
          updated_at: new Date().toISOString(),
        })
        .eq("id", proj.id);
      if (pe) throw pe;

      toast.success("Saved");
      pushNotice?.({
        type: "success",
        title: "Project updated",
        body: proj.title || "Untitled",
        meta: { kind: "ba", action: "update", id: proj.id },
      });

      // clear dirty + staged
      setProjects((cur) =>
        cur.map((x) =>
          x.id === proj.id
            ? { ...x, _saving: false, _dirty: false, _staged: { pairs: {} } }
            : x
        )
      );
    } catch (e) {
      setProjects((cur) =>
        cur.map((x) => (x.id === proj.id ? { ...x, _saving: false } : x))
      );
      toast.error(e.message || "Save failed");
    }
  };

  // anchored delete
  const askDelete = (projectId, btnEl) =>
    setConfirm({
      open: true,
      projectId,
      anchorRect: btnEl?.getBoundingClientRect?.() || null,
    });

  const confirmDelete = async () => {
    const id = confirm.projectId;
    setConfirm({ open: false, projectId: null, anchorRect: null });

    try {
      // try RPC; if missing, fallback to two-step
      let rpcErr = null;
      try {
        const { error } = await supabase.rpc("delete_ba_project_cascade", {
          p_project_id: id,
        });
        rpcErr = error || null;
      } catch (e) {
        rpcErr = e;
      }

      if (rpcErr) {
        const { error: e1 } = await supabase
          .from("before_after_pairs")
          .delete()
          .eq("project_id", id);
        if (e1) throw e1;
        const { error: e2 } = await supabase
          .from("before_after_projects")
          .delete()
          .eq("id", id);
        if (e2) throw e2;
      }

      toast.success("Project deleted");
      pushNotice?.({
        type: "success",
        title: "Project deleted",
        meta: { kind: "ba", action: "delete", id },
      });
    } catch (e) {
      toast.error(e.message || "Delete failed");
    }
  };

  if (loading) return null;

  return (
    <div className="space-y-8">
      {projects.map((p) => (
        <div
          key={p.id}
          className="rounded-2xl border border-white/10 bg-black/20 p-5"
        >
          <div className="flex items-center justify-between">
            <div className="text-emerald-50/70 text-sm px-2 py-1 bg-white/5 rounded-lg">
              {p.title || "Untitled"}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => askDelete(p.id, e.currentTarget)}
                className="rounded-lg border border-red-400/25 px-3 py-2 text-red-300 hover:bg-red-500/10 flex items-center gap-2"
                title="Delete project"
              >
                <FiTrash2 /> Delete
              </button>
              <button
                disabled={!p._dirty || p._saving}
                onClick={() => onSave(p)}
                className={cn(
                  "rounded-lg px-3 py-2 flex items-center gap-2",
                  p._dirty
                    ? "bg-emerald-400/90 hover:bg-emerald-400 text-black"
                    : "bg-white/10 text-emerald-50/60 cursor-not-allowed"
                )}
                title="Save changes"
              >
                <FiSave /> Save
              </button>
            </div>
          </div>

          {/* fields */}
          <div className="mt-4 grid gap-3">
            <label className="block">
              <span className="text-sm text-emerald-50/80">Title</span>
              <input
                value={p.title || ""}
                onChange={(e) =>
                  markDirty(p.id, (x) => ({ ...x, title: e.target.value }))
                }
                className="mt-1 w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-emerald-50 outline-none focus:border-emerald-400/60"
              />
            </label>

            <label className="block">
              <span className="text-sm text-emerald-50/80">Description</span>
              <textarea
                rows={6}
                value={p.description || ""}
                onChange={(e) =>
                  markDirty(p.id, (x) => ({
                    ...x,
                    description: e.target.value,
                  }))
                }
                className="mt-1 w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-emerald-50 outline-none focus:border-emerald-400/60"
              />
            </label>

            <label className="inline-flex items-center gap-2 text-emerald-50/80">
              <input
                type="checkbox"
                checked={!!p.featured}
                onChange={(e) =>
                  markDirty(p.id, (x) => ({ ...x, featured: e.target.checked }))
                }
              />
              Show near the top
            </label>
          </div>

          {/* pairs + replace controls (staged until Save) */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {p.pairs.map((pair) => {
              const staged = p._staged?.pairs?.[pair.id] || {};
              return (
                <div
                  key={pair.id}
                  className="rounded-xl border border-white/10 p-3 bg-black/20"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <img
                        src={
                          staged.beforeFile
                            ? URL.createObjectURL(staged.beforeFile)
                            : pair.before_url
                        }
                        className="w-full h-40 object-cover rounded-lg border border-white/10"
                        alt="Before"
                      />
                      <label className="mt-2 inline-flex items-center gap-2 text-xs text-emerald-50/80 cursor-pointer">
                        <FiImage />
                        <span>
                          Replace before{staged.beforeFile ? " (staged)" : ""}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) stageImage(p.id, pair.id, "before", f);
                            e.target.value = "";
                          }}
                        />
                      </label>
                    </div>
                    <div>
                      <img
                        src={
                          staged.afterFile
                            ? URL.createObjectURL(staged.afterFile)
                            : pair.after_url
                        }
                        className="w-full h-40 object-cover rounded-lg border border-white/10"
                        alt="After"
                      />
                      <label className="mt-2 inline-flex items-center gap-2 text-xs text-emerald-50/80 cursor-pointer">
                        <FiImage />
                        <span>
                          Replace after{staged.afterFile ? " (staged)" : ""}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) stageImage(p.id, pair.id, "after", f);
                            e.target.value = "";
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <ConfirmPopover
        open={confirm.open}
        anchorRect={confirm.anchorRect}
        title="Delete this post?"
        body="This will remove the project and all its image pairs."
        onCancel={() =>
          setConfirm({ open: false, projectId: null, anchorRect: null })
        }
        onConfirm={confirmDelete}
      />
    </div>
  );
}
