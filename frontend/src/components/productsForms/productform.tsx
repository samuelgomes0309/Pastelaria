"use client";

import { Upload } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
	Select,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { SelectContent } from "@radix-ui/react-select";
import { useForm } from "react-hook-form";
import {
	CreateProductInput,
	CreateProductOutput,
	createProductSchema,
} from "@/schemas/product.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Category } from "@/@types/categories";
import { createProductAction } from "@/actions/product/createProductAction";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ProductFormProps {
	categories: Category[];
}

export default function ProductForm({ categories }: ProductFormProps) {
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [errorMsg, setErrorMsg] = useState<null | string>(null);
	const router = useRouter();
	useEffect(() => {
		return () => {
			if (imagePreview) {
				URL.revokeObjectURL(imagePreview);
			}
		};
	}, [imagePreview]);
	// Configuração do react-hook-form com validação usando Zod e tipos de entrada e saída definidos no schema
	const {
		register,
		handleSubmit,
		setValue,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<CreateProductInput, any, CreateProductOutput>({
		resolver: zodResolver(createProductSchema),
	});
	function handleCategoryChange(value: string) {
		if (!value) {
			setError("category_id", {
				message: "A categoria é obrigatória",
			});
			return;
		}
		setValue("category_id", value, { shouldValidate: true });
	}
	function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file || !file.type.startsWith("image/")) {
			setError("image", {
				message: "Por favor, selecione um arquivo de imagem válido",
			});
			return;
		}
		if (file) {
			// Gerar um preview da imagem usando URL.createObjectURL
			const previewUrl = URL.createObjectURL(file);
			setImagePreview(previewUrl);
			// Registrar o arquivo no react-hook-form para validação e submissão
			setValue("image", file, { shouldValidate: true });
		}
	}
	async function onSubmit(data: CreateProductOutput) {
		setErrorMsg(null);
		const response = await createProductAction(data);
		if (response.success) {
			// Registro bem-sucedido - redirecionar para a página de produtos
			toast.success("Produto cadastrado com sucesso.", {
				onAutoClose: () => {
					router.push("/dashboard/products");
				},
			});
		} else {
			const apiError = response.errors;
			if ("_form" in apiError && apiError._form) {
				toast.error(apiError._form[0]);
				setErrorMsg(apiError._form[0]);
			}
		}
	}
	return (
		<div>
			<Card className="bg-app-surface-deep border-app-surface-elevated mt-6 w-full border shadow-2xl">
				<CardContent>
					<form
						className="flex w-full flex-col gap-2.5"
						onSubmit={handleSubmit(onSubmit)}
					>
						<div className="flex w-full flex-col gap-4 sm:flex-row">
							<div className="flex flex-1 flex-col space-y-3">
								<Label className="text-white">Nome do Produto</Label>
								<Input
									type="text"
									placeholder="Ex: Pastel de carne"
									className="bg-app-background border-none text-white shadow-2xl"
									{...register("name")}
								/>
								{errors.name && (
									<p className="text-sm text-red-500">{errors.name.message}</p>
								)}
							</div>
							<div className="flex flex-1 flex-col space-y-3">
								<Label className="text-white">Preço</Label>
								<Input
									type="text"
									placeholder="Ex: 9.99"
									className="bg-app-background border-none text-white shadow-2xl"
									{...register("price")}
								/>
								{errors.price && (
									<p className="text-sm text-red-500">{errors.price.message}</p>
								)}
							</div>
						</div>
						<div className="flex w-full gap-2.5">
							<div className="flex flex-1 flex-col space-y-3">
								<Label className="text-white">Categoria</Label>
								<Select onValueChange={(e) => handleCategoryChange(e)}>
									<SelectTrigger className="bg-app-background w-full cursor-pointer border-none text-white shadow-2xl">
										<SelectValue placeholder="Selecione a categoria" />
									</SelectTrigger>
									<SelectContent
										position="popper"
										side="bottom"
										className="z-50 w-(--radix-select-trigger-width)"
									>
										<SelectGroup className="bg-app-surface-alt cursor-pointer rounded border-none text-white shadow-2xl">
											{/*Mapear as categorias disponíveis */}
											{categories.map((category) => (
												<SelectItem
													key={category.id}
													value={category.id}
													className="w-full cursor-pointer justify-start"
												>
													<span className="w-full text-left">
														{category.name}
													</span>
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
								{errors.category_id && (
									<p className="text-sm text-red-500">
										{errors.category_id.message}
									</p>
								)}
							</div>
							<div className="hidden flex-1 sm:block"></div>
						</div>
						<div className="flex flex-col space-y-3">
							<Label className="text-white">Descrição</Label>
							<Textarea
								className="bg-app-background max-h-40 border-none text-white shadow-2xl"
								placeholder="Descrição do produto"
								{...register("description")}
							></Textarea>
							{errors.description && (
								<p className="text-sm text-red-500">
									{errors.description.message}
								</p>
							)}
						</div>
						<div className="flex flex-col space-y-3">
							<Label className="text-white">Imagem</Label>
							<div className="bg-app-background hover:border-brand-primary-hover relative flex min-h-70 flex-col items-center justify-center rounded-md border border-transparent text-white shadow-2xl transition duration-500">
								<Input
									type="file"
									className="absolute z-10 h-full w-full cursor-pointer rounded-md border-none opacity-0"
									accept="image/*"
									onChange={(e) => handleImageChange(e)}
								/>
								{!imagePreview && (
									<div className="flex flex-col items-center justify-center gap-2">
										<Upload className="h-5 w-5 text-white" />
										<p>Clique para enviar uma imagem</p>
									</div>
								)}
								{imagePreview && (
									<div className="h-62.5 w-full overflow-hidden rounded-md">
										<img
											src={imagePreview}
											alt="Preview da imagem"
											className="h-full w-full rounded-md object-cover"
										/>
									</div>
								)}
							</div>
							{errors.image && (
								<p className="text-sm text-red-500">{errors.image.message}</p>
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
						{errorMsg && (
							<p className="mt-2 animate-bounce text-center text-sm text-red-500 transition">
								{errorMsg}
							</p>
						)}
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
