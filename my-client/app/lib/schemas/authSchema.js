import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().regex(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, {
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, "At least 6 characters"),
});

export const registerSchema = z
  .object({
    name: z.string(),
    email: z.string().regex(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, {
      message: "Please enter a valid email address.",
    }),
    password: z.string().min(6, "At least 6 characters"),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password don't match",
    path: ["confirmPassword"],
  });
