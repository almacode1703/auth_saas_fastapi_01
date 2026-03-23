from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import User
from services.auth_services import create_access_token, generate_and_send_otp
from pydantic import BaseModel
from datetime import datetime,timezone


router = APIRouter()

class VerifyOTPIn(BaseModel):
    email: str
    otp: str

@router.post("/send-otp")
async def send_otp(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(404, "User not found")

    # Check if already verified — no need to resend
    if user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already verified"
        )

    # Check if OTP still valid — don't resend if not expired yet
    if user.otp_code and user.otp_expires:
        if datetime.now(timezone.utc) < user.otp_expires.replace(tzinfo=timezone.utc):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="OTP already sent, please wait 10 minutes before requesting a new one"
            )

    # OTP expired or never received → generate new one
    await generate_and_send_otp(user, db)
    return {"message": "OTP sent to your email"}

@router.post("/verify-otp")
def verify_otp(body: VerifyOTPIn, db: Session = Depends(get_db)):
    # Step 1 - find user
    user = db.query(User).filter(User.email == body.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Step 2 - check OTP exists
    if not user.otp_code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No OTP requested"
        )

    # Step 3 - check OTP not expired
    if datetime.now(timezone.utc) > user.otp_expires.replace(tzinfo=timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OTP has expired"
        )

    # Step 4 - check OTP is correct
    if user.otp_code != body.otp:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid OTP"
        )

    # Step 5 - activate user account
    user.is_active = True
    user.is_verified = True
    user.otp_code = None      # clear OTP after use
    user.otp_expires = None   # clear expiry after use
    db.commit()

    # Step 6 - return JWT token → user is now logged in
    return {
        "message": "Email verified successfully",
        "token": create_access_token({"sub": user.email})
    }