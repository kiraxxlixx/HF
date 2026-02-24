import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';

// --- LAYOUTS Y COMPONENTES COMPARTIDOS ---
import Navbar from './components/shared/Navbar.jsx'; 
import ProtectedRoute from './components/shared/ProtectedRoute.jsx'; 
import ContactPage from './pages/client/ContactPage.jsx';

// --- PÁGINAS DE AUTENTICACIÓN ---
import LoginScreen from './pages/auth/LoginScreen.jsx'; 

// --- PÁGINAS DE CLIENTE (Públicas y Privadas) ---
import HomePage from './pages/client/HomePage.jsx';
import AboutPage from './pages/client/AboutPage.jsx';
import ClientCatalogPage from './pages/client/ClienteCatalogPage.jsx'; 
import CalculadoraPage from './pages/client/CalculadoraPage.jsx';

// --- PÁGINAS DE ADMINISTRADOR ---
import AdminLayout from './pages/admin/AdminLayout.jsx'; 
// 🚨 CAMBIO 1: Eliminamos la importación del AdminDashboard porque ya no existirá
// import AdminDashboard from './pages/admin/AdminDashboard.jsx'; 
import PromotionsManagement from './pages/admin/PromotionsManagement.jsx';
import AdminReviewModeration from './pages/admin/AdminReviewModeration.jsx'; 
import ProductManagement from './pages/admin/ProductManagement.jsx';
import SucursalesManagement from './pages/admin/SucursalesManagement.jsx';
import RegisterScreen from './pages/auth/RegisterScreen.jsx';

// ===========================================
// LAYOUT PRINCIPAL (Con Navbar y sin Carrito)
// ===========================================
const MainLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar /> {/* Barra de navegación visible para todos */}
            <main className="flex-grow">
                <Outlet /> {/* Aquí se renderizan las páginas hijas */}
            </main>
        </div>
    );
};

// ===========================================
// RUTAS DE LA APLICACIÓN
// ===========================================
const App = () => {
    return (
        <Router>
            <Routes>
                
                {/* 1. LOGIN (Ruta independiente) */}
                <Route path="/login" element={<LoginScreen />} />
                <Route path="/register" element={<RegisterScreen />} />
                
                {/* 2. RUTAS PRINCIPALES (Usan MainLayout) */}
                <Route element={<MainLayout />}>
                   {/* --- ZONA PÚBLICA (Catálogo, Contacto, Calculadora) --- */}
                   <Route path="/" element={<HomePage />} /> 
                   <Route path="/about" element={<AboutPage />} />
                   <Route path="/contact" element={<ContactPage />} />
                   <Route path="/client/catalogo" element={<ClientCatalogPage />} />
                   <Route path="/client/calculadora-helado" element={<CalculadoraPage />} />
                </Route>

                {/* 3. RUTAS DE ADMINISTRADOR (Layout Propio) */}
                <Route path="/admin" element={<ProtectedRoute allowedRoles="administrador" />}>
                    <Route element={<AdminLayout />}>
                       
                       {/* 🚨 CAMBIO 2: Eliminamos la ruta del dashboard */}
                       {/* <Route path="dashboard" element={<AdminDashboard />} /> */} 
                       
                       {/* Gestión */}
                       <Route path="productos" element={<ProductManagement />} /> 
                       <Route path="promociones" element={<PromotionsManagement />} />
                       <Route path="reviews" element={<AdminReviewModeration />} /> 
                       
                       {/* Sucursales */}
                       <Route path="gestionar-sucursales" element={<SucursalesManagement />} />
                       
                       {/* 🚨 CAMBIO 3: Redirección por defecto al entrar a /admin apunta a productos */}
                       <Route index element={<Navigate to="productos" replace />} />
                    </Route>
                </Route>

                {/* 4. MANEJO DE ERRORES (404) */}
                <Route path="*" element={
                    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
                        <h1 className="text-6xl font-bold text-pink-600 mb-4">404</h1>
                        <p className="text-xl text-gray-600 mb-8">Ups, no encontramos esa página.</p>
                        <a href="/" className="bg-pink-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-pink-700 transition">
                            Volver al Inicio
                        </a>
                    </div>
                } />

            </Routes>
        </Router>
    );
};

export default App;