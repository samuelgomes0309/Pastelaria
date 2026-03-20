"use client";

import { Order } from "@/@types/order";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Eye } from "lucide-react";
import { useMemo, useState } from "react";
import { OrderDialog } from "./orderDialog";

interface OrderCardProps {
	order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
	const total = useMemo(() => {
		return order.items.reduce((acc, item) => {
			const productTotal = item.amount * item.product.price;
			const optionalsTotal = item.itemsOptionals.reduce((optAcc, optional) => {
				const price = optional.product_optional?.optional?.price ?? 0;
				return optAcc + price;
			}, 0);
			return acc + productTotal + optionalsTotal;
		}, 0);
	}, [order]);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	return (
		<>
			<Card className="bg-app-surface-deep w-full rounded-md border-gray-500/30 px-4 py-3 text-white shadow-2xl shadow-black/80 transition duration-500 hover:translate-y-0.5">
				<CardHeader className="flex items-center justify-between">
					<CardTitle className="text-xl font-bold">
						Mesa-{order.table}
					</CardTitle>
					<div className="bg-text-muted/70 rounded-md px-4 py-1 text-xs text-white/90">
						<span>{order.status ? "Finalizado" : "Em produção"}</span>
					</div>
				</CardHeader>
				<CardContent className="flex-1">
					<div className="text-text-disabled flex max-h-28 flex-col gap-1.5 overflow-hidden">
						<span>Qtd Items: {order.items.length}</span>
						{order.items.map((item) => {
							return (
								<div key={item.id}>
									{item.amount}x {item.product.name}
									{item.itemsOptionals.length > 0
										? item.itemsOptionals
												.map((optional) => {
													return (
														" - " + optional.product_optional?.optional?.name
													);
												})
												.join(", ")
										: null}
								</div>
							);
						})}
					</div>
				</CardContent>
				<CardFooter className="flex items-center justify-between">
					<div className="flex flex-col gap-1.5">
						<span className="text-md">Total</span>
						<span className="text-brand-primary text-lg font-bold">
							R$ {(total / 100).toFixed(2)}
						</span>
					</div>
					<div>
						<Button
							type="button"
							className="bg-brand-primary hover:bg-brand-primary-hover mt-2 cursor-pointer transition-all duration-500"
							onClick={() => setIsDialogOpen(true)}
						>
							<Eye className="mr-2" />
							Detalhes
						</Button>
					</div>
				</CardFooter>
			</Card>
			<OrderDialog
				key={order.id}
				order={order}
				onOpenChange={setIsDialogOpen}
				open={isDialogOpen}
				total={total}
			/>
		</>
	);
}
