import prismaClient from "../../prisma/prismaclient";

interface CreateOptionalRequest {
	name: string;
	price: number;
}

class CreateOptionalService {
	async execute({ name, price }: CreateOptionalRequest) {
		const optional = await prismaClient.optional.create({
			data: {
				name,
				price,
			},
		});
		return optional;
	}
}

export { CreateOptionalService };
