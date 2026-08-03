from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.shared.database import Base, engine
from app.auth.router import router as auth_router
from app.courses.router import router as courses_router
from app.internship.router import router as internship_router
from app.payments.router import router as payments_router
from app.dashboard.router import router as dashboard_router
from app.export.router import router as export_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="InternVision Tech API",
    version="1.0.0",
    openapi_url="/api/openapi.json"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Feature Routers mounted under /api
app.include_router(auth_router, prefix="/api")
app.include_router(courses_router, prefix="/api")
app.include_router(internship_router, prefix="/api")
app.include_router(payments_router, prefix="/api")
app.include_router(dashboard_router, prefix="/api")
app.include_router(export_router, prefix="/api")

@app.get("/")
def root():
    return {
        "name": "InternVision Tech API",
        "version": "1.0.0",
        "status": "online",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
