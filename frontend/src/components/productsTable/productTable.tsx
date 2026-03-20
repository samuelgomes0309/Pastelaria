"use client";

import { Product } from "@/@types/products";
import { ProductItem } from "./productItem";
import { DialogProductDetails } from "./productDialog";
import { useState } from "react";
import { User } from "@/@types/user";

interface ProductTableProps {
	products: Product[];
	user: User;
}

export default function ProductTable({ products, user }: ProductTableProps) {
	const [visible, setVisible] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
	function handleOpenDialog(product: Product) {
		setSelectedProduct(product);
		setVisible(true);
	}
	return (
		<div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
			{products.map((product) => (
				<ProductItem
					user_role={user.role}
					key={product.id}
					product={product}
					onOpenDetails={handleOpenDialog}
				/>
			))}
			{/* CORREÇÃO: Renderização condicional para evitar passar null e prevenir erro de hidratação React */}
			{selectedProduct && (
				<DialogProductDetails
					visible={visible}
					setVisible={setVisible}
					product={selectedProduct}
					role={user.role}
				/>
			)}
		</div>
	);
}
