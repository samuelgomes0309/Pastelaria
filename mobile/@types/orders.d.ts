import { Optional } from './optionals';

// export interface Order {
//   id: string;
//   name?: string;
//   table: string;
//   status: boolean;
//   draft: boolean;
//   createdAt: string;
//   updatedAt: string;
// }

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  bannerUrl: string;
}

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
