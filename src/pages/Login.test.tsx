import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Login } from "./Login";
import { supabase } from "../lib/supabase";

jest.mock("../lib/supabase", () => ({
  supabase: {
    auth: {
      getUser: jest
        .fn()
        .mockResolvedValue({ data: { user: { id: "test" } }, error: null }),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
    },
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
    delete: jest.fn(),
    storage: {
      from: jest.fn().mockReturnThis(),
      upload: jest.fn(),
      getPublicUrl: jest.fn().mockReturnValue({ data: { publicUrl: "test" } }),
    },
  },
}));

describe("Login", () => {
  it("отображает форму входа", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/пароль/i)).toBeInTheDocument();
  });

  it("вызывает signInWithPassword при отправке формы", async () => {
    const mockSignIn = jest
      .fn()
      .mockResolvedValue({ data: { user: {} }, error: null });
    (supabase.auth.signInWithPassword as jest.Mock) = mockSignIn;

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/пароль/i), {
      target: { value: "password" },
    });
    fireEvent.click(screen.getByText("Войти"));

    await waitFor(() =>
      expect(mockSignIn).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password",
      }),
    );
  });
});
