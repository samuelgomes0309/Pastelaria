import { Request, Response } from "express";
import { CreateOptionalService } from "../../services/optional/CreateOptionalService";

class CreateOptionalController {
	async handle(req: Request, res: Response) {
		const { name, price } = req.body;
		const createOptionalService = new CreateOptionalService();
		const optional = await createOptionalService.execute({ name, price });
		return res.json(optional);
	}
}

export { CreateOptionalController };
