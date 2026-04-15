import { render, screen } from "@testing-library/react";
import { About } from "./About";

describe("About", () => {
  it("отображает приветствие", () => {
    render(<About />);
    expect(screen.getByText("✨ Здесь каждый может:")).toBeInTheDocument();
  });
});
