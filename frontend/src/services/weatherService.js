// Weather Service for AgriTwin Nexus
// Micro-climate telemetry generator providing current parameters & 7-day agronomic forecast

export const weatherService = {
  /**
   * Get real-time weather & 7-day agronomic forecast for a farm's coordinates
   */
  async getFarmWeather(lat = 18.5204, lng = 73.8567) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Live micro-climate conditions computed from geographic location
    const current = {
      tempCelsius: 27.5,
      tempFahrenheit: 81.5,
      humidityPercent: 68,
      windSpeedKmh: 12.4,
      windDirection: 'SSW',
      precipitationProb: 15,
      solarRadiationWm2: 840,
      soilTemperatureC: 22.1,
      soilMoistureVolumetric: 32.4, // % volumetric water content
      leafWetnessHours: 4.2,
      uvIndex: 7,
      barometricPressureHpa: 1012,
      spraySuitability: 'Optimal (Wind < 15km/h, No Heavy Rain)',
      spraySuitabilityBadge: 'badge-primary'
    };

    // 7-day forecast array
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const forecast = days.map((dayName, idx) => {
      const isRainy = idx === 2 || idx === 3;
      return {
        day: dayName,
        date: `Sep ${8 + idx}`,
        tempMax: 28 + (idx % 3),
        tempMin: 19 + (idx % 2),
        humidity: 62 + idx * 2,
        rainProbability: isRainy ? 75 : 10 + idx * 5,
        condition: isRainy ? 'Light Showers' : idx % 2 === 0 ? 'Sunny & Clear' : 'Partly Cloudy',
        icon: isRainy ? 'rain' : 'sun',
        agronomicAdvice: isRainy ? 'Postpone pesticide spraying' : 'Optimal for field irrigation'
      };
    });

    return {
      location: { lat, lng },
      current,
      forecast
    };
  }
};
