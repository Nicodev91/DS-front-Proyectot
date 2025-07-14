import React from 'react';
import { useProductCatalog } from '../../hooks/useProductApi';
import ProductCard from '../ProductCard/ProductCard';
import { config } from '../../../../shared/utils/config';
import './ProductCatalogApi.css';

/**
 * Componente que demuestra el uso del servicio axios
 * para obtener productos del endpoint API configurado dinámicamente
 */
const ProductCatalogApi: React.FC = () => {
  const { products, loading, error, refetch } = useProductCatalog();

  if (loading) {
    return (
      <div className="product-catalog-api">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando productos desde la API...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-catalog-api">
        <div className="error-container">
          <h3>Error al cargar productos</h3>
          <p className="error-message">{error}</p>
          <button 
            className="retry-button" 
            onClick={refetch}
          >
            Reintentar
          </button>
          <div className="error-details">
            <h4>Detalles técnicos:</h4>
            <ul>
              <li>Endpoint: <code>{config.apiBaseUrl}/v1/catalog/products</code></li>
              <li>Método: GET</li>
              <li>Implementación: Axios</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-catalog-api">
      <div className="catalog-header">
        <h2>Catálogo de Productos (API)</h2>
        <p className="api-info">
          Datos obtenidos desde: <code>{config.apiBaseUrl}/v1/catalog/products</code>
        </p>
        <button 
          className="refresh-button" 
          onClick={refetch}
          title="Actualizar datos desde la API"
        >
          🔄 Actualizar
        </button>
      </div>

      {products.length === 0 ? (
        <div className="empty-state">
          <h3>No se encontraron productos</h3>
          <p>La API no devolvió ningún producto.</p>
        </div>
      ) : (
        <>
          <div className="products-count">
            <span>Total de productos: {products.length}</span>
          </div>
          
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard 
                key={product.productId || product.id} 
                product={product}
                quantity={1}
                onQuantityChange={() => {}}
                onAddToCart={() => console.log('Agregar al carrito:', product.name)}
              />
            ))}
          </div>
        </>
      )}

      <div className="api-status">
        <div className="status-indicator success">
          <span className="status-dot"></span>
          Conectado a la API
        </div>
        <small>Última actualización: {new Date().toLocaleTimeString()}</small>
      </div>
    </div>
  );
};

export default ProductCatalogApi;