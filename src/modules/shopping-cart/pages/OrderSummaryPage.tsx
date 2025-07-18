import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import OrderSummary from '../components/OrderSummary/OrderSummary';

interface CartItemDetail {
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface OrderSummaryState {
  orderId: string;
  status: string;
  customerName: string;
  shippingAddress: string;
  total: number;
  orderDate: string;
  cartItems?: CartItemDetail[];
}

const OrderSummaryPage: React.FC = () => {
  const location = useLocation();
  const orderData = location.state as OrderSummaryState;

  // Si no hay datos del pedido, redirigir al carrito
  if (!orderData) {
    return <Navigate to="/cart" replace />;
  }

  return (
    <OrderSummary
      orderId={orderData.orderId}
      status={orderData.status}
      customerName={orderData.customerName}
      shippingAddress={orderData.shippingAddress}
      total={orderData.total}
      orderDate={orderData.orderDate}
      cartItems={orderData.cartItems || []}
    />
  );
};

export default OrderSummaryPage;