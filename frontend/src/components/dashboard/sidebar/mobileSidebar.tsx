"use client";

import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { LogOut, Menu, X } from "lucide-react";
import { menuItems, SidebarProps } from "./sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import logoutAction from "@/actions/user/logoutAction";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function MobileSidebar({ user }: SidebarProps) {
	const pathName = usePathname();
	// Para controlar o estado do Sheet (aberto/fechado)
	const [open, setOpen] = useState(false);
	return (
		<div className="bg-app-background border-border-strong flex w-full items-center justify-between border-b px-4 py-6 lg:hidden">
			<p className="text-xl">
				Pastelaria<span className="text-brand-primary">SG</span>
			</p>
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger className="cursor-pointer">
					<Menu />
				</SheetTrigger>
				<SheetContent
					side="left"
					showCloseButton={false}
					className="bg-app-background border-border-strong w-2/4 max-w-2xs border-r px-4 py-6 text-white"
				>
					<SheetHeader className="flex flex-row items-center justify-between">
						<SheetTitle className="gap-1.0 flex flex-col text-white">
							<p className="text-xl">
								Pastelaria<span className="text-brand-primary">SG</span>
							</p>
							<p className="text-text-muted truncate text-sm">
								Olá {user?.name} !
							</p>
						</SheetTitle>
						<SheetClose className="hover:text-brand-primary mb-2 flex w-10 cursor-pointer items-center justify-center text-white transition-all duration-500">
							<X className="h-6 w-6" />
						</SheetClose>
					</SheetHeader>
					{/* Menu */}
					<nav className="border-text-disabled flex-1 space-y-4 border-t pt-4">
						<ul className="flex flex-col gap-2">
							{menuItems.map((item) => {
								if (item.href === "/dashboard/users" && user.role !== "ADMIN") {
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
											// Fechar o menu ao clicar em um item
											onClick={() => setOpen(false)}
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
				</SheetContent>
			</Sheet>
		</div>
	);
}
