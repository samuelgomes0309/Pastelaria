import { Plus } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
	title: string;
	description?: string;
	textLink?: string;
	href?: string;
	children?: React.ReactNode;
}

export default function Header({
	title,
	description,
	href,
	textLink,
	children,
}: HeaderProps) {
	return (
		<header className="flex flex-col items-center justify-between sm:flex-row">
			<div className="mb-6 w-full flex-1 sm:mb-0">
				<h1 className="text-2xl font-bold">{title}</h1>
				{description && <p className="text-text-disabled">{description}</p>}
			</div>
			{href && textLink && (
				<Link
					href={href}
					className="bg-brand-primary hover:bg-brand-primary-hover flex cursor-pointer items-center rounded-md p-2 transition-all duration-500"
					type="button"
				>
					<Plus className="mr-2 h-4 w-4" />
					{textLink}
				</Link>
			)}
			{/* Caso nao tenha navegação mas possua outro componente */}
			{children}
		</header>
	);
}
