import axios, { type AxiosResponse } from 'axios';
import type { Product, ProductFilter } from '../domain/Product';
import { config } from '../../../shared/utils/config';

// Crear instancia de axios con configuración dinámica
const apiClient = axios.create({
  baseURL: `${config.apiBaseUrl}/v1`,
  timeout: config.apiTimeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptores
apiClient.interceptors.request.use(
  (config) => {
    console.log('Realizando petición a:', config.url);
    return config;
  },
  (error) => {
    console.error('Error en la petición:', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('Respuesta recibida:', response.status, response.statusText);
    return response;
  },
  (error) => {
    console.error('Error en la respuesta:', error.response?.status, error.response?.statusText);
    return Promise.reject(error);
  }
);

// Interfaz para respuestas de API
interface ApiResponse<T> {
  data: T;
  message?: string;
  status: string;
}

// Interfaz para respuesta paginada del catálogo
interface CatalogApiResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class ProductService {

  constructor() {
  }

  async getAllProducts(): Promise<Product[]> {
      return await this.getCatalogProductsFromApi();
  }

  async getProductById(id: number): Promise<Product | null> {
      return await this.getProductByIdFromApi(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
      return await this.getProductsByCategoryFromApi(category);
  }

  async searchProducts(term: string): Promise<Product[]> {
      return await this.searchProductsFromApi(term);
  }

  // Métodos específicos para API
  async getCatalogProductsFromApi(): Promise<Product[]> {
    try {
      const response: AxiosResponse<CatalogApiResponse> = await apiClient.get('/catalog/products');
      
      if (response.status === 200 && response.data && response.data.products) {
        return response.data.products;
      }
      
      throw new Error('Respuesta inválida del servidor');
    } catch (error) {
      console.error('Error al obtener productos del catálogo:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED') {
          throw new Error(`No se puede conectar al servidor. Verifique que esté ejecutándose en ${config.apiBaseUrl}`);
        } else if (error.response) {
          throw new Error(`Error del servidor: ${error.response.status} - ${error.response.statusText}`);
        } else if (error.request) {
          throw new Error('No se recibió respuesta del servidor');
        }
      }
      
      throw new Error('Error desconocido al obtener productos');
    }
  }

  async getProductByIdFromApi(id: number): Promise<Product | null> {
    try {
      const response: AxiosResponse<ApiResponse<Product>> = await apiClient.get(`/catalog/products/${id}`);
      
      if (response.status === 200 && response.data) {
        return response.data.data || response.data;
      }
      
      return null;
    } catch (error) {
      console.error(`Error al obtener producto con ID ${id}:`, error);
      
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      
      throw error;
    }
  }

  async searchProductsFromApi(searchTerm: string): Promise<Product[]> {
    try {
      const response: AxiosResponse<CatalogApiResponse> = await apiClient.get('/catalog/products', {
        params: { search: searchTerm }
      });
      
      if (response.status === 200 && response.data && response.data.products) {
        return response.data.products;
      }
      
      return [];
    } catch (error) {
      console.error('Error al buscar productos:', error);
      throw error;
    }
  }

  async getProductsByCategoryFromApi(category: string): Promise<Product[]> {
    try {
      const response: AxiosResponse<CatalogApiResponse> = await apiClient.get('/catalog/products', {
        params: { category: category }
      });
      
      if (response.status === 200 && response.data && response.data.products) {
        return response.data.products;
      }
      
      return [];
    } catch (error) {
      console.error(`Error al obtener productos de la categoría ${category}:`, error);
      throw error;
    }
  }

  async getFilteredProducts(filter: ProductFilter): Promise<Product[]> {
    let products: Product[];

    // Filtrar por categoría
    if (filter.category && filter.category !== 'Todos') {
      products = await this.getProductsByCategory(filter.category);
    } else {
      products = await this.getAllProducts();
    }

    // Filtrar por término de búsqueda
    if (filter.searchTerm) {
      products = products.filter(product => 
        product.name.toLowerCase().includes(filter.searchTerm.toLowerCase()) ||
        (typeof product.category === 'object' ? product.category.name : product.category).toLowerCase().includes(filter.searchTerm.toLowerCase())
      );
    }

    // Ordenar productos
    products = this.sortProducts(products, filter.sortBy);

    return products;
  }

  private sortProducts(products: Product[], sortBy: string): Product[] {
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
  }

  // Método para obtener categorías
  async getCategories(): Promise<string[]> {
      return await this.getCategoriesFromApi();
  }

  async getCategoriesFromApi(): Promise<string[]> {
    try {
      interface CategoryResponse {
        categoryId: number;
        name: string;
        description: string;
      }
      
      const response: AxiosResponse<CategoryResponse[]> = await apiClient.get('/catalog/categories');
      
      if (response.status === 200 && response.data && Array.isArray(response.data)) {
        // Extraer solo los nombres de las categorías y agregar "Todos" al inicio
        const categoryNames = response.data.map(category => category.name);
        return ['Todos', ...categoryNames];
      }
      
      return ['Todos', 'Lácteos', 'Carnes y Embutidos', 'Frutas', 'Verduras', 'Panadería', 'Snacks y Galletas', 'Bebidas', 'Licores', 'Despensa', 'Congelados', 'Limpieza y Hogar'];
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      // En caso de error, devolver categorías por defecto
      return ['Todos', 'Lácteos', 'Carnes y Embutidos', 'Frutas', 'Verduras', 'Panadería', 'Snacks y Galletas', 'Bebidas', 'Licores', 'Despensa', 'Congelados', 'Limpieza y Hogar'];
    }
  }
}