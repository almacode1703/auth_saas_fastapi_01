import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .email({ error: "Invalid Email Address" })
    .check(z.refine((val) => val.length > 0, { error: "Email is required" })),
  password: z
    .string()
    .min(1, {error : "Password Required"}),
});

export type LoginFormData = z.infer<typeof loginSchema>;
