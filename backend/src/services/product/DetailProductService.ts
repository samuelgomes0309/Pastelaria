import prismaClient from "../../prisma/prismaclient";

interface DetailProductRequest {
	product_id: string;
}

class DetailProductService {
	async execute({ product_id }: DetailProductRequest) {
		const product = await prismaClient.product.findFirst({
			where: {
				id: product_id,
			},
			include: {
				category: true,
				productsOptionals: {
					where: {
						disabled: false,
					},
					include: {
						optional: true,
					},
				},
			},
		});
		if (!product) {
			throw new Error("Product does not exist");
		}
		return product;
	}
}

export { DetailProductService };
