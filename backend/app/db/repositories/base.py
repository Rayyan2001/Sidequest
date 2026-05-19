"""
db/repositories/base.py — generic async repository.
All repositories extend this; no direct DB calls outside repos.
"""
from typing import Any, Generic, TypeVar
from uuid import UUID

from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import Base

ModelType = TypeVar("ModelType", bound=Base)


class BaseRepository(Generic[ModelType]):
    def __init__(self, model: type[ModelType], db: AsyncSession) -> None:
        self.model = model
        self.db = db

    async def get_by_id(self, id: UUID) -> ModelType | None:
        result = await self.db.execute(select(self.model).where(self.model.id == id))
        return result.scalar_one_or_none()

    async def get_all(self, *, limit: int = 100, offset: int = 0) -> list[ModelType]:
        result = await self.db.execute(
            select(self.model).limit(limit).offset(offset)
        )
        return list(result.scalars().all())

    async def create(self, obj: ModelType) -> ModelType:
        self.db.add(obj)
        await self.db.flush()
        await self.db.refresh(obj)
        return obj

    async def update(self, id: UUID, data: dict[str, Any]) -> ModelType | None:
        await self.db.execute(
            update(self.model).where(self.model.id == id).values(**data)
        )
        return await self.get_by_id(id)

    async def delete(self, id: UUID) -> bool:
        result = await self.db.execute(
            delete(self.model).where(self.model.id == id)
        )
        return result.rowcount > 0
