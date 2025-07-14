import React from 'react';
import ProductCard from '../ProductCard/ProductCard';
import type { Product } from '../../domain/Product';

interface ProductGridProps {
  products: Product[];
  quantities: { [id: number]: number };
  onQuantityChange: (productId: number, value: number) => void;
  onAddToCart: (product: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  quantities,
  onQuantityChange,
  onAddToCart
}) => {
  return (
    <div className="max-w-6xl mx-auto mt-8">
      {/* Título de la sección */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">🛒 Nuestros Productos</h2>
        <p className="text-gray-600">Encuentra todo lo que necesitas al mejor precio</p>
      </div>
      
      {/* Grid de productos */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-3 md:gap-4 px-4 md:px-2 pb-10">
        {products.map(product => (
          <ProductCard
            key={product.productId || product.id}
            product={product}
            quantity={quantities[product.productId || product.id || 0] || 1}
            onQuantityChange={onQuantityChange}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
      
      {/* Estado vacío mejorado */}
      {products.length === 0 && (
        <div className="col-span-full text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No se encontraron productos</h3>
          <p className="text-gray-500">Intenta ajustar los filtros o buscar algo diferente</p>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;