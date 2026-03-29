import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { getCarBrands, getModelsByBrand } from "../services/carApi";
import { useProfile } from "../hooks/useProfile";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  Button,
  Typography,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useAuth } from "../hooks/useAuth";

export function CreateImpression() {
  const { user, loading: authLoading } = useAuth();
  const { displayName, loading: profileLoading } = useProfile();
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

  //загрузка марок
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

  //загрузка моделей для выбранной марки
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!displayName) {
      setError("Для публикации впечатления необходимо заполнить профиль");
      setLoading(false);
      return;
    }

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
      author_name: displayName || user.email || "пользователь",
    });

    if (insertError) {
      setError(insertError.message);
    } else {
      navigate("/");
    }
    setLoading(false);
  };

  //пока загружается профиль крутить спиннер
  if (authLoading || profileLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Поделиться впечатлением
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Город"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal" disabled={brandsLoading}>
          <InputLabel>Марка автомобиля</InputLabel>
          <Select
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            required
            label="Марка автомобиля"
          >
            <MenuItem value="" disabled>
              Выберите марку
            </MenuItem>
            {brands.map((b) => (
              <MenuItem key={b} value={b}>
                {b}
              </MenuItem>
            ))}
          </Select>
          {brandsLoading && (
            <CircularProgress
              size={24}
              sx={{ position: "absolute", right: 12, top: 18 }}
            />
          )}
        </FormControl>
        <FormControl
          fullWidth
          margin="normal"
          disabled={!brand || modelsLoading}
        >
          <InputLabel>Модель</InputLabel>
          <Select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            required
            label="Модель"
          >
            <MenuItem value="" disabled>
              Выберите модель
            </MenuItem>
            {models.map((m) => (
              <MenuItem key={m} value={m}>
                {m}
              </MenuItem>
            ))}
          </Select>
          {modelsLoading && (
            <CircularProgress
              size={24}
              sx={{ position: "absolute", right: 12, top: 18 }}
            />
          )}
        </FormControl>
        <TextField
          label="Рассказ"
          value={story}
          onChange={(e) => setStory(e.target.value)}
          required
          multiline
          rows={5}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" component="label" sx={{ mt: 2, mr: 2 }}>
          Загрузить фото
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
          />
        </Button>
        {photoFile && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            Файл выбран: {photoFile.name}
          </Typography>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          fullWidth
          sx={{ mt: 2 }}
        >
          {loading ? "Отправка..." : "Опубликовать"}
        </Button>
      </form>
    </Box>
  );
}
