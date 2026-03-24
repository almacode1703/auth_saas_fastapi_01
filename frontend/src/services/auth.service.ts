import { api } from "@/lib/api";
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
    return api("/auth/me");
  },
};