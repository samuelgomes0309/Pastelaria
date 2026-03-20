import LoginForm from "@/components/loginforms/login/loginForm";
import { isAuthenticated } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Login() {
	const user = await isAuthenticated();
	if (user) {
		// Se o usuário já estiver autenticado, redireciona para a página inicial
		return redirect("/dashboard");
	}
	return (
		<div className="bg-app-background flex min-h-screen w-full items-center justify-center px-4 py-10">
			<LoginForm />
		</div>
	);
}
