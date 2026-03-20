import z from "zod";

export const createCategorySchema = z.object({
	name: z
		.string()
		.min(3, "O nome da categoria deve ter pelo menos 3 caracteres"),
	description: z.string().optional(),
});

export type CreateCategoryData = z.infer<typeof createCategorySchema>;
