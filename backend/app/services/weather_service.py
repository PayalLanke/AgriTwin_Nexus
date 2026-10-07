# Real Weather API Service for AgriTwin Nexus
# Fetches real-time, coordinate-specific meteorological observations via Open-Meteo REST API or OpenWeatherMap API

import os
import requests
from datetime import datetime

WEATHER_API_KEY = os.getenv("WEATHER_API_KEY", "")

class WeatherService:
    @staticmethod
    def get_weather_for_coordinates(lat: float, lon: float):
        """
        Fetch real meteorological observations for exact farm centroid (lat, lon).
        Tied directly to geographic location (never derived from crop type).
        """
        # 1. OpenWeatherMap API if WEATHER_API_KEY configured
        if WEATHER_API_KEY and len(WEATHER_API_KEY) > 10:
            try:
                url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={WEATHER_API_KEY}&units=metric"
                res = requests.get(url, timeout=5)
                if res.status_code == 200:
                    data = res.json()
                    main = data.get("main", {})
                    wind = data.get("wind", {})
                    weather = data.get("weather", [{}])[0]
                    rain = data.get("rain", {}).get("1h", 0.0)

                    return {
                        "status": "available",
                        "latitude": lat,
                        "longitude": lon,
                        "temperature_c": round(main.get("temp", 28.0), 1),
                        "feels_like_c": round(main.get("feels_like", 29.0), 1),
                        "humidity_percent": main.get("humidity", 65),
                        "pressure_hpa": main.get("pressure", 1012),
                        "wind_speed_kmh": round(wind.get("speed", 3.2) * 3.6, 1),
                        "rainfall_mm": round(rain, 1),
                        "condition": weather.get("description", "Clear Sky").title(),
                        "weather_icon": weather.get("icon", "01d"),
                        "data_source": "OpenWeatherMap Live API",
                        "last_updated": datetime.utcnow().strftime("%d %b %Y, %H:%M UTC")
                    }
            except Exception as e:
                print("OpenWeatherMap fetch notice:", e)

        # 2. Open-Meteo High-Precision Global Meteorological API (No API key required)
        try:
            url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,surface_pressure,wind_speed_10m,weather_code"
            res = requests.get(url, timeout=6)
            if res.status_code == 200:
                data = res.json()
                current = data.get("current", {})

                weather_code = current.get("weather_code", 0)
                condition = WeatherService._translate_wmo_code(weather_code)

                return {
                    "status": "available",
                    "latitude": lat,
                    "longitude": lon,
                    "temperature_c": round(current.get("temperature_2m", 28.4), 1),
                    "feels_like_c": round(current.get("apparent_temperature", 29.1), 1),
                    "humidity_percent": int(current.get("relative_humidity_2m", 62)),
                    "pressure_hpa": round(current.get("surface_pressure", 1011.5), 1),
                    "wind_speed_kmh": round(current.get("wind_speed_10m", 12.0), 1),
                    "rainfall_mm": round(current.get("precipitation", 0.0), 1),
                    "condition": condition,
                    "data_source": "Open-Meteo Real Meteorological Engine",
                    "last_updated": datetime.utcnow().strftime("%d %b %Y, %H:%M UTC")
                }
        except Exception as e:
            print("Open-Meteo fetch notice:", e)

        # Honest failure return if both APIs unreachable
        return {
            "status": "weather_unavailable",
            "message": "Weather data currently unavailable for these coordinates.",
            "latitude": lat,
            "longitude": lon,
            "data_source": "None"
        }

    @staticmethod
    def _translate_wmo_code(code: int) -> str:
        wmo_map = {
            0: "Clear Sky",
            1: "Mainly Clear",
            2: "Partly Cloudy",
            3: "Overcast",
            45: "Foggy",
            48: "Depositing Rime Fog",
            51: "Light Drizzle",
            53: "Moderate Drizzle",
            55: "Dense Drizzle",
            61: "Slight Rain",
            63: "Moderate Rain",
            65: "Heavy Rain",
            80: "Slight Rain Showers",
            81: "Moderate Rain Showers",
            82: "Violent Rain Showers",
            95: "Thunderstorm"
        }
        return wmo_map.get(code, "Partly Cloudy")

weather_service = WeatherService()
