import prismaClient from "../../prisma/prismaclient";

class ListCategoriesService {
	async execute() {
		const categories = await prismaClient.category.findMany({
			select: {
				id: true,
				name: true,
				description: true,
				createdAt: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		});
		if (!categories) {
			throw new Error("No categories found");
		}
		return categories;
	}
}

export { ListCategoriesService };
