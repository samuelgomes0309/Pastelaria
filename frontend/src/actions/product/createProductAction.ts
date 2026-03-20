"use server";

import { setupApi } from "@/lib/api";
import {
	CreateProductOutput,
	createProductServerSchema,
} from "@/schemas/product.schema";

export async function createProductAction(data: CreateProductOutput) {
	const parsedData = createProductServerSchema.safeParse(data);
	if (!parsedData.success) {
		return {
			success: false,
			errors: parsedData.error.flatten().fieldErrors,
		};
	}
	const api = await setupApi();
	try {
		// A API espera o preço em centavos, então multiplicamos por 100
		// arredondamos para evitar problemas de precisão com números decimais
		const priceInCents = Math.round(parsedData.data.price * 100);
		//Necessario criar um formData para enviar o arquivo de imagem
		const formData = new FormData();
		formData.append("name", parsedData.data.name);
		formData.append("description", parsedData.data.description);
		formData.append("price", priceInCents.toString());
		formData.append("category_id", parsedData.data.category_id);
		formData.append("file", parsedData.data.image);
		await api.post("/products", formData);
		return { success: true, errors: {} };
	} catch (error: any) {
		console.error("Erro ao criar produto:", error);
		return {
			success: false,
			errors: {
				_form: [
					error.response.data.error ||
						"Erro ao tentar fazer cadastrar um novo produto.",
				],
			},
		};
	}
}
