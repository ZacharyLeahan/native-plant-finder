import React, { useState, useMemo } from 'react';
import './PlantTable.css';

const PlantTable = ({ plants, favorites, onToggleFavorite, searchZipCode }) => {
  const [sortBy, setSortBy] = useState('scientificName');
  const [sortOrder, setSortOrder] = useState('asc');

  const sortedPlants = useMemo(() => {
    const sorted = [...plants];
    
    sorted.sort((a, b) => {
      // Sort favorites first if sorting by favorites
      if (sortBy === 'favorites') {
        const aFav = favorites.has(a.uniqueKey);
        const bFav = favorites.has(b.uniqueKey);
        if (aFav !== bFav) return bFav ? 1 : -1;
      }
      
      // Then sort by the selected field
      let aVal, bVal;
      switch (sortBy) {
        case 'scientificName':
          aVal = a.scientificName || '';
          bVal = b.scientificName || '';
          break;
        case 'commonName':
          aVal = a.commonName || '';
          bVal = b.commonName || '';
          break;
        case 'vendor':
          aVal = a.vendor.storeName || '';
          bVal = b.vendor.storeName || '';
          break;
        case 'distance':
          aVal = a.vendor.distance;
          bVal = b.vendor.distance;
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
    
    return sorted;
  }, [plants, sortBy, sortOrder, favorites]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="plant-table-container">
      <table className="plant-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('favorites')} className="sortable">
              ❤️ {getSortIcon('favorites')}
            </th>
            <th onClick={() => handleSort('scientificName')} className="sortable">
              Scientific Name {getSortIcon('scientificName')}
            </th>
            <th onClick={() => handleSort('commonName')} className="sortable">
              Common Name {getSortIcon('commonName')}
            </th>
            <th onClick={() => handleSort('vendor')} className="sortable">
              Nursery {getSortIcon('vendor')}
            </th>
            <th onClick={() => handleSort('distance')} className="sortable">
              Distance {getSortIcon('distance')}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedPlants.map((plant) => {
            const isFavorite = favorites.has(plant.uniqueKey);
            return (
              <tr 
                key={plant.uniqueKey} 
                className={isFavorite ? 'favorite-row' : ''}
              >
                <td className="favorite-cell">
                  <button
                    className="favorite-button"
                    onClick={() => onToggleFavorite(plant.uniqueKey)}
                    aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    {isFavorite ? '❤️' : '🤍'}
                  </button>
                </td>
                <td className="scientific-name">{plant.scientificName}</td>
                <td>{plant.commonName || '-'}</td>
                <td>
                  {plant.vendor.storeUrl ? (
                    <a 
                      href={plant.vendor.storeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="vendor-link"
                    >
                      {plant.vendor.storeName}
                    </a>
                  ) : plant.vendor.storeName}
                </td>
                <td>{
                  plant.vendor.distance !== undefined && plant.vendor.distance !== null
                    ? `${plant.vendor.distance.toFixed(1)} miles`
                    : '-'
                }</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PlantTable; 