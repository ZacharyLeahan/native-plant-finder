import React, { useState } from 'react';
import html2pdf from 'html2pdf.js';
import './ExportButtons.css';

const ExportButtons = ({ plants, favorites, getFavoritePlants }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const copyToClipboard = () => {
    const favoritePlants = getFavoritePlants();
    
    if (favoritePlants.length === 0) {
      alert('No plants in your favorites list!');
      return;
    }

    // Group favorites by vendor
    const groupedByVendor = favoritePlants.reduce((acc, plant) => {
      const vendorId = plant.vendor.id;
      if (!acc[vendorId]) {
        acc[vendorId] = {
          vendor: plant.vendor,
          plants: []
        };
      }
      acc[vendorId].plants.push(plant);
      return acc;
    }, {});

    // Create the text output
    let text = 'Your Native Plant List:\n\n';
    
    Object.values(groupedByVendor).forEach(({ vendor, plants: vendorPlants }) => {
      text += `[Vendor: ${vendor.storeName} – ${vendor.state}]\n`;
      vendorPlants.forEach(plant => {
        text += `- ${plant.scientificName}`;
        if (plant.commonName) {
          text += ` (${plant.commonName})`;
        }
        text += '\n';
      });
      text += `Visit: ${vendor.storeUrl || 'N/A'}\n\n`;
    });

    // Copy to clipboard
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    }).catch(err => {
      console.error('Failed to copy:', err);
      alert('Failed to copy to clipboard');
    });
  };

  const exportToPDF = () => {
    const tableContainer = document.querySelector('.plant-table-container');
    
    if (!tableContainer) {
      alert('No table to export!');
      return;
    }

    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: 'native-plants-list.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        logging: false
      },
      jsPDF: { 
        unit: 'in', 
        format: 'letter', 
        orientation: 'landscape' 
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    // Clone the table to avoid modifying the original
    const clonedTable = tableContainer.cloneNode(true);
    
    // Add title to the PDF
    const title = document.createElement('h2');
    title.textContent = 'Native Plant List';
    title.style.textAlign = 'center';
    title.style.marginBottom = '20px';
    
    const wrapper = document.createElement('div');
    wrapper.appendChild(title);
    wrapper.appendChild(clonedTable);
    
    // Apply print styles
    wrapper.style.fontFamily = 'Arial, sans-serif';
    clonedTable.style.width = '100%';
    
    // Generate PDF
    html2pdf().set(opt).from(wrapper).save();
  };

  return (
    <div className="export-buttons">
      <button 
        className="export-button copy-button" 
        onClick={copyToClipboard}
      >
        📋 Copy My Plant List
        {copySuccess && <span className="copy-success">✓ Copied!</span>}
      </button>
      <button 
        className="export-button pdf-button" 
        onClick={exportToPDF}
      >
        🖨 Export to PDF
      </button>
    </div>
  );
};

export default ExportButtons; 