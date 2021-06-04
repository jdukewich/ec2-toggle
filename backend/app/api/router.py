from fastapi import APIRouter

from app.api import ec2

api_router = APIRouter()
api_router.include_router(ec2.router, tags=["ec2"])
