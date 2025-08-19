"use client";
import { supabase } from "@/lib/supabase/browser";

export async function uploadBAImage(file) {
  if (!file) return null;
  const ext = file.name.split(".").pop();
  const path = `ba_${crypto.randomUUID()}.${ext}`;
  const { data, error } = await supabase.storage.from("ba").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  const { data: pub } = supabase.storage.from("ba").getPublicUrl(data.path);
  return pub.publicUrl;
}
