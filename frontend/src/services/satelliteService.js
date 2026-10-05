// Satellite Data Service for AgriTwin Nexus (Google Earth Engine & Sentinel-2 Pipeline)
// Handles Copernicus Sentinel-2 L2A Surface Reflectance (Bands B2, B4, B5, B8, B11)

export const satelliteService = {
  /**
   * Fetch Sentinel-2 Level-2A observation scenes for a given farm's GeoJSON boundary and filters
   */
  async getSentinelScenes(farmId, filters = {}) {
    // Simulating GEE API request delay
    await new Promise((resolve) => setTimeout(resolve, 350));

    if (!farmId) return [];

    const { maxCloud = 30 } = filters;
    const today = new Date();
    const scenes = [];

    // Realistic Sentinel-2A / Sentinel-2B 5-day overpass orbit cycles
    const orbitSatellites = ['Sentinel-2A', 'Sentinel-2B', 'Sentinel-2A', 'Sentinel-2C'];
    const cloudValues = [4.2, 8.7, 14.5, 2.1];

    for (let i = 0; i < 4; i++) {
      const sceneDate = new Date(today);
      sceneDate.setDate(today.getDate() - i * 6 - 3);

      const cloudCover = cloudValues[i % cloudValues.length];
      if (cloudCover <= maxCloud) {
        const dateStr = sceneDate.toISOString().slice(0, 10);
        const compactDate = dateStr.replace(/-/g, '');
        const satName = orbitSatellites[i % orbitSatellites.length];

        scenes.push({
          id: `S2B_MSIL2A_${compactDate}T053641_N0509_R104_T43REQ`,
          granuleId: `L2A_T43REQ_A038${i}21_${compactDate}T054012`,
          date: dateStr,
          satellite: satName,
          productLevel: 'Sentinel-2 Level-2A Surface Reflectance',
          cloudCoverPercent: cloudCover,
          sunElevation: Math.round((64.2 - i * 1.8) * 10) / 10,
          resolutionMeters: '10 m / 20 m depending on spectral band',
          status: cloudCover < 5.0 ? 'Processed (Cloud Free)' : 'Processed (Cloud Mask Applied)',
          processingStage: 'Clipped to Farm Boundary',
          bands: [
            { code: 'B2', name: 'Blue', wave: '490 nm', res: '10 m', purpose: 'Blue reflectance' },
            { code: 'B4', name: 'Red', wave: '665 nm', res: '10 m', purpose: 'Red reflectance' },
            { code: 'B5', name: 'Red Edge', wave: '705 nm', res: '20 m', purpose: 'Red-edge vegetation information' },
            { code: 'B8', name: 'NIR', wave: '842 nm', res: '10 m', purpose: 'Near-infrared vegetation information' },
            { code: 'B11', name: 'SWIR', wave: '1610 nm', res: '20 m', purpose: 'Short-wave infrared surface information' }
          ]
        });
      }
    }

    return scenes;
  },

  /**
   * Process satellite spectral reflectance for a given scene
   */
  async getProcessedBands(farmId, sceneId) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    return {
      sceneId,
      processedAt: new Date().toISOString(),
      surfaceReflectanceProduct: 'Sentinel-2 Level-2A Surface Reflectance',
      cloudMaskApplied: true,
      meanReflectance: {
        B2_Blue: 0.042,
        B4_Red: 0.061,
        B5_RedEdge: 0.178,
        B8_NIR: 0.492,
        B11_SWIR: 0.185
      }
    };
  }
};
