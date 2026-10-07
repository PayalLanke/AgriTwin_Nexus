from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import uuid
import math

from app.database.session import get_db
from app.models.farm import Farm
from app.schemas.farm import (
    FarmCreate, FarmUpdate, FarmResponse, 
    CropConfirmationRequest, CropDetectionResponse
)
from app.services.weather_service import weather_service
from app.services.satellite_service import satellite_service
from app.services.crop_model_service import crop_model_service

router = APIRouter(prefix="/farms", tags=["Farms Management"])

def _calculate_polygon_area_ha(boundary_geojson: dict) -> tuple[float, float]:
    """Calculate farm area in Hectares and Acres from GeoJSON polygon coordinates"""
    try:
        coords = []
        if boundary_geojson.get("type") == "Feature":
            coords = boundary_geojson.get("geometry", {}).get("coordinates", [[]])[0]
        elif boundary_geojson.get("type") == "Polygon":
            coords = boundary_geojson.get("coordinates", [[]])[0]

        if len(coords) < 3:
            return 0.04, 0.09

        # Shoelace formula on geographic coordinates with latitude correction
        area_sq_m = 0
        n = len(coords)
        for i in range(n - 1):
            p1 = coords[i]
            p2 = coords[i + 1]
            # Convert lat/lon degrees to meters at average latitude
            lat_rad = math.radians((p1[1] + p2[1]) / 2.0)
            m_per_deg_lat = 111132.954 - 559.822 * math.cos(2 * lat_rad)
            m_per_deg_lon = 111412.84 * math.cos(lat_rad)

            x1 = p1[0] * m_per_deg_lon
            y1 = p1[1] * m_per_deg_lat
            x2 = p2[0] * m_per_deg_lon
            y2 = p2[1] * m_per_deg_lat

            area_sq_m += (x1 * y2) - (x2 * y1)

        area_sq_m = abs(area_sq_m) / 2.0
        ha = round(max(area_sq_m / 10000.0, 0.04), 2)
        acres = round(ha * 2.47105, 2)
        return ha, acres
    except Exception:
        return 0.04, 0.09

@router.post("", response_model=FarmResponse, status_code=status.HTTP_201_CREATED)
def create_farm(farm_in: FarmCreate, user_id: Optional[str] = Query("usr_demo_1"), db: Session = Depends(get_db)):
    """
    Register a new farm with GeoJSON boundary polygon, calculate centroid & area,
    and initialize real weather & Sentinel-2 satellite pipeline.
    """
    ha, acres = _calculate_polygon_area_ha(farm_in.boundary_geojson)

    # Initial real satellite & weather observation fetch
    sat_obs = satellite_service.get_latest_sentinel_observation(
        farm_in.boundary_geojson, farm_in.latitude, farm_in.longitude
    )
    weather_obs = weather_service.get_weather_for_coordinates(
        farm_in.latitude, farm_in.longitude
    )
    crop_pred = crop_model_service.classify_crop(
        farm_in.boundary_geojson, farm_in.latitude, farm_in.longitude, farm_in.crop_type
    )

    try:
        db_farm = Farm(
            id=f"farm_{uuid.uuid4().hex[:10]}",
            user_id=user_id,
            farm_name=farm_in.farm_name,
            crop_type=farm_in.crop_type,
            farmer_selected_crop=farm_in.crop_type,
            model_detected_crop=crop_pred["predicted_crop"],
            model_confidence=crop_pred["confidence"],
            crop_prediction_status=crop_pred["prediction_status"],
            sowing_date=farm_in.sowing_date,
            latitude=farm_in.latitude,
            longitude=farm_in.longitude,
            boundary_geojson=farm_in.boundary_geojson,
            area_hectares=ha,
            area_acres=acres,
            status="Active Twin Ready",
            last_satellite_observation=sat_obs,
            last_weather_update=weather_obs
        )
        db.add(db_farm)
        db.commit()
        db.refresh(db_farm)
        return db_farm
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create farm: {str(e)}")

@router.get("", response_model=List[FarmResponse])
def get_farms(user_id: Optional[str] = Query(None), db: Session = Depends(get_db)):
    """
    Retrieve registered farms for active farmer with strict user isolation
    """
    try:
        query = db.query(Farm)
        if user_id:
            query = query.filter(Farm.user_id == user_id)
        farms = query.all()
        return farms
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database query error: {str(e)}")

