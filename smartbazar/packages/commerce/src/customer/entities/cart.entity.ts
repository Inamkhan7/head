export class CartItem {
  id: string | number;
  price: number;
  quantity?: number;
  stock?: number;
  [key: string]: any;
}

export class Metadata {
  [key: string]: any;
}

export class Cart {
  items: CartItem[];
  isEmpty: boolean;
  totalItems: number;
  totalUniqueItems: number;
  total: number;
  meta?: Metadata | null;
  [key: string]: any;
}
