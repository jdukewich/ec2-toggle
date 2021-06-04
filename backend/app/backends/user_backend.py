from fastapi_users import FastAPIUsers

from app.backends.cookie_auth import cookie_auth
from app.db.config import user_db
from app.models.user import User, UserCreate, UserDB, UserUpdate

fastapi_users = FastAPIUsers(
    user_db,
    [cookie_auth],
    User,
    UserCreate,
    UserUpdate,
    UserDB,
)
