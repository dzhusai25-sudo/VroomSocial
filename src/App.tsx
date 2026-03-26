import "./App.css";
import { Routes, Route, NavLink } from "react-router-dom";
import { Home } from "./pages/Home";

export function App() {
  return (
    <div className="App">
      <nav className="navi">
        <NavLink to="/">Главная</NavLink>
        {/* <NavLink to="/about">О приложении</NavLink> */}
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/about" element={<About />} /> */}
        <Route path="/*" element={<Home />} /> {/* редирект с 404 на HomePage */}
      </Routes>
    </div>
  );
}
