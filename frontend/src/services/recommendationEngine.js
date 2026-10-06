// Agronomic Diagnostic & Fertilizer Recommendation Engine for AgriTwin Nexus
// Evaluates crop stress, identifies primary affecting health factors, and prescribes specific fertilizers & precautions

export const recommendationEngine = {
  /**
   * Evaluate farm metrics and return primary stress factors and targeted agronomic advisories
   */
  async getAdvisories(farm, indices, weather, risks) {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const crop = farm?.cropType || 'Wheat';
    const ndvi = indices?.current?.NDVI || 0.74;
    const ndre = indices?.current?.NDRE || 0.58;
    const savi = indices?.current?.SAVI || 0.52;
    const temp = weather?.current?.tempCelsius || 27.5;
    const humidity = weather?.current?.humidity || 68;
    const highRisk = risks?.diseases?.find((d) => d.riskLevel === 'High' || d.riskLevel === 'Moderate');

    // 1. Identify Primary Affecting Health Factor
    let primaryAffectingFactor = {
      factorName: 'Optimal Crop Development',
      severity: 'Low',
      cause: 'Vegetation vigor and moisture levels are within normal agronomic thresholds.',
      impactLevel: 'Good Growth Trend'
    };

    if (savi < 0.50) {
      primaryAffectingFactor = {
        factorName: 'Sub-surface Soil Moisture Deficit (Water Stress)',
        severity: 'High',
        cause: 'SAVI index indicates canopy transpiration deficit and dry upper soil profile.',
        impactLevel: 'May reduce yield by 8-15% if unaddressed'
      };
    } else if (ndre < 0.60) {
      primaryAffectingFactor = {
        factorName: 'Nitrogen & Chlorophyll Deficiency',
        severity: 'Moderate',
        cause: 'NDRE spectral map indicates low chlorophyll concentration in middle leaf layers.',
        impactLevel: 'Causes leaf yellowing and reduces photosynthetic efficiency'
      };
    } else if (humidity > 65 && temp >= 22 && temp <= 30) {
      primaryAffectingFactor = {
        factorName: 'Fungal Spore Proliferation Deficit (High Humidity Risk)',
        severity: 'Moderate',
        cause: 'Canopy humidity >65% combined with 27°C temperature creates favorable spore micro-climate.',
        impactLevel: 'High vulnerability to fungal leaf spot & rust'
      };
    }

    // 2. Build Specific Agronomic & Fertilizer Advisories
    const advisories = [
      {
        id: 'adv_101',
        category: 'Soil Moisture & Irrigation',
        title: savi < 0.55 ? 'Immediate Drip / Sprinkler Irrigation Recommended' : 'Scheduled Maintenance Irrigation',
        priority: savi < 0.55 ? 'High' : 'Medium',
        affectingFactor: 'Soil Water Deficit (SAVI: ' + savi.toFixed(2) + ')',
        description: savi < 0.55
          ? 'Sub-surface moisture is dropping. Apply 25mm irrigation via drip or sprinkler during early morning (05:00 AM - 08:00 AM) to maximize soil absorption.'
          : 'Moisture level is adequate. Maintain 3-day irrigation cycle.',
        recommendedIntervention: 'Water Application (25 mm / 2.5 Lakh Liters per Ha)',
        precautions: 'Avoid flood irrigation in afternoon peak sun to prevent root shock and evaporation loss.',
        status: 'Pending Action'
      },
      {
        id: 'adv_102',
        category: 'Nutrient & Fertilizer Recommendation',
        title: ndre < 0.60 ? 'Targeted Nitrogen Booster: Urea / Nano Urea Spray' : 'Balanced NPK Maintenance Dose',
        priority: ndre < 0.60 ? 'High' : 'Medium',
        affectingFactor: 'Nitrogen & Chlorophyll Deficit (NDRE: ' + ndre.toFixed(2) + ')',
        description: ndre < 0.60
          ? `Spectral analysis indicates lower chlorophyll in ${crop}. Apply split dose of Nitrogen to restore leaf greenness.`
          : `Balanced nutrient levels detected for ${crop}. Apply scheduled maintenance dose.`,
        recommendedFertilizers: [
          { name: 'Urea (46% N)', dose: '35 kg / Hectare (14 kg / Acre)', method: 'Soil Top-Dressing' },
          { name: 'IFFCO Nano Urea', dose: '4 ml / Liter of water (500 ml / Acre)', method: 'Foliar Spray' },
          { name: 'NPK 19:19:19', dose: '5 kg / Acre via Drip Fertigation', method: 'Fertigation' }
        ],
        precautions: 'Apply soil fertilizer when soil is moist. Do not apply dry Urea on scorched dry soil.',
        status: 'Pending Action'
      },
      {
        id: 'adv_103',
        category: 'Crop Protection & Disease Defense',
        title: highRisk ? `Preventive Protocol: ${highRisk.name}` : 'Bio-Pesticide Preventive Spray',
        priority: highRisk ? 'High' : 'Low',
        affectingFactor: highRisk ? highRisk.name + ' Fungal Vector' : 'Micro-climate Humidity',
        description: highRisk
          ? `Micro-climate conditions trigger moderate/high risk of ${highRisk.name} in ${crop}. Apply protective fungicide spray window open today.`
          : `Canopy health is stable. Apply bio-preventive spray to maintain resistance.`,
        recommendedTreatment: [
          { name: 'Propiconazole 25% EC', dose: '1 ml / Liter water', useCase: 'Fungal Rust / Leaf Blight Control' },
          { name: 'Neem Oil (10,000 PPM)', dose: '2 ml / Liter water', useCase: 'Organic Pest & Sucking Insect Repellent' },
          { name: 'Trichoderma Viride', dose: '5 g / Liter water', useCase: 'Bio-Fungicide Root Soil Drenching' }
        ],
        precautions: 'Spray during low wind velocity (<12 km/h) between 04:00 PM and 06:30 PM for optimal droplet coverage.',
        status: 'Pending Action'
      }
    ];

    return {
      primaryAffectingFactor,
      advisories
    };
  }
};

