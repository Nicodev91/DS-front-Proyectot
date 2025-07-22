import React, { useState, useEffect } from 'react';
import type { ProductFilter } from '../../domain/Product';
import { SORT_OPTIONS } from '../../infrastructure/ProductRepository';

interface FiltersProps {
  filters: ProductFilter;
  onFilterChange: (key: keyof ProductFilter, value: string) => void;
  onResetFilters: () => void;
  categories?: string[];
}

const Filters: React.FC<FiltersProps> = ({ filters, onFilterChange, onResetFilters, categories = [] }) => {
  // Estado local para el término de búsqueda
  const [searchInputValue, setSearchInputValue] = useState(filters.searchTerm);
  
  // Efecto para implementar el debounce
  useEffect(() => {
    // Configuramos un temporizador para actualizar el filtro después de 500ms de inactividad
    const timeoutId = setTimeout(() => {
      // Solo actualizamos si el valor ha cambiado
      if (searchInputValue !== filters.searchTerm) {
        onFilterChange('searchTerm', searchInputValue);
      }
    }, 500);
    
    // Limpiamos el temporizador si el componente se desmonta o si searchInputValue cambia
    return () => clearTimeout(timeoutId);
  }, [searchInputValue, filters.searchTerm, onFilterChange]);
  
  // Manejador para el evento de tecla Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onFilterChange('searchTerm', searchInputValue);
    }
  };
  
  return (
    <div className="bg-gradient-to-r from-white to-green-50 p-6 rounded-xl shadow-lg border border-green-100 mb-8">
      {/* Título de filtros */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🔍</span>
        <h3 className="text-lg font-semibold text-gray-800">Filtros y Búsqueda</h3>
      </div>
      
      {/* Búsqueda y ordenamiento - Mobile */}
      <div className="md:hidden mb-6 space-y-3">
        <div className="relative">
          <input
            type="text"
            placeholder="🔍 Buscar producto..."
            className="w-full border-2 border-green-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 bg-white shadow-sm"
            value={searchInputValue}
            onChange={e => setSearchInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="flex gap-3">
          <select
            className="flex-1 border-2 border-green-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white shadow-sm"
            value={filters.sortBy}
            onChange={e => onFilterChange('sortBy', e.target.value)}
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <button
            onClick={onResetFilters}
            className="px-4 py-3 text-sm bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
          >
            🗑️ Limpiar
          </button>
        </div>
      </div>

      {/* Categorías */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">🏷️</span>
          <h4 className="font-medium text-gray-700">Categorías</h4>
        </div>
        <div className="flex gap-2 md:gap-3 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              className={`px-3 md:px-5 py-2 md:py-2.5 rounded-full border-2 text-xs md:text-sm font-semibold transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md ${
                filters.category === cat 
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white border-green-500 shadow-lg' 
                  : 'bg-white text-gray-700 border-green-200 hover:bg-green-50 hover:border-green-300'
              }`}
              onClick={() => onFilterChange('category', cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Búsqueda y ordenamiento - Desktop */}
      <div className="hidden md:flex gap-4 items-center justify-between bg-white p-4 rounded-lg border border-green-200 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-lg">⚙️</span>
          <span className="font-medium text-gray-700">Herramientas:</span>
        </div>
        <div className="flex gap-3 items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="🔍 Buscar producto..."
              className="border-2 border-green-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 bg-white shadow-sm min-w-[200px]"
              value={searchInputValue}
              onChange={e => setSearchInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <select
            className="border-2 border-green-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white shadow-sm min-w-[150px]"
            value={filters.sortBy}
            onChange={e => onFilterChange('sortBy', e.target.value)}
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <button
            onClick={onResetFilters}
            className="px-4 py-2.5 text-sm bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
          >
            🗑️ Limpiar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filters;