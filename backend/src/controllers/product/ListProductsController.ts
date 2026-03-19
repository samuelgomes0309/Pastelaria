import { Request, Response } from "express";
import { ListProductsService } from "../../services/product/ListProductsService";

class ListProductsController {
	async handle(req: Request, res: Response) {
		const { category_id, status } = req.query as {
			category_id: string;
			status?: string;
		};
		const parsedStatus =
			status === "true" ? true : status === "false" ? false : undefined;
		const listProductsService = new ListProductsService();
		const products = await listProductsService.execute({
			category_id,
			status: parsedStatus,
		});
		return res.json(products);
	}
}

export { ListProductsController };
