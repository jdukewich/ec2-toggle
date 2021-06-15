from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum

from app.api.router import api_router
from app.backends.cookie_auth import cookie_auth
from app.backends.user_backend import fastapi_users
from app.settings.config import settings

app = FastAPI()

app.include_router(
    fastapi_users.get_users_router(),
    prefix="/api/users",
    tags=["users"],
)

app.include_router(
    fastapi_users.get_auth_router(cookie_auth),
    prefix="/api",
    tags=["auth"],
)

app.include_router(
    fastapi_users.get_register_router(),
    prefix="/api",
    tags=["auth"],
)

# TODO: add in functionality for this, requires emailing
# app.include_router(
#     fastapi_users.get_reset_password_router("SECRET"),
#     prefix="",
#     tags=["auth"],
# )

# app.include_router(
#     fastapi_users.get_verify_router("SECRET"),
#     prefix="",
#     tags=["auth"],
# )

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

handler = Mangum(app, log_level='debug')
