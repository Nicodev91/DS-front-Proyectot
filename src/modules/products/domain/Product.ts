export interface Product {
  productId: number;
  name: string;
  price: number;
  stock: number;
  description: string;
  categoryId: number;
  imageUrl: string;
  rutSupplier: string;
  status: boolean;
  supplier: {
    rut: string;
    name: string;
    address: string;
  };
  category: {
    categoryId: number;
    name: string;
    description: string;
  };
  // Campos para compatibilidad con componentes existentes
  id?: number;
  image?: string;
  isNew?: boolean;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface ProductFilter {
  category: string;
  sortBy: string;
  searchTerm: string;
}

export interface ProductRepository {
  getAll(): Promise<Product[]>;
  getById(id: number): Promise<Product | null>;
  getByCategory(category: string): Promise<Product[]>;
  search(term: string): Promise<Product[]>;
  getCategories(): Promise<string[]>;
}

export interface CartRepository {
  getCart(): CartItem[];
  addItem(product: Product, quantity: number): void;
  removeItem(productId: number): void;
  updateQuantity(productId: number, quantity: number): void;
  clearCart(): void;
}