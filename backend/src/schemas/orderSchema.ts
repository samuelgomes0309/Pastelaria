import z from "zod";

export const createOrderSchema = z.object({
	body: z.object({
		table: z.number().min(1, "Table number must be at least 1"),
		name: z.string().optional(),
	}),
});

export const addProductOrderSchema = z.object({
	body: z.object({
		order_id: z.string().min(1, "Order ID is required"),
		product_id: z.string().min(1, "Product ID is required"),
		amount: z.number().min(1, "Amount must be at least 1"),
		optional_id: z.string().min(1, "Optional ID is required").optional(),
	}),
});

export const removeProductOrderSchema = z.object({
	params: z.object({
		item_id: z.string().min(1, "Item ID is required"),
	}),
	query: z.object({
		order_id: z.string().min(1, "Order ID is required"),
	}),
});

export const detailOrderSchema = z.object({
	params: z.object({
		order_id: z.string().min(1, "Order ID is required"),
	}),
});

export const removeOrderSchema = z.object({
	params: z.object({
		order_id: z.string().min(1, "Order ID is required"),
	}),
});

export const sendOrderSchema = z.object({
	params: z.object({
		order_id: z.string().min(1, "Order ID is required"),
	}),
});

export const finishOrderSchema = z.object({
	params: z.object({
		order_id: z.string().min(1, "Order ID is required"),
	}),
});
