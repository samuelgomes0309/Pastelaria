import prismaClient from "../../prisma/prismaclient";

class ListOptionalsService {
	async execute() {
		const optionals = await prismaClient.optional.findMany({
			orderBy: {
				createdAt: "desc",
			},
			select: {
				id: true,
				name: true,
				price: true,
				createdAt: true,
			},
		});
		if (!optionals) {
			throw new Error("No optionals found");
		}
		return optionals;
	}
}
export { ListOptionalsService };
