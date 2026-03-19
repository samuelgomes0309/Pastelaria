import prismaClient from "../../prisma/prismaclient";
import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";

interface AuthUserRequest {
	email: string;
	password: string;
}

class AuthUserService {
	async execute({ email, password }: AuthUserRequest) {
		const alreadyExistsUser = await prismaClient.user.findFirst({
			where: { email },
		});
		if (!alreadyExistsUser) {
			throw new Error("Email or password incorrect");
		}
		// Verificar se a senha está correta
		const passwordMatch = await bcrypt.compare(
			password,
			alreadyExistsUser.password
		);
		if (!passwordMatch) {
			throw new Error("Email or password incorrect");
		}
		// Gerar o token JWT, subject é o id do usuário, expiresIn é o tempo de expiração que é de 30 dias. Payload são as informações que queremos colocar dentro do token
		const token = sign(
			{
				name: alreadyExistsUser.name,
				email: alreadyExistsUser.email,
				role: alreadyExistsUser.role,
			},
			process.env.JWT_SECRET!,
			{
				subject: alreadyExistsUser.id,
				expiresIn: "30d",
			}
		);
		return {
			id: alreadyExistsUser.id,
			name: alreadyExistsUser.name,
			email: alreadyExistsUser.email,
			role: alreadyExistsUser.role,
			token,
		};
	}
}

export { AuthUserService };
