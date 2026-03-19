import { Request, Response } from "express";
import { SendOrderService } from "../../services/order/SendOrderService";

class SendOrderController {
	async handle(req: Request, res: Response) {
		const { order_id } = req.params as { order_id: string };
		const sendOrderService = new SendOrderService();
		const order = await sendOrderService.execute({ order_id });
		return res.json(order);
	}
}

export { SendOrderController };
