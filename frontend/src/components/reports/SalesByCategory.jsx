// src/components/reports/SalesByCategory.jsx
import React, { useState, useEffect } from 'react';
import { reportAPI } from '../../services/reportAPI';
import DateRangeSelector from './DateRangeSelector';
import ExportButtons from './ExportButtons';
import toast from 'react-hot-toast';

const SalesByCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [chartView, setChartView] = useState('bar'); // bar, pie

  useEffect(() => {
    const fetchCategoryReport = async () => {
      try {
        setLoading(true);
        const response = await reportAPI.getSalesByCategory(startDate, endDate);
        
        // Procesar y ordenar datos
        const categoryData = response.data.map(cat => ({
          categoria: cat.categoria,
          cantidad_ventas: parseInt(cat.cantidad_ventas),
          productos_vendidos: parseInt(cat.productos_vendidos),
          total_ventas: parseFloat(cat.total_ventas),
          porcentaje: 0 // Calculamos después
        }));
        
        // Calcular porcentajes
        const totalGeneral = categoryData.reduce((sum, cat) => sum + cat.total_ventas, 0);
        categoryData.forEach(cat => {
          cat.porcentaje = totalGeneral > 0 ? ((cat.total_ventas / totalGeneral) * 100).toFixed(2) : 0;
        });
        
        setCategories(categoryData);
        
      } catch (error) {
        console.error('Error cargando reporte por categorías:', error);
        toast.error('Error al cargar el reporte por categorías');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryReport();
  }, [startDate, endDate]);

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Calcular totales
  const totals = categories.reduce((acc, cat) => ({
    ventas: acc.ventas + cat.cantidad_ventas,
    productos: acc.productos + cat.productos_vendidos,
    monto: acc.monto + cat.total_ventas
  }), { ventas: 0, productos: 0, monto: 0 });

  // Obtener color para cada categoría
  const getCategoryColor = (index) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500',
      'bg-red-500', 'bg-indigo-500', 'bg-pink-500', 'bg-gray-500'
    ];
    return colors[index % colors.length];
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Reporte de Ventas por Categoría</h2>
      
      <DateRangeSelector onDateChange={handleDateChange} />
      
      {/* Resumen General */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Total Ventas</p>
          <p className="text-2xl font-bold">{totals.ventas}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Productos Vendidos</p>
          <p className="text-2xl font-bold text-blue-600">{totals.productos}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Monto Total</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(totals.monto)}</p>
        </div>
      </div>

      {/* Gráfico Visual */}
      {categories.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Distribución por Categoría</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setChartView('bar')}
                className={`px-3 py-1 rounded ${chartView === 'bar' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Barras
              </button>
              <button
                onClick={() => setChartView('pie')}
                className={`px-3 py-1 rounded ${chartView === 'pie' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Circular
              </button>
            </div>
          </div>

          {chartView === 'bar' ? (
            // Gráfico de barras
            <div className="space-y-4">
              {categories.map((cat, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">{cat.categoria}</span>
                    <span className="text-sm text-gray-500">{cat.porcentaje}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-6">
                    <div
                      className={`h-6 rounded-full ${getCategoryColor(index)} flex items-center justify-end pr-2`}
                      style={{ width: `${cat.porcentaje}%` }}
                    >
                      <span className="text-xs text-white font-medium">
                        {formatCurrency(cat.total_ventas)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Representación tipo "pie" con cards
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map((cat, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className={`w-4 h-4 ${getCategoryColor(index)} rounded-full mb-2`}></div>
                  <h4 className="font-medium text-sm">{cat.categoria}</h4>
                  <p className="text-2xl font-bold">{cat.porcentaje}%</p>
                  <p className="text-sm text-gray-500">{formatCurrency(cat.total_ventas)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Tabla de Detalles */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-semibold">Detalle por Categoría</h3>
          <ExportButtons 
            data={categories} 
            filename={`reporte-categorias-${startDate}-al-${endDate}`} 
            title={`Reporte de Ventas por Categoría del ${startDate} al ${endDate}`} 
          />
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">Cargando datos...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No hay datos en el período seleccionado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cant. Ventas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Productos Vendidos</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Ventas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% del Total</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((cat, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 ${getCategoryColor(index)} rounded-full mr-2`}></div>
                        <span className="text-sm font-medium text-gray-900">{cat.categoria}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {cat.cantidad_ventas}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {cat.productos_vendidos}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      {formatCurrency(cat.total_ventas)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">{cat.porcentaje}%</span>
                        <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getCategoryColor(index)}`}
                            style={{ width: `${cat.porcentaje}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    TOTALES
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    {totals.ventas}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    {totals.productos}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                    {formatCurrency(totals.monto)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    100%
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesByCategory;