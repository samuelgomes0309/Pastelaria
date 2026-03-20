"use server";

import { setupApi } from "@/lib/api";

interface AddOptionalToProductProps {
	optional_id: string;
	product_id: string;
}

export async function addOptionalToProductAction({
	optional_id,
	product_id,
}: AddOptionalToProductProps) {
	if (!optional_id.trim() || !product_id.trim()) {
		return {
			success: false,
			errors: {
				_form: ["ID do opcional ou do produto inválido."],
			},
		};
	}
	const api = await setupApi();
	try {
		const response = await api.post("/products/optionals", {
			optional_id,
			product_id,
		});
		return { success: true, errors: {}, data: response.data };
	} catch (error: any) {
		return {
			success: false,
			errors: {
				_form: [
					error.response.data.error ||
						"Erro ao tentar adicionar novo opcional.",
				],
			},
		};
	}
}
