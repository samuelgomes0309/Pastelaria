import prismaClient from "../../prisma/prismaclient";

interface ListOrdersServiceRequest {
	status: boolean;
}

class ListOrdersService {
	async execute({ status }: ListOrdersServiceRequest) {
		const orders = await prismaClient.order.findMany({
			where: {
				status: status,
				draft: false,
			},
			select: {
				id: true,
				table: true,
				status: true,
				draft: true,
				name: true,
				items: {
					select: {
						id: true,
						amount: true,
						product: {
							select: {
								id: true,
								name: true,
								description: true,
								price: true,
								bannerUrl: true,
								category: {
									select: {
										id: true,
										name: true,
									},
								},
							},
						},
						itemsOptionals: {
							select: {
								product_optional: {
									select: {
										optional: {
											select: {
												id: true,
												name: true,
												price: true,
											},
										},
									},
								},
							},
						},
					},
				},
			},
		});
		return orders;
	}
}

export { ListOrdersService };
