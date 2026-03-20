"use server";

import { setupApi } from "@/lib/api";

interface FinishOrderActionProps {
	order_id: string;
}

export async function finishOrderAction({ order_id }: FinishOrderActionProps) {
	const api = await setupApi();
	try {
		await api.patch(`/orders/${order_id}/finish`);
		return { success: true, errors: {} };
	} catch (error: any) {
		console.error("Erro ao finalizar pedido:", error);
		return {
			success: false,
			errors: {
				_form: [error.response.data.error || "Erro ao finalizar pedido."],
			},
		};
	}
}
