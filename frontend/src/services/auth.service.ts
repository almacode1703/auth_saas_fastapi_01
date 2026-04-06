import { api } from "@/lib/api";
import { API_URL } from "@/lib/constants";
import {
  RegisterRequest,
  LoginRequest,
  LoginResponse,
  RegisterResponse,
  OtpRequest,
  OtpResponse,
  SendOtpRequest,
  SendOtpResponse,
  User,
} from "@/types/auth.types";

export const authService = {
  uploadAvatar: async (
    file: File,
  ): Promise<{ message: string; avatar_url: string }> => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      `${API_URL}/auth/profile/avatar?token=${token}`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ detail: "Upload failed" }));
      throw error;
    }

    return response.json();
  },

  removeAvatar: async (): Promise<{ message: string }> => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const response = await fetch(
      `${API_URL}/auth/profile/avatar?token=${token}`,
      {
        method: "DELETE",
      },
    );

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ detail: "Remove failed" }));
      throw error;
    }

    return response.json();
  },

  updateProfile: async (data: {
    name?: string;
    username?: string;
    phone?: string;
  }) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const response = await fetch(
      `${API_URL}/auth/profile/update?token=${token}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
    );

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ detail: "Update failed" }));
      throw error;
    }

    return response.json();
  },
  register: (data: RegisterRequest): Promise<RegisterResponse> => {
    return api("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  login: (data: LoginRequest): Promise<LoginResponse> => {
    return api("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  verifyOtp: (data: OtpRequest): Promise<OtpResponse> => {
    return api("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  sendOtp: (data: SendOtpRequest): Promise<SendOtpResponse> => {
    return api("/auth/send-otp", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getMe: (): Promise<User> => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return api(`/auth/me?token=${token}`);
  },
};
