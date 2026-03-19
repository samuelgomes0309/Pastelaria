import prismaClient from "../../prisma/prismaclient";

interface SendOrderRequest {
	order_id: string;
}

class SendOrderService {
	async execute({ order_id }: SendOrderRequest) {
		const order = await prismaClient.order.findFirst({
			where: { id: order_id },
			include: {
				items: true,
			},
		});
		if (!order) {
			throw new Error("Order not found");
		}
		if (order.items.length === 0) {
			throw new Error("Cannot send an empty order");
		}
		if (!order.draft) {
			throw new Error("Order has already been sent");
		}
		return await prismaClient.order.update({
			where: {
				id: order_id,
			},
			data: {
				draft: false,
			},
		});
	}
}
export { SendOrderService };
