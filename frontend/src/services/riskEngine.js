// Pest & Disease Risk Prediction Engine for AgriTwin Nexus (Module 10)
// Fuses micro-climate weather metrics with vegetation stress indices (NDVI/NDRE)

export const riskEngine = {
  /**
   * Evaluate farm pest and disease risks
   */
  async evaluateFarmRisks(farm, indices, weather) {
    await new Promise((resolve) => setTimeout(resolve, 350));

    const ndvi = indices?.current?.NDVI || 0.76;
    const ndre = indices?.current?.NDRE || 0.45;
    const humidity = weather?.current?.humidityPercent || 68;
    const temp = weather?.current?.tempCelsius || 27.5;

    // Disease 1: Leaf Rust / Stripe Rust (Triggers on warm humid canopy)
    let rustProbability = 25;
    if (humidity > 70 && temp >= 20 && temp <= 28) rustProbability += 45;
    if (ndre < 0.4) rustProbability += 15;
    rustProbability = Math.min(95, rustProbability);

    // Disease 2: Powdery Mildew
    let mildewProbability = 15;
    if (humidity > 65 && temp >= 18 && temp <= 25) mildewProbability += 50;
    mildewProbability = Math.min(92, mildewProbability);

    // Disease 3: Fusarium Blight
    let blightProbability = 10;
    if (humidity > 80) blightProbability += 40;

    // Pest 1: Aphid / Stem Borer Infestation
    let aphidProbability = 35;
    if (temp > 25 && humidity < 75) aphidProbability += 30;

    const overallRiskScore = Math.max(rustProbability, mildewProbability, aphidProbability);

    let overallRiskLevel = 'Low Risk';
    let overallBadge = 'badge-primary';
    if (overallRiskScore > 70) {
      overallRiskLevel = 'High Risk Warning';
      overallBadge = 'badge-danger';
    } else if (overallRiskScore > 45) {
      overallRiskLevel = 'Moderate Vigilance Required';
      overallBadge = 'badge-amber';
    }

    return {
      overallRiskScore,
      overallRiskLevel,
      overallBadge,
      diseases: [
        {
          name: 'Leaf Rust / Stripe Rust',
          type: 'Fungal Disease',
          probability: rustProbability,
          riskLevel: rustProbability > 65 ? 'High' : rustProbability > 40 ? 'Moderate' : 'Low',
          triggerReason: 'High canopy humidity (68%) and favorable spore temp (27.5°C).',
          symptoms: 'Yellow/orange pustules forming on upper leaf surface.',
          prevention: 'Apply Propiconazole or Tebuconazole fungicide spray during morning hours.'
        },
        {
          name: 'Powdery Mildew',
          type: 'Fungal Pathogen',
          probability: mildewProbability,
          riskLevel: mildewProbability > 65 ? 'High' : mildewProbability > 40 ? 'Moderate' : 'Low',
          triggerReason: 'Moderate relative humidity with dense leaf coverage.',
          symptoms: 'White powdery spots on lower leaves and stems.',
          prevention: 'Sulfur-based fungicide spray or Neem oil organic application.'
        },
        {
          name: 'Fusarium Head Blight',
          type: 'Fungal Spore',
          probability: blightProbability,
          riskLevel: blightProbability > 65 ? 'High' : blightProbability > 40 ? 'Moderate' : 'Low',
          triggerReason: 'Requires high wetness (>85% humidity). Currently safe.',
          symptoms: 'Bleached spikelets on crop heads.',
          prevention: 'Maintain crop rotation and apply foliar spray if humidity exceeds 80%.'
        },
        {
          name: 'Aphid & Stem Borer Infestation',
          type: 'Insect Pest',
          probability: aphidProbability,
          riskLevel: aphidProbability > 65 ? 'High' : aphidProbability > 40 ? 'Moderate' : 'Low',
          triggerReason: 'Favorable warm temperatures (27.5°C) promoting aphid reproduction.',
          symptoms: 'Curled leaves, sticky honeydew deposits on stems.',
          prevention: 'Deploy Imidacloprid or yellow sticky traps in high-density zones.'
        }
      ]
    };
  }
};
