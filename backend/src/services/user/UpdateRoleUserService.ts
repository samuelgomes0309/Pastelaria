import prismaClient from "../../prisma/prismaclient";

interface UpdateRoleUserRequest {
	email: string;
	new_role: "ADMIN" | "STAFF";
	user_id: string;
}

class UpdateRoleUserService {
	async execute({ new_role, email, user_id }: UpdateRoleUserRequest) {
		const user = await prismaClient.user.findUnique({
			where: { email },
		});
		if (!user) {
			throw new Error("User not found");
		}
		// Impedir que o usuário altere seu próprio papel e tmbém impedir que altere o papel do usuário root
		if (user.id === user_id || user.isRoot) {
			throw new Error("You cannot change your own role");
		}
		if (user.role === new_role) {
			throw new Error("You cannot change the role to the same role");
		}
		const updatedUser = await prismaClient.user.update({
			where: { id: user.id },
			data: { role: new_role },
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
			},
		});
		return updatedUser;
	}
}

export { UpdateRoleUserService };
