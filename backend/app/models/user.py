from typing import List, Optional

from fastapi_users import models


class User(models.BaseUser):
    instances: Optional[List[str]] = []

    def create_update_dict(self):
        """We don't want users to be able to edit their instances"""
        return self.dict(
            exclude_unset=True,
            exclude={
                "id",
                "is_superuser",
                "is_active",
                "is_verified",
                "oauth_accounts",
                "instances",
            },
        )


class UserCreate(User, models.BaseUserCreate):
    pass


class UserUpdate(User, models.BaseUserUpdate):
    pass


class UserDB(User, models.BaseUserDB):
    pass
