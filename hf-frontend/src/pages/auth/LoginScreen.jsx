import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Popcorn } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userRole = await login(email, password);
      redirectUser(userRole);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  const redirectUser = (role) => {
    switch (role) {
      case 'administrador': 
        navigate('/admin/productos'); 
        break;
      case 'cliente': 
        navigate('/client/catalogo'); 
        break;
      default: 
        setError('Rol de usuario no reconocido.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        
        <h2 className="text-3xl font-extrabold text-center text-pink-600 mb-6 flex items-center justify-center gap-2">
          <Popcorn size={36} className="text-pink-600" /> 
          Happy Factory
        </h2>
        
        <form onSubmit={handleLogin}>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="su.correo@happyfactory.com"
              required
              className="shadow border rounded w-full py-3 px-4 text-gray-700 focus:outline-none focus:border-pink-500"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
              className="shadow border rounded w-full py-3 px-4 text-gray-700 focus:outline-none focus:border-pink-500"
            />
          </div>
          
          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full font-bold py-3 rounded transition ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-pink-500 hover:bg-pink-700 text-white'
            }`}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>

          {/* 🔽 NUEVA SECCIÓN REGISTRO */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              ¿No tienes cuenta?{" "}
              <Link 
                to="/register" 
                className="text-pink-600 font-semibold hover:underline"
              >
                Crear cuenta
              </Link>
            </p>
          </div>

        </form>
      </div>
    </div>
  );
};

export default LoginScreen;