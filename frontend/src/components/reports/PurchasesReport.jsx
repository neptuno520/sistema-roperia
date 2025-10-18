// src/components/reports/PurchasesReport.jsx
import React, { useState, useEffect } from 'react';
import { reportAPI } from '../../services/reportAPI';
import DateRangeSelector from './DateRangeSelector';
import ExportButtons from './ExportButtons';
import toast from 'react-hot-toast';

const PurchasesReport = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [summary, setSummary] = useState({
    totalCompras: 0,
    totalMontoCompras: 0,
    promedioCompra: 0,
    proveedorMasComprado: ''
  });

  useEffect(() => {
    const fetchPurchasesReport = async () => {
      try {
        setLoading(true);
        const response = await reportAPI.getPurchasesReport(startDate, endDate);
        
        // Procesar datos
        const purchasesData = response.data.map(purchase => ({
          id_compra: purchase.id_compra,
          fecha: new Date(purchase.fecha).toLocaleString('es-PY'),
          proveedor: purchase.proveedor_nombre,
          ruc: purchase.proveedor_ruc,
          usuario: purchase.usuario_nombre,
          estado: purchase.estado,
          total: purchase.total
        }));
        
        // Calcular resumen
        const totalMontoCompras = response.data.reduce((sum, purchase) => 
          sum + parseFloat(purchase.total), 0
        );
        const totalCompras = response.data.length;
        const promedioCompra = totalCompras > 0 ? totalMontoCompras / totalCompras : 0;
        
        // Proveedor más comprado
        const proveedoresCount = {};
        response.data.forEach(purchase => {
          const proveedor = purchase.proveedor_nombre || 'Sin proveedor';
          proveedoresCount[proveedor] = (proveedoresCount[proveedor] || 0) + 1;
        });
        
        let proveedorMasComprado = '';
        let maxCount = 0;
        
        Object.entries(proveedoresCount).forEach(([proveedor, count]) => {
          if (count > maxCount) {
            maxCount = count;
            proveedorMasComprado = proveedor;
          }
        });
        
        setPurchases(purchasesData);
        setSummary({
          totalCompras,
          totalMontoCompras,
          promedioCompra,
          proveedorMasComprado
        });
        
      } catch (error) {
        console.error('Error cargando reporte de compras:', error);
        toast.error('Error al cargar el reporte de compras');
      } finally {
        setLoading(false);
      }
    };

    fetchPurchasesReport();
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

  const getEstadoBadge = (estado) => {
    const badges = {
      'completada': 'bg-green-100 text-green-800',
      'pendiente': 'bg-yellow-100 text-yellow-800',
      'cancelada': 'bg-red-100 text-red-800'
    };
    return badges[estado] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Reporte de Compras</h2>
      
      <DateRangeSelector onDateChange={handleDateChange} />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Total Compras</p>
          <p className="text-2xl font-bold">{summary.totalCompras}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Monto Total</p>
          <p className="text-2xl font-bold text-blue-600">{formatCurrency(summary.totalMontoCompras)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Promedio por Compra</p>
          <p className="text-2xl font-bold">{formatCurrency(summary.promedioCompra)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Proveedor Principal</p>
          <p className="text-lg font-bold">{summary.proveedorMasComprado || 'N/A'}</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-semibold">Detalle de Compras</h3>
          <ExportButtons 
            data={purchases} 
            filename={`reporte-compras-${startDate}-al-${endDate}`} 
            title={`Reporte de Compras del ${startDate} al ${endDate}`} 
          />
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">Cargando datos...</p>
          </div>
        ) : purchases.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No hay compras en el período seleccionado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proveedor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RUC</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {purchases.map((purchase) => (
                  <tr key={purchase.id_compra}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{purchase.id_compra}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{purchase.fecha}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{purchase.proveedor}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{purchase.ruc}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{purchase.usuario}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoBadge(purchase.estado)}`}>
                        {purchase.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      {formatCurrency(purchase.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchasesReport;