import React, { useState, useCallback } from 'react';
import './App.css';
import SearchForm from './components/SearchForm';
import PlantTable from './components/PlantTable';
import ExportButtons from './components/ExportButtons';
import FeedbackButton from './components/FeedbackButton';
import { plantAPI } from './services/api';
import birdIdleImg from './assets/bird_idle.png';
import beeIdleImg from './assets/bee_idle.png';

function App() {
  const [plants, setPlants] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentZipCode, setCurrentZipCode] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (searchParams) => {
    setHasSearched(true);
    setLoading(true);
    setError(null);
    setPlants([]);
    setCurrentZipCode(searchParams.zipCode);
    
    try {
      const vendors = await plantAPI.findVendorsByZip(searchParams.zipCode, searchParams.radius);

      // Fetch plants for each vendor
      const allPlants = [];
      for (const vendor of vendors) {
        try {
          const vendorPlants = await plantAPI.findPlantsByVendor(vendor.id);
          
          // Add vendor information to each plant
          const plantsWithVendor = vendorPlants.map(plant => ({
            ...plant,
            vendor: vendor,
            uniqueKey: `${plant.id}-${vendor.id}`
          }));
          
          allPlants.push(...plantsWithVendor);
        } catch (err) {
          console.error(`Error fetching plants for vendor ${vendor.storeName}:`, err);
        }
      }

      setPlants(allPlants);
      
      if (allPlants.length === 0) {
        setError('No plants found for the specified location.');
      }
    } catch (err) {
      setError('Error searching for plants. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = useCallback((uniqueKey) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(uniqueKey)) {
        newFavorites.delete(uniqueKey);
      } else {
        newFavorites.add(uniqueKey);
      }
      return newFavorites;
    });
  }, []);

  const getFavoritePlants = () => {
    return plants.filter(plant => favorites.has(plant.uniqueKey));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Native Plant Finder</h1>
        <p>Find native plants from nearby nurseries</p>
      </header>
      
      <main className="App-main">
        <SearchForm onSearch={handleSearch} loading={loading} hasSearched={hasSearched} />
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        {plants.length > 0 && (
          <>
            <div className="results-header">
              <h2>Found {new Set(plants.map(p => p.vendor.id)).size} local nurseries selling {Array.from(new Set(plants.map(p => p.scientificName))).length} native plants</h2>
            </div>
            
            <PlantTable 
              plants={plants}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              searchZipCode={currentZipCode}
            />
          </>
        )}
        
        <ExportButtons 
          plants={plants}
          favorites={favorites}
          getFavoritePlants={getFavoritePlants}
        />
      </main>
      <FeedbackButton hasSearched={hasSearched} zipCode={currentZipCode} />
    </div>
  );
}

export default App; 