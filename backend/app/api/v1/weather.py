from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from app.services.weather_service import WeatherService

router = APIRouter(prefix="/weather", tags=["Real-Time Weather"])


@router.get("")
def get_weather_by_coordinates(
    lat: float = Query(..., description="Latitude of the location"),
    lon: float = Query(..., description="Longitude of the location"),
):
    """
    Fetch real-time current conditions + 7-day agronomic forecast.
    Powered by Open-Meteo (free, no API key) with OpenWeatherMap fallback.
    """
    if not (-90 <= lat <= 90) or not (-180 <= lon <= 180):
        raise HTTPException(status_code=400, detail="Invalid latitude or longitude.")

    data = WeatherService.get_current_and_forecast(lat, lon)
    if data.get("status") == "weather_unavailable":
        raise HTTPException(status_code=503, detail=data.get("message"))
    return data
