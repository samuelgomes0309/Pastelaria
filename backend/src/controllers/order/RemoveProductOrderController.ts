import { Request, Response } from "express";
import { RemoveProductOrderService } from "../../services/order/RemoveProductOrderService";

class RemoveProductOrderController {
	async handle(req: Request, res: Response) {
		const { order_id } = req.query as {
			order_id: string;
		};
		const { item_id } = req.params as {
			item_id: string;
		};
		const removeProductOrderService = new RemoveProductOrderService();
		const order = await removeProductOrderService.execute({
			order_id,
			item_id,
		});
		return res.json(order);
	}
}

export { RemoveProductOrderController };
