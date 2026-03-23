from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from database import get_db
from models import User
from services.auth_services import create_access_token
from services.sso.github_sso_services import get_github_auth_url, get_github_user
from config import FRONTEND_URL

router = APIRouter()


@router.get("/login")
def github_login():
    return {"url": get_github_auth_url()}


@router.get("/callback")
async def github_callback(code: str, db: Session = Depends(get_db)):
    try:
        # Step 1 - get user info from GitHub
        github_user = await get_github_user(code)
        email = github_user.get("email")
        name = github_user.get("name")

        if not email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not get email from GitHub",
            )

        # Step 2 - find or create user in database
        existing_user = db.query(User).filter(User.email == email).first()
        
        if existing_user:
            user = existing_user
        else:
            user = User(
                username=github_user.get("login"),  # GitHub username
                email=email,
                name=name,
                provider="github",
                hashed_password=None,
                is_active=True,  
                is_verified=True, 
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        # Step 3 - create JWT token
        token = create_access_token({"sub": user.email})

        # Step 4 - redirect to frontend
        return RedirectResponse(url=f"{FRONTEND_URL}/auth/callback?token={token}")

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
