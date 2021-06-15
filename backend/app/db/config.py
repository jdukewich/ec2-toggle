from app.db.dynamo_adapter import DynamoDBExtraDatabase, DynamoDBUserDatabase
from app.models.user import UserDB
from app.settings.config import settings

user_db = DynamoDBUserDatabase(
    UserDB,
    settings.DDB_CONFIG,
    settings.DDB_USERS_TABLE,
    "email"
)

instance_db = DynamoDBExtraDatabase(
    settings.DDB_CONFIG,
    settings.DDB_INSTANCES_TABLE,
)
