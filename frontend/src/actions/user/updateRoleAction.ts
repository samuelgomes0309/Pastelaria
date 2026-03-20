"use server";

import { setupApi } from "@/lib/api";
import { UpdateRoleData, updateRoleSchema } from "@/schemas/profile.schema";

export async function updateRoleAction(data: UpdateRoleData) {
	const parsedData = updateRoleSchema.safeParse(data);
	if (!parsedData.success) {
		return {
			success: false,
			errors: {
				_form: ["Dados inválidos."],
			},
		};
	}
	const api = await setupApi();
	try {
		await api.patch("/users/role", parsedData.data);
		return { success: true, errors: {} };
	} catch (error: any) {
		return {
			success: false,
			errors: {
				_form: [
					error.response.data.error ||
						"Erro ao tentar atualizar a permissão do usuário.",
				],
			},
		};
	}
}
