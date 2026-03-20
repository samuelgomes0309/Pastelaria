"use server";

import { Product } from "@/@types/products";
import { setupApi } from "@/lib/api";
import {
	UpdateProductServerOutput,
	updateProductServerSchema,
} from "@/schemas/product.schema";

export async function updateProductAction({
	data,
	product,
}: {
	data: UpdateProductServerOutput;
	product: Product;
}) {
	if (!product.id) {
		return {
			success: false,
			errors: {
				_form: ["Erro ao tentar atualizar o produto | ID inválido."],
			},
		};
	}
	const parsedData = updateProductServerSchema.safeParse(data);
	if (!parsedData.success) {
		return {
			success: false,
			errors: parsedData.error.flatten().fieldErrors,
		};
	}
	const api = await setupApi();
	try {
		// //Necessario criar um formData para enviar o arquivo de imagem
		const formData = new FormData();
		const { name, description, price, image } = parsedData.data;
		if (name !== undefined && name !== product.name) {
			formData.append("name", name);
		}
		if (description !== undefined && description !== product.description) {
			formData.append("description", description);
		}
		if (price !== undefined) {
			const priceInCents = Math.round(price * 100);
			if (priceInCents !== product.price) {
				formData.append("price", String(priceInCents));
			}
		}
		if (image !== undefined) {
			formData.append("file", image);
		}
		if ([...formData.keys()].length === 0) {
			return {
				success: false,
				errors: { _form: ["Nenhuma alteração foi feita."] },
			};
		}
		await api.put(`/products/${product.id}`, formData);
		return { success: true, errors: {} };
	} catch (error: any) {
		console.error("Erro ao atualizar produto:", error);
		return {
			success: false,
			errors: {
				_form: [
					error.response.data.error || "Erro ao tentar atualizar o produto.",
				],
			},
		};
	}
}
