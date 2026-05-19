"""
db/repositories/quest_repository.py
"""
from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.db.models.quest import Quest, QuestStep
from app.db.repositories.base import BaseRepository


class QuestRepository(BaseRepository[Quest]):
    def __init__(self, db: AsyncSession) -> None:
        super().__init__(Quest, db)

    async def get_active(self, *, limit: int = 50, offset: int = 0) -> list[Quest]:
        result = await self.db.execute(
            select(Quest)
            .where(Quest.is_active == True)  # noqa: E712
            .options(selectinload(Quest.steps))
            .order_by(Quest.sort_order, Quest.created_at)
            .limit(limit).offset(offset)
        )
        return list(result.scalars().all())

    async def get_with_steps(self, quest_id: UUID) -> Quest | None:
        result = await self.db.execute(
            select(Quest)
            .options(selectinload(Quest.steps))
            .where(Quest.id == quest_id)
        )
        return result.scalar_one_or_none()

    async def get_by_category(self, category: str) -> list[Quest]:
        result = await self.db.execute(
            select(Quest)
            .where(Quest.category == category, Quest.is_active == True)  # noqa: E712
            .options(selectinload(Quest.steps))
            .order_by(Quest.sort_order)
        )
        return list(result.scalars().all())
