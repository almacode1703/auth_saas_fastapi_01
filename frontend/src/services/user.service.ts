import { api } from "@/lib/api";
import { User } from "@/types/auth.types";

export const userService = {
  getProfile: (): Promise<User> => {
    return api("/auth/me");
  },
};