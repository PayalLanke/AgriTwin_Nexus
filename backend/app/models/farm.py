from sqlalchemy import Column, String, Float, Date, DateTime, JSON, ForeignKey, func
from app.database.session import Base
import uuid

class Farm(Base):
    __tablename__ = "farms"

    id = Column(String, primary_key=True, default=lambda: f"farm_{uuid.uuid4().hex[:10]}")
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    
    farm_name = Column(String, nullable=False, index=True)
    crop_type = Column(String, nullable=False)
    sowing_date = Column(Date, nullable=False)
    
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    boundary_geojson = Column(JSON, nullable=False) # Stores GeoJSON Polygon feature/geometry
    
    area_hectares = Column(Float, nullable=True)
    area_acres = Column(Float, nullable=True)
    status = Column(String, default="Active Twin Ready")
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
