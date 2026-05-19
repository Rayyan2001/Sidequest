"""
core/security.py — JWT creation/verification, password hashing.
No business logic here; pure cryptographic utilities.
"""
from datetime import datetime, timedelta, timezone
from typing import Any
from uuid import UUID

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings
from app.core.exceptions import UnauthorizedException

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ─── Password ────────────────────────────────────────────────────────────────

def hash_password(plain: str) -> str:
    return pwd_context.hash(plain)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


# ─── JWT ─────────────────────────────────────────────────────────────────────

def _create_token(data: dict[str, Any], expires_delta: timedelta) -> str:
    payload = data.copy()
    payload["exp"] = datetime.now(timezone.utc) + expires_delta
    payload["iat"] = datetime.now(timezone.utc)
    return jwt.encode(payload, settings.secret_key, algorithm=settings.jwt_algorithm)


def create_access_token(user_id: UUID) -> str:
    return _create_token(
        data={"sub": str(user_id), "type": "access"},
        expires_delta=timedelta(minutes=settings.access_token_expire_minutes),
    )


def create_refresh_token(user_id: UUID) -> str:
    return _create_token(
        data={"sub": str(user_id), "type": "refresh"},
        expires_delta=timedelta(days=settings.refresh_token_expire_days),
    )


def decode_access_token(token: str) -> dict[str, Any]:
    try:
        payload = jwt.decode(
            token, settings.secret_key, algorithms=[settings.jwt_algorithm]
        )
        if payload.get("type") != "access":
            raise UnauthorizedException("Invalid token type")
        return payload
    except JWTError:
        raise UnauthorizedException("Invalid or expired token")


def decode_refresh_token(token: str) -> dict[str, Any]:
    try:
        payload = jwt.decode(
            token, settings.secret_key, algorithms=[settings.jwt_algorithm]
        )
        if payload.get("type") != "refresh":
            raise UnauthorizedException("Invalid token type")
        return payload
    except JWTError:
        raise UnauthorizedException("Invalid or expired refresh token")
