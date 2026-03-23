import httpx
from config import GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET

def get_github_auth_url() -> str:
    params = (
        f"client_id={GITHUB_CLIENT_ID}"
        "&redirect_uri=http://localhost:8000/auth/github/callback"
        "&scope=user:email"
    )
    return f"https://github.com/login/oauth/authorize?{params}"

async def get_github_user(code: str) -> dict:
    # Step 1 - exchange code for access token
    async with httpx.AsyncClient() as client:
        token_response = await client.post(
            "https://github.com/login/oauth/access_token",
            json={
                "code": code,
                "client_id": GITHUB_CLIENT_ID,
                "client_secret": GITHUB_CLIENT_SECRET,
                "redirect_uri": "http://localhost:8000/auth/github/callback",
            },
            headers={"Accept": "application/json"}
        )
    token_data = token_response.json()
    access_token = token_data["access_token"]

    # Step 2 - use access token to get user info
    async with httpx.AsyncClient() as client:
        user_response = await client.get(
            "https://api.github.com/user",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/json"
            }
        )
    github_user = user_response.json()

    # Step 3 - get email if hidden
    if not github_user.get("email"):
        async with httpx.AsyncClient() as client:
            email_response = await client.get(
                "https://api.github.com/user/emails",
                headers={
                    "Authorization": f"Bearer {access_token}",
                    "Accept": "application/json"
                }
            )
        emails = email_response.json()
        primary_email = None
        for e in emails:
            if e["primary"] and e["verified"]:
                primary_email = e["email"]
                break
        github_user["email"] = primary_email

    return github_user