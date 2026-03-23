from fastapi import FastAPI
from database import engine, Base

from fastapi.middleware.cors import CORSMiddleware

from routers import auth
from routers.sso import google_sso, github_sso

from config import FRONTEND_URL
from routers import otp


# Create tables in postgres on startup
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"], 
    allow_headers=["*"], 
    allow_credentials=True
)

# Routes
@app.get("/")
def health_check():
    return {"message": "API is running"}

# Auth Routes
app.include_router(auth.router, prefix="/auth", tags=["auth"])  

# SSO routes
app.include_router(google_sso.router, prefix="/auth/google", tags=["google-sso"])
app.include_router(github_sso.router,  prefix="/auth/github", tags=["github-sso"])

#Otp Routes
app.include_router(otp.router, prefix="/auth", tags=["otp"])