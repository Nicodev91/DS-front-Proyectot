import type { Cart, CartItem, CartService as ICartService } from '../domain/Cart';
import type { Product } from '../../products/domain/Product';
import { cartRepository } from '../infrastructure/CartRepository';

class CartService implements ICartService {
  private cart: Cart;

  constructor() {
    this.cart = cartRepository.load();
  }

  getCart(): Cart {
    return { ...this.cart };
  }

  addItem(product: Product, quantity: number = 1): void {
    const productId = product.productId || product.id || 0;
    const existingItemIndex = this.cart.items.findIndex(item => item.id === productId);
    
    if (existingItemIndex >= 0) {
      // Si el producto ya existe, actualizar cantidad
      this.cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Si es un producto nuevo, agregarlo al carrito
      const newItem: CartItem = {
        id: productId,
        name: product.name,
        price: product.price,
        quantity,
        image: product.image || product.imageUrl || '/placeholder-product.jpg'
      };
      this.cart.items.push(newItem);
    }
    
    this.updateTotals();
    this.saveCart();
  }

  removeItem(productId: number): void {
    this.cart.items = this.cart.items.filter(item => item.id !== productId);
    this.updateTotals();
    this.saveCart();
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    const itemIndex = this.cart.items.findIndex(item => item.id === productId);
    if (itemIndex >= 0) {
      this.cart.items[itemIndex].quantity = quantity;
      this.updateTotals();
      this.saveCart();
    }
  }

  clearCart(): void {
    this.cart = {
      items: [],
      totalItems: 0,
      totalPrice: 0
    };
    this.saveCart();
    cartRepository.clear();
  }

  private updateTotals(): void {
    this.cart.totalItems = this.cart.items.reduce((total, item) => total + item.quantity, 0);
    this.cart.totalPrice = this.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  private saveCart(): void {
    cartRepository.save(this.cart);
  }
}

export const cartService = new CartService();