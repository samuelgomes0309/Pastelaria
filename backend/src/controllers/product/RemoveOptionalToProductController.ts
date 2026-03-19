import { Request, Response } from "express";
import { RemoveOptionalToProductService } from "../../services/product/RemoveOptionalToProductService";

class RemoveOptionalToProductController {
	async handle(req: Request, res: Response) {
		const { product_optional_id } = req.params as {
			product_optional_id: string;
		};
		const removeOptionalToProductService = new RemoveOptionalToProductService();
		const product = await removeOptionalToProductService.execute({
			product_optional_id,
		});
		return res.json(product);
	}
}

export { RemoveOptionalToProductController };
