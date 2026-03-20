"use client";

import { User } from "@/@types/user";
import logoutAction from "@/actions/user/logoutAction";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
	UserPen,
	Tags,
	ShoppingCart,
	Package,
	LogOut,
	RectangleEllipsis,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface SidebarProps {
	user: User;
}

export const menuItems = [
	{
		title: "Pedidos",
		href: "/dashboard",
		icon: ShoppingCart,
	},
	{
		title: "Categorias",
		href: "/dashboard/categories",
		icon: Tags,
	},
	{
		title: "Produtos",
		href: "/dashboard/products",
		icon: Package,
	},
	{
		title: "Opcionais",
		href: "/dashboard/optionals",
		icon: RectangleEllipsis,
	},
	{
		title: "Configurações",
		href: "/dashboard/user",
		icon: UserPen,
	},
];

export default function Sidebar({ user }: SidebarProps) {
	const pathName = usePathname();
	return (
		<aside className="bg-app-background border-border-strong hidden min-h-screen w-64 flex-col border-r px-4 py-6 lg:flex">
			{/* Header */}
			<div className="border-text-disabled mb-6 flex flex-col gap-1 border-b px-2 pb-4">
				<Link href={"/dashboard"} className="text-2xl">
					Pastelaria<span className="text-brand-primary">SG</span>
				</Link>
				<p className="text-text-muted truncate text-sm">Olá {user?.name} !</p>
			</div>
			{/* Menu */}
			<nav className="flex-1 space-y-4">
				<ul className="flex flex-col gap-2">
					{menuItems.map((item) => {
						if (item.href === "/dashboard/user" && user.role !== "ADMIN") {
							return null;
						}
						// Define se o item do menu está ativo.
						// Para a rota raiz (/dashboard), ativa apenas quando a rota for exatamente igual.
						// Para as demais rotas, ativa tanto na rota exata quanto em sub-rotas.
						// Poderia criar uma chave exact no menu para diferenciar, mas nesse primeiro momento melhor abaixo.
						const isActive =
							item.href === "/dashboard"
								? pathName === "/dashboard"
								: pathName === item.href ||
									pathName.startsWith(`${item.href}/`);
						return (
							<li key={item.href}>
								<Link
									href={item.href}
									className={cn(
										"flex w-full items-center rounded-sm px-2 py-1.5 transition-all duration-500",
										isActive
											? "bg-brand-primary hover:bg-brand-primary-hover"
											: "text-text-muted hover:bg-app-surface-alt hover:text-white"
									)}
								>
									<item.icon className="mr-2 inline-block h-5 w-5" />
									{item.title}
								</Link>
							</li>
						);
					})}
				</ul>
			</nav>
			{/* Rodapé */}
			<div className="border-text-disabled mt-6 border-t py-4">
				<form action={logoutAction}>
					<Button
						className="hover:text-brand-primary flex w-full cursor-pointer items-center justify-start bg-transparent transition-all duration-500 hover:bg-transparent"
						type="submit"
					>
						<LogOut size={20} />
						Sair
					</Button>
				</form>
			</div>
		</aside>
	);
}
