// Farm Service for AgriTwin Nexus
// Decoupled service layer for local persistence & FastAPI REST endpoint integration

import { calculatePolygonArea } from '../utils/geoUtils';

const FARMS_STORAGE_KEY = 'agritwin_farms';

// Standard crop options available in AgriTwin Nexus
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
    await new Promise((resolve) => setTimeout(resolve, 200));
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
    await new Promise((resolve) => setTimeout(resolve, 150));
    const farms = await this.getFarms();
    const farm = farms.find((f) => String(f.id) === String(id));
    if (!farm) {
      throw new Error(`Farm with ID ${id} not found.`);
    }
    return farm;
  },

  /**
   * Save a newly registered farm
   * @param {Object} farmPayload { farmName, cropType, sowingDate, latitude, longitude, boundary }
   */
  async createFarm(farmPayload) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    // Validate required fields
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
      boundary: farmPayload.boundary, // GeoJSON Polygon
      areaHectares: areaStats.hectares,
      areaAcres: areaStats.acres,
      areaSqMeters: areaStats.sqMeters,
      status: 'Active Twin Ready',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const existingFarms = await this.getFarms();
    existingFarms.unshift(newFarm);
    localStorage.setItem(FARMS_STORAGE_KEY, JSON.stringify(existingFarms));

    return newFarm;
  },

  /**
   * Update existing farm details & GeoJSON boundary
   */
  async updateFarm(id, updatePayload) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const farms = await this.getFarms();
    const farmIndex = farms.findIndex((f) => String(f.id) === String(id));
    
    if (farmIndex === -1) {
      throw new Error(`Farm with ID ${id} not found.`);
    }

    const areaStats = updatePayload.boundary 
      ? calculatePolygonArea(updatePayload.boundary) 
      : { hectares: farms[farmIndex].areaHectares, acres: farms[farmIndex].areaAcres, sqMeters: farms[farmIndex].areaSqMeters };

    const updatedFarm = {
      ...farms[farmIndex],
      farmName: updatePayload.farmName ? updatePayload.farmName.trim() : farms[farmIndex].farmName,
      cropType: updatePayload.cropType || farms[farmIndex].cropType,
      sowingDate: updatePayload.sowingDate || farms[farmIndex].sowingDate,
      latitude: updatePayload.latitude ? parseFloat(updatePayload.latitude) : farms[farmIndex].latitude,
      longitude: updatePayload.longitude ? parseFloat(updatePayload.longitude) : farms[farmIndex].longitude,
      boundary: updatePayload.boundary || farms[farmIndex].boundary,
      areaHectares: areaStats.hectares,
      areaAcres: areaStats.acres,
      areaSqMeters: areaStats.sqMeters,
      updatedAt: new Date().toISOString()
    };

    farms[farmIndex] = updatedFarm;
    localStorage.setItem(FARMS_STORAGE_KEY, JSON.stringify(farms));

    return updatedFarm;
  },

  /**
   * Delete farm record
   */
  async deleteFarm(id) {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const farms = await this.getFarms();
    const filteredFarms = farms.filter((f) => String(f.id) !== String(id));
    localStorage.setItem(FARMS_STORAGE_KEY, JSON.stringify(filteredFarms));
    return { success: true };
  }
};
