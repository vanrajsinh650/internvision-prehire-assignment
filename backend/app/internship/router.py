from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.shared.database import get_db
from app.shared.exceptions import BadRequestException
from app.internship.models import InternshipApplication
from app.internship.schemas import ApplicationCreate, ApplicationResponse

router = APIRouter(prefix="/applications", tags=["Internship Applications"])

@router.post("", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
def submit_internship_application(app_in: ApplicationCreate, db: Session = Depends(get_db)):
    valid_durations = ["1 Month", "3 Months", "6 Months"]
    if app_in.duration not in valid_durations:
        raise BadRequestException(f"Invalid duration option '{app_in.duration}'. Must be one of {valid_durations}")
    
    application = InternshipApplication(**app_in.model_dump())
    db.add(application)
    db.commit()
    db.refresh(application)
    return application
