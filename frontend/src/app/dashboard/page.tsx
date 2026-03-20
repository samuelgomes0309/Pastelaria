import { listOrdersAction } from "@/actions/order/listOrdersAction";
import { OrderCard } from "@/components/dashboard/card/card";
import Header from "@/components/dashboard/header/header";

export default async function Dashboard() {
	const orders = await listOrdersAction();
	if (!orders) return null;
	return (
		<div className="">
			<Header
				title="Pedidos em produção"
				description="Gerencie os pedidos da cozinha"
			/>
			{orders.length === 0 ? (
				<div className="mt-10 text-center font-bold">
					<p>Nenhum pedido em produção....</p>
				</div>
			) : (
				<div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
					{orders.map((order) => (
						<OrderCard key={order.id} order={order} />
					))}
				</div>
			)}
		</div>
	);
}
