import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShoppingCart } from '../../hooks/useShoppingCart';
import { useAuth } from '../../../auth';
import type { CartItem } from '../../domain/Cart';
import { orderService, type CompleteOrderRequest, type OrderDetail } from '../../services/OrderService';
import { whatsAppService } from '../../services/WhatsAppService';

interface PurchaseSummaryProps {
  onProceedToPayment?: () => void;
  showPaymentButton?: boolean;
}

const PurchaseSummary: React.FC<PurchaseSummaryProps> = ({ 
  onProceedToPayment, 
  showPaymentButton = true 
}) => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateCartItemQuantity, clearCart } = useShoppingCart();
  const { isClient, user } = useAuth();

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    rut: '',
    direccion: '',
    whatsapp: ''
  });
  
  // Estado de carga
  const [isLoading, setIsLoading] = useState(false);
  // Cargar datos del usuario autenticado
  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.name || '',
        rut: user.rut || '',
        direccion: user.address || '',
        whatsapp: user.phone || ''
      });
    }
  }, [user]);

  // Cálculos del resumen
  const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = isClient ? subtotal * 0.05 : 0;
  const shippingCost = subtotal >= 25000 ? 0 : 3000;
  const total = subtotal - discount + shippingCost;

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateCartItemQuantity(productId, newQuantity);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProceedToPayment = async () => {
    // Validar que todos los campos estén completos
    if (!formData.nombre || !formData.rut || !formData.direccion || !formData.whatsapp) {
      alert('Por favor completa todos los campos del formulario');
      return;
    }

    setIsLoading(true);
    
    try {
      // Preparar los detalles de la orden
      const orderDetails: OrderDetail[] = cart.items.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }));

      // Preparar la solicitud de orden completa
      const orderRequest: CompleteOrderRequest = {
        customer: {
          rut: formData.rut,
          name: formData.nombre,
          phone: formData.whatsapp,
          email: user?.email || '',
          address: formData.direccion
        },
        notification: {
          channelId: 1,
          message: 'Su orden ha sido creada exitosamente',
          status: 'pendiente'
        },
        orderDate: new Date().toISOString(),
        shippingAddress: formData.direccion,
        orderDetails: orderDetails
      };

      // Enviar la orden
      const response = await orderService.completeOrder(orderRequest);
      
      // Limpiar el carrito después de completar la orden
      clearCart();
      
      // Enviar mensaje de WhatsApp con confirmación de orden
      try {
        await whatsAppService.sendOrderConfirmation({
          phoneNumber: formData.whatsapp,
          orderNumber: response.orderNumber,
          customerName: response.customer,
          total: response.total,
          orderDate: response.orderDate
        });
      } catch (whatsappError) {
        console.error('Error al enviar WhatsApp:', whatsappError);
        // No interrumpir el flujo si falla el WhatsApp
      }
      
      // Navegar a la página de resumen con los datos del pedido
      navigate('/order-summary', {
        state: {
          orderId: response.orderNumber,
          status: response.status,
          customerName: response.customer,
          shippingAddress: response.shippingAddress,
          total: parseFloat(response.total.replace(/[^0-9]/g, '')),
          orderDate: response.orderDate
        }
      });
      
      // Ejecutar callback si existe
      if (onProceedToPayment) {
        onProceedToPayment();
      }
      
    } catch (error) {
      console.error('Error al completar la orden:', error);
      alert(`Error al completar la orden: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg border max-w-2xl mx-auto">
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Tu carrito está vacío</h2>
          <p className="text-gray-600">Agrega algunos productos para ver tu resumen de compra</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Resumen de Compra</h2>
        <button
          onClick={clearCart}
          className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
        >
          Vaciar carrito
        </button>
      </div>

      {/* Lista de productos */}
      <div className="space-y-4 mb-6">
        {cart.items.map((item: CartItem) => (
          <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            {/* Imagen del producto */}
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
              {item.image ? (
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-2xl">📦</span>
              )}
            </div>

            {/* Información del producto */}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{item.name}</h3>
              <p className="text-gray-600">${item.price.toLocaleString('es-CL')} CLP</p>
            </div>

            {/* Controles de cantidad */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors font-bold text-gray-800"
              >
                -
              </button>
              <span className="w-8 text-center font-medium">{item.quantity}</span>
              <button
                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors font-bold text-gray-800"
              >
                +
              </button>
            </div>

            {/* Precio total del item */}
            <div className="text-right">
              <p className="font-semibold text-gray-800">
                ${(item.price * item.quantity).toLocaleString('es-CL')} CLP
              </p>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-600 hover:text-red-800 text-sm transition-colors font-semibold"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Resumen de costos */}
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal ({cart.totalItems} productos)</span>
          <span>${subtotal.toLocaleString('es-CL')} CLP</span>
        </div>
        
        {isClient && (
          <div className="flex justify-between text-green-600">
            <span>Descuento cliente (5%)</span>
            <span>-${discount.toLocaleString('es-CL')} CLP</span>
          </div>
        )}
        
        <div className="flex justify-between text-gray-600">
          <span>Envío</span>
          <span>
            {shippingCost === 0 ? (
              <span className="text-green-600">Gratis</span>
            ) : (
              `$${shippingCost.toLocaleString('es-CL')} CLP`
            )}
          </span>
        </div>
        
        {subtotal < 25000 && (
          <p className="text-sm text-gray-500">
            Agrega ${(25000 - subtotal).toLocaleString('es-CL')} CLP más para envío gratis
          </p>
        )}
        
        <div className="border-t pt-2 flex justify-between text-lg font-bold text-gray-800">
          <span>Total</span>
          <span>${total.toLocaleString('es-CL')} CLP</span>
        </div>
      </div>

      {/* Formulario de datos del cliente */}
      <div className="mt-6 border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Datos de entrega</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre completo *
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="Ingresa tu nombre completo"
            />
          </div>

          <div>
            <label htmlFor="rut" className="block text-sm font-medium text-gray-700 mb-1">
              RUT *
            </label>
            <input
              type="text"
              id="rut"
              name="rut"
              value={formData.rut}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="12.345.678-9"
            />
          </div>

          <div>
            <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-1">
              Dirección de entrega *
            </label>
            <textarea
              id="direccion"
              name="direccion"
              value={formData.direccion}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none"
              placeholder="Calle, número, comuna, ciudad"
            />
          </div>

          <div>
            <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1">
              WhatsApp *
            </label>
            <input
              type="tel"
              id="whatsapp"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="+56 9 1234 5678"
            />
          </div>
        </div>
      </div>

      {/* Botón de proceder al pago */}
      {showPaymentButton && (
        <div className="mt-6">
          <button
            onClick={handleProceedToPayment}
            disabled={isLoading}
            className={`w-full font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed text-gray-700' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Procesando pedido...</span>
              </>
            ) : (
              <span>Enviar solicitud</span>
            )}
          </button>
        </div>
      )}

      {/* Información adicional */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          {isClient ? (
            "✅ Descuento de cliente aplicado"
          ) : (
            "💡 Regístrate para obtener 5% de descuento"
          )}
        </p>
      </div>
    </div>
  );
};

export default PurchaseSummary;