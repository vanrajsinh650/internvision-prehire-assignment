from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.course import Course
from app.models.admin import Admin
from app.schemas.course import CourseCreate, CourseResponse
from app.api.v1.auth import get_current_admin

router = APIRouter()

@router.get("", response_model=list[CourseResponse])
def get_courses(
    search: Optional[str] = None,
    level: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Course).filter(Course.is_published == True)
    if search:
        query = query.filter(Course.title.ilike(f"%{search}%") | Course.description.ilike(f"%{search}%"))
    if level and level != "all":
        query = query.filter(Course.level == level)
    return query.all()

@router.get("/{course_identifier}", response_model=CourseResponse)
def get_course(course_identifier: str, db: Session = Depends(get_db)):
    course = None
    if course_identifier.isdigit():
        course = db.query(Course).filter(Course.id == int(course_identifier)).first()
    if not course:
        course = db.query(Course).filter(Course.slug == course_identifier).first()
    
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
    return course

@router.post("", response_model=CourseResponse, status_code=status.HTTP_201_CREATED)
def create_course(
    course_in: CourseCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin)
):
    existing = db.query(Course).filter(Course.slug == course_in.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Course slug already exists")
    
    course = Course(**course_in.model_dump())
    db.add(course)
    db.commit()
    db.refresh(course)
    return course
