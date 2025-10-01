import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { productAPI } from '../services/productAPI';
import ProductList from '../components/products/ProductList';
import ProductForm from '../components/products/ProductForm';

const Products = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const stats = {
    total_productos: products.length,
    bajo_stock: products.filter(p => p.stock > 0 && p.stock <= 10).length, // <=10, no <10
    sin_stock: products.filter(p => p.stock === 0).length,
    categorias: [...new Set(products.map(p => p.id_categoria))].length
  };


  // Cargar productos y categorías al iniciar
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      console.log('🔄 Cargando productos...');
      
      const response = await productAPI.getProducts();
      console.log('✅ Productos cargados:', response.data);
      
      setProducts(response.data);
      
      // DEBUG: Verificar stocks
      const lowStockCount = response.data.filter(p => p.stock > 0 && p.stock <= 10).length;
      console.log(`📊 Productos con stock bajo (<=10): ${lowStockCount}`);
      console.log('🔍 Detalle de stocks:', response.data.map(p => ({
        id: p.id_producto,
        nombre: p.nombre, 
        stock: p.stock,
        color: p.color,
        talla: p.talla
      })));
      
    } catch (error) {
      console.error('Error loading products:', error);
      alert('Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await productAPI.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleCreateProduct = async (productData) => {
    try {
      setFormLoading(true);
      await productAPI.createProduct(productData);
      await loadProducts(); // Recargar la lista
      setShowForm(false);
      alert('Producto creado exitosamente');
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Error al crear el producto');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateProduct = async (productData) => {
    try {
      setFormLoading(true);
      await productAPI.updateProduct(editingProduct.id_producto, productData);
      await loadProducts(); // Recargar la lista
      setEditingProduct(null);
      setShowForm(false);
      alert('Producto actualizado exitosamente');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error al actualizar el producto');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteProduct = async (productId, productName) => {
    if (window.confirm(`¿Estás seguro de eliminar el producto "${productName}"?`)) {
      try {
        await productAPI.deleteProduct(productId);
        await loadProducts(); // Recargar la lista
        alert('Producto eliminado exitosamente');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error al eliminar el producto');
      }
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleNewProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleFormSubmit = (productData) => {
    if (editingProduct) {
      handleUpdateProduct(productData);
    } else {
      handleCreateProduct(productData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Productos</h1>
            <p className="text-gray-600">Bienvenido, {user?.nombre}</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => window.history.back()}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Volver al Dashboard
            </button>
            <button
              onClick={handleNewProduct}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center"
            >
              <span className="mr-2">+</span> Nuevo Producto
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {showForm ? (
          <ProductForm
            product={editingProduct}
            categories={categories}
            onSubmit={handleFormSubmit}
            onCancel={handleCancelForm}
            loading={formLoading}
          />
        ) : (
          <>
            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-700">Total Productos</h3>
                <p className="text-3xl font-bold text-blue-600">{products.length}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-700">Bajo Stock</h3>
                <p className="text-3xl font-bold text-yellow-600">
                  {products.filter(p => p.stock > 0 && p.stock <= 10).length}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-700">Sin Stock</h3>
                <p className="text-3xl font-bold text-red-600">
                  {products.filter(p => p.stock === 0).length}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-700">Categorías</h3>
                <p className="text-3xl font-bold text-green-600">{categories.length}</p>
              </div>
            </div>

            {/* Lista de productos */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Lista de Productos</h2>
              </div>
              <div className="p-6">
                <ProductList
                  products={products}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                  loading={loading}
                />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Products;