import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { getImpressions, Impression, getUniqueBrands, getUniqueModels } from "../services/impressions";
import { getLikesCount, userLiked, addLike, removeLike } from "../services/likes";

export function Home() {
  const [impressions, setImpressions] = useState<Impression[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const limit = 5;
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [brands, setBrands] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [loadingFilters, setLoadingFilters] = useState(true);

  // Загружаем уникальные марки для фильтров
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const uniqueBrands = await getUniqueBrands();
        setBrands(uniqueBrands);
      } catch (err) {
        console.error('Ошибка загрузки марок для фильтра', err);
      } finally {
        setLoadingFilters(false);
      }
    };
    loadFilters();
  }, []);

  // При выборе марки загружаем модели для фильтров
  useEffect(() => {
    const loadModels = async () => {
      if (!selectedBrand) {
        setModels([]);
        setSelectedModel('');
        return;
      }
      try {
        const uniqueModels = await getUniqueModels(selectedBrand);
        setModels(uniqueModels);
      } catch (err) {
        console.error('Ошибка загрузки моделей для фильтра', err);
      }
    };
    loadModels();
  }, [selectedBrand]);

  // Сбрасываем страницу при изменении фильтров
  useEffect(() => {
    setPage(1);
  }, [selectedBrand, selectedModel]);

  // Загружаем впечатления при изменении страницы или фильтров
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { impressions: data, count } = await getImpressions(page, limit, selectedBrand, selectedModel);
        const { data: { user } } = await supabase.auth.getUser();
        const userId = user?.id;
        const impressionsWithLikes = await Promise.all(data.map(async (item) => {
          const likesCount = await getLikesCount(item.id);
          const userLikedFlag = userId ? await userLiked(item.id, userId) : false;
          return { ...item, likes_count: likesCount, user_liked: userLikedFlag };
        }));
        setImpressions(impressionsWithLikes);
        setTotalCount(count);
      } catch (err) {
        setError("Не удалось загрузить впечатления");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [page, selectedBrand, selectedModel]);

  const totalPages = totalCount ? Math.ceil(totalCount / limit) : 0;

  const handleLike = async (impressionId: number, currentLiked: boolean) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      if (currentLiked) {
        await removeLike(impressionId, user.id);
        setImpressions(prev => prev.map(i =>
          i.id === impressionId
            ? { ...i, likes_count: (i.likes_count || 0) - 1, user_liked: false }
            : i
        ));
      } else {
        await addLike(impressionId, user.id);
        setImpressions(prev => prev.map(i =>
          i.id === impressionId
            ? { ...i, likes_count: (i.likes_count || 0) + 1, user_liked: true }
            : i
        ));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <label>Марка: </label>
        <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)} disabled={loadingFilters}>
          <option value="">Все</option>
          {brands.map(b => <option key={b} value={b}>{b}</option>)}
        </select>

        <label style={{ marginLeft: '1rem' }}>Модель: </label>
        <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} disabled={!selectedBrand || loadingFilters}>
          <option value="">Все</option>
          {models.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      <h2>Автомобильные впечатления</h2>
      {impressions.length === 0 && <p>Пока нет впечатлений. Станьте первым!</p>}
      {impressions.map((item) => (
        <div
          key={item.id}
          style={{
            border: "1px solid #ddd",
            margin: "1rem 0",
            padding: "1rem",
          }}
        >
          <Link to={`/impression/${item.id}`}>
            <h3>{item.car_brand} {item.car_model} город {item.city}</h3>
          </Link>
          {item.photo_url && (
            <img
              src={item.photo_url}
              alt="фото"
              style={{ maxWidth: "100%", maxHeight: "300px" }}
            />
          )}
          <p>{item.story}</p>
          <small>
            Автор: {item.author_name || 'пользователь'} | {new Date(item.created_at).toLocaleString()}
          </small>
          <div>
            <button onClick={() => handleLike(item.id, item.user_liked || false)}>
              {item.user_liked ? '❤️' : '🤍'} {item.likes_count || 0}
            </button>
          </div>
        </div>
      ))}

      {totalPages > 0 && (
        <div>
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
          >
            Предыдущая
          </button>
          <span>
            {" "}
            Страница {page} из {totalPages}{" "}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
          >
            Следующая
          </button>
        </div>
      )}
    </div>
  );
}