import prismaClient from "../../prisma/prismaclient";

interface ListProductsRequest {
	category_id: string;
	status?: boolean;
}

class ListProductsService {
	async execute({ category_id, status }: ListProductsRequest) {
		const categoryExists = await prismaClient.category.findFirst({
			where: {
				id: category_id,
			},
		});
		if (!categoryExists) {
			throw new Error("Category does not exist");
		}
		const finalStatus = status === undefined ? false : status;
		const products = await prismaClient.product.findMany({
			where: {
				category_id: category_id,
				disabled: finalStatus,
			},
			orderBy: {
				createdAt: "desc",
			},
			include: {
				productsOptionals: {
					where: {
						disabled: status,
					},
					include: {
						optional: true,
					},
				},
			},
		});
		return products;
	}
}

export { ListProductsService };
