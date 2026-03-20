"use server";

import { AuthResponse } from "@/@types/user";
import { setupApi } from "@/lib/api";
import { setAuthToken } from "@/lib/auth";
import { LoginData, loginSchema } from "@/schemas/login.schema";

export async function loginUserAction(data: LoginData) {
	// Validação no lado do servidor
	const parsedData = loginSchema.safeParse(data);
	if (!parsedData.success) {
		return { success: false, errors: parsedData.error.flatten().fieldErrors }; // Retorna erros de validação ao cliente referente aos campos
	}
	// Não precisa de passar o cookie no servidor, pois o usuario ainda não está autenticado
	const api = await setupApi();
	try {
		const response = await api.post<AuthResponse>("/sessions", {
			email: parsedData.data.email,
			password: parsedData.data.password,
		});
		if (response.status === 200) {
			// Login bem-sucedido então injetamos o token no cookie
			const { token } = response.data;
			// Verifica se o token existe antes de definir o cabeçalho, pois pode haver falha na autenticação
			if (!token) {
				return {
					success: false,
					errors: {
						_form: ["Erro ao validar token do usuário."],
					},
				};
			}
			// Salva o token no cookie HTTP-only
			await setAuthToken(token);
		}
		return { success: true, errors: {} };
	} catch (error: any) {
		return {
			success: false,
			errors: {
				_form: [
					error.response.data.error || "Erro ao tentar fazer login do usuário.",
				],
			},
		};
	}
}
