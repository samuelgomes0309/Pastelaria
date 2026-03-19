import z from "zod";

// Schema para criar um novo usuário
export const createUserSchema = z.object({
	body: z.object({
		name: z.string().min(3, "Name must be at least 3 characters long"),
		email: z.email("Invalid email address"),
		password: z.string().min(6, "Password must be at least 6 characters long"),
	}),
});

export const loginUserSchema = z.object({
	body: z.object({
		email: z.email("Invalid email address"),
		password: z.string().min(6, "Password must be at least 6 characters long"),
	}),
});

export const updateRoleUserSchema = z.object({
	body: z.object({
		email: z.email("Invalid email address"),
		role: z.enum(["ADMIN", "STAFF"], {
			message: "Role must be either ADMIN or STAFF",
		}),
	}),
});
