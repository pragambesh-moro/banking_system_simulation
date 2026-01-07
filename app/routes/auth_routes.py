from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas import UserCreate, UserLogin, AuthResponse, UserResponse, AccountInfoResponse
from app.database import get_db
from app.services.auth_service import resgister_user, login_user

router = APIRouter(prefix="/api/v1/auth", tags=["authentication"])

@router.post(
    "/register",
    response_model=AuthResponse,
    summary="Register a new user",
    description="Create a new user account with an optional initial deposit."
)
def register(user_data: UserCreate, db: Session = Depends(get_db)) -> AuthResponse:
    try:
        result = resgister_user(db, user_data)

        return AuthResponse(
            message="User registered successfully",
            user=UserResponse.model_validate(result["user"]),
            account=AccountInfoResponse.model_validate(result["account"]),
            token=result["token"]
        )
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )
    
@router.post(
    "/login",
    response_model=AuthResponse,
    summary="Login user",
    description="Authenticate user and return access token"
)
def login(credentials: UserLogin, db: Session = Depends(get_db)) -> AuthResponse:
    try:
        result = login_user(db, credentials.email, credentials.password)

        return AuthResponse(
            message="Login successful!",
            user=UserResponse.model_validate(result["user"]),
            account=AccountInfoResponse.model_validate(result["account"]),
            token=result["token"]
        )
    
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}"
        )