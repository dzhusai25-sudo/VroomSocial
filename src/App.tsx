import "./App.css";
import { Routes, Route, NavLink } from "react-router-dom";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Login } from "./pages/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";
import { CreateImpression } from "./pages/CreateImpression";
import { Profile } from "./pages/Profile";
import { useProfile } from "./hooks/useProfile";
import { ImpressionDetail } from "./pages/ImpressionDetail";
import { NotFound } from "./pages/NotFound";

export function App() {
  const { user, signOut } = useAuth();
  const { displayName } = useProfile();

  return (
    <div className="App">
      {user && (
  <span>
    Йоу
    {displayName ? `, ${displayName} 🚗` : '. NONAME USER??🧐 Скорее заполни профиль и делись впечатлениями!'}
  </span>
)}
      <nav className="navi">
        <NavLink to="/">Главная</NavLink>
        <NavLink to="/about">О сайте</NavLink>
        {user ? (
          <>
            <NavLink to="/profile">Профиль</NavLink>
            
            <button onClick={signOut}>Выйти</button>
          </>
        ) : (
          <NavLink to="/login">Войти</NavLink>
        )}
        {user && displayName && <NavLink to="/create">Добавить впечатление</NavLink>}
      </nav>
    <main className="main-content">   
      <header>
<p>
  <strong >Vr<span style={{ fontSize: '0.6em' }}>🛞🛞</span>mSocial</strong>{' '}
  — место, где автомобильные энтузиасты делятся своими впечатлениями.
</p>
      </header>

      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateImpression />
            </ProtectedRoute>
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/impression/:id" element={<ProtectedRoute><ImpressionDetail /></ProtectedRoute>} />
        <Route path="/*" element={<NotFound />} /> {/* 404 page */}
      </Routes>
          </main>
      <footer className="footer">
        © 2026 VroomSocial. Все права защищены.
      </footer>
    </div>
  );
}
