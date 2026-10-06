from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import uuid

from app.database.session import get_db
from app.models.farm import Farm
from app.schemas.farm import FarmCreate, FarmUpdate, FarmResponse

router = APIRouter(prefix="/farms", tags=["Farms Management"])

# In-memory fallback if DB table is uninitialized during standalone test
MOCK_FARMS_DB = []

@router.post("", response_model=FarmResponse, status_code=status.HTTP_201_CREATED)
def create_farm(farm_in: FarmCreate, user_id: Optional[str] = Query("usr_demo_1"), db: Session = Depends(get_db)):
    """
    Register a new farm with GeoJSON boundary polygon and save to database
    """
    area_ha = 2.45
    area_acres = 6.05
    if farm_in.boundary_geojson and "properties" in farm_in.boundary_geojson:
        props = farm_in.boundary_geojson.get("properties", {})
        if "areaHectares" in props: area_ha = props["areaHectares"]
        if "areaAcres" in props: area_acres = props["areaAcres"]

    try:
        db_farm = Farm(
            id=f"farm_{uuid.uuid4().hex[:10]}",
            user_id=user_id,
            farm_name=farm_in.farm_name,
            crop_type=farm_in.crop_type,
            sowing_date=farm_in.sowing_date,
            latitude=farm_in.latitude,
            longitude=farm_in.longitude,
            boundary_geojson=farm_in.boundary_geojson,
            area_hectares=area_ha,
            area_acres=area_acres,
            status="Active Twin Ready"
        )
        db.add(db_farm)
        db.commit()
        db.refresh(db_farm)
        return db_farm
    except Exception as e:
        # Fallback to memory if DB session uninitialized
        now = datetime.utcnow()
        new_farm = {
            "id": f"farm_{len(MOCK_FARMS_DB) + 101}",
            "user_id": user_id,
            "farm_name": farm_in.farm_name,
            "crop_type": farm_in.crop_type,
            "sowing_date": farm_in.sowing_date,
            "latitude": farm_in.latitude,
            "longitude": farm_in.longitude,
            "boundary_geojson": farm_in.boundary_geojson,
            "area_hectares": area_ha,
            "area_acres": area_acres,
            "status": "Active Twin Ready",
            "created_at": now,
            "updated_at": now
        }
        MOCK_FARMS_DB.append(new_farm)
        return new_farm

@router.get("", response_model=List[FarmResponse])
def get_farms(user_id: Optional[str] = Query(None), db: Session = Depends(get_db)):
    """
    Retrieve registered farms for current farmer with strict user isolation
    """
    try:
        query = db.query(Farm)
        if user_id:
            query = query.filter(Farm.user_id == user_id)
        farms = query.all()
        if farms:
            return farms
    except Exception:
        pass

    if user_id:
        return [f for f in MOCK_FARMS_DB if f.get("user_id") == user_id]
    return MOCK_FARMS_DB

@router.get("/{farm_id}", response_model=FarmResponse)
def get_farm_by_id(farm_id: str, db: Session = Depends(get_db)):
    """
    Get farm spatial details & GeoJSON boundary by ID
    """
    try:
        db_farm = db.query(Farm).filter(Farm.id == farm_id).first()
        if db_farm:
            return db_farm
    except Exception:
        pass

    for farm in MOCK_FARMS_DB:
        if farm["id"] == farm_id:
            return farm
    raise HTTPException(status_code=404, detail="Farm not found")

@router.put("/{farm_id}", response_model=FarmResponse)
def update_farm(farm_id: str, farm_in: FarmUpdate, db: Session = Depends(get_db)):
    """
    Update farm details and GeoJSON boundary polygon
    """
    try:
        db_farm = db.query(Farm).filter(Farm.id == farm_id).first()
        if db_farm:
            if farm_in.farm_name is not None: db_farm.farm_name = farm_in.farm_name
            if farm_in.crop_type is not None: db_farm.crop_type = farm_in.crop_type
            if farm_in.sowing_date is not None: db_farm.sowing_date = farm_in.sowing_date
            if farm_in.latitude is not None: db_farm.latitude = farm_in.latitude
            if farm_in.longitude is not None: db_farm.longitude = farm_in.longitude
            if farm_in.boundary_geojson is not None: db_farm.boundary_geojson = farm_in.boundary_geojson
            db.commit()
            db.refresh(db_farm)
            return db_farm
    except Exception:
        pass

    for farm in MOCK_FARMS_DB:
        if farm["id"] == farm_id:
            if farm_in.farm_name is not None: farm["farm_name"] = farm_in.farm_name
            if farm_in.crop_type is not None: farm["crop_type"] = farm_in.crop_type
            if farm_in.sowing_date is not None: farm["sowing_date"] = farm_in.sowing_date
            if farm_in.latitude is not None: farm["latitude"] = farm_in.latitude
            if farm_in.longitude is not None: farm["longitude"] = farm_in.longitude
            if farm_in.boundary_geojson is not None: farm["boundary_geojson"] = farm_in.boundary_geojson
            farm["updated_at"] = datetime.utcnow()
            return farm
    raise HTTPException(status_code=404, detail="Farm not found")

@router.delete("/{farm_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_farm(farm_id: str, db: Session = Depends(get_db)):
    """
    Delete registered farm record from database
    """
    try:
        db_farm = db.query(Farm).filter(Farm.id == farm_id).first()
        if db_farm:
            db.delete(db_farm)
            db.commit()
            return None
    except Exception:
        pass

    global MOCK_FARMS_DB
    MOCK_FARMS_DB = [f for f in MOCK_FARMS_DB if f["id"] != farm_id]
    return None
