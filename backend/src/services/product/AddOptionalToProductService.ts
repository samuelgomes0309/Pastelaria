import prismaClient from "../../prisma/prismaclient";

interface AddOptionalToProductRequest {
	optional_id: string;
	product_id: string;
}

class AddOptionalToProductService {
	async execute({ optional_id, product_id }: AddOptionalToProductRequest) {
		const [optionalExists, productExists] = await Promise.all([
			prismaClient.optional.findFirst({
				where: {
					id: optional_id,
				},
			}),
			prismaClient.product.findFirst({
				where: {
					id: product_id,
				},
			}),
		]);
		if (!optionalExists || !productExists) {
			throw new Error("Optional or Product does not exist");
		}
		const productOptionalExists =
			await prismaClient.productsOptionals.findFirst({
				where: {
					optional_id,
					product_id,
				},
			});
		if (productOptionalExists) {
			await prismaClient.productsOptionals.update({
				where: {
					id: productOptionalExists.id,
				},
				data: {
					disabled: false,
				},
			});
		}
		const productOptional = await prismaClient.productsOptionals.create({
			data: {
				optional_id,
				product_id,
			},
			include: {
				optional: true,
				product: true,
			},
		});
		return productOptional;
	}
}

export { AddOptionalToProductService };
