from dotenv import load_dotenv
import os

load_dotenv()

# Database Related
DATABASE_URI = os.getenv("DATABASE_URI")
SECRET_KEY = os.getenv("SECRET_KEY")

# Database Algorithm
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))

# google SSO
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET") 

# Github SSO
GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")

# OTP Verification
MAIL_USERNAME = os.getenv("MAIL_USERNAME")
MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
MAIL_FROM = os.getenv("MAIL_FROM")

# Frontend URL
FRONTEND_URL = os.getenv("FRONTEND_URL")
