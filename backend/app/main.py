from datetime import datetime, timezone
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.middleware import LoggingAndRequestIDMiddleware
from app.shared.database import Base, engine, get_db
from app.auth.router import router as auth_router
from app.courses.router import router as courses_router
from app.internship.router import router as internship_router
from app.payments.router import router as payments_router
from app.dashboard.router import router as dashboard_router
from app.export.router import router as export_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url="/api/openapi.json"
)

# Custom Request Logging & ID Middleware
app.add_middleware(LoggingAndRequestIDMiddleware)

# Configurable CORS Policy
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Feature Routers mounted under /api and root for total path compatibility
for r in [auth_router, courses_router, internship_router, payments_router, dashboard_router, export_router]:
    app.include_router(r, prefix="/api")
    app.include_router(r)


@app.get("/")
def root():
    return {
        "name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "status": "online",
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health")
@app.get("/api/health")
def health_check(db: Session = Depends(get_db)):
    db_status = "connected"
    try:
        db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"
        
    return {
        "status": "healthy" if db_status == "connected" else "degraded",
        "database": db_status,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

