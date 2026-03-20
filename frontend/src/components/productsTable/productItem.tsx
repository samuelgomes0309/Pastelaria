"use client";

import { Product } from "@/@types/products";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import Image from "next/image";
import Link from "next/link";
import { Pen } from "lucide-react";
import { useState } from "react";

export function ProductItem({
	product,
	onOpenDetails,
	user_role,
}: {
	product: Product;
	onOpenDetails: (product: Product) => void;
	user_role: "ADMIN" | "STAFF";
}) {
	const [imageLoaded, setImageLoaded] = useState(false);
	const price = (product.price / 100).toFixed(2); // Converte o preço de centavos para reais
	const status = product.disabled === false ? "Ativo" : "Inativo";
	return (
		<Card className="bg-app-surface-deep w-full rounded-md border-gray-500/30 p-0 text-white shadow-2xl shadow-black/80 transition duration-500 hover:translate-y-0.5">
			<CardContent className="p-0">
				<div className="relative h-64 w-full">
					<Image
						src={product.bannerUrl}
						alt={`Preview ${product.name}`}
						fill
						className={`rounded-t-md object-cover ${imageLoaded ? "opacity-100" : "opacity-0"}`}
						onLoad={() => setImageLoaded(true)}
					/>
					{!imageLoaded && (
						<div className="absolute inset-0 flex items-center justify-center">
							<div className="border-b-brand-primary size-6 animate-spin rounded-full border-2 border-white"></div>
						</div>
					)}
				</div>
				<div className="flex flex-col gap-2 px-2 py-3">
					<div className="flex items-center justify-between">
						<h1 className="truncate text-xl font-bold italic md:text-2xl">
							{product.name}
						</h1>
						<div className="flex flex-col items-end justify-center gap-2">
							<span
								className={`${status === "Ativo" ? "bg-green-700" : "bg-red-700"} rounded-md px-2 text-white`}
							>
								{status}
							</span>
							<p className="bg-app-background w-fit rounded-md px-4 py-1 text-gray-400">
								{product.category.name}
							</p>
						</div>
					</div>
					<p className="text-text-muted truncate text-sm">
						{product.description}
					</p>
					<p className="text-center text-xl font-bold md:text-2xl">
						R$ {price}
					</p>
				</div>
			</CardContent>
			<CardFooter className="mb-5 flex w-full items-center gap-2 p-0 px-2">
				<Button
					className="bg-brand-primary hover:bg-brand-primary-hover h-full max-h-10 flex-1 cursor-pointer items-center rounded-md py-2 transition-all duration-500"
					type="button"
					onClick={() => onOpenDetails(product)}
				>
					Detalhar
				</Button>
				{user_role === "ADMIN" && (
					<Link
						href={`/dashboard/products/${product.id}/edit`}
						className="flex h-full max-h-10 cursor-pointer items-center justify-center gap-2 rounded-md bg-blue-700 px-2.5 py-2 transition-all duration-600 hover:bg-blue-500"
					>
						<Pen size={26} />
						<div className="h-full border border-l-white"></div>
						Editar
					</Link>
				)}
			</CardFooter>
		</Card>
	);
}
