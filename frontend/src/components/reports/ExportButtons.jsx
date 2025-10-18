// src/components/reports/ExportButtons.jsx
import React from "react";
import ExcelJS from "exceljs";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const ExportButtons = ({ data, filename, title }) => {
  // Exportar a Excel usando ExcelJS
  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Reporte");

    // Añadir encabezados
    const headers = Object.keys(data[0] || {}).map((key) =>
      key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ")
    );
    worksheet.addRow(headers);

    // Añadir datos
    data.forEach((row) => {
      worksheet.addRow(Object.values(row));
    });

    // Ajustar anchos de columna
    worksheet.columns.forEach((column) => {
      column.width = 20;
    });

    // Generar archivo
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Exportar a PDF
  const exportToPDF = () => {
    const doc = new jsPDF("l", "mm", "a4"); // landscape

    // Añadir título
    doc.setFontSize(18);
    doc.text(title, 14, 20);
    doc.setFontSize(10);
    doc.text(
      `Fecha de generación: ${new Date().toLocaleDateString("es-PY")}`,
      14,
      26
    );

    // Generar tabla
    const columns = Object.keys(data[0] || {}).map((key) => ({
      header: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " "),
      dataKey: key,
    }));

    doc.autoTable({
      startY: 30,
      columns,
      body: data,
      headStyles: { fillColor: [66, 139, 202] },
      styles: { overflow: "linebreak" },
      columnStyles: { 0: { cellWidth: "auto" } },
    });

    doc.save(`${filename}.pdf`);
  };

  return (
    <div className="flex space-x-2 mb-4">
      <button
        onClick={exportToExcel}
        disabled={!data.length}
        className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-green-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        Exportar Excel
      </button>

      <button
        onClick={exportToPDF}
        disabled={!data.length}
        className="flex items-center bg-red-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-red-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        Exportar PDF
      </button>
    </div>
  );
};

export default ExportButtons;