"use client";

import { useForm } from "react-hook-form";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { toast } from "sonner";
import {
	CreateOptionalInput,
	CreateOptionalOutput,
	createOptionalSchema,
} from "@/schemas/optional.schema";
import { createOptionalAction } from "@/actions/optionals/createOptionalAction";

export default function OptionalForm() {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<CreateOptionalInput, any, CreateOptionalOutput>({
		resolver: zodResolver(createOptionalSchema),
	});
	const router = useRouter();
	// State para erros de submissão
	const [error, setError] = useState<null | string>(null);
	async function onSubmit(data: CreateOptionalOutput) {
		setError(null);
		const response = await createOptionalAction(data);
		if (response.success) {
			// Registro bem-sucedido - redirecionar para a página de categorias
			toast.success("Opcional cadastrado com sucesso.", {
				onAutoClose: () => {
					router.push("/dashboard/optionals");
				},
			});
		} else {
			const apiError = response.errors;
			if ("_form" in apiError && apiError._form) {
				setError(apiError._form[0]);
			}
		}
	}
	return (
		<Card className="bg-app-surface-deep border-app-surface-elevated mt-6 w-full border shadow-2xl">
			<CardContent>
				<form
					className="flex w-full flex-col gap-2.5"
					onSubmit={handleSubmit(onSubmit)}
				>
					<div className="flex flex-col space-y-3">
						<Label className="text-white">Nome do opcional</Label>
						<Input
							placeholder="Digite o nome do opcional"
							type="text"
							className="bg-app-background border-none text-white shadow-2xl"
							{...register("name")}
						/>
						{errors.name && (
							<p className="text-sm text-red-500">{errors.name.message}</p>
						)}
					</div>
					<div className="flex flex-col space-y-3">
						<Label className="text-white">Preço</Label>
						<Input
							placeholder="Ex: 10.00"
							className="bg-app-background border-none text-white shadow-2xl"
							{...register("price")}
						/>
						{errors.price && (
							<p className="text-sm text-red-500">{errors.price.message}</p>
						)}
					</div>
					<Button
						type="submit"
						disabled={isSubmitting}
						className="bg-brand-primary hover:bg-brand-primary-hover mt-2 cursor-pointer transition-all duration-500"
					>
						{isSubmitting ? (
							<div className="border-b-app-background size-5 animate-spin rounded-full border border-white"></div>
						) : (
							"Cadastrar"
						)}
					</Button>
					{error && (
						<p className="mt-2 animate-bounce text-center text-sm text-red-500 transition">
							{error}
						</p>
					)}
				</form>
			</CardContent>
		</Card>
	);
}
