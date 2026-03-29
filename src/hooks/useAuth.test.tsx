import { renderHook } from "@testing-library/react";
import { useAuth } from "./useAuth";

jest.mock("../lib/supabase", () => ({
  supabase: {
    auth: {
      onAuthStateChange: jest
        .fn()
        .mockReturnValue({
          data: { subscription: { unsubscribe: jest.fn() } },
        }),
      signOut: jest.fn(),
    },
  },
}));

describe("useAuth", () => {
  it("возвращает объект с user, loading, signOut", () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current).toHaveProperty("user");
    expect(result.current).toHaveProperty("loading");
    expect(result.current).toHaveProperty("signOut");
  });
});
