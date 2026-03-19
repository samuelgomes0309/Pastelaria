import { Request, Response } from "express";
import { DetailOptionalService } from "../../services/optional/DetailOptionalService";

class DetailOptionalController {
	async handle(req: Request, res: Response) {
		const { optional_id } = req.params as { optional_id: string };
		const detailOptionalService = new DetailOptionalService();
		const optional = await detailOptionalService.execute({
			optional_id,
		});
		return res.json(optional);
	}
}

export { DetailOptionalController };
