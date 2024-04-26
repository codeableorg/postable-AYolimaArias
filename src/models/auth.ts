import { z } from "zod";

export const userSchema = z.object({
  username: z.string({
    required_error: "Username es requerido",
    invalid_type_error: "Username debe ser un string",
  }),
  email: z
    .string({
      invalid_type_error: "Email debe ser un string",
    })
    .email({ message: "El correo electrónico debe ser valido" })
    .optional(),
  firstname: z
    .string({
      invalid_type_error: "firstName debe ser un string",
    })
    .optional(),
  lastname: z
    .string({
      invalid_type_error: "lastName debe ser un string",
    })
    .optional(),
  password: z
    .string({
      required_error: "Password es requerido",
      invalid_type_error: "Password debe ser un string",
    })
    .min(6, "Password debe tener al menos 6 caracteres"),
  role: z
    .enum(["admin", "user"], {
      errorMap: () => ({ message: "El rol debe ser admin o user" }),
    })
    .default("user"),
  createdat: z.string().optional(),
  updatedat: z.string().optional(),
});

export type UserParams = z.infer<typeof userSchema>;

export type User = UserParams & { id: number };
