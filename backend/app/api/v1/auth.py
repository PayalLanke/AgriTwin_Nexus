from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
import uuid
from datetime import datetime

from app.database.session import get_db
from app.models.user import User
from app.schemas.user import UserRegister, UserLogin, Token, UserResponse

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
