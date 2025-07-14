import React from 'react';
import { useNavigate } from 'react-router-dom';
import PurchaseSummary from '../components/PurchaseSummary/PurchaseSummary';
import { useShoppingCart } from '../hooks/useShoppingCart';

const PurchaseSummaryPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart } = useShoppingCart();

  const handleProceedToPayment = () => {
    // Aquí se puede implementar la lógica de pago
    // Por ahora, mostraremos una alerta y redirigiremos
    //alert('Redirigiendo al sistema de pago...');
    // navigate('/payment'); // Cuando se implemente la página de pago
  };

  const handleBackToShopping = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header de la página */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Resumen de tu Compra</h1>
          <p className="text-gray-600">
            Revisa los productos en tu carrito antes de proceder al pago
          </p>
        </div>

        {/* Navegación */}
        <div className="mb-6">
          <button
            onClick={handleBackToShopping}
            className="inline-flex items-center text-green-600 hover:text-green-800 font-medium transition-colors"
          >
            <svg 
              className="w-5 h-5 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 19l-7-7 7-7" 
              />
            </svg>
            Volver al catálogo
          </button>
        </div>

        {/* Componente de resumen */}
        <PurchaseSummary 
          onProceedToPayment={handleProceedToPayment}
          showPaymentButton={true}
        />

        {/* Información adicional */}
        {cart.items.length > 0 && (
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Información de entrega</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Entregas de lunes a sábado</li>
                <li>• Horario: 9:00 AM - 6:00 PM</li>
                <li>• Envío gratis en compras superiores a $25.000</li>
                <li>• Tiempo estimado: 1-2 días hábiles</li>
              </ul>
            </div>
          </div>
        )}

        {/* Políticas */}
        <div className="mt-6 max-w-2xl mx-auto text-center">
          <p className="text-xs text-gray-500">
            Al proceder al pago, aceptas nuestros{' '}
            <a href="#" className="text-blue-600 hover:underline">
              términos y condiciones
            </a>{' '}
            y{' '}
            <a href="#" className="text-blue-600 hover:underline">
              política de privacidad
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PurchaseSummaryPage;