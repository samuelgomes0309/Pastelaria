"use client";

import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { UpdateRoleData, updateRoleSchema } from "@/schemas/profile.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { useState } from "react";
import { User } from "@/@types/user";
import { updateRoleAction } from "@/actions/user/updateRoleAction";
import { toast } from "sonner";

interface ProfileFormProps {
	user: User;
}

export default function ProfileForm({ user }: ProfileFormProps) {
	const [errorMsg, setErrorMsg] = useState<string | null>(null);
	const {
		handleSubmit,
		register,
		setError,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm<UpdateRoleData>({
		resolver: zodResolver(updateRoleSchema),
	});
	async function onSubmit(data: UpdateRoleData) {
		if (data.email === user.email) {
			setError("email", {
				type: "manual",
				message: "Você não pode atualizar seu próprio email",
			});
		}
		const response = await updateRoleAction(data);
		if (!response.success) {
			setErrorMsg(
				response.errors._form?.[0] ||
					"Erro ao atualizar a permissão do usuário."
			);
			toast.error("Erro ao atualizar a permissão do usuário.");
			return;
		}
		toast.success("Permissão do usuário atualizada com sucesso!");
		setValue("email", "");
	}
	return (
		<Card className="bg-app-surface-deep border-app-surface-elevated mt-6 w-full border shadow-2xl">
			<CardContent>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="flex flex-1 flex-col space-y-3">
						<Label className="text-white">Email</Label>
						<Input
							type="text"
							placeholder="Digite o email do usuário"
							className="bg-app-background border-none text-white shadow-2xl"
							{...register("email")}
						/>
						{errors.email && (
							<p className="text-sm text-red-500">{errors.email.message} </p>
						)}
					</div>
					<div className="flex flex-col space-y-3">
						<h2 className="mt-2 text-xl text-white">Tipo de permissão</h2>
						<div className="flex items-center gap-2">
							<input
								type="radio"
								id="role-admin"
								value="ADMIN"
								className="accent-brand-primary h-5 w-5 cursor-pointer"
								{...register("role")}
							/>
							<Label htmlFor="role-admin" className="cursor-pointer text-white">
								Admin
							</Label>
						</div>
						<div className="flex items-center gap-2">
							<input
								type="radio"
								id="role-staff"
								value="STAFF"
								className="accent-brand-primary h-5 w-5 cursor-pointer"
								{...register("role")}
							/>
							<Label htmlFor="role-staff" className="cursor-pointer text-white">
								Usuário
							</Label>
						</div>
						{errors.role && (
							<p className="text-sm text-red-500">{errors.role.message} </p>
						)}
					</div>
					<Button
						type="submit"
						disabled={isSubmitting}
						className="bg-brand-primary hover:bg-brand-primary-hover mt-2 w-full cursor-pointer transition-all duration-500"
					>
						{isSubmitting ? (
							<div className="border-b-app-background size-5 animate-spin rounded-full border border-white"></div>
						) : (
							"Atualizar"
						)}
					</Button>
					{errorMsg && (
						<p className="mt-5 text-center text-sm text-red-500 transition">
							{errorMsg}
						</p>
					)}
				</form>
			</CardContent>
		</Card>
	);
}
