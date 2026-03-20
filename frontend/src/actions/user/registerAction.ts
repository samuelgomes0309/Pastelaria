"use server";

import { User } from "@/@types/user";
import { setupApi } from "@/lib/api";
import { registerSchema, RegisterData } from "@/schemas/login.schema";

export async function registerUserAction(data: RegisterData) {
	// Validação no lado do servidor
	const parsedData = registerSchema.safeParse(data);
	if (!parsedData.success) {
		return { success: false, errors: parsedData.error.flatten().fieldErrors }; // Retorna erros de validação ao cliente referente aos campos
	}
	// Não precisa de passar o cookie no servidor, pois o usuario ainda não está autenticado
	const api = await setupApi();
	try {
		await api.post<User>("/users", {
			name: parsedData.data.name,
			email: parsedData.data.email,
			password: parsedData.data.password,
		});
		return { success: true };
	} catch (error: any) {
		return {
			success: false,
			errors: {
				apiError: [
					error.response?.data?.message || "Erro ao registrar usuario.",
				],
			},
		};
	}
}
