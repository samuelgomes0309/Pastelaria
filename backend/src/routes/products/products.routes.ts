import multer from "multer";
import uploadConfig from "../../config/multer";
import { isAuthenticated } from "../../middlewares/isAuthenticated";
import { isAdmin } from "../../middlewares/isAdmin";
import { validateSchema } from "../../middlewares/validateSchema";
import { CreateProductController } from "../../controllers/product/CreateProductController";
import {
	addOptionalToProductSchema,
	createProductSchema,
	detailProductSchema,
	listProductsSchema,
	removeOptionalToProductSchema,
	updateProductSchema,
	updateStatusProductSchema,
} from "../../schemas/productSchema";
import { Router } from "express";
import { AddOptionalToProductController } from "../../controllers/product/AddOptionalToProductController";
import { DetailProductController } from "../../controllers/product/DetailProductController";
import { ListProductsController } from "../../controllers/product/ListProductsController";
import { UpdateStatusProductController } from "../../controllers/product/UpdateStatusProductController";
import { RemoveOptionalToProductController } from "../../controllers/product/RemoveOptionalToProductController";
import { UpdateProductController } from "../../controllers/product/UpdateProductController";
import { AllProductsController } from "../../controllers/product/AllProductsController";

// Configurar o middleware multer para upload de arquivos
const upload = multer(uploadConfig);

const productRouter = Router();

productRouter.post(
	"/products",
	isAuthenticated,
	isAdmin,
	upload.single("file"),
	validateSchema(createProductSchema),
	new CreateProductController().handle
);

productRouter.put(
	"/products/:product_id",
	isAuthenticated,
	isAdmin,
	upload.single("file"),
	validateSchema(updateProductSchema),
	new UpdateProductController().handle
);

productRouter.post(
	"/products/optionals",
	isAuthenticated,
	isAdmin,
	validateSchema(addOptionalToProductSchema),
	new AddOptionalToProductController().handle
);

productRouter.get(
	"/products/detail",
	isAuthenticated,
	validateSchema(detailProductSchema),
	new DetailProductController().handle
);

productRouter.get(
	"/products",
	isAuthenticated,
	validateSchema(listProductsSchema),
	new ListProductsController().handle
);

productRouter.put(
	"/products/:product_id/update-status",
	isAuthenticated,
	isAdmin,
	validateSchema(updateStatusProductSchema),
	new UpdateStatusProductController().handle
);

productRouter.delete(
	"/products/optionals/:product_optional_id",
	isAuthenticated,
	isAdmin,
	validateSchema(removeOptionalToProductSchema),
	new RemoveOptionalToProductController().handle
);

productRouter.get(
	"/products/all",
	isAuthenticated,
	new AllProductsController().handle
);

export { productRouter };
