"use server";

import { Category } from "@/@types/categories";
import { setupApi } from "@/lib/api";

export async function listCategoriesAction() {
	const api = await setupApi();
	try {
		const response = await api.get<Category[]>("/categories");
		return response.data;
	} catch (error) {
		console.error("Erro ao listar categorias:", error);
		return [];
	}
}
