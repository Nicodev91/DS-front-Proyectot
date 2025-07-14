import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import OrderSummary from '../components/OrderSummary/OrderSummary';

interface OrderSummaryState {
  orderId: string;
  status: string;
  customerName: string;
  shippingAddress: string;
  total: number;
  orderDate: string;
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
    />
  );
};

export default OrderSummaryPage;