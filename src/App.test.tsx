import { render, screen } from "@testing-library/react";
import { App } from './App';
import { MemoryRouter } from "react-router-dom";

describe("App", () => {
  test("some test", () => expect(App).toBeInstanceOf(Function));

  test("рендерит навигационную ссылку", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByText("Главная")).toBeInTheDocument();
  });

  test('demo test', () => {
    expect(1).toBe(1);
  });
});