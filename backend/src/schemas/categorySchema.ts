import z from "zod";

export const createCategorySchema = z.object({
	body: z.object({
		name: z.string().min(3, "Name must be at least 3 characters long"),
		description: z.string().optional(),
	}),
});

export const detailCategorySchema = z.object({
	params: z.object({
		category_id: z.string().min(1, "Category ID is required"),
	}),
});

export const removeCategorySchema = z.object({
	params: z.object({
		category_id: z.string().min(1, "Category ID is required"),
	}),
});

export const updateCategorySchema = z.object({
	params: z.object({
		category_id: z.string().min(1, "Category ID is required"),
	}),
	body: z.object({
		name: z
			.string()
			.min(3, "Name must be at least 3 characters long")
			.optional(),
		description: z.string().optional(),
	}),
});
