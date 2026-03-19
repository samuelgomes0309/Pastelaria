import { Request, Response } from "express";
import { ListOptionalsService } from "../../services/optional/ListOptionalsService";

class ListOptionalsController {
	async handle(_req: Request, res: Response) {
		const listOptionalsService = new ListOptionalsService();
		const optional = await listOptionalsService.execute();
		return res.json(optional);
	}
}

export { ListOptionalsController };
