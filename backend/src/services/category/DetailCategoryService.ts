import prismaClient from "../../prisma/prismaclient";

interface ListCategoriesRequest {
	category_id: string;
}

class DetailCategoryService {
	async execute({ category_id }: ListCategoriesRequest) {
		const category = await prismaClient.category.findFirst({
			where: {
				id: category_id,
			},
		});
		if (!category) {
			throw new Error("Category not found");
		}
		return category;
	}
}

export { DetailCategoryService };
