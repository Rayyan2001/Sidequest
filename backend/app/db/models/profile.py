"""
db/models/profile.py — Profiles + UserSettings tables.
"""
import uuid
from typing import Any, TYPE_CHECKING

from sqlalchemy import ForeignKey, Index, String, Text
from sqlalchemy.dialects.postgresql import JSON, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base
from app.db.models.base import TimestampMixin, new_uuid

if TYPE_CHECKING:
    from app.db.models.user import User


class Profile(TimestampMixin, Base):
    __tablename__ = "profiles"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=new_uuid)
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"),
        unique=True, nullable=False
    )
    avatar_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    bio: Mapped[str | None] = mapped_column(Text, nullable=True)
    member_since: Mapped[str | None] = mapped_column(String(20), nullable=True)
    quests_completed: Mapped[int] = mapped_column(default=0, nullable=False)
    co2_saved_kg: Mapped[float] = mapped_column(default=0.0, nullable=False)
    badges_earned: Mapped[int] = mapped_column(default=0, nullable=False)
    balance_pence: Mapped[int] = mapped_column(default=0, nullable=False, comment="GBP pence")
    green_credits: Mapped[int] = mapped_column(default=0, nullable=False)
    # Flexible preferences blob (notification prefs, privacy prefs, etc.)
    preferences: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)

    user: Mapped["User"] = relationship(back_populates="profile")

    __table_args__ = (
        Index("ix_profiles_user_id", "user_id"),
    )


class UserSetting(TimestampMixin, Base):
    """
    Key-value settings per user.
    Examples: language, darkMode, locationEnabled
    """
    __tablename__ = "user_settings"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=new_uuid)
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    key: Mapped[str] = mapped_column(String(100), nullable=False)
    value: Mapped[str] = mapped_column(Text, nullable=False)

    user: Mapped["User"] = relationship(back_populates="settings")

    __table_args__ = (
        Index("ix_user_settings_user_id_key", "user_id", "key", unique=True),
    )
