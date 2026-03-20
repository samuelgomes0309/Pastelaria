import axios from "axios";
import { cookies } from "next/headers";

export const setupApi = async () => {
	const cookieStore = await cookies();
	const token = cookieStore.get("@appSG.token")?.value || null;
	const api = axios.create({
		baseURL: process.env.NEXT_PUBLIC_API_URL as string,
		timeout: 1000 * 5, // 5 segundos
		headers: {
			Authorization: token ? `Bearer ${token}` : "",
		},
	});
	return api;
};
