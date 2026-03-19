import prismaClient from "../../prisma/prismaclient";

interface FinishOrderRequest {
	order_id: string;
}

class FinishOrderService {
	async execute({ order_id }: FinishOrderRequest) {
		const order = await prismaClient.order.findFirst({
			where: { id: order_id },
			include: {
				items: true,
			},
		});
		if (!order || order.draft === true || order.status === true) {
			throw new Error("Order not found or cannot be finished");
		}
		return await prismaClient.order.update({
			where: {
				id: order_id,
			},
			data: {
				status: true,
			},
		});
	}
}

export { FinishOrderService };
