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

const DEFAULT_DEMO_FARMS = [
  {
    id: 'farm_khemnar_1',
    userId: 'usr_demo_1',
    farmName: 'Khemnar Farm',
    cropType: 'Wheat (गहू / गेहूं)',
    sowingDate: '2026-07-07',
    latitude: 19.923135,
    longitude: 74.546445,
    areaHectares: 0.04,
    areaAcres: 0.09,
    status: 'Active Twin Ready',
    boundary: {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [74.5460, 19.9228],
            [74.5468, 19.9228],
            [74.5468, 19.9234],
            [74.5460, 19.9234],
            [74.5460, 19.9228]
          ]
        ]
      }
    },
    boundaryGeoJSON: {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [74.5460, 19.9228],
            [74.5468, 19.9228],
            [74.5468, 19.9234],
            [74.5460, 19.9234],
            [74.5460, 19.9228]
          ]
        ]
      }
    }
  },
  {
    id: 'farm_badnapur_2',
    userId: 'usr_demo_1',
    farmName: 'Badnapur Papaya Orchard',
    cropType: 'Papaya (पपई / पपीता)',
    sowingDate: '2026-06-15',
    latitude: 19.8654,
    longitude: 75.9231,
    areaHectares: 1.20,
    areaAcres: 2.96,
    status: 'Active Twin Ready',
    boundary: {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [75.9220, 19.8645],
            [75.9242, 19.8645],
            [75.9242, 19.8662],
            [75.9220, 19.8662],
            [75.9220, 19.8645]
          ]
        ]
      }
    },
    boundaryGeoJSON: {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [75.9220, 19.8645],
            [75.9242, 19.8645],
            [75.9242, 19.8662],
            [75.9220, 19.8662],
            [75.9220, 19.8645]
          ]
        ]
      }
    }
  },
  {
    id: 'farm_kopargaon_3',
    userId: 'usr_demo_1',
    farmName: 'Kopargaon Sugarcane Field',
    cropType: 'Sugarcane (ऊस / गन्ना)',
    sowingDate: '2026-05-10',
    latitude: 19.8912,
    longitude: 74.4789,
    areaHectares: 2.50,
    areaAcres: 6.17,
    status: 'Active Twin Ready',
    boundary: {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [74.4770, 19.8900],
            [74.4808, 19.8900],
            [74.4808, 19.8924],
            [74.4770, 19.8924],
            [74.4770, 19.8900]
          ]
        ]
      }
    },
    boundaryGeoJSON: {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [74.4770, 19.8900],
            [74.4808, 19.8900],
            [74.4808, 19.8924],
            [74.4770, 19.8924],
            [74.4770, 19.8900]
          ]
        ]
      }
    }
  }
];

