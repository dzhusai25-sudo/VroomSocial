import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

declare const BASENAME: string;

const getRedirectUrl = (path: string) => {
  const baseUrl = window.location.origin;
  const basePath = BASENAME === "/" ? "" : BASENAME;
  return `${baseUrl}${basePath}${path}`;
};

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Обработка подтверждения email (token_hash в query) и OAuth (access_token в hash)
  useEffect(() => {
    const handleAuth = async () => {
      // 1. Обработка hash (OAuth, Magic Link)
      const hash = window.location.hash.substring(1);
      const hashParams = new URLSearchParams(hash);
      const access_token = hashParams.get("access_token");
      const refresh_token = hashParams.get("refresh_token");

      if (access_token && refresh_token) {
        const { error } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });
        if (!error) {
          navigate("/");
        } else {
          console.error("Ошибка установки сессии:", error);
          setError("Не удалось войти через ссылку");
        }
        return; // Важно: после обработки hash не обрабатываем query
      }

      // 2. Обработка query (подтверждение email)
      const queryParams = new URLSearchParams(window.location.search);
      const token_hash = queryParams.get("token_hash");
      const type = queryParams.get("type");

      if (token_hash && type === "email") {
        const { error } = await supabase.auth.verifyOtp({
          token_hash,
          type: "email",
        });
        if (!error) {
          navigate("/");
        } else {
          console.error("Ошибка подтверждения email:", error);
          setError("Не удалось подтвердить email. Попробуйте ещё раз.");
        }
      }
    };

    handleAuth();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setError(error.message);
    else navigate("/");
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: getRedirectUrl("/profile"),
      },
    });
    if (error) setError(error.message);
    else alert("Проверьте почту для подтверждения!");
    setLoading(false);
  };

  return (
    <div>
      <h2>Вход / Регистрация</h2>
      <form>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Загрузка..." : "Войти"}
        </button>
        <button onClick={handleRegister} disabled={loading}>
          Зарегистрироваться
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}