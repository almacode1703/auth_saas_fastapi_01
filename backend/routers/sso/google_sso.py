from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from database import get_db
from models import User
from services.auth_services import create_access_token
from services.sso.google_sso_services import get_google_auth_url, get_google_user
from config import FRONTEND_URL

router = APIRouter()


# google oauth
@router.get("/google/login")
async def google_login():
    auth_url = await get_google_auth_url()
    return {"auth_url": auth_url}


@router.get("/google/callback")
async def google_callback(code: str, db: Session = Depends(get_db)):
    try:
        # Step 1 - get user info from Google using the code
        google_user = await get_google_user(code)

        email = google_user.get("email")
        name = google_user.get("name")

        if not email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not get email from Google",
            )

        # Step 2 - check if user already exists in our database
        existing_user = db.query(User).filter(User.email == email).first()

        if existing_user:
            # user exists → just log them in
            user = existing_user
        else:
            # user doesn't exist → create them
            user = User(
                username=email.split("@")[0],  # john from john@gmail.com
                email=email,
                name=name,
                provider="google",  # remember how they signed up
                hashed_password=None,
                is_active=True,  
                is_verified=True, 
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        # Step 3 - create our own JWT token
        token = create_access_token({"sub": user.email})

        # Step 4 - redirect to frontend with token
        from fastapi.responses import RedirectResponse

        return RedirectResponse(url=f"{FRONTEND_URL}/auth/callback?token={token}")

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
