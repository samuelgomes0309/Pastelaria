import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

interface Payload {
	sub: string;
	role: "ADMIN" | "STAFF";
}

export function isAuthenticated(
	req: Request,
	res: Response,
	next: NextFunction
) {
	// Verificar se o token de autenticação está presente no cabeçalho da requisição
	const authToken = req.headers.authorization;
	if (!authToken) {
		return res.status(401).json({
			error: "Token missing",
		});
	}
	// Dividir o token em duas partes: "Bearer" e o token em si
	const [, token] = authToken.split(" ");
	try {
		// Validar o token de autenticação
		if (!token) {
			throw new Error("Invalid token");
		}
		const { sub, role } = verify(token, process.env.JWT_SECRET!) as Payload;
		const user_id = sub;
		const roleStatus = role;
		// Adicionar o ID do usuário na requisição para uso posterior e tambem o role(ADMIN ou STAFF) que sera usado para verificar permissoes
		req.user_id = user_id;
		req.role = roleStatus;
		return next();
	} catch (error) {
		return res.status(401).json({
			error: "Invalid token",
		});
	}
}
