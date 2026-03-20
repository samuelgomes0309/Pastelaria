import { Category } from "@/@types/categories";
import { listCategoriesAction } from "@/actions/category/listCategoriesAction";
import Header from "@/components/dashboard/header/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isAuthenticated } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Categories() {
	const user = await isAuthenticated();
	if (!user) {
		return redirect("/login");
	}
	const categories: Category[] = await listCategoriesAction();
	const hasCategories = categories.length > 0;
	return (
		<div>
			{/* Header da página  com botão para nova categoria*/}
			<Header
				title="Categorias"
				description="Organize os produtos em categorias"
				href={user.role === "ADMIN" ? "/dashboard/categories/new" : undefined}
				textLink={user.role === "ADMIN" ? "Nova categoria" : undefined}
			/>
			{/* Lista de categorias */}
			{hasCategories ? (
				<div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
					{categories.map((category) => (
						<Card
							key={category.id}
							className="bg-app-surface-deep border-app-surface-elevated w-full border text-white shadow-2xl"
						>
							<CardHeader>
								<CardTitle>{category.name}</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-text-disabled text-sm">id: {category.id}</p>
							</CardContent>
						</Card>
					))}
				</div>
			) : (
				<div className="mt-10 text-center font-bold">
					<p>Nenhuma categoria encontrada....</p>
				</div>
			)}
		</div>
	);
}
