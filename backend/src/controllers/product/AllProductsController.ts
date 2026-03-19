import { Request, Response } from "express";
import { AllProductsService } from "../../services/product/AllProductsService";

class AllProductsController {
	async handle(req: Request, res: Response) {
		const { status } = req.query as { status?: string };
		const allProductsService = new AllProductsService();
		const products = await allProductsService.execute({
			status: status === "true" ? true : false,
		});
		return res.json(products);
	}
}

export { AllProductsController };
