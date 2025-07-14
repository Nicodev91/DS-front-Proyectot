import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../domain/Product';

interface ProductCardProps {
  product: Product;
  quantity: number;
  onQuantityChange: (productId: number, value: number) => void;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  quantity,
  onQuantityChange,
  onAddToCart
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-2 md:p-3 flex flex-col justify-between relative h-full">
      {product.isNew && (
        <span className="absolute top-2 left-2 bg-orange-400 text-white text-xs px-2 py-1 rounded-full">Nuevo</span>
      )}
      
      {/* Imagen clickeable */}
      <div 
        onClick={() => navigate(`/product/${product.productId || product.id}`)}
        className="cursor-pointer"
      >
        <img 
          src={product.image || product.imageUrl || '/placeholder-product.jpg'} 
          alt={product.name} 
          className="w-full h-28 md:h-32 object-contain rounded-lg mb-2"
        />
      </div>
      
      <div className="flex-1">
        <h3 className="font-semibold text-xs md:text-sm mb-1 line-clamp-2 leading-tight">{product.name}</h3>
        <p className="text-xs text-gray-600 mb-2">{typeof product.category === 'object' ? product.category.name : product.category}</p>
        
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm md:text-lg font-bold text-green-600">
            ${product.price.toLocaleString('es-CL')}
          </span>
        </div>
      </div>
      
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">Cantidad:</span>
          <select
            id={`quantity-${product.productId || product.id}`}
            className="border rounded px-1 py-0.5 text-xs w-12"
            value={quantity}
            onChange={e => onQuantityChange(product.productId || product.id || 0, Number(e.target.value))}
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>
        
        <div className="flex space-x-1.5">
          <button
            className="flex-1 bg-green-600 text-white rounded px-2 py-1.5 hover:bg-green-700 transition font-bold text-xs"
            onClick={() => onAddToCart(product)}
          >
            Agregar
          </button>
          <button
            onClick={() => navigate(`/product/${product.productId || product.id}`)}
            className="bg-gray-200 text-gray-800 rounded px-2 py-1.5 hover:bg-gray-300 transition font-semibold text-xs"
          >
            Ver
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;