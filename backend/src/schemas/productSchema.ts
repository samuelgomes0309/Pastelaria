import z from "zod";

export const createProductSchema = z.object({
	body: z.object({
		name: z.string().min(3, "Name must be at least 3 characters long"),
		price: z.string().min(1, "Price is required").regex(/^\d+$/, "Price must contain only numbers"),
		description: z
			.string()
			.min(10, "Description must be at least 10 characters long"),
		category_id: z.string().min(1, "Category ID is required"),
	}),
});

export const detailProductSchema = z.object({
	query: z.object({
		product_id: z.string().min(1, "Product ID is required"),
	}),
});

export const listProductsSchema = z.object({
	query: z.object({
		category_id: z.string().min(1, "Category ID is required"),
		status: z.enum(["true", "false"]).optional(),
	}),
});

export const addOptionalToProductSchema = z.object({
	body: z.object({
		optional_id: z.string().min(1, "Optional ID is required"),
		product_id: z.string().min(1, "Product ID is required"),
	}),
});

export const updateStatusProductSchema = z.object({
	params: z.object({
		product_id: z.string().min(1, "Product ID is required"),
	}),
	body: z.object({
		disabled: z.boolean(),
	}),
});

export const removeOptionalToProductSchema = z.object({
	params: z.object({
		product_optional_id: z.string().min(1, "Product optional ID is required"),
	}),
});

export const updateProductSchema = z.object({
	body: z.object({
		name: z
			.string()
			.min(3, "Name must be at least 3 characters long")
			.optional(),
		price: z.string().min(1, "Price is required").regex(/^\d+$/, "Price must contain only numbers").optional(),
		description: z
			.string()
			.min(10, "Description must be at least 10 characters long")
			.optional(),
	}),
	params: z.object({
		product_id: z.string().min(1, "Product ID is required"),
	}),
});
