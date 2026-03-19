import { Request, Response } from "express";
import { AddOptionalToProductService } from "../../services/product/AddOptionalToProductService";

class AddOptionalToProductController {
	async handle(req: Request, res: Response) {
		const { optional_id, product_id } = req.body;
		const addOptionalToProductService = new AddOptionalToProductService();
		const product = await addOptionalToProductService.execute({
			optional_id,
			product_id,
		});
		return res.json(product);
	}
}

export { AddOptionalToProductController };
