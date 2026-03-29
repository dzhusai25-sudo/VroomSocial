import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { NotFound } from "./NotFound";

describe("NotFound", () => {
  it("отображает сообщение 404", () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>,
    );
    expect(screen.getByText(/404/i)).toBeInTheDocument();
  });
});
