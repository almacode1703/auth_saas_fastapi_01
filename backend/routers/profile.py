from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from database import get_db
from models import User
from services.auth_services import decode_access_token
import shutil
import os
import uuid
from pydantic import BaseModel

router = APIRouter()

UPLOAD_DIR = "uploads/avatars"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class UpdateProfileRequest(BaseModel):
    name: str = None
    username: str = None
    phone: str = None


@router.post("/avatar")
async def upload_avatar(
    token: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    try:
        payload = decode_access_token(token)
        email = payload.get("sub")
        user = db.query(User).filter(User.email == email).first()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Validate file type
        allowed_types = ["image/jpeg", "image/png", "image/webp"]
        if file.content_type not in allowed_types:
            raise HTTPException(status_code=400, detail="Only JPEG, PNG, and WebP images are allowed")

        # Generate unique filename
        ext = file.filename.split(".")[-1]
        filename = f"{uuid.uuid4()}.{ext}"
        file_path = os.path.join(UPLOAD_DIR, filename)

        # Save file
        with open(file_path, "wb") as f:
            shutil.copyfileobj(file.file, f)

        # Delete old avatar if exists
        if user.avatar and os.path.exists(user.avatar):
            os.remove(user.avatar)

        # Update user
        user.avatar = f"/uploads/avatars/{filename}"
        db.commit()

        return {
            "message": "Avatar updated successfully",
            "avatar_url": f"/uploads/avatars/{filename}",
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/avatar")
async def remove_avatar(
    token: str,
    db: Session = Depends(get_db),
):
    try:
        payload = decode_access_token(token)
        email = payload.get("sub")
        user = db.query(User).filter(User.email == email).first()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Delete file if exists
        if user.avatar and os.path.exists(user.avatar):
            os.remove(user.avatar)

        user.avatar = None
        db.commit()

        return {"message": "Avatar removed successfully"}

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/update")
async def update_profile(
    token: str,
    body: UpdateProfileRequest,
    db: Session = Depends(get_db),
):
    try:
        payload = decode_access_token(token)
        email = payload.get("sub")
        user = db.query(User).filter(User.email == email).first()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        if body.name is not None:
            user.name = body.name

        if body.username is not None:
            existing = db.query(User).filter(User.username == body.username, User.id != user.id).first()
            if existing:
                raise HTTPException(status_code=400, detail="Username already taken")
            user.username = body.username

        if body.phone is not None:
            user.phone = body.phone

        db.commit()

        return {"message": "Profile updated successfully"}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))