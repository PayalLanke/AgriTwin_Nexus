from fastapi import APIRouter, HTTPException, status, Query
from typing import List, Optional
from app.schemas.farm import FarmCreate, FarmUpdate, FarmResponse
from datetime import datetime

router = APIRouter(prefix="/farms", tags=["Farms Management"])

# In-memory store placeholder for standalone API test
MOCK_FARMS_DB = []

@router.post("", response_model=FarmResponse, status_code=status.HTTP_201_CREATED)
def create_farm(farm_in: FarmCreate):
    """
    Register a new farm with GeoJSON boundary polygon
    """
    farm_id = f"farm_{len(MOCK_FARMS_DB) + 101}"
    now = datetime.utcnow()
    
    # Calculate approximate area placeholder if Turf missing on python
    new_farm = {
        "id": farm_id,
        "user_id": "usr_demo_1",
        "farm_name": farm_in.farm_name,
        "crop_type": farm_in.crop_type,
        "sowing_date": farm_in.sowing_date,
        "latitude": farm_in.latitude,
        "longitude": farm_in.longitude,
        "boundary_geojson": farm_in.boundary_geojson,
        "area_hectares": 2.45,
        "area_acres": 6.05,
        "status": "Active Twin Ready",
        "created_at": now,
        "updated_at": now
    }
    
    MOCK_FARMS_DB.append(new_farm)
    return new_farm

@router.get("", response_model=List[FarmResponse])
def get_farms():
    """
    Retrieve all registered farms for current farmer
    """
    return MOCK_FARMS_DB

@router.get("/{farm_id}", response_model=FarmResponse)
def get_farm_by_id(farm_id: str):
    """
    Get farm spatial details & GeoJSON boundary by ID
    """
    for farm in MOCK_FARMS_DB:
        if farm["id"] == farm_id:
            return farm
    raise HTTPException(status_code=404, detail="Farm not found")

@router.put("/{farm_id}", response_model=FarmResponse)
def update_farm(farm_id: str, farm_in: FarmUpdate):
    """
    Update farm details and GeoJSON boundary polygon
    """
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
def delete_farm(farm_id: str):
    """
    Delete registered farm record
    """
    global MOCK_FARMS_DB
    MOCK_FARMS_DB = [f for f in MOCK_FARMS_DB if f["id"] != farm_id]
    return None
