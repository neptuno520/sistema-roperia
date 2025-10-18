import React, { useState, useEffect } from 'react';
import { saleAPI } from '../../services/saleAPI';

const ClientSearch = ({ onClientSelect, selectedClient }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (selectedClient) {
      setSearchTerm(formatClientInfo(selectedClient));
    } else {
      setSearchTerm('');
    }
  }, [selectedClient]); // No agregar formatClientInfo a las dependencias

  useEffect(() => {
    const searchClients = async () => {
      if (searchTerm.length < 2) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      setLoading(true);
      try {
        const response = await saleAPI.searchClients(searchTerm);
        setSearchResults(response.data);
        setShowResults(true);
      } catch (error) {
        console.error('Error searching clients:', error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchClients, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleClientSelect = (client) => {
    onClientSelect(client);
    setSearchTerm(client ? formatClientInfo(client) : '');
    setShowResults(false);
    setSearchResults([]);
  };

  const handleClear = () => {
    setSearchTerm('Cliente general (Venta mostrador)');
    setSearchResults([]);
    setShowResults(false);
    onClientSelect(null);
  };

  const formatClientInfo = (client) => {
    return `${client.nombre} ${client.apellido} - ${client.documento}${client.email ? ` - ${client.email}` : ''}`;
  };  

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Buscar Cliente
      </label>
      
      <div className="flex space-x-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, apellido o documento..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          {loading && (
            <div className="absolute right-3 top-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleClear}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 whitespace-nowrap"
        >
          Limpiar
        </button>
      </div>

      {/* Resultados de búsqueda */}
      {showResults && searchResults.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
          <div
            className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100"
            onClick={() => handleClientSelect(null)}
          >
            <div className="font-medium text-gray-900">
              Cliente general (Venta mostrador)
            </div>
          </div>

          {searchResults.map(client => (
            <div
              key={client.id_cliente}
              className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              onClick={() => handleClientSelect(client)}
            >
              <div className="font-medium text-gray-900">
                {client.nombre} {client.apellido}
              </div>
              <div className="text-sm text-gray-600">
                Documento: {client.documento}
                {client.email && ` • Email: ${client.email}`}
                {client.telefono && ` • Tel: ${client.telefono}`}
              </div>
            </div>
          ))}
        </div>
      )}

      {showResults && searchTerm.length >= 2 && searchResults.length === 0 && !loading && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-4">
          <p className="text-gray-500 text-center">No se encontraron clientes</p>
        </div>
      )}

      {/* Información del cliente seleccionado */}
      {selectedClient && (
        <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium text-green-800">
                Cliente seleccionado: {selectedClient.nombre} {selectedClient.apellido}
              </p>
              <p className="text-sm text-green-600">
                Documento: {selectedClient.documento}
                {selectedClient.email && ` • Email: ${selectedClient.email}`}
              </p>
            </div>
            <button
              onClick={handleClear}
              className="text-green-600 hover:text-green-800 text-sm"
            >
              Cambiar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientSearch;