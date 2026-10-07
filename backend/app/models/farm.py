from sqlalchemy import Column, String, Float, Date, DateTime, JSON, ForeignKey, func
from app.database.session import Base
import uuid

class Farm(Base):
    __tablename__ = "farms"

    id = Column(String, primary_key=True, default=lambda: f"farm_{uuid.uuid4().hex[:10]}")
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    
    farm_name = Column(String, nullable=False, index=True)
    crop_type = Column(String, nullable=False) # Primary active crop name
    
    farmer_selected_crop = Column(String, nullable=True)
    model_detected_crop = Column(String, nullable=True)
    model_confidence = Column(Float, nullable=True)
    farmer_confirmed_crop = Column(String, nullable=True)
    crop_prediction_status = Column(String, default="pending_analysis") # 'prediction_available' | 'low_confidence' | 'farmer_confirmed' | 'pending_analysis'
    
    sowing_date = Column(Date, nullable=False)
    
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    boundary_geojson = Column(JSON, nullable=False) # GeoJSON Feature/Polygon
    
    area_hectares = Column(Float, nullable=True)
    area_acres = Column(Float, nullable=True)
    status = Column(String, default="Active Twin Ready")
    
    last_satellite_observation = Column(JSON, nullable=True)
    last_weather_update = Column(JSON, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
