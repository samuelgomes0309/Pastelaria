import { Product } from "./products";

export interface Optional {
	id: string;
	name: string;
	price: number;
	createdAt: string;
	updatedAt: string;
}

export interface ProductOptional {
	id: string;
	disabled: boolean;
	product: Product;
	optional_id: string;
	optional: Optional;
	createdAt: string;
	updatedAt: string;
}
