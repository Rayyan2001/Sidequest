"""
db/repositories/profile_repository.py
"""
from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models.profile import Profile, UserSetting
from app.db.repositories.base import BaseRepository


class ProfileRepository(BaseRepository[Profile]):
    def __init__(self, db: AsyncSession) -> None:
        super().__init__(Profile, db)

    async def get_by_user_id(self, user_id: UUID) -> Profile | None:
        result = await self.db.execute(
            select(Profile).where(Profile.user_id == user_id)
        )
        return result.scalar_one_or_none()


class UserSettingRepository(BaseRepository[UserSetting]):
    def __init__(self, db: AsyncSession) -> None:
        super().__init__(UserSetting, db)

    async def get_by_user_and_key(self, user_id: UUID, key: str) -> UserSetting | None:
        result = await self.db.execute(
            select(UserSetting).where(
                UserSetting.user_id == user_id,
                UserSetting.key == key,
            )
        )
        return result.scalar_one_or_none()

    async def get_all_for_user(self, user_id: UUID) -> list[UserSetting]:
        result = await self.db.execute(
            select(UserSetting).where(UserSetting.user_id == user_id)
        )
        return list(result.scalars().all())

    async def upsert(self, user_id: UUID, key: str, value: str) -> UserSetting:
        existing = await self.get_by_user_and_key(user_id, key)
        if existing:
            existing.value = value
            await self.db.flush()
            return existing
        setting = UserSetting(user_id=user_id, key=key, value=value)
        return await self.create(setting)
