"use client";

import { loginUserAction } from "@/actions/user/loginAction";
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
import { LoginData, loginSchema } from "@/schemas/login.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function LoginForm() {
	// Parte do react-hook-form com zod para validação
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginData>({ resolver: zodResolver(loginSchema) });
	const router = useRouter();
	const [error, setError] = useState<null | string>(null);
	async function onSubmit(data: LoginData) {
		setError(null);
		const response = await loginUserAction(data);
		if (response.success) {
			// Registro bem-sucedido - redirecionar para a página de login
			toast.success("Login realizado com sucesso.", {
				onAutoClose: () => {
					router.push("/dashboard");
				},
			});
		} else {
			const apiError = response.errors;
			if ("_form" in apiError && apiError._form) {
				setError(apiError._form[0]);
			}
		}
	}
	return (
		<Card className="bg-app-surface-deep border-app-surface-elevated w-full max-w-md border shadow-2xl">
			<CardHeader>
				<CardTitle className="text-center text-3xl font-bold text-white italic sm:text-4xl">
					Pastelaria<span className="text-brand-primary">SG</span>
				</CardTitle>
				<CardDescription className="text-md user-select-none text-muted-foreground text-center sm:text-lg">
					Faça o login para a usar o PastelariaSG
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form
					className="flex w-full flex-col gap-2.5"
					onSubmit={handleSubmit(onSubmit)}
				>
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
						type="submit"
						disabled={isSubmitting}
						className="bg-accent-default hover:bg-accent-hover mt-2 cursor-pointer transition-all duration-500"
					>
						{isSubmitting ? "Entrando..." : "Entrar"}
					</Button>
					{error && (
						<p className="mt-2 animate-bounce text-center text-sm text-red-500 transition">
							{error}
						</p>
					)}
				</form>
			</CardContent>
			<CardFooter className="flex items-center justify-center text-center">
				<span className="text-white/80">Não possui uma conta?</span>
				{isSubmitting ? null : (
					<Link
						href="/register"
						className="ml-1 font-bold text-white transition-all duration-500 hover:underline"
					>
						Cadastre-se
					</Link>
				)}
			</CardFooter>
		</Card>
	);
}
