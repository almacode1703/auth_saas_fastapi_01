# Auth Routes Reference

## Complete Route List

### Auth Routes
| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/auth/register` | Register new user with email/password |
| `POST` | `/auth/login` | Login with email/password |
| `GET` | `/auth/me` | Get current logged in user info |

### Google SSO Routes
| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/auth/google/login` | Get Google login URL |
| `GET` | `/auth/google/callback` | Google sends user back here with code |

### GitHub SSO Routes
| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/auth/github/login` | Get GitHub login URL |
| `GET` | `/auth/github/callback` | GitHub sends user back here with code |

---

## How Prefixes Work

```
router prefix    +    route       =    final URL
─────────────────────────────────────────────────────
/auth            +  /register     =  /auth/register
/auth            +  /login        =  /auth/login
/auth            +  /me           =  /auth/me

/auth/google     +  /login        =  /auth/google/login
/auth/google     +  /callback     =  /auth/google/callback

/auth/github     +  /login        =  /auth/github/login
/auth/github     +  /callback     =  /auth/github/callback
```

---

## Request & Response Examples

### POST /auth/register
**Request:**
```json
{
    "username": "john",
    "name": "John Doe",
    "email": "john@gmail.com",
    "password": "mypassword123"
}
```
**Response:**
```json
{
    "message": "User registered successfully",
    "token": "eyJhbGci..."
}
```

---

### POST /auth/login
**Request:**
```json
{
    "email": "john@gmail.com",
    "password": "mypassword123"
}
```
**Response:**
```json
{
    "message": "User logged in successfully",
    "token": "eyJhbGci..."
}
```

---

### GET /auth/me
**Request:**
```
GET /auth/me?token=eyJhbGci...
```
**Response:**
```json
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

---

### GET /auth/google/login
**Request:**
```
GET /auth/google/login
```
**Response:**
```json
{
    "url": "https://accounts.google.com/o/oauth2/v2/auth?client_id=...&redirect_uri=...&response_type=code&scope=openid email profile"
}
```

---

### GET /auth/google/callback
**Request:**
```
GET /auth/google/callback?code=4/0AX4XfWi...
```
**Response:**
```
Redirects to → http://localhost:3000/auth/callback?token=eyJhbGci...
```

---

### GET /auth/github/login
**Request:**
```
GET /auth/github/login
```
**Response:**
```json
{
    "url": "https://github.com/login/oauth/authorize?client_id=...&redirect_uri=...&scope=user:email"
}
```

---

### GET /auth/github/callback
**Request:**
```
GET /auth/github/callback?code=abc123...
```
**Response:**
```
Redirects to → http://localhost:3000/auth/callback?token=eyJhbGci...
```

---

## Provider Values

| How user signed up | `provider` value in database |
|---|---|
| Email/password | `local` |
| Google SSO | `google` |
| GitHub SSO | `github` |

---

## Error Responses

| Status Code | Meaning |
|---|---|
| `400` | Bad request (email already registered, missing data) |
| `401` | Unauthorized (wrong password, invalid/expired token) |
| `404` | Not found (user doesn't exist) |
