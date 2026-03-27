import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getCarBrands, getModelsByBrand } from '../services/carApi';

export function CreateImpression() {
  const [city, setCity] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [story, setStory] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [brands, setBrands] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const navigate = useNavigate();

  // Загружаем марки при монтировании
  useEffect(() => {
    getCarBrands().then(setBrands).catch(console.error);
  }, []);

  // При выборе марки загружаем модели
  useEffect(() => {
    if (brand) {
      getModelsByBrand(brand).then(setModels).catch(console.error);
    } else {
      setModels([]);
    }
  }, [brand]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('Необходимо войти');
      setLoading(false);
      return;
    }

    let photoUrl = null;
    if (photoFile) {
      const fileExt = photoFile.name.split('.').pop();
      const fileName = `${user.id}_${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('impressions')
        .upload(fileName, photoFile);
      if (uploadError) {
        setError('Ошибка загрузки фото');
        setLoading(false);
        return;
      }
      photoUrl = supabase.storage.from('impressions').getPublicUrl(fileName).data.publicUrl;
    }

    const { error: insertError } = await supabase
      .from('impressions')
      .insert({
        user_id: user.id,
        city,
        car_brand: brand,
        car_model: model,
        photo_url: photoUrl,
        story,
      });

    if (insertError) {
      setError(insertError.message);
    } else {
      navigate('/');
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
          <select value={brand} onChange={(e) => setBrand(e.target.value)} required>
            <option value="">Выберите марку</option>
            {brands.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div>
          <label>Модель</label>
          <select value={model} onChange={(e) => setModel(e.target.value)} required disabled={!brand}>
            <option value="">Выберите модель</option>
            {models.map(m => <option key={m} value={m}>{m}</option>)}
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
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Отправка...' : 'Опубликовать'}
        </button>
      </form>
    </div>
  );
}