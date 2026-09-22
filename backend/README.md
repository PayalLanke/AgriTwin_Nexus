# AgriTwin Nexus — Backend REST API Engine

FastAPI backend providing REST endpoints for user authentication and spatial farm digital twin management.

---

## ⚡ Quick Start

### 1. Setup Virtual Environment
```bash
cd backend
python -m venv venv
# On Windows PowerShell:
.\venv\Scripts\Activate.ps1
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run FastAPI Development Server
```bash
uvicorn app.main:app --reload --port 8000
```
Swagger API documentation available at `http://localhost:8000/docs`.

---

## 📡 REST API Endpoints Reference

### Authentication (`/api/v1/auth`)
- `POST /api/v1/auth/register` — Register a new farmer account
- `POST /api/v1/auth/login` — Authenticate session and receive JWT token

### Farm Management (`/api/v1/farms`)
- `POST /api/v1/farms` — Save new farm details & GeoJSON boundary polygon
- `GET /api/v1/farms` — Fetch all registered farms for active user
- `GET /api/v1/farms/{farm_id}` — Get single farm metadata & boundary
- `PUT /api/v1/farms/{farm_id}` — Update farm metadata & GeoJSON polygon vertices
- `DELETE /api/v1/farms/{farm_id}` — Remove farm record
