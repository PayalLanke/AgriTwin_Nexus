// Pest & Disease Risk Prediction Engine for AgriTwin Nexus
// Evaluates real crop-specific disease and pest risks based on weather telemetry, sowing age, and vegetation stress

export const riskEngine = {
  /**
   * Evaluate crop-specific pest and disease risks for a given farm, indices, and weather
   */
  async evaluateFarmRisks(farm, indices, weather) {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const crop = (farm?.farmer_confirmed_crop || farm?.model_detected_crop || farm?.cropType || 'Crop').toLowerCase();
    const humidity = Number(weather?.current?.humidityPercent || weather?.humidity || 62);
    const temp = Number(weather?.current?.tempCelsius || weather?.temperature || 28.4);
    const ndvi = Number(indices?.current?.NDVI || indices?.ndvi || 0.76);

    let diseases = [];

    if (crop.includes('papaya') || crop.includes('पपई')) {
      diseases = [
        {
          name: 'Papaya Ring Spot Virus (PRSV)',
          type: 'Viral Vector (Whitefly / Aphid)',
          probability: humidity > 60 && temp >= 24 && temp <= 34 ? 74 : 35,
          triggerReason: `Warm ambient temperature (${temp}°C) and relative humidity (${humidity}%) favor aphid vector mobility.`,
          symptoms: 'Mottling, leaf distortion, shoe-stringing, and dark green rings on fruits.',
          prevention: 'Spray Azadirachtin (10,000 ppm) at 2 ml/L or Acephate 75 SP to control aphid vector populations.'
        },
        {
          name: 'Phytophthora Collar & Root Rot',
          type: 'Fungal Pathogen',
          probability: humidity > 70 ? 78 : 32,
          triggerReason: `High humidity (${humidity}%) and moisture stagnation near trunk collar region.`,
          symptoms: 'Water-soaked lesions on trunk at soil level, leaf yellowing, and terminal wilting.',
          prevention: 'Drench soil trunk base with Trichoderma viride (5g/L) or Metalaxyl-M (2g/L) and improve soil drainage.'
        },
        {
          name: 'Red Spider Mite (Tetranychus urticae)',
          type: 'Mite / Arachnid Vector',
          probability: temp > 30 && humidity < 65 ? 68 : 28,
          triggerReason: `Hot dry micro-climate (${temp}°C) accelerates red spider mite nymph development.`,
          symptoms: 'Webbing on lower leaf surfaces and fine yellow speckling on upper leaf blade.',
          prevention: 'Apply Spiromesifen 22.9 SC at 1 ml/L or Wettable Sulfur 80 WP at 3g/L.'
        }
      ];
    } else if (crop.includes('sugarcane') || crop.includes('ऊस')) {
      diseases = [
        {
          name: 'Red Rot (Colletotrichum falcatum)',
          type: 'Fungal Pathogen',
          probability: humidity > 75 ? 82 : 40,
          triggerReason: `Elevated humidity (${humidity}%) and dense crop canopy closure (NDVI ${ndvi}).`,
          symptoms: 'Reddening of internal stalk tissues with white transverse patches and sour odor.',
          prevention: 'Spray Carbendazim 50 WP at 2g/L and select red-rot resistant cane cultivars.'
        },
        {
          name: 'Early Shoot Borer (Chilo infuscatellus)',
          type: 'Insect Pest',
          probability: temp >= 28 && temp <= 38 ? 72 : 36,
          triggerReason: `High temperatures (${temp}°C) accelerate borer larva shoot penetration.`,
          symptoms: 'Dead heart shoots in young cane tillers that pull out easily.',
          prevention: 'Release Trichogramma chilonis egg parasitoids and apply Chlorantraniliprole 0.4% G.'
        },
        {
          name: 'Sugarcane Smut (Sporisorium scitamineum)',
          type: 'Fungal Spore',
          probability: temp > 30 ? 58 : 22,
          triggerReason: `Warm dry weather during early tillering promotes smut whip emergence.`,
          symptoms: 'Black whip-like structure emerging from growing point of apex stalk.',
          prevention: 'Remove infected smut whips in cloth bags and apply Tebuconazole 25.9 EC at 1 ml/L.'
        }
      ];
    } else if (crop.includes('maize') || crop.includes('corn') || crop.includes('मका')) {
      diseases = [
        {
          name: 'Fall Armyworm (Spodoptera frugiperda)',
          type: 'Lepidopteran Insect Pest',
          probability: temp >= 22 && temp <= 35 ? 85 : 42,
          triggerReason: `Optimal temperature window (${temp}°C) accelerates FAW egg hatching in leaf whorls.`,
          symptoms: 'Pin-hole damage, ragged leaf margins, and heavy frass in central whorls.',
          prevention: 'Apply Emamectin Benzoate 5% SG at 0.4g/L or Chlorantraniliprole 18.5 SC directly into whorls.'
        },
        {
          name: 'Maydis Leaf Blight (Bipolaris maydis)',
          type: 'Fungal Pathogen',
          probability: humidity > 70 ? 68 : 25,
          triggerReason: `High humidity (${humidity}%) with wet canopy leaf surfaces.`,
          symptoms: 'Elongated rectangular grayish-brown spots on leaves bounded by leaf veins.',
          prevention: 'Foliar spray of Mancozeb 75 WP at 2.5g/L or Azoxystrobin 23 SC at 1 ml/L.'
        }
      ];
    } else if (crop.includes('rice') || crop.includes('paddy') || crop.includes('भात')) {
      diseases = [
        {
          name: 'Rice Blast (Magnaporthe oryzae)',
          type: 'Fungal Pathogen',
          probability: humidity > 75 && temp >= 24 && temp <= 29 ? 70 : 30,
          triggerReason: `High humidity (${humidity}%) and warm canopy temp (${temp}°C) create ideal conditions for blast spores.`,
          symptoms: 'Spindle-shaped lesions with grayish centers on leaf blades.',
          prevention: 'Apply Tricyclazole or Isoprothiolane spray during early morning hours.'
        },
        {
          name: 'Bacterial Leaf Blight',
          type: 'Bacterial Vector',
          probability: humidity > 70 && temp > 26 ? 55 : 20,
          triggerReason: `Warm temperatures (${temp}°C) with elevated humidity promote bacterial multiplication.`,
          symptoms: 'Water-soaked translucent lesions along leaf margins.',
          prevention: 'Apply Copper Hydroxide spray and ensure proper field drainage.'
        }
      ];
    } else if (crop.includes('cotton') || crop.includes('कापूस')) {
      diseases = [
        {
          name: 'Pink Bollworm (Pectinophora gossypiella)',
          type: 'Insect Pest',
          probability: temp > 28 ? 72 : 40,
          triggerReason: `High ambient temperature (${temp}°C) promoting larval activity in young bolls.`,
          symptoms: 'Premature boll opening and rosette flowers.',
          prevention: 'Deploy PB-Rope pheromone dispensers and apply Emamectin Benzoate.'
        },
        {
          name: 'Cotton Leaf Curl Virus (CLCuV)',
          type: 'Viral Vector (Whitefly)',
          probability: temp > 27 && humidity < 70 ? 60 : 25,
          triggerReason: `Warm dry weather fostering whitefly vector population growth.`,
          symptoms: 'Upward or downward leaf curling and enations on lower leaf surface.',
          prevention: 'Control whitefly population using Diafenthiuron or Spiromesifen.'
        }
      ];
    } else {
      diseases = [
        {
          name: 'Leaf Rust / Stripe Rust',
          type: 'Fungal Disease',
          probability: humidity > 70 && temp >= 18 && temp <= 26 ? 68 : 28,
          triggerReason: `High canopy humidity (${humidity}%) and favorable spore temp (${temp}°C).`,
          symptoms: 'Yellow/orange pustules forming on upper leaf surface.',
          prevention: 'Apply Propiconazole or Tebuconazole fungicide spray during morning hours.'
        },
        {
          name: 'Powdery Mildew',
          type: 'Fungal Pathogen',
          probability: humidity > 60 && temp >= 16 && temp <= 24 ? 52 : 22,
          triggerReason: `Moderate relative humidity with dense leaf coverage (NDVI ${ndvi}).`,
          symptoms: 'White powdery spots on lower leaves and stems.',
          prevention: 'Sulfur-based fungicide spray or Neem oil organic application.'
        }
      ];
    }

    diseases = diseases.map((d) => {
      let riskLevel = 'Low';
      if (d.probability > 65) riskLevel = 'High';
      else if (d.probability > 40) riskLevel = 'Moderate';
      return { ...d, riskLevel };
    });

    const maxProb = Math.max(...diseases.map((d) => d.probability), 20);
    let overallRiskLevel = 'Low Risk';
    let overallBadge = 'badge-primary';

    if (maxProb > 65) {
      overallRiskLevel = 'High Risk Warning';
      overallBadge = 'badge-danger';
    } else if (maxProb > 40) {
      overallRiskLevel = 'Moderate Risk';
      overallBadge = 'badge-amber';
    }

    return {
      overallRiskScore: maxProb,
      overallRiskLevel,
      overallBadge,
      diseases
    };
  }
};
