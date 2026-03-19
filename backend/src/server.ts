import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import { router } from "./routes";
import cors from "cors";
import { message } from "./utils/logger/listen";

const app = express();

// Liberar o acesso de outras origens
app.use(cors());

// Habilitar o uso do JSON no body das requisições
app.use(express.json());

// Usar as rotas definidas no arquivo routes.ts
app.use(router);

// Middleware de tratamento de erros
app.use((error: Error, _: Request, res: Response, _next: NextFunction) => {
	if (error instanceof Error) {
		return res.status(400).json({
			error: error.message,
		});
	}
	return res.status(500).json({
		error: "Internal server error",
	});
});

// Definir a porta do servidor a partir da variável de ambiente ou usar a porta 3333 como padrão
const PORT = process.env.PORT || 3333;

// Iniciar o servidor na porta definida no arquivo .env
app.listen(PORT, () => message(PORT));
