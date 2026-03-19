import prismaClient from "../../prisma/prismaclient";

interface RemoveProductOrderRequest {
	order_id: string;
	item_id: string;
}

class RemoveProductOrderService {
	async execute({ order_id, item_id }: RemoveProductOrderRequest) {
		const orderExists = await prismaClient.order.findFirst({
			where: {
				id: order_id,
				items: {
					some: { id: item_id },
				},
			},
		});
		if (!orderExists) {
			throw new Error("Order or product not found in the order");
		}
		await prismaClient.itemsOrder.delete({
			where: {
				id: item_id,
			},
		});
		return prismaClient.order.findUnique({
			where: { id: order_id },
			select: {
				id: true,
				table: true,
				status: true,
				draft: true,
				name: true,
				items: {
					select: {
						id: true,
						amount: true,
						product: {
							select: {
								id: true,
								name: true,
								description: true,
								price: true,
								bannerUrl: true,
							},
						},
						itemsOptionals: {
							select: {
								product_optional: {
									select: {
										optional: {
											select: {
												id: true,
												name: true,
												price: true,
											},
										},
									},
								},
							},
						},
					},
				},
			},
		});
	}
}

export { RemoveProductOrderService };
