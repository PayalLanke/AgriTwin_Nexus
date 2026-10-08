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

    // 2. Build Crop-Specific Authentic CPCB/ICAR Prescriptions
    const normalizedCrop = (crop || '').toLowerCase();
    let treatments = [
      { name: 'Propiconazole 25% EC', dose: '1 ml / Liter water', useCase: 'Fungal Rust & Leaf Spot Control' },
      { name: 'Azadirachtin (10,000 PPM Neem)', dose: '2 ml / Liter water', useCase: 'Organic Sucking Pest & Whitefly Repellent' },
      { name: 'Trichoderma Viride', dose: '5 g / Liter water', useCase: 'Bio-Fungicide Root Soil Drenching' }
    ];

    if (normalizedCrop.includes('papaya') || normalizedCrop.includes('पपई')) {
      treatments = [
        { name: 'Azadirachtin 10,000 PPM (Neem Oil)', dose: '2 ml / Liter water', useCase: 'Whitefly & Aphid Repellent (PRSV Vector Control)' },
        { name: 'Wettable Sulfur 80% WP', dose: '2 g / Liter water', useCase: 'Spider Mite & Powdery Mildew Defense' },
        { name: 'Imidacloprid 17.8% SL', dose: '0.5 ml / Liter water', useCase: 'Systemic Sucking Insecticide' },
        { name: 'Copper Oxychloride 50% WP', dose: '2.5 g / Liter water', useCase: 'Collar Rot & Stem Anthracnose Control' }
      ];
    } else if (normalizedCrop.includes('sugarcane') || normalizedCrop.includes('ऊस')) {
      treatments = [
        { name: 'Carbendazim 50% WP', dose: '2 g / Liter water', useCase: 'Red Rot & Sett Rot Fungal Protection' },
        { name: 'Chlorantraniliprole 18.5% SC', dose: '0.4 ml / Liter water', useCase: 'Early Shoot Borer & Top Borer Management' },
        { name: 'Emamectin Benzoate 5% SG', dose: '0.5 g / Liter water', useCase: 'Stalk Borer Control' },
        { name: 'Trichogramma Chilonis Parasitoid', dose: '50,000 eggs / Hectare', useCase: 'Biological Egg Parasite Deployment' }
      ];
    } else if (normalizedCrop.includes('maize') || normalizedCrop.includes('मका')) {
      treatments = [
        { name: 'Emamectin Benzoate 5% SG', dose: '0.4 g / Liter water (Whorl Drop)', useCase: 'Fall Armyworm (Spodoptera frugiperda) Control' },
        { name: 'Spinetoram 11.7% SC', dose: '0.5 ml / Liter water', useCase: 'Advanced Fall Armyworm Foliar Spray' },
        { name: 'Mancozeb 75% WP', dose: '2.5 g / Liter water', useCase: 'Turcicum & Maydis Leaf Blight Fungicide' }
      ];
    } else if (normalizedCrop.includes('cotton') || normalizedCrop.includes('कापूस')) {
      treatments = [
        { name: 'Chlorantraniliprole 18.5% SC', dose: '0.3 ml / Liter water', useCase: 'Pink Bollworm & American Bollworm Spray' },
        { name: 'Flonicamid 50% WG', dose: '0.3 g / Liter water', useCase: 'Sucking Pest (Jassids & Whiteflies) Control' },
        { name: 'Pink Bollworm Pheromone Trap', dose: '5 Traps / Acre', useCase: 'Moth Trap Monitoring' }
      ];
    } else if (normalizedCrop.includes('wheat') || normalizedCrop.includes('गहू')) {
      treatments = [
        { name: 'Propiconazole 25% EC', dose: '1 ml / Liter water', useCase: 'Yellow Stripe Rust & Karnal Bunt Control' },
        { name: 'Mancozeb 75% WP', dose: '2 g / Liter water', useCase: 'Alternaria Leaf Blight Fungicide' },
        { name: 'Chlorpyrifos 20% EC', dose: '2 ml / Liter water', useCase: 'Termite & Root Pest Soil Drench' }
      ];
    }

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
        category: 'CPCB/ICAR Pesticide & Plant Protection',
        title: highRisk ? `Preventive Protocol: ${highRisk.name}` : `${crop} Standard Pesticide & Fungicide Shield`,
        priority: highRisk ? 'High' : 'Medium',
        affectingFactor: highRisk ? highRisk.name + ' Risk Vector' : 'Micro-climate Pathogen Threshold',
        description: highRisk
          ? `Micro-climate conditions trigger risk of ${highRisk.name} in ${crop}. Apply protective registered spray during open weather window.`
          : `Canopy health is stable for ${crop}. Apply approved CPCB/ICAR registered pesticide/fungicide for preventive crop protection.`,
        recommendedTreatment: treatments,
        precautions: 'Spray during low wind velocity (<15 km/h) between 04:00 PM and 06:30 PM for optimal leaf coverage.',
        status: 'Pending Action'
      }
    ];

    return {
      primaryAffectingFactor,
      advisories
    };
  }
};

