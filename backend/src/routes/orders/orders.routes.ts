import { Router } from "express";
import { isAuthenticated } from "../../middlewares/isAuthenticated";
import { validateSchema } from "../../middlewares/validateSchema";
import {
	addProductOrderSchema,
	createOrderSchema,
	detailOrderSchema,
	finishOrderSchema,
	removeOrderSchema,
	removeProductOrderSchema,
	sendOrderSchema,
} from "../../schemas/orderSchema";
import { CreateOrderController } from "../../controllers/order/CreateOrderController";
import { AddProductOrderController } from "../../controllers/order/AddProductOrderController";
import { RemoveProductOrderController } from "../../controllers/order/RemoveProductOrderController";
import { DetailOrderController } from "../../controllers/order/DetailOrderController";
import { ListOrdersController } from "../../controllers/order/LIstOrdersController";
import { RemoveOrderController } from "../../controllers/order/RemoveOrderController";
import { SendOrderController } from "../../controllers/order/SendOrderController";
import { FinishOrderController } from "../../controllers/order/FinishOrderController";

const orderRouter = Router();

orderRouter.post(
	"/orders",
	isAuthenticated,
	validateSchema(createOrderSchema),
	new CreateOrderController().handle
);

orderRouter.post(
	"/orders/items",
	isAuthenticated,
	validateSchema(addProductOrderSchema),
	new AddProductOrderController().handle
);

orderRouter.delete(
	"/orders/remove/:item_id",
	isAuthenticated,
	validateSchema(removeProductOrderSchema),
	new RemoveProductOrderController().handle
);

orderRouter.get(
	"/orders/details/:order_id",
	isAuthenticated,
	validateSchema(detailOrderSchema),
	new DetailOrderController().handle
);

orderRouter.get("/orders", isAuthenticated, new ListOrdersController().handle);

orderRouter.delete(
	"/orders/:order_id",
	isAuthenticated,
	validateSchema(removeOrderSchema),
	new RemoveOrderController().handle
);

orderRouter.patch(
	"/orders/:order_id/send",
	isAuthenticated,
	validateSchema(sendOrderSchema),
	new SendOrderController().handle
);

orderRouter.patch(
	"/orders/:order_id/finish",
	isAuthenticated,
	validateSchema(finishOrderSchema),
	new FinishOrderController().handle
);

export { orderRouter };
