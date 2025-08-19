"use client";
import { useState, useMemo } from "react";
import { supabase } from "@/lib/supabase/browser";
import { uploadBAImage } from "../api/supaHelpers";
import toast from "react-hot-toast";
import { FiPlus, FiTrash2 } from "react-icons/fi";

export default function TabAddBA({ pushNotice }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [featured, setFeatured] = useState(false);

  const [pairs, setPairs] = useState([
    { beforeFile: null, afterFile: null, sort_order: 0 },
  ]);

  const canSave = useMemo(
    () => pairs.some((p) => p.beforeFile && p.afterFile),
    [pairs]
  );

  const addPair = () =>
    setPairs((cur) => [
      ...cur,
      { beforeFile: null, afterFile: null, sort_order: cur.length },
    ]);

  const removePair = (idx) =>
    setPairs((cur) => cur.filter((_, i) => i !== idx));

  async function save() {
    try {
      if (!canSave) return toast.error("Add at least one before & after pair.");

      // create project
      const { data: proj, error: projErr } = await supabase
        .from("before_after_projects")
        .insert([{ title, description, featured }])
        .select()
        .single();
      if (projErr) throw projErr;

      // upload pairs
      for (let i = 0; i < pairs.length; i++) {
        const p = pairs[i];
        if (!p.beforeFile || !p.afterFile) continue;
        const [beforeUrl, afterUrl] = await Promise.all([
          uploadBAImage(p.beforeFile),
          uploadBAImage(p.afterFile),
        ]);
        const { error: pairErr } = await supabase
          .from("before_after_pairs")
          .insert([
            {
              project_id: proj.id,
              before_url: beforeUrl,
              after_url: afterUrl,
              sort_order: p.sort_order ?? i,
            },
          ]);
        if (pairErr) throw pairErr;
      }

      toast.success("Project saved");
      pushNotice?.({
        type: "success",
        title: "Before & After created",
        body: title ? `“${title}”` : "",
        meta: { kind: "project", action: "insert", id: proj?.id },
      });

      // reset
      setTitle("");
      setDescription("");
      setFeatured(false);
      setPairs([{ beforeFile: null, afterFile: null, sort_order: 0 }]);
    } catch (e) {
      toast.error(e.message);
      pushNotice?.({ type: "error", title: "Save failed", body: e.message });
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl text-emerald-100 font-semibold">
        Add Before &amp; After
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm text-emerald-50/80">Title (optional)</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-emerald-50 outline-none"
          />
        </label>

        <label className="flex items-end gap-2">
          <input
            id="featured"
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
          />
          <span className="text-emerald-50/80">Show near the top</span>
        </label>

        <label className="md:col-span-2 block">
          <span className="text-sm text-emerald-50/80">
            Description (optional)
          </span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="mt-1 w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-emerald-50 outline-none"
          />
        </label>
      </div>

      <div className="rounded-2xl border border-white/10 p-4 bg-black/20">
        <div className="flex items-center justify-between">
          <h3 className="text-emerald-100 font-semibold">
            Before / After Pairs
          </h3>
          <button
            onClick={addPair}
            className="rounded-lg border border-white/15 px-3 py-2 text-emerald-50/90 hover:bg-white/5 flex items-center gap-2"
          >
            <FiPlus /> Add pair
          </button>
        </div>

        <div className="mt-3 space-y-4">
          {pairs.map((p, idx) => (
            <div
              key={idx}
              className="grid md:grid-cols-2 gap-4 rounded-xl border border-white/10 p-3 bg-black/10"
            >
              <label className="block">
                <span className="text-sm text-emerald-50/80">Before image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setPairs((cur) =>
                      cur.map((x, i) =>
                        i === idx
                          ? { ...x, beforeFile: e.target.files?.[0] || null }
                          : x
                      )
                    )
                  }
                  className="mt-1 block"
                />
              </label>
              <label className="block">
                <span className="text-sm text-emerald-50/80">After image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setPairs((cur) =>
                      cur.map((x, i) =>
                        i === idx
                          ? { ...x, afterFile: e.target.files?.[0] || null }
                          : x
                      )
                    )
                  }
                  className="mt-1 block"
                />
              </label>

              <div className="flex items-center justify-between md:col-span-2">
                <div className="text-emerald-50/60 text-sm">
                  {p.beforeFile?.name || "No before image"} •{" "}
                  {p.afterFile?.name || "No after image"}
                </div>
                {pairs.length > 1 && (
                  <button
                    onClick={() => removePair(idx)}
                    className="rounded-lg border border-red-400/25 px-3 py-2 text-red-300 hover:bg-red-500/10 flex items-center gap-2"
                  >
                    <FiTrash2 /> Remove pair
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <button
          onClick={save}
          disabled={!canSave}
          className="rounded-lg px-4 py-2 bg-emerald-400 text-black font-semibold disabled:opacity-60"
        >
          Save
        </button>
      </div>
    </div>
  );
}
