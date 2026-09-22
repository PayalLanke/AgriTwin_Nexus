-- AgriTwin Nexus: Database Schema Definition
-- Platform: PostgreSQL 14+ with PostGIS Spatial Extension

-- Enable PostGIS Extension if spatial indexing is required
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast user login email lookup
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 2. FARMS TABLE (Module 6 Core Entity)
CREATE TABLE IF NOT EXISTS farms (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    farm_name VARCHAR(150) NOT NULL,
    crop_type VARCHAR(50) NOT NULL,
    sowing_date DATE NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    
    -- GeoJSON polygon representation stored as JSONB
    boundary_geojson JSONB NOT NULL,
    
    -- Optional PostGIS spatial geometry column (SRID 4326 for WGS84 Lat/Lng)
    boundary_geom GEOMETRY(Polygon, 4326),
    
    area_hectares DOUBLE PRECISION,
    area_acres DOUBLE PRECISION,
    status VARCHAR(50) DEFAULT 'Active Twin Ready',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Spatial and User Foreign Key Indexes
CREATE INDEX IF NOT EXISTS idx_farms_user_id ON farms(user_id);
CREATE INDEX IF NOT EXISTS idx_farms_crop_type ON farms(crop_type);
CREATE INDEX IF NOT EXISTS idx_farms_geojson ON farms USING gin (boundary_geojson);

-- Automated updated_at Trigger Function
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_modtime BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();
CREATE TRIGGER update_farms_modtime BEFORE UPDATE ON farms FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();
