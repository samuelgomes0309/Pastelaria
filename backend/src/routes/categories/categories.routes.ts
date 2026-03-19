import { Router } from "express";
import { isAuthenticated } from "../../middlewares/isAuthenticated";
import { isAdmin } from "../../middlewares/isAdmin";
import { validateSchema } from "../../middlewares/validateSchema";
import {
	createCategorySchema,
	detailCategorySchema,
	removeCategorySchema,
	updateCategorySchema,
} from "../../schemas/categorySchema";
import { CreateCategoryController } from "../../controllers/category/CreateCategoryController";
import { ListCategoriesController } from "../../controllers/category/ListCategoriesController";
import { DetailCategoryController } from "../../controllers/category/DetailCategoryController";
import { RemoveCategoryController } from "../../controllers/category/RemoveCategoryController";
import { UpdateCategoryController } from "../../controllers/category/UpdateCategoryController";

const categoryRouter = Router();

categoryRouter.post(
	"/categories",
	isAuthenticated,
	isAdmin,
	validateSchema(createCategorySchema),
	new CreateCategoryController().handle
);

categoryRouter.get(
	"/categories",
	isAuthenticated,
	new ListCategoriesController().handle
);

categoryRouter.get(
	"/categories/:category_id",
	isAuthenticated,
	validateSchema(detailCategorySchema),
	new DetailCategoryController().handle
);

categoryRouter.delete(
	"/categories/:category_id",
	isAuthenticated,
	isAdmin,
	validateSchema(removeCategorySchema),
	new RemoveCategoryController().handle
);

categoryRouter.patch(
	"/categories/:category_id",
	isAuthenticated,
	isAdmin,
	validateSchema(updateCategorySchema),
	new UpdateCategoryController().handle
);

export { categoryRouter };
