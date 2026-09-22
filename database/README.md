# AgriTwin Nexus — PostgreSQL / PostGIS Spatial Database

This directory contains DDL schemas for setting up the AgriTwin Nexus database.

---

## 🗄️ Database Setup Instructions

### 1. Create PostgreSQL Database
```sql
CREATE DATABASE agritwin_db;
```

### 2. Enable PostGIS Extension
Connect to `agritwin_db` and run:
```sql
CREATE EXTENSION IF NOT EXISTS postgis;
```

### 3. Run Schema DDL Script
```bash
psql -U postgres -d agritwin_db -f schema.sql
```

---

## 📐 Spatial Boundary Storage Concept
The `farms` table stores boundaries using two complementary approaches:
1. `boundary_geojson (JSONB)`: Direct GeoJSON Feature format used by Leaflet.js frontend.
2. `boundary_geom (GEOMETRY(Polygon, 4326))`: PostGIS geometry type enabling spatial queries (e.g. ST_Area, ST_Contains) for Google Earth Engine integration in Module 7+.
