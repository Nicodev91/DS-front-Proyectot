import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../auth';
import type { CartItem } from '../../../shopping-cart';

interface ShoppingCartProps {
  cart: CartItem[];
  onRemoveFromCart: (productId: number) => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ cart, onRemoveFromCart }) => {
  const { isClient } = useAuth();
  const navigate = useNavigate();
  
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = isClient ? subtotal * 0.05 : 0;
  const shippingCost = subtotal >= 25000 ? 0 : 3000;
  const total = subtotal - discount + shippingCost;

  return (
    <div className="bg-gradient-to-br from-white to-green-50 p-5 rounded-xl shadow-lg border-2 border-green-100 sticky top-4">
      {/* Header del carrito */}
      <div className="text-center mb-5">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-2xl">🛒</span>
          <h3 className="text-xl font-bold text-gray-800">Carrito de Compras</h3>
        </div>
        <div className="w-16 h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full mx-auto"></div>
      </div>
      
      {cart.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">🛒</div>
          <p className="text-gray-500 text-sm md:text-base font-medium">Tu carrito está vacío</p>
          <p className="text-gray-400 text-xs mt-1">¡Agrega productos para comenzar!</p>
        </div>
      ) : (
        <ul className="space-y-3 mb-5 max-h-64 overflow-y-auto pr-2">
          {cart.map(item => (
            <li key={item.id} className="bg-white p-3 rounded-lg border border-green-100 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex justify-between items-start">
                <div className="flex-1 mr-3">
                  <div className="font-medium text-gray-800 text-sm md:text-base mb-1">
                    {item.name}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                      Cantidad: {item.quantity}
                    </span>
                  </div>
                  <button
                    onClick={() => onRemoveFromCart(item.id)}
                    className="text-red-500 text-xs hover:text-red-700 mt-2 flex items-center gap-1 hover:bg-red-50 px-2 py-1 rounded transition-colors"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
                <div className="text-right">
                  <span className="font-bold text-green-600 text-sm md:text-base">
                    ${(item.price * item.quantity).toLocaleString('es-CL')} CLP
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      
      {/* Resumen de precios mejorado */}
      <div className="bg-white p-4 rounded-lg border border-green-200 shadow-sm">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm md:text-base text-gray-600">
            <span>💰 Subtotal:</span>
            <span className="font-medium">${subtotal.toLocaleString('es-CL')} CLP</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between items-center text-sm md:text-base text-green-600">
              <span>🎉 Descuento cliente (5%):</span>
              <span className="font-medium">-${discount.toLocaleString('es-CL')} CLP</span>
            </div>
          )}
          {shippingCost > 0 && (
            <div className="flex justify-between items-center text-sm md:text-base text-orange-600">
              <span>🚚 Envío:</span>
              <span className="font-medium">${shippingCost.toLocaleString('es-CL')} CLP</span>
            </div>
          )}
          {shippingCost === 0 && subtotal > 0 && (
            <div className="flex justify-between items-center text-sm md:text-base text-green-600">
              <span>🚚 Envío:</span>
              <span className="font-bold">¡GRATIS!</span>
            </div>
          )}
          <div className="border-t-2 border-green-200 pt-3 mt-3">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-800">💳 Total:</span>
              <span className="text-xl font-bold text-green-600">${total.toLocaleString('es-CL')} CLP</span>
            </div>
          </div>
        </div>
      </div>
      
      {cart.length > 0 && (
        <div className="w-full flex justify-center mt-5">
          <button
            onClick={() => navigate('/cart')}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 w-full text-center shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <span className="text-lg">🛍️</span>
            <span>Finalizar Compra</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;