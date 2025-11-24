import { z } from "zod";

export const RegisterSchema = z
  .object({
    firstName: z.string().min(1, { message: "First name is required." }),
    lastName: z.string().min(1, { message: "Last name is required." }),
    email: z.email({ message: "Please enter a valid email." }),
    gender: z.string().min(1, { message: "Gender is required." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type RegisterUserForm = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: z.email({ message: "Please enter a valid email." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export type LoginFormFields = z.infer<typeof LoginSchema>;

export const ResetPasswordSchema = z.object({
  email: z.email({ message: "Please enter a valid email." }),
});

export type ResetPasswordForm = z.infer<typeof ResetPasswordSchema>;

export const ResetPasswordConfirmSchema = z
  .object({
    new_password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." }),
    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match.",
    path: ["confirm_password"],
  });

export type ResetPasswordConfirmForm = z.infer<
  typeof ResetPasswordConfirmSchema
>;
