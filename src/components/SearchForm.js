import React, { useState } from 'react';
import './SearchForm.css';
import birdImg from '../assets/bird.png';
import beeImg from '../assets/bee.png';
import beeSearchingImg from '../assets/bee_searching.png';
import birdSearchingImg from '../assets/bird_searching.png';

const SearchForm = ({ onSearch, loading, hasSearched }) => {
  const [zipCode, setZipCode] = useState('');
  const [radius, setRadius] = useState('25');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (zipCode.length === 5 && radius) {
      onSearch({ zipCode, radius: parseInt(radius) });
    }
  };

  const isValidZip = zipCode.match(/^[\d]{5}$/);
  const canSubmit = isValidZip && radius;

  return (
    <div className="search-form-container">
      <form onSubmit={handleSubmit} className="search-form-flex-row">
        <div className="search-side-image search-bee-area">
          <img src={hasSearched ? beeSearchingImg : beeImg} alt="Bee" className="search-side-img" />
        </div>
        <div className="search-center-area">
          <div className="search-inputs-flex">
            <div className="input-group same-width-input">
              <label htmlFor="zipCode">ZIP Code</label>
              <input
                id="zipCode"
                type="text"
                placeholder="12345"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                maxLength="5"
                className="same-width-input-el"
              />
            </div>
            <div className="input-group same-width-input">
              <label htmlFor="radius">Radius (miles)</label>
              <select
                id="radius"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                className="same-width-input-el"
              >
                <option value="10">10 miles</option>
                <option value="25">25 miles</option>
                <option value="50">50 miles</option>
                <option value="100">100 miles</option>
                <option value="200">200 miles</option>
              </select>
            </div>
          </div>
          <div className="search-button-row">
            <button 
              type="submit" 
              disabled={!canSubmit || loading}
              className="search-button"
            >
              {loading ? 'Searching...' : 'Search for Plants'}
            </button>
          </div>
        </div>
        <div className="search-side-image search-bird-area">
          <img src={hasSearched ? birdSearchingImg : birdImg} alt="Bird" className="search-side-img" />
        </div>
      </form>
    </div>
  );
};

export default SearchForm; 