import z from "zod";

const imageSchema = z
	.instanceof(File, {
		message: "Arquivo inválido",
	})
	.refine((file) => file.size <= 5 * 1024 * 1024, {
		message: "A imagem deve ter no máximo 5MB",
	})
	.refine(
		(file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
		{
			message: "Formato inválido (JPG, PNG ou WEBP)",
		}
	);

export const createProductSchema = z.object({
	name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
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
	description: z
		.string()
		.min(10, "A descrição deve ter pelo menos 10 caracteres"),
	category_id: z.string("Categoria inválida"),
	image: imageSchema,
});

// Tipos para uso em formulários e ações
export type CreateProductInput = z.input<typeof createProductSchema>;
export type CreateProductOutput = z.output<typeof createProductSchema>;

// Schema para validação no servidor, onde o preço já é um número e a imagem é um File
export const createProductServerSchema = z.object({
	name: z.string(),
	price: z.number().positive(),
	description: z.string(),
	category_id: z.string(),
	image: imageSchema,
});

// Tipo para uso na ação do servidor, garantindo que os dados estejam no formato correto
export type CreateProductServerOutput = z.infer<
	typeof createProductServerSchema
>;

//-------------------------------------------------//

// Schema para atualizar um produto
export const updateProductSchema = z.object({
	name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres").optional(),
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
		})
		.optional(),
	description: z
		.string()
		.min(10, "A descrição deve ter pelo menos 10 caracteres")
		.optional(),
	image: imageSchema.optional(),
});

// Tipos para uso em formulários e ações
export type UpdateProductInput = z.input<typeof updateProductSchema>;
export type UpdateProductOutput = z.output<typeof updateProductSchema>;

export const updateProductServerSchema = z.object({
	name: z.string().optional(),
	price: z.number().positive().optional(),
	description: z.string().optional(),
	image: imageSchema.optional(),
});

export type UpdateProductServerOutput = z.infer<
	typeof updateProductServerSchema
>;
