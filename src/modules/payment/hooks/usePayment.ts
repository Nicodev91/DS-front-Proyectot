import { useState, useEffect } from 'react';
import type { PaymentMethod, PaymentTransaction, PaymentRequest } from '../domain/Payment';
import { PaymentStatus, PaymentType } from '../domain/Payment';

// Mock data para desarrollo
const mockPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    type: PaymentType.CREDIT_CARD,
    name: 'Visa **** 1234',
    isDefault: true,
    details: {
      cardNumber: '**** **** **** 1234',
      expiryDate: '12/25',
      cardHolderName: 'Juan Pérez'
    }
  },
  {
    id: '2',
    type: PaymentType.DEBIT_CARD,
    name: 'Mastercard **** 5678',
    isDefault: false,
    details: {
      cardNumber: '**** **** **** 5678',
      expiryDate: '08/26',
      cardHolderName: 'Juan Pérez'
    }
  }
];

export const usePayment = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPaymentMethods();
    loadTransactions();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      setLoading(true);
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 500));
      setPaymentMethods(mockPaymentMethods);
    } catch (err: unknown) {
      setError('Error al cargar métodos de pago');
      console.error('Error loading payment methods:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadTransactions = async () => {
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 300));
      setTransactions([]);
    } catch (err: unknown) {
      setError('Error al cargar transacciones');
      console.error('Error loading transactions:', err);
    }
  };

  const processPayment = async (request: PaymentRequest): Promise<PaymentTransaction> => {
    try {
      setLoading(true);
      setError(null);

      // Simular procesamiento de pago
      await new Promise(resolve => setTimeout(resolve, 2000));

      const transaction: PaymentTransaction = {
        id: Date.now().toString(),
        orderId: request.orderId,
        amount: request.amount,
        currency: request.currency,
        paymentMethod: paymentMethods.find(pm => pm.id === request.paymentMethodId)!,
        status: PaymentStatus.COMPLETED,
        createdAt: new Date(),
        processedAt: new Date()
      };

      setTransactions(prev => [transaction, ...prev]);
      return transaction;
    } catch (err: unknown) {
      console.error('Error processing payment:', err);
      const failedTransaction: PaymentTransaction = {
        id: Date.now().toString(),
        orderId: request.orderId,
        amount: request.amount,
        currency: request.currency,
        paymentMethod: paymentMethods.find(pm => pm.id === request.paymentMethodId)!,
        status: PaymentStatus.FAILED,
        createdAt: new Date(),
        failureReason: 'Error en el procesamiento'
      };
      
      setTransactions(prev => [failedTransaction, ...prev]);
      throw new Error('Error al procesar el pago');
    } finally {
      setLoading(false);
    }
  };

  const addPaymentMethod = async (method: Omit<PaymentMethod, 'id'>): Promise<PaymentMethod> => {
    try {
      setLoading(true);
      
      const newMethod: PaymentMethod = {
        ...method,
        id: Date.now().toString()
      };
      
      setPaymentMethods(prev => [...prev, newMethod]);
      return newMethod;
    } catch (err: unknown) {
      setError('Error al agregar método de pago');
      console.error('Error adding payment method:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removePaymentMethod = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setPaymentMethods(prev => prev.filter(pm => pm.id !== id));
    } catch (err: unknown) {
      setError('Error al eliminar método de pago');
      console.error('Error removing payment method:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const setDefaultPaymentMethod = (id: string) => {
    setPaymentMethods(prev => 
      prev.map(pm => ({
        ...pm,
        isDefault: pm.id === id
      }))
    );
  };

  return {
    paymentMethods,
    transactions,
    loading,
    error,
    processPayment,
    addPaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod,
    loadPaymentMethods,
    loadTransactions
  };
};