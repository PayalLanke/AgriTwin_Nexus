from fastapi import APIRouter, HTTPException, status, Depends
from app.schemas.user import UserRegister, UserLogin, Token, UserResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_farmer(user_in: UserRegister):
    """
    Register a new farmer account
    """
    # Skeleton implementation for Farm Module phase
    return {
        "id": "usr_demo_101",
        "full_name": user_in.full_name,
        "email": user_in.email,
        "created_at": "2026-09-07T12:00:00Z"
    }

@router.post("/login", response_model=Token)
def login_farmer(credentials: UserLogin):
    """
    Login farmer and return JWT authentication token
    """
    if credentials.email == "farmer@agritwin.com" and credentials.password == "farmer123":
        return {
            "access_token": "jwt_token_sample_agritwin_2026",
            "token_type": "bearer",
            "user": {
                "id": "usr_demo_1",
                "full_name": "Rajesh Kumar",
                "email": credentials.email,
                "created_at": "2026-09-07T12:00:00Z"
            }
        }
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid email or password"
    )
