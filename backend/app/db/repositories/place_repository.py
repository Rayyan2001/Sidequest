"""
db/repositories/place_repository.py
"""
from uuid import UUID
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models.place import Place, SavedPlace
from app.db.repositories.base import BaseRepository


class PlaceRepository(BaseRepository[Place]):
    def __init__(self, db: AsyncSession) -> None:
        super().__init__(Place, db)

    async def get_active(self, *, limit: int = 50, offset: int = 0) -> list[Place]:
        result = await self.db.execute(
            select(Place).where(Place.is_active == True)  # noqa: E712
            .order_by(Place.name).limit(limit).offset(offset)
        )
        return list(result.scalars().all())


class SavedPlaceRepository(BaseRepository[SavedPlace]):
    def __init__(self, db: AsyncSession) -> None:
        super().__init__(SavedPlace, db)

    async def get_for_user(self, user_id: UUID) -> list[SavedPlace]:
        result = await self.db.execute(
            select(SavedPlace).where(SavedPlace.user_id == user_id)
        )
        return list(result.scalars().all())

    async def is_saved(self, user_id: UUID, place_id: UUID) -> bool:
        result = await self.db.execute(
            select(SavedPlace.id).where(
                SavedPlace.user_id == user_id,
                SavedPlace.place_id == place_id,
            )
        )
        return result.scalar_one_or_none() is not None

    async def toggle(self, user_id: UUID, place_id: UUID) -> bool:
        """Returns True if saved, False if unsaved."""
        existing = await self.db.execute(
            select(SavedPlace).where(
                SavedPlace.user_id == user_id,
                SavedPlace.place_id == place_id,
            )
        )
        row = existing.scalar_one_or_none()
        if row:
            await self.db.delete(row)
            return False
        saved = SavedPlace(user_id=user_id, place_id=place_id)
        self.db.add(saved)
        return True
