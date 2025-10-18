// src/components/reports/SalesReport.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { reportAPI } from '../../services/reportAPI';
import DateRangeSelector from './DateRangeSelector';
import ExportButtons from './ExportButtons';
import toast from 'react-hot-toast';

const SalesReport = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [summary, setSummary] = useState({
    totalVentas: 0,
    totalMontoVentas: 0,
    promedioVenta: 0,
    metodoPagoMasUsado: ''
  });

  // Mover loadSalesReport dentro de useCallback
  const loadSalesReport = useCallback(async () => {
    try {
      setLoading(true);
      const response = await reportAPI.getSalesReport(startDate, endDate);
      
      // Procesar datos
      const salesData = response.data.map(sale => ({
        id_venta: sale.id_venta,
        fecha: new Date(sale.fecha).toLocaleString('es-PY'),
        cliente: sale.cliente_nombre || 'Consumidor Final',
        vendedor: sale.usuario_nombre,
        metodo_pago: sale.metodo_pago,
        total: sale.total.toLocaleString('es-PY', { style: 'currency', currency: 'PYG' })
      }));
      
      // Calcular resumen
      const totalMontoVentas = response.data.reduce((sum, sale) => sum + parseFloat(sale.total), 0);
      const totalVentas = response.data.length;
      const promedioVenta = totalVentas > 0 ? totalMontoVentas / totalVentas : 0;
      
      // Método de pago más usado
      const metodosCount = {};
      response.data.forEach(sale => {
        metodosCount[sale.metodo_pago] = (metodosCount[sale.metodo_pago] || 0) + 1;
      });
      
      let metodoPagoMasUsado = '';
      let maxCount = 0;
      
      Object.entries(metodosCount).forEach(([metodo, count]) => {
        if (count > maxCount) {
          maxCount = count;
          metodoPagoMasUsado = metodo;
        }
      });
      
      setSales(salesData);
      setSummary({
        totalVentas,
        totalMontoVentas,
        promedioVenta,
        metodoPagoMasUsado
      });
      
    } catch (error) {
      console.error('Error cargando reporte de ventas:', error);
      toast.error('Error al cargar el reporte de ventas');
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    loadSalesReport();
  }, [loadSalesReport]);

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

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Reporte de Ventas</h2>
      
      <DateRangeSelector onDateChange={handleDateChange} />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Total Ventas</p>
          <p className="text-2xl font-bold">{summary.totalVentas}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Monto Total</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(summary.totalMontoVentas)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Promedio por Venta</p>
          <p className="text-2xl font-bold">{formatCurrency(summary.promedioVenta)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Método Pago más usado</p>
          <p className="text-2xl font-bold">{summary.metodoPagoMasUsado}</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-semibold">Detalle de Ventas</h3>
          <ExportButtons 
            data={sales} 
            filename={`reporte-ventas-${startDate}-al-${endDate}`} 
            title={`Reporte de Ventas del ${startDate} al ${endDate}`} 
          />
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">Cargando datos...</p>
          </div>
        ) : sales.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No hay ventas en el período seleccionado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendedor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Método Pago</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sales.map((sale) => (
                  <tr key={sale.id_venta}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sale.id_venta}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.fecha}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sale.cliente}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sale.vendedor}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sale.metodo_pago}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">{sale.total}</td>
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

export default SalesReport;