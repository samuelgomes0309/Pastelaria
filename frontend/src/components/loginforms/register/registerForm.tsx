"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterData, registerSchema } from "@/schemas/login.schema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { registerUserAction } from "@/actions/user/registerAction";

export default function RegisterForm() {
	const router = useRouter();
	// Parte do react-hook-form com zod para validação
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<RegisterData>({ resolver: zodResolver(registerSchema) });
	async function onSubmit(data: RegisterData) {
		const response = await registerUserAction(data);
		if (response.success) {
			// Registro bem-sucedido - redirecionar para a página de login
			toast.success("Registrado com sucesso! Agora faça login.", {
				onAutoClose: () => {
					router.push("/login");
				},
			});
		} else {
			toast.error("Erro ao registrar usuário.");
		}
	}
	return (
		<Card className="bg-app-surface-deep border-app-surface-elevated w-full max-w-md border shadow-2xl">
			<CardHeader>
				<CardTitle className="text-center text-3xl font-bold text-white italic sm:text-4xl">
					Pastelaria<span className="text-brand-primary">SG</span>
				</CardTitle>
				<CardDescription className="text-md user-select-none text-muted-foreground text-center sm:text-lg">
					Registre-se para começar a usar o PastelariaSG
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form
					className="flex w-full flex-col gap-2.5"
					onSubmit={handleSubmit(onSubmit)}
				>
					<div className="flex flex-col space-y-2">
						<Label className="text-white">Nome</Label>
						<Input
							type="text"
							minLength={3}
							placeholder="Digite seu nome"
							className="bg-app-background border-none text-white shadow-2xl"
							{...register("name")}
						/>
						{errors.name && (
							<p className="text-sm text-red-500">{errors.name.message}</p>
						)}
					</div>
					<div className="flex flex-col space-y-2">
						<Label className="text-white">Email</Label>
						<Input
							type="email"
							placeholder="Digite seu email"
							className="bg-app-background border-none text-white shadow-2xl"
							{...register("email")}
						/>
						{errors.email && (
							<p className="text-sm text-red-500">{errors.email.message}</p>
						)}
					</div>
					<div className="flex flex-col space-y-2">
						<Label className="text-white">Senha</Label>
						<Input
							placeholder="Digite sua senha"
							type="password"
							className="bg-app-background border-none text-white shadow-2xl"
							{...register("password")}
						/>
						{errors.password && (
							<p className="text-sm text-red-500">{errors.password.message}</p>
						)}
					</div>
					<Button
						disabled={isSubmitting}
						type="submit"
						className="bg-accent-default hover:bg-accent-hover mt-2 cursor-pointer transition-all duration-500"
					>
						{isSubmitting ? "Registrando..." : "Registrar"}
					</Button>
				</form>
			</CardContent>
			<CardFooter className="flex items-center justify-center text-center">
				<span className="text-white/80">Já possui uma conta?</span>
				{isSubmitting ? null : (
					<Link
						href="/login"
						className="ml-1 font-bold text-white transition-all duration-500 hover:underline"
					>
						Faça login
					</Link>
				)}
			</CardFooter>
		</Card>
	);
}
