import { Router } from "express";
import { isAuthenticated } from "../../middlewares/isAuthenticated";
import { validateSchema } from "../../middlewares/validateSchema";
import { isAdmin } from "../../middlewares/isAdmin";
import {
	createOptionalSchema,
	detailOptionalSchema,
} from "../../schemas/optionalSchema";
import { CreateOptionalController } from "../../controllers/optional/CreateOptionalController";
import { ListOptionalsController } from "../../controllers/optional/ListOptionalsController";
import { DetailOptionalController } from "../../controllers/optional/DetailOptionalController";

const optionalRouter = Router();

optionalRouter.post(
	"/optionals",
	isAuthenticated,
	isAdmin,
	validateSchema(createOptionalSchema),
	new CreateOptionalController().handle
);

optionalRouter.get(
	"/optionals",
	isAuthenticated,
	new ListOptionalsController().handle
);

optionalRouter.get(
	"/optionals/:optional_id",
	isAuthenticated,
	validateSchema(detailOptionalSchema),
	new DetailOptionalController().handle
);

export { optionalRouter };
