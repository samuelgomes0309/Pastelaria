import { z } from "zod";

// Schema de validação para registro de usuário
export const registerSchema = z.object({
	name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
	email: z.email("Endereço de e-mail inválido"),
	password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export type RegisterData = z.infer<typeof registerSchema>;

// Schema de validação para login de usuário
export const loginSchema = z.object({
	email: z.email("Endereço de e-mail inválido"),
	password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export type LoginData = z.infer<typeof loginSchema>;
