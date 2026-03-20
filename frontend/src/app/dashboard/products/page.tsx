import { Product } from "@/@types/products";
import { listProductsAction } from "@/actions/product/listProductsAction";
import Header from "@/components/dashboard/header/header";
import { ProductFilter } from "@/components/productFilter/productFilter";
import ProductTable from "@/components/productsTable/productTable";
import { isAuthenticated } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Products({
	searchParams,
}: {
	searchParams?: Promise<{ disabled: string }>;
}) {
	const { disabled: disabledParams } = searchParams
		? await searchParams
		: { disabled: undefined };
	const status = disabledParams === "true";
	const products: Product[] = await listProductsAction({ status });
	const user = await isAuthenticated();
	if (!user) {
		return redirect("/login");
	}
	return (
		<div>
			<Header
				title="Produtos"
				description="Gerencie o cardápio de produtos"
				href={user.role === "ADMIN" ? "/dashboard/products/new" : undefined}
				textLink={user.role === "ADMIN" ? "Cadastrar novo produto" : undefined}
			/>
			<ProductFilter />
			{products.length === 0 ? (
				<div className="mt-10 text-center font-bold">
					<p>Nenhum produto encontrado....</p>
				</div>
			) : (
				<ProductTable products={products} user={user} />
			)}
		</div>
	);
}
