import { useState, useEffect } from 'react';
import type { Cart } from '../domain/Cart';
import type { Product } from '../../products/domain/Product';
import { cartService } from '../services/CartService';

export const useShoppingCart = () => {
  const [cart, setCart] = useState<Cart>(cartService.getCart());
  const [quantities, setQuantities] = useState<{ [id: number]: number }>({});

  // Sincronizar el estado local con el servicio
  const refreshCart = () => {
    setCart(cartService.getCart());
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const handleQuantityChange = (productId: number, value: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: value
    }));
  };

  const handleAddToCart = (product: Product) => {
    const productKey = product.productId || product.id || 0;
    const quantity = quantities[productKey] || 1;
    cartService.addItem(product, quantity);
    refreshCart();
    
    // Opcional: resetear a 1 después de agregar
    setQuantities(prev => ({ ...prev, [productKey]: 1 }));
  };

  const removeFromCart = (productId: number) => {
    cartService.removeItem(productId);
    refreshCart();
  };

  const updateCartItemQuantity = (productId: number, quantity: number) => {
    cartService.updateQuantity(productId, quantity);
    refreshCart();
  };

  const clearCart = () => {
    cartService.clearCart();
    setQuantities({});
    refreshCart();
  };

  return {
    cart,
    quantities,
    handleQuantityChange,
    handleAddToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    refreshCart
  };
};