"""
api/v1/users/router.py — user/profile controller.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.db.models.user import User
from app.db.repositories.user_repository import UserRepository
from app.db.repositories.profile_repository import ProfileRepository, UserSettingRepository
from app.middleware.auth import get_current_user
from app.schemas.schemas import (
    MeResponse, ProfileOut, UpdateProfileRequest, UpdateSettingRequest, MessageResponse
)
from app.services.user_service import UserService

router = APIRouter(prefix="/users", tags=["Users"])


def _build_service(db: AsyncSession) -> UserService:
    return UserService(
        user_repo=UserRepository(db),
        profile_repo=ProfileRepository(db),
        setting_repo=UserSettingRepository(db),
    )


@router.get("/me", response_model=MeResponse)
async def get_me(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Return authenticated user + profile."""
    service = _build_service(db)
    return await service.get_me(current_user.id)


@router.put("/update-profile", response_model=ProfileOut)
async def update_profile(
    body: UpdateProfileRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update user name, avatar, bio, preferences."""
    service = _build_service(db)
    return await service.update_profile(current_user.id, body)


@router.get("/settings")
async def get_settings(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Return all user settings as key-value dict."""
    service = _build_service(db)
    return await service.get_settings(current_user.id)


@router.put("/settings", response_model=MessageResponse)
async def upsert_setting(
    body: UpdateSettingRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create or update a single setting."""
    service = _build_service(db)
    await service.upsert_setting(current_user.id, body.key, body.value)
    return MessageResponse(message="Setting updated")
