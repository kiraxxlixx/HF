import React, { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';
import ProductFormModal from '../../components/admin/ProductFormModal';
// 1. Añadidos los íconos Tags, Plus, X, Trash2
import { Settings, Tags, Plus, X, Trash2 } from 'lucide-react'; 

const formatCategoryName = (cat) => {
    switch (cat) {
        case 'helado_sabor': return 'Helado (Sabores)';
        case 'helado_presentacion': return 'Helado (Presentación)';
        case 'icee': return 'Icee';
        case 'palomita': return 'Palomitas';
        case 'slush': return 'Slush';
        case 'topping': return 'Toppings';
        case 'gomita': return 'Gomitas';
        case 'sazonador': return 'Sazonadores';
        default: return cat.charAt(0).toUpperCase() + cat.slice(1);
    }
};

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [sucursalesDisponibles, setSucursalesDisponibles] = useState([]);
    const [homeTitle, setHomeTitle] = useState('Nuestros Favoritos'); 
    const [isTitleEditing, setIsTitleEditing] = useState(false);

    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('active');

    // 2. Nuevos estados para el Modal de Categorías
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [manualCategories, setManualCategories] = useState([]); // Guarda las categorías creadas localmente

    const fetchAll = async () => {
        setLoading(true);
        
        try {
            const [prodRes, sucRes] = await Promise.all([
                apiClient.get('/admin/products'),
                apiClient.get('/admin/sucursales')
            ]);
            setProducts(prodRes.data.data || []);
            setSucursalesDisponibles(sucRes.data.data || []);
        } catch (err) {
            console.error("Error crítico cargando productos/sucursales:", err);
        }

        try {
            const configRes = await apiClient.get('/admin/config/home_title');
            if (configRes.data.value) {
                setHomeTitle(configRes.data.value);
            }
        } catch (configErr) {
            console.warn("No se pudo cargar el título (usando default):", configErr);
        }

        setLoading(false);
    };

    useEffect(() => { fetchAll(); }, []);

    const saveTitle = async () => {
        try {
            await apiClient.put('/admin/config', { key: 'home_title', value: homeTitle });
            setIsTitleEditing(false);
            alert('Título actualizado');
        } catch (e) { alert('Error guardando título. Verifica que el servidor esté actualizado.'); }
    };
    
    const handleSaveProduct = async (formData) => {
        const id = formData.get('_id'); 
        const isEditing = Boolean(id);
        const url = isEditing ? `/admin/products/${id}` : '/admin/products';
        try {
            const config = { headers: { "Content-Type": undefined } };
            if (isEditing) await apiClient.put(url, formData, config);
            else await apiClient.post(url, formData, config);
            fetchAll();
            setIsModalOpen(false);
            setSelectedProduct(null);
        } catch (err) { alert(`Error: ${err.response?.data?.message || err.message}`); }
    };
    
    const handleCloseModal = () => { setIsModalOpen(false); setSelectedProduct(null); };
    const handleOpenEditModal = (p) => { setSelectedProduct(p); setIsModalOpen(true); };
    const handleOpenCreateModal = () => { setSelectedProduct(null); setIsModalOpen(true); };
    
    const handleArchive = async (p, val) => {
        await apiClient.put(`/admin/products/${p._id}/archive`, { activo: !val });
        fetchAll();
    };
    
    const handleDelete = async (p) => {
        if(!confirm("¿Eliminar?")) return;
        await apiClient.delete(`/admin/products/${p._id}`);
        fetchAll();
    };

    // 3. Lógica para manejar categorías locales (simulando API)
    const handleAddCategory = () => {
        if(newCategoryName.trim() === '') return;
        
        // Formateamos para que sea similar a los IDs de tu base de datos (minúsculas y guión bajo)
        const formattedCat = newCategoryName.trim().toLowerCase().replace(/\s+/g, '_');
        
        // TODO: Aquí deberías hacer el POST a tu API real: await apiClient.post('/admin/categories', { name: formattedCat })
        
        if (!manualCategories.includes(formattedCat)) {
            setManualCategories([...manualCategories, formattedCat]);
        }
        setNewCategoryName('');
    };

    const handleDeleteCategory = (catToDelete) => {
        if(!confirm(`¿Eliminar la categoría "${formatCategoryName(catToDelete)}"?`)) return;
        
        // TODO: Aquí deberías hacer el DELETE a tu API real
        setManualCategories(manualCategories.filter(c => c !== catToDelete));
    };

    // Combinar categorías de los productos existentes con las creadas manualmente
    const productCategories = products.map(p => p.categoria);
    const combinedCategories = [...new Set([...productCategories, ...manualCategories])].sort();

    const filteredProducts = products.filter(product => {
        const matchCategory = categoryFilter === 'all' || product.categoria === categoryFilter;
        let matchStatus = true;
        if (statusFilter === 'active') matchStatus = product.activo === true;
        if (statusFilter === 'archived') matchStatus = product.activo === false;
        return matchCategory && matchStatus;
    });

    return (
        <div className="min-h-screen bg-gray-50 p-6 relative">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-gray-800">Gestión de Productos</h1>
                
                {/* 4. Nuevo contenedor de botones principales */}
                <div className="flex gap-3">
                    <button 
                        onClick={() => setIsCategoryModalOpen(true)}
                        className="bg-purple-100 text-purple-700 border border-purple-300 hover:bg-purple-200 py-2 px-4 rounded-lg font-bold shadow-sm transition flex items-center gap-2"
                    >
                        <Tags size={20} />
                        <span className="hidden sm:inline">Categorías</span>
                    </button>
                    <button onClick={handleOpenCreateModal} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow flex items-center gap-2">
                        <Plus size={20} />
                        <span className="hidden sm:inline">Nuevo Producto</span>
                        <span className="sm:hidden">Nuevo</span>
                    </button>
                </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-pink-200 mb-6 flex items-center gap-4">
                <Settings className="text-pink-600" />
                <div className="flex-1">
                    <p className="text-xs font-bold text-gray-500 uppercase">Título Sección "Favoritos" (Home)</p>
                    {isTitleEditing ? (
                        <div className="flex gap-2 mt-1">
                            <input type="text" value={homeTitle} onChange={(e) => setHomeTitle(e.target.value)} className="border border-gray-300 rounded px-2 py-1 text-sm w-full max-w-xs" />
                            <button onClick={saveTitle} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">Guardar</button>
                            <button onClick={() => setIsTitleEditing(false)} className="text-gray-500 text-sm underline">Cancelar</button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-bold text-gray-800">"{homeTitle}"</h2>
                            <button onClick={() => setIsTitleEditing(true)} className="text-blue-600 text-xs underline">Cambiar</button>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-wrap gap-4 items-center">
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="bg-gray-50 border p-2 rounded">
                    <option value="all">Todas las Categorías</option>
                    {combinedCategories.map(c => (
                        <option key={c} value={c}>
                            {formatCategoryName(c)}
                        </option>
                    ))}
                </select>                
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-gray-50 border p-2 rounded">
                    <option value="active">Activos</option>
                    <option value="archived">Archivados</option>
                </select>
            </div>

            {!loading && (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Estado</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Producto</th>
                                <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">Destacado</th>
                                <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredProducts.length === 0 ? (
                                <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-400 italic">No se encontraron productos.</td></tr>
                            ) : (
                                filteredProducts.map((product) => (
                                    <tr key={product._id} className={`hover:bg-gray-50 ${!product.activo ? 'bg-gray-50/50' : ''}`}>
                                        <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-bold ${product.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{product.activo ? 'Activo' : 'Archivado'}</span></td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900">{product.nombreProducto}</div>
                                            <div className="text-xs text-gray-400">{product.sucursales?.length > 0 ? `En ${product.sucursales.length} sucursal(es)` : 'En TODAS'}</div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {product.esFavorito ? <span className="text-yellow-500 text-lg">★</span> : <span className="text-gray-300">☆</span>}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button onClick={() => handleOpenEditModal(product)} className="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded">Editar</button>
                                                <button onClick={() => handleArchive(product, product.activo)} className="text-orange-600 hover:bg-orange-50 px-3 py-1 rounded">{product.activo ? 'Archivar' : 'Activar'}</button>
                                                <button onClick={() => handleDelete(product)} className="text-red-600 hover:bg-red-50 px-3 py-1 rounded">Eliminar</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
            
<ProductFormModal 
    isOpen={isModalOpen} 
    onClose={handleCloseModal} 
    onSave={handleSaveProduct} 
    product={selectedProduct} 
    sucursalesList={sucursalesDisponibles} 
    categoriesList={combinedCategories} 
/>

            {/* 5. MODAL DE CATEGORÍAS */}
            {isCategoryModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
                            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <Tags className="text-purple-600" size={24} />
                                Gestionar Categorías
                            </h3>
                            <button onClick={() => setIsCategoryModalOpen(false)} className="text-gray-400 hover:text-red-500 transition">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    placeholder="Nueva categoría (ej. Temporada)"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                                <button 
                                    onClick={handleAddCategory}
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-bold flex items-center transition"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>

                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase mb-3">Categorías Actuales</p>
                                <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                                    {combinedCategories.map((cat, idx) => {
                                        // Verificamos si la categoría tiene productos asignados para advertir antes de borrar
                                        const count = products.filter(p => p.categoria === cat).length;
                                        
                                        return (
                                            <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                <div>
                                                    <span className="font-medium text-gray-700">{formatCategoryName(cat)}</span>
                                                    {count > 0 && <span className="text-xs text-gray-400 ml-2">({count} prod)</span>}
                                                </div>
                                                <button 
                                                    className={`p-1 transition ${count > 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-red-600'}`}
                                                    onClick={() => {
                                                        if(count > 0) alert("No puedes borrar una categoría que tiene productos asignados.");
                                                        else handleDeleteCategory(cat);
                                                    }}
                                                    title={count > 0 ? "Tiene productos" : "Eliminar"}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        )
                                    })}
                                    {combinedCategories.length === 0 && (
                                        <p className="text-sm text-gray-500 text-center italic py-4">No hay categorías creadas.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManagement;