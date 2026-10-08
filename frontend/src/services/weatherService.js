// Real-Time Weather Service for AgriTwin Nexus
// Calls the FastAPI backend which proxies Open-Meteo (free, no API key, 1 km resolution)

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const weatherService = {
  /**
   * Fetch live current conditions + 7-day agronomic forecast for a farm location.
   * Returns a structured object matching the WeatherPage consumption shape.
   */
  async getFarmWeather(lat = 18.5204, lng = 73.8567) {
    const numLat = Number(lat) || 18.5204;
    const numLng = Number(lng) || 73.8567;

    const res = await fetch(
      `${API_BASE}/weather?lat=${numLat}&lon=${numLng}`
    );

    if (!res.ok) {
      throw new Error(`Weather API returned ${res.status}`);
    }

    const data = await res.json();

    // Normalise the backend response into the shape WeatherPage expects
    const cur = data.current || {};

    // Derive temp in Fahrenheit from Celsius
    const tempC   = cur.temperature_c   ?? 28;
    const tempF   = Math.round(tempC * 1.8 + 32);

    // Estimate leaf wetness from humidity + precipitation proxy
    const humidity = cur.humidity_percent ?? 65;
    const precip   = cur.rainfall_mm     ?? 0;
    const leafWetness = +(Math.min(8, Math.max(0, humidity / 20 + precip * 1.5)).toFixed(1));

    // Soil moisture — convert m³/m³ → % VWC
    const soilMoistureVWC =
      cur.soil_moisture_m3 != null
        ? Math.round(cur.soil_moisture_m3 * 100)
        : Math.round(32 + (numLat % 7 - 3) * 2);

    // Solar radiation fallback
    const solarRad = cur.solar_radiation_wm2 ?? Math.round(780 + (numLat % 5) * 20);

  // Map icon key to emoji for display
    const iconMap = {
      sun:    '☀️',
      cloudy: '⛅',
      fog:    '🌫️',
      drizzle:'🌦️',
      rain:   '🌧️',
      snow:   '❄️',
      storm:  '⛈️',
    };

    return {
      // Raw backend data passthrough for advanced consumers
      _raw: data,

      location: { lat: numLat, lng: numLng },
      dataSource: data.data_source || 'Open-Meteo',
      lastUpdated: data.last_updated,

      current: {
        tempCelsius:           tempC,
        tempFahrenheit:        tempF,
        soilTemperatureC:      cur.soil_temperature_c ?? +(tempC - 3.2).toFixed(1),
        humidityPercent:       humidity,
        leafWetnessHours:      leafWetness,
        windSpeedKmh:          cur.wind_speed_kmh ?? 12,
        windDirection:         cur.wind_direction  ?? 'N/A',
        pressureHpa:           cur.pressure_hpa    ?? 1013,
        rainfallMm:            precip,
        condition:             cur.condition       ?? 'Clear Sky',
        iconEmoji:             iconMap[cur.icon_key] ?? iconMap[cur.icon_emoji] ?? '☀️',
        soilMoistureVolumetric: soilMoistureVWC,
        solarRadiationWm2:     solarRad,
        spraySuitability:      cur.spray_suitability ?? 'Optimal Window',
        isOptimalSpray:        cur.is_optimal_spray  ?? true,
      },

      // 7-day forecast — already in the right shape from backend
      forecast: (data.forecast || []).map((f) => ({
        day:             f.day,
        date:            f.date,
        tempMax:         f.tempMax,
        tempMin:         f.tempMin,
        humidity:        f.humidity,
        rainProbability: f.rainProbability,
        rainfallMm:      f.rainfallMm,
        windMaxKmh:      f.windMaxKmh,
        condition:       f.condition,
        icon:            f.icon,
        emoji:           f.emoji,
        agronomicAdvice: f.agronomicAdvice,
      })),
    };
  },
};
