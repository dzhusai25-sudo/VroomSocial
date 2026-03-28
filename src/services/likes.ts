import { supabase } from "../lib/supabase";

export async function getLikesCount(impressionId: number): Promise<number> {
  const { count, error } = await supabase
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("impression_id", impressionId);
  if (error) throw error;
  return count || 0;
}

export async function userLiked(
  impressionId: number,
  userId: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from("likes")
    .select("id")
    .eq("impression_id", impressionId)
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return !!data;
}

export async function addLike(
  impressionId: number,
  userId: string,
): Promise<void> {
  const { error } = await supabase
    .from("likes")
    .insert({ impression_id: impressionId, user_id: userId });
  if (error) throw error;
}

export async function removeLike(
  impressionId: number,
  userId: string,
): Promise<void> {
  const { error } = await supabase
    .from("likes")
    .delete()
    .eq("impression_id", impressionId)
    .eq("user_id", userId);
  if (error) throw error;
}
