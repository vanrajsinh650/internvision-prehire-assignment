from fastapi import APIRouter
from app.api.v1 import auth, courses, applications, payments, admin, export

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(courses.router, prefix="/courses", tags=["Courses"])
api_router.include_router(applications.router, prefix="/applications", tags=["Applications"])
api_router.include_router(payments.router, prefix="/payments", tags=["Payments"])
api_router.include_router(admin.router, prefix="/admin", tags=["Admin Dashboard"])
api_router.include_router(export.router, prefix="/admin/export", tags=["Excel Export"])
