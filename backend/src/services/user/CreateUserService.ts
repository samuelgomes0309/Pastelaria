import prismaClient from "../../prisma/prismaclient";
import bcrypt from "bcryptjs";
interface CreateUserRequest {
	name: string;
	email: string;
	password: string;
}

const userSelect = {
	id: true,
	name: true,
	email: true,
	role: true,
};

class CreateUserService {
	async execute({ email, name, password }: CreateUserRequest) {
		const alreadyExistsUser = await prismaClient.user.findFirst({
			where: { email },
		});
		if (alreadyExistsUser) {
			throw new Error("User already exists");
		}
		const passwordHash = await bcrypt.hash(password, 8);
		// Transação para garantir que a contagem e a criação do usuário sejam atômicas
		const user = await prismaClient.$transaction(async (tx) => {
			const usersCount = await tx.user.count();
			if (usersCount === 0) {
				// Primeiro usuário cadastrado será admin
				const adminUser = await tx.user.create({
					data: {
						name,
						email,
						password: passwordHash,
						role: "ADMIN",
						isRoot: true,
					},
					select: userSelect,
				});
				return adminUser;
			} else {
				// Usuários subsequentes serão clientes
				const normalUser = await tx.user.create({
					data: {
						name,
						email,
						password: passwordHash,
						role: "STAFF",
					},
					select: userSelect,
				});
				return normalUser;
			}
		});
		return user;
	}
}

export { CreateUserService };
