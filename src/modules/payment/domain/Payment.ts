export interface PaymentMethod {
  id: string;
  type: PaymentType;
  name: string;
  isDefault: boolean;
  details: PaymentDetails;
}

export enum PaymentType {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  BANK_TRANSFER = 'bank_transfer',
  CASH = 'cash',
  DIGITAL_WALLET = 'digital_wallet'
}

export interface PaymentDetails {
  cardNumber?: string;
  expiryDate?: string;
  cardHolderName?: string;
  bankAccount?: string;
  walletId?: string;
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  createdAt: Date;
  processedAt?: Date;
  failureReason?: string;
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

export interface PaymentRequest {
  amount: number;
  currency: string;
  paymentMethodId: string;
  orderId: string;
  description?: string;
}

export interface PaymentService {
  processPayment(request: PaymentRequest): Promise<PaymentTransaction>;
  getPaymentMethods(): Promise<PaymentMethod[]>;
  addPaymentMethod(method: Omit<PaymentMethod, 'id'>): Promise<PaymentMethod>;
  removePaymentMethod(id: string): Promise<void>;
  getTransactionHistory(): Promise<PaymentTransaction[]>;
  getTransactionById(id: string): Promise<PaymentTransaction | null>;
  refundTransaction(id: string): Promise<PaymentTransaction>;
}