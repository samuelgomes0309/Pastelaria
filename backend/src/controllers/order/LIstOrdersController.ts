import { Request, Response } from "express";
import { ListOrdersService } from "../../services/order/ListOrdersService";

class ListOrdersController {
	async handle(req: Request, res: Response) {
		const { status } = req.query as { status: string | undefined };
		const listOrdersService = new ListOrdersService();
		const orders = await listOrdersService.execute({
			status: status === "true" ? true : false,
		});
		return res.json(orders);
	}
}

export { ListOrdersController };
