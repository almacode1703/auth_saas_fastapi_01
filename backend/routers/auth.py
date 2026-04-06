from fastapi import Depends, status, HTTPException, APIRouter
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import RegisterUser, LoginUser
from services.auth_services import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token,
    generate_and_send_otp,
)


router = APIRouter()


@router.post("/register")
async def register(user: RegisterUser, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered"
        )
    # Hash password
    hashed_password = hash_password(user.password)

    # Create new user
    new_user = User(
        username=user.username,
        name=user.name,
        email=user.email,
        hashed_password=hashed_password,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    await generate_and_send_otp(new_user, db)
    return {
        "message": "Check your Email for OTP",
    }


@router.post("/login")
def login(user: LoginUser, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    if not existing_user.is_active:  # ← add this
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Please verify your email first",
        )
    if not verify_password(user.password, existing_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect password"
        )
    return {
        "message": "User logged in successfully",
        "token": create_access_token({"sub": existing_user.email}),
    }


@router.get("/me")
def me(token: str, db: Session = Depends(get_db)):
    try:
        # Step 1 - decode token → get payload
        payload = decode_access_token(token)

        # Step 2 - get email from payload
        email = payload.get("sub")

        # Step 3 - find user in database
        user = db.query(User).filter(User.email == email).first()

        # Step 4 - if user not found
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
            )

        # Step 5 - return user info
        return {
            "id": user.id,
            "username": user.username,
            "name": user.name,
            "email": user.email,
            "is_active": user.is_active,
            "provider": user.provider,
            "avatar": user.avatar,
            "phone": user.phone,
            "created_at": user.created_at,
        }
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))
