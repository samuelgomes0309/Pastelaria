"use server";

import { setupApi } from "@/lib/api";
import {
	createOptionalServerSchema,
	CreateProductServerOutput,
} from "@/schemas/optional.schema";

export async function createOptionalAction(data: CreateProductServerOutput) {
	const parsedData = createOptionalServerSchema.safeParse(data);
	if (!parsedData.success) {
		return {
			success: false,
			errors: parsedData.error.flatten().fieldErrors,
		};
		//flatten está deprecated porem ainda funciona para o proposito deste projeto
	}
	const api = await setupApi();
	try {
		const { name, price } = parsedData.data;
		const priceInCents = Math.round(price * 100);
		await api.post("/optionals", {
			name,
			price: priceInCents,
		});
		return { success: true, errors: {} };
	} catch (error: any) {
		return {
			success: false,
			errors: {
				_form: [
					error.response.data.error ||
						"Erro ao tentar fazer cadastrar um novo opcional.",
				],
			},
		};
	}
}
