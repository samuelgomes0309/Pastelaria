import { Request, Response, NextFunction } from "express";
import { ZodError, ZodType } from "zod";

export const validateSchema =
	(schema: ZodType) =>
	async (req: Request, res: Response, next: NextFunction) => {
		// Lógica de validação do schema
		try {
			await schema.parseAsync({
				body: req.body,
				params: req.params,
				query: req.query,
			});
			return next();
		} catch (error) {
			if (error instanceof ZodError) {
				return res.status(400).json({
					message: "Validation failed",
					details: error.issues.map((issue) => ({
						field: issue.path.join("."),
						message: issue.message,
					})),
				});
			}
			return res.status(500).json({ error: "Internal server error" });
		}
	};
