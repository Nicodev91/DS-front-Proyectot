import type { Cart, CartRepository } from '../domain/Cart';

const CART_STORAGE_KEY = 'datasentinel_cart';

class LocalStorageCartRepository implements CartRepository {
  save(cart: Cart): void {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }

  load(): Cart {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const cart = JSON.parse(stored);
        return {
          items: cart.items || [],
          totalItems: cart.totalItems || 0,
          totalPrice: cart.totalPrice || 0
        };
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
    
    return {
      items: [],
      totalItems: 0,
      totalPrice: 0
    };
  }

  clear(): void {
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing cart from localStorage:', error);
    }
  }
}

export const cartRepository = new LocalStorageCartRepository();