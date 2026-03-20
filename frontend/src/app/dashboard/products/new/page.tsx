import { Category } from "@/@types/categories";
import { listCategoriesAction } from "@/actions/category/listCategoriesAction";
import Header from "@/components/dashboard/header/header";
import ProductForm from "@/components/productsForms/productform";
import { requireAuth } from "@/lib/auth";

export default async function New() {
	await requireAuth({
		needRole: "ADMIN",
		redirectTo: "/dashboard/products",
	});
	const categories: Category[] = await listCategoriesAction();
	if (!categories || categories.length === 0) {
		return (
			<div>
				<Header title="Novo produto" />
			</div>
		);
	}
	return (
		<div>
			<Header title="Novo produto" />
			<ProductForm categories={categories} />
		</div>
	);
}
