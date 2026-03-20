"use client";

import { useEffect, useState } from "react";
import { Switch } from "../ui/switch";
import { useRouter, useSearchParams } from "next/navigation";

export function ProductFilter() {
	const router = useRouter();
	const [isActive, setIsActive] = useState(true);
	const searchParams = useSearchParams();
	// Sincronizando com o estado inicial
	useEffect(() => {
		const disabledParam = searchParams.get("disabled");
		if (disabledParam !== null) {
			// Se disabled=true, então isActive=false
			setIsActive(disabledParam === "false");
		}
	}, [searchParams]);
	function handleToggle(checked: boolean) {
		setIsActive(checked);
		router.push(`/dashboard/products?disabled=${!checked}`);
	}
	return (
		<div className="mt-6 flex w-full items-center justify-end gap-2">
			<p className="text-2xl font-bold">Ativos</p>
			<Switch
				className={
					"cursor-pointer data-[state=checked]:bg-green-700 data-[state=unchecked]:bg-red-700"
				}
				id="disable-switch"
				checked={isActive}
				onCheckedChange={handleToggle}
			/>
		</div>
	);
}
