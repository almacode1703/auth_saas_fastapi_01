import { create } from "zustand";
import { User } from "@/types/auth.types";

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,

  setUser: (user) => set({ user }),

  setToken: (token) => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
    set({ token });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },
}));

// Hydrate token from localStorage on client side only
if (typeof window !== "undefined") {
  const token = localStorage.getItem("token");
  if (token) {
    useAuthStore.setState({ token });
  }
}