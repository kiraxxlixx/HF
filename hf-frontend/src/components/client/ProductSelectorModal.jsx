import React from 'react';
import ReviewSection from './ReviewSection';

const ProductSelectorModal = ({ product, isOpen, onClose, standardSizes = [] }) => {
  if (!isOpen || !product) return null;

  const renderPrices = () => {
    if (product.variaciones && product.variaciones.length > 0) {
      return product.variaciones
        .sort((a, b) => a.precio - b.precio)
        .map((v, index) => (
          <div key={index} className="flex justify-between items-center text-sm border border-gray-100 p-3 rounded-lg hover:bg-gray-50 transition">
            <span className="text-gray-700 font-medium">{v.nombre}</span>
            <span className="font-bold text-pink-600">
              ${v.precio.toFixed(2)}
            </span>
          </div>
        ));
    } else if (product.categoria === 'helado_sabor' && standardSizes.length > 0) {
      return standardSizes.map((size, index) => {
        const precioBase = size.variaciones?.[0]?.precio || 0;
        return (
          <div key={index} className="flex justify-between items-center text-sm border border-gray-100 p-3 rounded-lg hover:bg-gray-50 transition">
            <span className="text-gray-700 font-medium">{size.nombreProducto}</span>
            <span className="font-bold text-blue-600">
              ${precioBase.toFixed(2)}
            </span>
          </div>
        );
      });
    }

    return (
      <p className="text-gray-400 text-sm text-center italic">
        Precios variables en mostrador.
      </p>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg m-auto flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b flex justify-between items-center bg-pink-600 text-white rounded-t-xl">
          <h3 className="text-xl font-bold">{product.nombreProducto}</h3>
          <button onClick={onClose} className="text-white hover:text-pink-200 transition">
            <span className="font-bold text-2xl">&times;</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          <p className="text-gray-600 mb-6 text-sm leading-relaxed">
            {product.descripcion}
          </p>

          <div className="mb-8">
            <label className="block text-gray-500 font-bold text-xs uppercase mb-2">
              Precios Disponibles
            </label>
            <div className="grid grid-cols-1 gap-2">
              {renderPrices()}
            </div>
          </div>

          <hr className="border-gray-200 mb-6" />
          <ReviewSection productId={product._id} />
        </div>

        {/* Footer */}
        <div className="p-5 border-t bg-gray-50 rounded-b-xl flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-200 text-gray-700 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 transition"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProductSelectorModal;