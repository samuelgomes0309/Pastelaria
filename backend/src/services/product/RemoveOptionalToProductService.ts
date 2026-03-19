import prismaClient from "../../prisma/prismaclient";

interface RemoveOptionalToProductRequest {
	product_optional_id: string;
}
class RemoveOptionalToProductService {
	async execute({ product_optional_id }: RemoveOptionalToProductRequest) {
		const product = await prismaClient.productsOptionals.deleteMany({
			where: {
				id: product_optional_id,
			},
		});
		if (!product) {
			throw new Error("Optional not found for this product");
		}
		return product;
	}
}

export { RemoveOptionalToProductService };
