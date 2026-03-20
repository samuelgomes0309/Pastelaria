"use server";

import { clearAuthToken } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function logoutAction() {
	await clearAuthToken();
	redirect("/login");
}
