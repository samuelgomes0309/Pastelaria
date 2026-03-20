"use client";

import { Optional, ProductOptional } from "@/@types/optionals";
import { Card, CardContent } from "../ui/card";
import { Product } from "@/@types/products";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { useState } from "react";
import { Button } from "../ui/button";
import { addOptionalToProductAction } from "@/actions/product/addOptionalToProduct";
import { Trash } from "lucide-react";
import { removeOptionalToProductAction } from "@/actions/product/removeOptionalToProduct";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface BindOptionalProps {
	optionals: Optional[];
	product: Product;
}

export function BindOptional({ optionals, product }: BindOptionalProps) {
	//Estado para adicionar um opcional
	const [loadingAdd, setLoadingAdd] = useState(false);
	//Estado para remover um opcional
	const [loadingRemoveId, setLoadingRemoveId] = useState<string | null>(null);
	const router = useRouter();
	const optionalActives = product.productsOptionals ?? [];
	const hasOptionalsActives = optionalActives.length > 0;
	const availableOptionals = optionals.filter(
		(optional) =>
			!optionalActives.some((active) => active.optional_id === optional.id)
	);
	const [optionalSelected, setOptionalSelected] = useState<string | null>(null);
	function handleOptionalChange(value: string) {
		if (!value) {
			return;
		}
		setOptionalSelected(value);
	}
	async function handleAddOptional() {
		if (!optionalSelected) {
			return;
		}
		setLoadingAdd(true);
		try {
			const response = await addOptionalToProductAction({
				optional_id: optionalSelected,
				product_id: product.id,
			});
			if (response.success) {
				toast.success("Opcional adicionado com sucesso!");
				setOptionalSelected(null);
				router.refresh();
				return;
			}
			toast.error(response.errors?._form?.[0] ?? "Erro ao adicionar opcional.");
		} finally {
			setLoadingAdd(false);
		}
	}
	async function handleRemoveOptional(productOptional_id: string) {
		if (!productOptional_id) {
			return;
		}
		setLoadingRemoveId(productOptional_id);
		try {
			const response = await removeOptionalToProductAction({
				productOptional_id,
			});
			if (response.success) {
				toast.success("Opcional removido com sucesso!");
				router.refresh();
				return;
			}
			toast.error(response.errors?._form?.[0] ?? "Erro ao remover opcional.");
		} finally {
			setLoadingRemoveId(null);
		}
	}
	return (
		<Card className="bg-app-surface-deep border-text-muted/30 mt-6 w-full border pb-12 text-white shadow-2xl">
			<CardContent>
				<div className="item flex flex-col gap-2">
					<h3 className="text-xl font-bold text-green-500">
						Opcionais vinculados:
					</h3>
					{hasOptionalsActives ? (
						optionalActives.map((productOptional: ProductOptional) => (
							<div
								key={productOptional.id}
								className="bg-app-background flex items-center justify-between rounded-md p-2 text-white shadow-2xl"
							>
								<p className="text-sm text-white">
									{productOptional.optional.name}
								</p>
								<Button
									type="button"
									disabled={loadingRemoveId === productOptional.id}
									onClick={() => handleRemoveOptional(productOptional.id)}
									className="text-brand-primary cursor-pointer rounded-full bg-transparent transition duration-500 hover:scale-105 hover:bg-transparent disabled:cursor-not-allowed"
								>
									{loadingRemoveId === productOptional.id ? (
										<div className="border-b-brand-primary size-5 animate-spin cursor-not-allowed rounded-full border border-white"></div>
									) : (
										<Trash size={30} />
									)}
								</Button>
							</div>
						))
					) : (
						<div className="bg-app-background rounded-md px-2 py-1.5 text-white shadow-2xl hover:cursor-not-allowed">
							<p className="text-sm text-white">Nenhum opcional vinculado.</p>
						</div>
					)}
				</div>
				<div>
					<h3 className="text-brand-primary-soft-light my-2 text-xl font-bold">
						Opcionais para vincular:
					</h3>
					{availableOptionals.length > 0 ? (
						<div className="mt-3 flex flex-row items-center gap-2">
							<Select
								onValueChange={(e) => handleOptionalChange(e)}
								value={optionalSelected ?? ""}
							>
								<SelectTrigger className="bg-app-background w-full cursor-pointer border-none text-white shadow-2xl">
									<SelectValue placeholder="Selecione o opcional" />
								</SelectTrigger>
								<SelectContent
									position="popper"
									side="bottom"
									className="bg-app-surface-alt z-50 w-(--radix-select-trigger-width) border-none"
								>
									<SelectGroup className="bg-app-surface-deep cursor-pointer rounded border border-gray-700 p-0 text-white">
										{/*Mapear os opcionais disponíveis */}
										{availableOptionals?.map((optional) => (
											<SelectItem
												key={optional.id}
												value={optional.id}
												className="w-full cursor-pointer justify-start border-none"
											>
												<span className="w-full text-left">
													{optional.name}
												</span>
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
							<Button
								type="button"
								className="cursor-pointer bg-green-700 transition-all duration-500 hover:bg-green-500"
								onClick={handleAddOptional}
								disabled={!optionalSelected || loadingAdd}
							>
								{loadingAdd ? (
									<div className="border-b-brand-primary size-5 animate-spin rounded-full border border-white"></div>
								) : (
									"Adicionar"
								)}
							</Button>
						</div>
					) : (
						<div className="bg-app-background rounded-md px-2 py-2.5 text-white shadow-2xl hover:cursor-not-allowed">
							<p className="text-sm text-white">
								Nenhum opcional disponível para vincular.
							</p>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
