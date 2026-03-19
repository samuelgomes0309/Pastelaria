import z from "zod";

export const createOptionalSchema = z.object({
	body: z.object({
		name: z.string().min(1, "Name is required"),
		price: z.number().min(0, "Price must be at least 0"),
	}),
});

export const detailOptionalSchema = z.object({
	params: z.object({
		optional_id: z.string().min(1, "Optional ID is required"),
	}),
});
