import { useEffect, useState } from 'react';
import type { Product, ProductFilter } from '../domain/Product';
import { ProductService } from '../services/ProductService';

// Instancia del servicio para datos mock
const productService = new ProductService();

export const useProductFilters = () => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<ProductFilter>({
    category: 'Todos',
    sortBy: 'default',
    searchTerm: ''
  });

  // Cargar productos iniciales
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const allProducts = await productService.getAllProducts();
        setFilteredProducts(allProducts);
      } catch (err: unknown) {
        console.error('Error loading products:', err);
        setError('Error al cargar los productos');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Aplicar filtros cuando cambien
  useEffect(() => {
    const applyFilters = async () => {
      try {
        setLoading(true);
        const filtered = await productService.getFilteredProducts(filters);
        setFilteredProducts(filtered);
      } catch (err: unknown) {
        console.error('Error filtering products:', err);
        setError('Error al filtrar productos');
      } finally {
        setLoading(false);
      }
    };

    applyFilters();
  }, [filters]);

  const updateFilter = (key: keyof ProductFilter, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      category: 'Todos',
      sortBy: 'default',
      searchTerm: ''
    });
  };


  return {
    products: filteredProducts,
    filters,
    loading,
    error,
    updateFilter,
    resetFilters,
  };
};