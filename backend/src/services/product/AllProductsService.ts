import prismaClient from "../../prisma/prismaclient";

interface ProductRequest {
	status: boolean;
}

class AllProductsService {
	async execute({ status }: ProductRequest) {
		const finalStatus = status === undefined ? false : status;
		const products = await prismaClient.product.findMany({
			where: {
				disabled: finalStatus,
			},
			orderBy: {
				createdAt: "desc",
			},
			include: {
				category: true,
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

export { AllProductsService };
