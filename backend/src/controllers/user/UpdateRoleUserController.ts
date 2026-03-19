import { Request, Response } from "express";
import { UpdateRoleUserService } from "../../services/user/UpdateRoleUserService";

class UpdateRoleUserController {
	async handle(req: Request, res: Response) {
		const { email, role } = req.body;
		const user_id = req.user_id;
		const updateRoleUserService = new UpdateRoleUserService();
		const user = await updateRoleUserService.execute({
			email,
			new_role: role,
			user_id,
		});
		return res.json(user);
	}
}
export { UpdateRoleUserController };
