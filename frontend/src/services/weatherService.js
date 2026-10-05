// Weather Service for AgriTwin Nexus
// Generates realistic, coordinate-specific micro-climate data & 7-day agronomic forecast

export const weatherService = {
  /**
   * Get dynamic real-time weather & 7-day agronomic forecast for a farm's latitude & longitude
   */
  async getFarmWeather(lat = 18.5204, lng = 73.8567) {
    await new Promise((resolve) => setTimeout(resolve, 250));

    const numLat = Number(lat) || 18.5204;
    const numLng = Number(lng) || 73.8567;

    // Seed-based dynamic variance calculated from farm coordinates
    const latOffset = (Math.abs(numLat * 100) % 7) - 3.5;
    const lngOffset = (Math.abs(numLng * 100) % 5) - 2.5;

    const tempCelsius = Math.round((27.5 + latOffset) * 10) / 10;
    const tempFahrenheit = Math.round((tempCelsius * 1.8 + 32) * 10) / 10;
    const humidityPercent = Math.min(95, Math.max(35, Math.round(65 + lngOffset * 3)));
    const windSpeedKmh = Math.round((11.5 + Math.abs(latOffset) * 0.8) * 10) / 10;

    const windDirections = ['N', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'NW'];
    const dirIdx = Math.floor(Math.abs(numLat + numLng) * 10) % windDirections.length;
    const windDirection = windDirections[dirIdx];

    const soilTemperatureC = Math.round((tempCelsius - 3.2) * 10) / 10;
    const soilMoistureVolumetric = Math.min(48, Math.max(18, Math.round(32.4 + latOffset * 1.5)));
    const leafWetnessHours = Math.round((3.5 + Math.abs(lngOffset) * 0.4) * 10) / 10;
    const solarRadiationWm2 = Math.round(780 + latOffset * 25);

    // Delta-T Spray Suitability Window Index Calculation
    let spraySuitability = 'Optimal Window (Wind < 15 km/h, No Heavy Rain)';
    let isOptimalSpray = true;

    if (windSpeedKmh > 18) {
      spraySuitability = 'Postpone Spraying (High Wind Speed > 18 km/h)';
      isOptimalSpray = false;
    } else if (humidityPercent < 40) {
      spraySuitability = 'Caution (Low Humidity - High Droplet Evaporation Risk)';
      isOptimalSpray = false;
    }

    // Generate 7-Day Forecast starting from today's real date
    const today = new Date();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const forecast = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);

      const dayName = dayNames[d.getDay()];
      const dateStr = `${monthNames[d.getMonth()]} ${d.getDate()}`;

      const dayTempMax = Math.round((tempCelsius + (i % 3) - 1) * 10) / 10;
      const dayTempMin = Math.round((tempCelsius - 8 + (i % 2)) * 10) / 10;
      const rainProb = Math.round(((Math.abs(numLat * 10 + i * 7) % 65) + 5));

      const isRainy = rainProb >= 60;
      const advice = isRainy
        ? 'Postpone pesticide spraying due to high rain risk'
        : windSpeedKmh > 15
        ? 'Irrigation recommended; avoid aerial spraying'
        : 'Optimal window for field spraying & irrigation';

      forecast.push({
        day: i === 0 ? 'Today' : dayName,
        date: dateStr,
        tempMax: dayTempMax,
        tempMin: dayTempMin,
        humidity: Math.min(92, Math.max(40, humidityPercent + (i % 4) * 3 - 4)),
        rainProbability: rainProb,
        condition: isRainy ? 'Heavy Showers' : rainProb > 30 ? 'Partly Cloudy' : 'Sunny & Clear',
        icon: isRainy ? 'rain' : 'sun',
        agronomicAdvice: advice
      });
    }

    return {
      location: { lat: numLat, lng: numLng },
      current: {
        tempCelsius,
        tempFahrenheit,
        soilTemperatureC,
        humidityPercent,
        leafWetnessHours,
        windSpeedKmh,
        windDirection,
        soilMoistureVolumetric,
        solarRadiationWm2,
        spraySuitability,
        isOptimalSpray
      },
      forecast
    };
  }
};
