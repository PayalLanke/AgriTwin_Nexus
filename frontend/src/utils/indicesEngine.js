/**
 * Vegetation Indices Math & Analytics Engine for AgriTwin Nexus (Module 9)
 */

export const calculateNDVI = (nir, red) => {
  if (nir + red === 0) return 0;
  return (nir - red) / (nir + red);
};

export const calculateNDRE = (nir, redEdge) => {
  if (nir + redEdge === 0) return 0;
  return (nir - redEdge) / (nir + redEdge);
};

export const calculateEVI = (nir, red, blue) => {
  const denom = nir + 6 * red - 7.5 * blue + 1;
  if (denom === 0) return 0;
  return 2.5 * ((nir - red) / denom);
};

export const calculateSAVI = (nir, red, L = 0.5) => {
  const denom = nir + red + L;
  if (denom === 0) return 0;
  return ((nir - red) / denom) * (1 + L);
};

/**
 * Generate comprehensive index analytics and health status classification for a farm
 */
export const getFarmIndicesAnalysis = (cropType = 'Wheat', sowingDateStr = '2026-06-01') => {
  // Base spectral band reflectances derived from healthy canopy models
  const b8_nir = 0.485;
  const b5_redEdge = 0.185;
  const b4_red = 0.065;
  const b2_blue = 0.042;

  const ndvi = Math.round(calculateNDVI(b8_nir, b4_red) * 100) / 100; // ~0.76
  const ndre = Math.round(calculateNDRE(b8_nir, b5_redEdge) * 100) / 100; // ~0.45
  const evi = Math.round(calculateEVI(b8_nir, b4_red, b2_blue) * 100) / 100; // ~0.72
  const savi = Math.round(calculateSAVI(b8_nir, b4_red) * 100) / 100; // ~0.60

  // Health Vigor Classification
  let healthStatus = 'Dense Vigorous Growth';
  let healthBadge = 'badge-primary';
  if (ndvi < 0.3) {
    healthStatus = 'Severe Vegetation Stress';
    healthBadge = 'badge-danger';
  } else if (ndvi < 0.55) {
    healthStatus = 'Moderate Canopy Stress';
    healthBadge = 'badge-amber';
  }

  // Multi-stage historical growth curve data for time-series charts
  const sowingDate = new Date(sowingDateStr || '2026-06-01');
  const growthSeries = [];
  const stages = ['Emergence', 'Tillering', 'Jointing', 'Booting', 'Heading', 'Grain Filling', 'Maturity'];
  
  stages.forEach((stage, idx) => {
    const d = new Date(sowingDate);
    d.setDate(d.getDate() + idx * 14);
    
    // Bell-curve shape for NDVI over growth cycle
    let stageNdvi = 0.2 + 0.6 * Math.sin((idx / (stages.length - 1)) * Math.PI);
    stageNdvi = Math.round(stageNdvi * 100) / 100;
    
    let stageNdre = Math.round(stageNdvi * 0.62 * 100) / 100;
    let stageSavi = Math.round(stageNdvi * 0.78 * 100) / 100;
    let stageEvi = Math.round(stageNdvi * 0.92 * 100) / 100;

    growthSeries.push({
      stage,
      date: d.toISOString().slice(0, 10),
      NDVI: stageNdvi,
      NDRE: stageNdre,
      SAVI: stageSavi,
      EVI: stageEvi
    });
  });

  return {
    current: {
      NDVI: ndvi,
      NDRE: ndre,
      EVI: evi,
      SAVI: savi,
      healthStatus,
      healthBadge,
      chlorophyllIndex: Math.round(ndre * 45 * 10) / 10, // µg/cm²
      canopyCoverage: Math.round(ndvi * 88) + '%'
    },
    growthSeries
  };
};
