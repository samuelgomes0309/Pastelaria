import prismaClient from "../../prisma/prismaclient";

interface DetailOrderRequest {
	order_id: string;
}

class DetailOrderService {
	async execute({ order_id }: DetailOrderRequest) {
		const order = await prismaClient.order.findUnique({
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
		if (!order) {
			throw new Error("Order not found");
		}
		return order;
	}
}

export { DetailOrderService };
