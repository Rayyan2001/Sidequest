"""
middleware/auth.py — FastAPI dependencies for JWT authentication.
"""
from uuid import UUID

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.exceptions import UnauthorizedException
from app.core.security import decode_access_token
from app.db.database import get_db, AsyncSession
from app.db.repositories.user_repository import UserRepository
from app.db.models.user import User

bearer_scheme = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    if not credentials:
        raise UnauthorizedException("No authentication token provided")

    payload = decode_access_token(credentials.credentials)
    user_id = UUID(payload["sub"])

    user_repo = UserRepository(db)
    user = await user_repo.get_by_id(user_id)
    if not user or not user.is_active:
        raise UnauthorizedException("User not found or deactivated")

    return user


# Alias for readability in route signatures
CurrentUser = Depends(get_current_user)
