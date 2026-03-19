import { Request, Response } from "express";
import { RemoveOrderService } from "../../services/order/RemoveOrderService";

class RemoveOrderController {
	async handle(req: Request, res: Response) {
		const { order_id } = req.params as { order_id: string };
		const removeOrderService = new RemoveOrderService();
		const order = await removeOrderService.execute({ order_id });
		return res.json(order);
	}
}

export { RemoveOrderController };
