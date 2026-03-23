# FastAPI Backend — Complete Developer Guide
> Auth · Google SSO · GitHub SSO · JWT · Docker · PostgreSQL

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Folder Structure](#2-folder-structure)
3. [Environment Variables](#3-environment-variables)
4. [Database — PostgreSQL + SQLAlchemy](#4-database)
5. [Database Models](#5-database-models)
6. [Auth Services](#6-auth-services)
7. [SSO Services — Google & GitHub](#7-sso-services)
8. [Complete Routes Reference](#8-routes-reference)
9. [Docker Setup](#9-docker-setup)
10. [Request & Response Examples](#10-request--response-examples)
11. [Error Responses](#11-error-responses)
12. [Key Concepts Explained](#12-key-concepts)
13. [Running the Project](#13-running-the-project)

---

## 1. Project Overview

This backend is a production-ready authentication system built with FastAPI, PostgreSQL, and Docker. It supports three ways to authenticate:
- Email/password with JWT tokens
- Google OAuth2 SSO
- GitHub OAuth2 SSO

### Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| FastAPI | 0.134+ | Web framework — handles HTTP routes |
| Python | 3.11 | Programming language |
| PostgreSQL | 15 | Database — stores users |
| SQLAlchemy | 2.0+ | ORM — Python to SQL translator (like Prisma) |
| Docker | Latest | Containerization — runs everything consistently |
| pyjwt | 2.12+ | Creates and verifies JWT tokens |
| bcrypt | 5.0+ | Password hashing |
| httpx | 0.28+ | HTTP client — calls Google/GitHub APIs |
| fastapi-mail | Latest | Sends emails via Gmail SMTP |

---

## 2. Folder Structure

```
backend/
  ├── main.py                  ← App entry point, registers all routers
  ├── database.py              ← Postgres connection and session management
  ├── models.py                ← Database table definitions (SQLAlchemy)
  ├── schemas.py               ← Request/response data shapes (Pydantic)
  ├── config.py                ← All environment variables in one place
  ├── .env                     ← Secret keys and credentials (never commit!)
  ├── requirements.txt         ← Python packages list
  ├── Dockerfile               ← How to build and run in Docker
  │
  ├── routers/                 ← All HTTP route handlers
  │   ├── __init__.py
  │   ├── auth.py              ← /auth/register, /auth/login, /auth/me
  │   └── sso/
  │       ├── __init__.py
  │       ├── google_sso.py    ← /auth/google/login, /auth/google/callback
  │       └── github_sso.py    ← /auth/github/login, /auth/github/callback
  │
  └── services/                ← All business logic (no routes here)
      ├── __init__.py
      ├── auth_services.py     ← Password hashing, JWT create/decode
      └── sso/
          ├── __init__.py
          ├── google_sso_services.py  ← Google API calls
          └── github_sso_services.py  ← GitHub API calls
```

### Why This Structure?

| Folder/File | Job | What goes here |
|---|---|---|
| `routers/` | HTTP layer | Only route definitions — @router.get/post |
| `services/` | Business logic | Actual logic — hashing, API calls, DB queries |
| `models.py` | Database schema | Table definitions only |
| `schemas.py` | Data validation | Pydantic models for request/response shapes |
| `config.py` | Configuration | All os.getenv() calls centralized here |

---

## 3. Environment Variables

All secrets live in `backend/.env`. **Never commit this file to Git.**

```bash
# Database
DATABASE_URI=postgresql+psycopg2://admin:password123@db:5432/authsaasdb

# JWT
SECRET_KEY=your-super-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Email (Gmail SMTP)
MAIL_USERNAME=your-gmail@gmail.com
MAIL_PASSWORD=your-16-char-app-password
MAIL_FROM=your-gmail@gmail.com

# Frontend
FRONTEND_URL=http://localhost:3000
```

> **Note:** Never use your real Gmail password. Generate an App Password in Google Account → Security → App Passwords.

---

## 4. Database

### database.py — How it works

```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config import DATABASE_URI

engine = create_engine(DATABASE_URI)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db        # pause — give session to route
    finally:
        db.close()      # resume — close session after route finishes
```

| Part | What it does |
|---|---|
| `create_engine()` | Opens a connection pool to PostgreSQL |
| `sessionmaker()` | Creates a Session factory — like a cookie cutter for sessions |
| `SessionLocal()` | Creates ONE actual database session |
| `Base` | Parent class all models inherit from |
| `get_db()` | FastAPI dependency — provides fresh session per request, auto-closes |
| `yield` | Pauses the function — same concept as generators in JavaScript |

### Connection String Format

```
postgresql+psycopg2://username:password@host:port/database
                                          ^^
                                          "db" inside Docker (service name)
                                          "localhost" outside Docker
```

---

## 5. Database Models

```python
class User(Base):
    __tablename__ = 'users'

    id              = Column(Integer, primary_key=True, index=True)
    username        = Column(String, unique=True, nullable=False)
    name            = Column(String, nullable=True)
    email           = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=True)   # null for SSO users
    is_active       = Column(Boolean, default=False)  # False until email verified
    is_verified     = Column(Boolean, default=False)  # email verification status
    provider        = Column(String, default="local") # local/google/github
    otp_code        = Column(String, nullable=True)   # 6 digit OTP
    otp_expires     = Column(DateTime, nullable=True) # OTP expiry time
    created_at      = Column(DateTime, server_default=func.now())
```

### Who fills each column?

| Column | Who fills it? | Purpose |
|---|---|---|
| `id` | PostgreSQL — auto increment | Unique identifier |
| `username` | User (register form) | Display name / GitHub handle |
| `name` | User or Google/GitHub | Full name |
| `email` | User or Google/GitHub | Login identifier |
| `hashed_password` | Our code (bcrypt) | Never store plain passwords! |
| `is_active` | Our code (True after OTP) | Prevents login before verification |
| `is_verified` | Our code (True after OTP) | Email verification tracking |
| `provider` | Our code on registration | How user signed up |
| `otp_code` | Our code (random 6 digits) | Verification code sent by email |
| `otp_expires` | Our code (now + 10 mins) | OTP becomes invalid after this |
| `created_at` | PostgreSQL (server clock) | Account creation timestamp |

---

## 6. Auth Services

### Password Hashing (services/auth_services.py)

```python
def hash_password(password: str) -> str:
    return bcrypt.hashpw(
        password.encode('utf-8'),   # convert string to bytes
        bcrypt.gensalt()            # random salt for uniqueness
    ).decode('utf-8')               # convert bytes back to string

def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(
        plain.encode('utf-8'),
        hashed.encode('utf-8')
    )
```

> **Note:** bcrypt is intentionally slow to make brute-force attacks expensive. A salt is a random value added before hashing — two identical passwords produce completely different hashes.

### JWT Token Creation

```python
def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=30)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    # jwt.encode does:
    # 1. base64 encode the header + payload
    # 2. sign with SECRET_KEY using HS256
```

### JWT Structure

```
eyJhbGci...   .   eyJzdWIi...   .   7g3Kq...
   header           payload         signature
(algorithm info) (your data)    (proves authenticity)
```

| Part | Description |
|---|---|
| Header | Algorithm info — base64 encoded |
| Payload | Your data (email, expiry) — base64 encoded, **NOT encrypted** |
| Signature | Header + Payload signed with SECRET_KEY |

> **Important:** The JWT payload is NOT encrypted — anyone can decode and read it. Never put sensitive data like passwords inside a JWT.

### JWT Token Decode

```python
def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise Exception("Token has expired")
    except jwt.InvalidTokenError:
        raise Exception("Invalid token") from None
```

---

## 7. SSO Services

### How OAuth2 SSO Works

```
1. User clicks "Continue with Google"
2. Frontend calls GET /auth/google/login
3. Backend returns Google auth URL
4. Frontend redirects user to Google login page
5. User approves your app on Google
6. Google sends user back to /auth/google/callback?code=abc123
7. Backend exchanges code + client_secret for access_token
8. Backend uses access_token to get user's email and name
9. Backend creates/finds user in DB, creates JWT, redirects to frontend
```

### Why Two Steps? (code → access_token → user info)

```
code         → short lived (minutes), safe to send in URL
access_token → longer lived, used for API calls, sent in headers (safer)
```

Google never sends user info directly — you must exchange the code first. This prevents user data from being exposed in URLs.

### Google vs GitHub Differences

| Difference | Google | GitHub |
|---|---|---|
| Token exchange | POST with `data={}` | POST with `json={}` |
| Accept header needed | No | Yes — `Accept: application/json` |
| Email always available | Yes | No — may be private, needs extra API call |
| Username field | email prefix | `login` field (GitHub handle) |
| Provider value | `google` | `github` |
| Scope | `openid email profile` | `user:email` |

### Why GitHub Sometimes Needs Extra Email Call

Some GitHub users set their email as private. When that happens:

```python
# /user endpoint returns:
{"login": "johndoe", "name": "John", "email": null}  ← null!

# So we call /user/emails to get the primary verified email:
for e in emails:
    if e["primary"] and e["verified"]:
        primary_email = e["email"]
        break
```

---

## 8. Routes Reference

### All Routes

| Method | Route | Description | Auth |
|---|---|---|---|
| GET | `/` | Health check | No |
| POST | `/auth/register` | Register with email/password | No |
| POST | `/auth/login` | Login with email/password | No |
| GET | `/auth/me` | Get current user info | Yes |
| GET | `/auth/google/login` | Get Google login URL | No |
| GET | `/auth/google/callback` | Google redirects here with code | No |
| GET | `/auth/github/login` | Get GitHub login URL | No |
| GET | `/auth/github/callback` | GitHub redirects here with code | No |

### How Prefixes Work in main.py

```python
app.include_router(auth.router,       prefix="/auth")
app.include_router(google_sso.router, prefix="/auth/google")
app.include_router(github_sso.router, prefix="/auth/github")
```

```
router prefix    +  route       =  final URL
/auth            +  /register   =  /auth/register
/auth            +  /login      =  /auth/login
/auth            +  /me         =  /auth/me
/auth/google     +  /login      =  /auth/google/login
/auth/google     +  /callback   =  /auth/google/callback
/auth/github     +  /login      =  /auth/github/login
/auth/github     +  /callback   =  /auth/github/callback
```

---

## 9. Docker Setup

### Dockerfile

```dockerfile
FROM python:3.11-slim      # start with Python 3.11 image
WORKDIR /app               # set working directory inside container
COPY requirements.txt .    # copy requirements first (for layer caching)
RUN pip install -r requirements.txt  # install all packages
COPY . .                   # copy all your code
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
```

### docker-compose.yml Services

| Service | Image | Port | Purpose |
|---|---|---|---|
| `db` | postgres:15 | 5432 | PostgreSQL database |
| `backend` | Built from Dockerfile | 8000 | FastAPI server |

### Key Docker Concepts

| Concept | Explanation |
|---|---|
| `WORKDIR /app` | All commands run from /app inside the container |
| `ports: "8000:8000"` | Maps container port to your computer's port |
| `env_file: .env` | Loads all .env variables into the container |
| `volumes: postgres_data` | Persists database data when container restarts |
| `@db` in DATABASE_URI | Inside Docker, containers talk by service name |
| `--build` flag | Forces Docker to rebuild image with latest code |
| `down -v` | Stops containers AND deletes volumes (wipes database) |
| `service_healthy` | Backend waits until Postgres is fully ready |

---

## 10. Request & Response Examples

### POST /auth/register
```json
// Request
{
    "username": "john",
    "name": "John Doe",
    "email": "john@gmail.com",
    "password": "mypassword123"
}

// Response
{
    "message": "User registered successfully",
    "token": "eyJhbGci..."
}
```

### POST /auth/login
```json
// Request
{
    "email": "john@gmail.com",
    "password": "mypassword123"
}

// Response
{
    "message": "User logged in successfully",
    "token": "eyJhbGci..."
}
```

### GET /auth/me
```
// Request
GET /auth/me?token=eyJhbGci...

// Response
{
    "id": 1,
    "username": "john",
    "name": "John Doe",
    "email": "john@gmail.com",
    "is_active": true,
    "provider": "local",
    "created_at": "2026-03-18T10:00:00"
}
```

### GET /auth/google/login
```json
// Response
{
    "url": "https://accounts.google.com/o/oauth2/v2/auth?client_id=...&redirect_uri=...&response_type=code&scope=openid email profile"
}
```

### GET /auth/google/callback (called by Google)
```
// Request from Google
GET /auth/google/callback?code=4/0AX4XfWi...

// Response
Redirects → http://localhost:3000/auth/callback?token=eyJhbGci...
```

---

## 11. Error Responses

| Status Code | When | Example |
|---|---|---|
| `400` | Email already registered, bad request | `"Email already registered"` |
| `401` | Wrong password, invalid/expired token | `"Invalid credentials"` |
| `404` | User doesn't exist | `"User not found"` |
| `422` | Missing/wrong data types | `"field required"` (Pydantic) |
| `500` | Unexpected server error | `"Internal server error"` |

---

## 12. Key Concepts

| Concept | Simple explanation |
|---|---|
| **JWT** | A signed string containing user's email and expiry. Frontend stores it and sends it with every request to prove identity. |
| **bcrypt** | One-way password hashing. You can verify a password against its hash but cannot reverse it. |
| **OAuth2** | Standard SSO protocol. Uses temporary codes and tokens — never shares passwords. |
| **SQLAlchemy ORM** | Like Prisma for Python. `db.query(User)` = `SELECT * FROM users`. |
| **FastAPI Depends** | Dependency injection. `Depends(get_db)` tells FastAPI to call `get_db()` before the route. |
| **yield in get_db()** | Like a JavaScript generator. Pauses after giving db session, resumes to close it. |
| **CORS Middleware** | Allows React (port 3000) to call FastAPI (port 8000). Browsers block cross-origin by default. |
| **APIRouter** | Splits routes into separate files. Each router gets a prefix in main.py. |
| **Pydantic BaseModel** | Validates incoming data automatically. Missing fields → 422 error before your code runs. |
| **async/await** | Non-blocking code. While waiting for Google API, server handles other requests. |

---

## 13. Running the Project

### Start everything:
```bash
cd auth-saas
docker compose up --build
```

### After making code changes:
```bash
docker compose up --build
```

### Wipe database and start fresh:
```bash
docker compose down -v
docker compose up --build
```

### View logs:
```bash
docker compose logs backend   # backend logs only
docker compose logs db        # postgres logs only
```

### Test the API:

| URL | What you see |
|---|---|
| `http://localhost:8000` | `{"message": "API is running"}` |
| `http://localhost:8000/docs` | Interactive Swagger UI — test all routes |
| `http://localhost:8000/redoc` | Alternative API documentation |

---

*auth-saas backend — FastAPI + PostgreSQL + Docker*
