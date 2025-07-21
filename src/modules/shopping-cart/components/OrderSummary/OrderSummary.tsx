import React from 'react';
import { useNavigate } from 'react-router-dom';
import { whatsAppService } from '../../services/WhatsAppService';

interface CartItemDetail {
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface OrderSummaryProps {
  orderId: string;
  status: string;
  customerName: string;
  shippingAddress: string;
  total: number;
  orderDate: string;
  cartItems: CartItemDetail[];
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  orderId,
  status,
  customerName,
  shippingAddress,
  total,
  orderDate,
  cartItems
}) => {
  const navigate = useNavigate();

  // Función helper para formatear fechas de manera segura
  const formatOrderDate = (dateString: string): string => {
    try {
      // Intentar parsear la fecha
      const date = new Date(dateString);
      
      // Verificar si la fecha es válida
      if (isNaN(date.getTime())) {
        // Si no es válida, usar la fecha actual
        return new Date().toLocaleDateString('es-CL', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
      
      return date.toLocaleDateString('es-CL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      // En caso de error, usar la fecha actual
      return new Date().toLocaleDateString('es-CL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleSendWhatsApp = () => {
    whatsAppService.sendOrderToCompany({
      orderNumber: orderId,
      customerName,
      shippingAddress,
      total: `$${total.toLocaleString('es-CL')} CLP`,
      orderDate: formatOrderDate(orderDate),
      items: cartItems
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header de éxito */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">¡Pedido Confirmado!</h1>
            <p className="text-gray-600">Tu pedido ha sido procesado exitosamente</p>
          </div>
        </div>

        {/* Detalles del pedido */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Detalles del Pedido</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Número de Pedido:</span>
              <span className="font-semibold text-gray-800">#{orderId}</span>
            </div>
            
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Estado:</span>
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                {status}
              </span>
            </div>
            
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Cliente:</span>
              <span className="font-semibold text-gray-800">{customerName}</span>
            </div>
            
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Dirección de Envío:</span>
              <span className="font-semibold text-gray-800 text-right max-w-xs">{shippingAddress}</span>
            </div>
            
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Fecha del Pedido:</span>
              <span className="font-semibold text-gray-800">
                {formatOrderDate(orderDate)}
              </span>
            </div>
            
            <div className="flex justify-between py-3 text-lg font-bold text-gray-800">
              <span>Total:</span>
              <span>${total.toLocaleString('es-CL')} CLP</span>
            </div>
          </div>
        </div>

        {/* Productos comprados */}
        {cartItems && cartItems.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Productos Comprados</h2>
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  {/* Imagen del producto */}
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 text-xl">📦</span>
                    )}
                  </div>

                  {/* Información del producto */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-gray-600 text-sm">
                      {item.quantity} x ${item.price.toLocaleString('es-CL')} CLP
                    </p>
                  </div>

                  {/* Precio total del item */}
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">
                      ${(item.price * item.quantity).toLocaleString('es-CL')} CLP
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Información adicional */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-sm font-semibold text-blue-800 mb-1">¿Qué sigue?</h3>
              <p className="text-sm text-blue-700">
                Recibirás una confirmación por WhatsApp con los detalles de tu pedido. 
                Nuestro equipo se pondrá en contacto contigo para coordinar la entrega.
              </p>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <button
            onClick={handleContinueShopping}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Seguir Comprando
          </button>
          
          <button
            onClick={handleGoHome}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Ir al Inicio
          </button>
        </div>
        
        {/* Botón de WhatsApp */}
        <button
          onClick={handleSendWhatsApp}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Enviar pedido por WhatsApp
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;