from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
import uuid
from datetime import datetime

from app.database.session import get_db
from app.models.user import User
from app.schemas.user import UserRegister, UserLogin, UserProfileUpdate, Token, UserResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_farmer(user_in: UserRegister, db: Session = Depends(get_db)):
    """
    Register a new farmer account and store in persistent database
    """
    try:
        existing = db.query(User).filter(User.email.lower() == user_in.email.lower()).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="An account with this email address already exists."
            )

        db_user = User(
            id=f"usr_{uuid.uuid4().hex[:10]}",
            full_name=user_in.full_name,
            email=user_in.email.lower(),
            hashed_password=user_in.password
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error during registration: {str(e)}"
        )

@router.post("/login", response_model=Token)
def login_farmer(credentials: UserLogin, db: Session = Depends(get_db)):
    """
    Login farmer against registered database credentials
    """
    try:
        db_user = db.query(User).filter(User.email.lower() == credentials.email.lower()).first()
        if db_user and db_user.hashed_password == credentials.password:
            return {
                "access_token": f"jwt_token_{db_user.id}_{int(datetime.utcnow().timestamp())}",
                "token_type": "bearer",
                "user": {
                    "id": db_user.id,
                    "full_name": db_user.full_name,
                    "email": db_user.email,
                    "mobile_number": db_user.mobile_number,
                    "state": db_user.state,
                    "district": db_user.district,
                    "village": db_user.village,
                    "created_at": db_user.created_at.isoformat() if db_user.created_at else datetime.utcnow().isoformat()
                }
            }
    except Exception as e:
        print("Database lookup error during login:", e)

    # Default demo farmer credentials fallback
    if credentials.email.lower() == "farmer@agritwin.com" and credentials.password == "farmer123":
        return {
            "access_token": "jwt_token_sample_agritwin_2026",
            "token_type": "bearer",
            "user": {
                "id": "usr_demo_1",
                "full_name": "Rajesh Kumar",
                "email": credentials.email.lower(),
                "created_at": "2026-09-07T12:00:00Z"
            }
        }

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid email or password. Please check your credentials."
    )

@router.put("/profile/{user_id}", response_model=UserResponse)
def update_farmer_profile(user_id: str, profile_in: UserProfileUpdate, db: Session = Depends(get_db)):
    """
    Update registered farmer profile details in database
    """
    try:
        db_user = db.query(User).filter(User.id == user_id).first()
        if not db_user and profile_in.email:
            db_user = db.query(User).filter(User.email.lower() == profile_in.email.lower()).first()

        if not db_user:
            # Create if user record is missing in DB
            db_user = User(
                id=user_id,
                full_name=profile_in.full_name or "Farmer",
                email=(profile_in.email or "farmer@agritwin.com").lower(),
                hashed_password="farmer123"
            )
            db.add(db_user)

        if profile_in.full_name:
            db_user.full_name = profile_in.full_name
        if profile_in.email:
            db_user.email = profile_in.email.lower()
        if profile_in.mobile_number is not None:
            db_user.mobile_number = profile_in.mobile_number
        if profile_in.state is not None:
            db_user.state = profile_in.state
        if profile_in.district is not None:
            db_user.district = profile_in.district
        if profile_in.village is not None:
            db_user.village = profile_in.village

        db.commit()
        db.refresh(db_user)
        return db_user
    except Exception as e:
        db.rollback()
        print("Error updating profile in backend:", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update profile: {str(e)}"
        )
