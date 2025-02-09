import { create } from "zustand";

interface AuthState {
  user: null | { username: string };
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  login: async (username, password) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      credentials: "include", // Important for cookies
    });

    if (!res.ok) throw new Error("Login failed");

    await useAuthStore.getState().checkAuth();
  },

  logout: async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    set({ user: null });
  },

  checkAuth: async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/me`, {
      method: "GET",
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();
      set({ user: data.user });
    } else {
      set({ user: null });
    }
  },
}));
