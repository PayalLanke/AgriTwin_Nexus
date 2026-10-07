from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.database.session import engine, Base
import app.models.user
import app.models.farm
from app.api.v1.auth import router as auth_router
from app.api.v1.farms import router as farms_router

# Auto-create all Database Tables (users, farms) on startup
try:
    Base.metadata.create_all(bind=engine)
    print("Database tables initialized successfully.")
except Exception as e:
    print("Database initialization notice:", e)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="AgriTwin Nexus Platform — Farm Module REST API Service"
)

# Configure CORS Middleware for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production specify frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(farms_router, prefix=settings.API_V1_STR)

@app.get("/", tags=["Health Check"])
def root_health_check():
    return {
        "status": "online",
        "platform": "AgriTwin Nexus API Engine",
        "current_module": "Module 6: Farm Module",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
