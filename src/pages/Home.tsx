import { useEffect, useState } from "react";
import { getImpressions, Impression } from "../services/impressions";
import { Link} from "react-router-dom";

export function Home() {
  const [impressions, setImpressions] = useState<Impression[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const limit = 5;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { impressions: data, count } = await getImpressions(page, limit);
        setImpressions(data);
        setTotalCount(count);
      } catch (err) {
        setError("Не удалось загрузить впечатления");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [page]);

  const totalPages = totalCount ? Math.ceil(totalCount / limit) : 0;

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div>
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
