import { supabase } from "../lib/supabase";

export async function uploadImage(file: File, path: string) {
  const { data, error } = await supabase.storage
    .from("posts")
    .upload(path, file);

  if (error) throw error;

  const { data: publicUrl } = supabase.storage
    .from("posts")
    .getPublicUrl(data.path);

  return publicUrl.publicUrl;
}