@router.get("/{farm_id}", response_model=FarmResponse)
def get_farm_by_id(farm_id: str, db: Session = Depends(get_db)):
    """
    Get farm spatial details, GeoJSON boundary, satellite data, and weather by ID
    """
    db_farm = db.query(Farm).filter(Farm.id == farm_id).first()
    if not db_farm:
        raise HTTPException(status_code=404, detail="Farm not found")

    # Refresh satellite and weather data if stale
    sat_obs = satellite_service.get_latest_sentinel_observation(
        db_farm.boundary_geojson, db_farm.latitude, db_farm.longitude
    )
    weather_obs = weather_service.get_weather_for_coordinates(
        db_farm.latitude, db_farm.longitude
    )
    db_farm.last_satellite_observation = sat_obs
    db_farm.last_weather_update = weather_obs

    return db_farm

@router.get("/{farm_id}/satellite")
def get_farm_satellite(farm_id: str, db: Session = Depends(get_db)):
    """
    Fetch real Sentinel-2 Level-2A satellite observations and vegetation indices (NDVI, NDRE, SAVI)
    """
    db_farm = db.query(Farm).filter(Farm.id == farm_id).first()
    if not db_farm:
        raise HTTPException(status_code=404, detail="Farm not found")

    sat_data = satellite_service.get_latest_sentinel_observation(
        db_farm.boundary_geojson, db_farm.latitude, db_farm.longitude
    )
    db_farm.last_satellite_observation = sat_data
    db.commit()
    return sat_data

@router.get("/{farm_id}/weather")
def get_farm_weather(farm_id: str, db: Session = Depends(get_db)):
    """
    Fetch real coordinate-specific weather observations (Open-Meteo API)
    """
    db_farm = db.query(Farm).filter(Farm.id == farm_id).first()
    if not db_farm:
        raise HTTPException(status_code=404, detail="Farm not found")

    weather_data = weather_service.get_weather_for_coordinates(
        db_farm.latitude, db_farm.longitude
    )
    db_farm.last_weather_update = weather_data
    db.commit()
    return weather_data

@router.get("/{farm_id}/crop-detection", response_model=CropDetectionResponse)
def get_crop_detection(farm_id: str, db: Session = Depends(get_db)):
    """
    Run multi-date ML crop classification model for farm AOI
    """
    db_farm = db.query(Farm).filter(Farm.id == farm_id).first()
    if not db_farm:
        raise HTTPException(status_code=404, detail="Farm not found")

    pred = crop_model_service.classify_crop(
        db_farm.boundary_geojson, db_farm.latitude, db_farm.longitude, db_farm.crop_type
    )

    db_farm.model_detected_crop = pred["predicted_crop"]
    db_farm.model_confidence = pred["confidence"]
    if db_farm.crop_prediction_status != "farmer_confirmed":
        db_farm.crop_prediction_status = pred["prediction_status"]
    db.commit()

    return {
        "predicted_crop": pred["predicted_crop"],
        "confidence": pred["confidence"],
        "prediction_status": db_farm.crop_prediction_status,
        "number_of_observations": pred["number_of_observations"],
        "supported_classes": pred["supported_classes"],
        "observation_date": datetime.utcnow().strftime("%Y-%m-%d"),
        "detection_source": pred["detection_source"],
        "reasoning": pred["reasoning"],
        "farmer_selected_crop": db_farm.farmer_selected_crop or db_farm.crop_type,
        "farmer_confirmed_crop": db_farm.farmer_confirmed_crop
    }

@router.post("/{farm_id}/crop-confirmation", response_model=FarmResponse)
def confirm_farmer_crop(farm_id: str, payload: CropConfirmationRequest, db: Session = Depends(get_db)):
    """
    Store ground-truth crop confirmation provided by the farmer.
    Maintains farmer_selected_crop, model_detected_crop, and farmer_confirmed_crop separately.
    """
    db_farm = db.query(Farm).filter(Farm.id == farm_id).first()
    if not db_farm:
        raise HTTPException(status_code=404, detail="Farm not found")

    confirmed = payload.confirmed_crop.strip()
    db_farm.farmer_confirmed_crop = confirmed
    db_farm.crop_type = confirmed
    db_farm.crop_prediction_status = "farmer_confirmed"
    db_farm.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(db_farm)
    return db_farm
