# AgriTwin Nexus: Intelligent Digital Twin Platform for Precision Farming

> **B.Tech Final-Year Software Engineering Project**  
> A software-only, high-precision agricultural Digital Twin platform. No physical hardware, drones, or IoT sensors required.

---

## 📌 Project Overview

**AgriTwin Nexus** is an advanced software platform that creates dynamic **Digital Twins** of agricultural farms by fusing multispectral satellite data (Sentinel-2 via Google Earth Engine), hyper-local weather parameters, and historical agricultural data. 

Farmers and agronomists can delineate exact farm boundaries using GeoJSON polygons, monitor vegetation vigor (NDVI, NDRE, SAVI), assess crop health in real-time, predict pest/disease outbreaks, and receive actionable rule-based recommendations for optimized yield.

---

## 🔄 System Architecture & Flow

```
Farmer
   ↓
Registration / Login
   ↓
Farm Registration
   ↓
Farm Location + Boundary + Crop Details (GeoJSON Polygon)
   ↓
Sentinel-2 Satellite Data + Weather Data + Historical Data
   ↓
Data Processing Engine
   ↓
Vegetation Indices Engine (NDVI / NDRE / SAVI)
   ↓
Farm Digital Twin Layer
   ↓
Crop Identification & Health Analysis
   ↓
Pest & Disease Risk Analysis
   ↓
Yield Estimation Engine
   ↓
Rule-Based Recommendation System
   ↓
Interactive SaaS Web Dashboard
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React.js, JavaScript, HTML5, Vanilla CSS, Leaflet.js, GeoJSON, Turf.js, Lucide Icons |
| **Backend** | Python 3.10+, FastAPI, Uvicorn, Pydantic, SQLAlchemy, GeoAlchemy2 |
| **Database** | PostgreSQL + PostGIS (Spatial JSONB & Polygon geometries) |
| **Satellite Data** | Sentinel-2 Multispectral Imagery, Google Earth Engine API |
| **Data & ML** | Scikit-learn, NumPy, Pandas |
| **Weather** | OpenWeatherMap API / Weather API |

---

## 📍 Current Development Phase

### **MODULE 6: FARM MODULE (Active Implementation)**

Current implemented capabilities:
- [x] Farmer Authentication UI (Login & Registration with client validation)
- [x] Main Dashboard UI with responsive SaaS navigation & summary metric cards
- [x] Farm Registration with Leaflet.js map integration
- [x] Location search with instant marker positioning (Latitude & Longitude)
- [x] Interactive GeoJSON Polygon Boundary drawing, editing, & vertex management
- [x] Dynamic farm area calculation (Hectares & Acres via Turf.js)
- [x] Farm Management CRUD (View farm with map boundary, Edit farm, Delete farm)
- [x] Service layer architecture (`farmService.js`) decoupling frontend UI from persistence
- [x] FastAPI REST API backend project structure and PostgreSQL spatial schema DDL

---

## 🚀 Future Roadmap & Upcoming Modules

1. **Module 7: Google Earth Engine & Sentinel-2 Acquisition**
   - Automated fetching of 10m spatial resolution Sentinel-2 Band 4 (Red), Band 8 (NIR), Band 5 (Vegetation Red Edge), and Band 2 (Blue) within farm GeoJSON boundaries.
2. **Module 8: Vegetation Indices Engine**
   - Computation of Normalized Difference Vegetation Index (NDVI), Normalized Difference Red Edge (NDRE), and Soil-Adjusted Vegetation Index (SAVI).
3. **Module 9: Crop Identification & Health Analytics**
   - ML-driven crop classification and multi-temporal health spectral signature profiling.
4. **Module 10: Pest & Disease Risk Prediction**
   - Micro-climate weather fusion (humidity, temperature, leaf wetness) with vegetation stress indices to forecast pest/disease risk levels.
5. **Module 11: Yield Estimation & Recommendation Engine**
   - Yield projection models and agronomic advisories (irrigation, fertilizer timing).
6. **Module 12: Comprehensive Digital Twin Dashboard**
   - 3D spatial visualization and temporal timeline analytics for registered farms.

---

## 🏃 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **Python**: v3.10 or higher
- **PostgreSQL**: v14+ with PostGIS extension (Optional for standalone mock persistence)

### Running the Frontend
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

### Running the Backend (FastAPI)
```bash
cd backend
python -m venv venv
# On Windows PowerShell:
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Backend API interactive documentation available at `http://localhost:8000/docs`.

---

## 📜 License & Acknowledgments
Developed for B.Tech Final Year Software Project under the guidance of Department of Computer Engineering.
