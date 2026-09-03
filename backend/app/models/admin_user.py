from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class AdminLoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    admin_name: str
    admin_email: str

class AdminUserResponse(BaseModel):
    id: str
    email: str
    name: str
    created_at: Optional[datetime] = None
