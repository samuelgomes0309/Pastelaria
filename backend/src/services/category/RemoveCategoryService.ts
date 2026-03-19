import prismaClient from "../../prisma/prismaclient";

interface RemoveCategoryRequest {
	category_id: string;
}

class RemoveCategoryService {
	async execute({ category_id }: RemoveCategoryRequest) {
		const category = await prismaClient.category.findFirst({
			where: { id: category_id },
		});
		if (!category) {
			throw new Error("Category not found");
		}
		// Verifica se há produtos associados à categoria e se esses produtos estão em algum pedido
		const ordersWithCategory = await prismaClient.order.findFirst({
			where: {
				items: {
					some: {
						product: {
							category_id: category_id,
						},
					},
				},
			},
		});
		if (ordersWithCategory) {
			throw new Error(
				"Cannot delete category because there are orders associated with its products"
			);
		}
		// Se não houver pedidos associados a produtos dessa categoria, pode deletar
		return await prismaClient.category.delete({
			where: { id: category_id },
		});
	}
}

export { RemoveCategoryService };
