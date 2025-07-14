import React, { useState } from 'react';
import './Header.css';

interface HeaderProps {
  toggleSidebar?: () => void;
  toggleMobileSidebar?: () => void;
  sidebarCollapsed?: boolean;
  userType?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  toggleSidebar, 
  toggleMobileSidebar, 
  sidebarCollapsed = false, 
  //userType = 'admin' 
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <header className="admin-header">
      <div className="header-left">
        <button 
          className="sidebar-toggle" 
          onClick={window.innerWidth > 992 ? toggleSidebar : toggleMobileSidebar}
          title={sidebarCollapsed ? "Expandir menú" : "Colapsar menú"}
        >
          <i className={`fas ${sidebarCollapsed ? 'fa-bars' : 'fa-bars-staggered'}`}></i>
        </button>

        <form className="search-bar" onSubmit={handleSearch}>
          <i className="fas fa-search"></i>
          <input 
            type="text" 
            placeholder="Buscar..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

      <div className="header-right">
        <button className="notification-btn">
          <i className="fas fa-bell"></i>
          <span className="badge">3</span>
        </button>
        <button className="notification-btn">
          <i className="fas fa-envelope"></i>
          <span className="badge">5</span>
        </button>
        <div className="user-profile">
          <span className="user-name">Admin User</span>
          <i className="fas fa-chevron-down"></i>
        </div>
      </div>
    </header>
  );
};

export default Header;