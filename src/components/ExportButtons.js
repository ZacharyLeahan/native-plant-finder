import React, { useState } from 'react';
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

  return (
    <div className="export-buttons">
      <button 
        className="export-button copy-button" 
        onClick={copyToClipboard}
      >
        Copy my ❤️ List
        {copySuccess && <span className="copy-success">✓ Copied!</span>}
      </button>
    </div>
  );
};

export default ExportButtons; 