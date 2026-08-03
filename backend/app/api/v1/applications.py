from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.application import InternshipApplication
from app.schemas.application import ApplicationCreate, ApplicationResponse

router = APIRouter()

@router.post("", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
def submit_internship_application(app_in: ApplicationCreate, db: Session = Depends(get_db)):
    # Validate duration option
    valid_durations = ["1 Month", "3 Months", "6 Months"]
    if app_in.duration not in valid_durations:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid duration option '{app_in.duration}'. Must be one of {valid_durations}"
        )
    
    application = InternshipApplication(**app_in.model_dump())
    db.add(application)
    db.commit()
    db.refresh(application)
    return application
