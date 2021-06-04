import os
from typing import List, Mapping

from pydantic import BaseSettings


class Settings(BaseSettings):
    CORS_ORIGINS: List[str] = os.environ.get("CORS_ORIGINS", ["http://localhost", "http://localhost:4200"])
    SUPERUSERS: List[str] = os.environ.get("SUPERUSERS", [])
    COOKIE_SECRET: str = os.environ.get("COOKIE_SECRET", "SECRET")
    DDB_URL: str = os.environ.get("DDB_URL")
    DDB_USERS_TABLE: str = os.environ.get("DDB_USERS_TABLE", "users")
    DDB_INSTANCES_TABLE: str = os.environ.get("DDB_INSTANCES_TABLE", "instances")
    DDB_USERS_EMAIL_INDEX: str = os.environ.get("DDB_USERS_EMAIL_INDEX", "email")
    DDB_CONFIG: Mapping[str, str] = {"endpoint_url": DDB_URL} if DDB_URL else {}


settings = Settings()
