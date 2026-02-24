import React, { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient'; 
// Agregamos Facebook e Instagram a los iconos
import { Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react'; 

const ContactSection = () => {
  const [sucursales, setSucursales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSucursales = async () => {
      try {
        const res = await apiClient.get('/client/sucursales');
        setSucursales(res.data.data || []);
      } catch (error) {
        console.error("Error cargando ubicaciones", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSucursales();
  }, []);

  // Función para evitar el error de "Objects are not valid as a React child"
  const renderDireccion = (direccion) => {
    if (!direccion) return "Tijuana, B.C.";
    if (typeof direccion === 'object') {
      const { calle, colonia, ciudad, cp } = direccion;
      return [calle, colonia, ciudad].filter(Boolean).join(", ") + (cp ? ` CP ${cp}` : "");
    }
    return direccion;
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm text-center my-10 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-pink-600 mb-2">Contáctanos</h2>
      <p className="text-gray-500 mb-8">¿Tienes dudas o sugerencias? ¡Nos encantaría escucharte!</p>

      {/* Grid de 3 columnas para info de contacto */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        {/* Tarjeta Teléfono */}
        <div className="bg-pink-50 p-6 rounded-xl flex flex-col items-center justify-center border border-pink-100 hover:shadow-md transition-shadow">
          <Phone className="text-pink-500 mb-3" size={32} />
          <h3 className="font-bold text-gray-800 mb-1">Teléfono</h3>
          <p className="text-gray-600 text-sm">+52 (663) 123-2454</p>
        </div>

        {/* Tarjeta Correo */}
        <div className="bg-blue-50 p-6 rounded-xl flex flex-col items-center justify-center border border-blue-100 hover:shadow-md transition-shadow">
          <Mail className="text-blue-600 mb-3" size={32} />
          <h3 className="font-bold text-gray-800 mb-1">Correo</h3>
          <p className="text-gray-600 text-sm">contacto@happyfactory.mx</p>
        </div>

        {/* Tarjeta Ubicaciones */}
        <div className="bg-yellow-50 p-6 rounded-xl flex flex-col items-center justify-center border border-yellow-100 hover:shadow-md transition-shadow">
          <MapPin className="text-yellow-600 mb-3" size={32} />
          <h3 className="font-bold text-gray-800 mb-2">Ubicaciones</h3>
          
          <div className="space-y-2 w-full max-h-40 overflow-y-auto custom-scrollbar"> 
            {loading ? (
               <p className="text-gray-500 text-sm animate-pulse">Cargando...</p>
            ) : sucursales.length > 0 ? (
              sucursales.map((sucursal) => (
                <div key={sucursal._id} className="text-sm text-gray-600 border-b border-yellow-200 pb-2 mb-2 last:border-0 last:mb-0 last:pb-0">
                  <span className="font-semibold block text-yellow-700">{sucursal.nombreSucursal}</span>
                  <span className="block text-xs mt-1">
                    {renderDireccion(sucursal.direccion)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">Próximamente nuevas ubicaciones.</p>
            )}
          </div>
        </div>
      </div>

      {/* NUEVA SECCIÓN: Redes Sociales */}
      <div className="border-t border-gray-100 pt-8">
        <h3 className="text-lg font-bold text-gray-700 mb-4">Síguenos en redes sociales</h3>
        <div className="flex justify-center gap-6">
            
            {/* Botón Facebook */}
            <a 
              href="https://www.facebook.com/happyfactoryoficial/?locale=es_LA" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-all transform hover:-translate-y-1 shadow-md"
            >
                <Facebook size={20} />
                <span>Facebook</span>
            </a>

            {/* Botón Instagram */}
            <a 
              href="https://www.instagram.com/happyfactoryoficial/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white rounded-full font-bold hover:opacity-90 transition-all transform hover:-translate-y-1 shadow-md"
            >
                <Instagram size={20} />
                <span>Instagram</span>
            </a>

        </div>
      </div>

    </div>
  );
};

export default ContactSection;