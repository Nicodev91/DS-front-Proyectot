import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import '../AdminLayout/AdminLayout.css';

const ClientLayout: React.FC = () => {
  const clientMenuItems = [
    { name: 'Catálogo', path: '/catalog', icon: 'fa-store' },
    { name: 'Mis Pedidos', path: '/client/orders', icon: 'fa-shopping-bag' },
    { name: 'Productos', path: '/client/products', icon: 'fa-box' },
    { name: 'Perfil', path: '/client/profile', icon: 'fa-user' },
    { name: 'Favoritos', path: '/client/favorites', icon: 'fa-heart' },
  ];

  return (
    <div className="admin-layout">
      <Sidebar menuItems={clientMenuItems} userType="client" />
      <div className="admin-content">
        <Header userType="client" />
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ClientLayout;