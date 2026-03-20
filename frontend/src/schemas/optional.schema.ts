import z from "zod";

export const createOptionalSchema = z.object({
	name: z
		.string()
		.min(3, "O nome do opcional deve ter pelo menos 3 caracteres"),
	price: z
		.string()
		.min(1, "O preço é obrigatório")
		.transform((value) => value.replace(",", "."))
		.refine((value) => !isNaN(Number(value)), {
			message: "Preço inválido",
		})
		.transform((value) => Number(value))
		.refine((value) => value > 0, {
			message: "O preço deve ser maior que zero",
		}),
});

export type CreateOptionalInput = z.input<typeof createOptionalSchema>;
export type CreateOptionalOutput = z.output<typeof createOptionalSchema>;

export const createOptionalServerSchema = z.object({
	name: z.string(),
	price: z.number().positive(),
});

export type CreateProductServerOutput = z.infer<
	typeof createOptionalServerSchema
>;
