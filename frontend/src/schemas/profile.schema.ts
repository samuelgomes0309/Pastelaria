import z from "zod";

export const updateRoleSchema = z.object({
	email: z.email("Email inválido"),
	role: z.enum(["ADMIN", "STAFF"], "Tipo de permissão inválido"),
});

export type UpdateRoleData = z.infer<typeof updateRoleSchema>;
