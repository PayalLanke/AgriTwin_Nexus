// Farm Service for AgriTwin Nexus
// Decoupled service layer connecting FastAPI REST API (http://localhost:8000) with LocalStorage fallback

import { apiClient, isBackendAvailable } from './api';
import { calculatePolygonArea } from '../utils/geoUtils';
import { telemetryOrchestrator } from './telemetryOrchestrator';

const FARMS_STORAGE_KEY = 'agritwin_farms';

export const CROP_OPTIONS = [
  'Papaya (पपई / पपीता)',
  'Guinea Grass / Fodder Grass (गिनी गवत / चारा पिके)',
  'Mango (आंबा / आम)',
  'Custard Apple / Seetaphal (सीताफळ)',
  'Wheat (गहू / गेहूं)',
  'Rice / Paddy (भात / चावल)',
  'Sugarcane (ऊस / गन्ना)',
  'Cotton (कापूस / कपास)',
  'Soybean (सोयाबीन)',
  'Maize / Corn (मका / मक्का)',
  'Turmeric (हळद / हल्दी)',
  'Onion (कांदा / प्याज)',
  'Pomegranate (डाळिंब / अनार)',
  'Grapes (द्राक्षे / अंगूर)',
  'Banana (केळी / केला)',
  'Chickpea / Harbara (हरभरा / चना)',
  'Tur / Pigeon Pea (तूर / अरहर)',
  'Bajra / Pearl Millet (बाजरी / बाजरा)',
  'Jowar / Sorghum (ज्वारी / ज्वार)',
  'Groundnut (भुईमूग / मूंगफली)',
  'Citrus / Sweet Lime (मोसंबी / संत्रा)',
  'Tomato (टोमॅटो / टमाटर)',
  'Chili (मिरची / मिर्च)'
];

export const farmService = {
  /**
   * Fetch all registered farms for active logged-in farmer (Enforces User Isolation)
   */
  async getFarms() {
    let allFarms = [];
    try {
      if (await isBackendAvailable()) {
        const response = await apiClient.get('/farms/');
        if (Array.isArray(response.data) && response.data.length > 0) {
          allFarms = response.data.map(f => ({
            id: f.id || f.farm_id,
            userId: f.userId || f.user_id || 'usr_demo_1',
            farmName: f.farmName || f.farm_name || f.name,
            cropType: f.cropType || f.crop_type || 'Soybean',
            sowingDate: f.sowingDate || f.sowing_date || new Date().toISOString().split('T')[0],
            latitude: parseFloat(f.latitude || f.center_lat || 19.8347),
            longitude: parseFloat(f.longitude || f.center_lon || 75.8816),
            boundary: f.boundary || f.geojson_boundary,
            boundaryGeoJSON: f.boundary || f.geojson_boundary,
            areaHectares: parseFloat(f.areaHectares || f.area_ha || 0.76),
            areaAcres: parseFloat(f.areaAcres || f.area_acres || 1.88),
            status: f.status || 'Active Twin Ready'
          }));
        }
      }
    } catch (e) {
      console.warn('Backend API unavailable, fetching from local storage:', e);
    }

    if (allFarms.length === 0) {
      const farmsStr = localStorage.getItem(FARMS_STORAGE_KEY);
      if (farmsStr) {
        try {
          allFarms = JSON.parse(farmsStr);
        } catch (e) {
          console.error('Failed to parse farms from storage:', e);
        }
      }
    }

    // Filter farms so each farmer only sees their own farms
    let resultFarms = allFarms;
    const currentUserStr = localStorage.getItem('agritwin_current_user');
    if (currentUserStr) {
      try {
        const currentUser = JSON.parse(currentUserStr);
        if (currentUser && currentUser.id) {
          const userFarms = allFarms.filter(
            f => String(f.userId) === String(currentUser.id) || String(f.userId) === String(currentUser.email)
          );
          if (userFarms.length > 0) {
            resultFarms = userFarms;
          } else if (currentUser.id === 'usr_demo_1') {
            resultFarms = allFarms;
          } else {
            resultFarms = [];
          }
        }
      } catch (err) {
        console.error('Error filtering user farms:', err);
      }
    }

    // Enrich all farms with dynamic live telemetry
    return resultFarms.map(f => telemetryOrchestrator.enrichFarmTelemetry(f));
  },

  /**
   * Fetch all farms across all farmers for Platform Administrator Oversight
   */
  async getAllFarmsForAdmin() {
    const farmsStr = localStorage.getItem(FARMS_STORAGE_KEY);
    if (!farmsStr) return [];
    try {
      return JSON.parse(farmsStr);
    } catch (e) {
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
          const rawFarm = {
            id: f.id || f.farm_id,
            userId: f.userId || f.user_id || 'usr_demo_1',
            farmName: f.farmName || f.farm_name || f.name,
            cropType: f.cropType || f.crop_type || 'Soybean',
            sowingDate: f.sowingDate || f.sowing_date || new Date().toISOString().split('T')[0],
            latitude: parseFloat(f.latitude || f.center_lat || 19.8347),
            longitude: parseFloat(f.longitude || f.center_lon || 75.8816),
            boundary: f.boundary || f.geojson_boundary,
            boundaryGeoJSON: f.boundary || f.geojson_boundary,
            areaHectares: parseFloat(f.areaHectares || f.area_ha || 0.76),
            areaAcres: parseFloat(f.areaAcres || f.area_acres || 1.88),
            status: f.status || 'Active Twin Ready'
          };
          return telemetryOrchestrator.enrichFarmTelemetry(rawFarm);
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

    const currentUserStr = localStorage.getItem('agritwin_current_user');
    let activeUserId = 'usr_default';
    if (currentUserStr) {
      try {
        const u = JSON.parse(currentUserStr);
        if (u && u.id) activeUserId = u.id;
      } catch (err) {}
    }

    const newFarm = {
      id: 'farm_' + Date.now(),
      userId: farmPayload.userId || activeUserId,
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
    const allFarmsStr = localStorage.getItem(FARMS_STORAGE_KEY);
    let allFarms = [];
    if (allFarmsStr) {
      try { allFarms = JSON.parse(allFarmsStr); } catch (e) {}
    }
    allFarms.unshift(newFarm);
    localStorage.setItem(FARMS_STORAGE_KEY, JSON.stringify(allFarms));

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
