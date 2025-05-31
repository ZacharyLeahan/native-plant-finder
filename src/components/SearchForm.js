import React, { useState } from 'react';
import './SearchForm.css';

const SearchForm = ({ onSearch, loading }) => {
  const [searchMode, setSearchMode] = useState('zip');
  const [zipCode, setZipCode] = useState('');
  const [radius, setRadius] = useState('25');
  const [state, setState] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (searchMode === 'zip') {
      if (zipCode.length === 5 && radius) {
        onSearch({ zipCode, radius: parseInt(radius) });
      }
    } else {
      if (state.length === 2) {
        onSearch({ state: state.toUpperCase() });
      }
    }
  };

  const isValidZip = zipCode.match(/^\d{5}$/);
  const isValidState = state.match(/^[A-Za-z]{2}$/);
  
  const canSubmit = searchMode === 'zip' 
    ? isValidZip && radius 
    : isValidState;

  return (
    <div className="search-form-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-mode-selector">
          <label>
            <input
              type="radio"
              value="zip"
              checked={searchMode === 'zip'}
              onChange={(e) => setSearchMode(e.target.value)}
            />
            Search by ZIP Code
          </label>
          <label>
            <input
              type="radio"
              value="state"
              checked={searchMode === 'state'}
              onChange={(e) => setSearchMode(e.target.value)}
            />
            Search by State
          </label>
        </div>

        {searchMode === 'zip' ? (
          <div className="search-inputs">
            <div className="input-group">
              <label htmlFor="zipCode">ZIP Code</label>
              <input
                id="zipCode"
                type="text"
                placeholder="12345"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                maxLength="5"
              />
            </div>
            <div className="input-group">
              <label htmlFor="radius">Radius (miles)</label>
              <select
                id="radius"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
              >
                <option value="10">10 miles</option>
                <option value="25">25 miles</option>
                <option value="50">50 miles</option>
                <option value="100">100 miles</option>
                <option value="200">200 miles</option>
              </select>
            </div>
          </div>
        ) : (
          <div className="search-inputs">
            <div className="input-group">
              <label htmlFor="state">State Abbreviation</label>
              <input
                id="state"
                type="text"
                placeholder="PA"
                value={state}
                onChange={(e) => setState(e.target.value.replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase())}
                maxLength="2"
              />
            </div>
          </div>
        )}

        <button 
          type="submit" 
          disabled={!canSubmit || loading}
          className="search-button"
        >
          {loading ? 'Searching...' : 'Search for Plants'}
        </button>
      </form>
    </div>
  );
};

export default SearchForm; 