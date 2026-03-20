"use server";

import { setupApi } from "@/lib/api";
import { revalidatePath } from "next/cache";

export async function updateStatusAction({
	status,
	product_id,
}: {
	status: boolean;
	product_id: string;
}) {
	const api = await setupApi();
	try {
		if (!product_id || status === undefined)
			return {
				success: false,
				errors: {
					_form: [
						" Dados de entrada inválidos. Verifique o status e o ID do produto.",
					],
				},
			};
		await api.put(`/products/${product_id}/update-status`, {
			disabled: status,
		});
		revalidatePath("/dashboard/products");
		return { success: true, errors: {} };
	} catch (error: any) {
		// console.error("Error updating product status:", error.response?.data);
		return {
			success: false,
			errors: {
				_form: [
					error.response.data.error ||
						"Erro ao tentar atualizar o status do produto.",
				],
			},
		};
	}
}
