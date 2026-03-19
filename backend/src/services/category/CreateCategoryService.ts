import prismaClient from "../../prisma/prismaclient";

interface CreateCategoryRequest {
	name: string;
	description?: string;
	user_id: string;
}

class CreateCategoryService {
	async execute({ description, name, user_id }: CreateCategoryRequest) {
		const findUser = await prismaClient.user.findUnique({
			where: {
				id: user_id,
			},
		});
		if (!findUser) {
			throw new Error("User not found");
		}
		const category = await prismaClient.category.create({
			data: {
				name,
				description: description || null,
			},
			select: {
				id: true,
				name: true,
				description: true,
				createdAt: true,
			},
		});
		return category;
	}
}

export { CreateCategoryService };
