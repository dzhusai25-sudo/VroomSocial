import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Impression } from '../services/impressions';

export function ImpressionDetail() {
  const { id } = useParams<{ id: string }>();
  const [impression, setImpression] = useState<Impression | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchImpression = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('impressions')
          .select('*')
          .eq('id', id)
          .single();
        if (error) throw error;
        setImpression(data);
      } catch (err) {
        setError('Не удалось загрузить впечатление');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchImpression();
  }, [id]);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!impression) return <div>Впечатление не найдено</div>;

  return (
    <div>
      <button onClick={() => navigate(-1)}>← Назад</button>
      <h2>
        {impression.car_brand} {impression.car_model} город {impression.city}
      </h2>
      {impression.photo_url && (
        <img src={impression.photo_url} alt="фото" style={{ maxWidth: '100%', maxHeight: '400px' }} />
      )}
      <p>{impression.story}</p>
      <small>
        Автор: {impression.author_name || 'пользователь'} | {new Date(impression.created_at).toLocaleString()}
      </small>
    </div>
  );
}