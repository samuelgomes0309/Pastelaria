export interface User {
	id: string;
	name: string;
	email: string;
	role: "STAFF" | "ADMIN";
}

export interface AuthResponse extends User {
	token: string;
}
