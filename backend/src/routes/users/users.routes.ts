import { Router } from "express";
import { validateSchema } from "../../middlewares/validateSchema";
import { CreateUserController } from "../../controllers/user/CreateUserController";
import {
	createUserSchema,
	loginUserSchema,
	updateRoleUserSchema,
} from "../../schemas/userSchema";
import { AuthUserController } from "../../controllers/user/AuthUserController";
import { isAuthenticated } from "../../middlewares/isAuthenticated";
import { DetailUserController } from "../../controllers/user/DetailsUserController";
import { isAdmin } from "../../middlewares/isAdmin";
import { UpdateRoleUserController } from "../../controllers/user/UpdateRoleUserController";

const userRouter = Router();

userRouter.post(
	"/users",
	validateSchema(createUserSchema),
	new CreateUserController().handle
);

userRouter.post(
	"/sessions",
	validateSchema(loginUserSchema),
	new AuthUserController().handle
);

userRouter.get("/me", isAuthenticated, new DetailUserController().handle);

userRouter.patch(
	"/users/role",
	isAuthenticated,
	isAdmin,
	validateSchema(updateRoleUserSchema),
	new UpdateRoleUserController().handle
);

export { userRouter };
