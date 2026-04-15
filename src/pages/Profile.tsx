import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useProfile } from "../hooks/useProfile";

export function Profile() {
  const { user } = useAuth();
  const { displayName: profileName, updateDisplayName } = useProfile();
  const [name, setName] = useState(profileName || "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Синхронизируем локальное состояние, когда profileName загрузится
  useEffect(() => {
    setName(profileName || "");
  }, [profileName]);

  const handleSave = async () => {
    setSaving(true);
    const success = await updateDisplayName(name);
    if (success) {
      setMessage("Имя сохранено!");
      setTimeout(() => {
        window.location.reload();
      }, 100);
      // Если пришли со страницы создания, возвращаемся туда
      if (location.state?.fromCreate) {
        setTimeout(() => navigate("/create"), 1000);
      } else {
        setTimeout(() => navigate("/"), 1000);
      }
    } else {
      setMessage("Не удалось сохранить имя");
    }
    setSaving(false);
  };

  if (!user) return <p>Пожалуйста, войдите.</p>;

  return (
    <div>
      <h2>Ваш профиль</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        <div>
          <label>Отображаемое имя</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={saving}>
          {saving ? "Сохранение..." : "Сохранить"}
        </button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}
