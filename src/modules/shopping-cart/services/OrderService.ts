import axios, { type AxiosResponse } from 'axios';
import { getApiBaseUrl } from '../../../shared/utils/config';

// Crear instancia de axios con configuración dinámica
const apiClient = axios.create({
  baseURL: `${getApiBaseUrl()}/v1`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interfaces para la orden
export interface OrderCustomer {
  rut: string;
  name: string;
  phone: string;
  email: string;
  address: string;
}

export interface OrderNotification {
  channelId: number;
  message: string;
  status: string;
}

export interface OrderDetail {
  productId: number;
  quantity: number;
}

export interface CompleteOrderRequest {
  customer: OrderCustomer;
  notification: OrderNotification;
  orderDate: string;
  shippingAddress: string;
  orderDetails: OrderDetail[];
}

export interface OrderResponse {
  orderNumber: string;
  status: string;
  customer: string;
  shippingAddress: string;
  orderDate: string;
  total: string;
}

class OrderService {
  async completeOrder(orderData: CompleteOrderRequest): Promise<OrderResponse> {
    try {
      const response: AxiosResponse<OrderResponse> = await apiClient.post('/orders/complete', orderData);
      
      if (response.status === 200 || response.status === 201) {
        return response.data;
      }
      
      throw new Error('Error al completar la orden');
    } catch (error) {
      console.error('Error al completar la orden:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED') {
          throw new Error(`No se puede conectar al servidor de órdenes. Verifique que esté ejecutándose en ${getApiBaseUrl()}`);
        } else if (error.response) {
          throw new Error(`Error del servidor: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`);
        } else if (error.request) {
          throw new Error('No se recibió respuesta del servidor');
        }
      }
      
      throw new Error('Error inesperado al completar la orden');
    }
  }
}

export const orderService = new OrderService();
export default OrderService;