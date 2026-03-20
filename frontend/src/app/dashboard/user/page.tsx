import Header from "@/components/dashboard/header/header";
import ProfileForm from "@/components/profileform/profileForm";
import { isAuthenticated, requireAuth } from "@/lib/auth";

export default async function Profile() {
	await requireAuth({
		needRole: "ADMIN",
		redirectTo: "/dashboard",
	});
	const user = await isAuthenticated();
	if (!user) {
		return null;
	}
	return (
		<div>
			<Header
				title="Acessos de conta"
				description="Gerencie acessos de usuários"
			/>
			<ProfileForm user={user} />
		</div>
	);
}
