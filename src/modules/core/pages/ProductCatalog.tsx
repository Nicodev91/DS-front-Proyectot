import React, { useEffect, useMemo, useState } from 'react';
import { Banner, Filters, Header, ProductGrid, ShoppingCart } from '../../products/components';
import type { Product, ProductFilter } from '../../products/domain/Product';
import { useCategories, useProductCatalog, useProductSearch } from '../../products/hooks/useProductApi';
import { useShoppingCart } from '../../shopping-cart';

const ProductCatalog: React.FC = () => {
  // Estado local para filtros
  const [filters, setFilters] = useState<ProductFilter>({
    category: 'Todos',
    sortBy: 'default',
    searchTerm: ''
  });

  // Hooks de API
  const { products: allProducts, loading: catalogLoading, error: catalogError } = useProductCatalog();
  const { products: searchResults, loading: searchLoading, searchProducts } = useProductSearch();
  const { categories } = useCategories();

  // Función para filtrar productos por categoría localmente
  const filterProductsByCategory = (products: Product[], category: string): Product[] => {
    if (!category || category === 'Todos' || category === '1') {
      return products;
    }
    
    return products.filter(product => {
      const productCategory = typeof product.category === 'object' 
        ? product.category.name 
        : product.category;
      return productCategory === category;
    });
  };

  // Función para ordenar productos
  const sortProducts = (products: Product[], sortBy: string): Product[] => {
    const sortedProducts = [...products];
    
    switch (sortBy) {
      case 'price-asc':
        return sortedProducts.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sortedProducts.sort((a, b) => b.price - a.price);
      case 'name-asc':
        return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return sortedProducts;
    }
  };

  // Calcular productos filtrados y ordenados usando useMemo para optimización
  const displayProducts = useMemo(() => {
    let products = allProducts;
    
    // Si hay término de búsqueda, usar resultados de búsqueda
    if (filters.searchTerm && filters.searchTerm.trim()) {
      products = searchResults;
    } else {
      // Filtrar por categoría localmente
      products = filterProductsByCategory(allProducts, filters.category);
    }
    
    // Aplicar ordenamiento
    return sortProducts(products, filters.sortBy);
  }, [allProducts, searchResults, filters, filterProductsByCategory, sortProducts]);

  // Estado de carga y error
  const loading = filters.searchTerm && filters.searchTerm.trim() ? searchLoading : catalogLoading;
  const error = catalogError;

  const {
    cart,
    quantities,
    handleQuantityChange,
    handleAddToCart,
    removeFromCart
  } = useShoppingCart();

  // Función para actualizar filtros
  const updateFilter = (key: keyof ProductFilter, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Función para resetear filtros
  const resetFilters = () => {
    setFilters({
      category: 'Todos',
      sortBy: 'default',
      searchTerm: ''
    });
  };

  // Efecto para manejar búsqueda
  useEffect(() => {
    if (filters.searchTerm && filters.searchTerm.trim()) {
      searchProducts(filters.searchTerm);
    }
  }, [filters.searchTerm, searchProducts]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Cargando productos...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">Error al cargar productos: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Banner />
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Contenido principal */}
          <div className="flex-1">
            <Filters
              filters={filters}
              onFilterChange={updateFilter}
              onResetFilters={resetFilters}
              categories={categories}
            />
            
            <ProductGrid
              products={displayProducts}
              quantities={quantities}
              onQuantityChange={handleQuantityChange}
              onAddToCart={handleAddToCart}
            />
          </div>
          
          {/* Carrito lateral */}
          <div className="lg:w-80">
            <ShoppingCart
              cart={cart.items || cart}
              onRemoveFromCart={removeFromCart}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCatalog;