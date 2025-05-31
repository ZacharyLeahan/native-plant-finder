import React, { useState, useEffect } from 'react';
import './ExportButtons.css';

const ExportButtons = ({ plants, favorites, getFavoritePlants }) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const favoritePlants = getFavoritePlants();

  // Handle animation when favorites change
  useEffect(() => {
    if (favoritePlants.length > 0) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [favoritePlants.length]);

  const copyToClipboard = async () => {
    const favoritePlants = getFavoritePlants();
    if (favoritePlants.length === 0) return;

    // Group plants by vendor
    const plantsByVendor = favoritePlants.reduce((acc, plant) => {
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

    // Sort vendors by distance
    const sortedVendors = Object.values(plantsByVendor).sort((a, b) => 
      a.vendor.distance - b.vendor.distance
    );

    // Format the text
    const text = sortedVendors.map(({ vendor, plants }) => {
      const sortedPlants = plants.sort((a, b) => 
        a.scientificName.localeCompare(b.scientificName)
      );
      
      return `${vendor.storeName}
${vendor.address}
${vendor.publicPhone}
${vendor.publicEmail}
${vendor.storeUrl}
Distance: ${vendor.distance.toFixed(1)} miles

${sortedPlants.map(plant => `• ${plant.scientificName}${plant.commonName ? ` (${plant.commonName})` : ''}`).join('\n')}

`;
    }).join('\n');

    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  // Don't render anything if no favorites
  if (!isVisible) {
    return null;
  }

  return (
    <div 
      className="export-buttons"
      role="region"
      aria-live="polite"
      aria-label="Copy favorites button"
    >
      <button 
        className="export-button copy-button" 
        onClick={copyToClipboard}
        aria-label="Copy favorite plants to clipboard"
      >
        Copy my ❤️ List
        {copySuccess && (
          <span className="copy-success" role="status">
            ✓ Copied!
          </span>
        )}
      </button>
    </div>
  );
};

export default ExportButtons; 