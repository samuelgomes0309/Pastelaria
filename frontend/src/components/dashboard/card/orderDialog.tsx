import { Order } from "@/@types/order";
import { finishOrderAction } from "@/actions/order/finishOrderAction";
import { Button } from "@/components/ui/button";
import {
	DialogFooter,
	DialogHeader,
	Dialog,
	DialogContent,
	DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

interface OrderDialogProps {
	order: Order;
	open: boolean;
	onOpenChange: Dispatch<SetStateAction<boolean>>;
	total: number;
}

export function OrderDialog({
	order,
	open,
	onOpenChange,
	total,
}: OrderDialogProps) {
	const router = useRouter();
	async function handleFinishOrder(order_id: string) {
		const response = await finishOrderAction({ order_id });
		if (response.success) {
			toast.success("Produto cadastrado com sucesso.", {
				onAutoClose: () => {
					router.push("/dashboard");
				},
			});
		} else {
			const apiError = response.errors;
			if ("_form" in apiError && apiError._form) {
				toast.error(apiError._form[0]);
			}
		}
	}
	return (
		<Dialog open={open} onOpenChange={(open) => onOpenChange(open)}>
			<DialogContent
				showCloseButton={false}
				className="bg-app-background border-text-disabled/70 scrollbar-thin scrollbar-modern scrollbar-thumb-gray-500 scrollbar-track-transparent max-h-[90vh] w-[95vw] max-w-xl overflow-y-auto rounded-md border px-4 py-3 text-white shadow-2xl"
				onClick={() => onOpenChange(false)}
			>
				<div onClick={(e) => e.stopPropagation()}>
					<DialogHeader className="mb-4">
						<DialogTitle className="text-3xl font-bold">
							Detalhe do pedido
						</DialogTitle>
					</DialogHeader>
					<div className="flex flex-col gap-4 md:grid md:grid-cols-2">
						<div className="w-full">
							<p className="text-text-disabled mb-1.5">Mesa</p>
							<span className="truncate font-bold">{order.table}</span>
						</div>
						{order.name?.trim() && (
							<div className="w-full">
								<p className="text-text-disabled mb-1.5">Cliente</p>
								<span className="truncate font-bold">{order.name}</span>
							</div>
						)}
					</div>
					<div className="mt-4">
						<p className="text-text-disabled mb-1.5">Status</p>
						<div className="bg-text-muted/70 max-w-fit rounded-md px-4 py-1 text-xs text-white/90">
							<span>{order.status ? " Finalizado" : "Em produção"}</span>
						</div>
					</div>
					<div className="mt-5 flex flex-col gap-2">
						<h2>Itens no pedido</h2>
						{order.items.map((item) => {
							const optionalsTotal = item.itemsOptionals.reduce(
								(acc, optional) => {
									const price = optional.product_optional?.optional?.price ?? 0;
									return acc + price;
								},
								0
							);
							const subtotal =
								(item.product.price + optionalsTotal) * item.amount;
							return (
								<div key={item.id} className="flex flex-col gap-1">
									<p className="text-xs text-gray-400">
										{item.product?.category?.name}
									</p>
									<div className="flex flex-col items-start justify-between md:flex-row md:items-center">
										<span>
											{item.amount}x {item.product.name}
										</span>
										<span className="text-text-disabled font-semibold">
											R$ {(subtotal / 100).toFixed(2)}
										</span>
									</div>
									{item.itemsOptionals.length > 0 && (
										<div className="ml-2 text-sm text-gray-400">
											{item.itemsOptionals.map((optional) => (
												<div key={optional.product_optional?.optional?.id}>
													+ {optional.product_optional?.optional?.name}
												</div>
											))}
										</div>
									)}
								</div>
							);
						})}
					</div>
					<div className="my-5 flex items-center justify-between">
						<p className="text-lg">Total</p>
						<span className="text-xl font-bold">
							R$ {(total / 100).toFixed(2)}
						</span>
					</div>
					<DialogFooter>
						<div className="flex items-center justify-end gap-2">
							<Button
								onClick={() => onOpenChange(false)}
								type="button"
								className="bg-app-surface hover:bg-app-surface-deep border-text-disabled cursor-pointer border transition-all duration-500"
							>
								Fechar
							</Button>
							<Button
								onClick={() => handleFinishOrder(order.id)}
								type="button"
								className="bg-brand-primary hover:bg-brand-primary-hover max-h-10 cursor-pointer items-center rounded-md py-2 transition-all duration-500"
							>
								Finalizar pedido
							</Button>
						</div>
					</DialogFooter>
				</div>
			</DialogContent>
		</Dialog>
	);
}
