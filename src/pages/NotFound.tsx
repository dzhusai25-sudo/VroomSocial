import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>404 форбидден</h1>
      <p>Ты искал и не нашел 😕</p>
      <p>Если оказался тут случайно - уходи, делать здесь нечего.</p>
      <Link to="/">Понял, понял. Ухожу.</Link>
    </div>
  );
}
