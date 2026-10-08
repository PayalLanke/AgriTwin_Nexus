# Real-Time Weather Service for AgriTwin Nexus
# Primary:  Open-Meteo (free, no API key, WMO standard, 1 km resolution)
# Fallback: OpenWeatherMap (needs WEATHER_API_KEY in .env)

import os
import requests
from datetime import datetime

WEATHER_API_KEY = os.getenv("WEATHER_API_KEY", "")

WMO_CODE_MAP = {
    0:  ("Clear Sky",             "sun"),
    1:  ("Mainly Clear",          "sun"),
    2:  ("Partly Cloudy",         "cloudy"),
    3:  ("Overcast",              "cloudy"),
    45: ("Foggy",                 "fog"),
    48: ("Rime Fog",              "fog"),
    51: ("Light Drizzle",         "drizzle"),
    53: ("Moderate Drizzle",      "drizzle"),
    55: ("Dense Drizzle",         "drizzle"),
    61: ("Slight Rain",           "rain"),
    63: ("Moderate Rain",         "rain"),
    65: ("Heavy Rain",            "rain"),
    71: ("Slight Snow",           "snow"),
    73: ("Moderate Snow",         "snow"),
    75: ("Heavy Snow",            "snow"),
    80: ("Slight Showers",        "rain"),
    81: ("Moderate Showers",      "rain"),
    82: ("Violent Showers",       "storm"),
    95: ("Thunderstorm",          "storm"),
    96: ("Thunderstorm w/ Hail",  "storm"),
    99: ("Heavy Thunderstorm",    "storm"),
}


def _wmo(code: int):
    entry = WMO_CODE_MAP.get(code, ("Partly Cloudy", "⛅"))
    return entry[0], entry[1]


def _spray_window(wind_kmh: float, humidity: int, precip_mm: float):
    if precip_mm > 1.0:
        return "Avoid Spraying (Active Rainfall)", False
    if wind_kmh > 18:
        return "Postpone Spraying (High Wind Speed > 18 km/h)", False
    if humidity < 40:
        return "Caution — Low Humidity (High Droplet Evaporation Risk)", False
    return "Optimal Window (Wind < 18 km/h, No Rain)", True


