import prismaClient from "../../prisma/prismaclient";

interface DetailUserRequest {
	user_id: string;
}

class DetailUserService {
	async execute({ user_id }: DetailUserRequest) {
		const user = await prismaClient.user.findFirst({
			where: { id: user_id },
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
			},
		});
		if (!user) {
			throw new Error("User not found");
		}
		return user;
	}
}

export { DetailUserService };
