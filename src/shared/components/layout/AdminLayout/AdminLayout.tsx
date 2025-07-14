import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import './AdminLayout.css';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import Footer from '../Footer/Footer';

const AdminLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobileSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Efecto para manejar el cambio de tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 992 && !sidebarCollapsed) {
        setSidebarCollapsed(true);
        setSidebarOpen(false);
      }
    };

    // Ejecutar al montar para establecer el estado inicial correcto
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarCollapsed]);

  return (
    <div className={`admin-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''} ${sidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Sidebar */}
      <Sidebar collapsed={sidebarCollapsed} />
      
      {/* Main Content Area */}
      <div className="main-content">
        {/* Header/Navigation Bar */}
        <Header 
          toggleSidebar={toggleSidebar} 
          toggleMobileSidebar={toggleMobileSidebar} 
          sidebarCollapsed={sidebarCollapsed}
        />
        
        {/* Content Area */}
        <div className="content-wrapper">
          <Outlet />
        </div>
        
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default AdminLayout;