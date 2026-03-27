import { supabase } from "../lib/supabase";

export interface Impression {
  id: number;
  user_id: string;
  city: string;
  car_brand: string;
  car_model: string;
  photo_url: string | null;
  story: string;
  created_at: string;
  user?: { email: string };
  author_name?: string;
}

export async function getImpressions(page = 1, limit = 10) {
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  const { data, error, count } = await supabase
    .from("impressions")
    .select('*', { count: 'exact' })
    .order("created_at", { ascending: false })
    .range(start, end);

  if (error) throw error;
  return { impressions: data as Impression[], count };
}
