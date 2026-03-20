"use server";

import { setupApi } from "@/lib/api";

interface RemoveOptionalToProductProps {
	productOptional_id: string;
}

export async function removeOptionalToProductAction({
	productOptional_id,
}: RemoveOptionalToProductProps) {
	if (!productOptional_id.trim()) {
		return {
			success: false,
			errors: {
				_form: ["ID do opcional ou do produto inválido."],
			},
		};
	}
	const api = await setupApi();
	try {
		const response = await api.delete(
			`/products/optionals/${productOptional_id}`
		);
		if (response.data.count === 0) {
			return {
				success: false,
				errors: {
					_form: ["Opcional não encontrado."],
				},
			};
		}
		return { success: true, errors: {} };
	} catch (error: any) {
		return {
			success: false,
			errors: {
				_form: [error?.response?.data?.error ?? "Erro ao remover opcional."],
			},
		};
	}
}
