import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../auth';

// Componente para la sección de usuario autenticado en desktop
const UserProfileSection: React.FC<{ user: any; isClient: boolean; logout: () => void }> = ({ user, isClient, logout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar y nombre del usuario */}
      <div 
        className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-xl p-3 transition-all duration-300"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        {/* Avatar con iniciales mejorado */}
        <div className="relative w-10 h-10 rounded-full overflow-hidden shadow-lg">
          {/* Fondo con gradiente animado */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 animate-pulse"></div>
          {/* Patrón decorativo */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20"></div>
          {/* Círculo interior con efecto de brillo */}
          <div className="absolute inset-0.5 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center">
            {/* Letra con sombra y efecto 3D */}
            <span className="text-white font-bold text-sm drop-shadow-lg transform hover:scale-110 transition-transform duration-200" style={{textShadow: '0 2px 4px rgba(0,0,0,0.3)'}}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          {/* Efecto de brillo superior */}
          <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-white/30 to-transparent rounded-full blur-sm"></div>
        </div>
        
        {/* Información del usuario */}
        <div className="flex flex-col">
          <div className="text-sm font-semibold text-gray-800">
            ¡Hola, {user?.name}!
          </div>
          {isClient && (
            <div className="flex items-center gap-1 text-xs">
              <svg className="w-3 h-3 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-emerald-600 font-medium">Cliente VIP - 5% descuento</span>
            </div>
          )}
        </div>
        
        {/* Icono de dropdown */}
        <svg 
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      
      {/* Dropdown menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50">
          {/* Información del usuario */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden shadow-xl">
                {/* Fondo con gradiente animado */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600"></div>
                {/* Patrón decorativo */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20"></div>
                {/* Círculo interior con efecto de brillo */}
                <div className="absolute inset-0.5 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center">
                  {/* Letra con sombra y efecto 3D */}
                  <span className="text-white font-bold text-base drop-shadow-lg" style={{textShadow: '0 2px 4px rgba(0,0,0,0.3)'}}>
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                {/* Efecto de brillo superior */}
                <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-white/30 to-transparent rounded-full blur-sm"></div>
              </div>
              <div>
                <div className="font-semibold text-gray-800">{user?.name}</div>
                <div className="text-sm text-gray-500">{user?.email}</div>
                {isClient && (
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="text-xs text-emerald-600 font-medium">Cliente VIP</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Opciones del menú */}
          <div className="py-2">
            <button 
              onClick={() => {
                navigate('/');
                setIsDropdownOpen(false);
              }}
              className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-emerald-100 hover:text-emerald-700 flex items-center gap-3 transition-all duration-300 rounded-lg mx-2 font-semibold"
            >
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Catálogo
            </button>
            <button 
              onClick={() => {
                navigate('/profile');
                setIsDropdownOpen(false);
              }}
              className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 flex items-center gap-3 transition-all duration-300 rounded-lg mx-2 font-semibold"
            >
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Mi Perfil
            </button>
            <button 
              onClick={() => {
                navigate('/orders');
                setIsDropdownOpen(false);
              }}
              className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100 hover:text-purple-700 flex items-center gap-3 transition-all duration-300 rounded-lg mx-2 font-semibold"
            >
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Mis Pedidos
            </button>
            {/* <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Favoritos
            </button> */}
          </div>
          
          {/* Botón de cerrar sesión */}
          <div className="border-t border-gray-100 pt-2">
            <button 
              onClick={logout}
              className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:text-red-700 flex items-center gap-3 transition-all duration-300 rounded-lg mx-2 font-bold"
            >
              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Componente para los botones de autenticación en desktop
const AuthButtons: React.FC = () => (
  <>
    <Link 
      to="/register" 
      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 hover:-translate-y-0.5 border border-blue-400 flex items-center justify-center gap-2 backdrop-blur-sm min-w-[140px]"
    >
      <svg className="w-6 h-6 flex-shrink-0" fill="white" stroke="white" viewBox="0 0 24 24" strokeWidth="3">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
      <span className="text-white font-bold">Registro</span>
    </Link>
    <Link 
      to="/login" 
      className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 hover:-translate-y-0.5 border border-emerald-400 flex items-center justify-center gap-2 backdrop-blur-sm min-w-[140px]"
    >
      <svg className="w-6 h-6 flex-shrink-0" fill="white" stroke="white" viewBox="0 0 24 24" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 12H9l-1 1-1 1-2.248 2.248A6 6 0 0112 3a6 6 0 016 6zM9 10a1 1 0 100-2 1 1 0 000 2z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2h4a2 2 0 002-2v-6z" />
      </svg>
      <span className="text-white font-bold">Iniciar</span>
    </Link>
  </>
);

// Componente para la sección de usuario en móvil
const MobileUserSection: React.FC<{ user: any; isClient: boolean; logout: () => void }> = ({ user, isClient, logout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  return (
    <div className="relative" ref={mobileMenuRef}>
      <button 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-emerald-400"
      >
        <div className="relative w-6 h-6 rounded-full overflow-hidden">
          {/* Fondo con gradiente */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-white/10"></div>
          {/* Círculo interior */}
          <div className="absolute inset-0.5 bg-gradient-to-br from-white/20 to-white/5 rounded-full flex items-center justify-center">
            {/* Letra con efecto */}
            <span className="text-white font-bold text-xs drop-shadow-sm" style={{textShadow: '0 1px 2px rgba(0,0,0,0.3)'}}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
        </div>
        <span className="hidden sm:inline">{user?.name}</span>
        <svg className={`w-3 h-3 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
          <div className="px-3 py-2 border-b border-gray-100">
            <div className="text-sm font-semibold text-gray-800">{user?.name}</div>
            {isClient && (
              <div className="text-xs text-emerald-600 font-medium">Cliente VIP - 5% desc.</div>
            )}
          </div>
          
          <button 
            onClick={() => {
              navigate('/');
              setIsMenuOpen(false);
            }}
            className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-emerald-100 hover:text-emerald-700 flex items-center gap-3 transition-all duration-300 rounded-lg mx-2 font-semibold"
          >
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Catálogo
          </button>
          
          <button 
            onClick={() => {
              navigate('/profile');
              setIsMenuOpen(false);
            }}
            className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:text-blue-700 flex items-center gap-3 transition-all duration-300 rounded-lg mx-2 font-semibold"
          >
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Mi Perfil
          </button>
          
          <button 
            onClick={() => {
              navigate('/orders');
              setIsMenuOpen(false);
            }}
            className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100 hover:text-purple-700 flex items-center gap-3 transition-all duration-300 rounded-lg mx-2 font-semibold"
          >
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Mis Pedidos
          </button>
          
          <div className="border-t border-gray-100 mt-2 pt-2">
            <button 
              onClick={logout}
              className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:text-red-700 flex items-center gap-3 transition-all duration-300 rounded-lg mx-2 font-bold"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Componente para los botones de autenticación en móvil
const MobileAuthButtons: React.FC = () => (
  <>
    <Link 
      to="/register" 
      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-0.5 border border-blue-400 flex items-center justify-center gap-1.5 backdrop-blur-sm min-w-[80px]"
    >
      <svg className="w-5 h-5 flex-shrink-0" fill="white" stroke="white" viewBox="0 0 24 24" strokeWidth="3">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
      <span className="text-white font-bold text-xs">Registro</span>
    </Link>
    <Link 
      to="/login" 
      className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-0.5 border border-emerald-400 flex items-center justify-center gap-1.5 backdrop-blur-sm min-w-[80px]"
    >
      <svg className="w-5 h-5 flex-shrink-0" fill="white" stroke="white" viewBox="0 0 24 24" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 12H9l-1 1-1 1-2.248 2.248A6 6 0 0112 3a6 6 0 016 6zM9 10a1 1 0 100-2 1 1 0 000 2z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2h4a2 2 0 002-2v-6z" />
      </svg>
      <span className="text-white font-bold text-xs">Iniciar</span>
    </Link>
  </>
);

const Header: React.FC = () => {
  const { isAuthenticated, isClient, user, logout } = useAuth();
  console.log(user)
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-5xl mx-auto px-4 py-3">
        {/* Desktop Header */}
        <div className="hidden md:flex justify-between items-center">
          <div className="text-xl font-bold text-green-700">Supermercado San Nicolás</div>
          <div className="text-sm text-gray-600 font-bold">Registrate y obtén un 5% de descuento en todas tus compras!</div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <UserProfileSection user={user} isClient={isClient} logout={logout} />
            ) : (
              <AuthButtons />
            )}
          </div>
        </div>
        
        {/* Mobile Header */}
        <div className="md:hidden">
          <div className="flex justify-between items-center mb-2">
            <div className="text-lg font-bold text-green-700">Supermercado San Nicolás</div>
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <MobileUserSection user={user} isClient={isClient} logout={logout} />
              ) : (
                <MobileAuthButtons />
              )}
            </div>
          </div>

          <div className="text-xs text-gray-600 text-center">
            ¡Registrate y obtén un 5% de descuento!
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;