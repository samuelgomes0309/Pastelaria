import { Request, Response } from "express";
import { UpdateStatusProductService } from "../../services/product/UpdateStatusProductService";

class UpdateStatusProductController {
	async handle(req: Request, res: Response) {
		const { product_id } = req.params as { product_id: string };
		const { disabled } = req.body;
		const updateStatusProductService = new UpdateStatusProductService();
		const product = await updateStatusProductService.execute({
			product_id,
			status: disabled,
		});
		return res.json(product);
	}
}

export { UpdateStatusProductController };
