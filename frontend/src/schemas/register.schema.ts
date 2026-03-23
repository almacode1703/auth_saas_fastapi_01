import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, { error: "Username must be at least 3 characters" }),
  name: z
    .string()
    .min(1, { error: "Name is required" }),
  email: z
    .email({ error: "Invalid email address" }),
  password: z
    .string()
    .min(6, { error: "Password must be at least 6 characters" }),
});

export type RegisterFormData = z.infer<typeof registerSchema>;