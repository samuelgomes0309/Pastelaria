import { listOptionalsAction } from "@/actions/optionals/listOptionalsAction";
import { detailProductAction } from "@/actions/product/detailProductAction";
import Header from "@/components/dashboard/header/header";
import { ProductEditForm } from "@/components/productsForms/editForm";
import { requireAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

import { toast } from "sonner";

export default async function Edit({ params }: { params: { id: string } }) {
	await requireAuth({
		needRole: "ADMIN",
		redirectTo: "/dashboard/products",
	});
	const { id } = await params;
	if (!id) {
		redirect("/dashboard/products");
	}
	const product = await detailProductAction({ id: id });
	if (!product.success || !product.data) {
		toast.error("Produto não encontrado.", {
			onAutoClose: () => {
				redirect("/dashboard/products");
			},
		});
		return null;
	}
	const optionals = await listOptionalsAction();
	return (
		<div>
			<Header
				title="Atualizando produto"
				description={`Produto - ${product.data?.name}.`}
			/>
			<ProductEditForm product={product.data} optionals={optionals} />
		</div>
	);
}
