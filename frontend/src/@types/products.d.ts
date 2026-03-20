import { Category } from "./categories";

export interface Product {
	id: string;
	name: string;
	description: string;
	price: number;
	disabled: boolean;
	bannerUrl: string;
	category_id: string;
	createdAt: string;
	updatedAt: string;
	productsOptionals: ProductOptional[];
	category: Category;
}
