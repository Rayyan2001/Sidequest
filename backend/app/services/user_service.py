"""
services/user_service.py — user/profile business logic.
"""
from uuid import UUID
from app.core.exceptions import NotFoundException
from app.db.repositories.user_repository import UserRepository
from app.db.repositories.profile_repository import ProfileRepository, UserSettingRepository
from app.schemas.schemas import MeResponse, UserOut, ProfileOut, UpdateProfileRequest


class UserService:
    def __init__(
        self,
        user_repo: UserRepository,
        profile_repo: ProfileRepository,
        setting_repo: UserSettingRepository,
    ) -> None:
        self._users = user_repo
        self._profiles = profile_repo
        self._settings = setting_repo

    async def get_me(self, user_id: UUID) -> MeResponse:
        user = await self._users.get_with_profile(user_id)
        if not user:
            raise NotFoundException("User not found")
        return MeResponse(
            user=UserOut.model_validate(user),
            profile=ProfileOut.model_validate(user.profile) if user.profile else None,
        )

    async def update_profile(self, user_id: UUID, data: UpdateProfileRequest) -> ProfileOut:
        profile = await self._profiles.get_by_user_id(user_id)
        if not profile:
            raise NotFoundException("Profile not found")

        updates = data.model_dump(exclude_none=True)

        # Update user name separately if provided
        if "name" in updates:
            await self._users.update(user_id, {"name": updates.pop("name")})

        if updates:
            await self._profiles.update(profile.id, updates)

        updated = await self._profiles.get_by_user_id(user_id)
        return ProfileOut.model_validate(updated)

    async def upsert_setting(self, user_id: UUID, key: str, value: str) -> dict:
        await self._settings.upsert(user_id, key, value)
        return {"key": key, "value": value}

    async def get_settings(self, user_id: UUID) -> dict[str, str]:
        settings = await self._settings.get_all_for_user(user_id)
        return {s.key: s.value for s in settings}
