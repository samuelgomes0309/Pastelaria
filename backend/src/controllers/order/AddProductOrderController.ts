import { Request, Response } from "express";
import { AddProductOrderService } from "../../services/order/AddProductOrderService";

class AddProductOrderController {
	async handle(req: Request, res: Response) {
		const { order_id, product_id, amount, optional_id } = req.body;
		const addProductOrderService = new AddProductOrderService();
		const order = await addProductOrderService.execute({
			order_id,
			product_id,
			amount,
			optional_id,
		});
		return res.json(order);
	}
}

export { AddProductOrderController };
