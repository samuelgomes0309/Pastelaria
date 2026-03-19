import prismaClient from "../../prisma/prismaclient";

interface DetailOptionalRequest {
	optional_id: string;
}

class DetailOptionalService {
	async execute({ optional_id }: DetailOptionalRequest) {
		const optional = await prismaClient.optional.findUnique({
			where: {
				id: optional_id,
			},
		});
		if (!optional) {
			throw new Error("Optional not found");
		}
		return optional;
	}
}
export { DetailOptionalService };
