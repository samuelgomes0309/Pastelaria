import { Optional } from "./optionals";
import { Product } from "./products";

export interface ItemOptional {
	product_optional: {
		optional: Optional | null;
	} | null;
}

export interface OrderItem {
	id: string;
	amount: number;
	product: Product;
	itemsOptionals: ItemOptional[];
}

export interface Order {
	id: string;
	table: number;
	status: boolean;
	draft: boolean;
	name: string | null;
	items: OrderItem[];
}
