// Domain
export type { Cart, CartItem, CartService, CartRepository } from './domain/Cart';

// Services
export { cartService } from './services/CartService';
export { whatsAppService } from './services/WhatsAppService';

// Infrastructure
export { cartRepository } from './infrastructure/CartRepository';

// Hooks
export { useShoppingCart } from './hooks/useShoppingCart';

// Components
export { default as PurchaseSummary } from './components/PurchaseSummary/PurchaseSummary';

// Pages
export { default as PurchaseSummaryPage } from './pages/PurchaseSummaryPage';
export { default as OrderSummaryPage } from './pages/OrderSummaryPage';