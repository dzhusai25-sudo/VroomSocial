import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { getCarBrands, getModelsByBrand } from "../services/carApi";
import { useProfile } from '../hooks/useProfile';

export function CreateImpression() {
  const { displayName } = useProfile();
  const [city, setCity] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [story, setStory] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [brands, setBrands] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [brandsLoading, setBrandsLoading] = useState(true);
  const [modelsLoading, setModelsLoading] = useState(false);
  const navigate = useNavigate();

  // Загружаем марки при монтировании
  useEffect(() => {
    setBrandsLoading(true);
    getCarBrands()
      .then(setBrands)
      .catch((err) => {
        console.error("Ошибка загрузки марок:", err);
        setError(
          "Не удалось загрузить список марок. Пожалуйста, обновите страницу.",
        );
      })
      .finally(() => setBrandsLoading(false));
  }, []);

  // При выборе марки загружаем модели
  useEffect(() => {
    if (brand) {
      setModelsLoading(true);
      getModelsByBrand(brand)
        .then(setModels)
        .catch((err) => {
          console.error("Ошибка загрузки моделей:", err);
          setError("Не удалось загрузить модели для выбранной марки");
        })
        .finally(() => setModelsLoading(false));
    } else {
      setModels([]);
    }
  }, [brand]);

// useEffect(() => {
//   if (!displayName) {
//     navigate('/profile', { state: { fromCreate: true } });
//   }
// }, [displayName, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Проверка на заполнение полей (на всякий случай)
    if (!city.trim() || !brand || !model || !story.trim()) {
      setError("Пожалуйста, заполните все поля");
      setLoading(false);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError("Необходимо войти");
      setLoading(false);
      return;
    }

    let photoUrl = null;
    if (photoFile) {
      const fileExt = photoFile.name.split(".").pop();
      const fileName = `${user.id}_${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("impressions")
        .upload(fileName, photoFile);
      if (uploadError) {
        setError("Ошибка загрузки фото");
        setLoading(false);
        return;
      }
      photoUrl = supabase.storage.from("impressions").getPublicUrl(fileName)
        .data.publicUrl;
    }

    const { error: insertError } = await supabase.from("impressions").insert({
      user_id: user.id,
      city,
      car_brand: brand,
      car_model: model,
      photo_url: photoUrl,
      story,
      author_name: displayName || user.email || 'пользователь',
    });

    if (insertError) {
      setError(insertError.message);
    } else {
      navigate("/");
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Поделиться впечатлением</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Город</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Марка автомобиля</label>
          <select
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            required
            disabled={brandsLoading}
          >
            <option value="">
              {brandsLoading ? "Загрузка марок..." : "Выберите марку"}
            </option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Модель</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            required
            disabled={!brand || modelsLoading}
          >
            <option value="">
              {!brand
                ? "Сначала выберите марку"
                : modelsLoading
                  ? "Загрузка моделей..."
                  : "Выберите модель"}
            </option>
            {models.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Фото</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
          />
        </div>
        <div>
          <label>Рассказ</label>
          <textarea
            value={story}
            onChange={(e) => setStory(e.target.value)}
            rows={5}
            required
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Отправка..." : "Опубликовать"}
        </button>
      </form>
    </div>
  );
}
