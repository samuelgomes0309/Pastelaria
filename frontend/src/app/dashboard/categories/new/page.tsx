import CategoryForm from "@/components/categoriesForm/categoryform";
import Header from "@/components/dashboard/header/header";
import { requireAuth } from "@/lib/auth";

export default async function New() {
	// Verifica se o usuário está autenticado e tem a role ADMIN
	await requireAuth({
		needRole: "ADMIN",
		redirectTo: "/dashboard/categories",
	});
	return (
		<div>
			<Header title="Nova categoria" />
			<CategoryForm />
		</div>
	);
}
