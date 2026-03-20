"use server";

import { setupApi } from "@/lib/api";
import {
	CreateCategoryData,
	createCategorySchema,
} from "@/schemas/category.schema";

export async function createCategoryAction(data: CreateCategoryData) {
	const parsedData = createCategorySchema.safeParse(data);
	if (!parsedData.success) {
		return {
			success: false,
			errors: parsedData.error.flatten().fieldErrors,
		};
		//flatten está deprecated porem ainda funciona para o proposito deste projeto
	}
	const api = await setupApi();
	try {
		await api.post("/categories", {
			name: parsedData.data.name,
			description: parsedData.data.description,
		});
		return { success: true, errors: {} };
	} catch (error: any) {
		return {
			success: false,
			errors: {
				_form: [
					error.response.data.error ||
						"Erro ao tentar fazer cadastrar uma nova categoria.",
				],
			},
		};
	}
}
