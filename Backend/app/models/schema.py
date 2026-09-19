from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class EmailVerificationSchema(BaseModel):
    email: EmailStr
    token: str


class EmailSchema(BaseModel):
    email: EmailStr


class PredictionHistory(BaseModel):
    id: int = Field(alias="_id")
    user_id: int
    disease: str
    confidence: float
    image_url: str
    timestamp: Optional[datetime] = None

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
