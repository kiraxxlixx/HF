// src/pages/admin/AdminLayout.jsx

import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Menu } from 'lucide-react';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="flex min-h-screen bg-gray-100 overflow-hidden">
      
      {/* --- Sidebar --- */}
      <nav 
        className={`bg-white shadow-md flex flex-col transition-all duration-300 ease-in-out ${
            isSidebarOpen ? 'w-64 p-4' : 'w-0 p-0 overflow-hidden border-none'
        }`}
      >
        <div className="w-60">
            <Link 
  to="/" 
  className="text-xl font-bold text-pink-600 mb-4 px-3 whitespace-nowrap hover:text-pink-700 transition block"
>
  Happy Factory
</Link>

            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mt-4 mb-2 whitespace-nowrap">
                Gestión
            </h3>

            <Link 
                to="/admin/productos" 
                className={`block py-2 px-3 rounded ${
                    isActive('/admin/productos') 
                    ? 'bg-pink-100 text-pink-700' 
                    : 'hover:bg-gray-100'
                }`}
            >
                Productos
            </Link>

            <Link 
                to="/admin/promociones" 
                className={`block py-2 px-3 rounded ${
                    isActive('/admin/promociones') 
                    ? 'bg-pink-100 text-pink-700' 
                    : 'hover:bg-gray-100'
                }`}
            >
                Promociones
            </Link>

            <Link 
                to="/admin/reviews" 
                className={`block py-2 px-3 rounded ${
                    isActive('/admin/reviews') 
                    ? 'bg-pink-100 text-pink-700' 
                    : 'hover:bg-gray-100'
                }`}
            >
                Moderación (Reviews)
            </Link>

            {/* --- SUCURSALES (SOLO CREAR) --- */}
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mt-6 mb-2">
                Sucursales
            </h3>

            <Link 
                to="/admin/gestionar-sucursales"
                className={`block py-2 px-3 rounded ${
                    isActive('/admin/gestionar-sucursales') 
                    ? 'bg-pink-100 text-pink-700' 
                    : 'hover:bg-gray-100'
                }`}
            >
                Crear / Gestionar
            </Link>
        </div>
      </nav>

      {/* --- Contenido Principal --- */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-20">
          <div className="flex items-center gap-4">
            
            <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition"
            >
                <Menu size={24} />
            </button>

            <h1 className="text-xl font-semibold text-gray-800">
                Panel de Administración
            </h1>
          </div>

          <button 
            onClick={logout} 
            className="bg-pink-600 text-white text-sm font-semibold py-2 px-4 rounded-lg hover:bg-pink-700 transition"
          >
            Salir
          </button>
        </header>
        
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;