// Domain
export type { Product, ProductFilter, ProductRepository } from './domain/Product';

// Exportar servicios
export { ProductService } from './services/ProductService';

// Hooks
export { useProductFilters } from './hooks/useProductFilters';
export { useProductCatalog, useProduct, useProductSearch, useProductsByCategory, useCategories } from './hooks/useProductApi';

// Components
export { default as ProductCard } from './components/ProductCard/ProductCard';
export { default as ProductCatalogApi } from './components/ProductCatalogApi/ProductCatalogApi';

// Pages
export { default as ProductDetail } from './pages/ProductDetail';