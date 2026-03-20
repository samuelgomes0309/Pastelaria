import { Product } from "@/@types/products";
import { setupApi } from "@/lib/api";

interface ListProductRequest {
	status?: boolean;
}

export async function listProductsAction({ status }: ListProductRequest) {
	const api = await setupApi();
	try {
		const response = await api.get<Product[]>("/products/all", {
			params: {
				status: status ?? false, // Caso nao tenha um status por padrao filtra apenas os produtos ativos
			},
		});
		return response.data;
	} catch (error) {
		console.error("Erro ao listar produtos:", error);
		return [];
	}
}
