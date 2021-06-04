from app.db.dynamo_adapter import DynamoDBExtraDatabase, DynamoDBUserDatabase
from app.models.user import UserDB
from app.settings.config import settings

user_db = DynamoDBUserDatabase(
    UserDB,
    {"endpoint_url": settings.DDB_URL},
    settings.DDB_USERS_TABLE,
    settings.DDB_USERS_EMAIL_INDEX,
)

instance_db = DynamoDBExtraDatabase(
    {"endpoint_url": settings.DDB_URL},
    settings.DDB_INSTANCES_TABLE,
)
