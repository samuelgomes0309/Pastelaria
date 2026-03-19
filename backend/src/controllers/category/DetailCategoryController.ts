import { Request, Response } from "express";
import { DetailCategoryService } from "../../services/category/DetailCategoryService";

class DetailCategoryController {
	async handle(req: Request, res: Response) {
		// Se apenas desestruturar, o TypeScript não reconhece o tipo portanto é necessário fazer a asserção
		const { category_id } = req.params as { category_id: string };
		const detailCategoryService = new DetailCategoryService();
		const category = await detailCategoryService.execute({
			category_id,
		});
		return res.json(category);
	}
}

export { DetailCategoryController };
