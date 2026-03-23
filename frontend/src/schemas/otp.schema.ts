import { z } from "zod";

export const otpSchema = z.object({
  email: z
    .email({ error: "Invalid email address" }),
  otp: z
    .string()
    .length(6, { error: "OTP must be 6 digits" }),
});

export type OtpFormData = z.infer<typeof otpSchema>;