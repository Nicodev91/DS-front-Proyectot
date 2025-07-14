import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

interface MenuItem {
  name: string;
  path: string;
  icon: string;
}

interface SidebarProps {
  collapsed?: boolean;
  menuItems?: MenuItem[];
  userType?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed = false, menuItems = [], userType = 'admin' }) => {
  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-logo">
        <h2>{userType === 'client' ? 'Cliente' : 'Admin Panel'}</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {menuItems.length > 0 ? (
            menuItems.map((item, index) => (
              <li key={index}>
                <NavLink to={item.path} className={({isActive}) => isActive ? 'active' : ''}>
                  <i className={`fas ${item.icon}`}></i>
                  <span>{item.name}</span>
                </NavLink>
              </li>
            ))
          ) : (
            null
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;