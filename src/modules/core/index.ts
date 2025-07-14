// Core UI Components
// Note: Button component is located in src/components/common/ui/button/Button

// Core Types
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  status: number;
}

// Core Utilities
export const formatCurrency = (amount: number, currency: string = 'CLP'): string => {
  return `$${amount.toFixed(0)} ${currency}`;
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('es-CL');
};

export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Pages
export { default as ProductCatalog } from './pages/ProductCatalog';