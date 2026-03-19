import { NextFunction, Request, Response } from "express";

export function isAdmin(req: Request, res: Response, next: NextFunction) {
	// Verificar se o usuário autenticado é um administrador
	if (req.role !== "ADMIN") {
		return res.status(403).json({
			error: "Insufficient permissions",
		});
	}
	return next();
}
