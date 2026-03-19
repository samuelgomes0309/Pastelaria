import prismaClient from "../../prisma/prismaclient";

interface UpdateCategoryRequest {
	category_id: string;
	name?: string;
	description?: string;
}

class UpdateCategoryService {
	async execute({ category_id, name, description }: UpdateCategoryRequest) {
		const category = await prismaClient.category.update({
			where: {
				id: category_id,
			},
			data: {
				name,
				description,
			},
		});
		return category;
	}
}

export { UpdateCategoryService };
