import type { Product } from '../../products/domain/Product';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export interface CartService {
  getCart(): Cart;
  addItem(product: Product, quantity: number): void;
  removeItem(productId: number): void;
  updateQuantity(productId: number, quantity: number): void;
  clearCart(): void;
}

export interface CartRepository {
  save(cart: Cart): void;
  load(): Cart;
  clear(): void;
}