import type { Product, ProductRepository } from '../domain/Product';

export const CATEGORIES = [
  'Todos',
  'Lácteos',
  'Carnes y Embutidos',
  'Frutas',
  'Verduras',
  'Panadería',
  'Snacks y Galletas',
  'Bebidas',
  'Licores',
  'Despensa',
  'Congelados',
  'Limpieza y Hogar'
];

export const PRODUCTS: Product[] = [
  {
    productId: 1,
    name: 'Leche Entera 1L',
    price: 1200,
    stock: 50,
    description: 'Leche entera fresca de alta calidad',
    categoryId: 1,
    imageUrl: '/products-san-nicolas/leche.jpg',
    rutSupplier: '12345678-9',
    status: true,
    supplier: {
      rut: '12345678-9',
      name: 'Lácteos del Sur',
      address: 'Av. Principal 123'
    },
    category: {
      categoryId: 1,
      name: 'Lácteos',
      description: 'Productos lácteos frescos'
    }
  },
  {
    productId: 2,
    name: 'Pan Integral 500g',
    price: 800,
    stock: 30,
    description: 'Pan integral artesanal',
    categoryId: 5,
    imageUrl: '/products-san-nicolas/pan.jpg',
    rutSupplier: '98765432-1',
    status: true,
    supplier: {
      rut: '98765432-1',
      name: 'Panadería Central',
      address: 'Calle del Pan 456'
    },
    category: {
      categoryId: 5,
      name: 'Panadería',
      description: 'Productos de panadería frescos'
    }
  }
];

export const SORT_OPTIONS = [
  { label: 'Por defecto', value: 'default' },
  { label: 'Precio: menor a mayor', value: 'price-asc' },
  { label: 'Precio: mayor a menor', value: 'price-desc' },
  { label: 'Nombre: A-Z', value: 'name-asc' },
  { label: 'Nombre: Z-A', value: 'name-desc' }
];

class InMemoryProductRepository implements ProductRepository {
  async getAll(): Promise<Product[]> {
    return Promise.resolve(PRODUCTS);
  }

  async getById(id: number): Promise<Product | null> {
    const product = PRODUCTS.find(p => p.productId === id);
    return Promise.resolve(product || null);
  }

  async getByCategory(category: string): Promise<Product[]> {
    if (category === 'Todos') {
      return this.getAll();
    }
    const products = PRODUCTS.filter(p => p.category.name === category);
    return Promise.resolve(products);
  }

  async search(term: string): Promise<Product[]> {
    const products = PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(term.toLowerCase()) ||
      p.category.name.toLowerCase().includes(term.toLowerCase())
    );
    return Promise.resolve(products);
  }

  async getCategories(): Promise<string[]> {
    return Promise.resolve(CATEGORIES);
  }
}

export const productRepository = new InMemoryProductRepository();