import prismaClient from "../../prisma/prismaclient";

interface AddProductOrderRequest {
	order_id: string;
	product_id: string;
	amount: number;
	optional_id?: string;
}

class AddProductOrderService {
	async execute({
		amount,
		order_id,
		product_id,
		optional_id,
	}: AddProductOrderRequest) {
		if (amount <= 0) {
			throw new Error("Invalid amount");
		}
		// Verifica se produto e pedido existem
		const [productExists, orderExists] = await Promise.all([
			prismaClient.product.findUnique({ where: { id: product_id } }),
			prismaClient.order.findUnique({ where: { id: order_id } }),
		]);
		if (!productExists || !orderExists) {
			throw new Error("Product or order not found");
		}
		return prismaClient.$transaction(async (tx) => {
			// Resolve o ID da tabela productsOptionals (se houver opcional)
			let productOptionalId: string | undefined;
			if (optional_id) {
				const productOptional = await tx.productsOptionals.findFirst({
					where: {
						product_id,
						optional_id,
					},
				});
				if (!productOptional) {
					throw new Error("Optional not linked to product");
				}
				productOptionalId = productOptional.id;
			}
			// Busca todos os itens do pedido com o mesmo produto
			const existingItems = await tx.itemsOrder.findMany({
				where: {
					order_id,
					product_id,
				},
				include: {
					itemsOptionals: true,
				},
			});
			//Verifica se já existe item com exatamente o mesmo opcional
			const itemWithSameOptionals = existingItems.find((item) => {
				// Produto sem opcional
				if (!productOptionalId) {
					return item.itemsOptionals.length === 0;
				}
				// Produto com opcional
				return (
					item.itemsOptionals.length === 1 &&
					item?.itemsOptionals[0]?.product_optional_id === productOptionalId
				);
			});
			// Se existir, incrementa quantidade
			if (itemWithSameOptionals) {
				await tx.itemsOrder.update({
					where: { id: itemWithSameOptionals.id },
					data: {
						amount: {
							increment: amount,
						},
					},
				});
			} else {
				//Caso contrário, cria novo item
				const newItem = await tx.itemsOrder.create({
					data: {
						order_id,
						product_id,
						amount,
					},
				});
				//Se houver opcional, cria relacionamento
				if (productOptionalId) {
					await tx.itemsOptionals.create({
						data: {
							items_order_id: newItem.id,
							product_optional_id: productOptionalId,
						},
					});
				}
			}
			//Retorna pedido completo
			return tx.order.findUnique({
				where: { id: order_id },
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
		});
	}
}

export { AddProductOrderService };
