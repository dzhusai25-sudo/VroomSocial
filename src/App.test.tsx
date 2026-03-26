import { render, screen } from "@testing-library/react";
import { App } from './App';
import { MemoryRouter } from "react-router-dom";


describe("App", () => {
  test("рендерит главную страницу по умолчанию", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByText("Home Page")).toBeInTheDocument();
  });
});
