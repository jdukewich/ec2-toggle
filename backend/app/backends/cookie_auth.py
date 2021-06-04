from fastapi_users.authentication import CookieAuthentication

from app.settings.config import settings

cookie_auth = CookieAuthentication(
    secret=settings.COOKIE_SECRET, lifetime_seconds=3600, cookie_secure=True, cookie_httponly=False
)
