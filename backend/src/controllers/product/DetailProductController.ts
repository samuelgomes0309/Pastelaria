import { Request, Response } from "express";
import { DetailProductService } from "../../services/product/DetailProductService";

class DetailProductController {
	async handle(req: Request, res: Response) {
		const { product_id } = req.query as { product_id: string };
		const detailProductService = new DetailProductService();
		const product = await detailProductService.execute({
			product_id,
		});
		return res.json(product);
	}
}

export { DetailProductController };
