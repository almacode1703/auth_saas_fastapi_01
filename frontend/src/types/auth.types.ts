export interface RegisterRequest {
    username: string;
    name: string;
    email: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    message: string;
    token: string;
}

export interface RegisterResponse {
    message: string;
}

export interface OtpRequest {
    email: string;
    otp: string;
}

export interface SendOtpRequest {
    email: string;
}

export interface OtpResponse {
    message: string;
    token: string;
}

export interface SendOtpResponse {
    message: string;
}

export interface User {
    id: number;
    username: string;
    name: string;
    email: string;
    is_active: boolean;
    provider: string;
    avatar: string | null;
    created_at: string;
}