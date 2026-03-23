import httpx
from config import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET

async def get_google_auth_url() -> str:
    params = (
        f"client_id={GOOGLE_CLIENT_ID}"
        "&redirect_uri=http://localhost:8000/auth/google/callback"
        "&response_type=code"
        "&scope=openid email profile"
    )
    return f"https://accounts.google.com/o/oauth2/v2/auth?{params}"

async def get_google_user(code: str) -> dict:
    # Step 1 - exchange code for access token
    async with httpx.AsyncClient() as client:
        token_response = await client.post(
            "https://oauth2.googleapis.com/token",
            data={
                "code": code,
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "redirect_uri": "http://localhost:8000/auth/google/callback",
                "grant_type": "authorization_code",
            }
        )
    token_data = token_response.json()
    access_token = token_data["access_token"]

    # Step 2 - use access token to get user info
    async with httpx.AsyncClient() as client:
        user_response = await client.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            headers={"Authorization": f"Bearer {access_token}"}
        )
    return user_response.json()
    # returns → {"email": "john@gmail.com", "name": "John", "picture": "..."}
    