class WeatherService:

    @staticmethod
    def get_current_and_forecast(lat: float, lon: float) -> dict:
        """
        Fetch REAL current conditions + 7-day daily forecast for exact farm
        coordinates using Open-Meteo (primary, free) or OpenWeatherMap (fallback).
        """
        result = WeatherService._fetch_open_meteo(lat, lon)
        if result:
            return result

        # Fallback: OpenWeatherMap for current; generate simple forecast
        if WEATHER_API_KEY and len(WEATHER_API_KEY) > 10:
            result = WeatherService._fetch_openweathermap(lat, lon)
            if result:
                return result

        return {
            "status": "weather_unavailable",
            "message": "Weather data currently unavailable. Check internet connectivity.",
            "latitude": lat,
            "longitude": lon,
            "data_source": "None",
        }

    # ------------------------------------------------------------------ #
    #  Open-Meteo — free, no API key, 1 km global resolution              #
    # ------------------------------------------------------------------ #
    @staticmethod
    def _fetch_open_meteo(lat: float, lon: float) -> dict | None:
        try:
            current_vars = ",".join([
                "temperature_2m",
                "apparent_temperature",
                "relative_humidity_2m",
                "precipitation",
                "surface_pressure",
                "wind_speed_10m",
                "wind_direction_10m",
                "weather_code",
                "soil_temperature_0cm",
                "soil_moisture_0_to_1cm",
                "shortwave_radiation",
            ])
            daily_vars = ",".join([
                "weather_code",
                "temperature_2m_max",
                "temperature_2m_min",
                "precipitation_sum",
                "precipitation_probability_max",
                "wind_speed_10m_max",
            ])
            url = (
                f"https://api.open-meteo.com/v1/forecast"
                f"?latitude={lat}&longitude={lon}"
                f"&current={current_vars}"
                f"&daily={daily_vars}"
                f"&forecast_days=7"
                f"&timezone=auto"
            )
            res = requests.get(url, timeout=8)
            if res.status_code != 200:
                return None

            data = res.json()
            cur  = data.get("current", {})
            daily = data.get("daily", {})

            wmo_code   = cur.get("weather_code", 0)
            condition, icon_emoji = _wmo(wmo_code)
            wind_kmh   = round(cur.get("wind_speed_10m", 0), 1)
            humidity   = int(cur.get("relative_humidity_2m", 60))
            precip_mm  = round(cur.get("precipitation", 0.0), 1)
            spray_msg, spray_ok = _spray_window(wind_kmh, humidity, precip_mm)

            # Wind direction compass
            wind_deg   = cur.get("wind_direction_10m", 0) or 0
            compass    = ["N","NNE","NE","ENE","E","ESE","SE","SSE",
                          "S","SSW","SW","WSW","W","WNW","NW","NNW"]
            wind_dir   = compass[round(wind_deg / 22.5) % 16]

            # Build 7-day forecast array
            forecast_days = []
            dates     = daily.get("time", [])
            wmo_codes = daily.get("weather_code", [])
            temp_max  = daily.get("temperature_2m_max", [])
            temp_min  = daily.get("temperature_2m_min", [])
            rain_sum  = daily.get("precipitation_sum", [])
            rain_prob = daily.get("precipitation_probability_max", [])
            wind_max  = daily.get("wind_speed_10m_max", [])

            day_names  = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]
            month_names = ["Jan","Feb","Mar","Apr","May","Jun",
                           "Jul","Aug","Sep","Oct","Nov","Dec"]

            for i, date_str in enumerate(dates):
                try:
                    d = datetime.strptime(date_str, "%Y-%m-%d")
                    label = "Today" if i == 0 else day_names[d.weekday()]
                    fmt_date = f"{month_names[d.month-1]} {d.day}"
                    c, emoji = _wmo(wmo_codes[i] if i < len(wmo_codes) else 0)
                    rp = rain_prob[i] if i < len(rain_prob) else 20
                    wmax = wind_max[i] if i < len(wind_max) else 10
                    rs = rain_sum[i] if i < len(rain_sum) else 0

                    if rs > 1.0 or (rp or 0) > 70:
                        advice = "Postpone pesticide spraying due to high rain risk"
                        icon_k = "rain"
                    elif wmax > 15:
                        advice = "Irrigation recommended; avoid aerial spraying"
                        icon_k = "cloudy"
                    else:
                        advice = "Optimal window for field spraying & irrigation"
                        icon_k = "sun"

                    forecast_days.append({
                        "day":           label,
                        "date":          fmt_date,
                        "tempMax":       round(temp_max[i], 1) if i < len(temp_max) else None,
                        "tempMin":       round(temp_min[i], 1) if i < len(temp_min) else None,
                        "humidity":      None,
                        "rainProbability": int(rp or 0),
                        "rainfallMm":    round(rs, 1),
                        "windMaxKmh":    round(wmax, 1),
                        "condition":     c,
                        "icon":          icon_k,
                        "emoji":         emoji,
                        "agronomicAdvice": advice,
                    })
                except Exception:
                    continue

            return {
                "status":            "available",
                "latitude":          lat,
                "longitude":         lon,
                "data_source":       "Open-Meteo (WMO standard, 1 km resolution)",
                "last_updated":      datetime.utcnow().strftime("%d %b %Y, %H:%M UTC"),
                "current": {
                    "temperature_c":         round(cur.get("temperature_2m", 28), 1),
                    "feels_like_c":          round(cur.get("apparent_temperature", 29), 1),
                    "humidity_percent":      humidity,
                    "pressure_hpa":          round(cur.get("surface_pressure", 1013), 1),
                    "wind_speed_kmh":        wind_kmh,
                    "wind_direction":        wind_dir,
                    "rainfall_mm":           precip_mm,
                    "condition":             condition,
                    "icon_emoji":            icon_emoji,
                    "soil_temperature_c":    round(cur.get("soil_temperature_0cm", 25), 1),
                    "soil_moisture_m3":      round(cur.get("soil_moisture_0_to_1cm", 0.25), 3),
                    "solar_radiation_wm2":   round(cur.get("shortwave_radiation", 600), 1),
                    "spray_suitability":     spray_msg,
                    "is_optimal_spray":      spray_ok,
                },
                "forecast": forecast_days,
            }

        except Exception as e:
            print("Open-Meteo fetch error:", e)
            return None

    # ------------------------------------------------------------------ #
    #  OpenWeatherMap fallback (current only, no forecast on free tier)   #
    # ------------------------------------------------------------------ #
    @staticmethod
    def _fetch_openweathermap(lat: float, lon: float) -> dict | None:
        try:
            url = (
                f"https://api.openweathermap.org/data/2.5/weather"
                f"?lat={lat}&lon={lon}&appid={WEATHER_API_KEY}&units=metric"
            )
            res = requests.get(url, timeout=6)
            if res.status_code != 200:
                return None

            data    = res.json()
            main    = data.get("main", {})
            wind    = data.get("wind", {})
            weather = data.get("weather", [{}])[0]
            rain    = data.get("rain", {}).get("1h", 0.0)
            wind_kmh = round(wind.get("speed", 0) * 3.6, 1)
            humidity = main.get("humidity", 60)
            spray_msg, spray_ok = _spray_window(wind_kmh, humidity, rain)

            return {
                "status":      "available",
                "latitude":    lat,
                "longitude":   lon,
                "data_source": "OpenWeatherMap Live API",
                "last_updated": datetime.utcnow().strftime("%d %b %Y, %H:%M UTC"),
                "current": {
                    "temperature_c":      round(main.get("temp", 28), 1),
                    "feels_like_c":       round(main.get("feels_like", 29), 1),
                    "humidity_percent":   humidity,
                    "pressure_hpa":       main.get("pressure", 1013),
                    "wind_speed_kmh":     wind_kmh,
                    "wind_direction":     "N/A",
                    "rainfall_mm":        round(rain, 1),
                    "condition":          weather.get("description", "Clear").title(),
                    "icon_emoji":         "🌤️",
                    "soil_temperature_c": None,
                    "soil_moisture_m3":   None,
                    "solar_radiation_wm2": None,
                    "spray_suitability":  spray_msg,
                    "is_optimal_spray":   spray_ok,
                },
                "forecast": [],
            }
        except Exception as e:
            print("OpenWeatherMap fetch error:", e)
            return None

    # Legacy compatibility wrapper used by farms.py
    @staticmethod
    def get_weather_for_coordinates(lat: float, lon: float) -> dict:
        full = WeatherService.get_current_and_forecast(lat, lon)
        cur  = full.get("current", {})
        return {
            "status":          full.get("status"),
            "latitude":        lat,
            "longitude":       lon,
            "temperature_c":   cur.get("temperature_c"),
            "feels_like_c":    cur.get("feels_like_c"),
            "humidity_percent": cur.get("humidity_percent"),
            "pressure_hpa":    cur.get("pressure_hpa"),
            "wind_speed_kmh":  cur.get("wind_speed_kmh"),
            "rainfall_mm":     cur.get("rainfall_mm"),
            "condition":       cur.get("condition"),
            "data_source":     full.get("data_source"),
            "last_updated":    full.get("last_updated"),
        }


weather_service = WeatherService()
