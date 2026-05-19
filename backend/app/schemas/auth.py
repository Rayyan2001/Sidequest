"""
schemas/auth.py — request/response schemas for auth endpoints.
"""
from pydantic import BaseModel, EmailStr, Field, field_validator


class SocialLoginRequest(BaseModel):
    provider: str = Field(..., pattern="^(google|facebook)$")
    token: str = Field(..., min_length=10)


class EmailSignUpRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=200)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)


class EmailSignInRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1)


class RefreshTokenRequest(BaseModel):
    refresh_token: str = Field(..., min_length=10)


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int  # seconds


class LogoutRequest(BaseModel):
    refresh_token: str
