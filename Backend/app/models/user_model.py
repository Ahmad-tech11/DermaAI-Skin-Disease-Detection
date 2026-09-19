import os
from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.database import Database

client = AsyncIOMotorClient(os.getenv("MONGO_URI"))
db = client.get_database("derma_ai")


def get_db() -> Database:
    return db


class UserDB(BaseModel):
    id: int = Field(alias="_id")
    full_name: str
    email: EmailStr
    password: str
    is_verified: bool = False
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
