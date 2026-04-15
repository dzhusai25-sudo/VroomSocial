import { renderHook, waitFor } from "@testing-library/react";
import { useProfile } from "./useProfile";

jest.mock("../lib/supabase", () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest
      .fn()
      .mockResolvedValue({ data: { display_name: "John" }, error: null }),
    upsert: jest.fn().mockResolvedValue({ error: null }),
  },
}));
jest.mock("./useAuth", () => ({ useAuth: () => ({ user: { id: "123" } }) }));

describe("useProfile", () => {
  it("загружает профиль", async () => {
    const { result } = renderHook(() => useProfile());
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.displayName).toBe("John");
  });

  it("обновляет имя", async () => {
    const { result } = renderHook(() => useProfile());
    await waitFor(() => !result.current.loading);
    const success = await result.current.updateDisplayName("Jane");
    expect(success).toBe(true);
  });
});
