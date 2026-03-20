import MobileSidebar from "@/components/dashboard/sidebar/mobileSidebar";
import Sidebar from "@/components/dashboard/sidebar/sidebar";
import { requireAuth } from "@/lib/auth";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const user = await requireAuth({
		needRole: "STAFF",
	});
	return (
		<div className="flex min-h-screen w-full text-white">
			{/* Sidebar do desktop */}
			<Sidebar user={user} />
			{/* Conteúdo principal */}
			<div className="flex flex-1 flex-col overflow-hidden">
				{/* Side bar do mobile*/}
				<MobileSidebar user={user} />
				<main className="bg-app-surface-alt flex-1">
					<div className="container max-w-full px-4 py-6">{children}</div>
				</main>
			</div>
		</div>
	);
}
