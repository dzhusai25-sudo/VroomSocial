import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>404 форбидден</h1>
      <p>Ты искал и не нашел 😕</p>
      <p>если оказался тут случайно - ну тогда прими это</p>
      <Link to="/">Вернуться на главную</Link>
    </div>
  );
}