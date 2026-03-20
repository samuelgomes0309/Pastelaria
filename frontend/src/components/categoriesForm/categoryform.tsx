"use client";

import { useForm } from "react-hook-form";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
	CreateCategoryData,
	createCategorySchema,
} from "@/schemas/category.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { createCategoryAction } from "@/actions/category/createCategoryAction";
import { toast } from "sonner";

export default function CategoryForm() {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<CreateCategoryData>({
		resolver: zodResolver(createCategorySchema),
	});
	const router = useRouter();
	// State para erros de submissão
	const [error, setError] = useState<null | string>(null);
	async function onSubmit(data: CreateCategoryData) {
		setError(null);
		const response = await createCategoryAction(data);
		if (response.success) {
			// Registro bem-sucedido - redirecionar para a página de categorias
			toast.success("Categoria cadastrada com sucesso.", {
				onAutoClose: () => {
					router.push("/dashboard/categories");
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
						<Label className="text-white">Nome da Categoria</Label>
						<Input
							placeholder="Digite o nome da categoria"
							type="text"
							className="bg-app-background border-none text-white shadow-2xl"
							{...register("name")}
						/>
						{errors.name && (
							<p className="text-sm text-red-500">{errors.name.message}</p>
						)}
					</div>
					<div className="flex flex-col space-y-3">
						<Label className="text-white">Descrição da Categoria</Label>
						<Textarea
							placeholder="Digite a descrição da categoria"
							className="bg-app-background max-h-40 border-none text-white shadow-2xl"
							{...register("description")}
						/>
						{errors.description && (
							<p className="text-sm text-red-500">
								{errors.description.message}
							</p>
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
