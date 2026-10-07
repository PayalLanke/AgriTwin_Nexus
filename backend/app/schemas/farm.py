from pydantic import BaseModel, Field
from typing import Dict, Any, Optional, List
from datetime import date, datetime

class FarmBase(BaseModel):
    farm_name: str = Field(..., example="Green Valley Plot A")
    crop_type: str = Field(..., example="Wheat")
    sowing_date: date = Field(..., example="2026-06-15")
    latitude: float = Field(..., example=18.5204)
    longitude: float = Field(..., example=73.8567)
    boundary_geojson: Dict[str, Any] = Field(..., description="GeoJSON Polygon feature")

class FarmCreate(FarmBase):
    farmer_selected_crop: Optional[str] = None

class FarmUpdate(BaseModel):
    farm_name: Optional[str] = None
    crop_type: Optional[str] = None
    sowing_date: Optional[date] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    boundary_geojson: Optional[Dict[str, Any]] = None
    farmer_confirmed_crop: Optional[str] = None

class FarmResponse(FarmBase):
    id: str
    user_id: str
    farmer_selected_crop: Optional[str] = None
    model_detected_crop: Optional[str] = None
    model_confidence: Optional[float] = None
    farmer_confirmed_crop: Optional[str] = None
    crop_prediction_status: Optional[str] = "pending_analysis"
    area_hectares: Optional[float] = None
    area_acres: Optional[float] = None
    status: str
    last_satellite_observation: Optional[Dict[str, Any]] = None
    last_weather_update: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class CropConfirmationRequest(BaseModel):
    confirmed_crop: str = Field(..., example="Papaya (पपई / पपीता)")

class CropDetectionResponse(BaseModel):
    predicted_crop: str
    confidence: float
    prediction_status: str # 'prediction_available' | 'low_confidence' | 'farmer_confirmed' | 'model_not_trained'
    number_of_observations: int
    supported_classes: List[str]
    observation_date: Optional[str] = None
    detection_source: str
    reasoning: Optional[str] = None
    farmer_selected_crop: Optional[str] = None
    farmer_confirmed_crop: Optional[str] = None
