import { api } from "@/lib/api";
import { User } from "@/types/auth.types";

export const userService = {
  getProfile: (): Promise<User> => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return api(`/auth/me?token=${token}`);
  },
};
