import prismaClient from "../../prisma/prismaclient";

interface RemoveOrderRequest {
	order_id: string;
}

class RemoveOrderService {
	async execute({ order_id }: RemoveOrderRequest) {
		const order = await prismaClient.order.delete({
			where: {
				id: order_id,
			},
		});
		if (!order) {
			throw new Error("Order not found");
		}
		return order;
	}
}

export { RemoveOrderService };
