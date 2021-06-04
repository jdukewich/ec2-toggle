import boto3
from fastapi import APIRouter, Depends

from app.backends.user_backend import fastapi_users
from app.db.config import instance_db, user_db
from app.models.instance import Instance
from app.models.user import User

router = APIRouter()


@router.get("/users")
async def get_users(user: User = Depends(fastapi_users.get_current_superuser)):
    """Get all users, only send over id, email, and instances"""
    users = await user_db.get_all()
    filtered_users = [
        {key: val for key, val in user.items() if key in ["id", "email", "instances"]}
        for user in users
    ]
    return filtered_users


@router.get("/instances")
async def get_instances(user: User = Depends(fastapi_users.get_current_superuser)):
    """Get a list of all the EC2 instances in the database"""
    return await instance_db.get_all()


@router.post("/instances")
async def add_instances(
    instance: Instance, user: User = Depends(fastapi_users.get_current_superuser)
):
    """Add EC2 instance(s)"""
    return await instance_db.create(instance)


@router.get("/my-instances")
async def my_instances(user: User = Depends(fastapi_users.get_current_user)):
    """Return all the EC2 instances (and statuses) a user has access to toggle"""
    ec2 = boto3.resource("ec2")
    resp = []
    for id in user.instances:
        instance = ec2.Instance(id)
        resp.append((id, instance.state["Name"]))
    return resp


@router.post("/my-instances")
async def toggle(
    instance: Instance, user: User = Depends(fastapi_users.get_current_user)
):
    """Toggles an EC2 instance based on the instance ID"""
    ec2 = boto3.resource("ec2")
    server = ec2.Instance(instance.id)
    state = server.state["Name"]

    if state == "running":
        # Turn the instance off, and wait until it's stopped
        server.stop()
        server.wait_until_stopped(
            Filters=[
                {
                    "Name": "instance-id",
                    "Values": [
                        instance.id,
                    ],
                },
            ]
        )
    elif state == "stopped":
        # Turn the instance on, and wait until it's running
        server.start()
        server.wait_until_running(
            Filters=[
                {
                    "Name": "instance-id",
                    "Values": [
                        instance.id,
                    ],
                },
            ]
        )

    # I hope none of these states are ever reached, but we should handle them
    elif state == "pending":
        pass
    elif state == "shutting-down":
        pass
    elif state == "terminated":
        pass
    elif state == "stopping":
        pass
    else:
        # Uh oh, something must've gone wrong, please check it out
        pass
    return
