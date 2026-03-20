import { Product } from "@/@types/products";
import { setupApi } from "@/lib/api";

interface DetailProductAction {
	id: string;
}

export async function detailProductAction({ id }: DetailProductAction) {
	if (!id) {
		return {
			success: false,
			errors: {
				_form: ["Id não fornecido."],
			},
		};
	}
	const api = await setupApi();
	try {
		const response = await api.get<Product>(`/products/detail`, {
			params: {
				product_id: id,
			},
		});
		return { success: true, errors: {}, data: response.data };
	} catch (error: any) {
		console.error("Erro ao buscar produto:", error);
		return {
			success: false,
			errors: {
				_form: [
					error.response.data.error || "Erro ao tentar buscar o produto.",
				],
			},
		};
	}
}
