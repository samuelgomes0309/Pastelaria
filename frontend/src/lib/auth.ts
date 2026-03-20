import { cookies } from "next/headers";
import { setupApi } from "./api";
import { User } from "@/@types/user";
import { redirect } from "next/navigation";

// Nome do cookie onde o token de autenticação será armazenado
const COOKIEE_NAME = "@appSG.token";

// Função para definir o token de autenticação
export async function setAuthToken(token: string) {
	if (!token) {
		return;
	}
	const cookieStore = await cookies();
	cookieStore.set(COOKIEE_NAME, token, {
		httpOnly: true,
		maxAge: 60 * 60 * 24 * 30, // 30 days
		path: "/",
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
	});
	return;
}

// Função para obter o token de autenticação
export async function getAuthToken(): Promise<string | null> {
	const cookieStore = await cookies();
	const token = cookieStore.get(COOKIEE_NAME);
	if (!token) {
		return null;
	}
	return token.value;
}

// Função para limpar o token de autenticação
export async function clearAuthToken() {
	const cookieStore = await cookies();
	cookieStore.delete(COOKIEE_NAME);
	return null;
}

export async function isAuthenticated(): Promise<User | null> {
	try {
		const token = await getAuthToken();
		if (!token) {
			return null;
		}
		const api = await setupApi();
		const response = await api.get<User>("/me", {
			timeout: 1000 * 5, // 5 seconds
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		return null;
	}
}

export async function requireAuth(options: {
	needRole: "ADMIN" | "STAFF";
	redirectTo?: string;
}): Promise<User> {
	const user = await isAuthenticated();
	if (!user) {
		redirect("/login");
	}
	//Por padrão redireciona para o dashboard
	const { needRole, redirectTo = "/dashboard" } = options;
	// ADMIN sempre tem acesso
	if (user.role === "ADMIN") {
		return user;
	}
	// STAFF só acessa STAFF
	if (user.role !== needRole) {
		redirect(redirectTo);
	}
	return user;
}
