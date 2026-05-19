"""
db/repositories/user_repository.py — all User + Session DB access.
"""
from datetime import datetime, timezone
from uuid import UUID

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.db.models.user import User, Session
from app.db.repositories.base import BaseRepository


class UserRepository(BaseRepository[User]):
    def __init__(self, db: AsyncSession) -> None:
        super().__init__(User, db)

    async def get_by_email(self, email: str) -> User | None:
        result = await self.db.execute(
            select(User).where(User.email == email.lower())
        )
        return result.scalar_one_or_none()

    async def get_by_provider(self, provider: str, provider_id: str) -> User | None:
        result = await self.db.execute(
            select(User).where(
                User.provider == provider,
                User.provider_id == provider_id,
            )
        )
        return result.scalar_one_or_none()

    async def get_with_profile(self, user_id: UUID) -> User | None:
        result = await self.db.execute(
            select(User)
            .options(selectinload(User.profile), selectinload(User.settings))
            .where(User.id == user_id)
        )
        return result.scalar_one_or_none()

    async def email_exists(self, email: str) -> bool:
        result = await self.db.execute(
            select(User.id).where(User.email == email.lower())
        )
        return result.scalar_one_or_none() is not None


class SessionRepository(BaseRepository[Session]):
    def __init__(self, db: AsyncSession) -> None:
        super().__init__(Session, db)

    async def get_by_refresh_token(self, token: str) -> Session | None:
        result = await self.db.execute(
            select(Session).where(
                Session.refresh_token == token,
                Session.is_revoked == False,  # noqa: E712
                Session.expires_at > datetime.now(timezone.utc),
            )
        )
        return result.scalar_one_or_none()

    async def revoke_token(self, token: str) -> None:
        await self.db.execute(
            update(Session)
            .where(Session.refresh_token == token)
            .values(is_revoked=True)
        )

    async def revoke_all_for_user(self, user_id: UUID) -> None:
        await self.db.execute(
            update(Session)
            .where(Session.user_id == user_id)
            .values(is_revoked=True)
        )

    async def delete_expired(self) -> int:
        from sqlalchemy import delete
        result = await self.db.execute(
            delete(Session).where(Session.expires_at < datetime.now(timezone.utc))
        )
        return result.rowcount
