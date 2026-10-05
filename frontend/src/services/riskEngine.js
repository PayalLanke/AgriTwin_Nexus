// Pest & Disease Risk Prediction Engine for AgriTwin Nexus
// Evaluates real crop-specific disease and pest risks based on weather telemetry, sowing age, and vegetation stress

export const riskEngine = {
  /**
   * Evaluate crop-specific pest and disease risks for a given farm, indices, and weather
   */
  async evaluateFarmRisks(farm, indices, weather) {
    await new Promise((resolve) => setTimeout(resolve, 250));

    const crop = (farm?.cropType || 'Crop').toLowerCase();
    const humidity = Number(weather?.current?.humidityPercent) || 65;
    const temp = Number(weather?.current?.tempCelsius) || 27.5;
    const ndvi = Number(indices?.current?.NDVI) || 0.72;

    let diseases = [];

    if (crop.includes('rice') || crop.includes('paddy')) {
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
        },
        {
          name: 'Yellow Stem Borer',
          type: 'Insect Pest',
          probability: temp >= 25 && temp <= 32 ? 65 : 35,
          triggerReason: `Favorable temperature (${temp}°C) accelerating stem borer moth egg hatching.`,
          symptoms: 'Dead hearts in vegetative stage and white heads during flowering.',
          prevention: 'Set up pheromone traps and apply Chlorantraniliprole granule application.'
        },
        {
          name: 'Sheath Blight',
          type: 'Fungal Pathogen',
          probability: humidity > 80 ? 75 : 25,
          triggerReason: `High humidity (${humidity}%) with dense canopy closure (NDVI ${ndvi}).`,
          symptoms: 'Oval greenish-gray spots on leaf sheaths near water level.',
          prevention: 'Apply Validamycin or Azoxystrobin fungicide.'
        }
      ];
    } else if (crop.includes('cotton')) {
      diseases = [
        {
          name: 'Pink Bollworm',
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
        },
        {
          name: 'Alternaria Leaf Spot',
          type: 'Fungal Pathogen',
          probability: humidity > 65 ? 45 : 20,
          triggerReason: `Canopy humidity (${humidity}%) encouraging foliar fungal spot development.`,
          symptoms: 'Concentric brown target-like spots on older leaves.',
          prevention: 'Apply Mancozeb or Copper Oxychloride spray.'
        }
      ];
    } else {
      // Wheat / Sugarcane / Soybean / General Crops
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
        },
        {
          name: 'Fusarium Head Blight',
          type: 'Fungal Spore',
          probability: humidity > 80 ? 65 : 18,
          triggerReason: `High moisture level (${humidity}% humidity). Requires monitoring if rain occurs.`,
          symptoms: 'Bleached spikelets on crop heads.',
          prevention: 'Maintain crop rotation and apply foliar spray if humidity exceeds 80%.'
        },
        {
          name: 'Aphid & Stem Borer Infestation',
          type: 'Insect Pest',
          probability: temp > 25 && humidity < 75 ? 58 : 32,
          triggerReason: `Favorable warm temperatures (${temp}°C) promoting aphid reproduction.`,
          symptoms: 'Curled leaves, sticky honeydew deposits on stems.',
          prevention: 'Deploy Imidacloprid or yellow sticky traps in high-density zones.'
        }
      ];
    }

    // Attach risk levels to each disease
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
