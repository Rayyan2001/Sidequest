"""
db/repositories/activity_repository.py
"""
from uuid import UUID
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models.activity import Activity
from app.db.repositories.base import BaseRepository


class ActivityRepository(BaseRepository[Activity]):
    def __init__(self, db: AsyncSession) -> None:
        super().__init__(Activity, db)

    async def get_for_user(
        self, user_id: UUID, *, limit: int = 50, offset: int = 0
    ) -> list[Activity]:
        result = await self.db.execute(
            select(Activity)
            .where(Activity.user_id == user_id)
            .order_by(Activity.created_at.desc())
            .limit(limit).offset(offset)
        )
        return list(result.scalars().all())

    async def get_by_id_for_user(self, activity_id: UUID, user_id: UUID) -> Activity | None:
        result = await self.db.execute(
            select(Activity).where(
                Activity.id == activity_id,
                Activity.user_id == user_id,
            )
        )
        return result.scalar_one_or_none()

    async def count_for_user(self, user_id: UUID) -> int:
        result = await self.db.execute(
            select(func.count(Activity.id)).where(Activity.user_id == user_id)
        )
        return result.scalar_one()


# ─── Notification ─────────────────────────────────────────────────────────────

from app.db.models.notification import Notification
from sqlalchemy import update


class NotificationRepository(BaseRepository[Notification]):
    def __init__(self, db: AsyncSession) -> None:
        super().__init__(Notification, db)

    async def get_for_user(
        self, user_id: UUID, *, unread_only: bool = False, limit: int = 50
    ) -> list[Notification]:
        query = select(Notification).where(Notification.user_id == user_id)
        if unread_only:
            query = query.where(Notification.is_read == False)  # noqa: E712
        query = query.order_by(Notification.created_at.desc()).limit(limit)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def mark_all_read(self, user_id: UUID) -> None:
        await self.db.execute(
            update(Notification)
            .where(Notification.user_id == user_id, Notification.is_read == False)  # noqa: E712
            .values(is_read=True)
        )