export const farmService = {
  /**
   * Fetch all registered farms for active logged-in farmer
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
            cropType: f.cropType || f.crop_type || 'Wheat (गहू / गेहूं)',
            sowingDate: f.sowingDate || f.sowing_date || '2026-07-07',
            latitude: parseFloat(f.latitude || f.center_lat || 19.923135),
            longitude: parseFloat(f.longitude || f.center_lon || 74.546445),
            boundary: f.boundary || f.geojson_boundary,
            boundaryGeoJSON: f.boundary || f.geojson_boundary,
            areaHectares: parseFloat(f.areaHectares || f.area_ha || 0.04),
            areaAcres: parseFloat(f.areaAcres || f.area_acres || 0.09),
            status: f.status || 'Active Twin Ready'
          }));
        }
      }
    } catch (e) {
      console.warn('Backend API unavailable, fetching from local storage');
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

    // Auto-seed default demo farms if storage is empty
    if (!allFarms || allFarms.length === 0) {
      allFarms = DEFAULT_DEMO_FARMS;
      localStorage.setItem(FARMS_STORAGE_KEY, JSON.stringify(DEFAULT_DEMO_FARMS));
    }

    // Strict user isolation filter: each farmer sees ONLY their registered farms
    let resultFarms = [];
    const currentUserStr = localStorage.getItem('agritwin_current_user');
    if (currentUserStr) {
      try {
        const currentUser = JSON.parse(currentUserStr);
        if (currentUser && (currentUser.id || currentUser.email)) {
          const userIdStr = String(currentUser.id || '');
          const userEmailStr = String(currentUser.email || '').toLowerCase();

          const isDemoUser = userIdStr === 'usr_demo_1' || userEmailStr === 'farmer@agritwin.com';

          resultFarms = allFarms.filter((f) => {
            const farmUserId = String(f.userId || '');
            if (farmUserId === userIdStr || farmUserId.toLowerCase() === userEmailStr) {
              return true;
            }
            if (isDemoUser && (farmUserId === 'usr_demo_1' || !f.userId)) {
              return true;
            }
            return false;
          });
        }
      } catch (err) {
        console.error('Error filtering user farms:', err);
      }
    } else {
      // Default fallback if no active session
      resultFarms = allFarms.filter(f => f.userId === 'usr_demo_1' || !f.userId);
    }

    // Enrich all farms with dynamic live telemetry
    return resultFarms.map(f => telemetryOrchestrator.enrichFarmTelemetry(f));
  },

  /**
   * Fetch all farms across all farmers for Platform Administrator Oversight
   */
  async getAllFarmsForAdmin() {
    const farmsStr = localStorage.getItem(FARMS_STORAGE_KEY);
    if (!farmsStr) return DEFAULT_DEMO_FARMS;
    try {
      const parsed = JSON.parse(farmsStr);
      return parsed.length > 0 ? parsed : DEFAULT_DEMO_FARMS;
    } catch (e) {
      return DEFAULT_DEMO_FARMS;
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
            cropType: f.cropType || f.crop_type || 'Wheat (गहू / गेहूं)',
            sowingDate: f.sowingDate || f.sowing_date || '2026-07-07',
            latitude: parseFloat(f.latitude || f.center_lat || 19.923135),
            longitude: parseFloat(f.longitude || f.center_lon || 74.546445),
            boundary: f.boundary || f.geojson_boundary,
            boundaryGeoJSON: f.boundary || f.geojson_boundary,
            areaHectares: parseFloat(f.areaHectares || f.area_ha || 0.04),
            areaAcres: parseFloat(f.areaAcres || f.area_acres || 0.09),
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
      return farms[0] || telemetryOrchestrator.enrichFarmTelemetry(DEFAULT_DEMO_FARMS[0]);
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
    let activeUserId = 'usr_demo_1';
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
      boundaryGeoJSON: farmPayload.boundary,
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
        const response = await apiClient.post(`/farms?user_id=${activeUserId}`, {
          farm_name: newFarm.farmName,
          crop_type: newFarm.cropType,
          farmer_selected_crop: newFarm.cropType,
          sowing_date: newFarm.sowingDate,
          latitude: newFarm.latitude,
          longitude: newFarm.longitude,
          boundary_geojson: newFarm.boundary
        });
        if (response.data && response.data.id) {
          newFarm.id = response.data.id;
          newFarm.last_satellite_observation = response.data.last_satellite_observation;
          newFarm.last_weather_update = response.data.last_weather_update;
          newFarm.model_detected_crop = response.data.model_detected_crop;
          newFarm.model_confidence = response.data.model_confidence;
          newFarm.crop_prediction_status = response.data.crop_prediction_status;
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
   * Post ground-truth farmer crop confirmation
   */
  async confirmCrop(farmId, confirmedCrop) {
    try {
      if (await isBackendAvailable()) {
        await apiClient.post(`/farms/${farmId}/crop-confirmation`, {
          confirmed_crop: confirmedCrop
        });
      }
    } catch (e) {
      console.warn('Crop confirmation updated locally:', e);
    }

    const allFarmsStr = localStorage.getItem(FARMS_STORAGE_KEY);
    if (allFarmsStr) {
      try {
        let allFarms = JSON.parse(allFarmsStr);
        const idx = allFarms.findIndex((f) => String(f.id) === String(farmId));
        if (idx !== -1) {
          allFarms[idx].farmer_confirmed_crop = confirmedCrop;
          allFarms[idx].cropType = confirmedCrop;
          allFarms[idx].crop_prediction_status = 'farmer_confirmed';
          localStorage.setItem(FARMS_STORAGE_KEY, JSON.stringify(allFarms));
        }
      } catch (err) {}
    }

    return { success: true, confirmedCrop };
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
      boundaryGeoJSON: updatePayload.boundary || existingFarms[index].boundaryGeoJSON,
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
