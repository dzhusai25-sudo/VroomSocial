import { render, screen } from "@testing-library/react";
import { Home } from "./Home";

describe("Home", () => {
  it("отображает приветствие", () => {
    render(<Home />);
    expect(screen.getByText("Hello Application!")).toBeInTheDocument();
  });
});