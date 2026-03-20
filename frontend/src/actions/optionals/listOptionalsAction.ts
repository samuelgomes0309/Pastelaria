import { Optional } from "@/@types/optionals";
import { setupApi } from "@/lib/api";

export async function listOptionalsAction() {
	const api = await setupApi();
	try {
		const response = await api.get<Optional[]>("/optionals");
		return response.data;
	} catch (error) {
		console.error("Erro ao listar opcionais:", error);
		return [];
	}
}
