import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";

jest.mock("../hooks/useAuth", () => ({
  useAuth: () => ({ user: null, loading: false }),
}));

describe("ProtectedRoute", () => {
  it("редиректит на логин", () => {
    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <div>Protected</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login</div>} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });
});
