import { Response, Request } from "express";
import { UpdateProductService } from "../../services/product/UpdateProductService";

class UpdateProductController {
	async handle(req: Request, res: Response) {
		const { product_id } = req.params as { product_id: string };
		const { name, price, description } = req.body;
		const user_id = req.user_id;
		const updateProductService = new UpdateProductService();
		const product = await updateProductService.execute({
			product_id,
			name,
			price,
			description,
			file: req.file,
			user_id,
		});
		return res.json(product);
	}
}

export { UpdateProductController };
