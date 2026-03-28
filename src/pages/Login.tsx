import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from 'react-router-dom';

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

    useEffect(() => {
    const handleVerification = async () => {
      const token = searchParams.get('token');
      const type = searchParams.get('type');
      if (token && type === 'signup') {
        // Попробуем подтвердить через API
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'signup',
        });
        if (error) {
          console.error('Ошибка подтверждения:', error);
        } else {
          // После подтверждения можно перенаправить на главную
          window.location.href = '/';
        }
      }
    };
    handleVerification();
  }, [searchParams]);

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
    const { error } = await supabase.auth.signUp({ email, password });
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
