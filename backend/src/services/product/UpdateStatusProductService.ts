import prismaClient from "../../prisma/prismaclient";

interface UpdateStatusRequest {
	product_id: string;
	status: boolean;
}

class UpdateStatusProductService {
	async execute({ product_id, status }: UpdateStatusRequest) {
		const productExists = await prismaClient.product.findFirst({
			where: {
				id: product_id,
			},
			include: {
				productsOptionals: true,
			},
		});
		if (!productExists) {
			throw new Error("Product does not exist");
		}
		try {
			const product = await Promise.all([
				prismaClient.product.update({
					where: {
						id: product_id,
					},
					data: {
						disabled: status,
					},
				}),
				// Desabilitar todos os opcionais relacionados ao produto
				prismaClient.productsOptionals.updateMany({
					where: {
						product_id: product_id,
					},
					data: {
						disabled: status,
					},
				}),
			]);
			return product[0];
		} catch (error) {
			throw new Error("Error updating product status");
		}
	}
}

export { UpdateStatusProductService };
