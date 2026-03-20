"use server";

import { Order } from "@/@types/order";
import { setupApi } from "@/lib/api";

export async function listOrdersAction() {
	const api = await setupApi();
	try {
		const response = await api.get<Order[]>("/orders");
		return response.data;
	} catch (error: any) {
		console.error("Erro ao listar pedidos:", error);
		return [];
	}
}
