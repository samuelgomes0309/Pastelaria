import { Request, Response } from "express";
import { CreateProductService } from "../../services/product/CreateProductService";

class CreateProductController {
	async handle(req: Request, res: Response) {
		const { name, price, description, category_id } = req.body;
		const user_id = req.user_id;
		if (!req.file) {
			return res.status(400).json({ error: "File is required" });
		}
		const createProductService = new CreateProductService();
		const product = await createProductService.execute({
			category_id,
			description,
			name,
			price,
			file: req.file,
			user_id,
		});
		return res.json(product);
	}
}

export { CreateProductController };
