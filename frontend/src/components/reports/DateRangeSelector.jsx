// src/components/reports/DateRangeSelector.jsx
import React, { useState } from 'react';

const DateRangeSelector = ({ onDateChange }) => {
  const [startDate, setStartDate] = useState(() => {
    // Por defecto, primer día del mes actual
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
  });
  
  const [endDate, setEndDate] = useState(() => {
    // Por defecto, fecha actual
    return new Date().toISOString().split('T')[0];
  });

  // Presets de fechas comunes
  const handlePreset = (preset) => {
    const today = new Date();
    let start = new Date();
    let end = new Date();
    
    switch(preset) {
      case 'today': {
        start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        end = start;
        break;
      }
      case 'yesterday': {
        start = new Date(today);
        start.setDate(start.getDate() - 1);
        end = start;
        break;
      }
      case 'thisWeek': {
        start = new Date(today);
        start.setDate(today.getDate() - today.getDay()); // Domingo de esta semana
        end = today;
        break;
      }
      case 'thisMonth': {
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = today;
        break;
      }
      case 'lastMonth': {
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      }
      default:
        return;
    }
    
    const startStr = start.toISOString().split('T')[0];
    const endStr = end.toISOString().split('T')[0];
    
    setStartDate(startStr);
    setEndDate(endStr);
    onDateChange(startStr, endStr);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onDateChange(startDate, endDate);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha inicial</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            max={endDate}
            className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
            required
          />
        </div>
        
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha final</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate}
            className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
            required
          />
        </div>
        
        <div className="flex-shrink-0">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Aplicar
          </button>
        </div>
      </form>
      
      <div className="flex flex-wrap mt-4 gap-2">
        <button 
          type="button" 
          onClick={() => handlePreset('today')}
          className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded hover:bg-gray-300"
        >
          Hoy
        </button>
        <button 
          type="button" 
          onClick={() => handlePreset('yesterday')}
          className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded hover:bg-gray-300"
        >
          Ayer
        </button>
        <button 
          type="button" 
          onClick={() => handlePreset('thisWeek')}
          className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded hover:bg-gray-300"
        >
          Esta semana
        </button>
        <button 
          type="button" 
          onClick={() => handlePreset('thisMonth')}
          className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded hover:bg-gray-300"
        >
          Este mes
        </button>
        <button 
          type="button" 
          onClick={() => handlePreset('lastMonth')}
          className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded hover:bg-gray-300"
        >
          Mes anterior
        </button>
      </div>
    </div>
  );
};

export default DateRangeSelector;