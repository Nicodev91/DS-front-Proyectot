import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useShoppingCart } from '../../shopping-cart';
import { useProduct } from '../hooks/useProductApi';
import { ShoppingCart } from '../components';
// Header import removed - dashboard components deleted

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const { handleAddToCart, cart, removeFromCart } = useShoppingCart();
  
  const productId = id ? parseInt(id, 10) : 0;
  const { product, loading, error } = useProduct(productId);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando producto...</p>
        </div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {error || 'Producto no encontrado'}
          </h1>
          <button 
            onClick={() => navigate('/catalog')}
            className="bg-green-600 text-white font-bold px-6 py-2 rounded hover:bg-green-700 transition"
          >
            Volver al catálogo
          </button>
        </div>
      </div>
    );
  }
  
  const handleAddToCartClick = () => {
    for (let i = 0; i < quantity; i++) {
      handleAddToCart(product);
    }
    // Lógica de redirección removida - el usuario permanece en la página
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header component removed - dashboard deleted */}
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Botón de volver */}
        <button 
          onClick={() => navigate('/')}
          className="mb-6 flex items-center text-green-600 hover:text-green-700 font-semibold transition"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver al catálogo
        </button>
        
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Contenido principal del producto */}
          <div className="xl:col-span-3">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
                {/* Imagen del producto */}
                <div className="flex justify-center items-center bg-gray-50 rounded-lg p-8">
                  <img 
                    src={product.imageUrl || product.image || '/placeholder-product.jpg'} 
                    alt={product.name}
                    className="max-w-full max-h-96 object-contain"
                  />
                </div>
                
                {/* Información del producto */}
                <div className="space-y-6">
                  {/* Badge de nuevo */}
                  {product.isNew && (
                    <span className="inline-block bg-orange-400 text-white text-sm px-3 py-1 rounded-full">
                      Nuevo
                    </span>
                  )}
                  
                  {/* Stock disponible */}
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Stock:</span>
                    <span className={`text-sm px-2 py-1 rounded ${
                      product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
                    </span>
                  </div>
                  
                  {/* Nombre del producto */}
                  <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
                  
                  {/* Categoría */}
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Categoría:</span>
                    <span className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded">
                      {typeof product.category === 'object' ? product.category.name : product.category}
                    </span>
                  </div>
                  
                  {/* Precio */}
                  <div className="text-4xl font-bold text-green-700">
                    ${product.price.toLocaleString('es-CL')} CLP
                  </div>
                  
                  {/* Descripción */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-800">Descripción</h3>
                    <p className="text-gray-600">
                      {product.description}
                    </p>
                  </div>
                  
                  {/* Selector de cantidad y botón de agregar */}
                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center space-x-4">
                      <label className="text-lg font-medium text-gray-700">Cantidad:</label>
                      <select
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="border border-gray-300 rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                        disabled={product.stock === 0}
                      >
                        {Array.from({ length: Math.min(product.stock || 1, 10) }, (_, i) => i + 1).map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </div>
                    
                    <button
                      onClick={handleAddToCartClick}
                      disabled={product.stock === 0}
                      className={`w-full text-lg font-bold py-3 px-6 rounded-lg transition-colors ${
                        product.stock === 0 
                          ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {product.stock === 0 
                        ? 'Producto agotado' 
                        : `Agregar al carrito - $${(product.price * quantity).toLocaleString('es-CL')} CLP`
                      }
                    </button>
                    
                    {/* Botón de WhatsApp directo */}
                    {/* <a
                      href={`https://wa.me/56948853814?text=${encodeURIComponent(
                        `Hola, quiero comprar:\n- ${product.name} x${quantity} (${(product.price * quantity).toLocaleString('es-CL')} CLP)`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-green-500 text-white! text-lg font-semibold py-3 px-6 rounded-lg hover:bg-green-600 transition-colors text-center block"
                    >
                      Comprar por WhatsApp
                    </a> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Carrito de compras */}
          <div className="xl:col-span-1">
            <ShoppingCart 
              cart={cart.items} 
              onRemoveFromCart={removeFromCart}
            />
          </div>
        </div>
        
        {/* Productos relacionados (opcional) */}
        <div className="mt-12">
          {/* <h2 className="text-2xl font-bold text-gray-800 mb-6">Productos relacionados</h2> */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* TODO: Implement related products fetching */}
            {/* Temporarily disabled until proper implementation
            relatedProducts.map((relatedProduct: Product) => (
                <div 
                  key={relatedProduct.productId || relatedProduct.id}
            onClick={() => navigate(`/product/${relatedProduct.productId || relatedProduct.id}`)}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer p-4"
                >
                  <img 
                    src={relatedProduct.image || relatedProduct.imageUrl || '/placeholder-product.jpg'} 
                    alt={relatedProduct.name}
                    className="w-full h-24 object-contain mb-2"
                  />
                  <h3 className="font-semibold text-sm text-gray-800 line-clamp-2 mb-1">
                    {relatedProduct.name}
                  </h3>
                  <p className="text-green-700 font-bold">
                    ${relatedProduct.price.toLocaleString('es-CL')} CLP
                  </p>
                </div>
              ))
            */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;