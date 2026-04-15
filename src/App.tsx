import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Login } from "./pages/Login";
import { Profile } from "./pages/Profile";
import { CreateImpression } from "./pages/CreateImpression";
import { ImpressionDetail } from "./pages/ImpressionDetail";
import { NotFound } from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Navi } from "./components/Navi";

export function App() {
  return (
    <div className="App">
      <Navi />
      <main className="main-content">
        <header>
          <p>
            <strong>
              Vr<span style={{ fontSize: "0.6em" }}>🛞🛞</span>mSocial
            </strong>{" "}
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
          <Route
            path="/impression/:id"
            element={
              <ProtectedRoute>
                <ImpressionDetail />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="footer">
        © 2026 VroomSocial. Все права защищены.
      </footer>
    </div>
  );
}
