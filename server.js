const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
}

// Plant Agents API configuration
const PLANT_AGENTS_API = 'https://app.plantagents.org';
const API_TOKEN = process.env.PLANT_AGENTS_API_TOKEN || 'b2759141-2d91-4841-9347-aec9a35f895f';

const FEEDBACK_ENDPOINT = 'https://script.google.com/macros/s/AKfycbyUDAJtsY2yA-do2ZilcQH2K5rpyW6xCHT9PGZ4rGCNaNEASOqqkJOLhIPcv7p7jhWFuA/exec';

// Proxy endpoint for finding vendors by ZIP
app.get('/api/vendors/zip', async (req, res) => {
  try {
    const { zipcode, radius } = req.query;
    
    const response = await axios.get(`${PLANT_AGENTS_API}/Vendor/FindByZip`, {
      params: { zipcode, radius },
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching vendors by ZIP:', error.message);
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to fetch vendors',
      message: error.message 
    });
  }
});

// Proxy endpoint for finding vendors by state
app.get('/api/vendors/state', async (req, res) => {
  try {
    const { state } = req.query;
    
    const response = await axios.get(`${PLANT_AGENTS_API}/Vendor/FindByState`, {
      params: { state },
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching vendors by state:', error.message);
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to fetch vendors',
      message: error.message 
    });
  }
});

// Proxy endpoint for finding plants by vendor
app.get('/api/plants/vendor/:vendorId', async (req, res) => {
  try {
    const { vendorId } = req.params;
    
    const response = await axios.get(`${PLANT_AGENTS_API}/Plant/FindByVendor`, {
      params: { vendorId },
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching plants by vendor:', error.message);
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to fetch plants',
      message: error.message 
    });
  }
});

// Proxy endpoint for submitting feedback
app.post('/api/feedback', async (req, res) => {
  try {
    const response = await axios.post(FEEDBACK_ENDPOINT, req.body, {
      headers: { 'Content-Type': 'application/json' },
    });
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error('Error sending feedback:', error.message);
    res.status(500).json({
      error: 'Failed to send feedback',
      message: error.message,
    });
  }
});

// Catch-all: send back React's index.html for any non-API route in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 