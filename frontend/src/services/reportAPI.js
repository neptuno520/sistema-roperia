// src/services/reportAPI.js
import API from './api.js';

export const reportAPI = {
  // Reportes de ventas
  getSalesReport: (startDate, endDate, filters = {}) => {
    const params = new URLSearchParams();
    params.append('startDate', startDate);
    params.append('endDate', endDate);
    
    // Agregar filtros adicionales
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    
    return API.get(`/reports/sales?${params.toString()}`);
  },
  
  // Reportes de compras
  getPurchasesReport: (startDate, endDate, filters = {}) => {
    const params = new URLSearchParams();
    params.append('startDate', startDate);
    params.append('endDate', endDate);
    
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    
    return API.get(`/reports/purchases?${params.toString()}`);
  },
  
  // Resumen de ventas por día/semana/mes
  getSalesSummary: (period, startDate, endDate) => {
    return API.get(`/reports/sales-summary?period=${period}&startDate=${startDate}&endDate=${endDate}`);
  },
  
  // Resumen de ventas por categoría
  getSalesByCategory: (startDate, endDate) => {
    return API.get(`/reports/sales-by-category?startDate=${startDate}&endDate=${endDate}`);
  },
  
  // Resumen de ventas por método de pago
  getSalesByPaymentMethod: (startDate, endDate) => {
    return API.get(`/reports/sales-by-payment?startDate=${startDate}&endDate=${endDate}`);
  }
};