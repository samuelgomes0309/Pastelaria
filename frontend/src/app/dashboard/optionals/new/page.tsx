import OptionalForm from "@/components/optionalsForm/optionalForm";
import { requireAuth } from "@/lib/auth";

export default async function New() {
	await requireAuth({
		needRole: "ADMIN",
		redirectTo: "/dashboard/optionals",
	});
	return (
		<div>
			<OptionalForm />
		</div>
	);
}
