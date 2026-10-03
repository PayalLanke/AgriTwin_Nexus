// Farm Service for AgriTwin Nexus
// Decoupled service layer connecting FastAPI REST API (http://localhost:8000) with LocalStorage fallback

import { apiClient, isBackendAvailable } from './api';
import { calculatePolygonArea } from '../utils/geoUtils';

const FARMS_STORAGE_KEY = 'agritwin_farms';

export const CROP_OPTIONS = [
  'Wheat',
  'Rice / Paddy',
  'Maize (Corn)',
  'Cotton',
  'Sugarcane',
  'Soybean',
  'Potato',
  'Tomato',
  'Mustard',
  'Pulses / Gram'
];

export const farmService = {
  /**
   * Fetch all registered farms for active farmer
   */
  async getFarms() {
    try {
      if (await isBackendAvailable()) {
        const response = await apiClient.get('/farms/');
        if (Array.isArray(response.data) && response.data.length > 0) {
          return response.data.map(f => ({
            id: f.id || f.farm_id,
            farmName: f.farmName || f.farm_name || f.name,
            cropType: f.cropType || f.crop_type || 'Soybean',
            sowingDate: f.sowingDate || f.sowing_date || new Date().toISOString().split('T')[0],
            latitude: parseFloat(f.latitude || f.center_lat || 19.8347),
            longitude: parseFloat(f.longitude || f.center_lon || 75.8816),
            boundary: f.boundary || f.geojson_boundary,
            areaHectares: parseFloat(f.areaHectares || f.area_ha || 0.76),
            areaAcres: parseFloat(f.areaAcres || f.area_acres || 1.88),
            status: f.status || 'Active Twin Ready'
          }));
        }
      }
    } catch (e) {
      console.warn('Backend API unavailable, fetching from local storage:', e);
    }

    // Fallback to localStorage
    await new Promise((resolve) => setTimeout(resolve, 150));
    const farmsStr = localStorage.getItem(FARMS_STORAGE_KEY);
    if (!farmsStr) return [];
    try {
      return JSON.parse(farmsStr);
    } catch (e) {
      console.error('Failed to parse farms from storage:', e);
      return [];
    }
  },

  /**
   * Fetch a single farm by ID
   */
  async getFarmById(id) {
    try {
      if (await isBackendAvailable()) {
        const response = await apiClient.get(`/farms/${id}`);
        if (response.data) {
          const f = response.data;
          return {
            id: f.id || f.farm_id,
            farmName: f.farmName || f.farm_name || f.name,
            cropType: f.cropType || f.crop_type || 'Soybean',
            sowingDate: f.sowingDate || f.sowing_date || new Date().toISOString().split('T')[0],
            latitude: parseFloat(f.latitude || f.center_lat || 19.8347),
            longitude: parseFloat(f.longitude || f.center_lon || 75.8816),
            boundary: f.boundary || f.geojson_boundary,
            areaHectares: parseFloat(f.areaHectares || f.area_ha || 0.76),
            areaAcres: parseFloat(f.areaAcres || f.area_acres || 1.88),
            status: f.status || 'Active Twin Ready'
          };
        }
      }
    } catch (e) {
      console.warn('Backend endpoint unavailable, checking local storage...');
    }

    const farms = await this.getFarms();
    const farm = farms.find((f) => String(f.id) === String(id));
    if (!farm) {
      throw new Error(`Farm with ID ${id} not found.`);
    }
    return farm;
  },

  /**
   * Save a newly registered farm
   */
  async createFarm(farmPayload) {
    if (!farmPayload.farmName || !farmPayload.farmName.trim()) {
      throw new Error('Farm name is required.');
    }
    if (!farmPayload.cropType) {
      throw new Error('Crop type is required.');
    }
    if (!farmPayload.sowingDate) {
      throw new Error('Sowing date is required.');
    }
    if (!farmPayload.latitude || !farmPayload.longitude) {
      throw new Error('Farm center location is required.');
    }
    if (!farmPayload.boundary) {
      throw new Error('Please draw the farm boundary on the map before saving.');
    }

    const areaStats = calculatePolygonArea(farmPayload.boundary);

    const newFarm = {
      id: 'farm_' + Date.now(),
      userId: farmPayload.userId || 'usr_default',
      farmName: farmPayload.farmName.trim(),
      cropType: farmPayload.cropType,
      sowingDate: farmPayload.sowingDate,
      latitude: parseFloat(farmPayload.latitude),
      longitude: parseFloat(farmPayload.longitude),
      boundary: farmPayload.boundary,
      areaHectares: areaStats.hectares,
      areaAcres: areaStats.acres,
      areaSqMeters: areaStats.sqMeters,
      status: 'Active Twin Ready',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Try posting to FastAPI backend API
    try {
      if (await isBackendAvailable()) {
        const response = await apiClient.post('/farms/', {
          farm_name: newFarm.farmName,
          crop_type: newFarm.cropType,
          sowing_date: newFarm.sowingDate,
          center_lat: newFarm.latitude,
          center_lon: newFarm.longitude,
          geojson_boundary: newFarm.boundary,
          area_ha: newFarm.areaHectares
        });
        if (response.data && response.data.id) {
          newFarm.id = response.data.id;
        }
      }
    } catch (e) {
      console.warn('Saved farm locally (FastAPI backend unavailable):', e);
    }

    // Always persist locally for offline reliability
    const existingFarms = await this.getFarms();
    existingFarms.unshift(newFarm);
    localStorage.setItem(FARMS_STORAGE_KEY, JSON.stringify(existingFarms));

    return newFarm;
  },

  /**
   * Update an existing farm
   */
  async updateFarm(id, updatePayload) {
    const existingFarms = await this.getFarms();
    const index = existingFarms.findIndex((f) => String(f.id) === String(id));
    if (index === -1) {
      throw new Error('Farm not found to update.');
    }

    let areaStats = {
      hectares: existingFarms[index].areaHectares,
      acres: existingFarms[index].areaAcres,
      sqMeters: existingFarms[index].areaSqMeters
    };

    if (updatePayload.boundary) {
      areaStats = calculatePolygonArea(updatePayload.boundary);
    }

    const updatedFarm = {
      ...existingFarms[index],
      ...updatePayload,
      areaHectares: areaStats.hectares,
      areaAcres: areaStats.acres,
      areaSqMeters: areaStats.sqMeters,
      updatedAt: new Date().toISOString()
    };

    try {
      if (await isBackendAvailable()) {
        await apiClient.put(`/farms/${id}`, {
          farm_name: updatedFarm.farmName,
          crop_type: updatedFarm.cropType,
          sowing_date: updatedFarm.sowingDate
        });
      }
    } catch (e) {
      console.warn('Updated farm locally:', e);
    }

    existingFarms[index] = updatedFarm;
    localStorage.setItem(FARMS_STORAGE_KEY, JSON.stringify(existingFarms));

    return updatedFarm;
  },

  /**
   * Delete farm by ID
   */
  async deleteFarm(id) {
    try {
      if (await isBackendAvailable()) {
        await apiClient.delete(`/farms/${id}`);
      }
    } catch (e) {
      console.warn('Deleted farm locally:', e);
    }

    const existingFarms = await this.getFarms();
    const filtered = existingFarms.filter((f) => String(f.id) !== String(id));
    localStorage.setItem(FARMS_STORAGE_KEY, JSON.stringify(filtered));

    return { success: true, message: 'Farm record deleted successfully.' };
  }
};
