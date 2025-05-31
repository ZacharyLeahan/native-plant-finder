import axios from 'axios';

// Backend API base URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

export const plantAPI = {
  // Find vendors by ZIP code and radius
  findVendorsByZip: async (zipCode, radius) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/vendors/zip`, {
        params: {
          zipcode: zipCode,
          radius: radius
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error finding vendors by ZIP:', error);
      throw error;
    }
  },

  // Find plants by vendor
  findPlantsByVendor: async (vendorId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/plants/vendor/${vendorId}`);
      return response.data;
    } catch (error) {
      console.error('Error finding plants by vendor:', error);
      throw error;
    }
  }
}; 