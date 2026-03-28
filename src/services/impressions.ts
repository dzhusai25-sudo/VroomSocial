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
  likes_count?: number;
  user_liked?: boolean;
}

// Получение списка впечатлений с фильтрацией
export async function getImpressions(page: number, limit: number, brand?: string, model?: string) {
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  let query = supabase
    .from('impressions')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(start, end);

  if (brand && brand !== '') {
    query = query.eq('car_brand', brand);
  }
  if (model && model !== '') {
    query = query.eq('car_model', model);
  }

  const { data, error, count } = await query;
  if (error) throw error;
  return { impressions: data as Impression[], count };
}

// Уникальные марки из всех впечатлений
export async function getUniqueBrands() {
  const { data, error } = await supabase
    .from('impressions')
    .select('car_brand')
    .order('car_brand');
  if (error) throw error;
  const unique = [...new Set(data.map(item => item.car_brand))];
  return unique;
}

// Уникальные модели для выбранной марки
export async function getUniqueModels(brand: string) {
  const { data, error } = await supabase
    .from('impressions')
    .select('car_model')
    .eq('car_brand', brand)
    .order('car_model');
  if (error) throw error;
  const unique = [...new Set(data.map(item => item.car_model))];
  return unique;
}